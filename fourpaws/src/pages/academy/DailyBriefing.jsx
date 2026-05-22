// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — DAILY BRIEFING
// ODIN DOCTRINE: One insight. One action. One observation.
// The briefing is a quiet morning presence — not a dashboard.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useIntelligenceCore } from '../../hooks/useIntelligenceCore'
import {
  generateDailyBriefing, loadTodaysBriefing,
  getWeatherAwareSuggestion, runStabilityMonitor,
} from '../../ai/dailyBriefing'
import { getCurrentSeason, getSeasonalNarrative } from '../../ai/seasonalThemes'
import { buildSingleSurface, MOTION, purifyText } from '../../ai/narrativeVoice'
import { FadeIn } from '../../components/animations/FadeIn'
import { AmbientOrbs } from '../../components/ui/PageTransition'
import { speak, VOICE_COACH_AVAILABLE } from '../../ai/voiceCoach'
import { SOUNDS } from '../../ai/intelligenceCore'
import { loadAIMemory } from '../../ai/aiMemory'

// ─────────────────────────────────────────────────────────────────────────────
// QUIET STABILITY BANNER — only shown for high-priority observations
// ─────────────────────────────────────────────────────────────────────────────
function StabilityBanner({ concerns }) {
  const top = concerns.find(c => c.priority === 'high')
  if (!top) return null
  return (
    <FadeIn>
      <div className="flex items-start gap-3 p-4 mb-5"
        style={{
          background: 'rgba(239,68,68,0.04)',
          border: '1px solid rgba(239,68,68,0.15)',
          borderLeft: '2px solid rgba(239,68,68,0.5)',
        }}>
        <div className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
        <p className="font-sans text-xs text-silver-400 font-light leading-relaxed">
          {purifyText(top.message)}
        </p>
      </div>
    </FadeIn>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TODAY'S FOCUS — expandable single recommendation
// ─────────────────────────────────────────────────────────────────────────────
function TodaysFocus({ focus, dogName }) {
  const [expanded, setExpanded] = useState(false)
  if (!focus) return null

  return (
    <FadeIn>
      <motion.div
        className="cursor-pointer"
        style={{
          background: 'rgba(201,168,76,0.04)',
          border: '1px solid rgba(201,168,76,0.15)',
        }}
        onClick={() => { setExpanded(e => !e); SOUNDS.tap() }}
        whileHover={{ borderColor: 'rgba(201,168,76,0.3)' }}
        transition={{ duration: MOTION.micro.duration }}
      >
        <div className="absolute top-0 left-0 right-0 h-px overflow-hidden"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />

        <div className="relative p-5 flex items-center gap-4">
          <span className="text-xl flex-shrink-0">{focus.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-gold-700 mb-0.5">Today's Focus</div>
            <div className="font-serif text-sm font-medium text-pearl">{focus.title}</div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: MOTION.micro.duration }}>
            <ChevronDown size={12} className="text-silver-700 flex-shrink-0" />
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={MOTION.expand}
              className="overflow-hidden">
              <div className="px-5 pb-5 pt-2 border-t border-white/5">
                <p className="font-sans text-xs text-silver-400 font-light leading-relaxed">
                  {purifyText(focus.desc)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </FadeIn>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function DailyBriefing() {
  const { state }     = useApp()
  const intelligence  = useIntelligenceCore()
  const { core, behaviourScores, emotionalState, streak } = intelligence

  const season = useMemo(() => getCurrentSeason(), [])
  const memory = useMemo(() => loadAIMemory(), [])

  const briefing = useMemo(() => {
    const cached = loadTodaysBriefing()
    if (cached) return cached
    return generateDailyBriefing(
      core?.dogProfile || state.dogProfile,
      behaviourScores,
      emotionalState,
      memory.sessionCount || 0
    )
  }, [core?.dogName])

  // The single surface — three outputs only
  const surface = useMemo(() =>
    buildSingleSurface(core, behaviourScores, emotionalState, streak, core?.dogName),
    [core?.dogName, behaviourScores, emotionalState, streak]
  )

  const weatherSuggestion = useMemo(() =>
    getWeatherAwareSuggestion(core?.dogName, behaviourScores),
    [core?.dogName]
  )

  const stabilityMonitor = useMemo(() =>
    runStabilityMonitor(
      core?.dogProfile || state.dogProfile,
      behaviourScores,
      state.courseProgress,
      { current: streak?.current || 0, longest: streak?.longest || 0 }
    ),
    [behaviourScores]
  )

  const seasonalNote = useMemo(() =>
    getSeasonalNarrative(core?.dogName, season),
    [core?.dogName, season.id]
  )

  const [voiceActive, setVoiceActive] = useState(false)
  const handleVoice = useCallback(() => {
    if (!VOICE_COACH_AVAILABLE || !surface) return
    if (voiceActive) { setVoiceActive(false); return }
    setVoiceActive(true)
    const script = [surface.insight, surface.action, surface.observation].filter(Boolean).join('. ')
    speak(script)
    setTimeout(() => setVoiceActive(false), 10000)
  }, [surface, voiceActive])

  return (
    <div className="min-h-screen p-5 lg:p-8 max-w-2xl mx-auto relative">
      <AmbientOrbs count={1} colour={season.glow} />

      {/* Header */}
      <FadeIn className="mb-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-silver-700 mb-1">
              {season.emoji} {season.name} · Intelligence Briefing
            </div>
            <h1 className="font-serif text-3xl font-light text-pearl">Today</h1>
            <p className="font-sans text-[10px] text-silver-700 mt-1">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          {VOICE_COACH_AVAILABLE && (
            <motion.button onClick={handleVoice} whileTap={MOTION.tap}
              className="flex items-center gap-2 px-3 py-2 transition-all duration-300 flex-shrink-0"
              style={{
                border: `1px solid ${voiceActive ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.06)'}`,
                background: voiceActive ? 'rgba(201,168,76,0.05)' : 'transparent',
              }}>
              <Volume2 size={11} style={{ color: voiceActive ? '#C9A84C' : 'rgba(255,255,255,0.3)' }} />
              <span className="font-sans text-[8px] uppercase tracking-widest"
                style={{ color: voiceActive ? '#C9A84C' : 'rgba(255,255,255,0.3)' }}>
                {voiceActive ? 'Listening…' : 'Narrate'}
              </span>
            </motion.button>
          )}
        </div>
      </FadeIn>

      {/* Stability — high priority only */}
      <StabilityBanner concerns={stabilityMonitor} />

      {/* THE THREE SURFACES */}
      {surface && (
        <FadeIn delay={0.05} className="mb-5">
          <div className="p-6"
            style={{
              background: 'linear-gradient(160deg, rgba(201,168,76,0.05) 0%, rgba(201,168,76,0.015) 100%)',
              border: '1px solid rgba(201,168,76,0.12)',
            }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />

            {/* Insight */}
            <div className="mb-4">
              <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-gold-700 mb-2">Insight</div>
              <p className="font-sans text-sm text-silver-300 font-light leading-relaxed">{surface.insight}</p>
            </div>

            <div className="h-px mb-4"
              style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.12), transparent)' }} />

            {/* Action */}
            <div className={surface.observation ? 'mb-4' : ''}>
              <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-gold-700 mb-2">Recommendation</div>
              <p className="font-sans text-sm text-silver-400 font-light leading-relaxed">{surface.action}</p>
            </div>

            {/* Observation — only when present */}
            {surface.observation && (
              <>
                <div className="h-px mb-4"
                  style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }} />
                <div>
                  <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-silver-700 mb-2">Observation</div>
                  <p className="font-sans text-xs text-silver-500 font-light leading-relaxed italic">
                    {surface.observation}
                  </p>
                </div>
              </>
            )}
          </div>
        </FadeIn>
      )}

      {/* Today's focus — expandable, single recommendation */}
      {briefing?.todaysFocus && (
        <div className="mb-5 relative">
          <TodaysFocus focus={briefing.todaysFocus} dogName={core?.dogName} />
        </div>
      )}

      {/* Weather — only if truly relevant (high priority) */}
      {weatherSuggestion.available && weatherSuggestion.priority === 'high' && (
        <FadeIn delay={0.2} className="mb-5">
          <div className="flex items-start gap-3 p-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-base flex-shrink-0">{weatherSuggestion.icon}</span>
            <p className="font-sans text-xs text-silver-500 font-light leading-relaxed">
              {purifyText(weatherSuggestion.suggestion)}
            </p>
          </div>
        </FadeIn>
      )}

      {/* Seasonal note — understated footer */}
      <FadeIn delay={0.3}>
        <div className="py-5 border-t border-white/[0.04]">
          <p className="font-sans text-[10px] text-silver-700 font-light italic leading-relaxed">
            {seasonalNote}
          </p>
        </div>
      </FadeIn>
    </div>
  )
}
