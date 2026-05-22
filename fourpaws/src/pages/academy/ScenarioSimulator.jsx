// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — BEHAVIOUR SCENARIO SIMULATOR
// Interactive scenario preparation system with concierge guidance.
// Offline-first. Behaviour-aware stage guidance.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, CheckCircle, Circle, BookOpen, Target } from 'lucide-react'
import { useIntelligenceCore } from '../../hooks/useIntelligenceCore'
import { BEHAVIOUR_SCENARIOS, loadScenarioLog, markScenarioStageComplete } from '../../ai/fourPawsMethod'
import { SOUNDS } from '../../ai/intelligenceCore'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { AmbientOrbs, CardEntrance } from '../../components/ui/PageTransition'

const DIFFICULTY_COLOURS = { Foundation: '#10B981', Intermediate: '#C9A84C', Advanced: '#EF4444' }

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO DETAIL VIEW — full guided walkthrough
// ─────────────────────────────────────────────────────────────────────────────
function ScenarioDetail({ scenario, dogName, log, onBack }) {
  const [stageIdx, setStageIdx]       = useState(0)
  const [localLog, setLocalLog]       = useState(log || { completedStages: [], practiceCount: 0 })
  const [showReadiness, setShowReadiness] = useState(false)
  const stage    = scenario.stages[stageIdx]
  const isLast   = stageIdx === scenario.stages.length - 1
  const isDone   = localLog.completedStages.includes(stageIdx)
  const colour   = scenario.colour

  const handleComplete = () => {
    SOUNDS.complete()
    const updated = markScenarioStageComplete(scenario.id, stageIdx)
    setLocalLog(updated)
    if (!isLast) setTimeout(() => setStageIdx(i => i + 1), 400)
  }

  const allDone = scenario.stages.every((_, i) => localLog.completedStages.includes(i))

  return (
    <div className="min-h-screen p-5 lg:p-8 max-w-2xl mx-auto">
      <AmbientOrbs count={1} colour={`${colour}08`} />

      {/* Back */}
      <FadeIn className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-silver-600 hover:text-silver-300 transition-colors">
          <ChevronLeft size={14} />
          <span className="font-sans text-[9px] uppercase tracking-widest">All Scenarios</span>
        </button>
      </FadeIn>

      {/* Scenario header */}
      <FadeIn className="mb-7">
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">{scenario.icon}</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-serif text-2xl font-medium text-pearl">{scenario.name}</h1>
              <span className="font-sans text-[8px] px-2 py-0.5 uppercase tracking-widest"
                style={{ color: DIFFICULTY_COLOURS[scenario.difficulty], border: `1px solid ${DIFFICULTY_COLOURS[scenario.difficulty]}30`, background: `${DIFFICULTY_COLOURS[scenario.difficulty]}10` }}>
                {scenario.difficulty}
              </span>
            </div>
            <p className="font-sans text-xs text-silver-500 font-light leading-relaxed">{scenario.desc}</p>
          </div>
        </div>
      </FadeIn>

      {/* Stage progress */}
      <FadeIn delay={0.1} className="mb-6">
        <div className="flex items-center gap-2">
          {scenario.stages.map((s, i) => (
            <React.Fragment key={i}>
              <button
                onClick={() => { setStageIdx(i); SOUNDS.tap() }}
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-sans text-[9px] transition-all duration-200"
                style={{
                  background: localLog.completedStages.includes(i) ? colour : i === stageIdx ? `${colour}20` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${i === stageIdx ? colour : localLog.completedStages.includes(i) ? colour + '60' : 'rgba(255,255,255,0.1)'}`,
                  color: localLog.completedStages.includes(i) ? '#000' : i === stageIdx ? colour : 'rgba(255,255,255,0.4)',
                }}>
                {localLog.completedStages.includes(i) ? '✓' : i + 1}
              </button>
              {i < scenario.stages.length - 1 && (
                <div className="flex-1 h-px"
                  style={{ background: localLog.completedStages.includes(i) ? colour + '40' : 'rgba(255,255,255,0.06)' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </FadeIn>

      {/* Stage content */}
      <AnimatePresence mode="wait">
        <motion.div key={stageIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}>
          <div className="mb-6 p-6"
            style={{ background: `${colour}05`, border: `1px solid ${colour}20`, borderLeft: `3px solid ${colour}50` }}>
            <div className="font-sans text-[8px] uppercase tracking-[0.35em] mb-2" style={{ color: colour }}>
              Stage {stageIdx + 1} of {scenario.stages.length}
            </div>
            <h2 className="font-serif text-xl font-medium text-pearl mb-4">{stage.label}</h2>
            <p className="font-sans text-sm text-silver-300 font-light leading-relaxed">
              {stage.guidance.replace(/your dog/g, dogName || 'your dog')}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {stageIdx > 0 && (
              <button onClick={() => { setStageIdx(i => i - 1); SOUNDS.tap() }}
                className="flex items-center gap-2 px-4 py-3 font-sans text-xs uppercase tracking-widest text-silver-500 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <ChevronLeft size={12} /> Previous
              </button>
            )}
            <button onClick={handleComplete}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 font-sans text-xs uppercase tracking-widest transition-all duration-200"
              style={{
                background: isDone ? `${colour}15` : `${colour}20`,
                border: `1px solid ${colour}40`,
                color: colour,
              }}>
              {isDone ? <CheckCircle size={13} /> : <Circle size={13} />}
              {isDone ? (isLast ? 'Scenario Complete ✓' : 'Continue') : `Mark Stage ${stageIdx + 1} Complete`}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Readiness cues */}
      <FadeIn delay={0.3} className="mt-7">
        <button onClick={() => { setShowReadiness(r => !r); SOUNDS.tap() }}
          className="w-full flex items-center justify-between p-4 text-left transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <Target size={12} className="text-silver-600" />
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-600">Readiness Indicators</span>
          </div>
          <ChevronRight size={12} className="text-silver-700" style={{ transform: showReadiness ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        <AnimatePresence>
          {showReadiness && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden">
              <div className="p-4 space-y-2"
                style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderTop: 'none' }}>
                {scenario.readinessCues.map((cue, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: scenario.colour }} />
                    <p className="font-sans text-xs text-silver-500 font-light">{cue}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FadeIn>

      {/* Common mistakes */}
      <FadeIn delay={0.4} className="mt-3">
        <div className="p-4"
          style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.12)' }}>
          <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-red-600 mb-3">Common Pitfalls</div>
          <div className="space-y-1.5">
            {scenario.commonMistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0 text-xs mt-0.5">✕</span>
                <p className="font-sans text-xs text-silver-500 font-light">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO GRID CARD
// ─────────────────────────────────────────────────────────────────────────────
function ScenarioCard({ scenario, log, onSelect, index }) {
  const completed = log?.completedStages?.length || 0
  const total     = scenario.stages.length
  const progress  = Math.round((completed / total) * 100)
  const colour    = scenario.colour

  return (
    <CardEntrance index={index}>
      <motion.div
        className="relative overflow-hidden cursor-pointer"
        style={{ border: `1px solid ${colour}20` }}
        onClick={() => { onSelect(scenario); SOUNDS.tap() }}
        whileHover={{ y: -2, borderColor: `${colour}40` }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${colour}40, transparent)` }} />
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 h-0.5"
            style={{ width: `${progress}%`, background: colour + '60' }} />
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <span className="text-2xl">{scenario.icon}</span>
            <span className="font-sans text-[8px] px-2 py-0.5 uppercase tracking-widest flex-shrink-0"
              style={{ color: DIFFICULTY_COLOURS[scenario.difficulty], border: `1px solid ${DIFFICULTY_COLOURS[scenario.difficulty]}25`, background: `${DIFFICULTY_COLOURS[scenario.difficulty]}08` }}>
              {scenario.difficulty}
            </span>
          </div>
          <h3 className="font-serif text-base font-medium text-pearl mb-1">{scenario.name}</h3>
          <p className="font-sans text-[10px] text-silver-600 font-light line-clamp-2 leading-relaxed">{scenario.desc}</p>
          {progress > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
              <div className="flex-1 h-0.5 bg-white/5 overflow-hidden">
                <div className="h-full" style={{ width: `${progress}%`, background: colour }} />
              </div>
              <span className="font-sans text-[8px]" style={{ color: colour }}>{progress}%</span>
            </div>
          )}
        </div>
      </motion.div>
    </CardEntrance>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ScenarioSimulator() {
  const intelligence   = useIntelligenceCore()
  const { core }       = intelligence
  const dogName        = core?.dogName || 'your companion'
  const [selected, setSelected] = useState(null)
  const scenarioLog    = useMemo(() => loadScenarioLog(), [])

  if (selected) {
    return <ScenarioDetail
      scenario={selected}
      dogName={dogName}
      log={scenarioLog[selected.id]}
      onBack={() => setSelected(null)}
    />
  }

  return (
    <div className="min-h-screen p-5 lg:p-8 max-w-4xl mx-auto relative">
      <AmbientOrbs count={1} colour="rgba(201,168,76,0.02)" />

      <FadeIn className="mb-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="divider-gold w-6" />
          <span className="section-label text-[9px]">Behaviour Preparation</span>
        </div>
        <h1 className="luxury-heading text-4xl mb-1">Scenario Simulator</h1>
        <p className="font-sans text-sm text-silver-600 font-light">
          Guided preparation for {dogName}'s real-world behavioural challenges.
        </p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BEHAVIOUR_SCENARIOS.map((s, i) => (
          <ScenarioCard key={s.id} scenario={s} log={scenarioLog[s.id]} onSelect={setSelected} index={i} />
        ))}
      </div>

      <FadeIn delay={0.4} className="mt-8">
        <div className="p-5 text-center"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="font-sans text-xs text-silver-600 font-light italic">
            Each scenario is designed around The Four Paws Method™ principles. Progress at {dogName}'s pace.
          </p>
        </div>
      </FadeIn>
    </div>
  )
}
