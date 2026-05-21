// ─────────────────────────────────────────────────────────────
// FOUR PAWS — OFFLINE BEHAVIOUR ENGINE
// Pure rule-based intelligence. No APIs. No cloud. No ML.
// Runs entirely in the browser from local state.
// ─────────────────────────────────────────────────────────────

// ── Scoring weights ───────────────────────────────────────────
const WEIGHTS = {
  anxiety:       1.4,
  reactivity:    1.3,
  confidence:    1.2,  // inverted — low confidence raises score
  socialisation: 1.1,  // inverted
  energy:        0.9,
  aggression:    1.5,
  fearfulness:   1.3,
}

// ── Concern thresholds ────────────────────────────────────────
export const CONCERN_LEVELS = {
  CRITICAL:  { label: 'Critical',  min: 75, colour: 'text-red-400',     dot: 'bg-red-400'     },
  HIGH:      { label: 'High',      min: 55, colour: 'text-orange-400',   dot: 'bg-orange-400'  },
  MODERATE:  { label: 'Moderate',  min: 35, colour: 'text-amber-400',    dot: 'bg-amber-400'   },
  LOW:       { label: 'Low',       min: 15, colour: 'text-gold-400',     dot: 'bg-gold-400'    },
  MINIMAL:   { label: 'Minimal',   min: 0,  colour: 'text-emerald-400',  dot: 'bg-emerald-400' },
}

/**
 * Convert 0–10 slider scale to a concern contribution (0–100).
 * For "negative" traits like anxiety — higher = more concern.
 * For "positive" traits like confidence — lower = more concern.
 */
function traitToConcern(value, inverted = false) {
  const v = inverted ? (10 - value) : value
  return (v / 10) * 100
}

/**
 * scoreBehaviour(dogProfile) → behaviourScores object
 *
 * dogProfile fields (all 0–10 unless noted):
 *   anxiety, reactivity, confidence, socialisation, energy,
 *   aggression, fearfulness, trainingHistory (0–10),
 *   age (months), breedSize ('small'|'medium'|'large'|'giant')
 */
export function scoreBehaviour(dogProfile) {
  if (!dogProfile) return null

  const {
    anxiety        = 5,
    reactivity     = 5,
    confidence     = 5,
    socialisation  = 5,
    energy         = 5,
    aggression     = 0,
    fearfulness    = 5,
    trainingHistory = 3,
    age            = 12,
    breedSize      = 'medium',
  } = dogProfile

  // Raw scores
  const scores = {
    anxiety:       traitToConcern(anxiety)             * WEIGHTS.anxiety,
    reactivity:    traitToConcern(reactivity)          * WEIGHTS.reactivity,
    confidence:    traitToConcern(confidence, true)    * WEIGHTS.confidence,
    socialisation: traitToConcern(socialisation, true) * WEIGHTS.socialisation,
    energy:        traitToConcern(energy)              * WEIGHTS.energy,
    aggression:    traitToConcern(aggression)          * WEIGHTS.aggression,
    fearfulness:   traitToConcern(fearfulness)         * WEIGHTS.fearfulness,
  }

  // Modifiers
  const ageModifier = age < 6 ? 1.1 : age < 18 ? 1.0 : age < 36 ? 0.95 : 0.9
  const trainingModifier = trainingHistory < 3 ? 1.15 : trainingHistory < 6 ? 1.0 : 0.88
  const sizeModifier = breedSize === 'giant' ? 1.05 : 1.0

  // Composite scores (0–100 each)
  const composite = {}
  Object.keys(scores).forEach(k => {
    composite[k] = Math.min(100, Math.round(scores[k] * ageModifier * trainingModifier * sizeModifier))
  })

  // Overall concern score — weighted average
  const totalWeight = Object.values(WEIGHTS).reduce((a, b) => a + b, 0)
  const overallRaw  = Object.keys(composite).reduce((acc, k) => {
    return acc + (composite[k] * (WEIGHTS[k] || 1))
  }, 0)
  const overall = Math.min(100, Math.round(overallRaw / (totalWeight * 100) * 100))

  // Determine concern level
  let concernLevel = CONCERN_LEVELS.MINIMAL
  for (const level of Object.values(CONCERN_LEVELS)) {
    if (overall >= level.min) { concernLevel = level; break }
  }

  // Top concerns (sorted by score desc)
  const topConcerns = Object.entries(composite)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .filter(([, v]) => v > 30)
    .map(([trait, score]) => ({ trait, score }))

  // Strengths (traits with low concern score)
  const strengths = Object.entries(composite)
    .filter(([, v]) => v < 25)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([trait]) => trait)

  return {
    individual:   composite,
    overall,
    concernLevel,
    topConcerns,
    strengths,
    modifiers:    { ageModifier, trainingModifier, sizeModifier },
  }
}

