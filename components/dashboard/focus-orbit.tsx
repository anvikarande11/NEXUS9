'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, RotateCcw, Zap, Target, Coffee, BookOpen, Trophy } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Orbital tasks that rotate around the center
const orbitalTasks = [
  { id: 1, name: 'DSA Practice', icon: BookOpen, color: '#22c55e', orbitRadius: 140, orbitSpeed: 25, angle: 0 },
  { id: 2, name: 'DBMS Revision', icon: Target, color: '#f59e0b', orbitRadius: 140, orbitSpeed: 25, angle: 120 },
  { id: 3, name: 'OS Concepts', icon: Zap, color: '#ef4444', orbitRadius: 140, orbitSpeed: 25, angle: 240 },
  { id: 4, name: 'Break Time', icon: Coffee, color: '#8b5cf6', orbitRadius: 200, orbitSpeed: 35, angle: 45 },
  { id: 5, name: 'ML Models', icon: Trophy, color: '#06b6d4', orbitRadius: 200, orbitSpeed: 35, angle: 165 },
  { id: 6, name: 'CN Lab', icon: BookOpen, color: '#ec4899', orbitRadius: 200, orbitSpeed: 35, angle: 285 },
]

interface FocusSession {
  taskId: number
  startTime: Date
  duration: number // in seconds
  completed: boolean
}

// Fixed star positions to avoid hydration mismatch
const focusStarField = [
  { left: 2, top: 5, size: 1, delay: 0 }, { left: 8, top: 18, size: 1.5, delay: 0.3 },
  { left: 4, top: 35, size: 1, delay: 0.7 }, { left: 12, top: 52, size: 2, delay: 0.1 },
  { left: 6, top: 70, size: 1, delay: 0.9 }, { left: 15, top: 88, size: 1, delay: 0.4 },
  { left: 18, top: 12, size: 1.5, delay: 1.1 }, { left: 22, top: 28, size: 1, delay: 0.2 },
  { left: 25, top: 45, size: 1, delay: 0.6 }, { left: 20, top: 62, size: 1.5, delay: 0.8 },
  { left: 28, top: 78, size: 2, delay: 0.5 }, { left: 32, top: 95, size: 1, delay: 1.0 },
  { left: 35, top: 8, size: 1, delay: 0.3 }, { left: 38, top: 22, size: 1, delay: 0.7 },
  { left: 42, top: 38, size: 1.5, delay: 0.1 }, { left: 45, top: 55, size: 1, delay: 0.9 },
  { left: 48, top: 72, size: 2, delay: 0.4 }, { left: 52, top: 85, size: 1, delay: 0.6 },
  { left: 55, top: 15, size: 1, delay: 0.2 }, { left: 58, top: 32, size: 1.5, delay: 0.8 },
  { left: 62, top: 48, size: 1, delay: 1.2 }, { left: 65, top: 65, size: 1, delay: 0.5 },
  { left: 68, top: 82, size: 1.5, delay: 0.3 }, { left: 72, top: 5, size: 2, delay: 0.7 },
  { left: 75, top: 20, size: 1, delay: 0.1 }, { left: 78, top: 42, size: 1, delay: 0.9 },
  { left: 82, top: 58, size: 1.5, delay: 0.4 }, { left: 85, top: 75, size: 1, delay: 0.6 },
  { left: 88, top: 92, size: 1, delay: 1.0 }, { left: 92, top: 10, size: 2, delay: 0.2 },
  { left: 95, top: 28, size: 1, delay: 0.8 }, { left: 98, top: 45, size: 1.5, delay: 0.5 },
  { left: 3, top: 82, size: 1, delay: 0.3 }, { left: 10, top: 95, size: 1, delay: 0.7 },
  { left: 30, top: 3, size: 1.5, delay: 0.1 }, { left: 50, top: 2, size: 1, delay: 0.9 },
  { left: 70, top: 98, size: 2, delay: 0.4 }, { left: 90, top: 60, size: 1, delay: 0.6 },
  { left: 14, top: 40, size: 1.5, delay: 1.1 }, { left: 60, top: 90, size: 1, delay: 0.2 },
]

