'use client'

// Realistic 3D Earth Globe Component
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Subject } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDashboardStore } from '@/lib/store'
import Image from 'next/image'

// Continent data points with realistic latitude/longitude positioning
const dataPoints = [
  { id: '2', name: 'Data Structures', region: 'North America', lat: 40, lng: -100, angle: -15 },
  { id: '6', name: 'Mathematics', region: 'South America', lat: -15, lng: -60, angle: 25 },
  { id: '1', name: 'DBMS', region: 'Europe', lat: 50, lng: 10, angle: 45 },
  { id: '5', name: 'Machine Learning', region: 'Africa', lat: 5, lng: 20, angle: 55 },
  { id: '3', name: 'Operating Systems', region: 'Asia', lat: 35, lng: 100, angle: 100 },
  { id: '4', name: 'Computer Networks', region: 'Oceania', lat: -25, lng: 135, angle: 130 },
]

function getColorFromScore(score: number): { fill: string; glow: string; status: string } {
  if (score < 35) return { fill: '#ef4444', glow: 'rgba(239, 68, 68, 0.8)', status: 'At Risk' }
  if (score < 75) return { fill: '#f59e0b', glow: 'rgba(245, 158, 11, 0.7)', status: 'Needs Work' }
  return { fill: '#22c55e', glow: 'rgba(34, 197, 94, 0.7)', status: 'Excellent' }
}

interface GlobeProps {
  subjects: Subject[]
}

interface HoveredPoint {
  subject: Subject
  name: string
  region: string
  x: number
  y: number
}

// Fixed star positions
const starField = [
  { left: 2, top: 5, size: 1 }, { left: 8, top: 15, size: 1.5 },
  { left: 5, top: 35, size: 1 }, { left: 12, top: 55, size: 2 },
  { left: 3, top: 75, size: 1 }, { left: 18, top: 10, size: 1 },
  { left: 25, top: 30, size: 1.5 }, { left: 15, top: 50, size: 1 },
  { left: 22, top: 70, size: 1 }, { left: 30, top: 8, size: 1 },
  { left: 35, top: 40, size: 2 }, { left: 28, top: 60, size: 1 },
  { left: 40, top: 20, size: 1.5 }, { left: 45, top: 45, size: 1 },
  { left: 38, top: 80, size: 1 }, { left: 52, top: 12, size: 1.5 },
  { left: 55, top: 35, size: 1 }, { left: 48, top: 65, size: 2 },
  { left: 60, top: 25, size: 1 }, { left: 65, top: 55, size: 1 },
  { left: 58, top: 85, size: 1.5 }, { left: 72, top: 15, size: 1 },
  { left: 75, top: 45, size: 1 }, { left: 68, top: 72, size: 2 },
  { left: 80, top: 8, size: 1.5 }, { left: 85, top: 38, size: 1 },
  { left: 78, top: 60, size: 1 }, { left: 90, top: 20, size: 1 },
  { left: 92, top: 50, size: 1.5 }, { left: 88, top: 78, size: 1 },
  { left: 95, top: 30, size: 2 }, { left: 98, top: 65, size: 1 },
]

