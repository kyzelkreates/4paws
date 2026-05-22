// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — INTELLIGENCE OPERATIONS CENTRE
// Replaces the standard Admin Dashboard with an elite command view.
// Real-time client health matrix, AI priority queue, concierge automation.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState  } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Brain, Shield, AlertTriangle, Users, TrendingUp, Activity,
  Zap, Clock, ChevronRight, CheckCircle, Bell, Star, Eye,
  Wifi, WifiOff,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

import { COURSES } from '../../data/courses'
import { detectClientRisks, getSyncStatus, FOUR_PAWS_METHOD, detectTransformationStage } from '../../ai/fourPawsMethod'
import { buildAdminInsight, purifyText, MOTION } from '../../ai/narrativeVoice'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { AmbientOrbs, CardEntrance } from '../../components/ui/PageTransition'
import { SOUNDS } from '../../ai/intelligenceCore'

// ─────────────────────────────────────────────────────────────────────────────
// PRIORITY ALERT CARD
// ─────────────────────────────────────────────────────────────────────────────
function PriorityAlert({ alert, index, onAction }) {
  const colourMap = { high: '#EF4444', medium: '#F59E0B', low: '#C9A84C' }
  const colour    = alert.colour || colourMap[alert.priority] || '#C9A84C'

  return (
    <CardEntrance index={index}>
      <div className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0">
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm"
          style={{ background: `${colour}12`, border: `1px solid ${colour}30` }}>
          {alert.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-sans text-xs font-medium text-pearl">{alert.name}</span>
            {alert.dogName && <span className="font-sans text-[9px] text-silver-600">· {alert.dogName}</span>}
            <span className="ml-auto font-sans text-[7px] uppercase tracking-widest px-1.5 py-0.5"
              style={{ color: colour, background: `${colour}12`, border: `1px solid ${colour}25` }}>
              {alert.priority}
            </span>
          </div>
          <p className="font-sans text-[10px] text-silver-500 font-light leading-relaxed">{purifyText(buildAdminInsight(alert.name, alert.dogName, alert.type, 0)) || purifyText(alert.message)}</p>
        </div>
        <button onClick={() => onAction(alert)}
          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-[9px] font-sans uppercase tracking-widest transition-colors"
          style={{ border: `1px solid ${colour}25`, color: colour }}>
          View <ChevronRight size={9} />
        </button>
      </div>
    </CardEntrance>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT HEALTH ROW — matrix display
// ─────────────────────────────────────────────────────────────────────────────
function ClientHealthRow({ client, index, onClick }) {
  const progress = client.courseProgress || {}
  const lessons  = Object.values(progress).reduce((a, p) => a + (p.completedLessons?.length || 0), 0)
  const enrolled = client.enrolledCourses?.length || 0
  const lastAct  = client.lastActivity
    ? Math.floor((Date.now() - new Date(client.lastActivity)) / 86400000)
    : null

  const engagementColour = lastAct === null ? '#6B7280' : lastAct < 2 ? '#10B981' : lastAct < 5 ? '#C9A84C' : lastAct < 8 ? '#F59E0B' : '#EF4444'
  const statusColour = { active: '#10B981', pending: '#C9A84C', suspended: '#EF4444', inactive: '#6B7280' }[client.academyStatus] || '#6B7280'

  return (
    <CardEntrance index={index}>
      <motion.div
        className="flex items-center gap-4 py-3 px-4 border-b border-white/[0.04] last:border-0 cursor-pointer"
        whileHover={{ background: 'rgba(255,255,255,0.02)' }} transition={{ duration: 0.2 }}
        onClick={onClick}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-display text-sm"
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }}>
          {(client.name || 'C').charAt(0)}
        </div>

        {/* Name + dog */}
        <div className="flex-1 min-w-0">
          <div className="font-sans text-xs font-medium text-pearl truncate">{client.name}</div>
          {client.dog?.name && <div className="font-sans text-[9px] text-silver-600 truncate">{client.dog.name}</div>}
        </div>

        {/* Engagement */}
        <div className="text-center w-12 flex-shrink-0">
          <div className="font-mono text-xs" style={{ color: engagementColour }}>
            {lastAct === null ? '—' : lastAct === 0 ? 'Today' : `${lastAct}d`}
          </div>
          <div className="font-sans text-[7px] text-silver-700 uppercase tracking-wider">Activity</div>
        </div>

        {/* Lessons */}
        <div className="text-center w-12 flex-shrink-0">
          <div className="font-mono text-xs text-gold-500">{lessons}</div>
          <div className="font-sans text-[7px] text-silver-700 uppercase tracking-wider">Lessons</div>
        </div>

        {/* Status dot */}
        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: statusColour }} />
      </motion.div>
    </CardEntrance>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INTELLIGENCE METRIC PANEL
// ─────────────────────────────────────────────────────────────────────────────
function IntelligencePanel({ label, value, sub, icon: Icon, colour, trend }) {
  return (
    <div className="glass-card p-5 relative overflow-hidden"
      style={{ border: `1px solid ${colour}18` }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 60% at 100% 0%, ${colour}04 0%, transparent 70%)` }} />
      <div className="relative z-10">
        <Icon size={14} className="mb-3" style={{ color: colour }} />
        <div className="font-display text-3xl font-light mb-1" style={{ color: colour }}>{value}</div>
        <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-700 mb-0.5">{label}</div>
        <div className="font-sans text-[9px] text-silver-600">{sub}</div>
        {trend !== undefined && (
          <div className="font-sans text-[9px] mt-1" style={{ color: trend > 0 ? '#10B981' : trend < 0 ? '#EF4444' : '#6B7280' }}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}% vs last period
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCIERGE AUTOMATION PANEL
// ─────────────────────────────────────────────────────────────────────────────
function ConciergeAutomations({ clients, navigate }) {
  const automations = useMemo(() => {
    const items = []
    clients.forEach(c => {
      const prog  = c.courseProgress || {}
      const count = Object.values(prog).reduce((a, p) => a + (p.completedLessons?.length || 0), 0)
      if (count === 0 && c.enrolledCourses?.length > 0) {
        items.push({ type: 'welcome', clientId: c.id, name: c.name, action: `Send welcome sequence to ${c.name}`, colour: '#10B981', icon: '👋' })
      }
      if (count > 0 && count % 5 === 0) {
        items.push({ type: 'milestone', clientId: c.id, name: c.name, action: `${c.name} reached ${count} lessons — send milestone acknowledgement`, colour: '#C9A84C', icon: '🏆' })
      }
    })
    return items.slice(0, 4)
  }, [clients])

  if (automations.length === 0) return (
    <div className="text-center py-8">
      <div className="text-2xl mb-2">✓</div>
      <p className="font-sans text-xs text-silver-600">All automations current.</p>
    </div>
  )

  return (
    <div>
      {automations.map((a, i) => (
        <div key={i} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
          <span className="text-base flex-shrink-0">{a.icon}</span>
          <p className="font-sans text-xs text-silver-400 font-light flex-1">{a.action}</p>
          <button
            onClick={() => { navigate(`/admin/clients/${a.clientId}`); SOUNDS.tap() }}
            className="flex-shrink-0 px-2.5 py-1 font-sans text-[9px] uppercase tracking-widest transition-colors"
            style={{ border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }}>
            Action
          </button>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN OPERATIONS CENTRE
// ─────────────────────────────────────────────────────────────────────────────
export default function OperationsCentre() {
  const { state }  = useApp()
  const [analyticsData, setAnalyticsData] = React.useState(null)
  React.useEffect(() => {
    import('../../dev/mockClients').then(({ getAnalyticsData }) => {
      setAnalyticsData(getAnalyticsData())
    })
  }, [])
  if (!analyticsData) return null
  const navigate   = useNavigate()
  const clients    = state.allClients || []
  const analytics  = analyticsData
  const syncStatus = getSyncStatus()
  const [alertsTab, setAlertsTab] = useState('priority')

  const alerts = useMemo(() => detectClientRisks(clients), [clients])
  const highAlerts   = alerts.filter(a => a.priority === 'high')
  const mediumAlerts = alerts.filter(a => a.priority === 'medium')

  const activeClients = clients.filter(c => c.academyStatus === 'active').length
  const pendingClients= clients.filter(c => c.academyStatus === 'pending').length
  const totalLessons  = clients.reduce((acc, c) => {
    return acc + Object.values(c.courseProgress || {}).reduce((a, p) => a + (p.completedLessons?.length || 0), 0)
  }, 0)

  const stageDistribution = useMemo(() => {
    const dist = {}
    FOUR_PAWS_METHOD.transformationStages.forEach(s => { dist[s.id] = 0 })
    clients.forEach(c => {
      const lessons = Object.values(c.courseProgress || {}).reduce((a, p) => a + (p.completedLessons?.length || 0), 0)
      const stage   = detectTransformationStage({}, lessons, 0)
      if (stage) dist[stage.id] = (dist[stage.id] || 0) + 1
    })
    return dist
  }, [clients])

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-7xl mx-auto relative">
      <AmbientOrbs count={2} colour="rgba(201,168,76,0.025)" />

      {/* ── Header ─────────────────────────────────────────── */}
      <FadeIn className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="divider-gold w-6" />
              <span className="section-label text-[9px]">Operations</span>
            </div>
            <h1 className="luxury-heading text-4xl lg:text-5xl mb-1">Operations Centre</h1>
            <p className="font-sans text-xs text-silver-600 font-light">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            {syncStatus.isOnline ? (
              <div className="flex items-center gap-1.5 text-emerald-500">
                <Wifi size={11} />
                <span className="font-sans text-[9px] uppercase tracking-widest">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-500">
                <WifiOff size={11} />
                <span className="font-sans text-[9px] uppercase tracking-widest">Offline</span>
              </div>
            )}
            {alerts.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-sans text-[9px] text-red-400 uppercase tracking-widest">{alerts.length} alerts</span>
              </div>
            )}
          </div>
        </div>
      </FadeIn>

      {/* ── Intelligence panels ─────────────────────────────── */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Clients',   value: clients.length, sub: `${activeClients} active`, icon: Users,      colour: '#C9A84C' },
          { label: 'Active Clients',  value: activeClients,  sub: `${pendingClients} pending activation`, icon: Activity, colour: '#10B981' },
          { label: 'Total Lessons',   value: totalLessons,   sub: 'across all academies', icon: TrendingUp,   colour: '#8B5CF6' },
          { label: 'Priority Alerts', value: highAlerts.length, sub: `${mediumAlerts.length} medium priority`, icon: AlertTriangle, colour: highAlerts.length > 0 ? '#EF4444' : '#10B981' },
        ].map((p, i) => (
          <StaggerItem key={p.label}>
            <IntelligencePanel {...p} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* ── Two-column grid ─────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">

        {/* Priority queue */}
        <div className="lg:col-span-2 glass-card" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={13} className="text-gold-500" />
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-silver-600">AI Priority Queue</span>
              </div>
              <div className="flex gap-0">
                {['priority', 'all'].map(t => (
                  <button key={t} onClick={() => { setAlertsTab(t); SOUNDS.tap() }}
                    className="px-3 py-1 font-sans text-[9px] uppercase tracking-widest transition-colors"
                    style={{ color: alertsTab === t ? '#C9A84C' : 'rgba(255,255,255,0.3)', borderBottom: alertsTab === t ? '1px solid #C9A84C' : '1px solid transparent' }}>
                    {t === 'priority' ? `High (${highAlerts.length})` : `All (${alerts.length})`}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 py-4 max-h-72 overflow-y-auto">
            {(alertsTab === 'priority' ? highAlerts : alerts).length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={20} className="text-emerald-500 mx-auto mb-2" />
                <p className="font-sans text-xs text-silver-600">All clients are within normal parameters.</p>
              </div>
            ) : (
              (alertsTab === 'priority' ? highAlerts : alerts).map((alert, i) => (
                <PriorityAlert key={`${alert.clientId}-${i}`} alert={alert} index={i}
                  onAction={(a) => navigate(`/admin/clients/${a.clientId}`)} />
              ))
            )}
          </div>
        </div>

        {/* Concierge automations */}
        <div className="glass-card" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="px-5 py-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Zap size={13} className="text-gold-500" />
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-silver-600">Concierge Queue</span>
            </div>
          </div>
          <div className="px-5 py-4">
            <ConciergeAutomations clients={clients} navigate={navigate} />
          </div>
        </div>
      </div>

      {/* ── Client health matrix ────────────────────────────── */}
      <FadeIn delay={0.3} className="mb-8">
        <div className="glass-card" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain size={13} className="text-gold-500" />
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-silver-600">Client Health Matrix</span>
              </div>
              <button onClick={() => navigate('/admin/clients')}
                className="font-sans text-[9px] uppercase tracking-widest text-silver-600 hover:text-gold-500 flex items-center gap-1 transition-colors">
                View all <ChevronRight size={10} />
              </button>
            </div>
          </div>
          {/* Column headers */}
          <div className="flex items-center gap-4 px-4 py-2 border-b border-white/[0.04]">
            <div className="w-8 flex-shrink-0" />
            <div className="flex-1 font-sans text-[8px] uppercase tracking-[0.3em] text-silver-800">Client</div>
            <div className="w-12 text-center font-sans text-[8px] uppercase tracking-[0.3em] text-silver-800 flex-shrink-0">Activity</div>
            <div className="w-12 text-center font-sans text-[8px] uppercase tracking-[0.3em] text-silver-800 flex-shrink-0">Lessons</div>
            <div className="w-4 flex-shrink-0" />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {clients.slice(0, 12).map((client, i) => (
              <ClientHealthRow key={client.id} client={client} index={i}
                onClick={() => navigate(`/admin/clients/${client.id}`)} />
            ))}
            {clients.length === 0 && (
              <div className="text-center py-10">
                <Users size={20} className="text-silver-800 mx-auto mb-2" />
                <p className="font-sans text-xs text-silver-600">No clients yet. Add from the Clients page.</p>
              </div>
            )}
          </div>
        </div>
      </FadeIn>

      {/* ── Transformation stage distribution ──────────────── */}
      <FadeIn delay={0.4}>
        <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Shield size={13} className="text-gold-500" />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-silver-600">Transformation Stage Distribution</span>
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-7 gap-3">
            {FOUR_PAWS_METHOD.transformationStages.map(stage => {
              const count = stageDistribution[stage.id] || 0
              return (
                <div key={stage.id} className="text-center p-3"
                  style={{ background: `${stage.colour}06`, border: `1px solid ${stage.colour}18` }}>
                  <div className="text-xl mb-1">{stage.icon}</div>
                  <div className="font-display text-lg font-light" style={{ color: stage.colour }}>{count}</div>
                  <div className="font-sans text-[7px] text-silver-700 uppercase tracking-wider leading-tight mt-0.5">
                    {stage.name.split(' ')[0]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
