import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Save, Play, Square, Volume2, X, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import {
  loadWellnessData, logWellnessEntry, getWellnessSummary,
  generateEnrichmentPlan, generateSmartSchedule as genSchedule,
  RECOVERY_MODES, loadActiveRecoveryMode, setActiveRecoveryMode,
  SOUNDSCAPES, playSoundscape, stopSoundscape, isSoundscapePlaying,
  loadSchedule, saveSchedule,
  VISUAL_THEMES, loadActiveTheme, saveActiveTheme,
} from '../../ai/wellness'
import { logMoodEntry, loadDigitalTwin } from '../../ai/digitalTwin'
import { loadStreak, loadAIMemory } from '../../ai/aiMemory'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

// ── Mood Logger ───────────────────────────────────────────────
const MOOD_LABELS = {
  calmness:         { icon: '😌', label: 'Calmness',         low: 'Unsettled', high: 'Very calm' },
  stress:           { icon: '😰', label: 'Stress Level',     low: 'Very low',  high: 'Very high' },
  excitement:       { icon: '⚡', label: 'Excitement',       low: 'Low',       high: 'Very high' },
  anxiety:          { icon: '😨', label: 'Anxiety',          low: 'Minimal',   high: 'Severe' },
  recovery:         { icon: '💧', label: 'Recovery Quality', low: 'Poor',      high: 'Excellent' },
  socialConfidence: { icon: '🦋', label: 'Social Confidence',low: 'Withdrawn', high: 'Confident' },
}

