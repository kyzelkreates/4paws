import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, CheckCircle, Flame, Zap } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import { loadAIMemory, loadStreak } from '../../ai/aiMemory'
import { computeIntelligenceScores, getArchetype } from '../../ai/archetypes'
import { computeEarnedAchievements, ACHIEVEMENT_TIERS } from '../../ai/achievements'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

const TRAIT_META = {
  anxiety:       { label: 'Anxiety',        icon: '😰', note: 'Lower is better', invert: true },
  confidence:    { label: 'Confidence',      icon: '🦁', note: 'Higher is better', invert: false },
  reactivity:    { label: 'Reactivity',      icon: '⚡', note: 'Lower is better', invert: true },
  socialisation: { label: 'Socialisation',   icon: '🦋', note: 'Higher is better', invert: false },
  energy:        { label: 'Energy',          icon: '🔥', note: 'Context-dependent', invert: false },
  fearfulness:   { label: 'Fearfulness',     icon: '😨', note: 'Lower is better', invert: true },
}

function TrendIcon({ trend }) {
  if (trend > 5)  return <TrendingUp   size={12} className="text-emerald-400" />
  if (trend < -5) return <TrendingDown size={12} className="text-red-400" />
  return            <Minus          size={12} className="text-silver-600" />
}

function TimelineEntry({ entry, isFirst, isLast, index }) {
  const date = new Date(entry.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return (
    <div className="flex gap-4 relative">
      {/* Line */}
      {!isLast && (
        <div className="absolute left-[18px] top-9 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, rgba(201,168,76,0.3), rgba(201,168,76,0.05))' }} />
      )}

      {/* Node */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 14 }}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1 relative z-10"
        style={{
          background: isFirst ? 'linear-gradient(135deg, #C9A84C 0%, #F5E09A 100%)' : 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.08) 100%)',
          border: `1px solid ${isFirst ? 'rgba(201,168,76,0.8)' : 'rgba(201,168,76,0.25)'}`,
        }}>
        {isFirst ? <span className="text-charcoal-900 text-sm font-bold">★</span> : <span className="text-gold-500 text-sm">·</span>}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.08 + 0.1 }}
        className="flex-1 glass-card p-5 mb-4"
        style={{ border: '1px solid rgba(255,255,255,0.05)' }}>

        <div className="flex items-start justify-between mb-3 gap-3">
          <div>
            <div className="font-sans text-[9px] text-gold-600 uppercase tracking-[0.25em]">{date}</div>
            <div className="font-serif text-base font-medium text-pearl mt-0.5">
              {isFirst ? 'Initial Assessment' : `Behaviour Snapshot ${index + 1}`}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-mono text-lg font-light text-gold-400">{entry.overall}</div>
            <div className="font-sans text-[8px] text-silver-700 uppercase tracking-widest">Concern Score</div>
          </div>
        </div>

        {/* Mini trait bars */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {Object.entries(entry.individual || {}).map(([trait, score]) => {
            const meta = TRAIT_META[trait]
            if (!meta) return null
            const goodScore = meta.invert ? (100 - score) : score
            const colour    = goodScore > 65 ? '#10B981' : goodScore < 35 ? '#EF4444' : '#C9A84C'
            return (
              <div key={trait}>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px]">{meta.icon}</span>
                    <span className="font-sans text-[9px] text-silver-500">{meta.label}</span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: colour }}>{score}</span>
                </div>
                <div className="h-0.5 bg-white/5 overflow-hidden rounded-full">
                  <motion.div className="h-full rounded-full" style={{ background: colour, width: `${score}%` }}
                    initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay: index * 0.08 }} />
                </div>
              </div>
            )
          })}
        </div>

        {entry.note && (
          <p className="font-serif text-xs font-light text-silver-400 italic mt-3 pt-3 border-t border-white/5">
            "{entry.note}"
          </p>
        )}
      </motion.div>
    </div>
  )
}

