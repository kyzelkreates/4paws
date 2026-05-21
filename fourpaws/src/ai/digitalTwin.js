// ─────────────────────────────────────────────────────────────
// FOUR PAWS — AI CANINE DIGITAL TWIN ENGINE
// Behavioural intelligence model for each dog.
// Fully offline. Deterministic. No ML/APIs needed.
// ─────────────────────────────────────────────────────────────

const TWIN_KEY = 'fp_digital_twin'

// ── Default twin state ───────────────────────────────────────
const defaultTwin = {
  version: 1,
  modelledAt: null,
  behaviourTendencies: {},
  energyPattern: {},
  stressSensitivity: {},
  confidenceTrajectory: {},
  recoveryProfile: {},
  socialAdaptability: {},
  triggerLikelihood: {},
  enrichmentResponsiveness: {},
  predictiveSummary: '',
  moodLog: [],           // { timestamp, mood, energy, stress, note }
  wellnessLog: [],       // { timestamp, sleep, exercise, nutrition, enrichment }
  handlerMetrics: {},    // training consistency analytics
}

// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────
export function loadDigitalTwin() {
  try {
    const raw = localStorage.getItem(TWIN_KEY)
    return raw ? { ...defaultTwin, ...JSON.parse(raw) } : { ...defaultTwin }
  } catch { return { ...defaultTwin } }
}

export function saveDigitalTwin(twin) {
  try {
    localStorage.setItem(TWIN_KEY, JSON.stringify({ ...twin, savedAt: new Date().toISOString() }))
  } catch {}
}

export function patchDigitalTwin(patch) {
  const twin    = loadDigitalTwin()
  const updated = { ...twin, ...patch }
  saveDigitalTwin(updated)
  return updated
}

