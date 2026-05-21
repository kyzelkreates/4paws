// ─────────────────────────────────────────────────────────────
// FOUR PAWS — OFFLINE AI MEMORY LAYER
// Stores all intelligence, interactions, and progression data
// locally. Fully offline. No external services.
// Future-swap: replace storage calls with Supabase/Firebase adapter.
// ─────────────────────────────────────────────────────────────

const MEMORY_KEY      = 'fp_ai_memory'
const INTERACTION_KEY = 'fp_ai_interactions'
const STREAK_KEY      = 'fp_training_streak'

// ─────────────────────────────────────────────────────────────
// MEMORY SCHEMA
// ─────────────────────────────────────────────────────────────
const defaultMemory = {
  version:               1,
  dogProfile:            null,
  clientProfile:         null,
  behaviourScores:       null,
  aiRecommendations:     { courses: [], addons: [], enrichment: [] },
  trainingInsights:      [],
  enrichmentPlans:       [],
  lessonPriorityMap:     {},       // { courseId: [lessonId, ...] }
  behaviourHistory:      [],       // timestamped snapshots
  progressMilestones:    [],       // { date, milestone, dogName }
  sessionCount:          0,
  lastSessionAt:         null,
  onboardingCompleted:   false,
  onboardingCompletedAt: null,
  dailyPromptIndex:      0,
}

// ─────────────────────────────────────────────────────────────
// LOAD / SAVE
// ─────────────────────────────────────────────────────────────

export function loadAIMemory() {
  try {
    const raw = localStorage.getItem(MEMORY_KEY)
    if (!raw) return { ...defaultMemory }
    const parsed = JSON.parse(raw)
    return { ...defaultMemory, ...parsed }
  } catch { return { ...defaultMemory } }
}

export function saveAIMemory(memory) {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify({ ...memory, _savedAt: new Date().toISOString() }))
  } catch {}
}

export function patchAIMemory(patch) {
  const current = loadAIMemory()
  const updated  = { ...current, ...patch }
  saveAIMemory(updated)
  return updated
}

export function clearAIMemory() {
  localStorage.removeItem(MEMORY_KEY)
  localStorage.removeItem(INTERACTION_KEY)
  localStorage.removeItem(STREAK_KEY)
}

// ─────────────────────────────────────────────────────────────
// DOG PROFILE PERSISTENCE
// ─────────────────────────────────────────────────────────────

export function saveDogProfile(profile) {
  return patchAIMemory({ dogProfile: { ...profile, savedAt: new Date().toISOString() } })
}

export function loadDogProfile() {
  return loadAIMemory().dogProfile
}

export function saveClientAIProfile(profile) {
  return patchAIMemory({ clientProfile: { ...profile, savedAt: new Date().toISOString() } })
}

// ─────────────────────────────────────────────────────────────
// BEHAVIOUR SNAPSHOT — track changes over time
// ─────────────────────────────────────────────────────────────

export function recordBehaviourSnapshot(behaviourScores, dogProfile) {
  const memory  = loadAIMemory()
  const history = memory.behaviourHistory || []

  // Keep last 30 snapshots
  const snapshot = {
    date:           new Date().toISOString(),
    overall:        behaviourScores.overall,
    individual:     behaviourScores.individual,
    concernLevel:   behaviourScores.concernLevel?.label,
    dogAge:         dogProfile?.age,
  }

  const updated = [snapshot, ...history].slice(0, 30)
  return patchAIMemory({ behaviourHistory: updated, behaviourScores })
}

export function getBehaviourTrend(history) {
  if (!history || history.length < 2) return 'stable'
  const recent = history[0]?.overall || 0
  const older  = history[history.length - 1]?.overall || 0
  const delta  = older - recent // positive = improving (scores going down = less concern)
  if (delta > 8)  return 'improving'
  if (delta < -5) return 'declining'
  return 'stable'
}

// ─────────────────────────────────────────────────────────────
// RECOMMENDATIONS PERSISTENCE
// ─────────────────────────────────────────────────────────────

export function saveRecommendations(courses, addons, enrichment = []) {
  return patchAIMemory({
    aiRecommendations: {
      courses,
      addons,
      enrichment,
      generatedAt: new Date().toISOString(),
    }
  })
}

