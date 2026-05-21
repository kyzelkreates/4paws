// ─────────────────────────────────────────────────────────────
// SESSION RESTORE GATE
// Wraps the entire app. On first mount it silently restores any
// linked device session before rendering routes, preventing a
// flash of the login screen for returning clients.
// ─────────────────────────────────────────────────────────────
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSessionRestore } from '../../hooks/useSessionRestore'

export default function SessionRestoreGate({ children }) {
  const { restoring } = useSessionRestore()

  return (
    <>
      <AnimatePresence>
        {restoring && (
          <motion.div
            key="restore-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9998] bg-charcoal-900 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 mx-auto mb-6 rounded-full border border-transparent"
                style={{ borderTopColor: '#C9A84C', borderRightColor: 'rgba(201,168,76,0.2)' }}
              />
              <div className="font-sans text-[9px] tracking-[0.35em] uppercase text-gold-600">
                Restoring Session
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!restoring && children}
    </>
  )
}
