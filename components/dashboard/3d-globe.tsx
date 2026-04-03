'use client'

// CSS-based Interactive Globe with Realistic Earth
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Subject } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDashboardStore } from '@/lib/store'

// Realistic continent SVG paths (simplified but recognizable)
const continents = {
  northAmerica: `M 45,18 C 48,16 52,15 55,16 L 58,18 C 60,20 62,22 60,25 L 58,28 C 56,30 54,32 52,34 L 48,36 C 45,37 42,36 40,34 L 38,30 C 36,26 38,22 42,20 Z`,
  southAmerica: `M 52,40 C 54,38 56,39 57,42 L 58,48 C 58,52 56,56 54,58 L 52,60 C 50,61 48,60 47,58 L 46,52 C 46,46 48,42 52,40 Z`,
  europe: `M 58,20 C 60,18 63,18 65,20 L 67,22 C 68,24 68,26 66,28 L 63,29 C 61,29 59,28 58,26 L 57,23 C 57,21 57,20 58,20 Z`,
  africa: `M 58,30 C 62,28 66,30 68,34 L 70,40 C 70,46 68,52 64,54 L 60,55 C 56,54 54,50 54,44 L 55,36 C 56,32 56,30 58,30 Z`,
  asia: `M 68,16 C 74,14 80,16 85,20 L 88,26 C 90,32 88,38 84,42 L 78,44 C 72,44 68,40 66,34 L 65,26 C 66,20 66,17 68,16 Z`,
  oceania: `M 82,48 C 86,46 90,48 92,52 L 92,56 C 90,58 86,58 84,56 L 82,52 C 82,50 82,48 82,48 Z M 78,52 C 80,50 82,52 82,54 L 80,56 C 78,56 76,54 78,52 Z`,
}

// Continent mapping to subjects
const continentMapping = [
  { key: 'northAmerica', name: 'Data Structures', subjectId: '2', labelX: 35, labelY: 25 },
  { key: 'southAmerica', name: 'Mathematics', subjectId: '6', labelX: 42, labelY: 52 },
  { key: 'europe', name: 'DBMS', subjectId: '1', labelX: 55, labelY: 22 },
  { key: 'africa', name: 'Machine Learning', subjectId: '5', labelX: 55, labelY: 42 },
  { key: 'asia', name: 'Operating Systems', subjectId: '3', labelX: 75, labelY: 28 },
  { key: 'oceania', name: 'Computer Networks', subjectId: '4', labelX: 82, labelY: 52 },
]