export function loadRecommendations() {
  return loadAIMemory().aiRecommendations
}

// ─────────────────────────────────────────────────────────────
// TRAINING STREAK
// ─────────────────────────────────────────────────────────────

export function recordLessonActivity() {
  const today = new Date().toDateString()
  try {
    const raw    = localStorage.getItem(STREAK_KEY)
    const streak = raw ? JSON.parse(raw) : { current: 0, longest: 0, lastDate: null, days: [] }

    const lastDate  = streak.lastDate
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastDate === today) {
      // already recorded today
      return streak
    } else if (lastDate === yesterday) {
      // consecutive — increment
      streak.current  = (streak.current || 0) + 1
      streak.longest  = Math.max(streak.longest || 0, streak.current)
    } else {
      // broken — reset
      streak.current  = 1
    }

    streak.lastDate = today
    streak.days     = [...(streak.days || []).slice(-29), today]
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak))
    return streak
  } catch { return { current: 1, longest: 1, lastDate: today, days: [today] } }
}

export function loadStreak() {
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    return raw ? JSON.parse(raw) : { current: 0, longest: 0, lastDate: null, days: [] }
  } catch { return { current: 0, longest: 0, lastDate: null, days: [] } }
}

// ─────────────────────────────────────────────────────────────
// PROGRESS MILESTONES
// ─────────────────────────────────────────────────────────────

export function checkAndRecordMilestone(completedLessonsTotal, dogName) {
  const milestones = [1, 5, 10, 20, 30, 50, 75, 100]
  const memory     = loadAIMemory()
  const recorded   = (memory.progressMilestones || []).map(m => m.count)

  const achieved = milestones.find(m => m === completedLessonsTotal && !recorded.includes(m))
  if (!achieved) return null

  const labels = {
    1:   'First Lesson Complete',
    5:   'Five Lessons Mastered',
    10:  'Ten Lesson Milestone',
    20:  'Twenty Lessons — Exceptional',
    30:  'Thirty Lessons — Elite',
    50:  'Fifty Lessons — Master Class',
    75:  'Seventy-Five — Extraordinary',
    100: 'One Hundred Lessons — Legendary',
  }

  const milestone = {
    count:   achieved,
    label:   labels[achieved],
    dogName,
    date:    new Date().toISOString(),
  }

  patchAIMemory({
    progressMilestones: [...(memory.progressMilestones || []), milestone]
  })

  return milestone
}

// ─────────────────────────────────────────────────────────────
// ENRICHMENT PLAN GENERATOR
// ─────────────────────────────────────────────────────────────

