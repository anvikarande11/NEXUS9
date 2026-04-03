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
      initial={{ x: 0, y: 0, opacity: 0.6, scale: 1 }}
      animate={{
        x: Math.cos(particle.angle) * particle.speed * 70,
        y: Math.sin(particle.angle) * particle.speed * 70,
        opacity: 0,
        scale: 0.2,
      }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
      className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        marginLeft: '-3px',
        marginTop: '-3px',
        background: 'rgba(30, 58, 95, 0.6)',
      }}
    />
  )
}

// Expanding ring effect - softer and slower
const ExpandingRing: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0.4 }}
      animate={{ scale: 2.5, opacity: 0 }}
      transition={{ duration: 1.6, delay, ease: 'easeOut' }}
      className="absolute w-16 h-16 rounded-full pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        marginLeft: '-32px',
        marginTop: '-32px',
        border: '1px solid rgba(30, 58, 95, 0.4)',
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
  // Slower letter delay - increased from 0.18 to 0.35 for softer animation
  const letterDelay = index * 0.35

  // Font cycling effect (300ms total - slower and softer)
  useEffect(() => {
    const cycleStartTime = letterDelay * 1000
    const timeoutId = setTimeout(() => {
      let currentFontIndex = 0
      const cycleDuration = 100 // 100ms per font (slower)
      
      const cycleInterval = setInterval(() => {
        currentFontIndex = (currentFontIndex + 1) % fontCycles.length
        setFontIndex(currentFontIndex)
      }, cycleDuration)

      // Stop cycling after 300ms (slower)
      setTimeout(() => {
        clearInterval(cycleInterval)
        setFontIndex(0) // Settle on serif
      }, 300)
    }, cycleStartTime)

    return () => clearTimeout(timeoutId)
  }, [letterDelay])

  // Particle burst effect - softer and slower
  useEffect(() => {
    const burstDelay = letterDelay + 0.6
    const timeoutId = setTimeout(() => {
      if (!burstTriggeredRef.current) {
        burstTriggeredRef.current = true
        const particleCount = 12 // fewer particles for softer effect
        const newParticles: Particle[] = []
        
        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2
          newParticles.push({
            id: i,
            angle,
            speed: 0.4 + Math.random() * 0.3, // slower speed
          })
        }
        setParticles(newParticles)

        // Call onComplete when last letter finishes bursting
        if (index === totalLetters - 1 && onComplete) {
          setTimeout(onComplete, 1200) // longer delay for smoother transition
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
          duration: 1.0,
          type: 'spring',
          stiffness: 120,
          damping: 18,
          mass: 1.2,
        }}
        // Snap to final position after all letters pop
        onAnimationComplete={() => {
          // This will be handled by parent snap animation
        }}
      >
        {/* Letter text with font cycling */}
        <div 
          className={`text-9xl font-bold drop-shadow-2xl ${fontCycles[fontIndex]} transition-all duration-100 font-extrabold tracking-wider`}
          style={{ color: '#1e3a5f', textShadow: '0 4px 20px rgba(30, 58, 95, 0.3)' }}
        >
          {letter}
        </div>

        {/* Soft shadow glow */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{
            opacity: [0, 0.6, 0.3],
            filter: 'blur(25px)',
          }}
          transition={{
            delay: letterDelay,
            duration: 1.2,
          }}
          className="absolute inset-0 -z-10 blur-2xl"
          style={{
            background: 'rgba(30, 58, 95, 0.3)',
            filter: 'blur(35px)',
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

        {/* Jiggle after burst - softer and gentler */}
        <motion.div
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, -2, 2, -1.5, 1.5, -1, 1, 0],
            y: [0, 1.5, -1.5, 1, -1, 0.5, -0.5, 0],
          }}
          transition={{
            delay: letterDelay + 0.8,
            duration: 0.6,
            times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
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
          style={{ background: '#C5D8F0' }}
          initial={{ opacity: 1 }}
          exit={{
            scale: 1.2,
            opacity: 0,
            transition: { duration: 0.5, ease: 'easeInOut' },
          }}
        >
          {/* Animated spotlight background - subtle blue glow */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(200,220,240,0.1) 50%, transparent 70%)',
              filter: 'blur(70px)',
            }}
            animate={{
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{
              duration: 5,
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

          {/* Decorative elements - subtle background with blue tones */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(100, 140, 180, 0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              top: '20%',
              left: '15%',
              filter: 'blur(50px)',
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '350px',
              height: '350px',
              background: 'radial-gradient(circle, rgba(80, 120, 170, 0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              bottom: '15%',
              right: '10%',
              filter: 'blur(50px)',
            }}
            animate={{
              scale: [1.15, 1, 1.15],
              opacity: [0.3, 0.15, 0.3],
            }}
            transition={{
              duration: 7,
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
          style={{ background: '#C5D8F0' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-7xl font-serif font-bold drop-shadow-2xl"
            style={{ color: '#1e3a5f', textShadow: '0 4px 20px rgba(30, 58, 95, 0.3)' }}
          >
            NEXUS-UNI
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
