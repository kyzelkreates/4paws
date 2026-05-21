import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ArrowLeft, Check, Sparkles, Dog,
  User, Heart, Zap, Shield, Star, ChevronDown
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import { BEHAVIOUR_PROBLEMS, BREED_SIZES, TRAIT_LABELS } from '../../ai/behaviourEngine'

// ─────────────────────────────────────────────────────────────
// STEP DEFINITIONS
// ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'welcome',      type: 'splash',   icon: '🐾', title: "Welcome to Your Academy" },
  { id: 'client-name',  type: 'client',   icon: '👤', title: "Let's Start With You" },
  { id: 'client-life',  type: 'client',   icon: '🏡', title: "Your Lifestyle" },
  { id: 'dog-basics',   type: 'dog',      icon: '🐕', title: "Tell Us About Your Dog" },
  { id: 'dog-traits',   type: 'dog',      icon: '🧬', title: "Character & Temperament" },
  { id: 'dog-behaviour',type: 'dog',      icon: '🔬', title: "Behaviour Profile" },
  { id: 'dog-history',  type: 'dog',      icon: '📋', title: "Training Background" },
  { id: 'analysis',     type: 'analysis', icon: '✨', title: "AI Analysis" },
  { id: 'complete',     type: 'complete', icon: '🏆', title: "Your Academy Awaits" },
]

const HOUSEHOLD_TYPES = ['Single professional', 'Couple', 'Family with young children', 'Family with older children', 'Retired couple', 'Shared household', 'Rural property', 'Urban apartment']
const LIFESTYLE_OPTIONS = ['Very active — multiple hours daily', 'Active — one long walk daily', 'Moderate — regular shorter walks', 'Busy — limited time for long walks', 'Working from home', 'Regular travel / away from home']
const TRAINING_HISTORY = ['No formal training', 'Puppy classes only', 'Some group classes', 'Extensive group classes', 'Private trainer previously', 'Self-taught from resources', 'Extensive experience']
const HOME_ENVIRONMENTS = ['Small flat / apartment', 'House with small garden', 'House with large garden', 'Rural property with land', 'Property near busy roads', 'Property in quiet area']

// ─────────────────────────────────────────────────────────────
// SLIDER COMPONENT
// ─────────────────────────────────────────────────────────────
function TraitSlider({ label, icon, lowLabel, highLabel, value, onChange, colour = '#C9A84C' }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="font-sans text-sm font-medium text-pearl">{label}</span>
        </div>
        <div className="font-mono text-sm text-gold-400 font-medium w-6 text-right">{value}</div>
      </div>
      <div className="relative">
        <input
          type="range" min={0} max={10} step={1} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #C9A84C ${value * 10}%, rgba(255,255,255,0.1) ${value * 10}%)`,
            WebkitAppearance: 'none',
          }}
        />
      </div>
      <div className="flex justify-between font-sans text-[9px] text-silver-600 tracking-wide">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MULTI-SELECT CHIP