export function InteractiveGlobe({ subjects }: GlobeProps) {
  const [isRotating, setIsRotating] = useState(true)
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, rotation: 0 })
  const globeRef = useRef<HTMLDivElement>(null)
  const { setCurrentView } = useDashboardStore()

  // Smooth rotation effect
  useEffect(() => {
    if (!isRotating || isDragging) return
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [isRotating, isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, rotation })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const delta = e.clientX - dragStart.x
    setRotation(dragStart.rotation + delta * 0.5)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handlePointHover = (point: typeof dataPoints[0], subject: Subject, x: number, y: number) => {
    setHoveredPoint({ subject, name: point.name, region: point.region, x, y })
    setIsRotating(false)
  }

  const handlePointLeave = () => {
    setHoveredPoint(null)
    setIsRotating(true)
  }

  const handleJumpToMastery = () => {
    setCurrentView('class-path')
    setHoveredPoint(null)
  }

  // Calculate point position on sphere
  const getPointPosition = (point: typeof dataPoints[0]) => {
    const effectiveAngle = (rotation + point.angle) % 360
    const radians = (effectiveAngle * Math.PI) / 180
    const latRadians = (point.lat * Math.PI) / 180
    
    // Calculate 3D position on sphere
    const x = Math.sin(radians) * Math.cos(latRadians) * 140 + 160
    const y = -Math.sin(latRadians) * 140 + 160
    const z = Math.cos(radians) * Math.cos(latRadians)
    
    return { x, y, z, visible: z > -0.2 }
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
      className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-primary/20"
      style={{ 
        background: 'radial-gradient(ellipse at 30% 20%, #0c1929 0%, #030712 60%, #000 100%)'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        {starField.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Nebula effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 10% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 40%)'
        }}
      />

      {/* Globe container */}
      <div 
        ref={globeRef}
        className="absolute inset-0 flex items-center justify-center"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          className="relative w-80 h-80 md:w-[340px] md:h-[340px]"
          style={{ perspective: '1200px' }}
        >
          {/* Earth sphere with real image */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${rotation}deg) rotateX(-15deg)`,
            }}
          >
            {/* Earth image - main globe */}
            <div 
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                boxShadow: `
                  inset -30px -30px 60px rgba(0,0,0,0.7),
                  inset 20px 20px 50px rgba(100,180,255,0.1),
                  0 0 80px rgba(59,130,246,0.5),
                  0 0 160px rgba(59,130,246,0.25)
                `,
              }}
            >
              <Image
                src="/images/earth.png"
                alt="Earth"
                fill
                className="object-cover rounded-full"
                style={{
                  transform: `rotateY(${-rotation * 0.5}deg)`,
                }}
                priority
              />
              
              {/* Atmosphere overlay */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.15) 0%, transparent 50%)',
                }}
              />
            </div>

            {/* Outer atmosphere glow */}
            <div
              className="absolute -inset-6 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, transparent 55%, rgba(59,130,246,0.1) 70%, rgba(96,165,250,0.15) 85%, transparent 100%)',
              }}
            />
          </motion.div>

          {/* Data point markers */}
          <div className="absolute inset-0">
            {dataPoints.map(point => {
              const subject = subjects.find(s => s.id === point.id)
              if (!subject) return null
              
              const pos = getPointPosition(point)
              const colors = getColorFromScore(subject.marks)
              
              if (!pos.visible) return null
              
              const scale = 0.5 + (pos.z + 1) * 0.3
              const opacity = Math.max(0.3, (pos.z + 1) / 2)
              
              return (
                <motion.div
                  key={point.id}
                  className="absolute"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    transform: 'translate(-50%, -50%)',
                    zIndex: Math.round(pos.z * 100) + 100,
                  }}
                  initial={false}
                  animate={{ scale, opacity }}
                >
                  {/* Pulsing ring for at-risk subjects */}
                  {subject.marks < 35 && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
                        transform: 'translate(-50%, -50%) scale(2)',
                        left: '50%',
                        top: '50%',
                      }}
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.6, 0, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                  
                  {/* Main marker */}
                  <motion.button
                    className="relative w-5 h-5 rounded-full border-2 border-white/80 shadow-lg"
                    style={{
                      backgroundColor: colors.fill,
                      boxShadow: `0 0 15px ${colors.glow}`,
                    }}
                    whileHover={{ scale: 1.3 }}
                    onMouseEnter={() => handlePointHover(point, subject, pos.x, pos.y)}
                    onMouseLeave={handlePointLeave}
                  >
                    {/* Inner glow */}
                    <div 
                      className="absolute inset-1 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 0%, transparent 70%)',
                      }}
                    />
                  </motion.button>
                  
                  {/* Label */}
                  <motion.div
                    className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-white/80 bg-slate-900/80 px-2 py-0.5 rounded-full backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: pos.z > 0.3 ? 1 : 0 }}
                  >
                    {point.name.split(' ')[0]}
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 pointer-events-auto"
            style={{
              left: '50%',
              bottom: '24px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="bg-gradient-to-br from-slate-900/98 to-slate-800/98 border border-blue-500/40 rounded-2xl p-5 w-80 backdrop-blur-xl shadow-2xl shadow-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">{hoveredPoint.name}</h3>
                  <p className="text-xs text-blue-300/70">{hoveredPoint.region}</p>
                </div>
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: getColorFromScore(hoveredPoint.subject.marks).fill + '20',
                    color: getColorFromScore(hoveredPoint.subject.marks).fill,
                    borderColor: getColorFromScore(hoveredPoint.subject.marks).fill + '40',
                  }}
                >
                  {getColorFromScore(hoveredPoint.subject.marks).status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-2 bg-slate-800/50 rounded-xl">
                  <p className="text-2xl font-bold text-white">{hoveredPoint.subject.marks}%</p>
                  <p className="text-xs text-slate-400">Grade</p>
                </div>
                <div className="text-center p-2 bg-slate-800/50 rounded-xl">
                  <p className="text-2xl font-bold text-white">{hoveredPoint.subject.attendance}%</p>
                  <p className="text-xs text-slate-400">Attendance</p>
                </div>
                <div className="text-center p-2 bg-slate-800/50 rounded-xl">
                  <p className="text-2xl font-bold text-white">{hoveredPoint.subject.revisionConfidence}%</p>
                  <p className="text-xs text-slate-400">Confidence</p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${hoveredPoint.subject.marks}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: getColorFromScore(hoveredPoint.subject.marks).fill }}
                  />
                </div>
              </div>

              <Button
                onClick={handleJumpToMastery}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-0"
                size="sm"
              >
                Jump to Mastery Path
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-slate-700/50">
        <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">Performance</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#22c55e] shadow-lg shadow-green-500/40" />
            <span className="text-slate-300">Excellent (75%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-lg shadow-amber-500/40" />
            <span className="text-slate-300">Needs Work (35-74%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-lg shadow-red-500/40" />
            <span className="text-slate-300">At Risk (&lt;35%)</span>
          </div>
        </div>
      </div>

      {/* Info overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="text-xs space-y-1">
          <p className="text-blue-300/70">Drag to rotate | Hover markers</p>
          <p className="font-semibold text-white text-sm">Visual Grade Map</p>
        </div>
      </div>

      {/* Rotation indicator */}
      <motion.div 
        className="absolute top-4 right-4 z-10"
        animate={{ rotate: isRotating ? 360 : 0 }}
        transition={{ duration: 4, repeat: isRotating ? Infinity : 0, ease: 'linear' }}
      >
        <div className="w-8 h-8 border-2 border-blue-400/40 rounded-full flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
        </div>
      </motion.div>
    </motion.div>
  )
}
