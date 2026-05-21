// ─────────────────────────────────────────────────────────────
// ACADEMY LOCK GATE
// The single security perimeter for the entire PWA.
// Wraps every protected route. If no valid license → shows the
// locked screen with activation flow, nothing else renders.
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, Key, ArrowRight, ArrowLeft,
  CheckCircle, Lock, Unlock, Phone, Mail,
  RefreshCw, AlertTriangle, Sparkles, Eye, EyeOff
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import {
  verifyLicense,
  issueLicense,
  getLockState,
  LICENSE_STATUS,
} from '../../utils/academyLicense'
import {
  validateActivationCode,
  linkDeviceToClient,
  buildClientUserFromEntry,
  seedRegistryFromClients,
  getOrCreateDeviceId,
} from '../../utils/academyIdentity'
import { DEMO_CLIENTS } from '../../data/clients'
import { loadAIMemory } from '../../ai/aiMemory'

// ─────────────────────────────────────────────────────────────
// SEGMENT INPUT — three-part code entry
// ─────────────────────────────────────────────────────────────
function SegmentInput({ segments, onChange, disabled }) {
  const refs = [useRef(null), useRef(null), useRef(null)]

  const handleChange = (idx, val) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '')
    const next  = [...segments]
    next[idx]   = clean
    onChange(next)
    // Auto-advance
    const maxLen = [3, 6, 4]
    if (clean.length >= maxLen[idx] && idx < 2) {
      setTimeout(() => refs[idx + 1]?.current?.focus(), 0)
    }
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !segments[idx] && idx > 0) {
      refs[idx - 1]?.current?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const raw   = e.clipboardData.getData('text').toUpperCase().replace(/\s/g, '')
    const parts = raw.split('-').filter(Boolean)
    if (parts.length >= 3) onChange([parts[0] || '', parts[1] || '', parts[2] || ''])
    else {
      // Try to split a flat string  e.g.  "FPAGOLD9482"
      const flat = raw.replace(/[^A-Z0-9]/g, '')
      if (flat.startsWith('FPA')) onChange(['FPA', flat.slice(3, flat.length - 4), flat.slice(-4)])
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {[0, 1, 2].map(idx => (
        <React.Fragment key={idx}>
          <div className="relative">
            <input
              ref={refs[idx]}
              value={segments[idx]}
              onChange={e => handleChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              disabled={disabled}
              maxLength={idx === 0 ? 3 : idx === 1 ? 6 : 4}
              placeholder={idx === 0 ? 'FPA' : idx === 1 ? 'ELITE' : '0000'}
              className={`font-mono font-semibold tracking-[0.22em] uppercase text-center
                bg-charcoal-800 border transition-all duration-300 outline-none
                text-pearl placeholder-silver-700 py-4
                ${idx === 0 ? 'w-16 sm:w-20 text-sm' : idx === 1 ? 'w-20 sm:w-24 text-sm' : 'w-16 sm:w-20 text-sm'}
                ${disabled ? 'opacity-50 cursor-not-allowed border-white/5' : 'border-white/12 focus:border-gold-500/60 hover:border-white/20'}
              `}
              style={{ caretColor: '#C9A84C' }}
            />
          </div>
          {idx < 2 && (
            <span className="text-silver-700 font-mono text-lg select-none flex-shrink-0">—</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// LOCKED SPLASH — shown when academy is fully locked
// ─────────────────────────────────────────────────────────────
function LockedSplash({ status, onActivate }) {

  const messages = {
    [LICENSE_STATUS.LOCKED]:    { icon: <Lock size={22} className="text-gold-400" />,       title: 'Academy Locked',     sub: 'This academy requires activation from your trainer.' },
    [LICENSE_STATUS.SUSPENDED]: { icon: <AlertTriangle size={22} className="text-red-400" />, title: 'Access Suspended',   sub: 'Your academy access has been suspended. Please contact Four Paws Academy.' },
    [LICENSE_STATUS.EXPIRED]:   { icon: <AlertTriangle size={22} className="text-amber-400" />, title: 'Access Expired',  sub: 'Your academy licence has expired. Please contact your trainer.' },
    [LICENSE_STATUS.CORRUPT]:   { icon: <RefreshCw size={22} className="text-silver-400" />, title: 'Verification Error', sub: 'Your activation could not be verified. Please re-activate below.' },
  }

  const msg = messages[status] || messages[LICENSE_STATUS.LOCKED]

  return (
    <div className="text-center max-w-sm mx-auto">
      {/* Animated lock icon */}
      <div className="relative w-20 h-20 mx-auto mb-8">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full border border-gold-500/20"
        />
        <motion.div
          animate={{ scale: [1, 1.14, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full border border-gold-500/10"
        />
        <div className="absolute inset-0 rounded-full border border-gold-500/30 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.03) 100%)' }}>
          {msg.icon}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="divider-gold w-8" />
        <span className="section-label text-[9px]">Four Paws Academy</span>
        <div className="divider-gold w-8" />
      </div>

      <h1 className="luxury-heading text-3xl sm:text-4xl mb-3">{msg.title}</h1>
      <p className="font-sans text-sm font-light text-silver-400 leading-relaxed mb-8">{msg.sub}</p>

      {/* Feature preview (locked) */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[['📚', 'Courses'], ['🧠', 'AI Coach'], ['✨', 'Progress']].map(([icon, label]) => (
          <div key={label} className="glass-card p-4 text-center relative overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="text-xl mb-1.5 opacity-30">{icon}</div>
            <div className="font-sans text-[9px] text-silver-700 uppercase tracking-widest">{label}</div>
            <div className="absolute inset-0 flex items-center justify-center bg-charcoal-900/60">
              <Lock size={10} className="text-silver-700" />
            </div>
          </div>
        ))}
      </div>

      {status !== LICENSE_STATUS.SUSPENDED && (
        <motion.button
          onClick={onActivate}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-gold flex items-center gap-2 mx-auto text-xs"
        >
          <Key size={14} /> Activate Your Academy <ArrowRight size={14} />
        </motion.button>
      )}

      {/* Contact */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <p className="font-sans text-xs text-silver-600 mb-4">Need help? Contact your trainer.</p>
        <div className="flex items-center justify-center gap-6">
          <a href="mailto:hello@fourpawsacademy.com"
            className="flex items-center gap-2 font-sans text-xs text-silver-500 hover:text-gold-400 transition-colors">
            <Mail size={12} /> Email
          </a>
          <a href="tel:+441234567890"
            className="flex items-center gap-2 font-sans text-xs text-silver-500 hover:text-gold-400 transition-colors">
            <Phone size={12} /> Call
          </a>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ACTIVATION FORM
// ─────────────────────────────────────────────────────────────
const FLOW = { FORM: 'form', VALIDATING: 'validating', SUCCESS: 'success' }

function ActivationForm({ onSuccess, onBack }) {
  const { dispatch, ACTIONS, setUser } = useApp()
  const [segments, setSegments] = useState(['', '', ''])
  const [flow,     setFlow]     = useState(FLOW.FORM)
  const [error,    setError]    = useState('')
  const [result,   setResult]   = useState(null)

  const fullCode   = segments.join('-')
  const isComplete = segments[0].length >= 3 && segments[1].length >= 4 && segments[2].length === 4

  // Seed demo registry so demo codes always work
  useEffect(() => { seedRegistryFromClients(DEMO_CLIENTS) }, [])

  const validate = async () => {
    if (!isComplete || flow === FLOW.VALIDATING) return
    setError('')
    setFlow(FLOW.VALIDATING)

    await new Promise(r => setTimeout(r, 1600))

    const check = validateActivationCode(fullCode)
    if (!check.valid) {
      setError(check.error)
      setFlow(FLOW.FORM)
      return
    }

    // Issue the license
    const license       = issueLicense(check.entry)
    // Link device in academy identity system (existing architecture)
    const deviceIdentity = linkDeviceToClient(check.entry)
    const clientUser     = buildClientUserFromEntry(check.entry)

    // Hydrate AppContext
    setUser({ ...clientUser, role: 'client' })
    dispatch({ type: ACTIONS.SET_CLIENT_PROFILE,   payload: clientUser })
    dispatch({ type: ACTIONS.SET_ENROLLED_COURSES, payload: check.entry.enrolledCourses  || [] })
    dispatch({ type: ACTIONS.SET_OWNED_ADDONS,     payload: check.entry.ownedAddons      || [] })
    dispatch({ type: ACTIONS.SET_PROGRESS,         payload: check.entry.courseProgress   || {} })
    dispatch({ type: ACTIONS.SET_DEVICE_IDENTITY,  payload: deviceIdentity })
    dispatch({
      type: ACTIONS.SET_ACADEMY_IDENTITY,
      payload: {
        academyLinkCode: check.entry.academyLinkCode,
        academyId:       check.entry.academyId,
        academyStatus:   'active',
        linkedDevices:   check.entry.linkedDevices || [],
      }
    })

    setResult({ license, entry: check.entry, clientUser })
    setFlow(FLOW.SUCCESS)
  }

  // Auto-validate when all segments filled
  useEffect(() => {
    if (isComplete && flow === FLOW.FORM) validate()
  }, [segments])

  if (flow === FLOW.SUCCESS && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-sm mx-auto"
      >
        {/* Gold shimmer success ring */}
        <div className="relative w-24 h-24 mx-auto mb-7">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #F5E09A 50%, #C9A84C 100%)', boxShadow: '0 0 40px rgba(201,168,76,0.5)' }}
          >
            <Unlock size={30} className="text-charcoal-900" />
          </motion.div>
          {[1, 2, 3].map(i => (
            <motion.div key={i} className="absolute inset-0 rounded-full border border-gold-500/20"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1 + i * 0.3, opacity: 0 }}
              transition={{ duration: 1.5, delay: i * 0.25, repeat: Infinity }}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="divider-gold w-8" />
          <span className="section-label text-[9px]">Academy Unlocked</span>
          <div className="divider-gold w-8" />
        </div>

        <h2 className="luxury-heading text-3xl sm:text-4xl mb-3">
          Welcome,{' '}
          <span className="text-gold-gradient italic">
            {result.entry.name?.split(' ')[0]}
          </span>
        </h2>
        <p className="font-sans text-sm font-light text-silver-400 mb-7">
          Your academy is now permanently linked to this device.
        </p>

        {/* Identity summary */}
        <div className="glass-card p-5 mb-7 text-left space-y-3"
          style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
          {[
            ['Academy ID',   result.license.academyId],
            ['Link Code',    result.license.academyLinkCode],
            ['Device',       result.license.deviceId.slice(0, 20) + '…'],
            ['Activated',    new Date(result.license.activatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })],
            ['Programmes',   `${result.entry.enrolledCourses.length} unlocked`],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="font-sans text-[9px] tracking-widest uppercase text-silver-600 flex-shrink-0">{label}</span>
              <span className="font-mono text-[10px] text-gold-400 text-right truncate">{value}</span>
            </div>
          ))}
        </div>

        <motion.button
          onClick={() => onSuccess(result)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-gold flex items-center gap-2 mx-auto text-xs"
        >
          <Sparkles size={14} /> Enter Your Academy <ArrowRight size={14} />
        </motion.button>
      </motion.div>
    )
  }

  if (flow === FLOW.VALIDATING) {
    return (
      <div className="text-center max-w-sm mx-auto">
        <div className="relative w-20 h-20 mx-auto mb-7">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{ borderTopColor: '#C9A84C', borderRightColor: 'rgba(201,168,76,0.15)' }} />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-3 rounded-full border border-transparent"
            style={{ borderTopColor: 'rgba(201,168,76,0.3)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🐾</span>
          </div>
        </div>
        <div className="section-label mb-2">Verifying</div>
        <h2 className="luxury-heading text-2xl mb-5">Validating Access Code</h2>
        <div className="space-y-2">
          {['Authenticating identity', 'Issuing academy license', 'Pairing device'].map((label, i) => (
            <motion.div key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.45 }}
              className="flex items-center justify-center gap-2 text-silver-600">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear', delay: i * 0.45 }}
                className="w-3 h-3 border border-gold-600/30 border-t-gold-500 rounded-full" />
              <span className="font-sans text-xs">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // ── CODE ENTRY FORM ──
  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card gold-border p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full border border-gold-500/30 flex items-center justify-center flex-shrink-0">
            <Key size={16} className="text-gold-400" />
          </div>
          <div>
            <div className="section-label text-[9px]">Activation Required</div>
            <div className="font-sans text-xs text-silver-500 mt-0.5">Enter your code to unlock the academy</div>
          </div>
        </div>

        <h2 className="luxury-heading text-2xl sm:text-3xl mb-6">
          Enter Your<br />
          <span className="text-gold-gradient italic">Academy Code</span>
        </h2>

        <p className="font-sans text-xs font-light text-silver-500 mb-7 leading-relaxed">
          Your unique activation code was provided by your trainer. It looks like <span className="font-mono text-gold-600 text-[11px]">FPA-ELITE-4837</span>.
        </p>

        <div className="mb-6">
          <SegmentInput segments={segments} onChange={setSegments} disabled={flow !== FLOW.FORM} />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-2 mb-5 p-3 border border-red-500/20 bg-red-500/5">
              <AlertTriangle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
              <span className="font-sans text-xs text-red-400">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={validate}
          disabled={!isComplete}
          whileHover={isComplete ? { scale: 1.02 } : {}}
          whileTap={isComplete ? { scale: 0.98 } : {}}
          className="btn-gold w-full flex items-center justify-center gap-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed mb-6"
        >
          <Unlock size={14} /> Unlock Academy <ArrowRight size={14} />
        </motion.button>

        {/* Demo codes */}
        <div className="pt-5 border-t border-white/5">
          <div className="font-sans text-[9px] text-silver-700 mb-3 tracking-widest uppercase">Demo access codes</div>
          <div className="flex flex-wrap gap-2">
            {['FPA-ELITE-4837', 'FPA-LUXE-9281', 'FPA-APEX-7756'].map(code => (
              <button key={code} onClick={() => {
                const p = code.split('-')
                setSegments([p[0], p[1], p[2]])
                setError('')
              }}
                className="font-mono text-[10px] text-gold-600 hover:text-gold-300 bg-gold-500/5 hover:bg-gold-500/10 border border-gold-500/12 hover:border-gold-500/25 px-3 py-1.5 transition-all">
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={onBack}
        className="flex items-center gap-2 mx-auto mt-6 font-sans text-xs text-silver-600 hover:text-silver-300 transition-colors">
        <ArrowLeft size={12} /> Back
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN LOCK GATE COMPONENT
// ─────────────────────────────────────────────────────────────

const GATE_STATE = {
  VERIFYING:   'verifying',
  LOCKED:      'locked',
  ACTIVATING:  'activating',
  UNLOCKED:    'unlocked',
}

export default function AcademyLockGate({ children }) {
  const [gateState,    setGateState]   = useState(GATE_STATE.VERIFYING)
  const [lockStatus,   setLockStatus]  = useState(LICENSE_STATUS.LOCKED)
  const { state, dispatch, ACTIONS, setUser, notify } = useApp()

  // ── Verify on mount ─────────────────────────────────────────
  useEffect(() => {
    performVerification()
  }, [])

  // ── Re-verify whenever auth state changes ───────────────────
  useEffect(() => {
    if (state.isAuthenticated && state.userRole === 'client') {
      const { valid } = verifyLicense()
      if (!valid) {
        // Authenticated in memory but no valid license — re-lock
        setGateState(GATE_STATE.LOCKED)
        setLockStatus(LICENSE_STATUS.LOCKED)
      }
    }
  }, [state.isAuthenticated])

  const performVerification = () => {
    setGateState(GATE_STATE.VERIFYING)

    // Admins bypass the lock gate entirely
    if (state.userRole === 'admin' || state.currentUser?.role === 'admin') {
      setGateState(GATE_STATE.UNLOCKED)
      return
    }

    // Already authenticated in this session — verify license still valid
    if (state.isAuthenticated && state.userRole === 'client') {
      const { valid, status } = verifyLicense()
      if (valid) { setGateState(GATE_STATE.UNLOCKED); return }
      setLockStatus(status)
      setGateState(GATE_STATE.LOCKED)
      return
    }

    // Not authenticated — check for persisted license
    const { valid, status, license } = verifyLicense()

    if (valid && license) {
      // Restore session from license
      restoreFromLicense(license)
    } else {
      setLockStatus(status)
      setGateState(GATE_STATE.LOCKED)
    }
  }

  const restoreFromLicense = (license) => {
    const { clientSnapshot, dogSnapshot, academyId, academyLinkCode } = license

    // Restore AI memory
    const aiMemory = loadAIMemory()

    const restoredUser = {
      id:              clientSnapshot.clientId,
      name:            clientSnapshot.name,
      email:           clientSnapshot.email,
      role:            'client',
      academyId,
      academyLinkCode,
      academyStatus:   'active',
      enrolledCourses: clientSnapshot.enrolledCourses || [],
      ownedAddons:     clientSnapshot.ownedAddons     || [],
      linkedDevices:   [],
    }

    setUser(restoredUser)
    dispatch({ type: ACTIONS.SET_CLIENT_PROFILE,   payload: restoredUser })
    dispatch({ type: ACTIONS.SET_ENROLLED_COURSES, payload: restoredUser.enrolledCourses })
    dispatch({ type: ACTIONS.SET_OWNED_ADDONS,     payload: restoredUser.ownedAddons })
    dispatch({ type: ACTIONS.SET_PROGRESS,         payload: clientSnapshot.courseProgress || {} })
    dispatch({
      type: ACTIONS.SET_ACADEMY_IDENTITY,
      payload: { academyLinkCode, academyId, academyStatus: 'active', linkedDevices: [] }
    })

    // Restore AI state
    if (aiMemory?.dogProfile || dogSnapshot) {
      dispatch({ type: ACTIONS.SET_DOG_PROFILE, payload: aiMemory?.dogProfile || dogSnapshot })
    }
    if (aiMemory?.behaviourScores) {
      dispatch({ type: ACTIONS.SET_BEHAVIOUR_SCORES, payload: aiMemory.behaviourScores })
    }
    if (aiMemory?.aiRecommendations) {
      dispatch({ type: ACTIONS.SET_AI_RECOMMENDATIONS, payload: aiMemory.aiRecommendations })
    }
    if (aiMemory?.onboardingCompleted) {
      dispatch({ type: ACTIONS.SET_ONBOARDING_DONE })
    }

    setGateState(GATE_STATE.UNLOCKED)
  }

  const handleActivationSuccess = ({ license, entry, clientUser }) => {
    // AI memory restore after activation
    const aiMemory = loadAIMemory()
    if (aiMemory?.dogProfile) dispatch({ type: ACTIONS.SET_DOG_PROFILE, payload: aiMemory.dogProfile })
    if (aiMemory?.behaviourScores) dispatch({ type: ACTIONS.SET_BEHAVIOUR_SCORES, payload: aiMemory.behaviourScores })
    if (aiMemory?.aiRecommendations) dispatch({ type: ACTIONS.SET_AI_RECOMMENDATIONS, payload: aiMemory.aiRecommendations })
    if (aiMemory?.onboardingCompleted) dispatch({ type: ACTIONS.SET_ONBOARDING_DONE })

    notify(`Welcome, ${entry.name?.split(' ')[0]}! Your academy is unlocked.`, 'success', 5000)
    setGateState(GATE_STATE.UNLOCKED)
  }

  // ── VERIFYING splash ────────────────────────────────────────
  if (gateState === GATE_STATE.VERIFYING) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 mx-auto mb-6 rounded-full border-2 border-transparent"
            style={{ borderTopColor: '#C9A84C', borderRightColor: 'rgba(201,168,76,0.12)' }} />
          <div className="font-sans text-[9px] tracking-[0.4em] uppercase text-gold-600">Verifying License</div>
        </div>
      </div>
    )
  }

  // ── UNLOCKED — render children ──────────────────────────────
  if (gateState === GATE_STATE.UNLOCKED) {
    return <>{children}</>
  }

  // ── LOCKED / ACTIVATING — full screen gate UI ───────────────
  return (
    <div className="min-h-screen bg-charcoal-900 flex flex-col relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{ backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)', backgroundSize: '55px 55px' }} />
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: `${160 + i * 100}px`, height: `${160 + i * 100}px`, left: `${12 + i * 28}%`, top: `${15 + i * 22}%`, background: `radial-gradient(circle, rgba(201,168,76,${0.03 - i * 0.008}) 0%, transparent 70%)` }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <motion.span className="text-2xl" animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 5, repeat: Infinity }}>
            🐾
          </motion.span>
          <div>
            <div className="font-display text-sm font-light tracking-[0.2em] text-pearl uppercase leading-none">Four Paws</div>
            <div className="font-sans text-[8px] font-medium tracking-[0.35em] uppercase text-gold-500 mt-0.5">Training & Enrichment Academy</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-sans text-[9px] text-silver-700">
          <ShieldCheck size={11} className="text-silver-700" />
          <span className="hidden sm:inline tracking-widest uppercase">Secure</span>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          {gateState === GATE_STATE.LOCKED && (
            <motion.div key="locked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <LockedSplash
                status={lockStatus}
                onActivate={() => setGateState(GATE_STATE.ACTIVATING)}
              />
            </motion.div>
          )}

          {gateState === GATE_STATE.ACTIVATING && (
            <motion.div key="activating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <ActivationForm
                onSuccess={handleActivationSuccess}
                onBack={() => setGateState(GATE_STATE.LOCKED)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-center gap-2 pb-6 flex-shrink-0">
        <ShieldCheck size={11} className="text-silver-700" />
        <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-silver-700">
          Encrypted · Offline-First · Private
        </span>
      </div>
    </div>
  )
}
