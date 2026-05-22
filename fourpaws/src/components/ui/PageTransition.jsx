// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — CINEMATIC PAGE TRANSITIONS
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { SOUNDS } from '../../ai/intelligenceCore'

// ── Transition variants ───────────────────────────────────────────────────────
const TRANSITIONS = {
  // Standard — elegant fade up
  default: {
    initial:  { opacity: 0, y: 16, filter: 'blur(4px)' },
    animate:  { opacity: 1, y: 0,  filter: 'blur(0px)' },
    exit:     { opacity: 0, y: -8, filter: 'blur(2px)' },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  // Academy pages — cinematic
  academy: {
    initial:  { opacity: 0, y: 22, scale: 0.99, filter: 'blur(6px)' },
    animate:  { opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)' },
    exit:     { opacity: 0, y: -10, scale: 1.005, filter: 'blur(3px)' },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  // Public pages — slower, cinematic
  public: {
    initial:  { opacity: 0, y: 30, filter: 'blur(8px)' },
    animate:  { opacity: 1, y: 0,  filter: 'blur(0px)' },
    exit:     { opacity: 0, filter: 'blur(4px)' },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

function getTransitionVariant(pathname) {
  if (pathname.startsWith('/academy') || pathname.startsWith('/admin')) return TRANSITIONS.academy
  return TRANSITIONS.public
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE TRANSITION WRAPPER
// Wrap individual page content or use as a layout wrapper.
// ─────────────────────────────────────────────────────────────────────────────
export function PageTransition({ children, className = '' }) {
  const location = useLocation()
  const variant  = getTransitionVariant(location.pathname)

  useEffect(() => {
    // Subtle transition sound — only for academy navigation
    if (location.pathname.startsWith('/academy')) {
      SOUNDS.transition()
    }
  }, [location.pathname])

  return (
    <motion.div
      key={location.pathname}
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={variant.transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED PRESENCE WRAPPER — wraps Routes in AnimatePresence
// ─────────────────────────────────────────────────────────────────────────────
export function AnimatedRoutes({ children }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      {React.cloneElement(children, { key: location.pathname })}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION ENTRANCE — staggered content reveal
// ─────────────────────────────────────────────────────────────────────────────
export function SectionEntrance({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD ENTRANCE — individual card pop-in
// ─────────────────────────────────────────────────────────────────────────────
export function CardEntrance({ children, index = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INTELLIGENCE LOADING — elegant AI "thinking" animation
// ─────────────────────────────────────────────────────────────────────────────
export function IntelligenceLoader({ label = 'Analysing intelligence profile…', size = 'standard' }) {
  const isSmall = size === 'small'

  return (
    <div className={`flex flex-col items-center justify-center ${isSmall ? 'py-4' : 'py-12'}`}>
      <div className={`relative ${isSmall ? 'w-10 h-10' : 'w-16 h-16'} mb-4`}>
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: 'rgba(201,168,76,0.3)', borderTopColor: '#C9A84C' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute inset-1.5 rounded-full border"
          style={{ borderColor: 'rgba(201,168,76,0.15)', borderBottomColor: 'rgba(201,168,76,0.5)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        {/* Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: '#C9A84C' }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {label && (
        <motion.p
          className="font-sans text-[10px] text-silver-600 tracking-widest uppercase text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {label}
        </motion.p>
      )}

      {/* Pulsing dots */}
      <div className="flex items-center gap-1.5 mt-3">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-1 h-1 rounded-full bg-gold-700"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT GLOW ORBS — living background decoration
// ─────────────────────────────────────────────────────────────────────────────
export function AmbientOrbs({ count = 3, colour = 'rgba(201,168,76,0.04)', className = '' }) {
  const orbs = Array.from({ length: count }, (_, i) => ({
    w:     200 + i * 120,
    x:     10 + i * 30,
    y:     5 + i * 25,
    dur:   6 + i * 2,
    delay: i * 1.5,
  }))

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {orbs.map((o, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width:  o.w, height: o.w,
            left:   `${o.x}%`, top: `${o.y}%`,
            background: `radial-gradient(circle, ${colour} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.12, 1], x: [0, i % 2 ? 15 : -15, 0], y: [0, -12, 0] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut', delay: o.delay }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MILESTONE REVEAL — cinematic unlock sequence
// ─────────────────────────────────────────────────────────────────────────────
export function MilestoneReveal({ title, subtitle, icon, onClose, colour = '#C9A84C' }) {
  useEffect(() => {
    SOUNDS.unlock()
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      {/* Particle burst */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <motion.div key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ left: '50%', top: '50%', background: colour }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((i / 16) * Math.PI * 2) * (80 + Math.random() * 120),
              y: Math.sin((i / 16) * Math.PI * 2) * (80 + Math.random() * 120),
              opacity: 0, scale: 0,
            }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-center max-w-sm mx-6 p-10"
        style={{
          background: 'linear-gradient(135deg, #0D0D0A 0%, #151510 100%)',
          border: `1px solid ${colour}40`,
          boxShadow: `0 0 60px ${colour}20, 0 0 120px ${colour}08`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${colour}, transparent)` }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${colour}60, transparent)` }} />

        <motion.div
          className="text-6xl mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {icon}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="font-sans text-[9px] uppercase tracking-[0.4em] mb-3" style={{ color: colour }}>
            Intelligence Core
          </div>
          <h2 className="luxury-heading text-2xl mb-3">{title}</h2>
          {subtitle && (
            <p className="font-sans text-sm font-light text-silver-400 leading-relaxed">{subtitle}</p>
          )}
        </motion.div>

        <motion.div
          className="mt-6 h-px w-16 mx-auto"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ background: `linear-gradient(90deg, transparent, ${colour}, transparent)` }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="font-sans text-[9px] text-silver-700 mt-4 tracking-widest"
        >
          Touch to continue
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
