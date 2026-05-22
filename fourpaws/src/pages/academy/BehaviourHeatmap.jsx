import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import { computeIntelligenceScores, getArchetype } from '../../ai/archetypes'
import { generatePredictiveAlerts } from '../../ai/concierge'
import { loadStreak, loadAIMemory } from '../../ai/aiMemory'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { purifyText } from '../../ai/narrativeVoice'

const HEATMAP_TRAITS = [
  { key: 'anxiety',       label: 'Stress',        icon: '😰', invert: true,  colour: '#EF4444' },
  { key: 'confidence',    label: 'Confidence',     icon: '🦁', invert: false, colour: '#C9A84C' },
  { key: 'reactivity',    label: 'Reactivity',     icon: '⚡', invert: true,  colour: '#F59E0B' },
  { key: 'socialisation', label: 'Social',         icon: '🦋', invert: false, colour: '#EC4899' },
  { key: 'energy',        label: 'Energy',         icon: '🔥', invert: false, colour: '#F97316' },
  { key: 'fearfulness',   label: 'Fear',           icon: '😨', invert: true,  colour: '#8B5CF6' },
]

const INTELLIGENCE_SCORES_META = [
  { key: 'confidence',  label: 'Confidence',  icon: '🦁', colour: '#C9A84C' },
  { key: 'stability',   label: 'Stability',   icon: '🌿', colour: '#10B981' },
  { key: 'focus',       label: 'Focus',       icon: '🎯', colour: '#8B5CF6' },
  { key: 'recovery',    label: 'Recovery',    icon: '💧', colour: '#06B6D4' },
  { key: 'enrichment',  label: 'Enrichment',  icon: '✨', colour: '#F59E0B' },
  { key: 'social',      label: 'Social',      icon: '🦋', colour: '#EC4899' },
]

