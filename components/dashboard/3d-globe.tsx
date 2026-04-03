'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Subject } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDashboardStore } from '@/lib/store'

interface GlobeTooltip {
  visible: boolean
  subject: Subject | null
  position: [number, number, number]
}

// Continent mapping to subjects
const continentMapping: Record<string, { name: string; subjectId: string; position: { lat: number; lon: number } }> = {
  north_america: { name: 'Data Structures', subjectId: '2', position: { lat: 45, lon: -100 } },
  south_america: { name: 'Mathematics', subjectId: '6', position: { lat: -15, lon: -60 } },
  europe: { name: 'DBMS', subjectId: '1', position: { lat: 50, lon: 10 } },
  africa: { name: 'Machine Learning', subjectId: '5', position: { lat: 0, lon: 20 } },
  asia: { name: 'Operating Systems', subjectId: '3', position: { lat: 30, lon: 100 } },
  oceania: { name: 'Computer Networks', subjectId: '4', position: { lat: -25, lon: 135 } },
}

interface ContinentProps {
  name: string
  subject: Subject
  position: { lat: number; lon: number }
  onHover: (subject: Subject | null, position: [number, number, number]) => void
  isRotating: boolean
  setIsRotating: (rotating: boolean) => void
}

function Continent({ name, subject, position, onHover, isRotating, setIsRotating }: ContinentProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Get color based on score
  const getColorFromScore = (score: number): THREE.Color => {
    if (score < 35) return new THREE.Color('#ef4444') // Red
    if (score < 75) return new THREE.Color('#f59e0b') // Yellow
    return new THREE.Color('#22c55e') // Green
  }

  // Convert lat/lon to 3D position on sphere
  const lat = (position.lat * Math.PI) / 180
  const lon = (position.lon * Math.PI) / 180
  const x = Math.cos(lat) * Math.cos(lon) * 2
  const y = Math.sin(lat) * 2
  const z = Math.cos(lat) * Math.sin(lon) * 2

  const color = getColorFromScore(subject.marks)

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.1)
      meshRef.current.material.emissiveIntensity = 0.8
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      meshRef.current.material.emissiveIntensity = 0.3
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      onPointerEnter={() => {
        setHovered(true)
        setIsRotating(false)
        onHover(subject, [x, y, z])
      }}
      onPointerLeave={() => {
        setHovered(false)
        setIsRotating(true)
        onHover(null, [x, y, z])
      }}
      scale={[1, 1, 1]}
    >
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.3}
        roughness={0.4}
        wireframe={false}
      />

      {/* Data Arc - shoots out from continent showing concentration */}
      {subject.revisionConfidence > 0 && (
        <group>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.05, 0.02, 1, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={(subject.revisionConfidence / 100) * 0.8}
            />
          </mesh>
        </group>
      )}

      {/* Pulse effect for low performance */}
      {subject.marks < 35 && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
            wireframe={true}
          />
        </mesh>
      )}
    </mesh>
  )
}

interface GlobeProps {
  subjects: Subject[]
}

function GlobeScene({ subjects }: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [tooltip, setTooltip] = useState<GlobeTooltip>({ visible: false, subject: null, position: [0, 0, 0] })
  const [isRotating, setIsRotating] = useState(true)
  const { setCurrentView, setActiveClass } = useDashboardStore()

  useFrame(() => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += 0.0005
    }
  })

  const handleJumpToMastery = (subjectId: string) => {
    // Find the class path for this subject
    setCurrentView('class-path')
    setTooltip({ visible: false, subject: null, position: [0, 0, 0] })
  }

  return (
    <>
      {/* Background environment */}
      <Environment preset="night" />
      <color attach="background" args={['#0a192f']} />

      {/* Ambient & Directional Lighting */}
      <ambientLight intensity={0.6} color="#60a5fa" />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3b82f6" />

      {/* Animated Group for all continents */}
      <group ref={groupRef}>
        {/* Base sphere (Earth) */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            color="#1e3a8a"
            emissive="#0c2d57"
            emissiveIntensity={0.3}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Continents */}
        {Object.entries(continentMapping).map(([key, continent]) => {
          const subject = subjects.find(s => s.id === continent.subjectId)
          if (!subject) return null

          return (
            <Continent
              key={key}
              name={continent.name}
              subject={subject}
              position={continent.position}
              onHover={setTooltip}
              isRotating={isRotating}
              setIsRotating={setIsRotating}
            />
          )
        })}

        {/* Orbit lines */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={64}
              array={new Float32Array(
                Array.from({ length: 64 }, (_, i) => {
                  const angle = (i / 64) * Math.PI * 2
                  return [Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5]
                }).flat()
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1e40af" transparent opacity={0.2} />
        </lineSegments>
      </group>

      {/* Interactive Controls */}
      <OrbitControls
        autoRotate={isRotating}
        autoRotateSpeed={2}
        enableZoom={true}
        enablePan={true}
        minDistance={3}
        maxDistance={8}
      />

      {/* Tooltip */}
      {tooltip.subject && (
        <Html position={tooltip.position} distanceFactor={1.5}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="pointer-events-none"
          >
            <div className="bg-gradient-to-br from-background/95 to-background/85 border border-primary/30 rounded-2xl p-4 w-64 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-foreground">{continentMapping[Object.keys(continentMapping).find(k => continentMapping[k].subjectId === tooltip.subject!.id) || ''].name}</h3>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {tooltip.subject.code}
                </Badge>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Grade:</span>
                  <span className="font-semibold text-foreground">{tooltip.subject.marks}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Study Hours:</span>
                  <span className="font-semibold text-foreground">{Math.round(tooltip.subject.revisionConfidence / 10)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attendance:</span>
                  <span className="font-semibold text-foreground">{tooltip.subject.attendance}%</span>
                </div>
              </div>

              <Button
                onClick={() => handleJumpToMastery(tooltip.subject!.id)}
                className="w-full bg-primary/80 hover:bg-primary text-primary-foreground pointer-events-auto"
                size="sm"
              >
                Jump to Mastery Path
              </Button>
            </div>
          </motion.div>
        </Html>
      )}
    </>
  )
}

export function InteractiveGlobe({ subjects }: GlobeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
      className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-b from-primary/5 to-background"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <GlobeScene subjects={subjects} />
      </Canvas>

      {/* Info overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Hover to explore • Drag to rotate • Scroll to zoom</p>
          <p className="font-medium text-foreground">Visual Grade Map</p>
        </div>
      </div>
    </motion.div>
  )
}
