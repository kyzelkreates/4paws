// ─────────────────────────────────────────────────────────────
// FOUR PAWS — AI EMOTIONAL STATE ENGINE  (V3)
// Fully offline emotional intelligence modelling.
// Derives emotional state from behaviour scores + mood logs.
// ─────────────────────────────────────────────────────────────

const EMOTIONAL_KEY = 'fp_emotional_state'

// ─────────────────────────────────────────────────────────────
// EMOTIONAL STATE MODEL
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// EMOTIONAL CONTINUITY MODEL — LBIL Spec-aligned
// User-facing labels map to the 6-state spec model.
// Internal IDs unchanged — all logic, derivatives, and LBIL routes remain stable.
//
// Spec states → internal mapping:
//   Calm        → serene
//   Stable      → settled
//   Elevated    → alert / aroused
//   Stressed    → anxious / reactive
//   Recovering  → recovering
//   Optimising  → (serene with high lesson count — derived in narrativeVoice)
// ─────────────────────────────────────────────────────────────────────────────
export const EMOTIONAL_STATES = {
  SERENE:    { id: 'serene',    label: 'Calm',       specState: 'calm',       icon: '🌸', colour: '#10B981', glow: 'rgba(16,185,129,0.3)',  desc: 'A deeply settled emotional state — the ideal condition for learning and connection.' },
  SETTLED:   { id: 'settled',   label: 'Stable',     specState: 'stable',     icon: '🌿', colour: '#34D399', glow: 'rgba(52,211,153,0.25)', desc: "Emotionally regulated and receptive. Well-suited for today's session." },
  ALERT:     { id: 'alert',     label: 'Elevated',   specState: 'elevated',   icon: '👁️', colour: '#C9A84C', glow: 'rgba(201,168,76,0.3)',  desc: 'Arousal is present. Threshold awareness and environment management are recommended.' },
  AROUSED:   { id: 'aroused',   label: 'Elevated',   specState: 'elevated',   icon: '⚡', colour: '#F59E0B', glow: 'rgba(245,158,11,0.3)',  desc: 'Arousal is elevated. Begin with decompression before any formal engagement.' },
  ANXIOUS:   { id: 'anxious',   label: 'Stressed',   specState: 'stressed',   icon: '😰', colour: '#F97316', glow: 'rgba(249,115,22,0.3)',  desc: 'Stress indicators are present. Decompression takes precedence over training today.' },
  REACTIVE:  { id: 'reactive',  label: 'Stressed',   specState: 'stressed',   icon: '🌩️', colour: '#EF4444', glow: 'rgba(239,68,68,0.3)',   desc: 'Threshold has been reached. Suspend formal training and implement the recovery protocol.' },
  RECOVERING:{ id: 'recovering',label: 'Recovering', specState: 'recovering', icon: '💧', colour: '#8B5CF6', glow: 'rgba(139,92,246,0.3)',  desc: 'Post-arousal recovery is underway. Allow time, quiet, and space.' },
  OPTIMISING:{ id: 'optimising',label: 'Optimising', specState: 'optimising', icon: '✨', colour: '#C9A84C', glow: 'rgba(201,168,76,0.35)', desc: 'Exceptional consistency and emotional regulation. This is peak transformation territory.' },
  UNCERTAIN: { id: 'uncertain', label: 'Establishing', specState: 'uncertain', icon: '○', colour: '#6B7280', glow: 'rgba(107,114,128,0.2)', desc: 'Emotional profile is still forming. Continue logging to build a complete picture.' },
}

