// ─────────────────────────────────────────────────────────────
// FOUR PAWS — ELITE CALMNESS TRAINING MODE  (V3)
// Luxury calmness optimisation with ambient UI, breathing guide,
// soundscapes, and guided relaxation protocols.
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion'
import { Play, Square, ChevronRight, Wind, Volume2 } from 'lucide-react'
import { useAI } from '../../hooks/useAI'
import { useApp } from '../../context/AppContext'
import { SOUNDSCAPES, playSoundscape, stopSoundscape } from '../../ai/wellness'
import { speak, VOICE_COACH_AVAILABLE } from '../../ai/voiceCoach'
import { FadeIn } from '../../components/animations/FadeIn'
import { purifyText } from '../../ai/narrativeVoice'

// ── Breathing guide ───────────────────────────────────────────
const BREATHING_PHASES = [
  { label: 'Breathe In',  duration: 4000, scale: 1.35, colour: '#10B981' },
  { label: 'Hold',        duration: 2000, scale: 1.35, colour: '#C9A84C' },
  { label: 'Breathe Out', duration: 6000, scale: 0.85, colour: '#8B5CF6' },
  { label: 'Rest',        duration: 2000, scale: 0.85, colour: '#6B7280' },
]

const CALM_PROTOCOLS = [
  {
    id: 'settle',
    title: 'Mat Settle Protocol',
    icon: '🧘',
    duration: '10 min',
    colour: '#10B981',
    steps: [
      'Place your dog\'s mat in a quiet, low-light area.',
      'Lead them calmly to the mat without excitement.',
      'Drop a scatter of high-value treats onto the mat surface.',
      'Step back and give them space to self-settle.',
      'Every 60 seconds of calm mat time, add another treat drop.',
      'After 5 minutes of settled behaviour, quietly praise and release.',
    ],
    voiceScript: 'Begin the mat settle protocol. Lead your dog calmly to their mat. Drop a scatter of treats and step back. We\'re aiming for self-directed calm — no commands needed.',
  },
  {
    id: 'breathing',
    title: 'Co-Regulation Breathing',
    icon: '🫁',
    duration: '5 min',
    colour: '#8B5CF6',
    steps: [
      'Sit beside your dog on the floor — no direct eye contact.',
      'Begin breathing slowly and deeply, audibly.',
      'Place one hand gently on your dog if accepted.',
      'Match your exhale length to 6 seconds.',
      'Hold this rhythm for 5 minutes without interruption.',
      'Your calm nervous system becomes their resource.',
    ],
    voiceScript: 'Co-regulation breathing. Sit beside your dog. Breathe slowly. In for four... hold for two... out for six. Your calm is contagious.',
  },
  {
    id: 'ttouch',
    title: 'TTouch Body Work',
    icon: '🤲',
    duration: '15 min',
    colour: '#06B6D4',
    steps: [
      'Begin at the base of the ears — small, slow circular motions.',
      'Move to the shoulders using gentle C-shaped circles.',
      'Continue down the back in slow, rhythmic strokes.',
      'Work the legs from shoulder to paw if accepted.',
      'Finish with slow, long strokes along the entire body.',
      'Maintain consistent pressure — neither too light nor too firm.',
    ],
    voiceScript: 'TTouch body work. Begin at the base of the ears with slow circular movements. Your touch is calm and deliberate. This activates the parasympathetic nervous system.',
  },
  {
    id: 'lickimat',
    title: 'Lickimat Meditation',
    icon: '😌',
    duration: '15 min',
    colour: '#F59E0B',
    steps: [
      'Prepare a lickimat with plain yoghurt, banana, or xylitol-free peanut butter.',
      'Place the mat in a quiet, dimly lit area.',
      'Allow your dog to access the mat without commands.',
      'Sit nearby in silence — no interaction.',
      'The rhythmic licking motion releases endorphins and lowers cortisol.',
      'Allow the session to complete naturally — 10–20 minutes.',
    ],
    voiceScript: 'Lickimat meditation session begun. Rhythmic licking releases endorphins and reduces cortisol significantly. Allow the session to complete without interruption.',
  },
]

