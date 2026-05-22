// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — LUXURY MOBILE WIDGET SYSTEM
// Premium glassmorphism data widgets. Used throughout the academy.
// Each widget is standalone, offline-capable, mobile-first.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { EMOTIONAL_STATES } from '../../ai/emotionalEngine'

// ─────────────────────────────────────────────────────────────────────────────
// BEHAVIOUR SCORE WIDGET
// ─────────────────────────────────────────────────────────────────────────────
export function BehaviourScoreWidget({ behaviourScores, compact = false }) {
  const score   = behaviourScores?.composite?.overall ?? null
  const concern = behaviourScores?.composite?.concernLevel
  const colour  = concern?.colour?.replace('text-', '') || '#C9A84C'

  const colourMap = {
    'text-emerald-400': '#10B981',
    'text-gold-400':    '#C9A84C',
    'text-amber-400':   '#F59E0B',
    'text-orange-400':  '#F97316',
    'text-red-400':     '#EF4444',
  }
  const resolvedColour = colourMap[concern?.colour] || '#C9A84C'

  const scoreDisplay = score !== null ? Math.round(100 - score) : '—'
  const circumference = 2 * Math.PI * 22
  const strokeDash    = score !== null ? ((100 - score) / 100) * circumference : 0

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3"
        style={{ background: `${resolvedColour}08`, border: `1px solid ${resolvedColour}20` }}>
        <div className="font-display text-2xl font-light" style={{ color: resolvedColour }}>{scoreDisplay}</div>
        <div>
          <div className="font-sans text-[8px] uppercase tracking-widest text-silver-700">Wellbeing</div>
          <div className="font-sans text-[10px]" style={{ color: resolvedColour }}>
            {concern?.label || 'Loading…'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-5 text-center relative overflow-hidden"
      style={{ border: `1px solid ${resolvedColour}20` }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${resolvedColour}04 0%, transparent 70%)` }} />

      <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-silver-700 mb-4">Wellbeing Index</div>

      {/* Radial gauge */}
      <div className="relative w-16 h-16 mx-auto mb-3">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <motion.circle
            cx="24" cy="24" r="22" fill="none"
            stroke={resolvedColour} strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-lg font-light" style={{ color: resolvedColour }}>{scoreDisplay}</span>
        </div>
      </div>

      <div className="font-sans text-[10px] font-medium" style={{ color: resolvedColour }}>
        {concern?.label || '—'}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EMOTIONAL STATE WIDGET
// ─────────────────────────────────────────────────────────────────────────────
export function EmotionalStateWidget({ emotionalState }) {
  const state = emotionalState || EMOTIONAL_STATES.UNCERTAIN

  return (
    <div className="glass-card p-5 relative overflow-hidden"
      style={{ border: `1px solid ${state.colour}20` }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 60% at 50% 0%, ${state.glow} 0%, transparent 70%)` }} />

      <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-silver-700 mb-3">Emotional Status</div>

      <div className="flex items-center gap-3">
        <motion.div className="text-3xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          {state.icon}
        </motion.div>
        <div>
          <div className="font-serif text-base font-medium" style={{ color: state.colour }}>{state.label}</div>
          <div className="font-sans text-[10px] text-silver-600 font-light mt-0.5 leading-relaxed max-w-[140px]">
            {state.desc}
          </div>
        </div>
      </div>

      {/* Pulse indicator */}
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
        <motion.div className="w-1.5 h-1.5 rounded-full"
          style={{ background: state.colour }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }} />
        <span className="font-sans text-[9px] text-silver-700">Live monitoring active</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RECOVERY SCORE WIDGET