function HeatCell({ value, colour, max = 100, index, label }) {
  const intensity = value / max
  const alpha     = 0.08 + intensity * 0.55

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="relative aspect-square flex items-center justify-center"
      style={{ background: `rgba(${hexToRgb(colour)}, ${alpha})`, border: `1px solid rgba(${hexToRgb(colour)}, ${alpha * 1.5})` }}
    >
      <div className="text-center">
        <div className="font-mono text-sm font-semibold" style={{ color: colour }}>{value}</div>
        <div className="font-sans text-[7px] text-silver-700 uppercase tracking-widest">{label}</div>
      </div>
    </motion.div>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

function AlertCard({ alert }) {
  return (
    <StaggerItem>
      <div className={`p-5 ${alert.bgColour} ${alert.border} border`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{alert.icon}</span>
          <div className="flex-1 min-w-0">
            <div className={`font-sans text-xs font-semibold uppercase tracking-widest mb-1 ${alert.colour}`}>{alert.title}</div>
            <p className="font-sans text-xs font-light text-silver-400 leading-relaxed mb-3">{alert.summary}</p>
            {alert.actions?.length > 0 && (
              <div className="space-y-1.5">
                {alert.actions.map((action, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: alert.colour.replace('text-', '') }} />
                    <span className="font-sans text-[10px] text-silver-500">{action}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StaggerItem>
  )
}

// Simple week-view heatmap for training consistency
function ConsistencyHeatmap({ memory }) {
  const weeks = 12
  const days  = 7

  // Build grid of training activity (mock data based on streak info)
  const streak      = loadStreak()
  const sessionData = memory?.sessionCount || 0

  const cells = useMemo(() => {
    const arr = []
    const now = new Date()
    for (let w = weeks - 1; w >= 0; w--) {
      for (let d = 0; d < days; d++) {
        const date     = new Date(now)
        date.setDate(date.getDate() - (w * 7 + (days - 1 - d)))
        const daysSince = Math.floor((now - date) / 86400000)

        // Simulate activity — high probability in recent streak days
        let active = false
        if (streak.current > 0 && daysSince < streak.current) active = true
        else if (streak.longest > 0 && daysSince > streak.current + 7 && daysSince < streak.current + streak.longest + 7) active = Math.random() > 0.3
        else active = Math.random() > 0.75 && sessionData > daysSince

        arr.push({ date, active: !!active, daysSince })
      }
    }
    return arr
  }, [streak, sessionData])

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        {dayLabels.map((d, i) => (
          <div key={i} className="font-sans text-[8px] text-silver-700 flex-1 text-center">{d}</div>
        ))}
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${days}, 1fr)`, gridAutoRows: '1fr' }}>
        {cells.map((cell, i) => (
          <motion.div key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.002 }}
            title={cell.date.toLocaleDateString('en-GB')}
            className="aspect-square rounded-sm"
            style={{
              background: cell.active
                ? 'linear-gradient(135deg, rgba(201,168,76,0.7), rgba(245,224,154,0.5))'
                : 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-white/5" />
          <span className="font-sans text-[9px] text-silver-700">No session</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(201,168,76,0.6)' }} />
          <span className="font-sans text-[9px] text-silver-700">Session recorded</span>
        </div>
      </div>
    </div>
  )
}

export default function BehaviourHeatmap() {
  const { state }  = useApp()
  const { behaviourScores, dogProfile } = useAI()
  const dog        = dogProfile || state.dogProfile
  const dogName    = dog?.name  || 'Your Companion'
  const memory     = loadAIMemory()
  const streak     = loadStreak()

  const completedLessons = Object.values(state.courseProgress)
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)

  const intScores = useMemo(() => computeIntelligenceScores(behaviourScores, completedLessons, streak), [behaviourScores, completedLessons, streak])
  const alerts    = useMemo(() => generatePredictiveAlerts(behaviourScores, dog, streak, completedLessons), [behaviourScores, dog, streak, completedLessons])

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Behaviour Intelligence</div>
        <h1 className="luxury-heading text-4xl">{dogName}'s<br /><span className="text-gold-gradient italic">Analytics Dashboard</span></h1>
      </FadeIn>

      {/* ── Behaviour heatmap grid ── */}
      {behaviourScores?.individual && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Behaviour Heatmap</div>
          <h2 className="luxury-heading text-2xl mb-4">Trait Intensity Map</h2>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
              {HEATMAP_TRAITS.map((t, i) => (
                <div key={t.key} className="flex flex-col items-center gap-2">
                  <span className="text-xl">{t.icon}</span>
                  <HeatCell
                    value={behaviourScores.individual[t.key] || 0}
                    colour={t.colour}
                    index={i}
                    label={t.label}
                  />
                  <span className="font-sans text-[8px] text-silver-700 text-center leading-tight">{t.invert ? 'lower = better' : 'higher = better'}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── Intelligence scores ── */}
      {intScores && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Intelligence Scores</div>
          <h2 className="luxury-heading text-2xl mb-4">Composite Analysis</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {INTELLIGENCE_SCORES_META.map((s, i) => {
              const val    = intScores[s.key] || 0
              const alpha  = 0.05 + (val / 100) * 0.15
              return (
                <motion.div key={s.key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -2 }}
                  className="glass-card p-5"
                  style={{ border: `1px solid ${s.colour}30`, background: `rgba(${hexToRgb(s.colour)}, ${alpha})` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{s.icon}</span>
                    <span className="font-sans text-xs text-silver-400">{s.label}</span>
                  </div>
                  <div className="stat-number text-3xl mb-2">{val}</div>
                  <div className="h-1 rounded-full overflow-hidden bg-white/5">
                    <motion.div className="h-full rounded-full"
                      style={{ background: s.colour }}
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 1.2, delay: i * 0.08 }} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </FadeIn>
      )}

      {/* ── Training consistency heatmap ── */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Training Consistency</div>
        <h2 className="luxury-heading text-2xl mb-4">12-Week Activity Map</h2>
        <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <ConsistencyHeatmap memory={memory} />
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/5">
            {[
              ['Current streak', `${streak.current || 0} days`],
              ['Longest streak', `${streak.longest || 0} days`],
              ['Total sessions', `${memory.sessionCount || 0}`],
            ].map(([label, value]) => (
              <div key={label} className="text-center">
                <div className="stat-number text-xl">{value}</div>
                <div className="font-sans text-[9px] text-silver-700 uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Predictive alerts ── */}
      {alerts.length > 0 && (
        <FadeIn>
          <div className="section-label mb-1">Predictive Intelligence</div>
          <h2 className="luxury-heading text-2xl mb-4">Behaviour Alerts</h2>
          <StaggerContainer className="space-y-3">
            {alerts.map((alert, i) => (
              <AlertCard key={`${alert.id}-${i}`} alert={alert} />
            ))}
          </StaggerContainer>
        </FadeIn>
      )}
    </div>
  )
}
