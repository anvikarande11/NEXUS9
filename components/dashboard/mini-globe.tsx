'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { mockSubjects, type Subject } from '@/lib/mock-data'
import { useDashboardStore } from '@/lib/store'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Continent data with positions for CSS 3D
const continentData = [
  { id: '2', name: 'Data Structures', angle: 0, elevation: 20 },
  { id: '6', name: 'Mathematics', angle: 60, elevation: -30 },
  { id: '1', name: 'DBMS', angle: 120, elevation: 35 },
  { id: '5', name: 'Machine Learning', angle: 180, elevation: 0 },
  { id: '3', name: 'Operating Systems', angle: 240, elevation: 25 },
  { id: '4', name: 'Computer Networks', angle: 300, elevation: -25 },
]

function getColorFromScore(score: number): string {
  if (score < 35) return '#ef4444'
  if (score < 75) return '#f59e0b'
  return '#22c55e'
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
            className="w-12 h-12 mx-auto rounded-xl overflow-hidden border border-primary/30 bg-gradient-to-b from-primary/10 to-background/50 hover:border-primary/50 transition-all cursor-pointer relative"
            style={{ perspective: '200px' }}
          >
            {/* Globe container with CSS 3D */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Base sphere */}
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-9 h-9 rounded-full relative"
                style={{ 
                  transformStyle: 'preserve-3d',
                  background: 'radial-gradient(circle at 30% 30%, #3b82f6, #1e3a8a, #0c2d57)',
                  boxShadow: 'inset -4px -4px 8px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.1)'
                }}
              >
                {/* Continent dots */}
                {continentData.map((continent) => {
                  const subject = mockSubjects.find(s => s.id === continent.id)
                  if (!subject) return null
                  
                  const color = getColorFromScore(subject.marks)
                  const radAngle = (continent.angle * Math.PI) / 180
                  const radElevation = (continent.elevation * Math.PI) / 180
                  
                  const x = Math.cos(radAngle) * Math.cos(radElevation) * 14
                  const y = Math.sin(radElevation) * 14
                  const z = Math.sin(radAngle) * Math.cos(radElevation) * 14
                  
                  return (
                    <div
                      key={continent.id}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: color,
                        boxShadow: `0 0 4px ${color}`,
                        left: '50%',
                        top: '50%',
                        transform: `translate3d(${x}px, ${y}px, ${z}px) translate(-50%, -50%)`,
                      }}
                    />
                  )
                })}
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