// ─────────────────────────────────────────────────────────────
// COURSE RECOMMENDATION ENGINE
// ─────────────────────────────────────────────────────────────

// Course ID → tags that describe what it helps with
const COURSE_TAGS = {
  'course-1': ['puppy', 'foundation', 'socialisation', 'bonding', 'confidence', 'young'],
  'course-2': ['behaviour', 'impulse', 'transformation', 'advanced', 'anxiety', 'fearfulness'],
  'course-3': ['reactivity', 'reactive', 'anxiety', 'socialisation', 'specialist', 'fear'],
  'course-4': ['obedience', 'advanced', 'impulse', 'confidence', 'lifestyle', 'aggression'],
  'course-5': ['lifestyle', 'enrichment', 'energy', 'confidence', 'balance'],
}

const ADDON_TAGS = {
  'addon-1': ['confidence', 'anxiety', 'fearfulness', 'nervous'],
  'addon-2': ['reactivity', 'threshold', 'socialisation'],
  'addon-3': ['enrichment', 'energy', 'mental', 'stimulation'],
  'addon-4': ['puppy', 'young', 'foundation', 'early'],
  'addon-5': ['anxiety', 'relaxation', 'calm', 'stress'],
  'addon-6': ['aggression', 'confidence', 'advanced', 'behaviour'],
}

/**
 * recommendCourses(behaviourScores, dogProfile, enrolledCourses) → ordered array of courseIds
 */
export function recommendCourses(behaviourScores, dogProfile, enrolledCourses = []) {
  if (!behaviourScores || !dogProfile) return ['course-1']

  const { individual, topConcerns } = behaviourScores
  const { age = 12, trainingHistory = 3, reactivity, anxiety, confidence } = dogProfile

  const scores = {}

  Object.entries(COURSE_TAGS).forEach(([courseId, tags]) => {
    let score = 0

    // Age-based scoring
    if (age < 12 && tags.includes('puppy'))       score += 40
    if (age >= 12 && tags.includes('advanced'))   score += 15
    if (age >= 24 && tags.includes('lifestyle'))  score += 10

    // Behaviour-based scoring
    if ((reactivity || 5) >= 7 && tags.includes('reactivity')) score += 35
    if ((anxiety || 5) >= 7    && tags.includes('anxiety'))    score += 30
    if ((confidence || 5) <= 4 && tags.includes('confidence')) score += 25

    // Top concerns boost
    topConcerns.forEach(({ trait, score: cs }) => {
      if (tags.some(t => t.includes(trait))) score += Math.round(cs * 0.3)
    })

    // Training history
    if (trainingHistory < 3 && tags.includes('foundation')) score += 20
    if (trainingHistory >= 6 && tags.includes('advanced'))  score += 15

    scores[courseId] = score
  })

  return Object.entries(scores)
    .filter(([id]) => !enrolledCourses.includes(id))
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => id)
}

/**
 * recommendAddons(behaviourScores, dogProfile, ownedAddons) → ordered array of addonIds
 */