// ─────────────────────────────────────────────────────────────
// DERIVE EMOTIONAL STATE
// ─────────────────────────────────────────────────────────────
export function deriveEmotionalState(behaviourScores, moodLog = []) {
  if (!behaviourScores) return EMOTIONAL_STATES.UNCERTAIN

  const ind     = behaviourScores.individual || {}
  const anxiety = ind.anxiety    || 50
  const react   = ind.reactivity || 50
  const conf    = ind.confidence || 50  // here conf is already 0–100 concern
  const fear    = ind.fearfulness || 50
  const energy  = ind.energy     || 50

  // Weight recent mood log
  const recent = moodLog.slice(0, 3)
  const avgStress = recent.length
    ? recent.reduce((a, m) => a + (m.stress || 5), 0) / recent.length
    : 5
  const avgCalm = recent.length
    ? recent.reduce((a, m) => a + (m.calmness || 5), 0) / recent.length
    : 5

  // Composite emotional score (0–100, higher = more stressed)
  const score = Math.round(
    anxiety * 0.30 +
    react   * 0.25 +
    conf    * 0.20 +
    fear    * 0.15 +
    energy  * 0.10 +
    (avgStress / 10) * 100 * 0.15 +
    ((10 - avgCalm) / 10) * 100 * 0.10
  )

  if (score < 20) return EMOTIONAL_STATES.SERENE
  if (score < 35) return EMOTIONAL_STATES.SETTLED
  if (score < 50) return EMOTIONAL_STATES.ALERT
  if (score < 62) return EMOTIONAL_STATES.AROUSED
  if (score < 74) return EMOTIONAL_STATES.ANXIOUS
  if (score < 85) return EMOTIONAL_STATES.REACTIVE
  return EMOTIONAL_STATES.RECOVERING
}

// ─────────────────────────────────────────────────────────────
// OPTIMISING STATE — LBIL Spec (Product Lock)
// Emerges when emotional load is very low AND training consistency is high.
// Not a score — a derived state from combined conditions.
// ─────────────────────────────────────────────────────────────
export function deriveOptimising(behaviourScores, completedLessons, streakDays) {
  if (!behaviourScores) return false
  const ind = behaviourScores.individual || {}
  const anxiety    = ind.anxiety    || 50
  const reactivity = ind.reactivity || 50
  return anxiety < 25 && reactivity < 25 && (completedLessons || 0) >= 10 && (streakDays || 0) >= 7
}

// ─────────────────────────────────────────────────────────────
// EMOTIONAL TREND — last 7 mood logs
// ─────────────────────────────────────────────────────────────
export function getEmotionalTrend(moodLog = []) {
  if (moodLog.length < 2) return null

  const recent = moodLog.slice(0, 7)
  const older  = moodLog.slice(7, 14)

  const avg = (arr, key) =>
    arr.length ? arr.reduce((a, m) => a + (m[key] || 5), 0) / arr.length : 5

  const recentStress = avg(recent, 'stress')
  const olderStress  = avg(older,  'stress')
  const recentCalm   = avg(recent, 'calmness')
  const olderCalm    = avg(older,  'calmness')

  const stressDelta = recentStress - olderStress
  const calmDelta   = recentCalm   - olderCalm

  return {
    stressDelta:  Math.round(stressDelta * 10) / 10,
    calmDelta:    Math.round(calmDelta   * 10) / 10,
    trend:        stressDelta < -0.5 && calmDelta > 0.3 ? 'improving'
                : stressDelta >  0.5 && calmDelta < -0.3 ? 'declining'
                : 'stable',
    recentStress: Math.round(recentStress * 10) / 10,
    recentCalm:   Math.round(recentCalm   * 10) / 10,
    dataPoints:   recent.length,
  }
}

// ─────────────────────────────────────────────────────────────
// EMOTIONAL STABILITY INDEX (0–100, 100 = fully stable)
// ─────────────────────────────────────────────────────────────
export function computeStabilityIndex(behaviourScores, moodLog, streakData, completedLessons) {
  if (!behaviourScores) return 0

  const ind     = behaviourScores.individual || {}
  const streak  = streakData?.current || 0
  const lessons = completedLessons    || 0

  const trainingBonus  = Math.min(25, lessons * 0.8 + streak * 1.5)
  const anxietySub     = (ind.anxiety     || 50) * 0.25
  const reactSub       = (ind.reactivity  || 50) * 0.20
  const confBonus      = (100 - (ind.confidence || 50)) * 0.20
  const fearSub        = (ind.fearfulness || 50) * 0.15
  const energyMod      = Math.abs((ind.energy || 50) - 45) * 0.05

  const raw = 60 + trainingBonus - anxietySub - reactSub + confBonus - fearSub - energyMod
  return Math.max(0, Math.min(100, Math.round(raw)))
}

