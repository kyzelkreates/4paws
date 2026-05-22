// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — NARRATIVE VOICE ENGINE
// The single unified voice of the platform. Every output passes through here.
//
// ODIN DOCTRINE: Noiseless. Observational. Never absolute. Never verbose.
// One insight. One action. One observation. Nothing more.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// THE THREE-SURFACE MODEL
// Everything the user sees collapses into these three outputs:
//
//   1. insight    — what is happening with this dog right now
//   2. action     — the single most useful thing to do today
//   3. observation — a quiet behavioural note (optional, shown when earned)
//
// No other primary outputs. No dashboards. No lists. No analytics panels.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE RULES — enforced globally
// These replace any absolute, mechanical, or dashboard-sounding language.
// ─────────────────────────────────────────────────────────────────────────────
const LANGUAGE_REPLACEMENTS = [
  { from: /\bBella is improving\b/gi,         to: 'Bella is showing patterns consistent with gradual improvement' },
  { from: /\bis improving\b/gi,               to: 'is showing patterns consistent with improvement' },
  { from: /\bbehaviour fixed\b/gi,            to: 'behaviour appears to be stabilising' },
  { from: /\bperfect recovery\b/gi,           to: 'strong recovery indicators are present' },
  { from: /\bfully recovered\b/gi,            to: 'showing strong recovery markers' },
  { from: /\bexcellent progress\b/gi,         to: 'consistent progress patterns are emerging' },
  { from: /\bgreat improvement\b/gi,          to: 'meaningful improvement indicators are present' },
  { from: /\bAI says\b/gi,                    to: '' },
  { from: /\bAI engine\b/gi,                  to: '' },
  { from: /\bML model\b/gi,                   to: '' },
  { from: /\bIntelligence Core\b/g,           to: '' },
  { from: /\bsystem says\b/gi,                to: '' },
  { from: /Intelligence Core · /gi,           to: '' },
  { from: /\bdata shows\b/gi,                 to: 'observations suggest' },
  { from: /\banalysis indicates\b/gi,         to: 'patterns suggest' },
  { from: /\bmetrics confirm\b/gi,            to: 'observations are consistent with' },
  { from: /\bscore of \d+%/gi,                to: (m) => m }, // keep scores but they're secondary
  { from: /\bwellbeing index\b/gi,            to: 'wellbeing' },
  { from: /\btracking\b/gi,                   to: 'observing' },
]

