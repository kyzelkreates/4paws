import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Package, AlertTriangle,
  LogOut, Menu, X, ChevronRight, Shield, MapPin,
  BarChart2, Clock, Award, User, Flame, Sparkles, Volume2,
  Brain, Zap
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAI } from '../hooks/useAI'
import { academyStatusLabel } from '../utils/academyIdentity'
import { getClientTier } from '../ai/archetypes'
import { speak, stopSpeaking, isVoiceEnabled, VOICE_COACH_AVAILABLE } from '../ai/voiceCoach'
import { loadStreak } from '../ai/aiMemory'
import { getDynamicGreeting } from '../ai/concierge'
import { loadAIMemory } from '../ai/aiMemory'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',      to: '/academy',                exact: true  },
  { icon: BookOpen,        label: 'Programmes',     to: '/academy',                exact: true  },
  { icon: Package,         label: 'Add-Ons',        to: '/academy/addons',         exact: false },
  { icon: MapPin,          label: 'Passport',       to: '/academy/passport',       exact: false },
  { icon: Clock,           label: 'Timeline',       to: '/academy/timeline',       exact: false },
  { icon: BarChart2,       label: 'Analytics',      to: '/academy/analytics',      exact: false },
  { icon: AlertTriangle,   label: 'Emergency',      to: '/academy/emergency',      exact: false },
  { icon: Brain,           label: 'Digital Twin',   to: '/academy/twin',           exact: false },
  { icon: Sparkles,        label: 'Wellness',       to: '/academy/wellness',       exact: false },
  { icon: Zap,             label: 'Weekly Report',  to: '/academy/report',         exact: false },
  { icon: Award,           label: 'Archive',        to: '/academy/archive',        exact: false },
]

function TierBadge({ tier }) {
  if (!tier) return null
  return (
    <span className="flex items-center gap-1 font-sans text-[9px] px-2 py-0.5 uppercase tracking-widest"
      style={{ color: tier.colour, border: `1px solid ${tier.colour}30`, background: `${tier.colour}10` }}>
      {tier.icon} {tier.name}
    </span>
  )
}

export default function AcademyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location    = useLocation()
  const navigate    = useNavigate()
  const { state, logout } = useApp()
  const { dogProfile, behaviourScores } = useAI()

  const memory      = loadAIMemory()
  const streak      = loadStreak()

  const handleLogout = () => { logout(); navigate('/') }

  const client      = state.clientProfile || state.currentUser
  const dog         = dogProfile || state.dogProfile
  const acStatus    = academyStatusLabel(state.academyStatus || 'pending')

  const completedLessons = Object.values(state.courseProgress)
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)
  const tier = getClientTier(completedLessons)

  const greeting = getDynamicGreeting(client?.name, dog?.name, memory.sessionCount || 0)

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to
    return location.pathname.startsWith(item.to) && item.to !== '/academy'
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <motion.span className="text-2xl" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }}>
            🐾
          </motion.span>
          <div>
            <div className="font-display text-sm font-light tracking-[0.2em] text-pearl uppercase leading-none">Four Paws</div>
            <div className="font-sans text-[7px] tracking-[0.35em] uppercase text-gold-600 mt-0.5">Elite Academy</div>
          </div>
        </div>
      </div>

      {/* Client identity */}
      <div className="px-6 py-5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: '0 0 12px rgba(201,168,76,0.3)' }}>
            <span className="font-display text-base font-light text-charcoal-900">
              {(client?.name || 'A').charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <div className="font-sans text-xs font-medium text-pearl truncate">{client?.name || 'Academy Member'}</div>
            {dog && <div className="font-sans text-[10px] text-silver-600 truncate">{dog.name}'s Academy</div>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <TierBadge tier={tier} />
          {streak.current > 0 && (
            <span className="flex items-center gap-1 font-sans text-[9px] text-orange-400">
              <Flame size={9} /> {streak.current}d
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV_ITEMS.map(item => {
          const active = isActive(item)
          return (
            <Link key={item.to + item.label} to={item.to} onClick={() => setSidebarOpen(false)}
              className={`sidebar-item ${active ? 'active' : ''}`}>
              <item.icon size={15} />
              <span>{item.label}</span>
              {active && <motion.div layoutId="navIndicator" className="ml-auto w-1 h-1 rounded-full bg-gold-500" />}
            </Link>
          )
        })}

        {/* Academy status */}
        <div className="px-4 pt-3 mt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-[9px] font-sans text-silver-700 tracking-widest uppercase">
            <Shield size={9} />
            <span>{acStatus?.label || 'Active'}</span>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-white/5">
        {VOICE_COACH_AVAILABLE && (
          <button onClick={() => {
            if (isVoiceEnabled()) { stopSpeaking() } else { speak(greeting) }
          }}
            className="sidebar-item w-full text-xs text-silver-600 hover:text-silver-300">
            <Volume2 size={14} />
            <span>Voice Coach</span>
          </button>
        )}
        <button onClick={handleLogout} className="sidebar-item w-full text-xs">
          <LogOut size={14} className="text-silver-600" />
          <span className="text-silver-600">Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-charcoal-900 overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 flex-shrink-0 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)' }}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-white/5 lg:hidden"
              style={{ background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)' }}>
              <div className="absolute top-4 right-4">
                <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-silver-500 hover:text-pearl">
                  <X size={14} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar — mobile only */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0"
          style={{ background: '#0A0A0A' }}>
          <button onClick={() => setSidebarOpen(true)} className="w-8 h-8 flex items-center justify-center text-silver-500 hover:text-pearl">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🐾</span>
            <span className="font-display text-sm font-light tracking-[0.2em] text-pearl uppercase">Four Paws</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Scroll area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
