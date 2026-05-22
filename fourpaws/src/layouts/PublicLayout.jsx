import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

// Public layout — minimal shell (no nav; this app is admin/client access only)
export default function PublicLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-charcoal-900">
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
