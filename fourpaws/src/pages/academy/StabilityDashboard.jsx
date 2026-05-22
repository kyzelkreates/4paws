// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — BEHAVIOURAL STABILITY INTELLIGENCE
// LBIL Layer 3 — Intelligence Feed surface
//
// This page answers one question: "How is my dog doing, really?"
// No analytics framing. No dashboards. Observational intelligence only.
// All outputs pass through the Narrative Engine.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import {
  deriveEmotionalState, getEmotionalTrend, computeBSI,
  computeStabilityIndex, assessRelapseRisk,
  computeConsistencyMetrics, buildTriggerIntelligence,
  EMOTIONAL_STATES, TRIGGER_CATEGORIES,
} from '../../ai/emotionalEngine'
import { loadStreak, loadAIMemory } from '../../ai/aiMemory'
import { loadDigitalTwin } from '../../ai/digitalTwin'
import { loadWellnessData } from '../../ai/wellness'
import { getLifestyleArchetype } from '../../ai/trainingStrategist'
import { FadeIn } from '../../components/animations/FadeIn'
import { purifyText, MOTION } from '../../ai/narrativeVoice'

// ─────────────────────────────────────────────────────────────────────────────
// STABILITY ORB — primary visual output. Simple. State-driven.
// ─────────────────────────────────────────────────────────────────────────────
function StabilityOrb({ bsi, emotionalState }) {
  const es = emotionalState
  const score = bsi?.score || 0
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 96, height: 96 }}>
        <motion.div className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${es.glow} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="absolute inset-4 rounded-full flex flex-col items-center justify-center"
          style={{ background: `${es.colour}0D`, border: `1.5px solid ${es.colour}35` }}>
          <span className="font-mono text-xl font-light" style={{ color: es.colour }}>{score}</span>
          <span className="font-sans text-[7px] uppercase tracking-widest text-silver-700 mt-0.5">stability</span>
        </div>
      </div>
      <div className="text-center">
        <div className="font-sans text-[9px] font-medium tracking-widest uppercase" style={{ color: es.colour }}>
          {es.label}
        </div>
        <p className="font-sans text-[9px] text-silver-700 mt-0.5 max-w-[120px] text-center leading-snug font-light">
          {es.desc}
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIGGER SECTION — expandable, single-trigger focused
// ─────────────────────────────────────────────────────────────────────────────
function TriggerIntelligence({ triggerData, dogName }) {
  const [open, setOpen] = useState(false)
  if (!triggerData) return null
  const { scores, plans, dominantTrigger } = triggerData
  const dominant = dominantTrigger ? TRIGGER_CATEGORIES[dominantTrigger] : null
  const plan = dominantTrigger ? plans[dominantTrigger] : null

  return (
    <div>
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors duration-200"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        whileHover={{ borderColor: 'rgba(201,168,76,0.2)' }}>
        <div>
          <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-silver-700 mb-1">Sensitivity</div>
          <div className="font-serif text-sm text-pearl">
            {dominant
              ? `${dogName} shows the most sensitivity to ${dominant.label.toLowerCase()} stimuli`
              : `No dominant sensitivity detected in ${dogName}'s current profile`}
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={MOTION.micro}>
          <ChevronDown size={13} className="text-silver-700 flex-shrink-0 ml-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={MOTION.expand}
            className="overflow-hidden border-t-0"
            style={{ border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none' }}>
            <div className="p-5 space-y-4">
              {/* Sensitivity indicators — bar only, no percentage labels */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(scores).map(([key, score]) => {
                  const meta   = TRIGGER_CATEGORIES[key]
                  const colour = score > 65 ? '#F97316' : score > 40 ? '#C9A84C' : '#10B981'
                  return (
                    <div key={key}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm">{meta.icon}</span>
                        <span className="font-sans text-[9px] text-silver-500">{meta.label}</span>
                      </div>
                      <div className="h-0.5 bg-white/5 overflow-hidden">
                        <motion.div className="h-full" style={{ background: colour }}
                          initial={{ width: 0 }} animate={{ width: `${score}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* Dominant trigger reduction plan */}
              {plan && (
                <div className="pt-3 border-t border-white/5">
                  <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-gold-700 mb-2">Suggested Approach</div>
                  <div className="space-y-1.5">
                    {plan.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0 mt-1.5" />
                        <p className="font-sans text-xs text-silver-500 font-light">{purifyText(step)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RISK OBSERVATIONS — calm, non-alarming, observational only
// ─────────────────────────────────────────────────────────────────────────────
function RiskObservations({ risks }) {
  const relevant = risks.filter(r => r.level !== 'low').slice(0, 2)
  if (relevant.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-silver-700 mb-3">Observations</div>
      {relevant.map((risk, i) => (
        <div key={i} className="flex items-start gap-3 p-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
            style={{ background: risk.level === 'high' ? '#F97316' : '#C9A84C' }} />
          <p className="font-sans text-xs text-silver-500 font-light leading-relaxed">
            {purifyText(risk.desc)}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LIFESTYLE ARCHETYPE — quiet identity card
// ─────────────────────────────────────────────────────────────────────────────
function ArchetypeCard({ lifestyle }) {
  if (!lifestyle) return null
  return (
    <div className="flex items-center gap-4 p-5"
      style={{ border: `1px solid ${lifestyle.colour}18` }}>
      <span className="text-2xl flex-shrink-0">{lifestyle.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-silver-700 mb-0.5">Lifestyle Profile</div>
        <div className="font-serif text-sm text-pearl">{lifestyle.name}</div>
        <div className="font-sans text-[10px] text-silver-600 font-light mt-0.5 leading-snug">{lifestyle.desc}</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function StabilityDashboard() {
  const { state }              = useApp()
  const { dogProfile, behaviourScores } = useAI()

  const dog      = dogProfile || state.dogProfile
  const client   = state.clientProfile || state.currentUser
  const dogName  = dog?.name || 'Your Companion'
  const twin     = loadDigitalTwin()
  const wellData = loadWellnessData()
  const streak   = loadStreak()

  const moodLog = twin?.moodLog || []

  const completedLessons = useMemo(() =>
    Object.values(state.courseProgress).reduce((a, p) => a + (p.completedLessons?.length || 0), 0),
    [state.courseProgress]
  )

  const bsi            = useMemo(() => computeBSI(behaviourScores, moodLog, streak, completedLessons),          [behaviourScores, moodLog, streak, completedLessons])
  const emotionalState = useMemo(() => deriveEmotionalState(behaviourScores, moodLog),                           [behaviourScores, moodLog])
  const emotionalTrend = useMemo(() => getEmotionalTrend(moodLog),                                               [moodLog])
  const consistency    = useMemo(() => computeConsistencyMetrics(streak, completedLessons, moodLog),              [streak, completedLessons, moodLog])
  const triggerData    = useMemo(() => buildTriggerIntelligence(dog, behaviourScores),                            [dog, behaviourScores])
  const relapseRisks   = useMemo(() => assessRelapseRisk(behaviourScores, moodLog, streak, completedLessons),     [behaviourScores, moodLog, streak, completedLessons])
  const lifestyle      = useMemo(() => getLifestyleArchetype(client, dog, behaviourScores),                       [client, dog, behaviourScores])

  // Derive a single human-readable trend sentence
  const trendSentence = useMemo(() => {
    if (!emotionalTrend) return null
    if (emotionalTrend.trend === 'improving')  return `${dogName}'s emotional baseline has shown a positive shift over recent sessions.`
    if (emotionalTrend.trend === 'declining')  return `${dogName}'s emotional baseline has shifted slightly. Today's session should prioritise decompression.`
    return `${dogName}'s emotional baseline is holding steady. Consistency is the most valuable thing right now.`
  }, [emotionalTrend, dogName])

  return (
    <div className="min-h-screen p-5 lg:p-8 max-w-2xl mx-auto">

      {/* Header */}
      <FadeIn className="mb-7">
        <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-silver-700 mb-1">
          <Shield size={9} className="inline mr-1.5 mb-0.5" />
          Behavioural Intelligence
        </div>
        <h1 className="font-serif text-3xl font-light text-pearl">{dogName}</h1>
        <p className="font-sans text-[10px] text-silver-600 mt-0.5 font-light">Stability profile · updated continuously</p>
      </FadeIn>

      {/* Primary visual — the orb and emotional state */}
      <FadeIn className="mb-6">
        <div className="relative overflow-hidden p-6"
          style={{
            background: 'linear-gradient(160deg, rgba(201,168,76,0.05) 0%, rgba(201,168,76,0.01) 100%)',
            border: '1px solid rgba(201,168,76,0.12)',
          }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
          <div className="flex items-center gap-6 flex-wrap">
            <StabilityOrb bsi={bsi} emotionalState={emotionalState} />
            <div className="flex-1 min-w-0 space-y-3">
              {/* Trend observation */}
              {trendSentence && (
                <p className="font-sans text-sm text-silver-300 font-light leading-relaxed">
                  {trendSentence}
                </p>
              )}
              {/* Consistency — a single line, not a score grid */}
              <div className="flex items-center gap-2">
                <div className="h-0.5 flex-1 bg-white/5 overflow-hidden">
                  <motion.div className="h-full" style={{ background: consistency?.grade?.colour || '#C9A84C' }}
                    initial={{ width: 0 }} animate={{ width: `${consistency?.composite || 0}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }} />
                </div>
                <span className="font-sans text-[9px] text-silver-600 flex-shrink-0">
                  {consistency?.grade?.label || 'Establishing'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Risk observations — max 2, only medium/high */}
      <FadeIn delay={0.1} className="mb-5">
        <RiskObservations risks={relapseRisks} />
      </FadeIn>

      {/* Trigger intelligence — expandable */}
      <FadeIn delay={0.15} className="mb-5">
        <TriggerIntelligence triggerData={triggerData} dogName={dogName} />
      </FadeIn>

      {/* Lifestyle archetype */}
      <FadeIn delay={0.2} className="mb-5">
        <ArchetypeCard lifestyle={lifestyle} />
      </FadeIn>
    </div>
  )
}
