// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — TRANSFORMATION TIMELINE
// Cinematic emotional journey timeline. Milestones, behaviour changes,
// confidence progression, archive memories. Fully offline.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Calendar, TrendingUp, Heart, Star, ChevronDown, Camera, Archive } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useIntelligenceCore } from '../../hooks/useIntelligenceCore'
import { loadAIMemory, loadStreak } from '../../ai/aiMemory'
import { computeEarnedAchievements, ACHIEVEMENT_TIERS } from '../../ai/achievements'
import { computeIntelligenceScores } from '../../ai/archetypes'
import { generateMilestoneNarrative } from '../../ai/intelligenceCore'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { AmbientOrbs, CardEntrance } from '../../components/ui/PageTransition'
import { SOUNDS } from '../../ai/intelligenceCore'

const TIER_STYLES = {
  BRONZE:   { bg: '#CD7F32', glow: 'rgba(205,127,50,0.4)'  },
  SILVER:   { bg: '#C0C0C0', glow: 'rgba(192,192,192,0.4)' },
  GOLD:     { bg: '#C9A84C', glow: 'rgba(201,168,76,0.5)'  },
  PLATINUM: { bg: '#B8C8FF', glow: 'rgba(184,200,255,0.5)' },
  DIAMOND:  { bg: '#9FDBFF', glow: 'rgba(159,219,255,0.5)' },
}

// ─────────────────────────────────────────────────────────────────────────────
// MILESTONE CARD — elite achievement display
// ─────────────────────────────────────────────────────────────────────────────
function MilestoneCard({ achievement, dogName, index }) {
  const [expanded, setExpanded] = useState(false)
  const tierStyle = TIER_STYLES[achievement.tier] || TIER_STYLES.BRONZE
  const narrative = generateMilestoneNarrative('lesson', dogName, index + 1)

  return (
    <CardEntrance index={index}>
      <motion.div
        className="relative overflow-hidden cursor-pointer"
        style={{ border: `1px solid ${tierStyle.bg}25` }}
        onClick={() => { setExpanded(e => !e); SOUNDS.tap() }}
        whileHover={{ borderColor: `${tierStyle.bg}45`, y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${tierStyle.bg}50, transparent)` }} />

        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Medal */}
            <div className="flex-shrink-0 relative">
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{
                  background: `radial-gradient(circle, ${tierStyle.bg}30 0%, ${tierStyle.bg}10 100%)`,
                  border: `1px solid ${tierStyle.bg}40`,
                  boxShadow: achievement.earned ? `0 0 12px ${tierStyle.glow}` : 'none',
                }}
                animate={achievement.earned ? { scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {achievement.earned ? achievement.icon : '🔒'}
              </motion.div>
              {achievement.earned && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: tierStyle.bg, boxShadow: `0 0 6px ${tierStyle.glow}` }}>
                  <Star size={8} className="text-black" fill="currentColor" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-sans text-[8px] uppercase tracking-[0.35em]"
                  style={{ color: tierStyle.bg }}>
                  {ACHIEVEMENT_TIERS[achievement.tier]?.label || achievement.tier}
                </span>
                {achievement.earned && (
                  <span className="font-sans text-[7px] px-1.5 py-0.5 uppercase tracking-widest"
                    style={{ background: `${tierStyle.bg}15`, color: tierStyle.bg, border: `1px solid ${tierStyle.bg}30` }}>
                    Earned
                  </span>
                )}
              </div>
              <h3 className={`font-serif text-base font-medium mb-0.5 ${achievement.earned ? 'text-pearl' : 'text-silver-700'}`}>
                {achievement.name}
              </h3>
              <p className="font-sans text-xs text-silver-600 font-light">{achievement.description}</p>
            </div>

            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={13} className="text-silver-700 flex-shrink-0" />
            </motion.div>
          </div>

          <AnimatePresence>
            {expanded && achievement.earned && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden">
                <div className="pt-4 mt-4 border-t border-white/5">
                  <p className="font-sans text-xs text-silver-500 font-light italic leading-relaxed">
                    {achievement.unlockCopy || narrative}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </CardEntrance>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BEHAVIOUR SNAPSHOT — historical timeline entry
// ─────────────────────────────────────────────────────────────────────────────
function BehaviourSnapshot({ snapshot, index, isLast, dogName }) {
  const date  = new Date(snapshot.timestamp)
  const label = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
  const ind   = snapshot.individual || {}

  return (
    <div className="flex gap-4 relative">
      {/* Connector */}
      {!isLast && (
        <div className="absolute left-4 top-10 bottom-0 w-px"
          style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.25) 0%, transparent 100%)' }} />
      )}

      {/* Node */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative z-10"
        style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)' }}>
        <span className="text-sm">📊</span>
      </div>

      {/* Content */}
      <CardEntrance index={index}>
        <div className="flex-1 pb-8 min-w-0">
          <div className="font-sans text-[9px] text-gold-700 uppercase tracking-widest mb-1">{label}</div>
          <div className="glass-card p-4" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Anxiety',    value: ind.anxiety,    invert: true,  colour: '#EF4444' },
                { label: 'Confidence', value: 100 - (ind.confidence || 50), invert: false, colour: '#C9A84C' },
                { label: 'Reactivity', value: ind.reactivity, invert: true,  colour: '#F59E0B' },
              ].map(m => (
                <div key={m.label} className="text-center">
                  <div className="font-display text-lg font-light" style={{ color: m.colour }}>
                    {Math.round(m.value || 0)}
                  </div>
                  <div className="font-sans text-[8px] text-silver-700 uppercase tracking-wider">{m.label}</div>
                  <div className="h-0.5 mt-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${m.value || 0}%`, background: m.colour }} />
                  </div>
                </div>
              ))}
            </div>
            {snapshot.note && (
              <p className="font-sans text-xs text-silver-600 font-light italic mt-3 pt-3 border-t border-white/5">
                {snapshot.note}
              </p>
            )}
          </div>
        </div>
      </CardEntrance>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIDENCE GRAPH — inline sparkline
