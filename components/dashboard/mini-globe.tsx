'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { mockSubjects, type Subject } from '@/lib/mock-data'
import { useDashboardStore } from '@/lib/store'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Continent mapping to subjects
const continentMapping: Record<string, { name: string; subjectId: string; position: { lat: number; lon: number } }> = {
  north_america: { name: 'Data Structures', subjectId: '2', position: { lat: 45, lon: -100 } },
  south_america: { name: 'Mathematics', subjectId: '6', position: { lat: -15, lon: -60 } },
  europe: { name: 'DBMS', subjectId: '1', position: { lat: 50, lon: 10 } },
  africa: { name: 'Machine Learning', subjectId: '5', position: { lat: 0, lon: 20 } },
  asia: { name: 'Operating Systems', subjectId: '3', position: { lat: 30, lon: 100 } },
  oceania: { name: 'Computer Networks', subjectId: '4', position: { lat: -25, lon: 135 } },
}

function MiniContinent({ subject, position }: { subject: Subject; position: { lat: number; lon: number } }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const getColorFromScore = (score: number): THREE.Color => {
    if (score < 35) return new THREE.Color('#ef4444')
    if (score < 75) return new THREE.Color('#f59e0b')
    return new THREE.Color('#22c55e')
  }

  const lat = (position.lat * Math.PI) / 180
  const lon = (position.lon * Math.PI) / 180
  const x = Math.cos(lat) * Math.cos(lon) * 1.1
  const y = Math.sin(lat) * 1.1
  const z = Math.cos(lat) * Math.sin(lon) * 1.1

  const color = getColorFromScore(subject.marks)

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  )
}

function MiniGlobeScene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} color="#60a5fa" />
      <directionalLight position={[3, 3, 3]} intensity={1} color="#ffffff" />
      <pointLight position={[-3, -3, -3]} intensity={0.3} color="#3b82f6" />

      <group ref={groupRef}>
        {/* Base sphere */}
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#1e3a8a"
            emissive="#0c2d57"
            emissiveIntensity={0.2}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Continents */}
        {Object.entries(continentMapping).map(([key, continent]) => {
          const subject = mockSubjects.find(s => s.id === continent.subjectId)
          if (!subject) return null
          return (
            <MiniContinent
              key={key}
              subject={subject}
              position={continent.position}
            />
          )
        })}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minDistance={2.5}
        maxDistance={2.5}
      />
    </>
  )
}

export function MiniGlobe() {
  const { setCurrentView } = useDashboardStore()

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('subject-health')}
            className="w-12 h-12 mx-auto rounded-xl overflow-hidden border border-primary/30 bg-gradient-to-b from-primary/10 to-background/50 hover:border-primary/50 transition-all cursor-pointer"
          >
            <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
              <MiniGlobeScene />
            </Canvas>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <span>Visual Grade Map</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