// ─────────────────────────────────────────────────────────────
// BUILD DIGITAL TWIN from dog profile + behaviour scores
// ─────────────────────────────────────────────────────────────
export function buildDigitalTwin(dogProfile, behaviourScores, completedLessons = 0, streakData = {}) {
  if (!dogProfile) return null

  const {
    anxiety = 5, reactivity = 5, confidence = 5,
    socialisation = 5, energy = 5, fearfulness = 5,
    age = 12, breed = '', name = 'your dog',
  } = dogProfile

  const lessons = completedLessons
  const streak  = streakData?.current || 0
  const ind     = behaviourScores?.individual || {}

  // ── Behaviour tendencies ─────────────────────────────────
  const behaviourTendencies = {
    reactivityLevel:    getLevel(reactivity, 10),
    impulsivityLevel:   getLevel(energy * 0.6 + reactivity * 0.4, 10),
    alertnessLevel:     getLevel((anxiety + reactivity) / 2, 10),
    complianceLevel:    getLevel(10 - fearfulness * 0.3 + confidence * 0.4, 10),
    adaptabilityLevel:  getLevel(confidence * 0.5 + socialisation * 0.5, 10),
    frustrationTolerance: getLevel(10 - anxiety * 0.4 - reactivity * 0.4, 10),
  }

  // ── Energy pattern ────────────────────────────────────────
  const baseEnergy    = energy
  const energyPattern = {
    baselineEnergy:     getLevel(baseEnergy, 10),
    morningPeak:        energy > 7 ? 'high' : energy > 4 ? 'moderate' : 'low',
    afternoonState:     energy > 6 ? 'active' : 'settling',
    eveningRecovery:    energy > 8 ? 'slow' : 'natural',
    exerciseRequirement: energy > 7 ? 'high' : energy > 4 ? 'moderate' : 'low',
    mentalStimulationNeed: confidence < 5 || anxiety > 6 ? 'high' : 'moderate',
  }

  // ── Stress sensitivity ────────────────────────────────────
  const stressSensitivity = {
    overallSensitivity: getLevel(anxiety * 0.5 + fearfulness * 0.3 + (10 - confidence) * 0.2, 10),
    environmentalTriggers: anxiety > 6 ? 'high' : anxiety > 3 ? 'moderate' : 'low',
    socialTriggers:        (10 - socialisation) > 6 ? 'high' : 'moderate',
    noiseReactivity:       reactivity > 6 ? 'elevated' : 'typical',
    changeAdaptation:      anxiety > 7 ? 'slow' : 'moderate',
    recoveryCurve:         anxiety > 7 ? 'extended' : anxiety > 4 ? 'typical' : 'rapid',
  }

  // ── Confidence trajectory ─────────────────────────────────
  const baseConfidence   = confidence
  const trainingBoost    = Math.min(30, lessons * 1.5)
  const projectedConf    = Math.min(100, Math.round(baseConfidence * 10 + trainingBoost))
  const confidenceTrajectory = {
    currentScore:         Math.round(baseConfidence * 10),
    projectedScore:       projectedConf,
    growthVelocity:       lessons > 10 ? 'accelerating' : lessons > 3 ? 'building' : 'initialising',
    stabilisationDate:    estimateStabilisationDate(baseConfidence, lessons),
    primaryLimiter:       anxiety > 7 ? 'anxiety' : fearfulness > 7 ? 'fearfulness' : 'exposure',
  }

  // ── Recovery profile ──────────────────────────────────────
  const recoveryProfile = {
    speed:                anxiety < 4 && fearfulness < 4 ? 'rapid' : anxiety > 7 ? 'extended' : 'typical',
    triggerRecoveryTime:  reactivity > 7 ? '20-30 min' : reactivity > 4 ? '10-15 min' : '5-10 min',
    emotionalResilience:  getLevel(confidence * 0.4 + (10 - anxiety) * 0.4 + (10 - fearfulness) * 0.2, 10),
    settlingTime:         energy > 7 ? '20+ min' : energy > 4 ? '10-15 min' : '5 min',
    bounceBack:           lessons > 15 ? 'strong' : lessons > 5 ? 'developing' : 'building',
  }

  // ── Social adaptability ───────────────────────────────────
  const socialAdaptability = {
    humanSocialConfidence:  getLevel(socialisation * 0.6 + confidence * 0.4, 10),
    dogSocialConfidence:    getLevel(socialisation * 0.7 + (10 - reactivity) * 0.3, 10),
    strangersComfort:       socialisation > 6 ? 'comfortable' : socialisation > 3 ? 'cautious' : 'avoidant',
    groupSettings:          socialisation > 7 ? 'thrives' : socialisation > 4 ? 'manageable' : 'challenging',
    newEnvironments:        anxiety < 5 && confidence > 5 ? 'investigative' : 'cautious',
  }

  // ── Trigger likelihood ────────────────────────────────────
  const triggerLikelihood = {
    sound:          reactivity > 7 ? 0.85 : reactivity > 4 ? 0.5 : 0.2,
    strangers:      (10 - socialisation) > 6 ? 0.75 : 0.35,
    otherDogs:      reactivity > 6 ? 0.7 : 0.3,
    suddenMovement: fearfulness > 6 ? 0.8 : 0.3,
    confinement:    anxiety > 7 ? 0.75 : 0.35,
    separation:     anxiety > 6 ? 0.7 : 0.3,
  }

  // ── Enrichment responsiveness ─────────────────────────────
  const enrichmentResponsiveness = {
    scentWork:        'high',  // universal
    puzzleFeeding:    energy > 5 || confidence < 6 ? 'high' : 'moderate',
    physicalPlay:     energy > 6 ? 'high' : 'moderate',
    trainingGames:    confidence > 5 ? 'high' : 'moderate',
    socialEnrichment: socialisation > 5 ? 'high' : 'low',
    calmEnrichment:   anxiety > 5 ? 'essential' : 'beneficial',
  }

  // ── Predictive summary ────────────────────────────────────
  const predictiveSummary = buildPredictiveSummary(name, {
    behaviourTendencies, stressSensitivity, confidenceTrajectory,
    recoveryProfile, lessons, streak,
  })

  const twin = {
    ...loadDigitalTwin(),
    version: 1,
    modelledAt: new Date().toISOString(),
    behaviourTendencies,
    energyPattern,
    stressSensitivity,
    confidenceTrajectory,
    recoveryProfile,
    socialAdaptability,
    triggerLikelihood,
    enrichmentResponsiveness,
    predictiveSummary,
  }

  saveDigitalTwin(twin)
  return twin
}

// ─────────────────────────────────────────────────────────────
// MOOD + WELLNESS LOGGING
// ─────────────────────────────────────────────────────────────
export function logMoodEntry(entry) {
  const twin = loadDigitalTwin()
  const log  = twin.moodLog || []
  log.unshift({ ...entry, timestamp: new Date().toISOString() })
  patchDigitalTwin({ moodLog: log.slice(0, 90) })  // 90 days max
}

