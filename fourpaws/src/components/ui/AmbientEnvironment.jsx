// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — DYNAMIC AMBIENT ENVIRONMENT SYSTEM
// Living visual environments. Time-of-day awareness. Emotional atmosphere.
// Seasonal ambience. Recovery state influence. Fully offline.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurrentSeason, getSeasonalTheme } from '../../ai/seasonalThemes'

// ─────────────────────────────────────────────────────────────────────────────
// TIME OF DAY DETECTION
// ─────────────────────────────────────────────────────────────────────────────
function getTimeOfDay() {
  const h = new Date().getHours()
  if (h >= 5  && h < 9)  return 'dawn'
  if (h >= 9  && h < 12) return 'morning'
  if (h >= 12 && h < 15) return 'midday'
  if (h >= 15 && h < 18) return 'afternoon'
  if (h >= 18 && h < 21) return 'dusk'
  if (h >= 21 || h < 1)  return 'evening'
  return 'night'
}

// ─────────────────────────────────────────────────────────────────────────────
// ENVIRONMENT PALETTES — time × emotional state
// ─────────────────────────────────────────────────────────────────────────────
const TIME_PALETTES = {
  dawn:      { primary: '#F97316', secondary: '#FB923C', accent: '#FED7AA', label: 'Dawn' },
  morning:   { primary: '#C9A84C', secondary: '#F59E0B', accent: '#FEF3C7', label: 'Morning' },
  midday:    { primary: '#B8C8FF', secondary: '#93C5FD', accent: '#DBEAFE', label: 'Midday' },
  afternoon: { primary: '#C9A84C', secondary: '#A78BFA', accent: '#EDE9FE', label: 'Afternoon' },
  dusk:      { primary: '#F97316', secondary: '#C9A84C', accent: '#FEF3C7', label: 'Dusk' },
  evening:   { primary: '#8B5CF6', secondary: '#6D28D9', accent: '#DDD6FE', label: 'Evening' },
  night:     { primary: '#6B7280', secondary: '#374151', accent: '#F9FAFB', label: 'Night' },
}

const EMOTIONAL_TINTS = {
  serene:     'rgba(16,185,129,0.04)',
  settled:    'rgba(6,182,212,0.03)',
  alert:      'rgba(245,158,11,0.04)',
  aroused:    'rgba(239,68,68,0.05)',
  anxious:    'rgba(239,68,68,0.07)',
  reactive:   'rgba(239,68,68,0.08)',
  recovering: 'rgba(139,92,246,0.04)',
  optimising: 'rgba(201,168,76,0.05)',
  stable:     'rgba(16,185,129,0.04)',
  elevated:   'rgba(245,158,11,0.05)',
  stressed:   'rgba(239,68,68,0.06)',
}

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT ORB — animated soft glow element
// ─────────────────────────────────────────────────────────────────────────────
function AmbientOrb({ colour, size, x, y, duration, opacity = 1 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        left: `${x}%`, top: `${y}%`,
        background: `radial-gradient(circle, ${colour} 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        opacity,
      }}
      animate={{
        x: [0, 20, -10, 0],
        y: [0, -15, 10, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatType: 'mirror',
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE SYSTEM — subtle floating particles for premium feel
// ─────────────────────────────────────────────────────────────────────────────
function FloatingParticles({ colour, count = 6 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
    })), [count])

  return (
    <>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            background: colour,
            opacity: 0,
          }}
          animate={{
            y: [0, -80, -160],
            opacity: [0, 0.6, 0],
            x: [0, (Math.random() - 0.5) * 40],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT ENVIRONMENT WRAPPER
// Wrap any page to give it a living, breathing atmosphere.
// ─────────────────────────────────────────────────────────────────────────────
export function AmbientEnvironment({ emotionalState, children, intensity = 'normal' }) {
  const [time, setTime] = useState(getTimeOfDay)

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeOfDay()), 60000)
    return () => clearInterval(interval)
  }, [])

  const palette  = TIME_PALETTES[time] || TIME_PALETTES.morning
  const season   = getCurrentSeason()
  const seasonal = getSeasonalTheme(season)
  const emoTint  = EMOTIONAL_TINTS[emotionalState] || 'transparent'

  const intensityMultiplier = { subtle: 0.5, normal: 1, rich: 1.5 }[intensity] || 1

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base environment gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={time}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${palette.primary}08 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* Emotional tint overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ background: emoTint }}
        transition={{ duration: 3 }}
      />

      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AmbientOrb
          colour={`${palette.primary}10`}
          size={400 * intensityMultiplier}
          x={20} y={10}
          duration={18}
          opacity={0.8}
        />
        <AmbientOrb
          colour={`${palette.secondary}08`}
          size={300 * intensityMultiplier}
          x={80} y={30}
          duration={22}
          opacity={0.6}
        />
        <AmbientOrb
          colour={`${palette.primary}06`}
          size={200 * intensityMultiplier}
          x={50} y={70}
          duration={15}
          opacity={0.5}
        />

        {/* Seasonal accent */}
        {seasonal?.accentColour && (
          <AmbientOrb
            colour={`${seasonal.accentColour}06`}
            size={250}
            x={70} y={80}
            duration={25}
            opacity={0.4}
          />
        )}

        {/* Floating particles */}
        <FloatingParticles colour={`${palette.primary}60`} count={4} />
      </div>

      {/* Grid pattern overlay — ultra subtle */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${palette.primary}08 1px, transparent 1px), linear-gradient(90deg, ${palette.primary}08 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          opacity: 0.3 * intensityMultiplier,
        }}
      />

      {/* Time-of-day indicator — whisper label */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <span className="font-sans text-[7px] uppercase tracking-[0.4em]"
          style={{ color: `${palette.primary}40` }}>
          {palette.label}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT BANNER — inline ambient strip for page headers
// ─────────────────────────────────────────────────────────────────────────────
export function AmbientBanner({ emotionalState, height = 120 }) {
  const time    = getTimeOfDay()
  const palette = TIME_PALETTES[time] || TIME_PALETTES.morning
  const emoTint = EMOTIONAL_TINTS[emotionalState] || 'transparent'

  return (
    <div className="relative overflow-hidden" style={{ height }}>
      <div className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${palette.primary}10 0%, ${palette.secondary}06 50%, transparent 100%)`,
        }} />
      <div className="absolute inset-0" style={{ background: emoTint }} />
      <div className="absolute inset-0">
        <AmbientOrb colour={`${palette.primary}15`} size={200} x={10} y={50} duration={12} />
        <AmbientOrb colour={`${palette.secondary}10`} size={150} x={80} y={30} duration={16} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// useAmbientEnvironment HOOK — returns current environment context
// ─────────────────────────────────────────────────────────────────────────────
export function useAmbientEnvironment(emotionalState) {
  const [time, setTime] = useState(getTimeOfDay)
  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeOfDay()), 60000)
    return () => clearInterval(interval)
  }, [])

  const palette  = TIME_PALETTES[time] || TIME_PALETTES.morning
  const emoTint  = EMOTIONAL_TINTS[emotionalState] || 'transparent'
  const season   = getCurrentSeason()
  const seasonal = getSeasonalTheme(season)

  return { time, palette, emoTint, season, seasonal }
}

export default AmbientEnvironment