// ─────────────────────────────────────────────────────────────
// WELLNESS SCORE (0–100 holistic)
// ─────────────────────────────────────────────────────────────
export function computeWellnessScore(behaviourScores, moodLog, wellnessLog, streakData, completedLessons) {
  const stability  = computeStabilityIndex(behaviourScores, moodLog, streakData, completedLessons)
  const streak     = streakData?.current || 0
  const lessons    = completedLessons    || 0

  const recentWellness = wellnessLog?.slice(0, 7) || []
  const avgWell = recentWellness.length
    ? recentWellness.reduce((a, w) => a + ((w.sleep || 5) + (w.exercise || 5) + (w.enrichment || 5)) / 3, 0) / recentWellness.length
    : 5

  const wellnessBonus = (avgWell / 10) * 20
  const consistencyBonus = Math.min(20, streak * 2.5)
  const progressBonus = Math.min(15, lessons * 0.4)

  return Math.max(0, Math.min(100, Math.round(stability * 0.45 + wellnessBonus + consistencyBonus + progressBonus)))
}

// ─────────────────────────────────────────────────────────────
// BEHAVIOURAL STABILITY INDEX (BSI) — master composite
// ─────────────────────────────────────────────────────────────
export function computeBSI(behaviourScores, moodLog, streakData, completedLessons) {
  if (!behaviourScores) return { score: 0, grade: 'N/A', colour: '#6B7280' }

  const score = computeStabilityIndex(behaviourScores, moodLog, streakData, completedLessons)

  const grade =
    score >= 85 ? 'Elite'      :
    score >= 70 ? 'Advanced'   :
    score >= 55 ? 'Developing' :
    score >= 40 ? 'Building'   :
    score >= 25 ? 'Emerging'   : 'Foundation'

  const colour =
    score >= 85 ? '#C9A84C' :
    score >= 70 ? '#10B981' :
    score >= 55 ? '#34D399' :
    score >= 40 ? '#8B5CF6' :
    score >= 25 ? '#F59E0B' : '#EF4444'

  return { score, grade, colour }
}

// ─────────────────────────────────────────────────────────────
// RELAPSE PREVENTION — risk scoring
// ─────────────────────────────────────────────────────────────
export function assessRelapseRisk(behaviourScores, moodLog, streakData, completedLessons) {
  const streak  = streakData?.current || 0
  const lessons = completedLessons    || 0
  const ind     = behaviourScores?.individual || {}
  const recent  = moodLog?.slice(0, 7) || []

  const risks = []

  // Consistency gap
  if (streak === 0 && lessons > 5) {
    risks.push({ level: 'high',   label: 'Training Gap',       desc: 'No recent training recorded. Behaviour patterns begin reverting within 48–72 hours of inactivity.', action: 'Complete a single 5-minute session today to reset momentum.' })
  } else if (streak < 3 && lessons > 10) {
    risks.push({ level: 'medium', label: 'Consistency Risk',   desc: 'Training frequency has dropped below the maintenance threshold.', action: 'Aim for a short session each morning this week.' })
  }

  // Stress escalation
  const avgStress = recent.length ? recent.reduce((a, m) => a + (m.stress || 5), 0) / recent.length : 5
  if (avgStress > 7) {
    risks.push({ level: 'high',   label: 'Stress Escalation',  desc: 'Recent mood logs indicate sustained high stress levels. Regression risk is elevated.', action: 'Prioritise decompression activities. No threshold work this week.' })
  } else if (avgStress > 5.5) {
    risks.push({ level: 'medium', label: 'Elevated Stress',    desc: 'Stress levels trending above baseline. Monitor closely.', action: 'Increase calm enrichment and reduce environmental demands.' })
  }

  // Behaviour scores
  if ((ind.anxiety || 0) > 75 && (ind.reactivity || 0) > 65) {
    risks.push({ level: 'high',   label: 'Combined Stress Load', desc: 'Simultaneous high anxiety and reactivity scores create compounding relapse risk.', action: 'Scale back all training. Focus exclusively on decompression and enrichment.' })
  }

  // Low enrichment
  const recentWell = moodLog?.slice(0, 5) || []
  const avgEnrich  = recentWell.length ? recentWell.reduce((a, m) => a + (m.recovery || 5), 0) / recentWell.length : 7
  if (avgEnrich < 4) {
    risks.push({ level: 'medium', label: 'Enrichment Deficit',  desc: 'Low enrichment levels increase frustration and redirect into unwanted behaviours.', action: 'Implement scatter feeding and a daily 15-minute enrichment activity.' })
  }

  if (risks.length === 0) {
    risks.push({ level: 'low', label: 'Stable Trajectory', desc: 'No significant relapse risk factors detected. Continue current consistency.', action: 'Advance to the next lesson module to capitalise on current stability.' })
  }

  return risks
}