// ─────────────────────────────────────────────────────────────────────────────
export function RecoveryWidget({ intScores }) {
  const recovery = intScores?.recovery ?? null
  const colour = recovery > 65 ? '#10B981' : recovery > 40 ? '#C9A84C' : '#F97316'

  return (
    <div className="glass-card p-5 relative overflow-hidden"
      style={{ border: `1px solid ${colour}18` }}>
      <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-silver-700 mb-3">Recovery Rate</div>
      <div className="flex items-end gap-2 mb-3">
        <div className="font-display text-3xl font-light" style={{ color: colour }}>
          {recovery !== null ? recovery : '—'}
        </div>
        {recovery !== null && <div className="font-sans text-xs text-silver-600 mb-1">/ 100</div>}
      </div>
      <div className="h-0.5 bg-white/5 overflow-hidden">
        <motion.div className="h-full"
          style={{ background: colour }}
          initial={{ width: 0 }}
          animate={{ width: `${recovery || 0}%` }}
          transition={{ duration: 1.3, ease: 'easeOut' }} />
      </div>
      <div className="font-sans text-[9px] text-silver-600 mt-2">
        {recovery > 65 ? 'Excellent recovery capacity' : recovery > 40 ? 'Developing recovery' : 'Focus: recovery protocols'}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CALMNESS INDICATOR WIDGET
// ─────────────────────────────────────────────────────────────────────────────
export function CalmnessWidget({ behaviourScores, emotionalState }) {
  const anxiety  = behaviourScores?.individual?.anxiety || 50
  const calmness = Math.round(100 - anxiety)
  const state    = emotionalState || EMOTIONAL_STATES.UNCERTAIN

  const barColour = calmness > 65 ? '#10B981' : calmness > 40 ? '#C9A84C' : '#F97316'

  return (
    <div className="glass-card p-5"
      style={{ border: `1px solid rgba(16,185,129,0.15)` }}>
      <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-silver-700 mb-3">Calmness Index</div>
      <div className="flex items-center gap-3 mb-3">
        <div className="font-display text-3xl font-light" style={{ color: barColour }}>{calmness}</div>
        <div className="flex-1">
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${barColour}80, ${barColour})` }}
              initial={{ width: 0 }}
              animate={{ width: `${calmness}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{state.icon}</span>
        <span className="font-sans text-[9px] text-silver-600">{state.label}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WELLNESS SNAPSHOT WIDGET
// ─────────────────────────────────────────────────────────────────────────────
export function WellnessSnapshotWidget({ wellnessSummary }) {
  if (!wellnessSummary) return (
    <div className="glass-card p-5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-silver-700 mb-2">Wellness Snapshot</div>
      <p className="font-sans text-xs text-silver-700 font-light">Log wellness entries to build your snapshot.</p>
    </div>
  )

  const metrics = [
    { label: 'Sleep',     value: wellnessSummary.avgSleep,      icon: '😴', colour: '#8B5CF6' },
    { label: 'Exercise',  value: wellnessSummary.avgExercise,   icon: '🏃', colour: '#10B981' },
    { label: 'Nutrition', value: wellnessSummary.avgNutrition,  icon: '🥗', colour: '#F59E0B' },
    { label: 'Recovery',  value: wellnessSummary.avgRecovery,   icon: '💧', colour: '#06B6D4' },
  ]

  return (
    <div className="glass-card p-5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-silver-700">7-Day Wellness</div>
        <div className="font-sans text-[8px]"
          style={{ color: wellnessSummary.trend === 'improving' ? '#10B981' : '#C9A84C' }}>
          {wellnessSummary.trend === 'improving' ? '↑ Improving' : '→ Stable'}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {metrics.map(m => (
          <div key={m.label} className="text-center">
            <div className="text-base mb-1">{m.icon}</div>
            <div className="font-display text-sm font-light" style={{ color: m.colour }}>{m.value ?? '—'}</div>
            <div className="font-sans text-[7px] text-silver-700 uppercase tracking-wider">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT IDLE STATE — living background when dashboard is inactive
// Creates subtle floating motion to prevent static feel.
// ─────────────────────────────────────────────────────────────────────────────
export function AmbientIdleState({ season, emotionalState }) {
  const colour = emotionalState?.colour || '#C9A84C'
  const seasonGlow = season?.glow || 'rgba(201,168,76,0.03)'

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Breathing gradient */}
      <motion.div className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(ellipse 50% 50% at 20% 30%, ${seasonGlow} 0%, transparent 70%)`,
            `radial-gradient(ellipse 60% 60% at 80% 70%, ${seasonGlow} 0%, transparent 70%)`,
            `radial-gradient(ellipse 50% 50% at 50% 20%, ${seasonGlow} 0%, transparent 70%)`,
            `radial-gradient(ellipse 50% 50% at 20% 30%, ${seasonGlow} 0%, transparent 70%)`,
          ]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Emotional state ambient glow */}
      <motion.div className="absolute inset-0"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: `radial-gradient(ellipse 40% 40% at 50% 80%, ${colour}04 0%, transparent 70%)` }}
      />

      {/* Subtle scanline */}
      <div className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)',
          backgroundSize: '100% 3px',
        }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MICROINTERACTION BUTTON — luxury physics button
// ─────────────────────────────────────────────────────────────────────────────
export function LuxuryButton({ children, onClick, variant = 'gold', size = 'standard', className = '', disabled = false }) {
  const variants = {
    gold:    { bg: 'linear-gradient(135deg, #C9A84C 0%, #F5E09A 50%, #C9A84C 100%)', colour: '#0A0A0A', border: 'transparent' },
    outline: { bg: 'transparent', colour: '#C9A84C', border: 'rgba(201,168,76,0.4)' },
    ghost:   { bg: 'rgba(201,168,76,0.06)', colour: '#C9A84C', border: 'rgba(201,168,76,0.2)' },
  }
  const v = variants[variant] || variants.gold
  const px = size === 'small' ? '16px 24px' : size === 'large' ? '18px 48px' : '14px 36px'
  const fs = size === 'small' ? '10px' : size === 'large' ? '13px' : '11px'

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative overflow-hidden font-sans font-medium tracking-widest uppercase transition-all duration-300 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={{ background: v.bg, color: v.colour, border: `1px solid ${v.border}`, padding: px, fontSize: fs }}
      whileHover={disabled ? {} : { y: -2, boxShadow: '0 8px 24px rgba(201,168,76,0.25)' }}
      whileTap={disabled ? {} : { scale: 0.97, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)' }}
        initial={{ x: '-100%' }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INTELLIGENCE METRIC CARD — clean data display
// ─────────────────────────────────────────────────────────────────────────────
export function MetricCard({ label, value, suffix = '', icon, colour = '#C9A84C', trend, description }) {
  const trendColour = trend > 0 ? '#10B981' : trend < 0 ? '#EF4444' : '#6B7280'

  return (
    <motion.div
      className="glass-card p-5 relative overflow-hidden"
      style={{ border: `1px solid ${colour}15` }}
      whileHover={{ y: -2, borderColor: `${colour}35` }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 60% at 100% 0%, ${colour}04 0%, transparent 70%)` }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-silver-700">{label}</div>
          {icon && <span className="text-lg opacity-70">{icon}</span>}
        </div>
        <div className="flex items-end gap-1 mb-1">
          <div className="font-display text-3xl font-light" style={{ color: colour }}>{value}</div>
          {suffix && <div className="font-sans text-xs text-silver-600 mb-1">{suffix}</div>}
        </div>
        {trend !== undefined && (
          <div className="font-sans text-[9px]" style={{ color: trendColour }}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}% vs last week
          </div>
        )}
        {description && (
          <div className="font-sans text-[9px] text-silver-700 mt-1">{description}</div>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPANION PRESENCE — animated awareness indicator
// Shows dog "is present" — emotional companionship UI
// ─────────────────────────────────────────────────────────────────────────────
export function CompanionPresence({ dogName, emotionalState, timeContext }) {
  const state  = emotionalState || EMOTIONAL_STATES.UNCERTAIN
  const period = timeContext?.period || 'morning'

  const presenceMessages = {
    early_morning: `${dogName} is quietly alert this morning.`,
    morning:       `${dogName} is present and ready for the day.`,
    midday:        `${dogName} is settled through the afternoon.`,
    afternoon:     `${dogName} is calm in the afternoon warmth.`,
    evening:       `${dogName} is winding down for the evening.`,
    night:         `${dogName} is resting quietly.`,
  }

  const message = presenceMessages[period] || presenceMessages.morning

  return (
    <div className="flex items-center gap-3 p-4"
      style={{
        background: `${state.colour}05`,
        border: `1px solid ${state.colour}15`,
      }}>
      {/* Breathing orb */}
      <div className="relative flex-shrink-0 w-10 h-10">
        <motion.div className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${state.glow} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{ background: `${state.colour}10`, border: `1px solid ${state.colour}30` }}>
          <span className="text-lg">🐾</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-serif text-sm font-light text-silver-300 italic">{message}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <motion.div className="w-1 h-1 rounded-full"
            style={{ background: state.colour }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }} />
          <span className="font-sans text-[8px] text-silver-700">{state.label}</span>
        </div>
      </div>
    </div>
  )
}