function MilestoneCard({ milestone, index }) {
  return (
    <StaggerItem>
      <motion.div whileHover={{ y: -2 }} className="glass-card p-5 flex items-center gap-4"
        style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #F5E09A 100%)', boxShadow: '0 0 15px rgba(201,168,76,0.3)' }}>
          <CheckCircle size={16} className="text-charcoal-900" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif text-sm font-medium text-pearl">{milestone.milestone}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-sans text-[9px] text-silver-600">
              {new Date(milestone.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            {milestone.dogName && (
              <span className="font-sans text-[9px] text-gold-600">· {milestone.dogName}</span>
            )}
          </div>
        </div>
      </motion.div>
    </StaggerItem>
  )
}

export default function BehaviourTimeline() {
  const { state }  = useApp()
  const { behaviourScores, dogProfile } = useAI()
  const memory     = loadAIMemory()
  const streak     = loadStreak()

  const dog        = dogProfile || state.dogProfile
  const dogName    = dog?.name || 'Your Companion'

  const history    = memory.behaviourHistory || []
  const milestones = memory.progressMilestones || []

  const completedLessons = Object.values(state.courseProgress)
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)

  const intScores = useMemo(() => computeIntelligenceScores(behaviourScores, completedLessons, streak), [behaviourScores, completedLessons, streak])
  const archetype = useMemo(() => getArchetype(behaviourScores, dog), [behaviourScores, dog])

  const achievements = useMemo(() => computeEarnedAchievements({
    completedLessons,
    streak:           streak.current || 0,
    completedCourses: 0,
    confidenceScore:  intScores?.confidence || 0,
    anxietyScore:     behaviourScores?.individual?.anxiety || 0,
    stabilityScore:   intScores?.stability || 0,
    socialScore:      intScores?.social || 0,
  }), [completedLessons, streak, intScores, behaviourScores])

  // Build trend data from history
  const trendData = useMemo(() => {
    if (history.length < 2) return null
    const first = history[0]
    const last  = history[history.length - 1]
    return Object.keys(TRAIT_META).reduce((acc, trait) => {
      const f = first.individual?.[trait]
      const l = last.individual?.[trait]
      if (f !== undefined && l !== undefined) {
        acc[trait] = { from: f, to: l, delta: l - f }
      }
      return acc
    }, {})
  }, [history])

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Transformation Record</div>
        <h1 className="luxury-heading text-4xl">{dogName}'s<br /><span className="text-gold-gradient italic">Behaviour Timeline</span></h1>
      </FadeIn>

      {/* ── Summary stats ── */}
      <FadeIn className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📊', label: 'Snapshots',    value: history.length    || '0' },
          { icon: '🏆', label: 'Milestones',   value: milestones.length || '0' },
          { icon: '⭐', label: 'Achievements', value: achievements.length || '0' },
          { icon: '🔥', label: 'Streak',       value: streak.current    || '0' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="stat-number text-2xl mb-0.5">{s.value}</div>
            <div className="font-sans text-[9px] text-silver-700 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </FadeIn>

      {/* ── Trend analysis ── */}
      {trendData && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Trend Analysis</div>
          <h2 className="luxury-heading text-2xl mb-4">Progress Since First Assessment</h2>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(trendData).map(([trait, data]) => {
                const meta       = TRAIT_META[trait]
                const isPositive = meta.invert ? data.delta < 0 : data.delta > 0
                const isNeutral  = Math.abs(data.delta) <= 3
                const colour     = isNeutral ? '#7A7A7A' : isPositive ? '#10B981' : '#EF4444'
                return (
                  <div key={trait} className="flex items-center gap-3">
                    <span className="text-xl flex-shrink-0">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-xs font-medium text-pearl">{meta.label}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <TrendIcon trend={isPositive ? 10 : isNeutral ? 0 : -10} />
                        <span className="font-mono text-[10px]" style={{ color: colour }}>
                          {data.from} → {data.to}
                          {!isNeutral && (
                            <span className="ml-1">({data.delta > 0 ? '+' : ''}{data.delta})</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── Timeline ── */}
      {history.length > 0 ? (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Assessment History</div>
          <h2 className="luxury-heading text-2xl mb-6">Behaviour Snapshots</h2>
          <div className="relative">
            {[...history].reverse().map((entry, i, arr) => (
              <TimelineEntry key={entry.timestamp || i} entry={entry}
                isFirst={i === 0} isLast={i === arr.length - 1} index={i} />
            ))}
          </div>
        </FadeIn>
      ) : (
        <FadeIn className="mb-8">
          <div className="glass-card p-10 text-center" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-serif text-xl text-pearl mb-2">Timeline Begins With Your First Session</h3>
            <p className="font-sans text-sm text-silver-500">Behaviour snapshots are recorded as you progress through your programme. Return after completing your first lessons.</p>
          </div>
        </FadeIn>
      )}

      {/* ── Milestones ── */}
      {milestones.length > 0 && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Training Record</div>
          <h2 className="luxury-heading text-2xl mb-5">Progress Milestones</h2>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {milestones.map((m, i) => <MilestoneCard key={`${m.date}-${i}`} milestone={m} index={i} />)}
          </StaggerContainer>
        </FadeIn>
      )}

      {/* ── Archetype evolution note ── */}
      {archetype && (
        <FadeIn>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{archetype.icon}</span>
              <div>
                <div className="section-label text-[9px]">Personality Profile</div>
                <div className="font-serif text-lg text-pearl">{archetype.name}</div>
              </div>
            </div>
            <p className="font-serif text-sm font-light text-silver-400 italic leading-relaxed">{archetype.description}</p>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
