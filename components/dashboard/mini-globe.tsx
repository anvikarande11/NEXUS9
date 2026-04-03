'use client'

// CSS-based Mini Globe with Realistic Earth - for sidebar
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { mockSubjects } from '@/lib/mock-data'
import { useDashboardStore } from '@/lib/store'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Simplified continent paths for mini view
const miniContinents = {
  northAmerica: 'M 25,12 C 30,10 35,12 38,16 L 36,22 C 33,25 28,24 26,20 Z',
  southAmerica: 'M 32,28 C 34,26 37,28 38,32 L 36,40 C 34,42 31,40 31,36 Z',
  europe: 'M 45,14 C 48,12 52,14 52,18 L 49,20 C 46,20 44,17 45,14 Z',
  africa: 'M 46,22 C 50,20 54,24 54,30 L 52,38 C 48,40 44,36 45,28 Z',
  asia: 'M 54,12 C 62,10 70,14 72,22 L 68,30 C 62,32 56,28 56,20 Z',
  oceania: 'M 66,36 C 70,34 74,38 74,42 L 70,44 C 66,44 64,40 66,36 Z',
}

const continentSubjects = [
  { key: 'northAmerica', subjectId: '2' },
  { key: 'southAmerica', subjectId: '6' },
  { key: 'europe', subjectId: '1' },
  { key: 'africa', subjectId: '5' },
  { key: 'asia', subjectId: '3' },
  { key: 'oceania', subjectId: '4' },
]

function getColorFromScore(score: number): string {
  if (score < 35) return '#ef4444'
  if (score < 75) return '#f59e0b'
  return '#22c55e'
}

export function MiniGlobe() {
  const { setCurrentView } = useDashboardStore()
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('subject-health')}
            className="w-12 h-12 mx-auto rounded-xl overflow-hidden border border-blue-500/30 bg-gradient-to-b from-slate-900 to-slate-950 hover:border-blue-400/50 transition-all cursor-pointer relative"
          >
            {/* Stars */}
            <div className="absolute inset-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-white/40 rounded-full"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                  }}
                />
              ))}
            </div>

            {/* Globe */}
            <div className="absolute inset-1 flex items-center justify-center">
              <motion.div
                className="w-9 h-9 rounded-full relative overflow-hidden"
                style={{
                  background: `
                    radial-gradient(circle at 30% 25%, 
                      #3b82f6 0%, 
                      #1e3a8a 30%, 
                      #1e40af 50%,
                      #172554 80%
                    )
                  `,
                  boxShadow: `
                    inset -4px -4px 8px rgba(0,0,0,0.5),
                    inset 2px 2px 4px rgba(96,165,250,0.2),
                    0 0 12px rgba(59,130,246,0.4)
                  `,
                }}
              >
                {/* Rotating SVG continents */}
                <motion.svg
                  viewBox="0 0 80 80"
                  className="absolute inset-0 w-full h-full"
                  style={{
                    transform: `rotateY(${rotation * 0.3}deg)`,
                  }}
                >
                  {continentSubjects.map(({ key, subjectId }) => {
                    const subject = mockSubjects.find(s => s.id === subjectId)
                    const color = subject ? getColorFromScore(subject.marks) : '#22c55e'
                    const path = miniContinents[key as keyof typeof miniContinents]
                    
                    return (
                      <path
                        key={key}
                        d={path}
                        fill={color}
                        opacity={0.85}
                        style={{
                          filter: `drop-shadow(0 0 2px ${color})`,
                        }}
                      />
                    )
                  })}
                </motion.svg>

                {/* Atmosphere glow */}
                <div
                  className="absolute -inset-1 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, transparent 60%, rgba(96,165,250,0.2) 100%)',
                  }}
                />

                {/* Specular highlight */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.25) 0%, transparent 50%)',
                  }}
                />
              </motion.div>
            </div>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <span>Visual Grade Map</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
