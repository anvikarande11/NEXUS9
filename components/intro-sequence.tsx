'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  angle: number
  speed: number
}

// Particle component with burst animation
const Particle: React.FC<{ particle: Particle }> = ({ particle }) => {
  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: Math.cos(particle.angle) * particle.speed * 120,
        y: Math.sin(particle.angle) * particle.speed * 120,
        opacity: 0,
        scale: 0,
      }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="absolute w-1.5 h-1.5 bg-white rounded-full pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        marginLeft: '-3px',
        marginTop: '-3px',
      }}
    />
  )
}

// Expanding ring effect
const ExpandingRing: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 5, opacity: 0 }}
      transition={{ duration: 0.9, delay, ease: 'easeOut' }}
      className="absolute w-20 h-20 border-2 border-white rounded-full pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        marginLeft: '-40px',
        marginTop: '-40px',
      }}
    />
  )
}

// Font cycles for triple-font twist effect
const fontCycles = [
  'font-serif', // Bold Serif
  'font-mono',  // Futuristic Monospace
  'font-sans',  // Clean Sans-Serif
]

interface LetterProps {
  letter: string
  index: number
  totalLetters: number
  onComplete?: () => void
  finalPositions: { x: number; y: number }[]
}

const Letter: React.FC<LetterProps> = ({ letter, index, totalLetters, onComplete, finalPositions }) => {
  const [particles, setParticles] = useState<Particle[]>([])
  const [fontIndex, setFontIndex] = useState(0)
  const burstTriggeredRef = useRef(false)
  const letterDelay = index * 0.18

  // Font cycling effect (150ms total)
  useEffect(() => {
    const cycleStartTime = letterDelay * 1000
    const timeoutId = setTimeout(() => {
      let currentFontIndex = 0
      const cycleDuration = 50 // 50ms per font
      
      const cycleInterval = setInterval(() => {
        currentFontIndex = (currentFontIndex + 1) % fontCycles.length
        setFontIndex(currentFontIndex)
      }, cycleDuration)

      // Stop cycling after 150ms
      setTimeout(() => {
        clearInterval(cycleInterval)
        setFontIndex(0) // Settle on serif
      }, 150)
    }, cycleStartTime)

    return () => clearTimeout(timeoutId)
  }, [letterDelay])

  // Particle burst effect
  useEffect(() => {
    const burstDelay = letterDelay + 0.35
    const timeoutId = setTimeout(() => {
      if (!burstTriggeredRef.current) {
        burstTriggeredRef.current = true
        const particleCount = 16
        const newParticles: Particle[] = []
        
        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2
          newParticles.push({
            id: i,
            angle,
            speed: 0.7 + Math.random() * 0.5,
          })
        }
        setParticles(newParticles)

        // Call onComplete when last letter finishes bursting
        if (index === totalLetters - 1 && onComplete) {
          setTimeout(onComplete, 800)
        }
      }
    }, burstDelay * 1000)

    return () => clearTimeout(timeoutId)
  }, [index, totalLetters, onComplete, letterDelay])

  // Final position for snapping animation
  const finalPos = finalPositions[index]

  return (
    <div className="relative inline-block" style={{ perspective: '1000px' }}>
      {/* Letter with spring pop and font cycling */}
      <motion.div
        className="relative"
        initial={{
          opacity: 0,
          scale: 0,
          y: 40,
          rotateX: -90,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
        }}
        transition={{
          delay: letterDelay,
          duration: 0.6,
          type: 'spring',
          stiffness: 240,
          damping: 14,
          mass: 0.8,
        }}
        // Snap to final position after all letters pop
        onAnimationComplete={() => {
          // This will be handled by parent snap animation
        }}
      >
        {/* Letter text with font cycling */}
        <div className={`text-9xl font-bold text-white drop-shadow-2xl ${fontCycles[fontIndex]} transition-all duration-75 font-extrabold tracking-wider`}>
          {letter}
        </div>

        {/* Soft shadow glow */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{
            opacity: [0, 1, 0.5],
            filter: 'blur(20px)',
          }}
          transition={{
            delay: letterDelay,
            duration: 0.8,
          }}
          className="absolute inset-0 bg-white -z-10 blur-2xl"
          style={{
            filter: 'blur(30px)',
            opacity: 0.4,
          }}
        />

        {/* Particles burst */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {particles.map((particle) => (
            <Particle key={particle.id} particle={particle} />
          ))}
        </div>

        {/* Expanding rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <ExpandingRing delay={letterDelay + 0.15} />
          <ExpandingRing delay={letterDelay + 0.3} />
        </div>

        {/* Jiggle after burst */}
        <motion.div
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, -4, 4, -3, 3, -2, 2, -1, 1, 0],
            y: [0, 3, -3, 2, -2, 1, -1, 1, -1, 0],
          }}
          transition={{
            delay: letterDelay + 0.5,
            duration: 0.35,
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
            ease: 'easeInOut',
          }}
          className="absolute inset-0 pointer-events-none"
        />
      </motion.div>
    </div>
  )
}

