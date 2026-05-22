import React, { useState, useMemo } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Package, AlertTriangle,
  LogOut, Menu, X, Shield, MapPin, BarChart2, Clock,
  Award, Flame, Sparkles, Volume2, Brain, Zap, Wind,
  Map, BookMarked, Activity, Archive, FileText, Star, Calendar, TrendingUp, Sun,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAI } from '../hooks/useAI'
import { useAcademyConfig } from '../context/AcademyConfigContext'
import { academyStatusLabel } from '../utils/academyIdentity'
import { speak, stopSpeaking, VOICE_COACH_AVAILABLE } from '../ai/voiceCoach'
import { loadStreak } from '../ai/aiMemory'
import { getDynamicGreeting } from '../ai/concierge'
import { loadAIMemory } from '../ai/aiMemory'
import { loadSeasonalTheme, injectSeasonalTheme } from '../ai/seasonalThemes'
import { AmbientIdleState } from '../components/ui/LuxuryWidgets'
import { useIntelligenceCore } from '../hooks/useIntelligenceCore'
import { ScrollProgressBar } from '../components/animations/FadeIn'
import { TeacherPanel, HelpTrigger, HelpCentre } from '../components/ui/TeacherPanel'
import { useTeacher } from '../hooks/useTeacher'

// Icon map from config navItem icon strings → Lucide components
const ICON_MAP = {
  LayoutDashboard, BookOpen, Package, AlertTriangle,
  MapPin, Clock, BarChart2, Brain, Sparkles, Zap, Award, Archive,
  Wind, Map, BookMarked, Activity, FileText, Star, Calendar, TrendingUp, Sun,
}

function NavIcon({ name, size = 15 }) {
  const Comp = ICON_MAP[name] || BookOpen
  return <Comp size={size} />
}

function TierBadge({ tierMeta, packageMeta }) {
  if (!tierMeta) return null
  return (
    <span className="flex items-center gap-1 font-sans text-[9px] px-2 py-0.5 uppercase tracking-widest"
      style={{ color: tierMeta.colour, border: `1px solid ${tierMeta.colour}30`, background: `${tierMeta.colour}10` }}>
      {tierMeta.icon} {tierMeta.name}
    </span>
  )
}

