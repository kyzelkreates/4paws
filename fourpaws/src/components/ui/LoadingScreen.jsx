import React from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-charcoal-900 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-transparent"
              style={{ borderTopColor: '#C9A84C', borderRightColor: 'rgba(201,168,76,0.3)' }}
            />
            <div className="absolute inset-2 rounded-full bg-charcoal-800 flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="section-label"
        >
          Four Paws Academy
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '120px' }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
          className="h-px bg-gold-gradient mx-auto mt-4"
        />
      </div>
    </div>
  )
}
