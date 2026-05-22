// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — AI TEACHER PANEL
// A single, quiet UI surface. Fades in softly. Fades out completely.
// Not a modal. Not a chatbot. Just the system, briefly explaining itself.
//
// ODIN DOCTRINE: One explanation. One action. One optional tip. Nothing else.
// All messages pass through the Narrative Engine (purifyText).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, HelpCircle, ChevronDown } from 'lucide-react'
import { purifyText, MOTION } from '../../ai/narrativeVoice'

// ─────────────────────────────────────────────────────────────────────────────
// TEACHER PANEL — the only UI surface for guidance
// ─────────────────────────────────────────────────────────────────────────────
export function TeacherPanel({ node, onComplete, onSkip, onSkipAll, variant = 'pwa' }) {
  const [tipVisible, setTipVisible] = useState(false)
  if (!node) return null

  const isAdmin = variant === 'admin'

  return (
    <AnimatePresence>
      <motion.div
        key={node.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: MOTION.enter.duration, ease: MOTION.enter.ease }}
        className="relative overflow-hidden"
        style={{
          background:  isAdmin
            ? 'linear-gradient(160deg, rgba(201,168,76,0.05) 0%, rgba(201,168,76,0.01) 100%)'
            : 'linear-gradient(160deg, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 100%)',
          border:      '1px solid rgba(201,168,76,0.14)',
          borderLeft:  '2px solid rgba(201,168,76,0.35)',
        }}
      >
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }} />

        <div className="p-5">
          {/* Header — surface label + dismiss controls */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              {/* Breathing dot — teacher is "present" */}
              <motion.div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: '#C9A84C', boxShadow: '0 0 5px rgba(201,168,76,0.5)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="font-sans text-[8px] uppercase tracking-[0.4em] text-gold-700">
                Orientation
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onSkipAll}
                className="font-sans text-[8px] text-silver-700 hover:text-silver-500 transition-colors px-2 py-1 uppercase tracking-widest">
                Skip all
              </button>
              <button
                onClick={onSkip}
                className="w-7 h-7 flex items-center justify-center text-silver-700 hover:text-silver-400 transition-colors">
                <X size={11} />
              </button>
            </div>
          </div>

          {/* THE THREE LINES — the entire content budget */}

          {/* 1. Explanation */}
          <p className="font-sans text-sm text-silver-300 font-light leading-relaxed mb-3">
            {purifyText(node.explanation)}
          </p>

          {/* 2. Action */}
          <div className="flex items-start gap-2 mb-4 px-3 py-2.5"
            style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0 mt-1.5" />
            <p className="font-sans text-xs text-silver-400 font-light leading-relaxed">
              {purifyText(node.action)}
            </p>
          </div>

          {/* 3. Tip — toggled, never shown by default */}
          {node.tip && (
            <div className="mb-4">
              <button
                onClick={() => setTipVisible(v => !v)}
                className="flex items-center gap-1.5 font-sans text-[8px] uppercase tracking-widest text-silver-700 hover:text-silver-500 transition-colors">
                <ChevronDown size={9}
                  style={{ transform: tipVisible ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                {tipVisible ? 'Hide tip' : 'Show tip'}
              </button>
              <AnimatePresence>
                {tipVisible && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={MOTION.expand}
                    className="font-sans text-[10px] text-silver-600 font-light leading-relaxed italic mt-2 overflow-hidden">
                    {purifyText(node.tip)}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Confirm understood */}
          <motion.button
            onClick={onComplete}
            whileTap={MOTION.tap}
            className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.3em] transition-all duration-200 px-4 py-2"
            style={{ border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C', background: 'rgba(201,168,76,0.04)' }}
          >
            <CheckCircle size={11} />
            Understood
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HELP TRIGGER — the "?" button shown in layouts to re-activate guidance
// Completely invisible until hovered. Zero visual noise.
// ─────────────────────────────────────────────────────────────────────────────
export function HelpTrigger({ onClick, label = 'Orientation' }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ opacity: 1 }}
      whileTap={MOTION.tap}
      className="flex items-center gap-1.5 transition-all duration-300"
      style={{ opacity: 0.35 }}
      title={label}
    >
      <HelpCircle size={13} className="text-silver-600" />
      <span className="font-sans text-[8px] uppercase tracking-widest text-silver-700 hidden lg:inline">
        {label}
      </span>
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HELP CENTRE DRAWER — resumable guidance list (accessible via HelpTrigger)
// ─────────────────────────────────────────────────────────────────────────────
export function HelpCentre({ surface, resumable, completed, progress, onResume, onClose, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: MOTION.enter.duration, ease: MOTION.enter.ease }}
      className="fixed top-0 right-0 bottom-0 w-80 z-50 overflow-y-auto"
      style={{ background: 'rgba(6,6,6,0.97)', borderLeft: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-gold-700 mb-0.5">System Orientation</div>
            <div className="font-serif text-base font-medium text-pearl">Help Centre</div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-silver-600 hover:text-silver-300 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6 p-4"
          style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-[8px] uppercase tracking-widest text-gold-700">Orientation Progress</span>
            <span className="font-mono text-[10px] text-gold-500">{progress.completed}/{progress.total}</span>
          </div>
          <div className="h-0.5 bg-white/5 overflow-hidden">
            <motion.div className="h-full bg-gold-500"
              initial={{ width: 0 }}
              animate={{ width: `${(progress.completed / Math.max(progress.total, 1)) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }} />
          </div>
        </div>

        {/* Resumable guidance */}
        {resumable.length > 0 && (
          <div className="mb-6">
            <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-silver-700 mb-3">Available Guidance</div>
            <div className="space-y-2">
              {resumable.map(node => (
                <motion.button key={node.id}
                  onClick={() => onResume(node)}
                  whileHover={{ borderColor: 'rgba(201,168,76,0.3)' }}
                  whileTap={MOTION.tap}
                  className="w-full text-left p-4 transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="font-sans text-xs text-silver-400 leading-relaxed line-clamp-2 font-light">
                    {purifyText(node.explanation)}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Completed nodes */}
        {completed.length > 0 && (
          <div className="mb-6">
            <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-silver-700 mb-3">Completed</div>
            <div className="space-y-1.5">
              {completed.map(node => (
                <div key={node.id} className="flex items-center gap-2 py-1.5">
                  <CheckCircle size={11} className="text-emerald-500 flex-shrink-0" />
                  <span className="font-sans text-[10px] text-silver-600 font-light leading-snug">
                    {purifyText(node.explanation).split('.')[0]}.
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset option */}
        <div className="border-t border-white/5 pt-5 mt-2">
          <button onClick={onReset}
            className="font-sans text-[9px] text-silver-700 hover:text-silver-500 transition-colors uppercase tracking-widest">
            Restart orientation
          </button>
        </div>
      </div>
    </motion.div>
  )
}
