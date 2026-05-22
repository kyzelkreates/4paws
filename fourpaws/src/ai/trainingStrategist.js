// ─────────────────────────────────────────────────────────────
// FOUR PAWS — ELITE AI TRAINING STRATEGIST  (V3)
// Offline strategic training intelligence.
// Generates weekly plans, adaptive pathways, coaching summaries.
// ─────────────────────────────────────────────────────────────

import { PERSONALITY_ARCHETYPES, getArchetype } from './archetypes'

// ─────────────────────────────────────────────────────────────
// CANINE LIFESTYLE ARCHETYPES
// ─────────────────────────────────────────────────────────────
export const LIFESTYLE_ARCHETYPES = {
  ESTATE_GUARDIAN: {
    id: 'estate_guardian', name: 'Estate Guardian', icon: '🏰',
    colour: '#8B5CF6',
    desc: 'A large-property dog with wide patrol instincts, strong territorial awareness, and multi-handler experience.',
    enrichmentFocus: ['boundary_work', 'scent_patrol', 'calm_guarding'],
    trainingPriority: ['territorial_management', 'handler_consistency', 'calm_settling'],
  },
  URBAN_COMPANION: {
    id: 'urban_companion', name: 'Urban Companion', icon: '🌆',
    colour: '#06B6D4',
    desc: 'An apartment or city dog navigating high-stimulation environments, crowds, traffic, and limited decompression space.',
    enrichmentFocus: ['indoor_enrichment', 'decompression_walks', 'mental_stimulation'],
    trainingPriority: ['noise_desensitisation', 'threshold_management', 'calm_on_cue'],
  },
  ADVENTURE_EXPLORER: {
    id: 'adventure_explorer', name: 'Adventure Explorer', icon: '⛰️',
    colour: '#F59E0B',
    desc: 'A high-energy, outdoor-oriented dog that thrives on novel environments, physical challenge, and exploration.',
    enrichmentFocus: ['trail_walks', 'swimming', 'agility_foundations'],
    trainingPriority: ['recall_reliability', 'impulse_control', 'focus_amid_distraction'],
  },
  SENSITIVE_COMPANION: {
    id: 'sensitive_companion', name: 'Sensitive Companion', icon: '🌸',
    colour: '#EC4899',
    desc: 'A deeply perceptive, emotionally attuned dog who needs consistent, gentle handling and predictable environments.',
    enrichmentFocus: ['calm_enrichment', 'lickimats', 'gentle_scent_work'],
    trainingPriority: ['confidence_building', 'optimism_training', 'independence_work'],
  },
  ELITE_SOCIAL: {
    id: 'elite_social', name: 'Elite Social Partner', icon: '🦋',
    colour: '#10B981',
    desc: 'A naturally sociable dog who flourishes in company and public settings, requiring refinement rather than confidence building.',
    enrichmentFocus: ['social_outings', 'group_play', 'reward_based_greeting'],
    trainingPriority: ['polite_greetings', 'self_regulation', 'focus_amid_distraction'],
  },
}

export function getLifestyleArchetype(clientProfile, dogProfile, behaviourScores) {
  if (!dogProfile) return LIFESTYLE_ARCHETYPES.URBAN_COMPANION

  const env       = clientProfile?.homeEnvironment || ''
  const lifestyle = clientProfile?.lifestyle       || ''
  const ind       = behaviourScores?.individual    || {}
  const { anxiety = 5, energy = 5, socialisation = 5 } = dogProfile

  if (env.toLowerCase().includes('rural') || env.toLowerCase().includes('estate') || env.toLowerCase().includes('large garden'))
    return LIFESTYLE_ARCHETYPES.ESTATE_GUARDIAN

  if (lifestyle.toLowerCase().includes('active') && energy > 6)
    return LIFESTYLE_ARCHETYPES.ADVENTURE_EXPLORER

  if ((ind.anxiety || anxiety * 10) > 65 || (ind.socialisation || 50) > 60)
    return LIFESTYLE_ARCHETYPES.SENSITIVE_COMPANION

  if ((ind.socialisation || 50) < 30 && energy > 5)
    return LIFESTYLE_ARCHETYPES.ELITE_SOCIAL

  return LIFESTYLE_ARCHETYPES.URBAN_COMPANION
}