export function recommendAddons(behaviourScores, dogProfile, ownedAddons = []) {
  if (!behaviourScores || !dogProfile) return []

  const { individual } = behaviourScores
  const scores = {}

  Object.entries(ADDON_TAGS).forEach(([addonId, tags]) => {
    let score = 0
    tags.forEach(tag => {
      if (tag === 'confidence'  && (individual.confidence  || 0) > 40) score += 25
      if (tag === 'anxiety'     && (individual.anxiety     || 0) > 50) score += 30
      if (tag === 'reactivity'  && (individual.reactivity  || 0) > 50) score += 35
      if (tag === 'fearfulness' && (individual.fearfulness || 0) > 45) score += 28
      if (tag === 'energy'      && (individual.energy      || 0) > 55) score += 20
      if (tag === 'aggression'  && (individual.aggression  || 0) > 30) score += 40
      if (tag === 'enrichment') score += 10
      if (tag === 'puppy' && (dogProfile.age || 12) < 12) score += 25
    })
    scores[addonId] = score
  })

  return Object.entries(scores)
    .filter(([id]) => !ownedAddons.includes(id) && scores[id] > 15)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => id)
}

// ─────────────────────────────────────────────────────────────
// INSIGHT GENERATION — natural-language behaviour summaries
// ─────────────────────────────────────────────────────────────

const INSIGHT_TEMPLATES = {
  anxiety: [
    (name) => `${name}'s anxiety profile suggests a highly sensitive nervous system. Calm, predictable routines will accelerate progress significantly.`,
    (name) => `Elevated anxiety detected in ${name}'s profile. This programme prioritises gentle threshold work to build lasting confidence.`,
  ],
  reactivity: [
    (name) => `${name} shows a reactive pattern likely rooted in over-arousal. The Reactive Recovery pathway is specifically designed for this profile.`,
    (name) => `${name}'s reactivity scores indicate the nervous system is working overtime. Structured decompression is the priority right now.`,
  ],
  confidence: [
    (name) => `${name} would benefit enormously from confidence-building work. Small daily wins compound into a transformed dog.`,
    (name) => `Low confidence is showing in ${name}'s profile. This is entirely addressable — and the results, when they come, are remarkable.`,
  ],
  socialisation: [
    (name) => `${name}'s socialisation profile suggests limited positive exposure. Structured, curated social experiences will open a new world for them.`,
  ],
  energy: [
    (name) => `${name}'s energy level requires intelligent outlet design. Without it, the excess drive often fuels behaviour challenges.`,
  ],
  aggression: [
    (name) => `${name}'s profile shows aggression indicators. This requires a careful, science-based approach — exactly what this programme provides.`,
  ],
  default: [
    (name) => `${name} has a well-balanced profile with some areas ready for refinement. This programme will elevate what's already strong.`,
    (name) => `${name} is in a great position to begin. The foundation is solid — now it's time to build something extraordinary.`,
  ],
}

export function generateBehaviourInsight(dogName, behaviourScores) {
  if (!behaviourScores || !dogName) return null
  const { topConcerns, strengths, overall } = behaviourScores

  const name = dogName

  if (topConcerns.length === 0 || overall < 20) {
    const t = INSIGHT_TEMPLATES.default
    return t[Math.floor(Math.random() * t.length)](name)
  }

  const topTrait = topConcerns[0]?.trait
  const templates = INSIGHT_TEMPLATES[topTrait] || INSIGHT_TEMPLATES.default
  return templates[Math.floor(Math.random() * templates.length)](name)
}

// ─────────────────────────────────────────────────────────────
// DAILY COACHING PROMPTS — contextual micro-suggestions
// ─────────────────────────────────────────────────────────────

