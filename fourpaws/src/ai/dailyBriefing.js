// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — AI DAILY BRIEFING SYSTEM
// Generates a single, elegant intelligence briefing per day.
// Fully offline. Stored locally. Regenerates if the day changes.
// Voice-ready. Concierge tone throughout.
// ─────────────────────────────────────────────────────────────────────────────

import { loadAIMemory } from './aiMemory'
import { loadWellnessData } from './wellness'
import { EMOTIONAL_STATES } from './emotionalEngine'
import { getTimeContext } from './intelligenceCore'

const BRIEFING_KEY   = 'fp_daily_briefing'
const NOTIF_KEY      = 'fp_scheduled_notifications'
const WEATHER_KEY    = 'fp_weather_cache'

// ─────────────────────────────────────────────────────────────────────────────
// TODAY'S FOCUS RECOMMENDATIONS
// One intelligent daily focus — simplifies decision-making.
// ─────────────────────────────────────────────────────────────────────────────
const FOCUS_LIBRARY = {
  high_anxiety: [
    { title: 'Decompression & Calm',      icon: '🌸', tag: 'Emotional Recovery',   desc: 'Prioritise low-stimulation enrichment today. Lickimats, snuffle mats, and calm lead walks will reduce cortisol and rebuild the emotional baseline.' },
    { title: 'Threshold Mapping',          icon: '🎯', tag: 'Behaviour Intelligence', desc: 'Today, observe where your dog begins to show stress indicators. Note the distance and environment. This data is invaluable.' },
    { title: 'Recovery Protocol',          icon: '💧', tag: 'Emotional First Aid',   desc: 'Implement a full decompression day. Minimise demands, maximise calm. Allow your dog to decompress at their own pace.' },
  ],
  high_reactivity: [
    { title: 'Distance Management',        icon: '🔭', tag: 'Threshold Work',        desc: 'Create space between your dog and triggers today. Distance is not avoidance — it is the training tool. Begin at a distance where your dog can observe calmly.' },
    { title: 'Engagement Practice',        icon: '🎯', tag: 'Focus Training',        desc: 'Practise engagement in a low-stimulation environment first. Build the check-in habit before adding environmental challenge.' },
    { title: 'Pattern Games',              icon: '🌿', tag: 'Behaviour Foundation',  desc: 'Introduce pattern games — hand touches, sit-watch sequences — to build predictability and reduce arousal during transitions.' },
  ],
  low_confidence: [
    { title: 'Confidence Building',        icon: '🦁', tag: 'Confidence Protocol',   desc: 'Choose one environment your dog finds mildly challenging. Sit quietly with them, apply no pressure, allow exploration on their terms.' },
    { title: 'Choice Architecture',        icon: '✨', tag: 'Empowerment Work',      desc: 'Offer your dog meaningful choices today — which toy, which direction on a walk, when to interact. Agency builds confidence at a neurological level.' },
    { title: 'Enrichment Exploration',     icon: '🌾', tag: 'Cognitive Enrichment',  desc: 'Novel enrichment activities build problem-solving confidence. Try a new puzzle, route, or scent game. Success in small challenges generalises.' },
  ],
  good_baseline: [
    { title: 'Precision Reinforcement',    icon: '🎓', tag: 'Skill Refinement',      desc: 'Your dog is in an optimal emotional state for precision work. Revisit an established behaviour and sharpen the criteria today.' },
    { title: 'Generalisation Session',     icon: '🗺️', tag: 'Proofing Work',        desc: 'Take a practised behaviour to a new environment. Generalisation is the bridge between training and real-world reliability.' },
    { title: 'Bond-Focused Play',          icon: '❤️', tag: 'Relationship Building',  desc: 'Today, prioritise play with no training agenda. Genuine, uninstructed play is one of the most powerful relationship builders available.' },
  ],
  morning_energy: [
    { title: 'Structured Morning Walk',    icon: '🌅', tag: 'Morning Protocol',      desc: 'A structured morning walk — calm lead, decompression sniffing — sets the emotional tone for the entire day. Do not rush this.' },
    { title: 'Sniff & Explore',            icon: '🌿', tag: 'Scent Enrichment',      desc: 'Allow a full 20 minutes of unrestricted sniffing on this morning\'s walk. Scent work provides mental fatigue equal to 3× the physical exercise.' },
  ],
  evening_wind: [
    { title: 'Evening Decompression',      icon: '🌙', tag: 'Evening Protocol',      desc: 'A calm lickimat and quiet presence this evening will prime deep sleep — the period of maximum neurological consolidation of today\'s learning.' },
    { title: 'Calm Massage & Connection',  icon: '💆', tag: 'Bonding & Recovery',    desc: 'TTouch massage or gentle grooming before sleep activates the parasympathetic system and deepens the emotional bond.' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY BRIEFING GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
export function generateDailyBriefing(dogProfile, behaviourScores, emotionalState, sessionCount = 0) {
  const dog   = dogProfile?.name || 'Your companion'
  const ind   = behaviourScores?.individual || {}
  const today = new Date().toDateString()
  const ctx   = getTimeContext()

  // ── Determine focus category ──────────────────────────────
  let focusPool = FOCUS_LIBRARY.good_baseline
  const anxiety    = ind.anxiety    || 50
  const reactivity = ind.reactivity || 50
  const confidence = ind.confidence || 50 // concern score — higher = less confident

  if (anxiety > 65)          focusPool = FOCUS_LIBRARY.high_anxiety
  else if (reactivity > 65)  focusPool = FOCUS_LIBRARY.high_reactivity
  else if (confidence > 65)  focusPool = FOCUS_LIBRARY.low_confidence
  else if (ctx.period === 'early_morning' || ctx.period === 'morning') focusPool = FOCUS_LIBRARY.morning_energy
  else if (ctx.period === 'evening' || ctx.period === 'night')          focusPool = FOCUS_LIBRARY.evening_wind

  const focusIdx  = sessionCount % focusPool.length
  const todaysFocus = focusPool[focusIdx]

  // ── Opening emotional observation ─────────────────────────
  const emotionalObs = buildEmotionalObservation(dog, emotionalState, ind)

  // ── Recovery insight ──────────────────────────────────────
  const recoveryInsight = buildRecoveryInsight(dog, ind, sessionCount)

  // ── Wellness recommendation ───────────────────────────────
  const wellness = loadWellnessData()
  const recentLog = (wellness.log || []).slice(0, 3)
  const avgRecovery = recentLog.length
    ? recentLog.reduce((a, e) => a + (e.recovery || 5), 0) / recentLog.length
    : 5
  const wellnessRec = buildWellnessRecommendation(dog, avgRecovery, ctx)

  // ── Confidence insight ────────────────────────────────────
  const confidenceInsight = buildConfidenceInsight(dog, ind)

  // ── Assemble briefing ─────────────────────────────────────
  const briefing = {
    date:         today,
    generatedAt:  new Date().toISOString(),
    period:       ctx.period,
    dogName:      dog,

    emotionalObservation: emotionalObs,
    recoveryInsight,
    wellnessRecommendation: wellnessRec,
    confidenceInsight,
    todaysFocus,
    ambience:     ctx.ambience,
    trainingAdvice: ctx.trainingAdvice,

    // Full narration string for voice
    narration: [emotionalObs, recoveryInsight, `Today's recommended focus: ${todaysFocus.title}. ${todaysFocus.desc}`].join(' '),
  }

  // ── Persist ───────────────────────────────────────────────
  localStorage.setItem(BRIEFING_KEY, JSON.stringify(briefing))
  return briefing
}

// ─────────────────────────────────────────────────────────────────────────────
// LOAD CACHED BRIEFING — returns today's briefing or null
// ─────────────────────────────────────────────────────────────────────────────
export function loadTodaysBriefing() {
  try {
    const raw = localStorage.getItem(BRIEFING_KEY)
    if (!raw) return null
    const b = JSON.parse(raw)
    if (b.date !== new Date().toDateString()) return null
    return b
  } catch { return null }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — concierge narrative builders
// ─────────────────────────────────────────────────────────────────────────────
function buildEmotionalObservation(dog, emotionalState, ind) {
  const state = emotionalState?.id || 'uncertain'
  const obs = {
    serene:     `${dog} appears deeply calm and emotionally balanced today — this is the optimal state for learning and bonding.`,
    settled:    `${dog} presents as emotionally settled and regulated. Today's session has an excellent foundation.`,
    alert:      `${dog} is in an engaged, alert state today. Manage the environment mindfully and capitalise on this focus window.`,
    aroused:    `${dog}'s arousal is somewhat elevated today. Begin with a decompression sequence before advancing to any structured work.`,
    anxious:    `${dog} appears emotionally elevated today. Prioritise calm enrichment over formal training — recovery is the priority.`,
    reactive:   `${dog} has shown heightened reactivity recently. Suspend formal training today and implement the full recovery protocol.`,
    recovering: `${dog} is in a post-arousal recovery phase. Allow quiet decompression before any interaction or training.`,
    uncertain:  `${dog}'s emotional profile is still developing. Continue logging to build a complete behavioural picture.`,
  }
  return obs[state] || obs.uncertain
}

function buildRecoveryInsight(dog, ind, sessionCount) {
  const anxiety = ind.anxiety || 50
  const insights = [
    `${dog}'s recovery consistency this week reflects the cumulative effect of structured calm work.`,
    `${dog} is demonstrating improved post-arousal recovery — a key indicator of neurological regulation progress.`,
    `The data suggests ${dog}'s emotional baseline is stabilising. Continued consistency will deepen this foundation.`,
    `${dog}'s recovery metrics remain within the positive range. The programme is working precisely as designed.`,
    `${dog} shows healthy emotional resilience indicators. Each session compounds the transformation.`,
  ]
  if (anxiety > 65) return `${dog} requires additional decompression support today. Recovery from elevated stress states benefits most from scent-based calm enrichment and reduced demands.`
  return insights[sessionCount % insights.length]
}

function buildWellnessRecommendation(dog, avgRecovery, ctx) {
  if (avgRecovery < 4)    return `${dog} may benefit from additional rest today. Reduce training demands and increase passive enrichment — lickimats, snuffle mats, and calm companionship.`
  if (ctx.period === 'evening' || ctx.period === 'night')
    return `A calm evening enrichment session — lickimat, gentle grooming, or quiet companionship — will prime ${dog} for deep overnight neurological consolidation.`
  if (ctx.period === 'morning' || ctx.period === 'early_morning')
    return `This morning presents an ideal window for ${dog}'s focused training session. Morning cortisol peaks support new learning acquisition.`
  return `${dog}'s wellness indicators are in a healthy range today. Balanced enrichment — physical, cognitive, and social — will support continued progress.`
}

function buildConfidenceInsight(dog, ind) {
  const conf = 100 - (ind.confidence || 50)
  if (conf > 70) return `${dog} is demonstrating strong environmental confidence — a genuine and lasting transformation marker.`
  if (conf > 50) return `${dog}'s confidence is developing steadily. Each positive experience in a previously challenging environment reshapes the neural associations.`
  if (conf > 30) return `${dog}'s confidence journey is underway. Patient, pressure-free exposure to mild challenges will accelerate this development.`
  return `Building ${dog}'s confidence is the priority focus right now. Choose environments and interactions where success is guaranteed.`
}

// ─────────────────────────────────────────────────────────────────────────────
// SMART OFFLINE NOTIFICATIONS
// Generates behavioural reminders with concierge language.
// Stored locally — no push API dependency.
// ─────────────────────────────────────────────────────────────────────────────
const NOTIFICATION_BANK = {
  morning_enrichment: (dog) => `${dog} may benefit from morning sniff enrichment before the day begins — 15 minutes of unrestricted sniffing sets a calm emotional tone.`,
  midday_check:       (dog) => `A brief wellness check for ${dog} this afternoon — notice their resting posture, appetite, and overall energy presentation.`,
  evening_calm:       (dog) => `This evening is ideal for ${dog}'s decompression session. A calm lickimat or quiet companionship supports overnight recovery.`,
  training_reminder:  (dog) => `${dog}'s training programme is ready when you are. Even 5 minutes of focused, positive work today compounds beautifully.`,
  enrichment_prompt:  (dog) => `${dog} may benefit from cognitive enrichment today — puzzle feeding, scent games, or a novel environment to explore.`,
  calmness_session:   (dog) => `A structured calmness session with ${dog} today would support their emotional regulation development.`,
  recovery_check:     (dog) => `${dog}'s recent activity suggests a gentler day may be beneficial. Consider a calm sniff walk and reduced demands today.`,
}

export function getScheduledNotifications(dogName, behaviourScores) {
  const dog  = dogName || 'your companion'
  const ind  = behaviourScores?.individual || {}
  const hour = new Date().getHours()
  const notifs = []

  if (hour >= 6 && hour < 9)   notifs.push({ id: 'morning', message: NOTIFICATION_BANK.morning_enrichment(dog), priority: 'high' })
  if (hour >= 12 && hour < 14) notifs.push({ id: 'midday',  message: NOTIFICATION_BANK.midday_check(dog),      priority: 'low'  })
  if (hour >= 17 && hour < 20) notifs.push({ id: 'evening', message: NOTIFICATION_BANK.evening_calm(dog),      priority: 'high' })

  if ((ind.anxiety || 0) > 60)
    notifs.push({ id: 'recovery', message: NOTIFICATION_BANK.recovery_check(dog), priority: 'high' })
  if ((ind.confidence || 100) > 60)
    notifs.push({ id: 'enrichment', message: NOTIFICATION_BANK.enrichment_prompt(dog), priority: 'medium' })

  return notifs
}

// ─────────────────────────────────────────────────────────────────────────────
// BEHAVIOUR INSIGHTS FEED
// Living intelligence feed — rotates observations on each call.
// ─────────────────────────────────────────────────────────────────────────────
const INSIGHT_TEMPLATES = [
  (d, ind) => ind.anxiety < 35
    ? `${d}'s anxiety metrics remain consistently low — a reflection of sustained emotional stability work.`
    : `${d}'s emotional regulation is developing. Each calm session strengthens the regulatory neural pathways.`,

  (d, ind) => ind.reactivity < 35
    ? `${d}'s threshold resilience has significantly improved. The reactive recovery pathway is well established.`
    : `Threshold management remains ${d}'s primary focus area. Distance and calm exposure are the core tools.`,

  (d, ind) => (100 - (ind.confidence || 50)) > 65
    ? `${d} is demonstrating genuine environmental confidence — not suppression, but authentic emotional ease.`
    : `${d}'s confidence is building incrementally. The trajectory is positive and the foundation is solid.`,

  (d, ind) => `${d}'s socialisation profile indicates ${(ind.socialisation || 5) > 6 ? 'strong social adaptability — a real asset in complex environments.' : 'continued benefit from structured, positive social exposure at comfortable distances.'}`,

  (d, ind) => `Pattern consistency in ${d}'s training sessions is the single greatest predictor of transformation speed.`,

  (d, ind) => `${d}'s emotional recovery capacity is the metric that most directly reflects the quality of the programme being implemented.`,

  (d, ind) => `The neurological foundation being built in ${d} right now will express itself as effortless composure within the coming months.`,

  (d, ind) => `${d}'s learning window is most open within 2 hours of waking — morning sessions produce the highest retention rates.`,

  (d, ind) => `Calm is not merely an absence of reactivity in ${d}. It is an active neurological state being deliberately cultivated through this programme.`,

  (d, ind) => `Environmental confidence in ${d} grows through micro-exposures — brief, successful encounters that accumulate into permanent neural associations.`,
]

export function getBehaviourInsightsFeed(dogName, behaviourScores, count = 5) {
  const dog = dogName || 'Your companion'
  const ind = behaviourScores?.individual || {}
  const memory = loadAIMemory()
  const base   = memory.sessionCount || 0

  return Array.from({ length: count }, (_, i) => {
    const fn = INSIGHT_TEMPLATES[(base + i) % INSIGHT_TEMPLATES.length]
    return {
      id:   `insight_${i}`,
      text: fn(dog, ind),
      timestamp: new Date(Date.now() - i * 2.3 * 60 * 60 * 1000).toISOString(),
    }
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// WEATHER-AWARE INTELLIGENCE
// Reads cached weather data or falls back gracefully.
// ─────────────────────────────────────────────────────────────────────────────
export function loadWeatherCache() {
  try { return JSON.parse(localStorage.getItem(WEATHER_KEY) || 'null') }
  catch { return null }
}

export function saveWeatherCache(data) {
  try { localStorage.setItem(WEATHER_KEY, JSON.stringify({ ...data, cachedAt: new Date().toISOString() })) }
  catch {}
}

export function getWeatherAwareSuggestion(dogName, behaviourScores) {
  const dog     = dogName || 'your companion'
  const weather = loadWeatherCache()
  const ind     = behaviourScores?.individual || {}

  if (!weather) {
    return {
      available: false,
      suggestion: `${dog}'s enrichment plan is prepared for today. Check the weather and choose between the outdoor and indoor protocols based on conditions.`,
    }
  }

  const condition = (weather.condition || '').toLowerCase()
  const temp      = weather.temp || 18

  if (condition.includes('storm') || condition.includes('thunder')) {
    return {
      available: true, icon: '⛈️', condition: 'Storm',
      suggestion: `Storms can elevate ${dog}'s anxiety. Stay indoors with passive enrichment — lickimats and snuffle mats. White noise can help buffer the sound.`,
      priority: 'high',
    }
  }
  if (condition.includes('rain')) {
    return {
      available: true, icon: '🌧️', condition: 'Rain',
      suggestion: `An indoor enrichment day for ${dog} — cognitive games, scatter feeding, and calm connection are ideal alternatives to outdoor walks.`,
      priority: 'medium',
    }
  }
  if (temp > 27) {
    return {
      available: true, icon: '☀️', condition: 'Hot',
      suggestion: `With temperatures elevated today, limit ${dog}'s physical exertion to early morning or late evening. Frozen enrichment treats and shaded rest are the priority.`,
      priority: 'high',
    }
  }
  if (temp < 4) {
    return {
      available: true, icon: '❄️', condition: 'Cold',
      suggestion: `Cold conditions can affect ${dog}'s muscle warm-up time. Begin any outdoor activity with a slow 5-minute acclimatisation walk before engaging in structured exercise.`,
      priority: 'low',
    }
  }

  return {
    available: true, icon: '✨', condition: weather.condition,
    suggestion: `Conditions are well-suited for ${dog}'s outdoor enrichment today. The environment is receptive for productive threshold and confidence work.`,
    priority: 'low',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AI STABILITY MONITORING
// Quietly monitors for regression patterns. Non-invasive.
// ─────────────────────────────────────────────────────────────────────────────
export function runStabilityMonitor(dogProfile, behaviourScores, courseProgress, streak) {
  const ind      = behaviourScores?.individual || {}
  const concerns = []

  const completedLessons = Object.values(courseProgress || {})
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)

  if (streak?.current === 0 && streak?.longest > 3) {
    concerns.push({
      type: 'streak_break', priority: 'medium',
      message: `${dogProfile?.name || 'Your companion'}'s training consistency has paused. A single session today restores the momentum that drives transformation.`,
    })
  }
  if ((ind.anxiety || 0) > 75) {
    concerns.push({
      type: 'elevated_anxiety', priority: 'high',
      message: `Elevated anxiety indicators are present. A full decompression day, combined with passive calm enrichment, is the recommended protocol.`,
    })
  }
  if ((ind.reactivity || 0) > 75) {
    concerns.push({
      type: 'reactivity_spike', priority: 'high',
      message: `Reactivity metrics are elevated. Suspend threshold exposure work and return to foundation calm exercises before progressing.`,
    })
  }
  if (completedLessons > 5 && (100 - (ind.confidence || 50)) < 20) {
    concerns.push({
      type: 'confidence_plateau', priority: 'low',
      message: `Confidence development shows a plateau. Introducing novel, achievable challenges — new routes, mild puzzle enrichment — will stimulate continued progress.`,
    })
  }

  return concerns
}
