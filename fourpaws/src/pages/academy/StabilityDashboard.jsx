// ─────────────────────────────────────────────────────────────
// FOUR PAWS — AI BEHAVIOURAL STABILITY DASHBOARD  (V3)
// Enterprise-grade analytics: BSI, emotional state engine,
// trigger intelligence, relapse prevention, consistency.
// ─────────────────────────────────────────────────────────────
import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, TrendingUp, TrendingDown, Zap, Activity } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import {
  deriveEmotionalState, getEmotionalTrend, computeBSI,
  computeWellnessScore, computeStabilityIndex, assessRelapseRisk,
  computeConsistencyMetrics, computeSocialisationIntelligence,
  buildTriggerIntelligence, EMOTIONAL_STATES, TRIGGER_CATEGORIES,
} from '../../ai/emotionalEngine'
import { loadStreak, loadAIMemory } from '../../ai/aiMemory'
import { loadDigitalTwin } from '../../ai/digitalTwin'
import { loadWellnessData } from '../../ai/wellness'
import { getLifestyleArchetype, buildEnvironmentalProfile, LIFESTYLE_ARCHETYPES } from '../../ai/trainingStrategist'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

// ── BSI Gauge ─────────────────────────────────────────────────
function BSIGauge({ bsi }) {
  const radius  = 55
  const circ    = 2 * Math.PI * radius
  const arc     = circ * 0.75
  const offset  = arc - (bsi.score / 100) * arc

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36" viewBox="0 0 140 140">
          {/* Background arc */}
          <circle cx="70" cy="70" r={radius} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth="8"
            strokeDasharray={`${arc} ${circ - arc}`}
            strokeLinecap="round"
            transform="rotate(135 70 70)" />
          {/* Score arc */}
          <motion.circle cx="70" cy="70" r={radius} fill="none"
            stroke={bsi.colour} strokeWidth="8"
            strokeDasharray={`${arc} ${circ - arc}`}
            strokeLinecap="round"
            transform="rotate(135 70 70)"
            initial={{ strokeDashoffset: arc }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${bsi.colour}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div className="font-mono text-3xl font-light"
            style={{ color: bsi.colour }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            {bsi.score}
          </motion.div>
          <div className="font-sans text-[9px] uppercase tracking-widest" style={{ color: bsi.colour }}>{bsi.grade}</div>
        </div>
      </div>
      <div className="font-sans text-[9px] text-silver-700 uppercase tracking-widest mt-1">Stability Index</div>
    </div>
  )
}

// ── Emotional state orb ───────────────────────────────────────
function EmotionalOrb({ state: es }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={{ boxShadow: [`0 0 20px ${es.glow}`, `0 0 40px ${es.glow}`, `0 0 20px ${es.glow}`] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-20 h-20 rounded-full flex items-center justify-center text-3xl relative"
        style={{ background: `radial-gradient(circle, ${es.colour}25 0%, ${es.colour}08 100%)`, border: `1.5px solid ${es.colour}40` }}>
        {es.icon}
        <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, ${es.colour}15, transparent 60%)` }} />
      </motion.div>
      <div>
        <div className="font-serif text-base font-medium text-pearl text-center" style={{ color: es.colour }}>{es.label}</div>
        <div className="font-sans text-[9px] text-silver-600 text-center max-w-[140px] leading-snug mt-0.5">{es.desc}</div>
      </div>
    </div>
  )
}

// ── Trigger map ───────────────────────────────────────────────
function TriggerMap({ triggerData }) {
  const { scores, plans, dominantTrigger } = triggerData
  const [selected, setSelected] = useState(dominantTrigger)

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {Object.entries(scores).map(([key, score]) => {
          const meta   = TRIGGER_CATEGORIES[key]
          const isHigh = score > 65
          const isMed  = score > 40
          const colour = isHigh ? '#EF4444' : isMed ? '#F59E0B' : '#10B981'
          return (
            <motion.button key={key}
              onClick={() => setSelected(key)}
              whileHover={{ y: -2 }}
              className={`p-4 border text-left transition-all ${selected === key ? 'border-gold-500/30 bg-gold-500/5' : 'border-white/5 hover:border-white/12'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{meta.icon}</span>
                <span className="font-sans text-[9px] text-silver-500 flex-1">{meta.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div style={{ background: colour, width: `${score}%` }} className="h-full"
                    initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1 }} />
                </div>
                <span className="font-mono text-[10px]" style={{ color: colour }}>{score}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {selected && plans[selected] && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            key={selected}
            className="glass-card p-5" style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{TRIGGER_CATEGORIES[selected].icon}</span>
              <div className="section-label text-[9px]">Desensitisation Plan · {TRIGGER_CATEGORIES[selected].label}</div>
            </div>
            <div className="space-y-2">
              {plans[selected].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full border border-gold-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-mono text-[8px] text-gold-500">{i + 1}</span>
                  </div>
                  <span className="font-sans text-xs text-silver-400">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function StabilityDashboard() {
  const { state }  = useApp()
  const { behaviourScores, dogProfile } = useAI()
  const dog        = dogProfile || state.dogProfile
  const client     = state.clientProfile || state.currentUser
  const dogName    = dog?.name || 'Your Companion'
  const memory     = loadAIMemory()
  const streak     = loadStreak()
  const twin       = loadDigitalTwin()
  const wellData   = loadWellnessData()

  const moodLog    = twin?.moodLog    || []
  const wellLog    = wellData?.log    || []

  const completedLessons = useMemo(() =>
    Object.values(state.courseProgress).reduce((a, p) => a + (p.completedLessons?.length || 0), 0),
    [state.courseProgress]
  )

  const bsi            = useMemo(() => computeBSI(behaviourScores, moodLog, streak, completedLessons), [behaviourScores, moodLog, streak, completedLessons])
  const wellnessScore  = useMemo(() => computeWellnessScore(behaviourScores, moodLog, wellLog, streak, completedLessons), [behaviourScores, moodLog, wellLog, streak, completedLessons])
  const emotionalState = useMemo(() => deriveEmotionalState(behaviourScores, moodLog), [behaviourScores, moodLog])
  const emotionalTrend = useMemo(() => getEmotionalTrend(moodLog), [moodLog])
  const consistency    = useMemo(() => computeConsistencyMetrics(streak, completedLessons, moodLog), [streak, completedLessons, moodLog])
  const socialIntel    = useMemo(() => computeSocialisationIntelligence(dog, behaviourScores, moodLog), [dog, behaviourScores, moodLog])
  const triggerData    = useMemo(() => buildTriggerIntelligence(dog, behaviourScores), [dog, behaviourScores])
  const relapseRisks   = useMemo(() => assessRelapseRisk(behaviourScores, moodLog, streak, completedLessons), [behaviourScores, moodLog, streak, completedLessons])
  const lifestyle      = useMemo(() => getLifestyleArchetype(client, dog, behaviourScores), [client, dog, behaviourScores])
  const envProfile     = useMemo(() => buildEnvironmentalProfile(client, dog, behaviourScores), [client, dog, behaviourScores])

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">

      {/* Header */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Intelligence Dashboard</div>
        <h1 className="luxury-heading text-4xl">{dogName}'s<br /><span className="text-gold-gradient italic">Stability Intelligence</span></h1>
      </FadeIn>

      {/* Master scores row */}
      <FadeIn className="mb-8">
        <div className="glass-card p-7" style={{ border: '1px solid rgba(201,168,76,0.15)', background: 'rgba(201,168,76,0.02)' }}>
          <div className="flex flex-wrap items-center justify-around gap-8">
            <BSIGauge bsi={bsi} />

            <div className="text-center">
              <div className="font-mono text-5xl font-light text-emerald-400 mb-1">{wellnessScore}</div>
              <div className="font-sans text-[9px] text-silver-700 uppercase tracking-widest">Wellness Score</div>
            </div>

            <EmotionalOrb state={emotionalState} />

            <div className="text-center">
              <div className="font-mono text-5xl font-light" style={{ color: consistency.grade.colour }}>{consistency.composite}</div>
              <div className="font-sans text-[9px] text-silver-700 uppercase tracking-widest">Consistency</div>
              <div className="font-sans text-[9px] mt-0.5" style={{ color: consistency.grade.colour }}>{consistency.grade.label}</div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Emotional trend */}
      {emotionalTrend && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Emotional Intelligence</div>
          <h2 className="luxury-heading text-2xl mb-4">Trend Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Trend Direction', value: emotionalTrend.trend, icon: emotionalTrend.trend === 'improving' ? '📈' : emotionalTrend.trend === 'declining' ? '📉' : '➡️', colour: emotionalTrend.trend === 'improving' ? '#10B981' : emotionalTrend.trend === 'declining' ? '#EF4444' : '#C9A84C' },
              { label: 'Avg Stress (7d)',  value: `${emotionalTrend.recentStress}/10`, icon: '😰', colour: emotionalTrend.recentStress > 6 ? '#EF4444' : emotionalTrend.recentStress > 4 ? '#F59E0B' : '#10B981' },
              { label: 'Avg Calm (7d)',    value: `${emotionalTrend.recentCalm}/10`,  icon: '😌', colour: emotionalTrend.recentCalm > 7 ? '#10B981' : emotionalTrend.recentCalm > 5 ? '#C9A84C' : '#EF4444' },
            ].map(s => (
              <div key={s.label} className="glass-card p-5 text-center" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-mono text-xl font-medium mb-1 capitalize" style={{ color: s.colour }}>{s.value}</div>
                <div className="font-sans text-[9px] text-silver-700 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Relapse risk */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Relapse Prevention</div>
        <h2 className="luxury-heading text-2xl mb-4">Risk Assessment</h2>
        <StaggerContainer className="space-y-3">
          {relapseRisks.map((risk, i) => {
            const colour = risk.level === 'high' ? '#EF4444' : risk.level === 'medium' ? '#F59E0B' : '#10B981'
            return (
              <StaggerItem key={i}>
                <div className="flex items-start gap-4 p-5 border"
                  style={{ borderColor: colour + '25', background: colour + '05' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: colour, boxShadow: `0 0 6px ${colour}` }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: colour }}>{risk.label}</span>
                      <span className="font-sans text-[8px] px-1.5 py-0.5 border capitalize"
                        style={{ borderColor: colour + '30', color: colour + 'CC' }}>{risk.level}</span>
                    </div>
                    <p className="font-sans text-xs text-silver-400 font-light mb-2">{risk.desc}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gold-500" />
                      <span className="font-sans text-[10px] text-silver-500 italic">{risk.action}</span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </FadeIn>

      {/* Trigger intelligence */}
      {triggerData && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Trigger Intelligence</div>
          <h2 className="luxury-heading text-2xl mb-4">Sensitivity Map</h2>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <TriggerMap triggerData={triggerData} />
          </div>
        </FadeIn>
      )}

      {/* Socialisation intelligence */}
      {socialIntel && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Social Intelligence</div>
          <h2 className="luxury-heading text-2xl mb-4">Socialisation Profile</h2>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {[
                { label: 'Human Confidence', value: socialIntel.humanConfScore, icon: '👤' },
                { label: 'Dog Confidence',   value: socialIntel.dogConfScore,   icon: '🐕' },
                { label: 'Env. Adaptability',value: socialIntel.envAdaptScore,  icon: '🌆' },
                { label: 'Overall Social',   value: socialIntel.overallSocScore, icon: '🦋' },
              ].map(s => {
                const colour = s.value >= 65 ? '#10B981' : s.value >= 40 ? '#C9A84C' : '#EF4444'
                return (
                  <div key={s.label} className="text-center">
                    <div className="text-xl mb-2">{s.icon}</div>
                    <div className="font-mono text-2xl font-light mb-0.5" style={{ color: colour }}>{s.value}</div>
                    <div className="h-0.5 bg-white/5 mx-auto w-3/4 overflow-hidden rounded-full">
                      <motion.div style={{ background: colour, width: `${s.value}%` }} className="h-full"
                        initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 1 }} />
                    </div>
                    <div className="font-sans text-[8px] text-silver-700 mt-1">{s.label}</div>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-white/5 pt-4">
              <div className="font-sans text-[9px] text-gold-600 uppercase tracking-widest mb-2">Growth Pathway</div>
              <div className="space-y-1.5">
                {socialIntel.growthPath.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0" />
                    <span className="font-sans text-xs text-silver-400">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Lifestyle archetype + env profile */}
      <FadeIn className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lifestyle */}
        <div className="glass-card p-6" style={{ border: `1px solid ${lifestyle.colour}20` }}>
          <div className="section-label mb-1">Lifestyle Archetype</div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{lifestyle.icon}</span>
            <div>
              <div className="font-serif text-lg text-pearl">{lifestyle.name}</div>
              <div className="font-sans text-[10px] text-silver-500">{lifestyle.desc}</div>
            </div>
          </div>
          <div className="space-y-1.5">
            {lifestyle.trainingPriority.map(p => (
              <div key={p} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: lifestyle.colour }} />
                <span className="font-sans text-xs text-silver-500">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental profile */}
        {envProfile && (
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="section-label mb-1">Environmental Profile</div>
            <div className="flex items-center justify-between mb-4">
              <div className="font-serif text-lg text-pearl">Compatibility</div>
              <div className="font-mono text-2xl" style={{ color: envProfile.compatibilityScore >= 70 ? '#10B981' : envProfile.compatibilityScore >= 50 ? '#C9A84C' : '#EF4444' }}>
                {envProfile.compatibilityScore}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                ['Noise Level',   envProfile.noiseLevel],
                ['Space Access',  envProfile.spaceAccess],
                ['Household',     envProfile.householdActivity],
                ['Other Animals', envProfile.otherAnimals ? 'Yes' : 'No'],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="font-sans text-[9px] text-silver-700 mb-0.5">{label}</div>
                  <div className="font-sans text-xs text-silver-400 capitalize">{val}</div>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {envProfile.adaptations.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0 mt-1.5" />
                  <span className="font-sans text-[10px] text-silver-500">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </FadeIn>
    </div>
  )
}