function getColorFromScore(score: number): { fill: string; glow: string } {
  if (score < 35) return { fill: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)' }
  if (score < 75) return { fill: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' }
  return { fill: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)' }
}

interface GlobeProps {
  subjects: Subject[]
}

interface HoveredContinent {
  subject: Subject
  name: string
  key: string
}

// Fixed star positions to avoid hydration mismatch
const starField = [
  { left: 5, top: 10, size: 1, delay: 0 }, { left: 12, top: 25, size: 1.5, delay: 0.5 },
  { left: 8, top: 45, size: 1, delay: 1 }, { left: 3, top: 60, size: 2, delay: 0.2 },
  { left: 15, top: 75, size: 1, delay: 0.8 }, { left: 22, top: 8, size: 1, delay: 0.3 },
  { left: 28, top: 35, size: 1.5, delay: 1.2 }, { left: 18, top: 55, size: 1, delay: 0.6 },
  { left: 25, top: 85, size: 1, delay: 0.1 }, { left: 32, top: 15, size: 1, delay: 0.9 },
  { left: 38, top: 42, size: 2, delay: 0.4 }, { left: 35, top: 68, size: 1, delay: 1.1 },
  { left: 42, top: 5, size: 1.5, delay: 0.7 }, { left: 48, top: 28, size: 1, delay: 0.2 },
  { left: 45, top: 52, size: 1, delay: 1.4 }, { left: 52, top: 78, size: 1.5, delay: 0.5 },
  { left: 55, top: 12, size: 1, delay: 0.8 }, { left: 58, top: 38, size: 2, delay: 0.1 },
  { left: 62, top: 62, size: 1, delay: 1.3 }, { left: 65, top: 88, size: 1, delay: 0.6 },
  { left: 68, top: 20, size: 1.5, delay: 0.3 }, { left: 72, top: 45, size: 1, delay: 0.9 },
  { left: 75, top: 70, size: 1, delay: 0.4 }, { left: 78, top: 8, size: 2, delay: 1.0 },
  { left: 82, top: 32, size: 1, delay: 0.2 }, { left: 85, top: 58, size: 1.5, delay: 0.7 },
  { left: 88, top: 82, size: 1, delay: 1.5 }, { left: 92, top: 18, size: 1, delay: 0.5 },
  { left: 95, top: 48, size: 1, delay: 0.1 }, { left: 98, top: 72, size: 1.5, delay: 0.8 },
  { left: 7, top: 92, size: 1, delay: 0.3 }, { left: 17, top: 3, size: 2, delay: 1.2 },
  { left: 27, top: 22, size: 1, delay: 0.6 }, { left: 37, top: 88, size: 1.5, delay: 0.9 },
  { left: 47, top: 65, size: 1, delay: 0.4 }, { left: 57, top: 95, size: 1, delay: 1.1 },
  { left: 67, top: 52, size: 2, delay: 0.2 }, { left: 77, top: 92, size: 1, delay: 0.7 },
  { left: 87, top: 42, size: 1.5, delay: 1.4 }, { left: 97, top: 28, size: 1, delay: 0.5 },
]

export function InteractiveGlobe({ subjects }: GlobeProps) {
  const [isRotating, setIsRotating] = useState(true)
  const [hoveredContinent, setHoveredContinent] = useState<HoveredContinent | null>(null)
  const [rotation, setRotation] = useState(0)
  const { setCurrentView } = useDashboardStore()

  // Smooth rotation effect
  useEffect(() => {
    if (!isRotating) return
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.3) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [isRotating])

  const handleContinentHover = (continent: typeof continentMapping[0], subject: Subject) => {
    setHoveredContinent({ subject, name: continent.name, key: continent.key })
    setIsRotating(false)
  }

  const handleContinentLeave = () => {
    setHoveredContinent(null)
    setIsRotating(true)
  }

  const handleJumpToMastery = () => {
    setCurrentView('class-path')
    setHoveredContinent(null)
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
      className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-primary/20"
      style={{ 
        background: 'radial-gradient(ellipse at 30% 20%, #0f172a 0%, #020617 50%, #000 100%)'
      }}
    >
      {/* Starfield background - using fixed positions */}
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
              opacity: 0.5,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + star.delay,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Nebula effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 40%)'
        }}
      />

      {/* Globe container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative w-80 h-80 md:w-96 md:h-96"
          style={{ perspective: '1200px' }}
        >
          {/* Earth sphere */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${rotation}deg) rotateX(-15deg)`,
            }}
          >
            {/* Ocean base with realistic gradient */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(circle at 35% 25%, 
                    #1e40af 0%, 
                    #1e3a8a 20%, 
                    #172554 40%, 
                    #0f172a 70%,
                    #020617 100%
                  )
                `,
                boxShadow: `
                  inset -40px -40px 80px rgba(0,0,0,0.6),
                  inset 20px 20px 40px rgba(96,165,250,0.1),
                  0 0 100px rgba(59,130,246,0.4),
                  0 0 200px rgba(59,130,246,0.2)
                `,
              }}
            />

            {/* Atmosphere glow */}
            <div
              className="absolute -inset-4 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, transparent 65%, rgba(96,165,250,0.15) 80%, rgba(59,130,246,0.08) 100%)',
              }}
            />

            {/* Globe SVG with continents */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              style={{ 
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))',
              }}
            >
              <defs>
                {/* Continent gradients */}
                {continentMapping.map(continent => {
                  const subject = subjects.find(s => s.id === continent.subjectId)
                  const colors = subject ? getColorFromScore(subject.marks) : { fill: '#4ade80', glow: 'rgba(74, 222, 128, 0.5)' }
                  return (
                    <linearGradient key={continent.key} id={`grad-${continent.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={colors.fill} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={colors.fill} stopOpacity="0.5" />
                    </linearGradient>
                  )
                })}
                
                {/* Glow filter */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Grid pattern */}
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(96,165,250,0.08)" strokeWidth="0.3" />
                </pattern>
              </defs>

              {/* Ocean grid overlay */}
              <circle cx="50" cy="50" r="49" fill="url(#grid)" opacity="0.5" />

              {/* Latitude lines */}
              {[20, 35, 50, 65, 80].map(lat => (
                <ellipse
                  key={`lat-${lat}`}
                  cx="50"
                  cy="50"
                  rx={lat * 0.49}
                  ry={lat * 0.49 * Math.cos((lat - 50) * 0.02)}
                  fill="none"
                  stroke="rgba(96,165,250,0.1)"
                  strokeWidth="0.3"
                  strokeDasharray="2,2"
                />
              ))}

              {/* Longitude lines */}
              {[0, 30, 60, 90, 120, 150].map(lon => (
                <ellipse
                  key={`lon-${lon}`}
                  cx="50"
                  cy="50"
                  rx={Math.abs(Math.sin(lon * Math.PI / 180)) * 49}
                  ry="49"
                  fill="none"
                  stroke="rgba(96,165,250,0.08)"
                  strokeWidth="0.3"
                  transform={`rotate(${lon} 50 50)`}
                />
              ))}

              {/* Continents */}
              {continentMapping.map(continent => {
                const subject = subjects.find(s => s.id === continent.subjectId)
                const colors = subject ? getColorFromScore(subject.marks) : { fill: '#4ade80', glow: 'rgba(74, 222, 128, 0.5)' }
                const isHovered = hoveredContinent?.key === continent.key
                const path = continents[continent.key as keyof typeof continents]

                return (
                  <g key={continent.key}>
                    {/* Continent shadow */}
                    <path
                      d={path}
                      fill="rgba(0,0,0,0.3)"
                      transform="translate(1, 1)"
                    />
                    
                    {/* Continent shape */}
                    <motion.path
                      d={path}
                      fill={`url(#grad-${continent.key})`}
                      stroke={colors.fill}
                      strokeWidth={isHovered ? 1.5 : 0.5}
                      filter="url(#glow)"
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        filter: isHovered ? `drop-shadow(0 0 8px ${colors.glow})` : undefined,
                      }}
                      animate={{
                        scale: isHovered ? 1.02 : 1,
                      }}
                      onMouseEnter={() => subject && handleContinentHover(continent, subject)}
                      onMouseLeave={handleContinentLeave}
                    />

                    {/* Pulsing indicator for danger subjects */}
                    {subject && subject.marks < 35 && (
                      <motion.circle
                        cx={continent.labelX}
                        cy={continent.labelY}
                        r="3"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="0.5"
                        animate={{
                          r: [3, 6, 3],
                          opacity: [0.8, 0, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}

                    {/* Data point marker */}
                    <circle
                      cx={continent.labelX}
                      cy={continent.labelY}
                      r="1.5"
                      fill={colors.fill}
                      className="pointer-events-none"
                    />
                  </g>
                )
              })}

              {/* Cloud wisps */}
              <ellipse cx="30" cy="35" rx="8" ry="2" fill="rgba(255,255,255,0.05)" />
              <ellipse cx="70" cy="25" rx="6" ry="1.5" fill="rgba(255,255,255,0.04)" />
              <ellipse cx="55" cy="60" rx="10" ry="2" fill="rgba(255,255,255,0.03)" />
            </svg>

            {/* Specular highlight */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.2) 0%, transparent 40%)',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredContinent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50"
            style={{
              left: '50%',
              bottom: '24px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-blue-500/30 rounded-2xl p-5 w-72 backdrop-blur-xl shadow-2xl shadow-blue-500/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-white">{hoveredContinent.name}</h3>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {hoveredContinent.subject.code}
                </Badge>
              </div>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Current Grade</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getColorFromScore(hoveredContinent.subject.marks).fill }}
                    />
                    <span className="font-semibold text-white">{hoveredContinent.subject.marks}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Revision Confidence</span>
                  <span className="font-semibold text-white">{hoveredContinent.subject.revisionConfidence}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Attendance</span>
                  <span className="font-semibold text-white">{hoveredContinent.subject.attendance}%</span>
                </div>
                
                {/* Mini progress bar */}
                <div className="pt-2">
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${hoveredContinent.subject.marks}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getColorFromScore(hoveredContinent.subject.marks).fill }}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleJumpToMastery}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white border-0"
                size="sm"
              >
                Jump to Mastery Path
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
        <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">Performance</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#22c55e] shadow-lg shadow-green-500/30" />
            <span className="text-slate-300">Excellent (75%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-lg shadow-amber-500/30" />
            <span className="text-slate-300">Needs Work (35-74%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-lg shadow-red-500/30" />
            <span className="text-slate-300">At Risk (&lt;35%)</span>
          </div>
        </div>
      </div>

      {/* Info overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="text-xs space-y-1">
          <p className="text-blue-300/70">Hover continents to explore</p>
          <p className="font-semibold text-white text-sm">Visual Grade Map</p>
        </div>
      </div>

      {/* Rotation indicator */}
      <div className="absolute top-4 right-4 z-10">
        <motion.div
          animate={{ rotate: isRotating ? 360 : 0 }}
          transition={{ duration: 3, repeat: isRotating ? Infinity : 0, ease: 'linear' }}
          className="w-6 h-6 border-2 border-blue-400/30 rounded-full flex items-center justify-center"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        </motion.div>
      </div>
    </motion.div>
  )
}