// ─────────────────────────────────────────────────────────────
// WEEKLY TRAINING PLAN GENERATOR
// ─────────────────────────────────────────────────────────────
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function generateWeeklyPlan(dogProfile, behaviourScores, enrolledCourses, completedLessons, streakData) {
  if (!dogProfile) return null

  const { anxiety = 5, confidence = 5, energy = 5, age = 12, name = 'your companion' } = dogProfile
  const ind     = behaviourScores?.individual || {}
  const streak  = streakData?.current || 0
  const busy    = streak < 3

  const highAnx  = (ind.anxiety    || anxiety * 10)    > 60
  const lowConf  = (ind.confidence || 50)              > 60  // concern
  const highEn   = (ind.energy     || energy * 10)     > 65
  const isPuppy  = age < 10

  const focusAreas = []
  if (highAnx)  focusAreas.push('Anxiety reduction & decompression')
  if (lowConf)  focusAreas.push('Confidence building & optimism training')
  if (highEn)   focusAreas.push('Arousal regulation & impulse control')
  if (isPuppy)  focusAreas.push('Foundation socialisation & bite inhibition')
  if (!focusAreas.length) focusAreas.push('Skill generalisation & proofing', 'Advanced environmental mastery')

  const sessionDuration = isPuppy ? '5 min' : busy ? '5–8 min' : '10–15 min'
  const restDays        = busy ? 2 : 1

  return {
    weekOf:       new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    dogName:      name,
    focusAreas,
    sessionDuration,
    days: DAY_NAMES.map((day, i) => {
      const isRest = (i === 2 || (i === 6 && !busy))
      return {
        day,
        type:     isRest ? 'Active Rest' : i % 3 === 0 ? 'Training + Enrichment' : 'Enrichment Focus',
        isRest,
        focus:    isRest ? 'Light sniff walk + calm enrichment only'
                : i % 3 === 0 ? focusAreas[i % focusAreas.length]
                : 'Mental enrichment and physical exercise',
        duration: isRest ? '20 min walk' : sessionDuration,
        priority: isRest ? 'low' : i < 3 ? 'high' : 'medium',
      }
    }),
    coachingSummary: buildWeekCoachingSummary(name, focusAreas, streak, highAnx, lowConf),
    adaptivePath:    buildAdaptivePath(completedLessons, ind),
  }
}

function buildWeekCoachingSummary(name, focusAreas, streak, highAnx, lowConf) {
  if (streak >= 7) return `${name}'s consistency is exceptional. This week, advance to the next module — the habit is established.`
  if (highAnx)     return `This week's priority is decompression. ${name} needs space to regulate before new learning can embed.`
  if (lowConf)     return `Confidence work is the primary focus for ${name} this week. Each successful experience builds the next.`
  return `${name}'s programme continues with ${focusAreas[0].toLowerCase()}. Maintain session brevity and reward rate.`
}

function buildAdaptivePath(completedLessons, ind) {
  const lessons = completedLessons || 0
  if (lessons === 0)  return ['Start with Module 1, Lesson 1', 'Aim for 3 sessions this week', 'Keep sessions under 10 minutes']
  if (lessons < 5)    return ['Complete the remaining foundation module', 'Prioritise calmness work between lessons', 'Log mood after each session']
  if (lessons < 15)   return ['Advance to the next module', 'Introduce one novel environment this week', 'Review Week 1 skills in a new context']
  if (lessons < 30)   return ['Begin generalisation work in new environments', 'Increase distraction level gradually', 'Consider the advanced add-on programme']
  return ['Proofing in high-distraction environments', 'Introduce an elite challenge exercise', 'Assess readiness for the Elite Companion programme']
}

