// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — BEHAVIOUR REFLECTION SYSTEM
// Daily thoughtful behavioural questions. Offline-first. AI-aware.
// Drives better understanding and feeds transformation data.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ChevronRight, ChevronLeft, RotateCcw, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useIntelligenceCore } from '../../hooks/useIntelligenceCore'
import {
  getDailyReflectionQuestions,
  saveReflectionAnswer,
  loadReflectionLog,
  RISK_KEYS,
} from '../../ai/fourPawsMethod'
import { purifyText } from '../../ai/narrativeVoice'
import { SOUNDS } from '../../ai/intelligenceCore'
import { FadeIn } from '../../components/animations/FadeIn'
import { AmbientOrbs } from '../../components/ui/PageTransition'

// ─────────────────────────────────────────────────────────────────────────────
// YES / NO QUESTION
// ─────────────────────────────────────────────────────────────────────────────
function YNQuestion({ question, answer, onAnswer, colour }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[{ val: 'yes', label: 'Yes', icon: '✓' }, { val: 'no', label: 'No', icon: '✗' }].map(opt => (
        <motion.button
          key={opt.val}
          onClick={() => { SOUNDS.tap(); onAnswer(opt.val) }}
          className="relative py-6 text-center transition-all"
          style={{
            border: `1px solid ${answer === opt.val ? colour + '50' : 'rgba(255,255,255,0.06)'}`,
            background: answer === opt.val ? `${colour}10` : 'transparent',
          }}
          whileHover={{ y: -2, borderColor: colour + '30' }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-2xl mb-2">{opt.icon}</div>
          <div className="font-sans text-sm" style={{ color: answer === opt.val ? colour : '#9CA3AF' }}>{opt.label}</div>
          {answer === opt.val && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute top-2 right-2">
              <CheckCircle size={12} style={{ color: colour }} />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCALE QUESTION
// ─────────────────────────────────────────────────────────────────────────────
function ScaleQuestion({ question, answer, onAnswer, colour }) {
  const labels = question.labels || ['Poor', '', '', 'Excellent']
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {labels.map((label, i) => (
          <motion.button
            key={i}
            onClick={() => { SOUNDS.tap(); onAnswer(i) }}
            className="py-4 text-center transition-all"
            style={{
              border: `1px solid ${answer === i ? colour + '50' : 'rgba(255,255,255,0.06)'}`,
              background: answer === i ? `${colour}10` : 'transparent',
            }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="font-display text-xl font-light mb-1.5" style={{ color: answer === i ? colour : '#374151' }}>
              {i + 1}
            </div>
            <div className="font-sans text-[8px] text-silver-600 leading-tight px-1">{label}</div>
          </motion.button>
        ))}
      </div>
      {/* Progress bar */}
      {answer !== undefined && (
        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          className="h-0.5 origin-left" style={{ background: colour, width: `${(answer / 3) * 100}%` }} />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// YES / NO + DETAIL
// ─────────────────────────────────────────────────────────────────────────────
function YNDetailQuestion({ question, answer, onAnswer, colour }) {
  const [detail, setDetail] = useState(answer?.detail || '')
  const answered = answer?.val !== undefined

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[{ val: 'yes', label: 'Yes', icon: '✓' }, { val: 'no', label: 'No', icon: '✗' }].map(opt => (
          <motion.button key={opt.val}
            onClick={() => { SOUNDS.tap(); onAnswer({ val: opt.val, detail }) }}
            className="py-5 text-center transition-all"
            style={{
              border: `1px solid ${answer?.val === opt.val ? colour + '50' : 'rgba(255,255,255,0.06)'}`,
              background: answer?.val === opt.val ? `${colour}10` : 'transparent',
            }}
            whileHover={{ y: -1 }}
          >
            <div className="font-sans text-sm" style={{ color: answer?.val === opt.val ? colour : '#9CA3AF' }}>
              {opt.icon} {opt.label}
            </div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <textarea
              value={detail}
              onChange={e => { setDetail(e.target.value); onAnswer({ val: answer?.val, detail: e.target.value }) }}
              placeholder="Describe what happened (optional)..."
              rows={3}
              className="premium-input text-xs resize-none w-full mt-2"
              style={{ borderColor: colour + '20' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// REFLECTION COMPLETE SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function ReflectionComplete({ dogName, answers, colour, onReset }) {
  const positiveCount = Object.values(answers).filter(a =>
    a === 'yes' || a === 3 || (typeof a === 'object' && a?.val === 'yes')
  ).length

  const messages = [
    `Today's reflection is complete. ${dogName}'s data has been recorded.`,
    `Each observation you record deepens the intelligence of ${dogName}'s programme.`,
    `Your attentiveness to ${dogName}'s daily experience is the foundation of genuine transformation.`,
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: `${colour}12`, border: `1px solid ${colour}30` }}
      >
        <CheckCircle size={28} style={{ color: colour }} />
      </motion.div>

      <div className="font-sans text-[9px] uppercase tracking-[0.4em] mb-3" style={{ color: colour }}>
        Reflection Complete
      </div>
      <h2 className="luxury-heading text-2xl mb-4">{dogName}'s Daily Record</h2>
      <p className="font-sans text-sm font-light text-silver-500 leading-relaxed max-w-sm mx-auto mb-8">
        {purifyText(messages[Math.floor(Math.random() * messages.length)])}
      </p>

      <div className="inline-flex items-center gap-3 px-6 py-3 mb-8"
        style={{ background: `${colour}06`, border: `1px solid ${colour}20` }}>
        <Sparkles size={13} style={{ color: colour }} />
        <span className="font-sans text-xs font-light" style={{ color: colour }}>
          {positiveCount} positive indicator{positiveCount !== 1 ? 's' : ''} recorded today
        </span>
      </div>

      <button onClick={onReset}
        className="flex items-center gap-2 mx-auto font-sans text-[9px] uppercase tracking-widest text-silver-600 hover:text-silver-400 transition-colors">
        <RotateCcw size={11} /> Reflect Again
      </button>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function BehaviourReflection() {
  const { state }   = useApp()
  const { profile } = useIntelligenceCore()
  const dogName     = profile?.dogName || state.dogProfile?.name || 'Your companion'
  const colour      = '#C9A84C'

  const questions = useMemo(() => getDailyReflectionQuestions(dogName), [dogName])
  const [idx,       setIdx]       = useState(0)
  const [answers,   setAnswers]   = useState({})
  const [complete,  setComplete]  = useState(false)

  // Check if already answered today
  useEffect(() => {
    const log = loadReflectionLog()
    const today = new Date().toDateString()
    if (log[today] && Object.keys(log[today]).length >= 3) {
      setAnswers(log[today])
      setComplete(true)
    }
  }, [])

  const current = questions[idx]
  const hasAnswer = answers[current?.id] !== undefined
  const isLast = idx === questions.length - 1

  const handleAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [current.id]: val }))
  }

  const handleNext = () => {
    if (hasAnswer) saveReflectionAnswer(current.id, answers[current.id])
    if (isLast) { SOUNDS.complete(); setComplete(true) }
    else setIdx(i => i + 1)
  }

  const handleBack = () => { if (idx > 0) setIdx(i => i - 1) }

  if (complete) {
    return (
      <div className="min-h-screen flex flex-col">
        <AmbientOrbs count={2} colour={`${colour}06`} />
        <div className="flex-1 flex items-center justify-center p-6">
          <ReflectionComplete
            dogName={dogName}
            answers={answers}
            colour={colour}
            onReset={() => { setAnswers({}); setIdx(0); setComplete(false) }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AmbientOrbs count={2} colour={`${colour}04`} />

      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-6 py-8">

        {/* Header */}
        <FadeIn className="mb-8">
          <div className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold-500 mb-1">Daily Reflection</div>
          <h1 className="luxury-heading text-2xl mb-1">{dogName}'s Day</h1>
          <div className="font-sans text-[9px] text-silver-700">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </FadeIn>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {questions.map((_, i) => (
            <div key={i} className="h-0.5 flex-1 transition-all duration-500"
              style={{ background: i <= idx ? colour : 'rgba(255,255,255,0.08)' }} />
          ))}
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1"
          >
            <div className="mb-6">
              <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-700 mb-3">
                Question {idx + 1} of {questions.length}
              </div>
              <p className="font-sans text-base font-light text-silver-200 leading-relaxed">
                {current?.q}
              </p>
            </div>

            {current?.type === 'yn' && (
              <YNQuestion question={current} answer={answers[current.id]} onAnswer={handleAnswer} colour={colour} />
            )}
            {current?.type === 'scale' && (
              <ScaleQuestion question={current} answer={answers[current.id]} onAnswer={handleAnswer} colour={colour} />
            )}
            {current?.type === 'yn_detail' && (
              <YNDetailQuestion question={current} answer={answers[current.id]} onAnswer={handleAnswer} colour={colour} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
          <button onClick={handleBack} disabled={idx === 0}
            className="flex items-center gap-1.5 font-sans text-[9px] uppercase tracking-widest text-silver-600 hover:text-silver-400 disabled:opacity-30 transition-colors">
            <ChevronLeft size={12} /> Back
          </button>

          <motion.button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] transition-all"
            style={{
              border: `1px solid ${hasAnswer ? colour + '50' : 'rgba(255,255,255,0.06)'}`,
              background: hasAnswer ? `${colour}10` : 'transparent',
              color: hasAnswer ? colour : '#374151',
            }}
            whileHover={hasAnswer ? { y: -1 } : {}}
          >
            {isLast ? 'Complete' : 'Continue'} <ChevronRight size={12} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
