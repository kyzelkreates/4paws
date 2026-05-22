// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — CINEMATIC LOADING SCREEN
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_PHRASES = [
  'Initialising intelligence core…',
  'Loading behavioural profiles…',
  'Calibrating emotional engine…',
  'Preparing your concierge experience…',
  'Synchronising wellness data…',
  'Engaging digital twin…',
]

export default function LoadingScreen({ label, showProgress = false }) {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [progress,  setProgress]  = useState(0)

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setPhraseIdx(i => (i + 1) % BOOT_PHRASES.length)
    }, 900)

    const progressTimer = showProgress
      ? setInterval(() => {
          setProgress(p => Math.min(p + Math.random() * 18, 95))
        }, 400)
      : null

    return () => {
      clearInterval(phraseTimer)
      if (progressTimer) clearInterval(progressTimer)
    }
  }, [showProgress])

  const displayLabel = label || BOOT_PHRASES[phraseIdx]

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#080808' }}>

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute inset-0"
          animate={{ background: [
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
            'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
          ]}}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Fine grid */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Core spinner */}
      <motion.div
        className="relative mb-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Outer gold ring */}
        <motion.div
          className="w-20 h-20 rounded-full border-2 absolute inset-0"
          style={{ borderColor: 'transparent', borderTopColor: '#C9A84C', borderRightColor: 'rgba(201,168,76,0.3)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner silver ring */}
        <motion.div
          className="w-20 h-20 rounded-full border absolute inset-0"
          style={{ borderColor: 'transparent', borderBottomColor: 'rgba(201,168,76,0.2)', borderLeftColor: 'rgba(201,168,76,0.1)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        {/* Centre */}
        <div className="w-20 h-20 flex items-center justify-center relative">
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-lg">🐾</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Brand */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="font-display text-xl font-light tracking-[0.3em] text-pearl uppercase mb-1">Four Paws</div>
        <div className="font-sans text-[9px] tracking-[0.5em] uppercase text-gold-700">Elite Academy</div>
      </motion.div>

      {/* Scanning line */}
      <motion.div className="w-48 h-px mb-6 relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div className="absolute top-0 bottom-0 w-1/2 h-full"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Animated phrase */}
      <AnimatePresence mode="wait">
        <motion.p
          key={phraseIdx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.35 }}
          className="font-sans text-[10px] text-silver-700 tracking-widest uppercase text-center max-w-xs"
        >
          {displayLabel}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      {showProgress && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48">
          <div className="h-px bg-white/5 overflow-hidden">
            <motion.div className="h-full"
              style={{ background: 'linear-gradient(90deg, #C9A84C, #F5E09A)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="font-mono text-[9px] text-silver-800 mt-1 text-right">{Math.round(progress)}%</div>
        </div>
      )}

      {/* Bottom intelligence label */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div className="w-1 h-1 rounded-full bg-gold-700"
          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <span className="font-sans text-[8px] text-silver-800 tracking-[0.4em] uppercase">Intelligence Core Active</span>
        <motion.div className="w-1 h-1 rounded-full bg-gold-700"
          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
      </motion.div>
    </div>
  )
}