function MoodLogger({ dogName, onSave }) {
  const [values, setValues] = useState({ calmness: 5, stress: 3, excitement: 5, anxiety: 3, recovery: 7, socialConfidence: 5 })
  const [note,   setNote]   = useState('')
  const [saved,  setSaved]  = useState(false)

  const handleSave = () => {
    logMoodEntry({ ...values, note, dogName })
    onSave?.()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="glass-card p-6" style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
      <div className="section-label mb-1">Mood Detection</div>
      <h3 className="luxury-heading text-xl mb-5">Log {dogName}'s State</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {Object.entries(MOOD_LABELS).map(([key, meta]) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{meta.icon}</span>
                <span className="font-sans text-xs text-silver-400">{meta.label}</span>
              </div>
              <span className="font-mono text-[10px] text-gold-400">{values[key]}/10</span>
            </div>
            <input type="range" min="1" max="10" value={values[key]}
              onChange={e => setValues(v => ({ ...v, [key]: +e.target.value }))}
              className="w-full h-0.5 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #C9A84C ${(values[key] - 1) * 11.1}%, rgba(255,255,255,0.1) 0%)`, outline: 'none' }}
            />
            <div className="flex justify-between mt-1">
              <span className="font-sans text-[8px] text-silver-700">{meta.low}</span>
              <span className="font-sans text-[8px] text-silver-700">{meta.high}</span>
            </div>
          </div>
        ))}
      </div>
      <textarea value={note} onChange={e => setNote(e.target.value)}
        placeholder="Optional observation note…"
        rows={2}
        className="w-full bg-white/3 border border-white/8 text-silver-300 text-xs font-sans p-3 resize-none mb-4 placeholder-silver-700 focus:outline-none focus:border-gold-500/30"
      />
      <motion.button onClick={handleSave} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-2 font-sans text-xs px-5 py-2.5 transition-all ${
          saved ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/8' : 'btn-gold'
        }`}>
        {saved ? <><Check size={12} /> Saved</> : <><Save size={12} /> Save Mood Log</>}
      </motion.button>
    </div>
  )
}

// ── Smart Scheduler ───────────────────────────────────────────
function SmartScheduleCard({ schedule }) {
  if (!schedule) return null
  const sessions = Object.entries(schedule)

  return (
    <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="section-label mb-1">Smart Scheduler</div>
      <h3 className="luxury-heading text-xl mb-5">Recommended Daily Routine</h3>
      <div className="space-y-3">
        {sessions.map(([key, session]) => (
          <div key={key} className="flex items-start gap-4 p-3 border border-white/4 hover:border-white/8 transition-colors">
            <div className="font-mono text-xs text-gold-600 w-12 flex-shrink-0 pt-0.5">{session.time}</div>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-sm font-medium text-pearl">{session.type}</div>
              <div className="font-sans text-[10px] text-silver-600 mt-0.5">{session.duration} · {session.notes}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Soundscape Player ─────────────────────────────────────────
function SoundscapePlayer() {
  const [active,   setActive]   = useState(null)
  const [playing,  setPlaying]  = useState(false)

  const handlePlay = (soundscape) => {
    if (playing && active?.id === soundscape.id) {
      stopSoundscape()
      setPlaying(false)
      setActive(null)
    } else {
      const success = playSoundscape(soundscape)
      if (success) { setActive(soundscape); setPlaying(true) }
    }
  }

  useEffect(() => () => stopSoundscape(), [])

  return (
    <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="section-label mb-1">Soundscape System</div>
      <h3 className="luxury-heading text-xl mb-2">Ambient Environments</h3>
      <p className="font-sans text-xs text-silver-500 mb-5">Binaural tones generated offline. Use headphones for best results.</p>
      <div className="space-y-3">
        {SOUNDSCAPES.map(s => {
          const isActive = playing && active?.id === s.id
          return (
            <motion.div key={s.id} whileHover={{ x: 2 }}
              className={`flex items-center gap-3 p-3 border cursor-pointer transition-all ${
                isActive ? 'border-gold-500/30 bg-gold-500/5' : 'border-white/5 hover:border-white/12'
              }`}
              onClick={() => handlePlay(s)}>
              <span className="text-xl flex-shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-sans text-sm font-medium ${isActive ? 'text-gold-400' : 'text-silver-300'}`}>{s.name}</div>
                <div className="font-sans text-[10px] text-silver-600">{s.desc}</div>
              </div>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                isActive ? 'bg-gold-gradient' : 'border border-white/12'
              }`}>
                {isActive
                  ? <Square size={10} className="text-charcoal-900" />
                  : <Play  size={10} className="text-silver-500" />
                }
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ── Visual Theme Selector ─────────────────────────────────────
function ThemeSelector() {
  const [active, setActive] = useState(loadActiveTheme().id)

  const handleSelect = (id) => {
    saveActiveTheme(id)
    setActive(id)
  }

  return (
    <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="section-label mb-1">Visual Experience</div>
      <h3 className="luxury-heading text-xl mb-5">Elite Themes</h3>
      <div className="grid grid-cols-1 gap-3">
        {Object.values(VISUAL_THEMES).map(theme => (
          <motion.button key={theme.id} onClick={() => handleSelect(theme.id)}
            whileHover={{ x: 2 }}
            className={`flex items-center gap-3 p-3 border text-left transition-all ${
              active === theme.id ? 'border-gold-500/40 bg-gold-500/5' : 'border-white/5 hover:border-white/12'
            }`}>
            <span className="text-xl flex-shrink-0">{theme.icon}</span>
            <div className="flex-1">
              <div className={`font-sans text-sm font-medium ${active === theme.id ? 'text-gold-400' : 'text-silver-300'}`}>{theme.name}</div>
            </div>
            <div className="flex items-center gap-1.5">
              {[theme.bg, theme.surface, theme.primary, theme.accent].map((col, i) => (
                <div key={i} className="w-4 h-4 rounded-full border border-white/10" style={{ background: col }} />
              ))}
            </div>
            {active === theme.id && <Check size={12} className="text-gold-400 flex-shrink-0" />}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ── Recovery Mode Selector ────────────────────────────────────
function RecoveryModeSelector() {
  const [activeMode, setActiveMode] = useState(loadActiveRecoveryMode())

  const handleSelect = (modeId) => {
    if (activeMode === modeId) { setActiveRecoveryMode(null); setActiveMode(null) }
    else { setActiveRecoveryMode(modeId); setActiveMode(modeId) }
  }

  return (
    <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="section-label mb-1">Behaviour Recovery</div>
      <h3 className="luxury-heading text-xl mb-2">Recovery Modes</h3>
      <p className="font-sans text-xs text-silver-500 mb-5">Activate a mode to adjust AI recommendations for your dog's current situation.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.values(RECOVERY_MODES).map(mode => {
          const isActive = activeMode === mode.id
          return (
            <motion.button key={mode.id} onClick={() => handleSelect(mode.id)}
              whileHover={{ y: -2 }}
              className={`p-4 border text-left transition-all ${
                isActive ? 'border-gold-500/30 bg-gold-500/5' : 'border-white/5 hover:border-white/12'
              }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{mode.icon}</span>
                <span className={`font-sans text-xs font-semibold ${isActive ? 'text-gold-400' : 'text-silver-300'}`}>{mode.label}</span>
                {isActive && <Check size={11} className="text-gold-400 ml-auto flex-shrink-0" />}
              </div>
              <p className="font-sans text-[10px] text-silver-600 leading-snug">{mode.description}</p>
              <div className="mt-3 space-y-1">
                {mode.adjustments.slice(0, 2).map(a => (
                  <div key={a} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: mode.colour }} />
                    <span className="font-sans text-[9px] text-silver-600">{a}</span>
                  </div>
                ))}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export default function WellnessDashboard() {
  const { state }  = useApp()
  const { dogProfile, behaviourScores } = useAI()
  const dog        = dogProfile || state.dogProfile
  const client     = state.clientProfile || state.currentUser
  const dogName    = dog?.name || 'Your Companion'

  const wellnessData  = loadWellnessData()
  const wellnessSummary = useMemo(() => getWellnessSummary(wellnessData.log || []), [wellnessData])
  const enrichment    = useMemo(() => generateEnrichmentPlan(behaviourScores, dog, 5), [behaviourScores, dog])
  const schedule      = useMemo(() => genSchedule(dog, behaviourScores, client), [dog, behaviourScores, client])

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">

      {/* Header */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Companion Ecosystem</div>
        <h1 className="luxury-heading text-4xl">{dogName}'s<br /><span className="text-gold-gradient italic">Wellness Centre</span></h1>
      </FadeIn>

      {/* Wellness summary */}
      {wellnessSummary && (
        <FadeIn className="grid grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {[
            { key: 'avgSleep',      icon: '🌙', label: 'Sleep',      colour: '#8B5CF6' },
            { key: 'avgExercise',   icon: '🏃', label: 'Exercise',   colour: '#EF4444' },
            { key: 'avgNutrition',  icon: '🍖', label: 'Nutrition',  colour: '#F59E0B' },
            { key: 'avgEnrichment', icon: '✨', label: 'Enrichment', colour: '#C9A84C' },
            { key: 'avgRecovery',   icon: '💧', label: 'Recovery',   colour: '#06B6D4' },
          ].map(s => (
            <div key={s.key} className="glass-card p-4 text-center" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-mono text-lg font-semibold" style={{ color: s.colour }}>{wellnessSummary[s.key] || '—'}</div>
              <div className="font-sans text-[8px] text-silver-700 uppercase tracking-widest mt-0.5">{s.label}</div>
            </div>
          ))}
        </FadeIn>
      )}

      {/* Mood logger */}
      <FadeIn className="mb-8">
        <MoodLogger dogName={dogName} />
      </FadeIn>

      {/* Enrichment plan */}
      {enrichment.length > 0 && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">AI Enrichment Generator</div>
          <h2 className="luxury-heading text-2xl mb-4">Today's Plan for {dogName}</h2>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrichment.map((activity, i) => (
              <StaggerItem key={`${activity.name}-${i}`}>
                <div className="glass-card p-5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-serif text-sm font-medium text-pearl">{activity.name}</div>
                        <span className="font-sans text-[9px] text-silver-600">{activity.duration}</span>
                      </div>
                      <p className="font-sans text-xs text-silver-500 font-light leading-snug">{activity.desc}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </FadeIn>
      )}

      {/* Smart schedule */}
      <FadeIn className="mb-8">
        <SmartScheduleCard schedule={schedule} />
      </FadeIn>

      {/* Recovery modes */}
      <FadeIn className="mb-8">
        <RecoveryModeSelector />
      </FadeIn>

      {/* Soundscape */}
      <FadeIn className="mb-8">
        <SoundscapePlayer />
      </FadeIn>

      {/* Visual themes */}
      <FadeIn>
        <ThemeSelector />
      </FadeIn>
    </div>
  )
}
