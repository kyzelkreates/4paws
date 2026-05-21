import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import PublicNav from '../components/navigation/PublicNav'

export default function PublicLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-charcoal-900">
      <PublicNav />
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