export function logWellnessEntry(entry) {
  const twin = loadDigitalTwin()
  const log  = twin.wellnessLog || []
  log.unshift({ ...entry, timestamp: new Date().toISOString() })
  patchDigitalTwin({ wellnessLog: log.slice(0, 90) })
}

export function updateHandlerMetrics(patch) {
  const twin = loadDigitalTwin()
  patchDigitalTwin({ handlerMetrics: { ...twin.handlerMetrics, ...patch, updatedAt: new Date().toISOString() } })
}

// ─────────────────────────────────────────────────────────────
// TRANSFORMATION FORECASTING
// ─────────────────────────────────────────────────────────────
export function generateTransformationForecast(dogProfile, behaviourScores, completedLessons, streakData) {
  if (!dogProfile || !behaviourScores) return null

  const { anxiety = 5, confidence = 5, reactivity = 5 } = dogProfile
  const lessons = completedLessons || 0
  const streak  = streakData?.current || 0
  const ind     = behaviourScores.individual || {}

  // Estimate weeks to improvement thresholds
  const lessonsPerWeek    = streak > 5 ? 5 : streak > 2 ? 3 : 1.5
  const currentConfidence = confidence * 10
  const targetConfidence  = 70
  const confGap           = Math.max(0, targetConfidence - currentConfidence)
  const weeksToConfidence = Math.round(confGap / (lessonsPerWeek * 1.5))

  const currentAnxiety    = ind.anxiety || anxiety * 10
  const targetAnxiety     = 35
  const anxGap            = Math.max(0, currentAnxiety - targetAnxiety)
  const weeksToCalm       = Math.round(anxGap / (lessonsPerWeek * 1.2))

  const currentReactivity = ind.reactivity || reactivity * 10
  const targetReactivity  = 40
  const reactGap          = Math.max(0, currentReactivity - targetReactivity)
  const weeksToStability  = Math.round(reactGap / (lessonsPerWeek * 1.0))

  return {
    consistencyScore:     Math.min(100, streak * 8 + lessons * 2),
    projectedConfidence:  Math.min(100, currentConfidence + lessons * 1.5),
    weeksToConfidenceGoal: weeksToConfidence,
    weeksToCalm:           weeksToCalm,
    weeksToStability:      weeksToStability,
    estimatedTransformDate: addWeeks(Math.max(weeksToConfidence, weeksToCalm, weeksToStability)),
    trajectoryLabel:       lessons > 20 ? 'Accelerating' : lessons > 8 ? 'Building' : 'Establishing',
    recommendation:        buildForecastRecommendation(lessonsPerWeek, streak, lessons),
  }
}

// ─────────────────────────────────────────────────────────────
// WEEKLY INTELLIGENCE REPORT
// ─────────────────────────────────────────────────────────────
export function generateWeeklyReport(dogProfile, behaviourScores, courseProgress, streakData, moodLog = []) {
  if (!dogProfile) return null

  const completedLessons = Object.values(courseProgress || {})
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)

  const streak  = streakData?.current  || 0
  const longest = streakData?.longest  || 0
  const ind     = behaviourScores?.individual || {}
  const now     = new Date()

  // Last 7 days mood analysis
  const recentMoods = moodLog.filter(m => {
    const d = new Date(m.timestamp)
    return (now - d) < 7 * 86400000
  })

  const avgStress = recentMoods.length > 0
    ? Math.round(recentMoods.reduce((a, m) => a + (m.stress || 5), 0) / recentMoods.length)
    : null

  const avgCalm = recentMoods.length > 0
    ? Math.round(recentMoods.reduce((a, m) => a + (m.calmness || 5), 0) / recentMoods.length)
    : null

  return {
    generatedAt:      now.toISOString(),
    weekStarting:     new Date(now - 7 * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }),
    dogName:          dogProfile.name || 'your companion',
    overallScore:     behaviourScores?.overall || 50,
    completedLessons,
    streak,
    longestStreak:    longest,
    sessionsThisWeek: recentMoods.length,
    avgStressLevel:   avgStress,
    avgCalmLevel:     avgCalm,
    confidenceScore:  ind.confidence || 0,
    anxietyScore:     ind.anxiety    || 0,
    reactivityScore:  ind.reactivity || 0,
    highlights:       buildReportHighlights(dogProfile.name, streak, completedLessons, ind),
    nextActions:      buildNextActions(dogProfile, ind, streak),
    progressRating:   getProgressRating(streak, completedLessons, ind),
  }
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getLevel(raw, max) {
  const pct = (raw / max) * 100
  if (pct >= 75) return 'high'
  if (pct >= 45) return 'moderate'
  if (pct >= 20) return 'low'
  return 'minimal'
}

