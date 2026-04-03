'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Subject } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDashboardStore } from '@/lib/store'

// Continent mapping to subjects with positions
const continentMapping = [
  { key: 'north_america', name: 'Data Structures', subjectId: '2', angle: 290, elevation: 40, size: 45 },
  { key: 'south_america', name: 'Mathematics', subjectId: '6', angle: 310, elevation: -20, size: 35 },
  { key: 'europe', name: 'DBMS', subjectId: '1', angle: 10, elevation: 50, size: 30 },
  { key: 'africa', name: 'Machine Learning', subjectId: '5', angle: 20, elevation: 0, size: 40 },
  { key: 'asia', name: 'Operating Systems', subjectId: '3', angle: 100, elevation: 35, size: 55 },
  { key: 'oceania', name: 'Computer Networks', subjectId: '4', angle: 135, elevation: -25, size: 28 },
]

function getColorFromScore(score: number): string {
  if (score < 35) return '#ef4444'
  if (score < 75) return '#f59e0b'
  return '#22c55e'
}

interface GlobeProps {
  subjects: Subject[]
}

interface HoveredContinent {
  subject: Subject
  name: string
  x: number
  y: number
}

export function InteractiveGlobe({ subjects }: GlobeProps) {
  const [isRotating, setIsRotating] = useState(true)
  const [hoveredContinent, setHoveredContinent] = useState<HoveredContinent | null>(null)
  const { setCurrentView } = useDashboardStore()

  const handleContinentHover = (continent: typeof continentMapping[0], subject: Subject, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setHoveredContinent({
      subject,
      name: continent.name,
      x: rect.left + rect.width / 2,
      y: rect.top,
    })
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
      className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-b from-[#0a192f] to-[#0c2d57]"
      style={{ perspective: '1000px' }}
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Globe container */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        <motion.div
          animate={isRotating ? { rotateY: 360 } : {}}
          transition={isRotating ? { duration: 30, repeat: Infinity, ease: 'linear' } : {}}
          className="relative w-72 h-72 md:w-80 md:h-80"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Base sphere with gradient */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #3b82f6 0%, #1e3a8a 40%, #0c2d57 80%, #030712 100%)',
              boxShadow: `
                inset -30px -30px 60px rgba(0,0,0,0.5),
                inset 15px 15px 30px rgba(96,165,250,0.15),
                0 0 80px rgba(59,130,246,0.3),
                0 0 120px rgba(59,130,246,0.15)
              `,
            }}
          />

          {/* Globe grid lines */}
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-20">
            {/* Latitude lines */}
            {[20, 40, 60, 80].map((lat) => (
              <div
                key={`lat-${lat}`}
                className="absolute border border-blue-400/30 rounded-full"
                style={{
                  width: `${lat}%`,
                  height: `${lat}%`,
                  left: `${(100 - lat) / 2}%`,
                  top: `${(100 - lat) / 2}%`,
                }}
              />
            ))}
          </div>

          {/* Continents */}
          {continentMapping.map((continent) => {
            const subject = subjects.find(s => s.id === continent.subjectId)
            if (!subject) return null

            const color = getColorFromScore(subject.marks)
            const radAngle = (continent.angle * Math.PI) / 180
            const radElevation = (continent.elevation * Math.PI) / 180
            const radius = 140

            const x = Math.cos(radAngle) * Math.cos(radElevation) * radius
            const y = Math.sin(radElevation) * radius
            const z = Math.sin(radAngle) * Math.cos(radElevation) * radius

            // Calculate visibility based on z position
            const visibility = (z + radius) / (2 * radius)
            const scale = 0.6 + visibility * 0.4

            return (
              <motion.div
                key={continent.key}
                className="absolute cursor-pointer transition-all duration-200"
                style={{
                  width: continent.size,
                  height: continent.size,
                  left: '50%',
                  top: '50%',
                  transform: `translate3d(${x}px, ${-y}px, ${z}px) translate(-50%, -50%) scale(${scale})`,
                  zIndex: Math.round(z + 200),
                  opacity: visibility > 0.3 ? 1 : 0.3,
                }}
                whileHover={{ scale: scale * 1.3 }}
                onMouseEnter={(e) => handleContinentHover(continent, subject, e)}
                onMouseLeave={handleContinentLeave}
              >
                {/* Continent shape */}
                <div
                  className="w-full h-full rounded-full relative"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${color}, ${color}aa)`,
                    boxShadow: `
                      0 0 ${continent.size / 2}px ${color}66,
                      0 0 ${continent.size}px ${color}33,
                      inset -2px -2px 4px rgba(0,0,0,0.3),
                      inset 2px 2px 4px rgba(255,255,255,0.2)
                    `,
                  }}
                >
                  {/* Pulse effect for danger subjects */}
                  {subject.marks < 35 && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ border: `2px solid ${color}` }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Data spike showing study hours */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-0.5"
                    style={{
                      width: 3,
                      height: Math.max(5, subject.revisionConfidence / 5),
                      background: `linear-gradient(to top, ${color}, transparent)`,
                      borderRadius: 2,
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredContinent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: '50%',
              bottom: '20px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="bg-gradient-to-br from-background/95 to-background/85 border border-primary/30 rounded-2xl p-4 w-64 backdrop-blur-xl shadow-2xl pointer-events-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-foreground">{hoveredContinent.name}</h3>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {hoveredContinent.subject.code}
                </Badge>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Grade:</span>
                  <span className="font-semibold text-foreground">{hoveredContinent.subject.marks}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Study Hours:</span>
                  <span className="font-semibold text-foreground">{Math.round(hoveredContinent.subject.revisionConfidence / 10)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attendance:</span>
                  <span className="font-semibold text-foreground">{hoveredContinent.subject.attendance}%</span>
                </div>
              </div>

              <Button
                onClick={handleJumpToMastery}
                className="w-full bg-primary/80 hover:bg-primary text-primary-foreground"
                size="sm"
              >
                Jump to Mastery Path
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Performance Legend</p>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
            <span className="text-muted-foreground">Good</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="text-muted-foreground">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <span className="text-muted-foreground">At Risk</span>
          </div>
        </div>
      </div>

      {/* Info overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="text-xs text-blue-200/70 space-y-1">
          <p>Hover continents to explore</p>
          <p className="font-medium text-blue-100">Visual Grade Map</p>
        </div>
      </div>
    </motion.div>
  )
}