interface IntroSequenceProps {
  onComplete: () => void
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [showLetters, setShowLetters] = useState(false)
  const [snappedLetters, setSnappedLetters] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [letterPositions, setLetterPositions] = useState<{ x: number; y: number }[]>([])

  const title = 'NEXUS-UNI'

  // Calculate final positions for snapping
  useEffect(() => {
    if (containerRef.current && showLetters) {
      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      // Calculate final positions where letters snap together
      const positions = title.split('').map((_, i) => {
        const letterWidth = 70 // Approximate width of each letter
        const totalWidth = title.length * letterWidth * 0.5
        const startX = centerX - totalWidth / 2
        return {
          x: startX + i * letterWidth * 0.5,
          y: centerY,
        }
      })
      
      setLetterPositions(positions)
    }
  }, [showLetters, title])

  // Trigger letters to show
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLetters(true)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [])

  // Handle letter completion and snapping
  const handleLettersComplete = () => {
    setTimeout(() => {
      setSnappedLetters(true)
      // Scale up and fade out after snap
      setTimeout(() => {
        onComplete()
      }, 400)
    }, 200)
  }

  return (
    <AnimatePresence mode="wait">
      {!snappedLetters ? (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 flex items-center justify-center overflow-hidden"
          style={{ background: '#E3F2FD' }}
          initial={{ opacity: 1 }}
          exit={{
            scale: 1.2,
            opacity: 0,
            transition: { duration: 0.5, ease: 'easeInOut' },
          }}
        >
          {/* Animated spotlight background */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
              filter: 'blur(60px)',
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />

          {/* Kinetic Typography - Letters pop in sequence */}
          {showLetters && (
            <motion.div
              className="relative z-10 flex justify-center items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {title.split('').map((letter, index) => (
                <Letter
                  key={index}
                  letter={letter}
                  index={index}
                  totalLetters={title.length}
                  onComplete={index === title.length - 1 ? handleLettersComplete : undefined}
                  finalPositions={letterPositions}
                />
              ))}
            </motion.div>
          )}

          {/* Decorative elements - subtle background */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(160, 211, 232, 0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              top: '20%',
              left: '15%',
              filter: 'blur(40px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '350px',
              height: '350px',
              background: 'radial-gradient(circle, rgba(192, 230, 240, 0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              bottom: '15%',
              right: '10%',
              filter: 'blur(40px)',
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 0.5,
            }}
          />
        </motion.div>
      ) : (
        // Final logo state before fade to dashboard
        <motion.div
          className="fixed inset-0 flex items-center justify-center overflow-hidden"
          style={{ background: '#E3F2FD' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-7xl font-serif font-bold text-white drop-shadow-2xl"
          >
            NEXUS-UNI
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