// Apply language rules to any string
export function purifyText(text) {
  if (!text || typeof text !== 'string') return text
  let result = text
  LANGUAGE_REPLACEMENTS.forEach(({ from, to }) => {
    result = result.replace(from, to)
  })
  // Clean up double spaces from empty replacements
  result = result.replace(/\s{2,}/g, ' ').trim()
  // Remove leading dash if text started with the removed label
  result = result.replace(/^[·\-—]\s*/, '')
  return result
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SURFACE OUTPUT GENERATOR
// Takes all intelligence and collapses it to three clean surfaces.
// This is the ONLY function the dashboard should call for narrative content.
// ─────────────────────────────────────────────────────────────────────────────
export function buildSingleSurface(core, behaviourScores, emotionalState, streak, dogName) {
  const dog  = dogName || core?.dogName || 'your companion'
  const ind  = behaviourScores?.individual || {}
  const es   = emotionalState
  const ses  = core?.sessionCount || 0

  // ── 1. PRIMARY INSIGHT ────────────────────────────────────
  // One observational statement. Never a data summary.
  const insight = buildPrimaryInsight(dog, ind, es, streak, ses)

  // ── 2. RECOMMENDED ACTION ─────────────────────────────────
  // The single most relevant thing to do today. Period.
  const action = buildRecommendedAction(dog, ind, es)

  // ── 3. EMOTIONAL OBSERVATION ──────────────────────────────
  // Optional. Only shown when emotionalState is known and non-trivial.
  const observation = buildEmotionalObservation(dog, es, ind)

  return {
    insight:     purifyText(insight),
    action:      purifyText(action),
    observation: es && es.id !== 'uncertain' ? purifyText(observation) : null,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INSIGHT POOL — observational, never absolute
// ─────────────────────────────────────────────────────────────────────────────
const INSIGHT_POOL = {
  high_anxiety: [
    (d) => `${d} is showing patterns consistent with elevated emotional arousal. The priority today is decompression, not training.`,
    (d) => `${d}'s current emotional state suggests the nervous system is under load. Recovery work takes precedence.`,
    (d) => `Anxiety indicators are present in ${d}'s profile today. The most productive session right now is a calm, undemanding one.`,
  ],
  high_reactivity: [
    (d) => `${d} is showing elevated reactivity indicators. Threshold management is the focus — distance remains the primary tool.`,
    (d) => `Reactivity patterns are apparent in ${d}'s recent profile. Controlled distance work will yield the most sustainable progress.`,
    (d) => `${d} appears to be navigating an elevated arousal phase. Structured calm exposure at comfortable distances is the recommended approach.`,
  ],
  low_confidence: [
    (d) => `${d}'s confidence architecture is still developing. Each small environmental success contributes permanently to the foundation.`,
    (d) => `Confidence building is the primary focus for ${d} right now. Patient, pressure-free exposure will produce lasting change.`,
    (d) => `${d} is in an active confidence development phase. Novel, achievable challenges are the most effective tool available.`,
  ],
  stable: [
    (d) => `${d} is showing stable behavioural recovery patterns. This consistency is the foundation of lasting transformation.`,
    (d) => `${d}'s emotional baseline appears steady today. This is the optimal state for deepening established behaviours.`,
    (d) => `${d}'s profile suggests a settled emotional state. Conditions are well-suited for the next stage of the programme.`,
  ],
  progressing: [
    (d) => `${d} is demonstrating patterns consistent with positive behavioural progression. The trajectory is encouraging.`,
    (d) => `Gradual but consistent improvement indicators are present in ${d}'s recent profile. The work is compounding.`,
    (d) => `${d}'s behavioural data shows patterns associated with deepening emotional regulation. Progress is occurring precisely as expected.`,
  ],
  early_days: [
    (d) => `${d}'s programme is in its early foundation stage. The work being done now shapes everything that follows.`,
    (d) => `${d}'s transformation has begun. The first weeks establish the neurological patterns that will define the entire journey.`,
    (d) => `${d} is building the emotional infrastructure on which all future behaviour will rest. This stage deserves the most patience.`,
  ],
}

function buildPrimaryInsight(dog, ind, es, streak, sessionCount) {
  const anxiety    = ind.anxiety    || 50
  const reactivity = ind.reactivity || 50
  const confidence = 100 - (ind.confidence || 50) // higher = more confident
  const lessons    = sessionCount

  let pool
  if (anxiety > 65)        pool = INSIGHT_POOL.high_anxiety
  else if (reactivity > 65) pool = INSIGHT_POOL.high_reactivity
  else if (confidence < 40) pool = INSIGHT_POOL.low_confidence
  else if (lessons < 3)     pool = INSIGHT_POOL.early_days
  else if (streak?.current > 5 || confidence > 65) pool = INSIGHT_POOL.progressing
  else                      pool = INSIGHT_POOL.stable

  const idx = lessons % pool.length
  return pool[idx](dog)
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION POOL — single, specific, actionable
// ─────────────────────────────────────────────────────────────────────────────
const ACTION_POOL = {
  high_anxiety: [
    (d) => `Offer ${d} a lickimat or scatter feed in a quiet environment. No training demands today.`,
    (d) => `A calm, unstructured sniff walk is the most valuable activity for ${d} right now.`,
    (d) => `Sit quietly with ${d} for 10 minutes — no commands, no expectations. Calm presence is the intervention.`,
  ],
  high_reactivity: [
    (d) => `Practice one engagement check-in with ${d} at a comfortable distance from a known trigger.`,
    (d) => `Take ${d} on a parallel walk at 10+ metres from any potential triggers. Loose lead, calm pace.`,
    (d) => `Dedicate today's session to threshold mapping — observe where ${d} notices triggers without reacting.`,
  ],
  low_confidence: [
    (d) => `Introduce one novel object for ${d} to investigate on their own terms — no pressure, no guidance.`,
    (d) => `Offer ${d} a fork in the path on today's walk. Allow them to choose the direction.`,
    (d) => `Ask for one behaviour ${d} knows perfectly, in a familiar space. A guaranteed win is the goal.`,
  ],
  stable: [
    (d) => `Continue today's session with the current approach — consistency at this stage is the most powerful tool.`,
    (d) => `Practise one established behaviour in a new location to begin generalisation.`,
    (d) => `Review the next lesson in ${d}'s programme when you're both settled and unhurried.`,
  ],
  morning: [
    (d) => `Start the day with a 15-minute sniff walk for ${d} before any formal engagement.`,
    (d) => `Scatter ${d}'s breakfast across a snuffle mat. A calm, engaged morning sets the tone for the day.`,
  ],
  evening: [
    (d) => `A lickimat session this evening will support ${d}'s overnight neurological consolidation.`,
    (d) => `Allow ${d} to decompress quietly this evening — calm observation, no demands.`,
  ],
}

function buildRecommendedAction(dog, ind, es) {
  const anxiety    = ind.anxiety    || 50
  const reactivity = ind.reactivity || 50
  const confidence = 100 - (ind.confidence || 50)
  const hour       = new Date().getHours()

  let pool
  if (anxiety > 65)         pool = ACTION_POOL.high_anxiety
  else if (reactivity > 65) pool = ACTION_POOL.high_reactivity
  else if (confidence < 40) pool = ACTION_POOL.low_confidence
  else if (hour < 10)       pool = ACTION_POOL.morning
  else if (hour >= 18)      pool = ACTION_POOL.evening
  else                      pool = ACTION_POOL.stable

  const idx = Math.floor(Date.now() / 86400000) % pool.length
  return pool[idx](dog)
}

// ─────────────────────────────────────────────────────────────────────────────
// OBSERVATION POOL — quiet, non-obvious, earned
// ─────────────────────────────────────────────────────────────────────────────
const OBSERVATION_POOL = {
  serene:    (d) => `${d}'s resting posture and environmental ease suggest genuine composure — not suppression.`,
  settled:   (d) => `${d}'s response to familiar environments appears notably more relaxed than in earlier sessions.`,
  alert:     (d) => `${d}'s heightened alertness today may reflect environmental novelty rather than stress. Observe the recovery.`,
  aroused:   (d) => `${d}'s elevated state today is temporary. The recovery quality will be the most informative data point.`,
  anxious:   (d) => `${d}'s anxiety signals today deserve patient acknowledgement — not correction. Simply be present.`,
  reactive:  (d) => `${d}'s threshold was reached today. Note what preceded it. That information shapes tomorrow's plan.`,
  recovering:(d) => `${d} is in recovery. The speed of return to calm baseline is the progress marker worth watching.`,
  uncertain: (d) => null,
}

function buildEmotionalObservation(dog, es) {
  if (!es || es.id === 'uncertain') return null
  const fn = OBSERVATION_POOL[es.id]
  return fn ? fn(dog) : null
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOULD-SHOW FILTER
// Every output passes this gate before rendering.
// "Does the user need this right now to act or understand their dog?"
// ─────────────────────────────────────────────────────────────────────────────
export function shouldShow(element, context = {}) {
  const { hasEnrolledCourses, hasOnboarded, isFirstSession, dogProfile } = context

  switch (element) {
    // Never show raw score numbers as primary content
    case 'raw_scores':         return false
    // Never show system labels
    case 'ai_system_label':    return false
    case 'engine_label':       return false
    // Only show analytics when user has history
    case 'behaviour_heatmap':  return hasOnboarded && !isFirstSession
    case 'digital_twin':       return hasOnboarded && !isFirstSession
    case 'weekly_report':      return hasOnboarded && !isFirstSession
    // Only show courses when enrolled
    case 'course_progress':    return hasEnrolledCourses
    // Only show achievements when earned
    case 'achievement_display':return true // filtered at render time by earned status
    // Intelligence profile sidebar — only when dog profile exists
    case 'intelligence_profile': return !!dogProfile
    // Stats grid — always but limit to 2 most relevant
    case 'stats_grid':         return true
    default:                   return true
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MOTION DOCTRINE
// Centralised easing and duration values. Applied globally.
// Luxury = slower, softer curves. Not faster, not bouncier.
// ─────────────────────────────────────────────────────────────────────────────
export const MOTION = {
  // Primary transitions — page reveals, card entrances
  enter: {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1],      // gentle ease-out cubic
  },
  // Secondary transitions — expanding panels, accordion
  expand: {
    duration: 0.40,
    ease: [0.22, 1, 0.36, 1],
  },
  // Micro-interactions — taps, hovers
  micro: {
    duration: 0.20,
    ease: [0.22, 1, 0.36, 1],
  },
  // Ambient — breathing, pulsing, living motion
  ambient: {
    duration: 4.0,
    ease: 'easeInOut',
    repeat: Infinity,
  },
  // Exit transitions
  exit: {
    duration: 0.25,
    ease: [0.22, 1, 0.36, 1],
  },
  // Stagger between sibling elements — generous spacing
  stagger: 0.08,

  // Hover state
  hover: { y: -2, transition: { duration: 0.20 } },
  tap:   { scale: 0.97, transition: { duration: 0.12 } },
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION FILTER
// Eliminates noise from the notification system.
// Only critical or highly relevant notifications pass through.
// ─────────────────────────────────────────────────────────────────────────────
export function filterNotification(notification) {
  if (!notification) return null

  // These are always suppressed — they add noise without value
  const SUPPRESSED_TYPES = [
    'data_sync', 'cache_update', 'system_ready', 'intelligence_loaded',
    'profile_saved', 'auto_save', 'session_started',
  ]
  if (SUPPRESSED_TYPES.includes(notification.type)) return null

  // Emergency and achievement always pass
  if (['emergency', 'achievement', 'milestone'].includes(notification.type)) return notification

  // Reduce priority — never show more than one non-critical notification at a time
  if (notification.priority === 'low') return null

  return notification
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN INSIGHT VOICE
// The same unified voice, applied to operations centre outputs.
// ─────────────────────────────────────────────────────────────────────────────
export function buildAdminInsight(clientName, dogName, alertType, daysSince) {
  const dog = dogName || 'their dog'
  const name = clientName || 'This client'

  const map = {
    engagement_drop: `${name} has not engaged for ${daysSince} days. A personal check-in is the most appropriate response — not an automated message.`,
    engagement_warning: `${name}'s engagement has reduced over the past ${daysSince} days. Monitoring their next session is recommended.`,
    activation_pending: `${name}'s academy access remains pending. A brief, warm outreach message often resolves this within hours.`,
    no_start: `${name} has academy access but has not yet begun their programme. A concierge welcome message may be all that's needed.`,
    behaviour_regression: `${dog} appears to be showing regression patterns. A programme review consultation may be warranted.`,
    wellness_decline: `${dog}'s wellness indicators have shifted. A check-in with ${name} about recent changes at home is recommended.`,
  }

  return purifyText(map[alertType] || `${name} may benefit from a concierge check-in.`)
}