// ─────────────────────────────────────────────────────────────
// DAILY LIFE OPTIMISER
// ─────────────────────────────────────────────────────────────
export function generateLifeOptimisationPlan(dogProfile, behaviourScores, clientProfile) {
  if (!dogProfile) return null

  const { energy = 5, anxiety = 5, age = 12 } = dogProfile
  const lifestyle  = clientProfile?.lifestyle        || ''
  const household  = clientProfile?.householdType    || ''
  const ind        = behaviourScores?.individual     || {}

  const highEnergy = (ind.energy || energy * 10) > 65
  const highAnx    = (ind.anxiety || anxiety * 10) > 60
  const isPuppy    = age < 10
  const isSenior   = age > 96
  const children   = household.toLowerCase().includes('children')

  return {
    sleepOptimisation: {
      icon: '🌙',
      recommendation: isSenior ? '14–16 hours recommended for senior dogs' : isPuppy ? '16–18 hours required for puppy neural development' : highAnx ? '12–14 hours recommended — anxiety increases rest requirement' : '12–14 hours optimal',
      bedtimeTip: highAnx ? 'Create a covered, quiet sleeping space away from household noise. Predictable bedtime routine reduces anticipatory anxiety.' : 'A consistent settle routine signals the end of the active day — use a cue word each night.',
    },
    walkOptimisation: {
      icon: '🚶',
      morningWalk: highEnergy ? 'High-energy physical exercise (30–45 min) to set calm baseline for the day' : 'Moderate sniff walk (20–30 min) at dog\'s pace',
      eveningWalk:  highAnx   ? 'Decompression sniff walk in quiet environment — let the dog lead' : 'Social exploration walk in moderate-stimulation environment',
      frequency:    isPuppy   ? '3–4 short sessions (5 min per month of age, max 2×/day)' : highEnergy ? '2 substantial walks + 1 enrichment session' : '2 moderate walks + enrichment',
    },
    enrichmentTiming: {
      icon: '✨',
      peakWindow:   highEnergy ? 'Mid-morning (9–11am) — channel peak energy constructively' : 'Late morning (10am–12pm) — natural attention window',
      avoidWindow:  highAnx   ? 'Avoid enrichment within 1 hour of any stress events' : 'Avoid late-evening enrichment that increases arousal before sleep',
      dailyMinimum: '15 minutes mental enrichment regardless of physical exercise level',
    },
    calmPeriods: {
      icon: '🌿',
      recommendation: highAnx ? '2× daily enforced calm periods of 30+ minutes. No attention-seeking rewarded during these windows.' : '1× post-exercise calm period of 20 minutes supports emotional regulation.',
      technique: 'Scatter feeding into the calm space, then leave quietly. Let the dog self-regulate.',
    },
    socialExposure: {
      icon: '🦋',
      frequency:  (ind.socialisation || 50) > 60 ? 'Limit to 1–2 controlled social exposures per week to avoid overload' : '2–3 positive social interactions per week to build confidence',
      guidance:   children ? 'Supervised child interactions only. Teach children to approach from the side, avoid direct eye contact, and allow the dog to disengage.' : 'Positive, brief, and always allowing the dog to choose distance.',
    },
  }
}

// ─────────────────────────────────────────────────────────────
// PRIVATE EVENTS SYSTEM
// ─────────────────────────────────────────────────────────────
export const ACADEMY_EVENTS = [
  {
    id: 'transformation_workshop',
    title: 'Private Transformation Workshop',
    subtitle: 'One-to-one intensive behaviour session',
    icon: '🎯',
    type: 'Workshop',
    duration: '3 hours',
    tier: 'Elite',
    colour: '#C9A84C',
    description: 'A fully personalised intensive session addressing your dog\'s primary behaviour challenges with a senior behaviourist.',
    availability: 'By appointment only',
    invitation: true,
  },
  {
    id: 'behavioural_masterclass',
    title: 'Elite Behavioural Masterclass',
    subtitle: 'Advanced group coaching for programme graduates',
    icon: '🏛️',
    type: 'Masterclass',
    duration: '4 hours',
    tier: 'Platinum',
    colour: '#E8F0FE',
    description: 'An exclusive group session for academy graduates, covering advanced behaviour science, case studies, and elite training techniques.',
    availability: 'Quarterly cohort',
    invitation: true,
  },
  {
    id: 'concierge_consultation',
    title: 'Concierge Consultation',
    subtitle: 'Priority private consultation with your behaviourist',
    icon: '💎',
    type: 'Consultation',
    duration: '60 min',
    tier: 'All members',
    colour: '#9FDBFF',
    description: 'A scheduled private consultation to review your dog\'s progress, address specific concerns, and update your transformation plan.',
    availability: 'Monthly allocation',
    invitation: false,
  },
  {
    id: 'vip_academy_day',
    title: 'VIP Academy Experience Day',
    subtitle: 'Immersive transformation day at the academy facility',
    icon: '👑',
    type: 'VIP Experience',
    duration: 'Full day',
    tier: 'Founders Circle',
    colour: '#F59E0B',
    description: 'A full-day private academy experience: facility tour, advanced practical sessions, one-to-one coaching, and a luxury lunch with the head behaviourist.',
    availability: 'Annual invitation',
    invitation: true,
  },
]