// ─────────────────────────────────────────────────────────────
// TRIGGER INTELLIGENCE
// ─────────────────────────────────────────────────────────────
export const TRIGGER_CATEGORIES = {
  sound:       { label: 'Sound & Noise',        icon: '🔊', colour: '#F97316' },
  environment: { label: 'Environmental',        icon: '🌆', colour: '#8B5CF6' },
  social:      { label: 'Social Pressure',      icon: '👥', colour: '#EC4899' },
  movement:    { label: 'Sudden Movement',      icon: '💨', colour: '#F59E0B' },
  separation:  { label: 'Separation',           icon: '💔', colour: '#EF4444' },
  handling:    { label: 'Handling & Touch',     icon: '🤲', colour: '#06B6D4' },
  confinement: { label: 'Confinement',          icon: '📦', colour: '#C9A84C' },
}

export function buildTriggerIntelligence(dogProfile, behaviourScores) {
  if (!dogProfile) return null

  const { anxiety = 5, reactivity = 5, fearfulness = 5, socialisation = 5, confidence = 5 } = dogProfile
  const ind = behaviourScores?.individual || {}

  const triggers = {
    sound:       Math.min(100, Math.round((ind.reactivity || reactivity * 10) * 0.8 + (ind.fearfulness || fearfulness * 10) * 0.2)),
    environment: Math.min(100, Math.round((ind.anxiety    || anxiety * 10) * 0.6 + (100 - (ind.confidence || confidence * 10)) * 0.4)),
    social:      Math.min(100, Math.round((100 - (ind.socialisation || socialisation * 10)) * 0.7 + (ind.anxiety || anxiety * 10) * 0.3)),
    movement:    Math.min(100, Math.round((ind.fearfulness || fearfulness * 10) * 0.6 + (ind.reactivity || reactivity * 10) * 0.4)),
    separation:  Math.min(100, Math.round((ind.anxiety || anxiety * 10) * 0.7 + (100 - (ind.confidence || confidence * 10)) * 0.3)),
    handling:    Math.min(100, Math.round((ind.fearfulness || fearfulness * 10) * 0.5 + (ind.anxiety || anxiety * 10) * 0.5)),
    confinement: Math.min(100, Math.round((ind.anxiety || anxiety * 10) * 0.6 + (ind.reactivity || reactivity * 10) * 0.4)),
  }

  // Desensitisation plans per trigger
  const plans = {
    sound:       ['Begin with recorded sounds at very low volume', 'Pair sound with high-value rewards', 'Gradually increase volume over weeks', 'Introduce real-world sounds from distance'],
    environment: ['Controlled exposure in familiar environments first', 'Identify and map specific stress locations', 'Build positive associations through scatter feeding on-site'],
    social:      ['One calm individual at a time', 'No forced greetings — dog must choose approach', 'Parallel walking before face-to-face interaction'],
    movement:    ['Stationary humans first, then slow movement', 'Use food lures to pair movement with reward', 'Progress to faster movement at distance'],
    separation:  ['5-second departures to start', 'Build a predictable pre-departure routine', 'High-value stuffed Kong before leaving', 'No fuss on return until calm'],
    handling:    ['Begin with least sensitive areas', 'Use high-value food throughout', 'Pair every touch with reward', 'Build duration gradually'],
    confinement: ['Open crate feeding — never forced entry', 'Build duration at one second intervals', 'High-value scatter in crate space', 'Never use as punishment'],
  }

  return { scores: triggers, plans, dominantTrigger: Object.entries(triggers).sort(([,a],[,b]) => b-a)[0][0] }
}