export function FocusOrbit() {
  const { toggleDeepFocusMode } = useDashboardStore()
  const [isRunning, setIsRunning] = useState(false)
  const [selectedTask, setSelectedTask] = useState<typeof orbitalTasks[0] | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(25 * 60) // 25 minutes default
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [completedSessions, setCompletedSessions] = useState<FocusSession[]>([])
  const [orbitalAngles, setOrbitalAngles] = useState<{ [key: number]: number }>(
    Object.fromEntries(orbitalTasks.map(t => [t.id, t.angle]))
  )

  // Orbital animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitalAngles(prev => {
        const newAngles: { [key: number]: number } = {}
        orbitalTasks.forEach(task => {
          newAngles[task.id] = (prev[task.id] + (360 / task.orbitSpeed / 60)) % 360
        })
        return newAngles
      })
    }, 1000 / 60) // 60fps

    return () => clearInterval(interval)
  }, [])

  // Timer countdown
  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          if (selectedTask) {
            setCompletedSessions(s => [...s, {
              taskId: selectedTask.id,
              startTime: new Date(),
              duration: 25 * 60,
              completed: true
            }])
          }
          return 0
        }
        return prev - 1
      })
      setTotalFocusTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeRemaining, selectedTask])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleTaskSelect = (task: typeof orbitalTasks[0]) => {
    setSelectedTask(task)
    setTimeRemaining(25 * 60)
    setIsRunning(false)
  }

  const toggleTimer = () => {
    if (!selectedTask) return
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setTimeRemaining(25 * 60)
    setIsRunning(false)
  }

  const progress = selectedTask ? ((25 * 60 - timeRemaining) / (25 * 60)) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0a192f 0%, #020617 50%, #000 100%)'
      }}
    >
      {/* Star field - using fixed positions */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {focusStarField.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: 0.4,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + star.delay * 2,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Target className="w-7 h-7 text-cyan-400" />
            </motion.div>
            Focus Orbit
          </h1>
          <p className="text-slate-400 text-sm mt-1">Select a task orbit and begin your focus session</p>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="text-slate-400">
              <span className="text-white font-semibold">{formatTime(totalFocusTime)}</span> focused today
            </div>
            <div className="text-slate-400">
              <span className="text-white font-semibold">{completedSessions.length}</span> sessions
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDeepFocusMode}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Orbital System */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative w-[500px] h-[500px]" style={{ perspective: '1000px' }}>
          {/* Outer orbit ring */}
          <div 
            className="absolute rounded-full border border-slate-700/30"
            style={{
              width: 400,
              height: 400,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          
          {/* Inner orbit ring */}
          <div 
            className="absolute rounded-full border border-slate-700/50"
            style={{
              width: 280,
              height: 280,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Orbital tasks */}
          {orbitalTasks.map(task => {
            const angle = orbitalAngles[task.id] * (Math.PI / 180)
            const x = Math.cos(angle) * task.orbitRadius
            const y = Math.sin(angle) * task.orbitRadius * 0.4 // Elliptical orbit
            const z = Math.sin(angle) * 50 // Depth for 3D effect
            const scale = 0.8 + (z + 50) / 100 * 0.4
            const isSelected = selectedTask?.id === task.id
            const Icon = task.icon

            return (
              <motion.button
                key={task.id}
                onClick={() => handleTaskSelect(task)}
                className={cn(
                  "absolute flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  "border backdrop-blur-sm",
                  isSelected 
                    ? "border-white bg-white/20 shadow-lg" 
                    : "border-slate-600/50 bg-slate-900/50 hover:border-slate-500"
                )}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                  zIndex: Math.round(z + 100),
                  boxShadow: isSelected ? `0 0 30px ${task.color}50` : undefined,
                }}
                whileHover={{ scale: scale * 1.1 }}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: task.color }}
                >
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white text-sm font-medium whitespace-nowrap">{task.name}</span>
              </motion.button>
            )
          })}

          {/* Center - Sun/Timer */}
          <div 
            className="absolute rounded-full"
            style={{
              width: 180,
              height: 180,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: selectedTask 
                ? `radial-gradient(circle, ${selectedTask.color}40 0%, ${selectedTask.color}10 50%, transparent 70%)`
                : 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.1) 50%, transparent 70%)',
            }}
          >
            {/* Timer display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="90"
                  cy="90"
                  r="75"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="90"
                  cy="90"
                  r="75"
                  fill="none"
                  stroke={selectedTask?.color || '#3b82f6'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 75}
                  strokeDashoffset={2 * Math.PI * 75 * (1 - progress / 100)}
                  style={{
                    filter: `drop-shadow(0 0 10px ${selectedTask?.color || '#3b82f6'})`,
                  }}
                />
              </svg>

              {/* Time */}
              <motion.div
                key={timeRemaining}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-5xl font-mono font-bold text-white tracking-wider"
                style={{
                  textShadow: selectedTask ? `0 0 30px ${selectedTask.color}` : '0 0 30px #3b82f6',
                }}
              >
                {formatTime(timeRemaining)}
              </motion.div>

              {/* Task name */}
              <p className="text-slate-400 text-sm mt-2">
                {selectedTask?.name || 'Select a task'}
              </p>

              {/* Controls */}
              <div className="flex items-center gap-3 mt-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetTimer}
                  disabled={!selectedTask}
                  className="text-slate-400 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  onClick={toggleTimer}
                  disabled={!selectedTask}
                  className={cn(
                    "rounded-full w-14 h-14",
                    isRunning ? "bg-red-500 hover:bg-red-600" : "bg-cyan-500 hover:bg-cyan-400"
                  )}
                  style={{
                    boxShadow: isRunning ? '0 0 30px rgba(239,68,68,0.5)' : '0 0 30px rgba(6,182,212,0.5)'
                  }}
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Pulsing effect when running */}
          <AnimatePresence>
            {isRunning && selectedTask && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 200,
                  height: 200,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: `2px solid ${selectedTask.color}`,
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom info */}
      <div className="relative z-10 px-8 py-6 flex justify-center">
        <p className="text-xs text-slate-600">
          Press <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400 mx-1">Esc</kbd> or click X to exit Focus Orbit
        </p>
      </div>

      {/* Keyboard handler */}
      <EscapeHandler onEscape={toggleDeepFocusMode} onSpace={toggleTimer} />
    </motion.div>
  )
}

function EscapeHandler({ onEscape, onSpace }: { onEscape: () => void; onSpace: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape()
      if (e.key === ' ' && document.activeElement?.tagName !== 'BUTTON') {
        e.preventDefault()
        onSpace()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onEscape, onSpace])

  return null
}