function estimateStabilisationDate(confidenceRaw, lessons) {
  const weeksRemaining = Math.max(2, Math.round((10 - confidenceRaw) * 2 - lessons * 0.3))
  return addWeeks(weeksRemaining)
}

function addWeeks(n) {
  const d = new Date()
  d.setDate(d.getDate() + n * 7)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function buildPredictiveSummary(name, data) {
  const { behaviourTendencies: bt, stressSensitivity: ss, confidenceTrajectory: ct, recoveryProfile: rp, lessons, streak } = data
  const d = name || 'your companion'

  if (lessons === 0) return `${d}'s digital twin has been initialised. Begin your programme to generate behavioural intelligence.`
  if (ct.growthVelocity === 'accelerating') return `${d}'s confidence is accelerating — the programme is producing measurable neural adaptation. Maintain current trajectory.`
  if (ss.overallSensitivity === 'high') return `${d} demonstrates elevated environmental sensitivity. Structured desensitisation is producing incremental improvement. Consistency is key.`
  return `${d}'s behavioural model indicates steady progress. ${rp.speed === 'rapid' ? 'Recovery speed is excellent.' : 'Continue building recovery capacity through consistent practice.'}`
}

function buildForecastRecommendation(lessonsPerWeek, streak, lessons) {
  if (streak >= 7) return 'Excellent consistency. Advance to the next module this week.'
  if (streak >= 3) return 'Good momentum. Aim for one additional session this week to accelerate progress.'
  if (lessons === 0) return 'Begin with a single lesson today. The first step is the most important.'
  return 'Consistency gaps slow transformation. A 5-minute daily micro-session maintains momentum between formal lessons.'
}

function buildReportHighlights(dogName, streak, lessons, ind) {
  const highlights = []
  const d = dogName || 'your companion'
  if (streak >= 7) highlights.push(`Exceptional consistency — ${streak}-day training streak maintained.`)
  if (lessons >= 5) highlights.push(`${lessons} lessons completed. Programme investment is compounding.`)
  if ((ind.anxiety || 100) < 40) highlights.push(`${d}'s anxiety scores are within the calm threshold — a significant indicator of progress.`)
  if ((ind.confidence || 0) > 60) highlights.push(`${d}'s confidence scores have exceeded the baseline target.`)
  if (highlights.length === 0) highlights.push(`${d}'s programme is underway. The foundation phase is essential — trust the process.`)
  return highlights
}

function buildNextActions(dogProfile, ind, streak) {
  const actions = []
  const d = dogProfile?.name || 'your companion'
  if (streak < 3) actions.push('Establish a daily 5-minute training routine')
  if ((ind.anxiety || 0) > 60) actions.push(`Focus on decompression activities for ${d} this week`)
  if ((ind.confidence || 0) < 40) actions.push('Prioritise confidence-building lessons in your next session')
  if ((ind.socialisation || 0) > 60) actions.push('Introduce one controlled positive social exposure this week')
  if (actions.length === 0) actions.push('Advance to the next lesson module', 'Introduce a new enrichment activity', 'Review this week\'s behaviour observations')
  return actions.slice(0, 3)
}

function getProgressRating(streak, lessons, ind) {
  const score = streak * 5 + lessons * 2 + (ind.confidence || 0) * 0.3 + (100 - (ind.anxiety || 50)) * 0.2
  if (score >= 80) return { label: 'Exceptional', colour: '#10B981', icon: '⭐' }
  if (score >= 50) return { label: 'Strong', colour: '#C9A84C', icon: '✨' }
  if (score >= 25) return { label: 'Building', colour: '#8B5CF6', icon: '🔄' }
  return { label: 'Establishing', colour: '#6B7280', icon: '🌱' }
}