// ─────────────────────────────────────────────────────────────────────────────
function ConfidenceSparkline({ snapshots }) {
  if (!snapshots || snapshots.length < 2) return null

  const values = snapshots.slice(0, 8).reverse().map(s => 100 - (s.individual?.confidence || 50))
  const max    = Math.max(...values, 1)
  const min    = Math.min(...values)
  const range  = max - min || 1
  const w = 200, h = 40

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 6) - 3
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="flex items-center gap-3 p-4"
      style={{ background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.1)' }}>
      <div className="flex-1 min-w-0">
        <div className="font-sans text-[8px] uppercase tracking-widest text-silver-700 mb-2">Confidence Trajectory</div>
        <svg width={w} height={h} className="w-full" style={{ maxWidth: w }}>
          <polyline
            points={points}
            fill="none"
            stroke="url(#gold-line)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="gold-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F5E09A" stopOpacity="1" />
            </linearGradient>
          </defs>
          {values.map((v, i) => {
            const x = (i / (values.length - 1)) * w
            const y = h - ((v - min) / range) * (h - 6) - 3
            return <circle key={i} cx={x} cy={y} r="2" fill="#C9A84C" />
          })}
        </svg>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="stat-number text-2xl">{values[values.length - 1]}%</div>
        <div className="font-sans text-[8px] text-silver-700 uppercase tracking-widest">Current</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function TransformationTimeline() {
  const { state } = useApp()
  const intelligence = useIntelligenceCore()
  const { core, behaviourScores, intScores, achievements, streak } = intelligence

  const memory      = useMemo(() => loadAIMemory(), [])
  const dogName     = core?.dogName || 'Your companion'
  const snapshots   = memory.behaviourHistory || []
  const firstName   = core?.firstName || 'there'

  const allAchievements = useMemo(() => {
    const completedLessons = Object.values(state.courseProgress || {})
      .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)
    return computeEarnedAchievements({
      completedLessons,
      streak:          streak?.current || 0,
      completedCourses: 0,
      confidenceScore: intScores?.confidence || 0,
      anxietyScore:    behaviourScores?.individual?.anxiety || 0,
      stabilityScore:  intScores?.stability || 0,
      socialScore:     intScores?.social || 0,
    })
  }, [state.courseProgress, streak, intScores, behaviourScores])

  const earned   = allAchievements.filter(a => a.earned)
  const pending  = allAchievements.filter(a => !a.earned).slice(0, 4)

  const [tab, setTab] = useState('milestones')

  return (
    <div className="min-h-screen p-5 lg:p-8 max-w-4xl mx-auto relative">
      <AmbientOrbs count={2} colour="rgba(201,168,76,0.025)" />

      {/* Header */}
      <FadeIn className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="divider-gold w-6" />
          <span className="section-label text-[9px]">Intelligence Archive</span>
        </div>
        <h1 className="luxury-heading text-4xl mb-1">Transformation Timeline</h1>
        <p className="font-sans text-sm text-silver-600 font-light">
          {dogName}'s complete behavioural transformation record.
        </p>
      </FadeIn>

      {/* Confidence sparkline */}
      {snapshots.length >= 2 && (
        <FadeIn delay={0.1} className="mb-6">
          <ConfidenceSparkline snapshots={snapshots} />
        </FadeIn>
      )}

      {/* Summary stats */}
      <FadeIn delay={0.15} className="mb-6">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Earned',      value: earned.length,           icon: '🏆', colour: '#C9A84C' },
            { label: 'Streak',      value: `${streak?.current || 0}d`, icon: '🔥', colour: '#F59E0B' },
            { label: 'Snapshots',   value: snapshots.length,        icon: '📊', colour: '#10B981' },
            { label: 'Consistency', value: `${intScores?.consistency || 0}%`, icon: '📈', colour: '#8B5CF6' },
          ].map(s => (
            <div key={s.label} className="glass-card p-4 text-center"
              style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="text-lg mb-1">{s.icon}</div>
              <div className="font-display text-xl font-light" style={{ color: s.colour }}>{s.value}</div>
              <div className="font-sans text-[8px] text-silver-700 uppercase tracking-widest mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Tab navigation */}
      <FadeIn delay={0.2} className="mb-6">
        <div className="flex gap-0 border-b border-white/5">
          {[
            { id: 'milestones', label: 'Milestones' },
            { id: 'timeline',   label: 'Behaviour Record' },
            { id: 'pending',    label: 'Upcoming' },
          ].map(t => (
            <button key={t.id}
              onClick={() => { setTab(t.id); SOUNDS.tap() }}
              className="relative px-5 py-3 font-sans text-[10px] uppercase tracking-widest transition-colors duration-200"
              style={{ color: tab === t.id ? '#C9A84C' : 'rgba(255,255,255,0.35)' }}>
              {t.label}
              {tab === t.id && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-px"
                  layoutId="tab-indicator"
                  style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
              )}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === 'milestones' && (
          <motion.div key="milestones"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}>
            {earned.length === 0 ? (
              <FadeIn>
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🌱</div>
                  <h3 className="font-serif text-xl text-pearl mb-2">Your Journey Has Begun</h3>
                  <p className="font-sans text-sm text-silver-600 font-light max-w-xs mx-auto">
                    {dogName}'s first milestone will appear here after completing the initial lessons.
                  </p>
                </div>
              </FadeIn>
            ) : (
              <div className="space-y-3">
                {earned.map((a, i) => (
                  <MilestoneCard key={a.id} achievement={a} dogName={dogName} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'timeline' && (
          <motion.div key="timeline"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}>
            {snapshots.length === 0 ? (
              <FadeIn>
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">📊</div>
                  <h3 className="font-serif text-xl text-pearl mb-2">Building the Record</h3>
                  <p className="font-sans text-sm text-silver-600 font-light max-w-xs mx-auto">
                    Behaviour snapshots will appear here as {dogName}'s programme progresses.
                  </p>
                </div>
              </FadeIn>
            ) : (
              <div>
                {snapshots.slice(0, 12).map((snap, i) => (
                  <BehaviourSnapshot
                    key={i} snapshot={snap} index={i}
                    isLast={i === Math.min(snapshots.length, 12) - 1}
                    dogName={dogName}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'pending' && (
          <motion.div key="pending"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}>
            <div className="space-y-3">
              {pending.map((a, i) => (
                <MilestoneCard key={a.id} achievement={a} dogName={dogName} index={i} />
              ))}
            </div>
            {pending.length === 0 && (
              <FadeIn>
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🏆</div>
                  <h3 className="font-serif text-xl text-pearl mb-2">All Milestones Earned</h3>
                  <p className="font-sans text-sm text-silver-600 font-light">
                    {dogName} has achieved every available milestone. Exceptional.
                  </p>
                </div>
              </FadeIn>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