const DAILY_PROMPTS = [
  (name) => `Today, give ${name} three opportunities to choose calmness. Reward each one quietly.`,
  (name) => `Before your walk today, run a 5-minute threshold check with ${name}. Note what you observe.`,
  (name) => `Spend 10 minutes on scatter feeding with ${name} today — it rebuilds confidence beautifully.`,
  (name) => `Today's focus: watch ${name}'s ears and tail. The body tells the story before the behaviour does.`,
  (name) => `Incorporate one new enrichment activity for ${name} today. Novelty is neural growth.`,
  (name) => `Practice one calm greeting with ${name} today. Even one, done perfectly, creates new pathways.`,
  (name) => `Notice one moment of offered calmness from ${name} today and reinforce it quietly.`,
  (name) => `End today's session with ${name} on a success. Always finish on a win.`,
  (name) => `Today, reduce the distance from ${name}'s trigger by just 10%. Small steps build a new nervous system.`,
  (name) => `Give ${name} a sniff walk today — no agenda, no heel. Let the nose lead.`,
]

export function getDailyPrompt(dogName, dayIndex = null) {
  const idx = dayIndex !== null ? dayIndex % DAILY_PROMPTS.length : new Date().getDay() + new Date().getDate()
  return DAILY_PROMPTS[idx % DAILY_PROMPTS.length](dogName || 'your dog')
}

// ─────────────────────────────────────────────────────────────
// PROGRESS INSIGHT — analyses lesson completion patterns
// ─────────────────────────────────────────────────────────────

export function generateProgressInsight(dogName, courseProgress, courses) {
  if (!courseProgress || !courses) return null

  const completedTotal  = Object.values(courseProgress).reduce((a, p) => a + (p.completedLessons?.length || 0), 0)
  const activeCourses   = Object.keys(courseProgress).filter(id => (courseProgress[id]?.completedLessons?.length || 0) > 0)
  const name            = dogName || 'your dog'

  if (completedTotal === 0) return `${name}'s journey is just beginning. Every master was once at lesson one.`
  if (completedTotal < 5)   return `${name} has completed ${completedTotal} lesson${completedTotal > 1 ? 's' : ''}. The foundations are being laid.`
  if (completedTotal < 12)  return `Strong early momentum for ${name}. Consistency at this stage is everything.`
  if (completedTotal < 24)  return `${name} is building real depth now. You can already see the change, can't you?`
  return `Remarkable progress. ${name} has completed ${completedTotal} lessons — you're both operating at an elite level now.`
}

// ─────────────────────────────────────────────────────────────
// TRAIT LABELS — human-readable descriptions
// ─────────────────────────────────────────────────────────────

export const TRAIT_LABELS = {
  anxiety:       { label: 'Anxiety',       icon: '😰', low: 'Very calm',      high: 'Very anxious'    },
  reactivity:    { label: 'Reactivity',    icon: '⚡', low: 'Non-reactive',   high: 'Highly reactive' },
  confidence:    { label: 'Confidence',    icon: '🦁', low: 'Lacks confidence', high: 'Very confident' },
  socialisation: { label: 'Socialisation', icon: '🤝', low: 'Avoidant',       high: 'Very social'     },
  energy:        { label: 'Energy Level',  icon: '🔥', low: 'Very calm',      high: 'Very energetic'  },
  aggression:    { label: 'Aggression',    icon: '⚠️', low: 'None',           high: 'Significant'     },
  fearfulness:   { label: 'Fearfulness',   icon: '🫣', low: 'Fearless',       high: 'Very fearful'    },
}

export const BREED_SIZES = {
  toy:    { label: 'Toy (under 5kg)',          value: 'toy'    },
  small:  { label: 'Small (5–10kg)',           value: 'small'  },
  medium: { label: 'Medium (10–25kg)',         value: 'medium' },
  large:  { label: 'Large (25–40kg)',          value: 'large'  },
  giant:  { label: 'Giant (40kg+)',            value: 'giant'  },
}

export const BEHAVIOUR_PROBLEMS = [
  'Excessive barking',
  'Pulling on lead',
  'Jumping up',
  'Aggression to dogs',
  'Aggression to people',
  'Separation anxiety',
  'Destructive behaviour',
  'Resource guarding',
  'Fear of noises',
  'Fear of strangers',
  'Reactivity on lead',
  'Poor recall',
  'Hyperactivity',
  'Obsessive behaviours',
  'None significant',
]