// ─────────────────────────────────────────────────────────────
// TRANSFORMATION MAP DATA
// ─────────────────────────────────────────────────────────────
export function buildTransformationMap(dogProfile, behaviourScores, completedLessons, milestones, achievements) {
  if (!dogProfile) return null

  const name    = dogProfile.name || 'your companion'
  const lessons = completedLessons || 0

  const nodes = [
    { id: 'start',       label: 'Journey Begins',        icon: '🌱', x: 5,  y: 85, achieved: true,               lessons: 0  },
    { id: 'foundation',  label: 'Foundation Built',       icon: '🏛️', x: 20, y: 70, achieved: lessons >= 3,        lessons: 3  },
    { id: 'confidence1', label: 'First Confidence Win',   icon: '✨', x: 35, y: 55, achieved: lessons >= 7,        lessons: 7  },
    { id: 'stability',   label: 'Stability Emerging',     icon: '🌿', x: 50, y: 45, achieved: lessons >= 12,       lessons: 12 },
    { id: 'mastery1',    label: 'Skill Mastery Begins',   icon: '🎯', x: 65, y: 35, achieved: lessons >= 20,       lessons: 20 },
    { id: 'elite',       label: 'Elite Companion',        icon: '⭐', x: 80, y: 25, achieved: lessons >= 35,       lessons: 35 },
    { id: 'summit',      label: 'Transformation Summit',  icon: '👑', x: 92, y: 15, achieved: lessons >= 50,       lessons: 50 },
  ]

  const currentNode = [...nodes].reverse().find(n => n.achieved) || nodes[0]
  const nextNode    = nodes.find(n => !n.achieved)

  return { nodes, currentNode, nextNode, name, lessons }
}

// ─────────────────────────────────────────────────────────────
// ENVIRONMENTAL PROFILING
// ─────────────────────────────────────────────────────────────
export function buildEnvironmentalProfile(clientProfile, dogProfile, behaviourScores) {
  if (!clientProfile) return null

  const env       = clientProfile.homeEnvironment || ''
  const household = clientProfile.householdType   || ''
  const lifestyle = clientProfile.lifestyle        || ''
  const ind       = behaviourScores?.individual    || {}
  const { anxiety = 5 } = dogProfile || {}

  const noiseLevel    = env.includes('busy') || env.includes('flat') ? 'high' : env.includes('rural') ? 'low' : 'moderate'
  const spaceAccess   = env.includes('large') || env.includes('rural') ? 'excellent' : env.includes('small garden') ? 'moderate' : 'limited'
  const householdBusy = household.includes('children') || lifestyle.includes('busy') ? 'high' : 'moderate'
  const otherAnimals  = household.toLowerCase().includes('other') || household.toLowerCase().includes('cat') ? true : false

  const compatibilityScore = Math.round(
    (spaceAccess === 'excellent' ? 30 : spaceAccess === 'moderate' ? 20 : 10) +
    (noiseLevel  === 'low'       ? 25 : noiseLevel === 'moderate'  ? 18 : 10) +
    (householdBusy === 'moderate'? 20 : 12) +
    (otherAnimals                ? 10 : 15) +
    ((10 - anxiety) * 1.5)
  )

  const adaptations = []
  if (noiseLevel === 'high')      adaptations.push('Sound desensitisation programme recommended')
  if (spaceAccess === 'limited')  adaptations.push('Creative indoor enrichment essential — minimum 20 min daily')
  if (householdBusy === 'high')   adaptations.push('Designated quiet zone required away from household activity')
  if (otherAnimals)               adaptations.push('Multi-pet harmony protocol — individual sessions essential')
  if (adaptations.length === 0)   adaptations.push('Environmental conditions are optimal for behaviour work')

  return {
    noiseLevel,
    spaceAccess,
    householdActivity: householdBusy,
    otherAnimals,
    compatibilityScore: Math.min(100, compatibilityScore),
    adaptations,
  }
}
