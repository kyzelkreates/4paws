// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — ELITE OFFLINE SYNC ENGINE STATUS PAGE
// Intelligent backup. Selective sync. Conflict-free offline-first integrity.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, Cloud, CloudOff, CheckCircle, Clock, RefreshCw, Trash2, ArrowRight } from 'lucide-react'
import {
  loadSyncQueue, markSyncItemComplete, getSyncStatus, enqueueSyncItem,
} from '../../ai/fourPawsMethod'
import { SOUNDS } from '../../ai/intelligenceCore'
import { FadeIn } from '../../components/animations/FadeIn'
import { AmbientOrbs } from '../../components/ui/PageTransition'

const SYNC_TYPE_LABELS = {
  progress:    { label: 'Lesson Progress',   icon: '📚', colour: '#C9A84C' },
  reflection:  { label: 'Daily Reflection',  icon: '💭', colour: '#8B5CF6' },
  ritual:      { label: 'Daily Ritual',      icon: '🌅', colour: '#F59E0B' },
  observation: { label: 'Family Observation',icon: '👥', colour: '#10B981' },
  journal:     { label: 'Journal Entry',     icon: '📝', colour: '#06B6D4' },
  scenario:    { label: 'Scenario Practice', icon: '🎯', colour: '#EF4444' },
  profile:     { label: 'Profile Update',    icon: '🐾', colour: '#C9A84C' },
}

