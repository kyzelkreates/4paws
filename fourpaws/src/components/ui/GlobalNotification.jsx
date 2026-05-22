// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — LUXURY CONCIERGE NOTIFICATION SYSTEM
// Replaces standard toast UI with elite concierge-grade notifications.
// Subtle, premium, non-intrusive — consistent with platform voice.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { CheckCircle, AlertCircle, Info, X, Brain } from 'lucide-react'
import { SOUNDS } from '../../ai/intelligenceCore'
import { filterNotification, purifyText } from '../../ai/narrativeVoice'

const CONFIG = {
  success: {
    icon:        CheckCircle,
    iconColour:  '#10B981',
    border:      'rgba(16,185,129,0.25)',
    glow:        'rgba(16,185,129,0.06)',
    label:       'Confirmed',
    sound:       'complete',
  },
  error: {
    icon:        AlertCircle,
    iconColour:  '#EF4444',
    border:      'rgba(239,68,68,0.25)',
    glow:        'rgba(239,68,68,0.06)',
    label:       'Note',
    sound:       'error',
  },
  info: {
    icon:        Info,
    iconColour:  '#C9A84C',
    border:      'rgba(201,168,76,0.3)',
    glow:        'rgba(201,168,76,0.06)',
    label:       '',
    sound:       'notification',
  },
  intelligence: {
    icon:        Brain,
    iconColour:  '#8B5CF6',
    border:      'rgba(139,92,246,0.3)',
    glow:        'rgba(139,92,246,0.06)',
    label:       '',
    sound:       'notification',
  },
}

export default function GlobalNotification() {
  const { state, dispatch, ACTIONS } = useApp()
  const { notification } = state

  useEffect(() => {
    if (!notification) return
    const cfg = CONFIG[notification.type] || CONFIG.info
    SOUNDS[cfg.sound]?.()
    const timer = setTimeout(() => {
      dispatch({ type: ACTIONS.CLEAR_NOTIFICATION })
    }, 5500)
    return () => clearTimeout(timer)
  }, [notification?.id])

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, x: 40, y: -6 }}
          animate={{ opacity: 1, x: 0,  y: 0  }}
          exit={{ opacity: 0, x: 40, scale: 0.96 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-5 right-5 z-[9999] max-w-sm min-w-[300px]"
        >
          {(() => {
            const cfg = CONFIG[notification.type] || CONFIG.info
            const Icon = cfg.icon
            return (
              <div className="relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${cfg.glow} 0%, rgba(12,12,12,0.95) 100%)`,
                  border: `1px solid ${cfg.border}`,
                  backdropFilter: 'blur(16px)',
                  boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)`,
                }}>

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${cfg.border}, transparent)` }} />

                {/* Progress bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5"
                  style={{ background: cfg.iconColour + '60' }}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5.3, ease: 'linear' }}
                />

                <div className="flex items-start gap-3 p-4">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: cfg.iconColour + '12', border: `1px solid ${cfg.iconColour}30` }}>
                    <Icon size={13} style={{ color: cfg.iconColour }} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="font-sans text-[8px] uppercase tracking-[0.3em] mb-1"
                      style={{ color: cfg.iconColour }}>{cfg.label}</div>
                    <p className="font-sans text-xs font-light text-silver-300 leading-relaxed">
                      {purifyText(notification.message || '')}
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch({ type: ACTIONS.CLEAR_NOTIFICATION })}
                    className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-silver-700 hover:text-silver-400 transition-colors mt-0.5">
                    <X size={11} />
                  </button>
                </div>
              </div>
            )
          })()}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