// ─────────────────────────────────────────────────────────────
function ChipSelect({ options, selected, onToggle, max = null }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const isSelected = selected.includes(opt)
        const disabled = !isSelected && max !== null && selected.length >= max
        return (
          <motion.button
            key={opt}
            onClick={() => !disabled && onToggle(opt)}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-2 font-sans text-xs transition-all duration-200 border ${
              isSelected
                ? 'border-gold-500/60 bg-gold-500/10 text-gold-300'
                : disabled
                  ? 'border-white/5 text-silver-700 cursor-not-allowed opacity-50'
                  : 'border-white/10 text-silver-400 hover:border-white/25 hover:text-silver-200'
            }`}
          >
            {isSelected && <Check size={10} className="inline mr-1.5 text-gold-400" />}
            {opt}
          </motion.button>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SINGLE SELECT
// ─────────────────────────────────────────────────────────────
function SingleSelect({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map(opt => {
        const label = typeof opt === 'object' ? opt.label : opt
        const val   = typeof opt === 'object' ? opt.value : opt
        return (
          <motion.button
            key={val}
            onClick={() => onChange(val)}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-3 text-left font-sans text-sm transition-all duration-200 border ${
              value === val
                ? 'border-gold-500/60 bg-gold-500/8 text-gold-300'
                : 'border-white/8 text-silver-400 hover:border-white/20 hover:text-silver-200'
            }`}
          >
            {value === val && <Check size={11} className="inline mr-2 text-gold-400" />}
            {label}
          </motion.button>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────
function QuizProgress({ current, total }) {
  const pct = Math.round(((current) / (total - 2)) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-0.5 bg-white/5 overflow-hidden">
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #C9A84C, #F5E09A)' }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, pct)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="font-sans text-[9px] tracking-widest uppercase text-silver-700 flex-shrink-0">
        {Math.min(100, pct)}%
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN QUIZ
// ─────────────────────────────────────────────────────────────
export default function OnboardingQuiz() {
  const navigate = useNavigate()
  const { state, notify } = useApp()
  const { completeOnboarding } = useAI()

  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [analysing, setAnalysing] = useState(false)
  const [analysisDone, setAnalysisDone] = useState(false)

  // ── Form state ────────────────────────────────────────────
  const [clientData, setClientData] = useState({
    displayName:   state.clientProfile?.name?.split(' ')[0] || '',
    fullName:      state.clientProfile?.name || '',
    email:         state.clientProfile?.email || '',
    phone:         state.clientProfile?.phone || '',
    householdType: '',
    lifestyle:     '',
  })

  const [dogData, setDogData] = useState({
    name:             '',
    age:              12,
    ageUnit:          'months',
    breed:            '',
    breedSize:        'medium',
    weight:           '',
    behaviourProblems: [],
    trainingHistory:  '',
    homeEnvironment:  '',
    anxiety:          3,
    reactivity:       3,
    confidence:       6,
    socialisation:    6,
    energy:           6,
    aggression:       1,
    fearfulness:      3,
  })

  const step = STEPS[stepIndex]

  const canAdvance = () => {
    switch (step.id) {
      case 'welcome':       return true
      case 'client-name':   return clientData.displayName.trim().length > 0
      case 'client-life':   return clientData.householdType.length > 0
      case 'dog-basics':    return dogData.name.trim().length > 0 && dogData.breed.trim().length > 0
      case 'dog-traits':    return true
      case 'dog-behaviour': return true
      case 'dog-history':   return dogData.trainingHistory.length > 0
      default:              return true
    }
  }

  const advance = () => {
    if (!canAdvance()) return
    if (step.id === 'dog-history') {
      runAnalysis()
      return
    }
    setDirection(1)
    setStepIndex(i => i + 1)
  }

  const back = () => {
    if (stepIndex === 0) return
    setDirection(-1)
    setStepIndex(i => i - 1)
  }

  const runAnalysis = async () => {
    setDirection(1)
    setStepIndex(STEPS.findIndex(s => s.id === 'analysis'))
    setAnalysing(true)

    await new Promise(r => setTimeout(r, 2800))

    const ageInMonths = dogData.ageUnit === 'years' ? dogData.age * 12 : dogData.age
    const finalDogProfile = { ...dogData, age: ageInMonths }
    const finalClientProfile = { ...clientData, name: clientData.fullName || clientData.displayName }

    completeOnboarding(finalDogProfile, finalClientProfile)

    setAnalysing(false)
    setAnalysisDone(true)
    await new Promise(r => setTimeout(r, 800))

    setDirection(1)
    setStepIndex(STEPS.findIndex(s => s.id === 'complete'))
  }

  const finish = () => {
    notify(`Welcome, ${clientData.displayName}! ${dogData.name}'s academy is ready.`, 'success', 5000)
    navigate('/academy')
  }

  // ── Variants ──────────────────────────────────────────────
  const variants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.97 }),
  }

  return (
    <div className="min-h-screen bg-charcoal-900 flex flex-col relative overflow-hidden">

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        {[0,1,2].map(i => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: `${180 + i * 100}px`, height: `${180 + i * 100}px`, left: `${15 + i * 30}%`, top: `${10 + i * 25}%`, background: `radial-gradient(circle, rgba(201,168,76,${0.03 - i * 0.008}) 0%, transparent 70%)` }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐾</span>
          <div>
            <div className="font-display text-sm font-light tracking-widest text-pearl uppercase">Four Paws</div>
            <div className="font-sans text-[8px] tracking-[0.3em] uppercase text-gold-500">Academy Setup</div>
          </div>
        </div>
        {stepIndex > 0 && stepIndex < STEPS.length - 2 && (
          <div className="w-40">
            <QuizProgress current={stepIndex} total={STEPS.length} />
          </div>
        )}
      </div>

      {/* Step content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >

              {/* ── WELCOME ── */}
              {step.id === 'welcome' && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                    className="text-7xl mb-8"
                  >🐾</motion.div>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="divider-gold w-8" />
                    <span className="section-label text-[9px]">Luxury Canine Academy</span>
                    <div className="divider-gold w-8" />
                  </div>
                  <h1 className="luxury-heading text-4xl sm:text-5xl mb-5">
                    Your Academy<br />
                    <span className="text-gold-gradient italic">Begins Here</span>
                  </h1>
                  <p className="font-sans text-base font-light text-silver-400 leading-relaxed mb-8 max-w-sm mx-auto">
                    This 3-minute setup will personalise your entire academy experience — from course recommendations to daily coaching.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-10 max-w-sm mx-auto">
                    {[['🎯', 'Tailored to your dog'], ['🧠', 'AI behaviour analysis'], ['✨', 'Personalised path']].map(([icon, label]) => (
                      <div key={label} className="glass-card p-3 text-center" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
                        <div className="text-xl mb-1">{icon}</div>
                        <div className="font-sans text-[9px] text-silver-500 leading-snug">{label}</div>
                      </div>
                    ))}
                  </div>
                  <motion.button onClick={advance} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="btn-gold flex items-center gap-2 mx-auto text-xs">
                    Begin Setup <ArrowRight size={14} />
                  </motion.button>
                </div>
              )}

              {/* ── CLIENT NAME ── */}
              {step.id === 'client-name' && (
                <div className="glass-card gold-border p-8">
                  <div className="text-3xl mb-4">👤</div>
                  <div className="section-label mb-1">About You</div>
                  <h2 className="luxury-heading text-3xl mb-6">Let's start with<br />the essentials</h2>
                  <div className="space-y-7">
                    {[
                      { label: 'What should we call you?', key: 'displayName', placeholder: 'e.g. Victoria', hint: 'This appears throughout your academy' },
                      { label: 'Full name', key: 'fullName', placeholder: 'Victoria Hartley' },
                      { label: 'Email address', key: 'email', placeholder: 'your@email.com', type: 'email' },
                      { label: 'Phone number', key: 'phone', placeholder: '+44 7700 900000', type: 'tel' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="section-label text-[9px] block mb-1">{f.label}</label>
                        <input
                          type={f.type || 'text'}
                          value={clientData[f.key]}
                          onChange={e => setClientData(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="premium-input"
                        />
                        {f.hint && <div className="font-sans text-[10px] text-silver-700 mt-1">{f.hint}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CLIENT LIFESTYLE ── */}
              {step.id === 'client-life' && (
                <div className="glass-card gold-border p-8">
                  <div className="text-3xl mb-4">🏡</div>
                  <div className="section-label mb-1">Your Lifestyle</div>
                  <h2 className="luxury-heading text-3xl mb-6">Help us understand<br />your world</h2>
                  <div className="space-y-7">
                    <div>
                      <label className="section-label text-[9px] block mb-3">Household type</label>
                      <SingleSelect options={HOUSEHOLD_TYPES} value={clientData.householdType}
                        onChange={v => setClientData(p => ({ ...p, householdType: v }))} />
                    </div>
                    <div>
                      <label className="section-label text-[9px] block mb-3">Activity lifestyle</label>
                      <SingleSelect options={LIFESTYLE_OPTIONS} value={clientData.lifestyle}
                        onChange={v => setClientData(p => ({ ...p, lifestyle: v }))} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── DOG BASICS ── */}
              {step.id === 'dog-basics' && (
                <div className="glass-card gold-border p-8">
                  <div className="text-3xl mb-4">🐕</div>
                  <div className="section-label mb-1">Your Dog</div>
                  <h2 className="luxury-heading text-3xl mb-6">Introduce us to<br />your companion</h2>
                  <div className="space-y-7">
                    <div>
                      <label className="section-label text-[9px] block mb-1">Dog's name</label>
                      <input value={dogData.name} onChange={e => setDogData(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Caspian" className="premium-input" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="section-label text-[9px] block mb-1">Age</label>
                        <input type="number" min={1} max={200} value={dogData.age}
                          onChange={e => setDogData(p => ({ ...p, age: Number(e.target.value) }))}
                          className="premium-input" />
                      </div>
                      <div>
                        <label className="section-label text-[9px] block mb-3">Unit</label>
                        <div className="flex gap-2">
                          {['months', 'years'].map(u => (
                            <button key={u} onClick={() => setDogData(p => ({ ...p, ageUnit: u }))}
                              className={`flex-1 py-2 text-xs font-sans border transition-all ${dogData.ageUnit === u ? 'border-gold-500/50 text-gold-400 bg-gold-500/8' : 'border-white/8 text-silver-500 hover:border-white/20'}`}>
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="section-label text-[9px] block mb-1">Breed</label>
                      <input value={dogData.breed} onChange={e => setDogData(p => ({ ...p, breed: e.target.value }))}
                        placeholder="e.g. Golden Retriever" className="premium-input" />
                    </div>
                    <div>
                      <label className="section-label text-[9px] block mb-3">Size</label>
                      <SingleSelect options={Object.values(BREED_SIZES)} value={dogData.breedSize}
                        onChange={v => setDogData(p => ({ ...p, breedSize: v }))} />
                    </div>
                    <div>
                      <label className="section-label text-[9px] block mb-1">Home environment</label>
                      <SingleSelect options={HOME_ENVIRONMENTS} value={dogData.homeEnvironment}
                        onChange={v => setDogData(p => ({ ...p, homeEnvironment: v }))} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── DOG TRAITS ── */}
              {step.id === 'dog-traits' && (
                <div className="glass-card gold-border p-8">
                  <div className="text-3xl mb-4">🧬</div>
                  <div className="section-label mb-1">Temperament</div>
                  <h2 className="luxury-heading text-3xl mb-2">
                    {dogData.name || 'Your dog'}'s character
                  </h2>
                  <p className="font-sans text-sm font-light text-silver-500 mb-7">Slide each trait to where {dogData.name || 'your dog'} sits today.</p>
                  <div className="space-y-6">
                    {[
                      { key: 'anxiety',      ...TRAIT_LABELS.anxiety      },
                      { key: 'confidence',   ...TRAIT_LABELS.confidence   },
                      { key: 'energy',       ...TRAIT_LABELS.energy       },
                      { key: 'fearfulness',  ...TRAIT_LABELS.fearfulness  },
                    ].map(trait => (
                      <TraitSlider key={trait.key}
                        label={trait.label} icon={trait.icon}
                        lowLabel={trait.low} highLabel={trait.high}
                        value={dogData[trait.key]}
                        onChange={v => setDogData(p => ({ ...p, [trait.key]: v }))}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── DOG BEHAVIOUR ── */}
              {step.id === 'dog-behaviour' && (
                <div className="glass-card gold-border p-8">
                  <div className="text-3xl mb-4">🔬</div>
                  <div className="section-label mb-1">Behaviour Analysis</div>
                  <h2 className="luxury-heading text-3xl mb-2">Social & behaviour profile</h2>
                  <p className="font-sans text-sm font-light text-silver-500 mb-7">This feeds {dogData.name || 'your dog'}'s personalised pathway.</p>
                  <div className="space-y-6 mb-7">
                    {[
                      { key: 'reactivity',    ...TRAIT_LABELS.reactivity    },
                      { key: 'socialisation', ...TRAIT_LABELS.socialisation },
                      { key: 'aggression',    ...TRAIT_LABELS.aggression    },
                    ].map(trait => (
                      <TraitSlider key={trait.key}
                        label={trait.label} icon={trait.icon}
                        lowLabel={trait.low} highLabel={trait.high}
                        value={dogData[trait.key]}
                        onChange={v => setDogData(p => ({ ...p, [trait.key]: v }))}
                      />
                    ))}
                  </div>
                  <div>
                    <label className="section-label text-[9px] block mb-3">Current behaviour challenges (select all that apply)</label>
                    <ChipSelect
                      options={BEHAVIOUR_PROBLEMS}
                      selected={dogData.behaviourProblems}
                      onToggle={opt => setDogData(p => ({
                        ...p,
                        behaviourProblems: p.behaviourProblems.includes(opt)
                          ? p.behaviourProblems.filter(x => x !== opt)
                          : [...p.behaviourProblems, opt]
                      }))}
                    />
                  </div>
                </div>
              )}

              {/* ── DOG HISTORY ── */}
              {step.id === 'dog-history' && (
                <div className="glass-card gold-border p-8">
                  <div className="text-3xl mb-4">📋</div>
                  <div className="section-label mb-1">Training Background</div>
                  <h2 className="luxury-heading text-3xl mb-6">What has {dogData.name || 'your dog'}<br />experienced?</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="section-label text-[9px] block mb-3">Training history</label>
                      <SingleSelect options={TRAINING_HISTORY} value={dogData.trainingHistory}
                        onChange={v => setDogData(p => ({ ...p, trainingHistory: v }))} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── ANALYSIS ── */}
              {step.id === 'analysis' && (
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    {analysing && (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 rounded-full border-2 border-transparent"
                          style={{ borderTopColor: '#C9A84C', borderRightColor: 'rgba(201,168,76,0.15)' }} />
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-3 rounded-full border border-transparent"
                          style={{ borderTopColor: 'rgba(201,168,76,0.4)' }} />
                      </>
                    )}
                    {!analysing && analysisDone && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                        className="absolute inset-0 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
                        <Check size={32} className="text-charcoal-900" />
                      </motion.div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {analysing && <span className="text-3xl">🐾</span>}
                    </div>
                  </div>

                  <div className="section-label mb-2">
                    {analysing ? 'Processing' : 'Complete'}
                  </div>
                  <h2 className="luxury-heading text-3xl mb-4">
                    {analysing ? `Analysing ${dogData.name || 'Your Dog'}` : 'Analysis Complete'}
                  </h2>

                  {analysing && (
                    <motion.div className="flex flex-col gap-2 mt-4">
                      {[
                        'Mapping behaviour profile',
                        'Scoring temperament traits',
                        'Generating training pathway',
                        'Personalising your dashboard',
                      ].map((label, i) => (
                        <motion.div key={label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.55 }}
                          className="flex items-center gap-2 justify-center text-silver-500">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear', delay: i * 0.55 }}
                            className="w-3 h-3 border border-gold-600/40 border-t-gold-500 rounded-full flex-shrink-0" />
                          <span className="font-sans text-xs">{label}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* ── COMPLETE ── */}
              {step.id === 'complete' && (
                <div className="text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.1 }}
                    className="text-7xl mb-6">🏆</motion.div>

                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="divider-gold w-8" />
                    <span className="section-label text-[9px]">Ready</span>
                    <div className="divider-gold w-8" />
                  </div>

                  <h1 className="luxury-heading text-4xl mb-4">
                    {clientData.displayName || 'Welcome'},<br />
                    <span className="text-gold-gradient italic">{dogData.name || 'Your Academy'} Awaits</span>
                  </h1>

                  <p className="font-sans text-sm font-light text-silver-400 leading-relaxed mb-8 max-w-sm mx-auto">
                    Your personalised academy has been configured based on {dogData.name}'s unique profile. Your AI coaching begins now.
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-8 max-w-sm mx-auto">
                    {[
                      ['🎯', 'Courses', 'Personalised'],
                      ['🧠', 'AI Coach', 'Active'],
                      ['✨', 'Enrichment', 'Ready'],
                    ].map(([icon, label, sub]) => (
                      <div key={label} className="glass-card p-4 text-center" style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
                        <div className="text-2xl mb-1">{icon}</div>
                        <div className="font-sans text-xs font-medium text-pearl">{label}</div>
                        <div className="font-sans text-[9px] text-gold-500 mt-0.5">{sub}</div>
                      </div>
                    ))}
                  </div>

                  <motion.button onClick={finish} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="btn-gold flex items-center gap-2 mx-auto text-xs">
                    <Sparkles size={14} />
                    Enter the Academy
                    <ArrowRight size={14} />
                  </motion.button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          {!['welcome', 'analysis', 'complete'].includes(step.id) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mt-8"
            >
              <button onClick={back}
                className="flex items-center gap-2 font-sans text-xs text-silver-500 hover:text-silver-200 transition-colors tracking-widest uppercase">
                <ArrowLeft size={13} /> Back
              </button>
              <motion.button
                onClick={advance}
                disabled={!canAdvance()}
                whileHover={canAdvance() ? { scale: 1.03 } : {}}
                whileTap={canAdvance() ? { scale: 0.97 } : {}}
                className="btn-gold flex items-center gap-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step.id === 'dog-history' ? 'Analyse Profile' : 'Continue'}
                <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
