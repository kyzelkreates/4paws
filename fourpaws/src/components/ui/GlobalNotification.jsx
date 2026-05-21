import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const icons = {
  success: <CheckCircle size={18} className="text-emerald-400" />,
  error: <AlertCircle size={18} className="text-red-400" />,
  info: <Info size={18} className="text-gold-500" />,
}

export default function GlobalNotification() {
  const { state, dispatch, ACTIONS } = useApp()
  const { notification } = state

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-6 right-6 z-[9999] max-w-sm"
        >
          <div className="glass-card gold-border rounded-none p-4 flex items-start gap-3 min-w-[280px]">
            {icons[notification.type] || icons.info}
            <p className="font-sans text-sm font-light text-silver-200 flex-1">{notification.message}</p>
            <button
              onClick={() => dispatch({ type: ACTIONS.CLEAR_NOTIFICATION })}
              className="text-silver-600 hover:text-silver-300 transition-colors ml-2"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
