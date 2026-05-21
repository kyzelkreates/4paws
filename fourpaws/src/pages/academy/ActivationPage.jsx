import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, RefreshCw, CheckCircle, ShieldCheck, Sparkles, Key } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import {
  validateActivationCode,
  linkDeviceToClient,
  buildClientUserFromEntry,
  getOrCreateDeviceId,
} from '../../utils/academyIdentity'

// ── Individual code segment input ────────────────────────────
function CodeInput({ segments, onChange }) {
  const refs = [useRef(), useRef(), useRef()]

  const handleSegment = (idx, val) => {
    const upper = val.toUpperCase().replace(/[^A-Z0-9]/g, '')
    const next  = [...segments]
    next[idx]   = upper
    onChange(next)
    if (upper && idx < 2) refs[idx + 1]?.current?.focus()
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !segments[idx] && idx > 0) {
      refs[idx - 1]?.current?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/\s/g, '')
    const parts  = pasted.split('-').filter(Boolean)
    if (parts.length >= 3) {
      onChange([parts[0], parts[1], parts[2]])
    }
  }

  return (
    <div className="flex items-center gap-3 justify-center">
      {segments.map((seg, idx) => (
        <React.Fragment key={idx}>
          <input
            ref={refs[idx]}
            value={seg}
            onChange={e => handleSegment(idx, e.target.value)}
            onKeyDown={e => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            maxLength={idx === 0 ? 3 : idx === 1 ? 6 : 4}
            placeholder={idx === 0 ? 'FPA' : idx === 1 ? 'ELITE' : '4837'}
            className="text-center font-mono font-medium tracking-[0.2em] uppercase bg-charcoal-800 border border-white/10
              focus:border-gold-500/60 focus:outline-none text-pearl placeholder-silver-700 transition-all duration-300
              w-20 sm:w-24 py-4 text-sm"
            style={{ caretColor: '#C9A84C' }}
          />
          {idx < 2 && (
            <span className="text-silver-700 font-mono text-xl select-none">—</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ── Activation steps ─────────────────────────────────────────
const STEPS = { ENTRY: 'entry', VALIDATING: 'validating', SUCCESS: 'success' }

export default function ActivationPage() {
  const navigate  = useNavigate()
  const { dispatch, ACTIONS, notify, setUser } = useApp()

  const [step,     setStep]     = useState(STEPS.ENTRY)
  const [segments, setSegments] = useState(['', '', ''])
  const [error,    setError]    = useState('')
  const [entry,    setEntry]    = useState(null) // validated registry entry

  const fullCode = segments.join('-').trim()

  // ── Auto-enter when all three segments are filled ────────
  useEffect(() => {
    if (segments[0].length === 3 && segments[1].length >= 4 && segments[2].length === 4) {
      handleActivate()
    }
  }, [segments])

  const handleActivate = async () => {
    if (step === STEPS.VALIDATING) return
    setError('')
    setStep(STEPS.VALIDATING)

    // Simulated async validation (swap for API call when backend exists)
    await new Promise(r => setTimeout(r, 1400))

    const result = validateActivationCode(fullCode)

    if (!result.valid) {
      setError(result.error)
      setStep(STEPS.ENTRY)
      return
    }

    // Link device ──────────────────────────────────────────
    const deviceIdentity = linkDeviceToClient(result.entry)
    const clientUser     = buildClientUserFromEntry(result.entry)

    // Hydrate AppContext ────────────────────────────────────
    setUser({ ...clientUser, role: 'client' })
    dispatch({ type: ACTIONS.SET_CLIENT_PROFILE,   payload: clientUser })
    dispatch({ type: ACTIONS.SET_ENROLLED_COURSES, payload: result.entry.enrolledCourses  || [] })
    dispatch({ type: ACTIONS.SET_OWNED_ADDONS,     payload: result.entry.ownedAddons      || [] })
    dispatch({ type: ACTIONS.SET_PROGRESS,         payload: result.entry.courseProgress   || {} })
    dispatch({ type: ACTIONS.SET_DEVICE_IDENTITY,  payload: deviceIdentity })
    dispatch({
      type: ACTIONS.SET_ACADEMY_IDENTITY,
      payload: {
        academyLinkCode: result.entry.academyLinkCode,
        academyId:       result.entry.academyId,
        academyStatus:   'active',
        linkedDevices:   result.entry.linkedDevices || [],
      }
    })

    setEntry(result.entry)
    setStep(STEPS.SUCCESS)
  }

  const handleContinue = () => {
    notify(`Welcome to Four Paws Academy, ${entry?.name?.split(' ')[0] || 'Member'}!`, 'success')
    navigate('/academy')
  }

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Floating orbs */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width:  `${200 + i * 120}px`,
              height: `${200 + i * 120}px`,
              left:   `${10 + i * 30}%`,
              top:    `${20 + i * 20}%`,
              background: `radial-gradient(circle, rgba(201,168,76,${0.04 - i * 0.01}) 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3">
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >🐾</motion.span>
            <div className="text-left">
              <div className="font-display text-xl font-light tracking-[0.2em] text-pearl uppercase leading-none">Four Paws</div>
              <div className="font-sans text-[9px] font-medium tracking-[0.35em] uppercase text-gold-500 mt-0.5">Training & Enrichment Academy</div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── ENTRY STEP ── */}
          {step === STEPS.ENTRY && (
            <motion.div
              key="entry"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="glass-card gold-border p-8 sm:p-10 text-center">

                <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-gold-500/30 flex items-center justify-center relative">
                  <Key size={22} className="text-gold-400" />
                  <motion.div
                    className="absolute inset-0 rounded-full border border-gold-500/20"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                </div>

                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="divider-gold w-6" />
                  <span className="section-label text-[9px]">Academy Activation</span>
                  <div className="divider-gold w-6" />
                </div>

                <h1 className="luxury-heading text-3xl sm:text-4xl mb-3">
                  Enter Your<br />
                  <span className="text-gold-gradient italic">Academy Code</span>
                </h1>

                <p className="font-sans text-sm font-light text-silver-400 leading-relaxed mb-8 max-w-sm mx-auto">
                  Your unique academy code was sent by your trainer. Enter it below to unlock your personal programme.
                </p>

                <CodeInput segments={segments} onChange={setSegments} />

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5 flex items-center gap-2 justify-center text-red-400"
                    >
                      <span className="font-sans text-xs">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={handleActivate}
                  disabled={fullCode.replace(/-/g, '').length < 10}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold flex items-center gap-2 mx-auto mt-8 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Activate Academy Access <ArrowRight size={14} />
                </motion.button>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="font-sans text-[10px] text-silver-700 mb-3">Demo codes to try</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['FPA-ELITE-4837', 'FPA-LUXE-9281', 'FPA-APEX-7756'].map(code => (
                      <button
                        key={code}
                        onClick={() => {
                          const parts = code.split('-')
                          setSegments([parts[0], parts[1], parts[2]])
                          setError('')
                        }}
                        className="font-mono text-[10px] text-gold-600 hover:text-gold-400 bg-gold-500/5 hover:bg-gold-500/10 border border-gold-500/15 px-3 py-1.5 transition-all"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── VALIDATING STEP ── */}
          {step === STEPS.VALIDATING && (
            <motion.div
              key="validating"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="glass-card gold-border p-12 text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-transparent"
                  style={{ borderTopColor: '#C9A84C', borderRightColor: 'rgba(201,168,76,0.2)' }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-3 rounded-full border border-transparent"
                  style={{ borderTopColor: 'rgba(201,168,76,0.4)' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🐾</span>
                </div>
              </div>

              <div className="section-label mb-2">Validating</div>
              <h2 className="luxury-heading text-2xl mb-3">Authenticating Code</h2>

              <motion.div className="flex justify-center gap-1 mt-4">
                {['Verifying identity', 'Linking device', 'Unlocking academy'].map((label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.45 }}
                    className="font-sans text-xs text-silver-600 flex items-center gap-1"
                  >
                    {i > 0 && <span className="text-silver-800 mx-1">·</span>}
                    {label}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ── SUCCESS STEP ── */}
          {step === STEPS.SUCCESS && entry && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card p-10 text-center relative overflow-hidden"
              style={{ border: '1px solid rgba(201,168,76,0.4)' }}
            >
              {/* Gold shimmer sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.08) 50%, transparent 100%)' }}
              />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold-lg"
              >
                <CheckCircle size={32} className="text-charcoal-900" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="section-label mb-2">Academy Activated</div>
                <h2 className="luxury-heading text-3xl sm:text-4xl mb-2">
                  Welcome,<br />
                  <span className="text-gold-gradient">{entry.name.split(' ')[0]}</span>
                </h2>
                <p className="font-sans text-sm font-light text-silver-400 mb-8">
                  Your academy has been unlocked and this device permanently linked to your profile.
                </p>

                {/* Identity card */}
                <div className="glass-card p-5 mb-6 text-left space-y-3"
                  style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
                  {[
                    ['Academy ID',   entry.academyId],
                    ['Link Code',    entry.academyLinkCode],
                    ['Device',       getOrCreateDeviceId()],
                    ['Courses',      `${entry.enrolledCourses.length} programme${entry.enrolledCourses.length !== 1 ? 's' : ''} unlocked`],
                    ['Add-Ons',      `${entry.ownedAddons.length} supplement${entry.ownedAddons.length !== 1 ? 's' : ''} available`],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="font-sans text-[10px] tracking-widest uppercase text-silver-600">{label}</span>
                      <span className="font-mono text-xs text-gold-400">{val}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  onClick={handleContinue}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-gold flex items-center gap-2 mx-auto text-xs"
                >
                  <Sparkles size={14} />
                  Enter Your Academy
                  <ArrowRight size={14} />
                </motion.button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2 mt-8 text-silver-700"
        >
          <ShieldCheck size={12} />
          <span className="font-sans text-[10px] tracking-widest uppercase">Secure · Encrypted · Private</span>
        </motion.div>
      </div>
    </div>
  )
}
