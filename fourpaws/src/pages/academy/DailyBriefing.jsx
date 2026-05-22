// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — AI DAILY BRIEFING PAGE
// Elegant intelligence briefing. One page. One focus. Every day.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Wind, Sun, Zap, Heart, Mic, MicOff, Volume2, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useIntelligenceCore } from '../../hooks/useIntelligenceCore'
import {
  generateDailyBriefing, loadTodaysBriefing,
  getBehaviourInsightsFeed, getWeatherAwareSuggestion,
  getScheduledNotifications, runStabilityMonitor,
} from '../../ai/dailyBriefing'
import { getCurrentSeason, getSeasonalNarrative } from '../../ai/seasonalThemes'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { AmbientOrbs, IntelligenceLoader, CardEntrance } from '../../components/ui/PageTransition'
import { speak, stopSpeaking, VOICE_COACH_AVAILABLE } from '../../ai/voiceCoach'
import { SOUNDS } from '../../ai/intelligenceCore'

// ─────────────────────────────────────────────────────────────────────────────
// FOCUS CARD — today's single recommended focus
// ─────────────────────────────────────────────────────────────────────────────
function TodaysFocusCard({ focus, dogName }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.03) 100%)',
        border: '1px solid rgba(201,168,76,0.25)',
      }}
      onClick={() => { setExpanded(e => !e); SOUNDS.tap() }}
      whileHover={{ borderColor: 'rgba(201,168,76,0.45)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)' }} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-sans text-[8px] uppercase tracking-[0.4em] text-gold-600">Today's Focus</span>
              <span className="font-sans text-[8px] px-2 py-0.5 uppercase tracking-widest"
                style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }}>
                {focus.tag}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{focus.icon}</span>
              <h3 className="font-serif text-xl font-medium text-pearl">{focus.title}</h3>
            </div>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={14} className="text-silver-600 flex-shrink-0 mt-1" />
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden">
              <p className="font-sans text-sm text-silver-400 font-light leading-relaxed pt-4 border-t border-white/5">
                {focus.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BRIEFING SECTION — elegant observation block
// ─────────────────────────────────────────────────────────────────────────────
function BriefingSection({ icon: Icon, label, text, colour = '#C9A84C', delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <div className="flex items-start gap-4 p-5"
        style={{ background: `${colour}05`, border: `1px solid ${colour}18`, borderLeft: `2px solid ${colour}40` }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `${colour}12`, border: `1px solid ${colour}25` }}>
          <Icon size={13} style={{ color: colour }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-sans text-[8px] uppercase tracking-[0.35em] mb-1.5" style={{ color: colour }}>{label}</div>
          <p className="font-sans text-sm text-silver-300 font-light leading-relaxed">{text}</p>
        </div>
      </div>
    </FadeIn>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INSIGHTS FEED ITEM
// ─────────────────────────────────────────────────────────────────────────────
function InsightFeedItem({ insight, index }) {
  const timeAgo = useMemo(() => {
    const diff = Date.now() - new Date(insight.timestamp).getTime()
    const hrs  = Math.floor(diff / 3600000)
    if (hrs < 1) return 'Just now'
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }, [insight.timestamp])

  return (
    <CardEntrance index={index}>
      <div className="flex items-start gap-3 py-4 border-b border-white/[0.04] last:border-0">
        <div className="w-1.5 h-1.5 rounded-full bg-gold-700 flex-shrink-0 mt-1.5"
          style={{ boxShadow: '0 0 4px rgba(201,168,76,0.4)' }} />
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm text-silver-400 font-light leading-relaxed">{insight.text}</p>
          <span className="font-sans text-[9px] text-silver-700 mt-1 block">{timeAgo}</span>
        </div>
      </div>
    </CardEntrance>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STABILITY MONITOR BANNER
// ─────────────────────────────────────────────────────────────────────────────
function StabilityBanner({ concerns }) {
  if (!concerns.length) return null
  const top = concerns[0]
  const colourMap = { high: '#EF4444', medium: '#F59E0B', low: '#C9A84C' }
  const colour    = colourMap[top.priority] || '#C9A84C'

  return (
    <FadeIn>
      <div className="flex items-start gap-3 p-4"
        style={{ background: `${colour}06`, border: `1px solid ${colour}25`, borderLeft: `2px solid ${colour}60` }}>
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
          style={{ background: colour, boxShadow: `0 0 5px ${colour}` }} />
        <div className="flex-1 min-w-0">
          <div className="font-sans text-[8px] uppercase tracking-[0.3em] mb-1.5" style={{ color: colour }}>
            Intelligence Observation
          </div>
          <p className="font-sans text-xs text-silver-400 font-light leading-relaxed">{top.message}</p>
        </div>
      </div>
    </FadeIn>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function DailyBriefing() {
  const { state }       = useApp()
  const intelligence    = useIntelligenceCore()
  const { core, behaviourScores, emotionalState, sound } = intelligence

  const season = useMemo(() => getCurrentSeason(), [])

  const briefing = useMemo(() => {
    const cached = loadTodaysBriefing()
    if (cached) return cached
    return generateDailyBriefing(
      core?.dogProfile || state.dogProfile,
      behaviourScores,
      emotionalState,
      core?.sessionCount || 0
    )
  }, [core?.dogName, behaviourScores])

  const insightsFeed = useMemo(() =>
    getBehaviourInsightsFeed(core?.dogName, behaviourScores, 6),
    [core?.dogName, briefing]
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
      intelligence.streak
    ),
    [behaviourScores]
  )

  const seasonalNote = useMemo(() =>
    getSeasonalNarrative(core?.dogName, season),
    [core?.dogName, season.id]
  )

  const [voiceActive, setVoiceActive] = useState(false)
  const handleVoice = useCallback(() => {
    if (!VOICE_COACH_AVAILABLE || !briefing) return
    if (voiceActive) { stopSpeaking(); setVoiceActive(false); return }
    setVoiceActive(true)
    speak(briefing.narration)
    setTimeout(() => setVoiceActive(false), 12000)
  }, [briefing, voiceActive])

  if (!briefing) return <IntelligenceLoader label="Preparing today's intelligence briefing…" />

  return (
    <div className="min-h-screen p-5 lg:p-8 max-w-4xl mx-auto relative">
      <AmbientOrbs count={2} colour={`${season.glow}`} />

      {/* ── Header ─────────────────────────────────────────── */}
      <FadeIn className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="divider-gold w-6" />
              <span className="section-label text-[9px]">{season.emoji} Intelligence Briefing</span>
            </div>
            <h1 className="luxury-heading text-4xl mb-1">Today's Report</h1>
            <p className="font-sans text-xs text-silver-600 font-light">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          {VOICE_COACH_AVAILABLE && (
            <motion.button onClick={handleVoice} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 transition-all duration-300"
              style={{
                border: `1px solid ${voiceActive ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.1)'}`,
                background: voiceActive ? 'rgba(201,168,76,0.08)' : 'transparent',
              }}>
              <Volume2 size={13} className={voiceActive ? 'text-gold-400' : 'text-silver-600'} />
              <span className="font-sans text-[9px] uppercase tracking-widest"
                style={{ color: voiceActive ? '#C9A84C' : 'rgba(255,255,255,0.4)' }}>
                {voiceActive ? 'Narrating…' : 'Narrate'}
              </span>
            </motion.button>
          )}
        </div>
      </FadeIn>

      {/* ── Stability monitor ──────────────────────────────── */}
      {stabilityMonitor.length > 0 && (
        <div className="mb-5">
          <StabilityBanner concerns={stabilityMonitor} />
        </div>
      )}

      {/* ── Today's focus ─────────────────────────────────── */}
      {briefing.todaysFocus && (
        <div className="mb-6">
          <TodaysFocusCard focus={briefing.todaysFocus} dogName={briefing.dogName} />
        </div>
      )}

      {/* ── Briefing sections ──────────────────────────────── */}
      <div className="space-y-3 mb-7">
        <BriefingSection
          icon={Brain}
          label="Emotional Observation"
          text={briefing.emotionalObservation}
          colour="#C9A84C"
          delay={0.05}
        />
        <BriefingSection
          icon={Heart}
          label="Recovery Intelligence"
          text={briefing.recoveryInsight}
          colour="#10B981"
          delay={0.1}
        />
        <BriefingSection
          icon={Zap}
          label="Confidence Insight"
          text={briefing.confidenceInsight}
          colour="#8B5CF6"
          delay={0.15}
        />
        <BriefingSection
          icon={Wind}
          label="Wellness Recommendation"
          text={briefing.wellnessRecommendation}
          colour="#06B6D4"
          delay={0.2}
        />
      </div>

      {/* ── Weather intelligence ──────────────────────────── */}
      {weatherSuggestion.available && (
        <FadeIn delay={0.25} className="mb-6">
          <div className="p-5"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{weatherSuggestion.icon}</span>
              <span className="font-sans text-[9px] uppercase tracking-widest text-silver-600">
                Environmental Intelligence · {weatherSuggestion.condition}
              </span>
            </div>
            <p className="font-sans text-sm text-silver-400 font-light leading-relaxed">
              {weatherSuggestion.suggestion}
            </p>
          </div>
        </FadeIn>
      )}

      {/* ── Training context ─────────────────────────────── */}
      <FadeIn delay={0.3} className="mb-6">
        <div className="p-5"
          style={{ background: `${season.bg}`, border: `1px solid ${season.secondary}18` }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{season.emoji}</span>
            <span className="font-sans text-[9px] uppercase tracking-widest" style={{ color: season.secondary }}>
              {season.name} Intelligence
            </span>
          </div>
          <p className="font-sans text-sm font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {seasonalNote}
          </p>
        </div>
      </FadeIn>

      {/* ── Training advice ───────────────────────────────── */}
      <FadeIn delay={0.35} className="mb-8">
        <div className="p-5 relative overflow-hidden"
          style={{ background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.12)' }}>
          <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-gold-700 mb-2">Session Intelligence</div>
          <p className="font-sans text-sm text-silver-500 font-light leading-relaxed italic">
            {briefing.trainingAdvice}
          </p>
        </div>
      </FadeIn>

      {/* ── Behaviour insights feed ───────────────────────── */}
      <FadeIn delay={0.4}>
        <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-700">
              Intelligence Feed
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div className="w-1 h-1 rounded-full bg-gold-600"
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="font-sans text-[8px] text-silver-700">Live</span>
            </div>
          </div>
          <div>
            {insightsFeed.map((insight, i) => (
              <InsightFeedItem key={insight.id} insight={insight} index={i} />
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