export default function AcademyLayout() {
  // Inject seasonal theme on mount
  React.useEffect(() => {
    try {
      const season = loadSeasonalTheme()
      injectSeasonalTheme(season)
    } catch {}
  }, [])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { state, logout }   = useApp()
  const teacher = useTeacher('pwa')
  const { dogProfile }      = useAI()
  const { navItems, tierMeta, packageMeta, can, greeting: configGreeting, motionLevel } = useAcademyConfig()

  const memory  = loadAIMemory()
  const streak  = loadStreak()

  const handleLogout = () => { logout(); navigate('/') }

  const client   = state.clientProfile || state.currentUser
  const dog      = dogProfile || state.dogProfile
  const acStatus = academyStatusLabel(state.academyStatus || 'pending')

  const greeting = useMemo(() =>
    getDynamicGreeting(client?.name, dog?.name, memory.sessionCount || 0),
    [client?.name, dog?.name, memory.sessionCount]
  )

  // Group nav items by their group property
  const navGroups = useMemo(() => {
    const groups = { core: [], intelligence: [], ai: [], premium: [] }
    navItems.forEach(item => {
      const g = item.group || 'core'
      if (groups[g]) groups[g].push(item)
      else groups.core.push(item)
    })
    return groups
  }, [navItems])

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to
    return location.pathname.startsWith(item.to) && item.to !== '/academy'
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <motion.span className="text-2xl"
            animate={motionLevel !== 'standard' ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 6, repeat: Infinity }}>
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
          <motion.div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${tierMeta?.colour || '#C9A84C'} 0%, ${tierMeta?.colour || '#F5E09A'}80 100%)`, boxShadow: `0 0 12px ${tierMeta?.colour || '#C9A84C'}30` }}
            animate={motionLevel === 'ultra' ? { boxShadow: [`0 0 8px ${tierMeta?.colour || '#C9A84C'}20`, `0 0 18px ${tierMeta?.colour || '#C9A84C'}40`, `0 0 8px ${tierMeta?.colour || '#C9A84C'}20`] } : {}}
            transition={{ duration: 3, repeat: Infinity }}>
            <span className="font-display text-base font-light text-charcoal-900">
              {(client?.name || 'A').charAt(0)}
            </span>
          </motion.div>
          <div className="min-w-0">
            <div className="font-sans text-xs font-medium text-pearl truncate">{client?.name || 'Academy Member'}</div>
            {dog && <div className="font-sans text-[10px] text-silver-600 truncate">{dog.name}'s Academy</div>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <TierBadge tierMeta={tierMeta} packageMeta={packageMeta} />
          {streak.current > 0 && (
            <span className="flex items-center gap-1 font-sans text-[9px] text-orange-400">
              <Flame size={9} /> {streak.current}d
            </span>
          )}
        </div>
        {/* Package name */}
        {packageMeta && (
          <div className="mt-2 font-sans text-[9px] text-silver-700 flex items-center gap-1">
            <span>{packageMeta.icon}</span>
            <span>{packageMeta.name}</span>
          </div>
        )}

        {/* Live emotional state */}
        {dog && (
          <div className="mt-3 flex items-center gap-2 pt-3 border-t border-white/5">
            <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#10B981', boxShadow: '0 0 4px rgba(16,185,129,0.6)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }} />
            <span className="font-sans text-[8px] text-silver-700 uppercase tracking-widest">Intelligence Active</span>
              <HelpTrigger onClick={teacher.handleOpenHelp} />
          </div>
        )}
      </div>

      {/* Dynamic Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {/* Core group */}
        {navGroups.core.length > 0 && (
          <>
            {navGroups.core.map(item => {
              const active = isActive(item)
              return (
                <Link key={item.id} to={item.to} onClick={() => setSidebarOpen(false)}
                  className={`sidebar-item ${active ? 'active' : ''}`}>
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                  {active && <motion.div layoutId="navIndicator" className="ml-auto w-1 h-1 rounded-full" style={{ background: tierMeta?.colour || '#C9A84C' }} />}
                </Link>
              )
            })}
          </>
        )}

        {/* Intelligence group */}
        {navGroups.intelligence.length > 0 && (
          <>
            <div className="px-4 pt-4 pb-1">
              <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-800">Intelligence</div>
            </div>
            {navGroups.intelligence.map(item => {
              const active = isActive(item)
              return (
                <Link key={item.id} to={item.to} onClick={() => setSidebarOpen(false)}
                  className={`sidebar-item ${active ? 'active' : ''}`}>
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                  {active && <motion.div layoutId={`navInd-${item.id}`} className="ml-auto w-1 h-1 rounded-full" style={{ background: tierMeta?.colour || '#C9A84C' }} />}
                </Link>
              )
            })}
          </>
        )}

        {/* AI systems group */}
        {navGroups.ai.length > 0 && (
          <>
            <div className="px-4 pt-4 pb-1">
              <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-800">AI Systems</div>
            </div>
            {navGroups.ai.map(item => {
              const active = isActive(item)
              return (
                <Link key={item.id} to={item.to} onClick={() => setSidebarOpen(false)}
                  className={`sidebar-item ${active ? 'active' : ''}`}>
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                  {active && <motion.div layoutId={`navInd-${item.id}`} className="ml-auto w-1 h-1 rounded-full" style={{ background: tierMeta?.colour || '#C9A84C' }} />}
                </Link>
              )
            })}
          </>
        )}

        {/* Premium group */}
        {navGroups.premium.length > 0 && (
          <>
            <div className="px-4 pt-4 pb-1">
              <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-800">Premium</div>
            </div>
            {navGroups.premium.map(item => {
              const active = isActive(item)
              return (
                <Link key={item.id} to={item.to} onClick={() => setSidebarOpen(false)}
                  className={`sidebar-item ${active ? 'active' : ''}`}>
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                  {active && <motion.div layoutId={`navInd-${item.id}`} className="ml-auto w-1 h-1 rounded-full" style={{ background: tierMeta?.colour || '#C9A84C' }} />}
                </Link>
              )
            })}
          </>
        )}

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
        {VOICE_COACH_AVAILABLE && can.voiceCoach && (
          <button
            onClick={() => { if (!speak) return; speak(greeting) }}
            className="sidebar-item w-full text-xs text-silver-600 hover:text-silver-300">
            <Volume2 size={14} />
            <span>Voice Concierge</span>
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
    <>
    <ScrollProgressBar />
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--academy-bg, #0A0A0A)' }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 flex-shrink-0 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
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
                <button onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-silver-500">
                  <X size={14} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0"
          style={{ background: '#0A0A0A' }}>
          <button onClick={() => setSidebarOpen(true)} className="w-8 h-8 flex items-center justify-center text-silver-500">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🐾</span>
            <span className="font-display text-sm font-light tracking-[0.2em] text-pearl uppercase">Four Paws</span>
          </div>
          <HelpTrigger onClick={teacher.handleOpenHelp} />
        </div>

        <main className="flex-1 overflow-y-auto">
          {/* AI Teacher — contextual guidance, shown only when relevant */}
          {teacher.activeNode && (
            <div className="px-5 pt-5 max-w-2xl">
              <TeacherPanel
                node={teacher.activeNode}
                variant="pwa"
                onComplete={teacher.handleComplete}
                onSkip={teacher.handleSkip}
                onSkipAll={teacher.handleSkipAll}
              />
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
      {/* Help Centre overlay */}
      <AnimatePresence>
        {teacher.helpOpen && (
          <HelpCentre
            surface="pwa"
            resumable={teacher.resumable}
            completed={teacher.completed}
            progress={teacher.progress}
            onResume={teacher.handleResumeNode}
            onClose={teacher.handleCloseHelp}
            onReset={teacher.handleReset}
          />
        )}
      </AnimatePresence>
    </>
  )
}
