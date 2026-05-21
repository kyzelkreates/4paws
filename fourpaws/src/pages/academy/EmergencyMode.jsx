import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ChevronRight, ChevronLeft, CheckCircle, Volume2, VolumeX } from 'lucide-react'
import { useAI } from '../../hooks/useAI'
import { useApp } from '../../context/AppContext'
import {
  EMERGENCY_SCENARIOS,
  getEmergencyProtocol,
} from '../../ai/concierge'
import { speak, stopSpeaking, isVoiceEnabled, VOICE_COACH_AVAILABLE } from '../../ai/voiceCoach'
import { FadeIn } from '../../components/animations/FadeIn'

const STEP_STATES = { IDLE: 'idle', ACTIVE: 'active', DONE: 'done' }

export default function EmergencyMode() {
  const { dogProfile } = useAI()
  const { state }      = useApp()
  const dog            = dogProfile || state.dogProfile
  const dogName        = dog?.name || 'your companion'

  const [selected,  setSelected]  = useState(null)
  const [protocol,  setProtocol]  = useState(null)
  const [stepIdx,   setStepIdx]   = useState(0)
  const [stepsDone, setStepsDone] = useState({})
  const [voiceOn,   setVoiceOn]   = useState(isVoiceEnabled())

  const selectScenario = (scenario) => {
    setSelected(scenario)
    const p = getEmergencyProtocol(scenario.id)
    setProtocol(p)
    setStepIdx(0)
    setStepsDone({})

    if (voiceOn && VOICE_COACH_AVAILABLE) {
      speak(`${p.title}. ${dogName}, we're going to get through this. Step one. ${p.immediateSteps[0]}`)
    }
  }

  const nextStep = () => {
    const newDone = { ...stepsDone, [stepIdx]: true }
    setStepsDone(newDone)
    const next = stepIdx + 1
    if (next < protocol.immediateSteps.length) {
      setStepIdx(next)
      if (voiceOn && VOICE_COACH_AVAILABLE) {
        speak(`Step ${next + 1} of ${protocol.immediateSteps.length}. ${protocol.immediateSteps[next]}`)
      }
    }
  }

  const reset = () => {
    stopSpeaking()
    setSelected(null)
    setProtocol(null)
    setStepIdx(0)
    setStepsDone({})
  }

  const toggleVoice = () => {
    if (voiceOn) stopSpeaking()
    setVoiceOn(!voiceOn)
  }

  const allStepsDone = protocol && Object.keys(stepsDone).length >= protocol.immediateSteps.length

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-3xl mx-auto">

      {/* Header */}
      <FadeIn className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle size={14} className="text-red-400" />
          </div>
          <div className="section-label text-red-400 text-[9px]">Emergency Behaviour System</div>
        </div>
        <h1 className="luxury-heading text-4xl">
          Immediate<br /><span className="italic text-red-400/80">Guidance Mode</span>
        </h1>
        <p className="font-sans text-sm font-light text-silver-400 mt-3 leading-relaxed max-w-lg">
          Select the behaviour your dog is experiencing right now. Step-by-step recovery guidance will be generated immediately.
        </p>
      </FadeIn>

      {/* Voice toggle */}
      {VOICE_COACH_AVAILABLE && (
        <FadeIn className="mb-6">
          <button onClick={toggleVoice}
            className={`flex items-center gap-2 px-4 py-2 font-sans text-xs border transition-all ${
              voiceOn ? 'border-gold-500/40 text-gold-400 bg-gold-500/8' : 'border-white/8 text-silver-600 hover:border-white/20'
            }`}>
            {voiceOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
            Voice guidance {voiceOn ? 'on' : 'off'}
          </button>
        </FadeIn>
      )}

      <AnimatePresence mode="wait">

        {/* ── SCENARIO SELECTION ── */}
        {!selected && (
          <motion.div key="scenarios" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EMERGENCY_SCENARIOS.map((scenario, i) => (
                <motion.button
                  key={scenario.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3, borderColor: 'rgba(239,68,68,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectScenario(scenario)}
                  className="glass-card p-5 text-left transition-all"
                  style={{ border: '1px solid rgba(239,68,68,0.15)' }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">{scenario.icon}</span>
                    <div>
                      <div className="font-serif text-base font-medium text-pearl mb-1">{scenario.label}</div>
                      <div className="font-sans text-xs font-light text-silver-500 leading-snug">{scenario.description}</div>
                    </div>
                    <ChevronRight size={14} className="text-silver-700 flex-shrink-0 mt-1 ml-auto" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── ACTIVE PROTOCOL ── */}
        {selected && protocol && (
          <motion.div key="protocol" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

            {/* Protocol header */}
            <div className="glass-card p-6 mb-6" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.03)' }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selected.icon}</span>
                <div>
                  <div className="font-sans text-[9px] text-red-400 uppercase tracking-widest">Active Protocol</div>
                  <div className="font-serif text-xl font-medium text-pearl">{protocol.title}</div>
                </div>
                <button onClick={reset} className="ml-auto font-sans text-xs text-silver-600 hover:text-silver-300 transition-colors flex items-center gap-1">
                  <ChevronLeft size={12} /> Back
                </button>
              </div>
              {dogName !== 'your companion' && (
                <p className="font-sans text-xs text-silver-500 mt-1">
                  Immediate recovery guidance for {dogName}
                </p>
              )}
            </div>

            {/* Step counter */}
            <div className="flex items-center gap-3 mb-5">
              <div className="font-sans text-xs text-silver-600">
                Step {Math.min(stepIdx + 1, protocol.immediateSteps.length)} of {protocol.immediateSteps.length}
              </div>
              <div className="flex-1 h-0.5 bg-white/5 overflow-hidden">
                <motion.div className="h-full bg-red-400/60"
                  animate={{ width: `${((Object.keys(stepsDone).length) / protocol.immediateSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }} />
              </div>
            </div>

            {/* Immediate steps */}
            <div className="space-y-3 mb-8">
              {protocol.immediateSteps.map((step, i) => {
                const isDone    = !!stepsDone[i]
                const isCurrent = i === stepIdx && !allStepsDone
                const isFuture  = i > stepIdx

                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isFuture ? 0.35 : 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-start gap-4 p-5 transition-all ${
                      isCurrent ? 'glass-card' : ''
                    }`}
                    style={{
                      border: isCurrent ? '1px solid rgba(239,68,68,0.3)' :
                              isDone   ? '1px solid rgba(16,185,129,0.2)' :
                              '1px solid rgba(255,255,255,0.04)',
                      background: isCurrent ? 'rgba(239,68,68,0.04)' :
                                  isDone   ? 'rgba(16,185,129,0.03)' :
                                  'rgba(255,255,255,0.01)',
                    }}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-xs font-semibold transition-all ${
                      isDone   ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                      isCurrent ? 'border border-red-400/50 text-red-400 bg-red-400/10' :
                      'border border-white/10 text-silver-700'
                    }`}>
                      {isDone ? <CheckCircle size={14} /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`font-sans text-sm leading-relaxed ${
                        isCurrent ? 'text-silver-200 font-medium' :
                        isDone   ? 'text-silver-500 line-through' :
                        'text-silver-600'
                      }`}>{step}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* CTA */}
            {!allStepsDone ? (
              <motion.button
                onClick={nextStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 font-sans text-sm font-medium tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.08))', border: '1px solid rgba(239,68,68,0.4)', color: '#FCA5A5' }}>
                <CheckCircle size={14} />
                Mark Step {stepIdx + 1} Complete
                <ChevronRight size={14} />
              </motion.button>
            ) : (
              <div className="text-center mb-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-emerald-400" />
                </motion.div>
                <div className="section-label mb-1 text-emerald-500">Immediate Protocol Complete</div>
                <h3 className="luxury-heading text-2xl mb-2">Well handled, {dogName !== 'your companion' ? (dogName + ' is safe') : 'your companion is safe'}.</h3>
                <p className="font-sans text-sm text-silver-500 mb-6">Now move into the recovery phase.</p>
              </div>
            )}

            {/* Recovery activities */}
            <div className="glass-card p-6 mb-6" style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
              <div className="section-label mb-1">Recovery Phase</div>
              <h3 className="font-serif text-lg text-pearl mb-4">Recommended Activities</h3>
              <div className="space-y-3">
                {protocol.recoveryActivities.map((activity, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gold-gradient flex-shrink-0 flex items-center justify-center mt-0.5">
                      <div className="w-1.5 h-1.5 bg-charcoal-900 rounded-full" />
                    </div>
                    <span className="font-sans text-sm text-silver-300 font-light">{activity}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Prevention note */}
            <div className="glass-card p-5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="font-sans text-[9px] uppercase tracking-widest text-silver-600 mb-2">Long-Term Prevention</div>
              <p className="font-serif text-sm font-light text-silver-400 leading-relaxed italic">{protocol.preventionNote}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
