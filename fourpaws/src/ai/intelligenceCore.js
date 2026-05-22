// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS INTELLIGENCE CORE
// ─────────────────────────────────────────────────────────────────────────────
// The unified orchestration layer. Every AI system in the platform routes
// through here. This is the platform's cognitive identity — one intelligence
// engine that presents as a single, coherent, emotionally aware presence.
//
// Architecture:
//   behaviourEngine  → raw scores, concern levels
//   emotionalEngine  → derived emotional state model
//   concierge        → narrative language + greetings
//   wellness         → enrichment + scheduling
//   digitalTwin      → predictive modelling
//   trainingStrategist → session planning
//   achievements     → milestone detection
//   aiMemory         → persistence + continuity
//
// All AI output is unified through generateCoreIntelligence() which returns
// a single, consistent snapshot consumed by the entire platform.
// ─────────────────────────────────────────────────────────────────────────────

import { scoreBehaviour, recommendCourses, recommendAddons, generateBehaviourInsight, generateProgressInsight } from './behaviourEngine'
import { deriveEmotionalState, deriveOptimising, EMOTIONAL_STATES, loadEmotionalState } from './emotionalEngine'
import { getDynamicGreeting, getConciergeCoachingSummary, getDailyTransformationInsight, generatePredictiveAlerts } from './concierge'
import { loadAIMemory, saveAIMemory, patchAIMemory, recordBehaviourSnapshot, generateEnrichmentPlan, loadStreak, checkAndRecordMilestone } from './aiMemory'
import { loadWellnessData, getWellnessSummary } from './wellness'
import { computeEarnedAchievements } from './achievements'
import { getArchetype, getClientTier, computeIntelligenceScores } from './archetypes'
import { purifyText } from './narrativeVoice'

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE KEY
// ─────────────────────────────────────────────────────────────────────────────
const CORE_KEY     = 'fp_intelligence_core'
const NARRATIVE_KEY = 'fp_narrative_state'
const SOUND_KEY    = 'fp_sound_prefs'

// ─────────────────────────────────────────────────────────────────────────────
// LUXE NARRATIVE LANGUAGE ENGINE
// All platform copy is generated here. No generic SaaS language.
// ─────────────────────────────────────────────────────────────────────────────