const ENRICHMENT_ACTIVITIES = {
  high_anxiety: [
    { name: 'Scatter Feeding', duration: '10 min', frequency: 'Daily', icon: '🌿', desc: 'Spread kibble in grass or on a snuffle mat. Activates the seeking system and reduces cortisol.' },
    { name: 'Calm Music Protocol', duration: '30 min', frequency: 'Daily', icon: '🎵', desc: 'Classical music or binaural beats played at low volume during rest periods.' },
    { name: 'Gentle Massage Routine', duration: '5 min', frequency: 'Evening', icon: '🤲', desc: 'Slow, deliberate TTouch-style strokes along the spine and ears.' },
    { name: 'Decompression Walks', duration: '20 min', frequency: '3× weekly', icon: '🌿', desc: 'Long line, nose-led walks with zero expectations. Let the nervous system unwind.' },
  ],
  high_energy: [
    { name: 'Puzzle Feeder Sessions', duration: '15 min', frequency: 'Daily', icon: '🧩', desc: 'Use Kong toys, lick mats, or puzzle boards to redirect physical drive into mental work.' },
    { name: 'Trick Training Sprints', duration: '5 min', frequency: '3× daily', icon: '⚡', desc: 'Short, intense training bursts channel high energy into focused learning.' },
    { name: 'Flirt Pole Sessions', duration: '10 min', frequency: 'Daily', icon: '🎯', desc: 'Structured predatory outlet with clear start/stop rules.' },
    { name: 'Agility Foundation Work', duration: '15 min', frequency: '3× weekly', icon: '🏃', desc: 'Body awareness and impulse control through low-equipment agility.' },
  ],
  low_confidence: [
    { name: 'Choice Architecture Walks', duration: '20 min', frequency: 'Daily', icon: '🧭', desc: 'Let your dog choose direction and pace. Autonomy builds confidence faster than anything.' },
    { name: 'Novel Object Introduction', duration: '10 min', frequency: '3× weekly', icon: '📦', desc: 'Present one new object per session. Approach at dog\'s pace. Celebrate investigation.' },
    { name: 'Platform Work', duration: '10 min', frequency: 'Daily', icon: '⬜', desc: 'Teaching your dog to place paws on an elevated surface builds enormous body confidence.' },
    { name: 'Positive Social Exposure', duration: '15 min', frequency: '2× weekly', icon: '🤝', desc: 'Carefully curated calm dog interactions at your dog\'s chosen distance.' },
  ],
  high_reactivity: [
    { name: 'Threshold Management Sessions', duration: '20 min', frequency: 'Daily', icon: '📏', desc: 'Work at sub-threshold distance. Every calm observation is a win.' },
    { name: 'Pattern Games', duration: '10 min', frequency: 'Daily', icon: '🎮', desc: 'Structured "1-2-3" games to build predictability and reduce reactive urgency.' },
    { name: 'Relaxation Protocol', duration: '15 min', frequency: 'Daily', icon: '😴', desc: 'Dr. Karen Overall\'s Relaxation Protocol. Systematic calm-state training.' },
    { name: 'Sniff Walks', duration: '30 min', frequency: 'Daily', icon: '👃', desc: 'Dedicated sniff-led walks reduce cortisol levels by up to 40% in reactive dogs.' },
  ],
  balanced: [
    { name: 'Daily Enrichment Rotation', duration: '15 min', frequency: 'Daily', icon: '🔄', desc: 'Rotate through lick mats, puzzle feeders, scatter feeding, and trick sessions.' },
    { name: 'Training Walks', duration: '20 min', frequency: 'Daily', icon: '🏆', desc: 'Integrate training cues naturally throughout your walk. Life rewards are the most powerful.' },
    { name: 'Novelty Days', duration: '1 hour', frequency: 'Weekly', icon: '✨', desc: 'One new environment, experience, or activity per week. Lifelong learners stay brilliant.' },
  ],
}

export function generateEnrichmentPlan(behaviourScores, dogProfile) {
  if (!behaviourScores) return ENRICHMENT_ACTIVITIES.balanced

  const { individual } = behaviourScores
  const activities = []
  const seen = new Set()

  const add = (list) => list.forEach(a => {
    if (!seen.has(a.name)) { activities.push(a); seen.add(a.name) }
  })

  if ((individual.anxiety || 0) > 50)    add(ENRICHMENT_ACTIVITIES.high_anxiety)
  if ((individual.energy  || 0) > 55)    add(ENRICHMENT_ACTIVITIES.high_energy)
  if ((individual.confidence || 0) > 50) add(ENRICHMENT_ACTIVITIES.low_confidence) // inverted — high score = low confidence
  if ((individual.reactivity || 0) > 50) add(ENRICHMENT_ACTIVITIES.high_reactivity)
  if (activities.length < 3)             add(ENRICHMENT_ACTIVITIES.balanced)

  // Dedupe and return top 6
  return activities.slice(0, 6)
}

// ─────────────────────────────────────────────────────────────
// SESSION TRACKING
// ─────────────────────────────────────────────────────────────

export function recordSession() {
  const memory = loadAIMemory()
  return patchAIMemory({
    sessionCount:  (memory.sessionCount || 0) + 1,
    lastSessionAt: new Date().toISOString(),
  })
}

export function isOnboardingComplete() {
  return loadAIMemory().onboardingCompleted === true
}

export function markOnboardingComplete(dogProfile, clientProfile) {
  return patchAIMemory({
    onboardingCompleted:   true,
    onboardingCompletedAt: new Date().toISOString(),
    dogProfile,
    clientProfile,
  })
}