function BreathingGuide({ active, onComplete }) {
  const [phaseIdx,   setPhaseIdx]   = useState(0)
  const [progress,   setProgress]   = useState(0)
  const [cycles,     setCycles]     = useState(0)
  const startRef     = useRef(null)
  const totalCycles  = 5

  useEffect(() => {
    if (!active) { setPhaseIdx(0); setProgress(0); setCycles(0); return }
    startRef.current = Date.now()
    let frame
    const tick = () => {
      const phase    = BREATHING_PHASES[phaseIdx]
      const elapsed  = Date.now() - startRef.current
      const pct      = Math.min(1, elapsed / phase.duration)
      setProgress(pct)
      if (pct >= 1) {
        const next = (phaseIdx + 1) % BREATHING_PHASES.length
        if (next === 0) {
          const newCycles = cycles + 1
          setCycles(newCycles)
          if (newCycles >= totalCycles) { onComplete?.(); return }
        }
        setPhaseIdx(next)
        startRef.current = Date.now()
        setProgress(0)
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, phaseIdx, cycles])

  const phase = BREATHING_PHASES[phaseIdx]

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Orb */}
      <div className="relative flex items-center justify-center w-52 h-52">
        {/* Ambient rings */}
        {[1, 2, 3].map(i => (
          <motion.div key={i}
            className="absolute rounded-full border"
            style={{ borderColor: phase.colour + '20', width: `${80 + i * 35}px`, height: `${80 + i * 35}px` }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.6 }} />
        ))}

        {/* Main orb */}
        <motion.div
          className="relative w-32 h-32 rounded-full flex items-center justify-center"
          animate={{ scale: phase.scale }}
          transition={{ duration: phase.duration / 1000, ease: 'easeInOut' }}
          style={{ background: `radial-gradient(circle, ${phase.colour}50 0%, ${phase.colour}15 60%, transparent 100%)`, border: `1px solid ${phase.colour}40` }}>
          <motion.div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: `radial-gradient(circle, ${phase.colour}30 0%, transparent 100%)` }}>
            <Wind size={24} style={{ color: phase.colour }} />
          </motion.div>
        </motion.div>

        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 208 208">
          <circle cx="104" cy="104" r="100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
          <motion.circle cx="104" cy="104" r="100" fill="none"
            stroke={phase.colour} strokeWidth="1.5" strokeLinecap="round"
            style={{ strokeDasharray: 628, strokeDashoffset: 628 - (progress * 628) }} />
        </svg>
      </div>

      {/* Phase label */}
      <div className="text-center">
        <motion.div key={phaseIdx}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="luxury-heading text-3xl mb-1" style={{ color: phase.colour }}>
          {phase.label}
        </motion.div>
        <div className="font-sans text-xs text-silver-600">Cycle {cycles + 1} of {totalCycles}</div>
      </div>
    </div>
  )
}