// ─────────────────────────────────────────────────────────────
// TRAINING CONSISTENCY ENGINE
// ─────────────────────────────────────────────────────────────
export function computeConsistencyMetrics(streakData, completedLessons, moodLog = []) {
  const streak    = streakData?.current || 0
  const longest   = streakData?.longest || 0
  const lessons   = completedLessons    || 0
  const sessions  = moodLog.length

  const dailyScore  = Math.min(100, streak * 10)
  const volumeScore = Math.min(100, lessons * 3)
  const habitScore  = longest > 0 ? Math.min(100, (streak / longest) * 100) : 0
  const composite   = Math.round(dailyScore * 0.4 + volumeScore * 0.35 + habitScore * 0.25)

  const grade =
    composite >= 85 ? { label: 'Elite Consistency',   colour: '#C9A84C', icon: '⭐' } :
    composite >= 70 ? { label: 'Strong Habit',         colour: '#10B981', icon: '✨' } :
    composite >= 50 ? { label: 'Building Routine',     colour: '#8B5CF6', icon: '📈' } :
    composite >= 30 ? { label: 'Developing Pattern',   colour: '#F59E0B', icon: '🔄' } :
                      { label: 'Establishing Base',    colour: '#6B7280', icon: '🌱' }

  return { dailyScore, volumeScore, habitScore, composite, grade, streak, longest, lessons, sessions }
}

// ─────────────────────────────────────────────────────────────
// SOCIALISATION INTELLIGENCE
// ─────────────────────────────────────────────────────────────
export function computeSocialisationIntelligence(dogProfile, behaviourScores, moodLog) {
  if (!dogProfile) return null

  const { socialisation = 5, anxiety = 5, confidence = 5, reactivity = 5 } = dogProfile
  const ind = behaviourScores?.individual || {}

  const humanConfScore   = Math.round((ind.socialisation ? 100 - ind.socialisation : socialisation * 10) * 0.6 + (100 - (ind.anxiety || anxiety * 10)) * 0.4)
  const dogConfScore     = Math.round((ind.socialisation ? 100 - ind.socialisation : socialisation * 10) * 0.5 + (100 - (ind.reactivity || reactivity * 10)) * 0.5)
  const envAdaptScore    = Math.round((100 - (ind.anxiety || anxiety * 10)) * 0.5 + (100 - (ind.confidence || 50)) * 0.3 + (ind.socialisation ? 100 - ind.socialisation : 50) * 0.2)
  const overallSocScore  = Math.round((humanConfScore + dogConfScore + envAdaptScore) / 3)

  const growthPath =
    overallSocScore < 35 ? ['Solo decompression walks in quiet environments', 'Parallel walking with calm dogs at distance', 'Controlled human greetings with choice', 'Gradually expand exposure radius'] :
    overallSocScore < 60 ? ['Group walks with known calm dogs', 'Structured meet-and-greet protocols', 'Café or pub garden exposures', 'Off-lead in low-distraction environments'] :
    ['Advanced socialisation in busy environments', 'Reactive dog threshold work', 'Novel environment challenges', 'Social agility or group training classes']

  return { humanConfScore, dogConfScore, envAdaptScore, overallSocScore, growthPath }
}

// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────
export function loadEmotionalState() {
  try { return JSON.parse(localStorage.getItem(EMOTIONAL_KEY) || '{}') }
  catch { return {} }
}

export function saveEmotionalSnapshot(state) {
  try {
    const current = loadEmotionalState()
    const history = current.history || []
    history.unshift({ ...state, timestamp: new Date().toISOString() })
    localStorage.setItem(EMOTIONAL_KEY, JSON.stringify({ ...current, history: history.slice(0, 90), latestAt: new Date().toISOString() }))
  } catch {}
}
