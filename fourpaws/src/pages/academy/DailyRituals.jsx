// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — INTERACTIVE DAILY RITUALS
// Morning, evening, wellness, and confidence rituals.
// Step-by-step guided experience with habit tracking.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Circle, ChevronDown, Sun, Moon, Heart, Shield } from 'lucide-react'
import { useIntelligenceCore } from '../../hooks/useIntelligenceCore'
import { DAILY_RITUALS, getTodaysRitualProgress, markRitualComplete } from '../../ai/fourPawsMethod'
import { SOUNDS } from '../../ai/intelligenceCore'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { AmbientOrbs, CardEntrance } from '../../components/ui/PageTransition'

const RITUAL_ICONS = {
  morning:    <Sun size={16} className="text-amber-400" />,
  evening:    <Moon size={16} className="text-indigo-400" />,
  wellness:   <Heart size={16} className="text-emerald-400" />,
  confidence: <Shield size={16} className="text-gold-500" />,
}

// ─────────────────────────────────────────────────────────────────────────────
// RITUAL CARD — expandable with step-by-step guided flow
// ─────────────────────────────────────────────────────────────────────────────
function RitualCard({ ritual, dogName, expanded, onToggle }) {
  const [completedSteps, setCompletedSteps] = useState(() => getTodaysRitualProgress(ritual.id))
  const progress = Math.round((completedSteps.length / ritual.steps.length) * 100)
  const isComplete = completedSteps.length === ritual.steps.length

  const handleStep = (stepId) => {
    if (completedSteps.includes(stepId)) return
    SOUNDS.complete()
    const updated = markRitualComplete(ritual.id, stepId)
    setCompletedSteps(updated[new Date().toDateString()]?.[ritual.id] || [...completedSteps, stepId])
  }

  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        border: `1px solid ${isComplete ? ritual.colour + '40' : ritual.colour + '18'}`,
        background: isComplete ? `${ritual.colour}04` : 'transparent',
      }}
      layout
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${ritual.colour}${isComplete ? '60' : '30'}, transparent)` }} />

      {/* Header */}
      <motion.button
        className="w-full flex items-start gap-4 p-5 text-left"
        onClick={() => { onToggle(); SOUNDS.tap() }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{ background: `${ritual.colour}10`, border: `1px solid ${ritual.colour}25` }}>
          {ritual.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className={`font-serif text-base font-medium ${isComplete ? 'text-pearl' : 'text-silver-300'}`}>
              {ritual.name}
            </h3>
            {isComplete && (
              <span className="font-sans text-[7px] px-1.5 py-0.5 uppercase tracking-widest"
                style={{ background: `${ritual.colour}15`, color: ritual.colour, border: `1px solid ${ritual.colour}30` }}>
                Complete
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-[9px] text-silver-700">{ritual.duration}</span>
            <span className="font-sans text-[9px] text-silver-700">·</span>
            <span className="font-sans text-[9px] text-silver-700">{ritual.steps.length} steps</span>
            <div className="flex-1 h-0.5 bg-white/5 overflow-hidden">
              <motion.div className="h-full"
                style={{ background: ritual.colour }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }} />
            </div>
            <span className="font-sans text-[9px]" style={{ color: ritual.colour }}>{progress}%</span>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={13} className="text-silver-600 flex-shrink-0 mt-1" />
        </motion.div>
      </motion.button>

      {/* Steps */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-5 space-y-3">
              {ritual.steps.map((step, i) => {
                const done = completedSteps.includes(step.id)
                return (
                  <motion.div key={step.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-start gap-3 p-4 cursor-pointer transition-all duration-200 ${done ? 'opacity-60' : ''}`}
                    style={{
                      background: done ? `${ritual.colour}06` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${done ? ritual.colour + '25' : 'rgba(255,255,255,0.05)'}`,
                    }}
                    onClick={() => handleStep(step.id)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {done
                        ? <CheckCircle size={16} style={{ color: ritual.colour }} />
                        : <Circle size={16} className="text-silver-700" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-sans text-xs font-medium mb-1 ${done ? '' : 'text-pearl'}`}
                        style={{ color: done ? ritual.colour : undefined }}>
                        {i + 1}. {step.label}
                      </div>
                      <p className="font-sans text-[10px] text-silver-500 font-light leading-relaxed">
                        {step.desc.replace(/your dog/g, dogName || 'your dog')}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4">
                  <div className="text-2xl mb-2">✨</div>
                  <p className="font-serif text-sm text-pearl italic">
                    {ritual.name} complete. {dogName || 'Your companion'} is supported.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function DailyRituals() {
  const intelligence = useIntelligenceCore()
  const { core }     = intelligence
  const dogName      = core?.dogName || 'your companion'
  const hour         = new Date().getHours()

  // Determine which rituals are most relevant now
  const orderedRituals = useMemo(() => {
    const all = Object.values(DAILY_RITUALS)
    if (hour < 10) return [all[0], all[2], all[3], all[1]] // morning first
    if (hour >= 17) return [all[1], all[2], all[3], all[0]] // evening first
    return all
  }, [hour])

  const [expandedId, setExpandedId] = useState(orderedRituals[0]?.id || null)

  const totalCompleted = useMemo(() => {
    return Object.values(DAILY_RITUALS).reduce((acc, r) => {
      return acc + getTodaysRitualProgress(r.id).length
    }, 0)
  }, [])

  const totalSteps = Object.values(DAILY_RITUALS).reduce((acc, r) => acc + r.steps.length, 0)

  return (
    <div className="min-h-screen p-5 lg:p-8 max-w-3xl mx-auto relative">
      <AmbientOrbs count={1} colour="rgba(201,168,76,0.02)" />

      {/* Header */}
      <FadeIn className="mb-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="divider-gold w-6" />
          <span className="section-label text-[9px]">Daily Practice</span>
        </div>
        <h1 className="luxury-heading text-4xl mb-1">Rituals</h1>
        <p className="font-sans text-sm text-silver-600 font-light">
          Daily structured practices that build {dogName}'s emotional foundation.
        </p>
      </FadeIn>

      {/* Today's progress */}
      <FadeIn delay={0.1} className="mb-7">
        <div className="flex items-center justify-between p-5"
          style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <div>
            <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-gold-700 mb-1">Today's Ritual Progress</div>
            <div className="font-display text-2xl font-light text-gold-400">{totalCompleted} <span className="text-sm text-silver-600">/ {totalSteps} steps</span></div>
          </div>
          <div className="relative w-14 h-14">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <motion.circle cx="24" cy="24" r="20" fill="none"
                stroke="#C9A84C" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 20}
                initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - totalCompleted / totalSteps) }}
                transition={{ duration: 1, ease: 'easeOut' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-display text-sm text-gold-400">
              {Math.round((totalCompleted / totalSteps) * 100)}%
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Ritual cards */}
      <div className="space-y-3">
        {orderedRituals.map((ritual, i) => (
          <CardEntrance key={ritual.id} index={i}>
            <RitualCard
              ritual={ritual}
              dogName={dogName}
              expanded={expandedId === ritual.id}
              onToggle={() => setExpandedId(expandedId === ritual.id ? null : ritual.id)}
            />
          </CardEntrance>
        ))}
      </div>

      {/* Philosophy note */}
      <FadeIn delay={0.5} className="mt-8">
        <div className="p-5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="font-sans text-xs text-silver-600 font-light italic leading-relaxed text-center">
            "Rituals are not routine. They are the deliberate architecture of transformation — repeated until they become effortless."
          </p>
          <p className="font-sans text-[8px] text-silver-800 text-center mt-2 uppercase tracking-widest">
            The Four Paws Method™
          </p>
        </div>
      </FadeIn>
    </div>
  )
}