export default function CalmnessCentre() {
  const { state }       = useApp()
  const { dogProfile }  = useAI()
  const dog             = dogProfile || state.dogProfile
  const dogName         = dog?.name || 'your companion'

  const [activeProtocol, setActiveProtocol]  = useState(null)
  const [stepIdx,        setStepIdx]         = useState(0)
  const [breathing,      setBreathing]       = useState(false)
  const [activeSounds,   setActiveSounds]    = useState(null)
  const [protocolDone,   setProtocolDone]    = useState(false)

  const startProtocol = (protocol) => {
    setActiveProtocol(protocol)
    setStepIdx(0)
    setProtocolDone(false)
    if (VOICE_COACH_AVAILABLE) speak(protocol.voiceScript)
  }

  const nextStep = () => {
    if (stepIdx < activeProtocol.steps.length - 1) {
      setStepIdx(s => s + 1)
      if (VOICE_COACH_AVAILABLE) speak(activeProtocol.steps[stepIdx + 1])
    } else {
      setProtocolDone(true)
    }
  }

  const toggleSound = (soundscape) => {
    if (activeSounds?.id === soundscape.id) {
      stopSoundscape(); setActiveSounds(null)
    } else {
      const ok = playSoundscape(soundscape)
      if (ok) setActiveSounds(soundscape)
    }
  }

  useEffect(() => () => stopSoundscape(), [])

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-4xl mx-auto">

      {/* Header */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Calmness Training</div>
        <h1 className="luxury-heading text-4xl">
          {dogName}'s<br /><span className="text-gold-gradient italic">Calmness Centre</span>
        </h1>
        <p className="font-sans text-sm font-light text-silver-500 mt-3 max-w-lg">
          Structured calm is a learnt skill. These protocols build a conditioned relaxation response over time.
        </p>
      </FadeIn>

      {/* Co-Regulation Breathing Guide */}
      <FadeIn className="mb-8">
        <div className="glass-card overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="section-label mb-1 text-purple-400">Co-Regulation</div>
                <h2 className="luxury-heading text-2xl">Breathing Guide</h2>
                <p className="font-sans text-xs text-silver-500 mt-1">4 seconds in · 2 hold · 6 out · 5 cycles</p>
              </div>
              <motion.button
                onClick={() => setBreathing(b => !b)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 font-sans text-xs font-medium tracking-widest uppercase transition-all"
                style={{
                  background: breathing ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.15)',
                  border: '1px solid rgba(139,92,246,0.4)', color: '#A78BFA',
                }}>
                {breathing ? <><Square size={12} /> Stop</> : <><Play size={12} /> Begin</>}
              </motion.button>
            </div>
          </div>
          <AnimatePresence>
            {breathing && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
                <BreathingGuide active={breathing} onComplete={() => setBreathing(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeIn>

      {/* Calm Protocols */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Guided Protocols</div>
        <h2 className="luxury-heading text-2xl mb-5">Calmness Exercises</h2>

        <AnimatePresence mode="wait">
          {!activeProtocol ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CALM_PROTOCOLS.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3, borderColor: p.colour + '40' }}
                  className="glass-card p-5 cursor-pointer transition-all"
                  style={{ border: `1px solid ${p.colour}20` }}
                  onClick={() => startProtocol(p)}>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">{p.icon}</span>
                    <div className="flex-1">
                      <div className="font-serif text-base font-medium text-pearl mb-0.5">{p.title}</div>
                      <div className="font-sans text-[10px] text-silver-600">{p.duration}</div>
                    </div>
                    <ChevronRight size={14} style={{ color: p.colour }} className="flex-shrink-0 mt-1" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="protocol" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="glass-card" style={{ border: `1px solid ${activeProtocol.colour}30` }}>
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{activeProtocol.icon}</span>
                    <div>
                      <div className="font-sans text-[9px] uppercase tracking-widest mb-0.5" style={{ color: activeProtocol.colour }}>Active Protocol</div>
                      <div className="font-serif text-lg text-pearl">{activeProtocol.title}</div>
                    </div>
                  </div>
                  <button onClick={() => setActiveProtocol(null)}
                    className="font-sans text-xs text-silver-600 hover:text-silver-300">← Back</button>
                </div>

                {/* Steps */}
                <div className="p-6">
                  {!protocolDone ? (
                    <>
                      {/* Step counter */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="font-sans text-[10px] text-silver-600">
                          Step {stepIdx + 1} of {activeProtocol.steps.length}
                        </div>
                        <div className="flex-1 h-0.5 bg-white/5 overflow-hidden rounded-full">
                          <motion.div className="h-full rounded-full"
                            style={{ background: activeProtocol.colour }}
                            animate={{ width: `${((stepIdx + 1) / activeProtocol.steps.length) * 100}%` }}
                            transition={{ duration: 0.5 }} />
                        </div>
                      </div>

                      {/* Current step */}
                      <motion.div key={stepIdx}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="p-5 mb-5 border" style={{ borderColor: activeProtocol.colour + '25', background: activeProtocol.colour + '05' }}>
                        <p className="font-sans text-sm text-silver-200 leading-relaxed font-light">
                          {activeProtocol.steps[stepIdx]}
                        </p>
                      </motion.div>

                      <motion.button onClick={nextStep} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 font-sans text-xs font-medium tracking-widest uppercase px-6 py-3 w-full justify-center transition-all"
                        style={{ background: activeProtocol.colour + '15', border: `1px solid ${activeProtocol.colour}40`, color: activeProtocol.colour }}>
                        {stepIdx < activeProtocol.steps.length - 1 ? 'Next Step' : 'Complete Protocol'}
                        <ChevronRight size={12} />
                      </motion.button>
                    </>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6">
                      <div className="text-5xl mb-4">🌸</div>
                      <div className="section-label mb-2 text-emerald-400">Protocol Complete</div>
                      <h3 className="luxury-heading text-2xl mb-2">Well done.</h3>
                      <p className="font-sans text-sm text-silver-500 mb-5">
                        Each calm session builds the conditioned response. {dogName} is learning.
                      </p>
                      <button onClick={() => setActiveProtocol(null)}
                        className="font-sans text-xs text-gold-500 hover:text-gold-400">Return to protocols →</button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FadeIn>

      {/* Ambient Soundscapes */}
      <FadeIn>
        <div className="section-label mb-1">Ambient Environments</div>
        <h2 className="luxury-heading text-2xl mb-4">Calmness Soundscapes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SOUNDSCAPES.map(s => {
            const isActive = activeSounds?.id === s.id
            return (
              <motion.button key={s.id} onClick={() => toggleSound(s)} whileHover={{ y: -2 }}
                className={`p-4 border text-left transition-all ${isActive ? 'border-gold-500/30 bg-gold-500/5' : 'border-white/5 hover:border-white/12'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-sans text-sm font-medium ${isActive ? 'text-gold-400' : 'text-silver-300'}`}>{s.name}</div>
                    <div className="font-sans text-[9px] text-silver-600 mt-0.5">{s.desc}</div>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-gold-gradient' : 'border border-white/10'}`}>
                    {isActive ? <Square size={9} className="text-charcoal-900" /> : <Play size={9} className="text-silver-600" />}
                  </div>
                </div>
                {isActive && (
                  <div className="mt-2 flex items-center gap-1">
                    {[...Array(8)].map((_, i) => (
                      <motion.div key={i} className="w-0.5 rounded-full bg-gold-400"
                        animate={{ height: [4, 12, 4] }}
                        transition={{ duration: 0.8 + i * 0.1, repeat: Infinity, delay: i * 0.1 }} />
                    ))}
                    <span className="font-sans text-[8px] text-gold-600 ml-2">Playing</span>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
        <p className="font-sans text-[9px] text-silver-700 mt-3">Binaural tones generated locally. Use headphones for full effect. Works fully offline.</p>
      </FadeIn>
    </div>
  )
}