const NARRATIVE_TEMPLATES = {
  // Progress observations — replaces "+X% improvement"
  progression: {
    remarkable:   (d, trait) => `${d} is demonstrating remarkable ${trait} — a progression that speaks to the consistency of your commitment.`,
    strong:       (d, trait) => `${d}'s ${trait} continues to develop with impressive consistency.`,
    steady:       (d, trait) => `${d} is building ${trait} steadily. The foundation is solid.`,
    emerging:     (d, trait) => `${d} is beginning to show meaningful development in ${trait}. The trajectory is encouraging.`,
    establishing: (d, trait) => `The early indicators of ${trait} are present in ${d}. Patient consistency will deliver the breakthrough.`,
  },

  // Emotional state observations
  emotional: {
    serene:    (d) => `${d} is presenting patterns consistent with genuine emotional stability — the state in which the deepest learning occurs.`,
    settled:   (d) => `${d} appears emotionally regulated and receptive. Conditions are well-suited for today's session.`,
    alert:     (d) => `${d} is in an engaged, alert state. Manage the environment carefully and capitalise on this focus window.`,
    aroused:   (d) => `${d}'s arousal is elevated. Begin with decompression before advancing to any new material.`,
    anxious:   (d) => `${d} requires emotional first aid today. Prioritise decompression and calm reinforcement over formal training.`,
    reactive:  (d) => `${d} has exceeded threshold. Suspend formal training. Implement the recovery protocol from your programme.`,
    recovering:(d) => `${d} is in post-arousal recovery. Allow 20–40 minutes of quiet decompression before any engagement.`,
    uncertain: (d) => `${d}'s emotional profile is still being established. Continue logging to build a complete picture.`,
  },

  // Daily insight variations
  insight: [
    (d) => `${d}'s neurological plasticity is highest in the 48 hours following a new experience. Capitalise on this window.`,
    (d) => `Consistency in ${d}'s routine creates the predictability that underpins emotional security.`,
    (d) => `${d} learns through emotional states, not repetition alone. A calm handler creates a calm dog.`,
    (d) => `The quality of ${d}'s decompression time directly influences tomorrow's training capacity.`,
    (d) => `${d}'s social confidence is cumulative. Each positive encounter builds the reservoir.`,
    (d) => `Threshold management is the keystone of ${d}'s transformation programme. Distance is your most valuable tool.`,
    (d) => `${d}'s body language is the most accurate intelligence available. Observe before you intervene.`,
    (d) => `The relationship between ${d}'s sleep quality and next-day training performance is direct and measurable.`,
    (d) => `${d} does not generalise learning automatically. Proof behaviours across 5 different environments.`,
    (d) => `Every calm moment ${d} experiences in a previously difficult environment is reshaping their neural associations.`,
  ],

  // Milestone announcements — replace gamification language
  milestones: {
    lesson:     (d, n) => `${d} has completed ${n} lesson${n > 1 ? 's' : ''} — each one a permanent addition to their behavioural foundation.`,
    streak:     (d, n) => `${n} consecutive training days with ${d}. This level of consistency is precisely what produces lasting transformation.`,
    course:     (d, t) => `${d} has completed the ${t} programme. A genuinely significant milestone in their transformation journey.`,
    confidence: (d)    => `${d}'s confidence metrics have reached a new peak. The work is becoming visible in their everyday presentation.`,
    stability:  (d)    => `${d}'s stability index has crossed a critical threshold. The foundation of their transformation is now firmly established.`,
    calmness:   (d)    => `${d} has achieved a new calmness benchmark. This is the emotional state that makes everything else possible.`,
    recovery:   (d)    => `${d}'s emotional recovery speed has improved significantly. Resilience is building.`,
  },

  // Weekly summary narratives
  weekly: {
    exceptional: (d) => `${d} has delivered an exceptional week. Every metric reflects the quality of the work being done.`,
    strong:      (d) => `A strong week for ${d}. The trajectory remains firmly positive.`,
    steady:      (d) => `${d} has maintained steady progress this week. Consistency is the engine of transformation.`,
    mixed:       (d) => `${d}'s week presented both challenges and breakthroughs — which is precisely how lasting change is built.`,
    challenging: (d) => `A challenging week for ${d}, but the data reveals important patterns that will inform the weeks ahead.`,
  },

  // Concierge report intros
  report: {
    opening: (d, period) => `This is the Four Paws Intelligence Report for ${d} — ${period}. The analysis below reflects every logged interaction, wellness entry, and training session.`,
    closing:             () => `This report was generated by the Four Paws Intelligence Core. The observations above are drawn exclusively from logged behavioural data and represent the platform's current analytical assessment.`,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// BEHAVIOURAL STORYTELLING ENGINE
// Converts raw scores into concierge-grade narrative observations.
// ─────────────────────────────────────────────────────────────────────────────

export function generateBehaviouralNarrative(dogName, behaviourScores, emotionalState, sessionCount = 0) {
  const dog = dogName || 'Your companion'
  const ind = behaviourScores?.individual || {}

  const narratives = []

  // Emotional state narrative
  if (emotionalState?.id) {
    const emo = NARRATIVE_TEMPLATES.emotional[emotionalState.id]
    if (emo) narratives.push({ type: 'emotional', text: emo(dog), priority: 1 })
  }

  // Trait-based progression narratives
  const traitNarratives = []

  if (ind.confidence !== undefined) {
    const conf = 100 - ind.confidence // invert — lower concern = higher confidence
    if (conf > 75) traitNarratives.push(NARRATIVE_TEMPLATES.progression.remarkable(dog, 'environmental confidence'))
    else if (conf > 55) traitNarratives.push(NARRATIVE_TEMPLATES.progression.strong(dog, 'confidence'))
    else if (conf > 35) traitNarratives.push(NARRATIVE_TEMPLATES.progression.steady(dog, 'confidence development'))
    else traitNarratives.push(NARRATIVE_TEMPLATES.progression.establishing(dog, 'confidence'))
  }

  if (ind.anxiety !== undefined) {
    if (ind.anxiety < 25)       traitNarratives.push(NARRATIVE_TEMPLATES.progression.remarkable(dog, 'emotional regulation'))
    else if (ind.anxiety < 45)  traitNarratives.push(NARRATIVE_TEMPLATES.progression.strong(dog, 'anxiety management'))
    else if (ind.anxiety < 65)  traitNarratives.push(NARRATIVE_TEMPLATES.progression.emerging(dog, 'calmness capacity'))
  }

  if (ind.reactivity !== undefined) {
    if (ind.reactivity < 30)    traitNarratives.push(NARRATIVE_TEMPLATES.progression.strong(dog, 'threshold resilience'))
    else if (ind.reactivity < 55) traitNarratives.push(NARRATIVE_TEMPLATES.progression.emerging(dog, 'reactive recovery capacity'))
  }

  if (traitNarratives.length > 0) {
    narratives.push({ type: 'traits', text: traitNarratives[0], priority: 2 })
    if (traitNarratives.length > 1) narratives.push({ type: 'traits_secondary', text: traitNarratives[1], priority: 3 })
  }

  // Daily insight
  const insightIdx  = sessionCount % NARRATIVE_TEMPLATES.insight.length
  const insightFn   = NARRATIVE_TEMPLATES.insight[insightIdx]
  narratives.push({ type: 'insight', text: insightFn(dog), priority: 4 })

  return narratives.sort((a, b) => a.priority - b.priority)
}

// ─────────────────────────────────────────────────────────────────────────────
// MILESTONE NARRATIVE GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export function generateMilestoneNarrative(type, dogName, value) {
  const dog = dogName || 'Your companion'
  const fn  = NARRATIVE_TEMPLATES.milestones[type]
  return fn ? fn(dog, value) : `${dog} has achieved a new milestone.`
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEKLY NARRATIVE GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export function generateWeeklyNarrative(dogName, weekScore) {
  const dog = dogName || 'Your companion'
  if (weekScore >= 80)      return NARRATIVE_TEMPLATES.weekly.exceptional(dog)
  else if (weekScore >= 65) return NARRATIVE_TEMPLATES.weekly.strong(dog)
  else if (weekScore >= 45) return NARRATIVE_TEMPLATES.weekly.steady(dog)
  else if (weekScore >= 25) return NARRATIVE_TEMPLATES.weekly.mixed(dog)
  else                      return NARRATIVE_TEMPLATES.weekly.challenging(dog)
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE INTELLIGENCE SNAPSHOT
// The primary export. Called once per session, result cached.
// Returns a unified intelligence object consumed by every component.
// ─────────────────────────────────────────────────────────────────────────────

export function generateCoreIntelligence(dogProfile, clientProfile, enrolledCourses = [], courseProgress = {}) {
  const memory         = loadAIMemory()
  const wellnessData   = loadWellnessData()
  const wellnessSummary = getWellnessSummary(wellnessData.log || [])
  // emotional history loaded from state
  const streak         = loadStreak()

  // ── Behaviour scoring ──────────────────────────────────────
  const behaviourScores = dogProfile ? scoreBehaviour(dogProfile) : null

  // ── Emotional state — Emotional Continuity Model ──────────
  let emotionalState = deriveEmotionalState(behaviourScores, wellnessData.moodLog || [])
  // Override with OPTIMISING when conditions are met — the peak transformation state
  if (deriveOptimising(behaviourScores, completedLessons, streak.current || 0)) {
    emotionalState = EMOTIONAL_STATES.OPTIMISING
  }

  // ── Completed lesson count ─────────────────────────────────
  const completedLessons = Object.values(courseProgress)
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)

  // ── Archetype + tier ──────────────────────────────────────
  const archetype = getArchetype(behaviourScores, dogProfile)
  const tier      = getClientTier(completedLessons)
  const intScores = computeIntelligenceScores(behaviourScores, completedLessons, streak)

  // ── Recommendations ────────────────────────────────────────
  const recommendedCourses = behaviourScores
    ? recommendCourses(behaviourScores, dogProfile, enrolledCourses)
    : []

  // ── Narrative layer ────────────────────────────────────────
  const dogName   = dogProfile?.name || 'your companion'
  const firstName = (clientProfile?.name || '').split(' ')[0] || 'there'

  const greeting    = purifyText(getDynamicGreeting(clientProfile?.name, dogName, memory.sessionCount || 0))
  const coaching    = purifyText(getConciergeCoachingSummary(clientProfile?.name, dogName, behaviourScores, dogProfile?.age, completedLessons))
  const narratives  = generateBehaviouralNarrative(dogName, behaviourScores, emotionalState, memory.sessionCount || 0)
  const dailyInsight = NARRATIVE_TEMPLATES.insight[(memory.sessionCount || 0) % NARRATIVE_TEMPLATES.insight.length](dogName)

  // ── Alerts ─────────────────────────────────────────────────
  const alerts  = generatePredictiveAlerts(behaviourScores, dogProfile, streak, completedLessons)

  // ── Achievements ───────────────────────────────────────────
  const achievements = computeEarnedAchievements({
    completedLessons,
    streak:           streak.current || 0,
    completedCourses: 0,
    confidenceScore:  intScores?.confidence || 0,
    anxietyScore:     behaviourScores?.individual?.anxiety || 0,
    stabilityScore:   intScores?.stability || 0,
    socialScore:      intScores?.social || 0,
  })

  // ── Weekly narrative ───────────────────────────────────────
  const weekScore = intScores ? Math.round(Object.values(intScores).reduce((a, v) => a + v, 0) / Object.values(intScores).length) : 50
  const weeklyNarrative = generateWeeklyNarrative(dogName, weekScore)

  // ── Assemble core snapshot ─────────────────────────────────
  const core = {
    // Identity
    dogName,
    firstName,
    dogProfile,
    clientProfile,

    // Intelligence
    behaviourScores,
    emotionalState,
    archetype,
    tier,
    intScores,
    wellnessSummary,
    streak,

    // Narratives
    greeting,
    coaching,
    narratives,
    dailyInsight,
    weeklyNarrative,
    alerts,
    achievements,

    // Recommendations
    recommendedCourses,
    completedLessons,

    // Meta
    generatedAt:  new Date().toISOString(),
    sessionCount: memory.sessionCount || 0,
  }

  // Persist lightweight snapshot for continuity
  try {
    localStorage.setItem(CORE_KEY, JSON.stringify({
      ...core,
      dogProfile:    undefined,  // don't duplicate large objects
      clientProfile: undefined,
      _savedAt:      new Date().toISOString(),
    }))
  } catch {}

  return core
}

// ─────────────────────────────────────────────────────────────────────────────
// LOAD CACHED CORE (instant, no recalculation)
// ─────────────────────────────────────────────────────────────────────────────

export function loadCachedCore() {
  try {
    const raw = localStorage.getItem(CORE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

// ─────────────────────────────────────────────────────────────────────────────
// NARRATIVE STATE — tracks which insights have been shown
// ─────────────────────────────────────────────────────────────────────────────

export function loadNarrativeState() {
  try { return JSON.parse(localStorage.getItem(NARRATIVE_KEY) || '{}') }
  catch { return {} }
}

export function saveNarrativeState(state) {
  try { localStorage.setItem(NARRATIVE_KEY, JSON.stringify(state)) }
  catch {}
}

export function markNarrativeSeen(id) {
  const state = loadNarrativeState()
  state[id] = new Date().toISOString()
  saveNarrativeState(state)
}

export function hasNarrativeBeenSeen(id) {
  const state = loadNarrativeState()
  return !!state[id]
}

// ─────────────────────────────────────────────────────────────────────────────
// SOUND PREFERENCES
// ─────────────────────────────────────────────────────────────────────────────

export function loadSoundPrefs() {
  try { return JSON.parse(localStorage.getItem(SOUND_KEY) || '{"enabled":true,"volume":0.4}') }
  catch { return { enabled: true, volume: 0.4 } }
}

export function saveSoundPrefs(prefs) {
  try { localStorage.setItem(SOUND_KEY, JSON.stringify(prefs)) }
  catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// LUXURY SOUND ENGINE
// Generates elegant tones entirely in the Web Audio API — no file dependencies.
// Sounds are subtle, premium, non-intrusive. All run client-side, offline.
// ─────────────────────────────────────────────────────────────────────────────

let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)() }
    catch { return null }
  }
  return audioCtx
}

function playTone(config) {
  const prefs = loadSoundPrefs()
  if (!prefs.enabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  const { frequency = 440, type = 'sine', duration = 0.3, volume = 0.15, attack = 0.01, decay = 0.1, delay = 0 } = config

  try {
    const oscillator = ctx.createOscillator()
    const gainNode   = ctx.createGain()
    const masterGain = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(masterGain)
    masterGain.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    oscillator.type = type

    const startTime = ctx.currentTime + delay
    const vol = volume * (prefs.volume ?? 0.4)
    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(vol, startTime + attack)
    gainNode.gain.linearRampToValueAtTime(vol * 0.6, startTime + attack + decay)
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration)
    masterGain.gain.setValueAtTime(0.8, startTime)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration + 0.05)
  } catch {}
}

export const SOUNDS = {
  // Elegant activation chime — three ascending notes
  activation: () => {
    playTone({ frequency: 523, type: 'sine', duration: 0.5, volume: 0.12, attack: 0.02, decay: 0.2, delay: 0 })
    playTone({ frequency: 659, type: 'sine', duration: 0.5, volume: 0.10, attack: 0.02, decay: 0.2, delay: 0.15 })
    playTone({ frequency: 784, type: 'sine', duration: 0.7, volume: 0.09, attack: 0.03, decay: 0.3, delay: 0.30 })
  },

  // Soft lesson complete — warm bell
  complete: () => {
    playTone({ frequency: 880, type: 'sine', duration: 0.8, volume: 0.10, attack: 0.01, decay: 0.4, delay: 0 })
    playTone({ frequency: 1108, type: 'sine', duration: 0.6, volume: 0.07, attack: 0.01, decay: 0.3, delay: 0.1 })
  },

  // Achievement reveal — cinematic ascending
  achievement: () => {
    [0, 0.12, 0.25, 0.4].forEach((d, i) => {
      const freqs = [440, 554, 659, 880]
      playTone({ frequency: freqs[i], type: 'sine', duration: 0.6, volume: 0.08, attack: 0.02, decay: 0.25, delay: d })
    })
  },

  // Navigation tap — subtle click
  tap: () => {
    playTone({ frequency: 1200, type: 'sine', duration: 0.08, volume: 0.06, attack: 0.001, decay: 0.04, delay: 0 })
  },

  // Notification — soft dual tone
  notification: () => {
    playTone({ frequency: 698, type: 'sine', duration: 0.3, volume: 0.09, attack: 0.01, decay: 0.15, delay: 0 })
    playTone({ frequency: 880, type: 'sine', duration: 0.3, volume: 0.07, attack: 0.01, decay: 0.15, delay: 0.12 })
  },

  // Unlock ceremony — deep resonant chime
  unlock: () => {
    playTone({ frequency: 440, type: 'sine', duration: 1.2, volume: 0.08, attack: 0.05, decay: 0.6, delay: 0 })
    playTone({ frequency: 880, type: 'sine', duration: 0.9, volume: 0.06, attack: 0.03, decay: 0.5, delay: 0.2 })
    playTone({ frequency: 1320, type: 'sine', duration: 0.6, volume: 0.05, attack: 0.02, decay: 0.3, delay: 0.45 })
  },

  // Error — gentle low descend
  error: () => {
    playTone({ frequency: 330, type: 'sine', duration: 0.4, volume: 0.08, attack: 0.01, decay: 0.2, delay: 0 })
    playTone({ frequency: 262, type: 'sine', duration: 0.4, volume: 0.06, attack: 0.01, decay: 0.2, delay: 0.15 })
  },

  // Page transition — barely audible whoosh
  transition: () => {
    playTone({ frequency: 600, type: 'sine', duration: 0.25, volume: 0.04, attack: 0.02, decay: 0.15, delay: 0 })
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVING PLATFORM — time & context awareness
// ─────────────────────────────────────────────────────────────────────────────

export function getTimeContext() {
  const hour = new Date().getHours()
  const day  = new Date().getDay()
  const month = new Date().getMonth()

  let period, ambience, trainingAdvice
  if (hour >= 5 && hour < 9) {
    period = 'early_morning'
    ambience = 'The academy is quiet. An ideal environment for focused work.'
    trainingAdvice = 'Morning sessions capitalise on peak cortisol — ideal for introducing new behaviours.'
  } else if (hour >= 9 && hour < 12) {
    period = 'morning'
    ambience = 'Morning light. Optimal conditions for your session.'
    trainingAdvice = 'Mid-morning is ideal for structured training sessions requiring focus and retention.'
  } else if (hour >= 12 && hour < 14) {
    period = 'midday'
    ambience = 'A calmer midday moment.'
    trainingAdvice = 'Midday sessions benefit from shorter, more varied exercises to maintain engagement.'
  } else if (hour >= 14 && hour < 17) {
    period = 'afternoon'
    ambience = 'The afternoon session. Your companion is warmed up from the day.'
    trainingAdvice = 'Afternoon is optimal for reinforcing morning learning through varied practice.'
  } else if (hour >= 17 && hour < 20) {
    period = 'evening'
    ambience = 'The evening brings natural decompression.'
    trainingAdvice = 'Evening sessions are best kept calm and positive — consolidation over new learning.'
  } else {
    period = 'night'
    ambience = 'A quiet night session. Keep energy low and rewarding.'
    trainingAdvice = 'Night sessions should be brief and calming. Wind-down enrichment is ideal at this hour.'
  }

  const isWeekend = day === 0 || day === 6
  const season = month <= 1 || month === 11 ? 'winter' : month <= 4 ? 'spring' : month <= 7 ? 'summer' : 'autumn'

  return { hour, period, ambience, trainingAdvice, isWeekend, season, day }
}

export function getTimeAwareGreeting(firstName, dogName, sessionCount = 0) {
  const ctx  = getTimeContext()
  const dog  = dogName || 'your companion'
  const name = firstName || 'there'
  const { period } = ctx

  const greetings = {
    early_morning: [
      `Good morning, ${name}. ${dog} is alert and ready — early sessions build exceptional foundations.`,
      `A quiet morning, ${name}. This is ${dog}'s peak focus window. Make it count.`,
    ],
    morning: [
      `Good morning, ${name}. ${dog}'s morning session is ready.`,
      `Morning, ${name}. ${dog} is primed for today's work.`,
      `A new morning brings new opportunity for ${dog}, ${name}.`,
    ],
    midday: [
      `Good afternoon, ${name}. How is ${dog} presenting today?`,
      `${name}, ${dog} is ready for this afternoon's session.`,
    ],
    afternoon: [
      `Good afternoon, ${name}. ${dog}'s afternoon session is prepared.`,
      `${name}, this afternoon is ideal for reinforcing ${dog}'s recent gains.`,
    ],
    evening: [
      `Good evening, ${name}. A calm close to the day benefits ${dog} immensely.`,
      `Evening, ${name}. ${dog}'s decompression session is a valuable close to any day.`,
    ],
    night: [
      `Good evening, ${name}. A gentle session is the perfect close for ${dog} today.`,
    ],
  }

  const pool = greetings[period] || greetings.morning
  return pool[sessionCount % pool.length]
}

// ─────────────────────────────────────────────────────────────────────────────
// INTELLIGENCE HOOK HELPER — creates unified intelligence snapshot hook data
// Used by useIntelligenceCore hook
// ─────────────────────────────────────────────────────────────────────────────

export function buildIntelligenceSnapshot(dogProfile, clientProfile, enrolledCourses, courseProgress) {
  if (!dogProfile) return null
  return generateCoreIntelligence(dogProfile, clientProfile, enrolledCourses, courseProgress)
}