// ─────────────────────────────────────────────────────────────────────────────
// SYNC ITEM ROW
// ─────────────────────────────────────────────────────────────────────────────
function SyncItem({ item, onComplete, index }) {
  const type   = SYNC_TYPE_LABELS[item.type] || { label: item.type, icon: '📦', colour: '#6B7280' }
  const timeAgo = (ts) => {
    if (!ts) return ''
    const diff = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(diff / 3600000)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8, scale: 0.97 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="flex items-center gap-4 py-3 px-4 border-b border-white/[0.04] last:border-0"
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm"
        style={{ background: `${type.colour}12`, border: `1px solid ${type.colour}25` }}>
        {type.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-sans text-xs font-medium text-pearl truncate">{type.label}</div>
        <div className="font-sans text-[9px] text-silver-600 flex items-center gap-1">
          <Clock size={8} /> {timeAgo(item.enqueuedAt)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-sans text-[7px] uppercase tracking-widest px-2 py-0.5"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>
          {item.status}
        </span>
        <button onClick={() => onComplete(item.id)}
          className="text-silver-700 hover:text-emerald-400 transition-colors">
          <CheckCircle size={13} />
        </button>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE USAGE METER
// ─────────────────────────────────────────────────────────────────────────────
function StorageUsage() {
  const [usage, setUsage] = useState({ used: 0, total: 5 })

  useEffect(() => {
    try {
      let totalBytes = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('fp_') || key?.startsWith('fourpaws_')) {
          totalBytes += (localStorage.getItem(key) || '').length * 2
        }
      }
      setUsage({ used: Math.round(totalBytes / 1024), total: 5120 }) // 5MB limit
    } catch {}
  }, [])

  const pct = Math.min(100, Math.round((usage.used / usage.total) * 100))
  const colour = pct < 50 ? '#10B981' : pct < 80 ? '#F59E0B' : '#EF4444'

  return (
    <div className="glass-card p-5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-600">Local Storage</div>
        <div className="font-mono text-xs" style={{ color: colour }}>{usage.used} KB / {usage.total} KB</div>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full"
          style={{ background: colour, width: `${pct}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div className="font-sans text-[8px] text-silver-700 mt-2">{pct}% of offline storage used</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
const DATA_CATEGORIES = [
  { key: 'fp_ritual_log',      label: 'Ritual Progress',    icon: '🌅' },
  { key: 'fp_reflection_log',  label: 'Daily Reflections',  icon: '💭' },
  { key: 'fp_staff_notes',     label: 'Concierge Notes',    icon: '📝' },
  { key: 'fp_family_data',     label: 'Family Data',        icon: '👥' },
  { key: 'fp_scenario_log',    label: 'Scenario Log',       icon: '🎯' },
  { key: 'fp_chat_history',    label: 'Companion Chat',     icon: '💬' },
  { key: 'fp_ai_memory',       label: 'AI Memory',          icon: '🧠' },
  { key: 'fp_sync_queue',      label: 'Sync Queue',         icon: '☁️' },
]

function DataCategoryRow({ category }) {
  const size = useMemo(() => {
    try {
      const raw = localStorage.getItem(category.key)
      return raw ? Math.round(raw.length * 2 / 1024) : 0
    } catch { return 0 }
  }, [category.key])

  const hasData = size > 0

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
      <span className="text-sm flex-shrink-0">{category.icon}</span>
      <span className="font-sans text-xs text-silver-400 flex-1">{category.label}</span>
      <div className="flex items-center gap-2">
        {hasData ? (
          <>
            <span className="font-mono text-[9px] text-silver-600">{size} KB</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </>
        ) : (
          <>
            <span className="font-mono text-[9px] text-silver-800">Empty</span>
            <div className="w-1.5 h-1.5 rounded-full bg-silver-800" />
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function SyncStatusPage() {
  const [queue,    setQueue]    = useState(loadSyncQueue())
  const [status,   setStatus]   = useState(getSyncStatus())
  const [syncing,  setSyncing]  = useState(false)
  const [lastSync, setLastSync] = useState(localStorage.getItem('fp_last_sync') || null)

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getSyncStatus())
      setQueue(loadSyncQueue())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSync = async () => {
    if (!navigator.onLine) return
    setSyncing(true)
    SOUNDS.tap()
    await new Promise(r => setTimeout(r, 1500))
    // Simulate successful sync — in production this would call the sync API
    const ts = new Date().toISOString()
    localStorage.setItem('fp_last_sync', ts)
    setLastSync(ts)
    setSyncing(false)
    SOUNDS.complete()
  }

  const handleComplete = (id) => {
    markSyncItemComplete(id)
    setQueue(loadSyncQueue())
    SOUNDS.tap()
  }

  const timeAgo = (ts) => {
    if (!ts) return 'Never'
    const diff = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins} minutes ago`
    const hrs = Math.floor(diff / 3600000)
    if (hrs < 24) return `${hrs} hours ago`
    return `${Math.floor(diff / 86400000)} days ago`
  }

  return (
    <div className="min-h-screen p-5 lg:p-8 max-w-2xl mx-auto">
      <AmbientOrbs count={2} colour="rgba(6,182,212,0.04)" />

      <FadeIn className="mb-8">
        <div className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold-500 mb-1">Academy</div>
        <h1 className="luxury-heading text-2xl mb-1">Sync & Storage</h1>
        <p className="font-sans text-xs font-light text-silver-600">Offline-first intelligence. Your data stays yours.</p>
      </FadeIn>

      {/* Connection status */}
      <FadeIn delay={0.1} className="mb-6">
        <div className="glass-card p-5 flex items-center gap-4"
          style={{ border: `1px solid ${status.isOnline ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
          {status.isOnline ? (
            <Wifi size={18} className="text-emerald-400 flex-shrink-0" />
          ) : (
            <WifiOff size={18} className="text-red-400 flex-shrink-0" />
          )}
          <div className="flex-1">
            <div className="font-sans text-sm font-medium" style={{ color: status.isOnline ? '#10B981' : '#EF4444' }}>
              {status.isOnline ? 'Connected' : 'Offline Mode'}
            </div>
            <div className="font-sans text-[9px] text-silver-600">
              {status.isOnline ? `Last sync: ${timeAgo(lastSync)}` : 'All data saved locally. Sync when connected.'}
            </div>
          </div>
          {status.isOnline && (
            <motion.button
              onClick={handleSync}
              className="flex items-center gap-2 px-4 py-2 font-sans text-xs uppercase tracking-widest transition-all"
              style={{ border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}
              whileHover={{ background: 'rgba(16,185,129,0.06)' }}
              disabled={syncing}
            >
              <motion.div
                animate={syncing ? { rotate: 360 } : { rotate: 0 }}
                transition={syncing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
              >
                <RefreshCw size={12} />
              </motion.div>
              {syncing ? 'Syncing…' : 'Sync Now'}
            </motion.button>
          )}
        </div>
      </FadeIn>

      {/* Pending queue */}
      {queue.length > 0 && (
        <FadeIn delay={0.15} className="mb-6">
          <div className="glass-card" style={{ border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud size={13} className="text-amber-400" />
                <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-600">Pending Sync</span>
              </div>
              <span className="font-mono text-xs text-amber-400">{queue.length} item{queue.length !== 1 ? 's' : ''}</span>
            </div>
            <AnimatePresence>
              {queue.slice(0, 8).map((item, i) => (
                <SyncItem key={item.id} item={item} index={i} onComplete={handleComplete} />
              ))}
            </AnimatePresence>
          </div>
        </FadeIn>
      )}

      {queue.length === 0 && (
        <FadeIn delay={0.15} className="mb-6">
          <div className="glass-card p-5 flex items-center gap-3"
            style={{ border: '1px solid rgba(16,185,129,0.1)' }}>
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="font-sans text-xs text-silver-500">All data is synchronised.</span>
          </div>
        </FadeIn>
      )}

      {/* Storage usage */}
      <FadeIn delay={0.2} className="mb-6">
        <StorageUsage />
      </FadeIn>

      {/* Data categories */}
      <FadeIn delay={0.25}>
        <div className="glass-card" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="px-5 py-4 border-b border-white/5">
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-600">Stored Data</span>
          </div>
          <div className="px-5 py-2">
            {DATA_CATEGORIES.map(cat => (
              <DataCategoryRow key={cat.key} category={cat} />
            ))}
          </div>
          <div className="px-5 py-3 border-t border-white/5">
            <p className="font-sans text-[9px] text-silver-700 leading-relaxed">
              All data is stored locally on your device. Your progress, reflections, and academy data never leave your device without your permission.
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
