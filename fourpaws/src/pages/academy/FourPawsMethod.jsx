// ─────────────────────────────────────────────────────────────────────────────
// THE FOUR PAWS METHOD™ — Methodology Page
// Scientific credibility. Behavioural authority. Luxury institute quality.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Shield, Award, BookOpen } from 'lucide-react'
import { useIntelligenceCore } from '../../hooks/useIntelligenceCore'
import { FOUR_PAWS_METHOD, detectTransformationStage, getStageNarrative } from '../../ai/fourPawsMethod'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { AmbientOrbs, CardEntrance } from '../../components/ui/PageTransition'
import { SOUNDS } from '../../ai/intelligenceCore'
import { useApp } from '../../context/AppContext'

// ─────────────────────────────────────────────────────────────────────────────
// PAW CARD — expandable methodology pillar
// ─────────────────────────────────────────────────────────────────────────────
function PawCard({ paw, index, expanded, onToggle }) {
  return (
    <CardEntrance index={index}>
      <motion.div
        className="relative overflow-hidden"
        style={{ border: `1px solid ${paw.colour}20` }}
        layout
      >
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${paw.colour}50, transparent)` }} />
        <div className="absolute top-0 left-0 bottom-0 w-0.5"
          style={{ background: `linear-gradient(180deg, ${paw.colour}60, transparent)` }} />

        <motion.button
          className="w-full flex items-start gap-4 p-6 text-left"
          onClick={() => { onToggle(); SOUNDS.tap() }}
          whileTap={{ scale: 0.998 }}
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ background: `${paw.colour}10`, border: `1px solid ${paw.colour}25` }}>
            {paw.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-sans text-[8px] uppercase tracking-[0.4em] mb-1" style={{ color: paw.colour }}>
              Paw {index + 1}
            </div>
            <h3 className="font-serif text-xl font-medium text-pearl mb-1">{paw.name}</h3>
            <p className="font-sans text-xs text-silver-500 italic font-light">{paw.tagline}</p>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={13} className="text-silver-600 mt-1.5 flex-shrink-0" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-white/5"
            >
              <div className="p-6 pt-5">
                <p className="font-sans text-sm text-silver-300 font-light leading-relaxed mb-5">
                  {paw.principle}
                </p>
                <div className="mb-5">
                  <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-silver-700 mb-3">Core Protocols</div>
                  <div className="space-y-2">
                    {paw.protocols.map((p, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ background: paw.colour }} />
                        <p className="font-sans text-xs text-silver-500 font-light leading-relaxed">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4"
                  style={{ background: `${paw.colour}06`, border: `1px solid ${paw.colour}20` }}>
                  <div className="font-sans text-[8px] uppercase tracking-widest mb-1" style={{ color: paw.colour }}>
                    Outcome Marker
                  </div>
                  <p className="font-sans text-xs text-silver-400 font-light italic">{paw.outcomeMarker}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </CardEntrance>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSFORMATION STAGE DISPLAY
// ─────────────────────────────────────────────────────────────────────────────
function TransformationStages({ currentStageId, dogName }) {
  return (
    <div className="relative">
      <div className="absolute left-[19px] top-8 bottom-8 w-px"
        style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.4) 0%, transparent 100%)' }} />
      <div className="space-y-2">
        {FOUR_PAWS_METHOD.transformationStages.map((stage, i) => {
          const isCurrent = stage.id === currentStageId
          const isPast    = FOUR_PAWS_METHOD.transformationStages.findIndex(s => s.id === currentStageId) > i
          return (
            <div key={stage.id} className="flex items-start gap-4 relative">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl relative z-10 transition-all duration-300`}
                style={{
                  background: isCurrent ? `${stage.colour}20` : isPast ? `${stage.colour}08` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isCurrent ? stage.colour + '60' : isPast ? stage.colour + '30' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isCurrent ? `0 0 12px ${stage.colour}30` : 'none',
                }}>
                {stage.icon}
              </div>
              <div className={`flex-1 min-w-0 py-2.5 ${isPast ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`font-sans text-xs font-medium ${isCurrent ? 'text-pearl' : 'text-silver-500'}`}>{stage.name}</span>
                  {isCurrent && (
                    <span className="font-sans text-[7px] px-1.5 py-0.5 uppercase tracking-widest"
                      style={{ background: `${stage.colour}15`, color: stage.colour, border: `1px solid ${stage.colour}30` }}>
                      Current
                    </span>
                  )}
                  {isPast && <span className="font-sans text-[8px] text-emerald-500">✓</span>}
                </div>
                <p className={`font-sans text-[10px] font-light leading-relaxed ${isCurrent ? 'text-silver-400' : 'text-silver-700'}`}>
                  {stage.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function FourPawsMethodPage() {
  const { state }       = useApp()
  const intelligence    = useIntelligenceCore()
  const { core, behaviourScores } = intelligence
  const dogName         = core?.dogName || 'your companion'

  const completedLessons = Object.values(state.courseProgress || {})
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)
  const currentStage = detectTransformationStage(behaviourScores, completedLessons, null)
  const stageNarrative = getStageNarrative(currentStage, dogName)

  const [expandedPaw, setExpandedPaw] = useState(null)
  const [showPrinciples, setShowPrinciples] = useState(false)

  return (
    <div className="min-h-screen p-5 lg:p-8 max-w-4xl mx-auto relative">
      <AmbientOrbs count={2} colour="rgba(201,168,76,0.02)" />

      {/* Hero */}
      <FadeIn className="mb-10 text-center relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="divider-gold w-10" />
            <span className="text-2xl">🐾</span>
            <div className="divider-gold w-10" />
          </div>
          <h1 className="luxury-heading text-5xl lg:text-6xl mb-2 shimmer-gold">
            The Four Paws Method™
          </h1>
          <p className="font-serif text-lg text-silver-500 font-light italic mb-4">
            {FOUR_PAWS_METHOD.tagline}
          </p>
          <p className="font-sans text-sm text-silver-600 font-light max-w-xl mx-auto leading-relaxed">
            {FOUR_PAWS_METHOD.philosophy}
          </p>
        </div>
      </FadeIn>

      {/* Current stage for this dog */}
      {currentStage && (
        <FadeIn delay={0.1} className="mb-8">
          <div className="p-5 text-center"
            style={{
              background: `${currentStage.colour}06`,
              border: `1px solid ${currentStage.colour}25`,
            }}>
            <div className="text-3xl mb-2">{currentStage.icon}</div>
            <div className="font-sans text-[8px] uppercase tracking-[0.4em] mb-1" style={{ color: currentStage.colour }}>
              {dogName}'s Current Phase
            </div>
            <div className="font-serif text-xl text-pearl mb-2">{currentStage.name}</div>
            <p className="font-sans text-xs text-silver-500 font-light italic max-w-md mx-auto">{stageNarrative}</p>
          </div>
        </FadeIn>
      )}

      {/* The Four Paws — pillar cards */}
      <FadeIn delay={0.15} className="mb-3">
        <div className="flex items-center gap-3">
          <div className="divider-gold w-6" />
          <span className="section-label text-[9px]">The Four Pillars</span>
        </div>
      </FadeIn>
      <div className="space-y-3 mb-8">
        {FOUR_PAWS_METHOD.coreFramework.map((paw, i) => (
          <PawCard key={paw.id} paw={paw} index={i}
            expanded={expandedPaw === paw.id}
            onToggle={() => setExpandedPaw(expandedPaw === paw.id ? null : paw.id)} />
        ))}
      </div>

      {/* Transformation stages */}
      <FadeIn delay={0.2} className="mb-8">
        <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Award size={13} className="text-gold-500" />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-silver-600">Transformation Journey</span>
          </div>
          <TransformationStages currentStageId={currentStage?.id} dogName={dogName} />
        </div>
      </FadeIn>

      {/* Stability principles */}
      <FadeIn delay={0.3} className="mb-8">
        <button onClick={() => { setShowPrinciples(p => !p); SOUNDS.tap() }}
          className="w-full flex items-center justify-between p-5 text-left transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <Shield size={13} className="text-gold-500" />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-silver-600">Stability Principles</span>
          </div>
          <motion.div animate={{ rotate: showPrinciples ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={13} className="text-silver-600" />
          </motion.div>
        </button>
        <AnimatePresence>
          {showPrinciples && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden">
              <div className="p-5 space-y-3"
                style={{ border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none' }}>
                {FOUR_PAWS_METHOD.stabilityPrinciples.map((principle, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-gold-600 flex-shrink-0 font-mono text-xs mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <p className="font-sans text-sm text-silver-400 font-light italic leading-relaxed">"{principle}"</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FadeIn>

      {/* Method footer */}
      <FadeIn delay={0.4}>
        <div className="text-center py-8 relative">
          <div className="divider-luxury mb-6" />
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="divider-gold w-8" />
            <span className="text-xl">🐾</span>
            <div className="divider-gold w-8" />
          </div>
          <p className="font-sans text-[8px] uppercase tracking-[0.5em] text-silver-700">Four Paws Training & Enrichment Academy</p>
          <p className="font-sans text-[7px] text-silver-800 mt-1 tracking-widest uppercase">
            The Four Paws Method™ · Version {FOUR_PAWS_METHOD.version}
          </p>
        </div>
      </FadeIn>
    </div>
  )
}
