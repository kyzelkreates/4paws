// ─────────────────────────────────────────────────────────────
// FOUR PAWS — AI CONCIERGE PERSONALITY ENGINE
// Offline. No APIs. Generates elegant, personalised coaching
// copy for every context the platform encounters.
// ─────────────────────────────────────────────────────────────

import { PERSONALITY_ARCHETYPES, getArchetype } from './archetypes'
import { CONCERN_LEVELS } from './behaviourEngine'

// ─────────────────────────────────────────────────────────────
// GREETING ENGINE
// ─────────────────────────────────────────────────────────────
const MORNING_GREETINGS = [
  (c, d) => `Good morning, ${c}. ${d} begins a new chapter today.`,
  (c, d) => `A new day, ${c}. The work you do with ${d} compounds beautifully.`,
  (c, d) => `Good morning. ${d}'s transformation continues — every session matters.`,
  (c, d) => `${c}, the morning is ideal for ${d}'s focus work. Begin when you're ready.`,
  (c, d) => `Good morning, ${c}. ${d} is primed for today's session.`,
]
const AFTERNOON_GREETINGS = [
  (c, d) => `Good afternoon, ${c}. How is ${d} responding today?`,
  (c, d) => `${c}, the afternoon is perfect for enrichment with ${d}.`,
  (c, d) => `Good afternoon. ${d}'s afternoon session will consolidate this morning's gains.`,
  (c, d) => `Welcome back, ${c}. ${d} will appreciate your attention right now.`,
]
const EVENING_GREETINGS = [
  (c, d) => `Good evening, ${c}. A calm close to the day benefits ${d} immensely.`,
  (c, d) => `${c}, evening is an excellent time to reflect on ${d}'s progress today.`,
  (c, d) => `Good evening. ${d} is winding down — perfect for calm reinforcement.`,
  (c, d) => `The day draws to a close, ${c}. ${d} has worked well.`,
]
const RETURN_GREETINGS = [
  (c, d) => `Welcome back, ${c}. ${d} has been waiting for you.`,
  (c, d) => `${c}, your consistency is what separates good from exceptional. ${d} reflects that.`,
  (c, d) => `Good to have you back, ${c}. ${d}'s programme is ready to continue.`,
]

export function getDynamicGreeting(clientName, dogName, sessionCount = 0) {
  const firstName = (clientName || 'there').split(' ')[0]
  const dog       = dogName || 'your companion'
  const hour      = new Date().getHours()

  if (sessionCount > 5) {
    const idx = sessionCount % RETURN_GREETINGS.length
    return RETURN_GREETINGS[idx](firstName, dog)
  }
  if (hour < 12) {
    const idx = Math.floor(Math.random() * MORNING_GREETINGS.length)
    return MORNING_GREETINGS[idx](firstName, dog)
  }
  if (hour < 17) {
    const idx = Math.floor(Math.random() * AFTERNOON_GREETINGS.length)
    return AFTERNOON_GREETINGS[idx](firstName, dog)
  }
  const idx = Math.floor(Math.random() * EVENING_GREETINGS.length)
  return EVENING_GREETINGS[idx](firstName, dog)
}

// ─────────────────────────────────────────────────────────────
// CONCIERGE COACHING SUMMARIES
// ─────────────────────────────────────────────────────────────
const COACHING_TEMPLATES = {
  // confidence low
  confidence_low: [
    (c, d) => `${d} is working through a period of environmental uncertainty, ${c}. The confidence protocols in your programme are precisely calibrated for this phase.`,
    (c, d) => `Confidence recovery is a gradual process — ${d}'s current profile indicates an opportunity for structured optimism training. Patience yields compounding results.`,
    (c, d) => `${d}'s confidence scores suggest a sensitive disposition. ${c}, the Confidence Building module will address this systematically.`,
  ],
  // anxiety high
  anxiety_high: [
    (c, d) => `${d}'s anxiety indicators are elevated. ${c}, focusing on calm reinforcement before advancing to new stimuli will accelerate recovery.`,
    (c, d) => `The data suggests ${d} is experiencing heightened arousal. Structured decompression — not avoidance — is the prescribed path forward.`,
    (c, d) => `${d}'s anxiety profile warrants a measured approach. ${c}, the foundation modules were designed precisely for this starting point.`,
  ],
  // reactivity high
  reactivity_high: [
    (c, d) => `${d} demonstrates significant environmental reactivity. ${c}, threshold management and controlled exposure will be your most powerful tools.`,
    (c, d) => `Reactive behaviour in ${d} is a communication signal, not a character flaw. ${c}, the Behaviour Foundations programme addresses this comprehensively.`,
    (c, d) => `${d}'s reactivity profile is manageable with the right architecture. ${c}, your programme is sequenced to address the root cause, not just the symptom.`,
  ],
  // progressing well
  progressing: [
    (c, d) => `${d} is demonstrating consistent improvement across all measured behaviours. ${c}, your commitment is translating directly into results.`,
    (c, d) => `The trajectory is excellent, ${c}. ${d} is responding to structured training with above-average responsiveness.`,
    (c, d) => `${d} is progressing exceptionally well. ${c}, the combination of consistent practice and this programme is producing measurable transformation.`,
  ],
  // puppy
  puppy: [
    (c, d) => `${d}'s foundational period is a precious window, ${c}. The experiences you curate now shape a lifetime of behaviour.`,
    (c, d) => `${d} is in the optimal imprinting phase. ${c}, every positive interaction you create now is an investment with compounding returns.`,
  ],
  // senior
  senior: [
    (c, d) => `${d}'s maturity is an asset, ${c}. Experienced dogs often respond to structured training with remarkable depth.`,
    (c, d) => `${d} brings wisdom to the work, ${c}. The programme adapts to honour experience while building new neural pathways.`,
  ],
  // default
  default: [
    (c, d) => `${d}'s transformation is underway, ${c}. Each session compounds the last — consistency is your greatest lever.`,
    (c, d) => `${c}, ${d}'s programme is designed around their specific profile. Trust the sequence.`,
    (c, d) => `The science of behaviour change is on your side, ${c}. ${d} is in exceptional hands.`,
  ],
}

export function getConciergeCoachingSummary(clientName, dogName, behaviourScores, ageMonths = 12, completedLessons = 0) {
  const firstName = (clientName || '').split(' ')[0] || 'you'
  const dog       = dogName || 'your companion'

  if (!behaviourScores) return COACHING_TEMPLATES.default[0](firstName, dog)

  const { individual = {} } = behaviourScores

  // Pick the most relevant template based on scores
  if (ageMonths < 8)                                   return pick(COACHING_TEMPLATES.puppy, firstName, dog)
  if (ageMonths > 84)                                  return pick(COACHING_TEMPLATES.senior, firstName, dog)
  if ((individual.anxiety || 0) > 65)                  return pick(COACHING_TEMPLATES.anxiety_high, firstName, dog)
  if ((individual.reactivity || 0) > 60)               return pick(COACHING_TEMPLATES.reactivity_high, firstName, dog)
  if ((individual.confidence || 0) > 60)               return pick(COACHING_TEMPLATES.confidence_low, firstName, dog)
  if (completedLessons > 5)                            return pick(COACHING_TEMPLATES.progressing, firstName, dog)
  return pick(COACHING_TEMPLATES.default, firstName, dog)
}

function pick(arr, ...args) {
  return arr[Math.floor(Date.now() / 86400000) % arr.length](...args)
}

// ─────────────────────────────────────────────────────────────
// SMART RECOMMENDATION COPY
// ─────────────────────────────────────────────────────────────
export function getConciergeRecommendationReason(courseId, behaviourScores, dogName) {
  const dog = dogName || 'your companion'
  const reasons = {
    'course-1': `${dog}'s foundational profile is the ideal starting point for this programme.`,
    'course-2': `Advanced techniques are appropriate given ${dog}'s current progress trajectory.`,
    'course-3': `${dog}'s reactivity profile aligns precisely with this programme's methodology.`,
    'course-4': `Confidence recovery is ${dog}'s primary development area — this programme addresses it directly.`,
    'course-5': `${dog}'s puppy phase makes this programme a high-priority investment.`,
    'course-6': `${dog}'s complex anxiety profile warrants this specialist programme.`,
  }
  return reasons[courseId] || `This programme is sequenced for ${dog}'s specific transformation needs.`
}

// ─────────────────────────────────────────────────────────────
// DAILY TRANSFORMATION INSIGHTS
// ─────────────────────────────────────────────────────────────
const DAILY_INSIGHTS = [
  (d) => `${d} is building a new relationship with uncertainty — every calm moment is a neural pathway being forged.`,
  (d) => `The compound effect of consistent training is invisible day to day, but transformative over months. Trust the process.`,
  (d) => `${d}'s nervous system is adapting. Behaviour change is not linear — plateaus precede breakthroughs.`,
  (d) => `Enrichment is not a supplement to training — it is the foundation upon which all behaviour rests.`,
  (d) => `${d} communicates through behaviour. Every response is information. Observe before you react.`,
  (d) => `Calm handling creates calm dogs. Your nervous system is the most powerful training tool you possess.`,
  (d) => `${d}'s most confident moments are worth capturing — they become the template for future growth.`,
  (d) => `Progress in behaviour is measured in trends, not days. Step back and observe the trajectory.`,
  (d) => `The relationship between ${d} and you is the infrastructure upon which all training is built.`,
  (d) => `${d} is not being difficult — they are communicating a need. Meeting that need is the work.`,
  (d) => `Repetition creates reliability. ${d}'s responses will solidify with consistent, calm practice.`,
  (d) => `Every threshold moment is an opportunity. Managing distance and intensity is the art of this work.`,
]

export function getDailyTransformationInsight(dogName, dayIndex) {
  const dog = dogName || 'your companion'
  const idx = (dayIndex || Math.floor(Date.now() / 86400000)) % DAILY_INSIGHTS.length
  return DAILY_INSIGHTS[idx](dog)
}

// ─────────────────────────────────────────────────────────────
// LESSON PRIORITISATION ENGINE
// ─────────────────────────────────────────────────────────────
export function prioritiseLessons(courseModules, behaviourScores, dogProfile) {
  if (!courseModules || !behaviourScores) return {}

  const priorityMap = {}
  const { individual = {} } = behaviourScores

  courseModules.forEach(module => {
    module.lessons.forEach(lesson => {
      let priority = 0
      const title = lesson.title.toLowerCase()

      // Keyword weighting against behaviour profile
      if (title.includes('confidence') && (individual.confidence || 0) > 50)  priority += 3
      if (title.includes('anxiety') && (individual.anxiety || 0) > 50)        priority += 3
      if (title.includes('reactiv') && (individual.reactivity || 0) > 50)     priority += 3
      if (title.includes('social') && (individual.socialisation || 0) > 50)   priority += 2
      if (title.includes('calm') || title.includes('settle'))                 priority += 1
      if (title.includes('foundation') || title.includes('basic'))            priority += 1

      priorityMap[lesson.id] = priority
    })
  })

  return priorityMap
}

// ─────────────────────────────────────────────────────────────
// PREDICTIVE BEHAVIOUR ALERTS
// ─────────────────────────────────────────────────────────────
export const ALERT_TYPES = {
  STRESS_ESCALATION:    { id: 'stress_escalation',    level: 'high',   icon: '⚡', colour: 'text-red-400',    bgColour: 'bg-red-400/8',    border: 'border-red-400/20' },
  SOCIAL_FATIGUE:       { id: 'social_fatigue',       level: 'medium', icon: '😔', colour: 'text-amber-400',  bgColour: 'bg-amber-400/8',  border: 'border-amber-400/20' },
  OVERSTIMULATION:      { id: 'overstimulation',      level: 'high',   icon: '🌀', colour: 'text-orange-400', bgColour: 'bg-orange-400/8', border: 'border-orange-400/20' },
  BEHAVIOUR_REGRESSION: { id: 'behaviour_regression', level: 'medium', icon: '📉', colour: 'text-yellow-400', bgColour: 'bg-yellow-400/8', border: 'border-yellow-400/20' },
  LOW_ENRICHMENT:       { id: 'low_enrichment',       level: 'low',    icon: '🌿', colour: 'text-gold-400',   bgColour: 'bg-gold-400/8',   border: 'border-gold-400/20' },
  OPTIMAL_STATE:        { id: 'optimal_state',        level: 'good',   icon: '✨', colour: 'text-emerald-400',bgColour: 'bg-emerald-400/8',border: 'border-emerald-400/20' },
}

export function generatePredictiveAlerts(behaviourScores, dogProfile, streakData, completedLessons) {
  if (!behaviourScores) return []
  const alerts = []
  const { individual = {}, overall = 50 } = behaviourScores
  const streak = streakData?.current || 0

  if ((individual.anxiety || 0) > 70 && (individual.reactivity || 0) > 60) {
    alerts.push({
      ...ALERT_TYPES.STRESS_ESCALATION,
      title:      'Stress Escalation Risk',
      summary:    `${dogProfile?.name || 'Your dog'}'s combined anxiety and reactivity scores suggest an elevated stress threshold. Consider reducing environmental demands this session.`,
      actions:    ['Reduce session duration by 30%', 'Prioritise decompression activities', 'Avoid new stimuli today', 'Review Emergency Calm Protocol'],
    })
  }

  if ((individual.socialisation || 0) > 65 && (individual.energy || 0) > 70) {
    alerts.push({
      ...ALERT_TYPES.SOCIAL_FATIGUE,
      title:      'Social Fatigue Pattern',
      summary:    `${dogProfile?.name || 'Your dog'}'s social and energy profile indicates potential over-stimulation from group settings.`,
      actions:    ['Introduce one-on-one interaction only', 'End sessions before fatigue onset', 'Increase recovery time between social events'],
    })
  }

  if ((individual.energy || 0) > 80) {
    alerts.push({
      ...ALERT_TYPES.OVERSTIMULATION,
      title:      'Overstimulation Risk',
      summary:    `High energy scores combined with environmental reactivity suggest a risk of overstimulation. Controlled exercise before training improves receptivity.`,
      actions:    ['20-minute structured decompression walk before sessions', 'Use scatter feeding for mental engagement', 'Implement calm settling protocols'],
    })
  }

  if (streak < 3 && completedLessons > 5) {
    alerts.push({
      ...ALERT_TYPES.BEHAVIOUR_REGRESSION,
      title:      'Consistency Gap Detected',
      summary:    `Training gaps allow behaviour patterns to revert. ${dogProfile?.name || 'Your dog'}'s progress is best protected with daily micro-sessions.`,
      actions:    ['Aim for a 5-minute session today', 'Use meal times as training opportunities', 'Revisit most recently completed lesson'],
    })
  }

  if (streak < 2) {
    alerts.push({
      ...ALERT_TYPES.LOW_ENRICHMENT,
      title:      'Enrichment Deficit Risk',
      summary:    `Behavioural stability correlates directly with enrichment volume. Low session frequency increases frustration behaviours.`,
      actions:    ['Introduce a scatter feed today', 'Offer a novel scent experience', 'Complete a single lesson from your programme'],
    })
  }

  if (alerts.length === 0 && overall < 40) {
    alerts.push({
      ...ALERT_TYPES.OPTIMAL_STATE,
      title:      'Optimal Training State',
      summary:    `${dogProfile?.name || 'Your dog'}'s current profile indicates an ideal window for learning. Capitalise on this receptive state today.`,
      actions:    ['Advance to the next lesson module', 'Introduce a new challenge exercise', 'Practice a new context for existing skills'],
    })
  }

  return alerts
}

// ─────────────────────────────────────────────────────────────
// EMERGENCY BEHAVIOUR SYSTEM
// ─────────────────────────────────────────────────────────────
export const EMERGENCY_SCENARIOS = [
  { id: 'reactive',          label: 'Reactive Outburst',      icon: '⚡', description: 'Lunging, barking, pulling towards triggers' },
  { id: 'panic',             label: 'Panic Episode',          icon: '😰', description: 'Trembling, hiding, shutting down' },
  { id: 'barking',           label: 'Excessive Barking',      icon: '🔊', description: 'Persistent, uncontrollable vocalisation' },
  { id: 'fear',              label: 'Fear Response',          icon: '😨', description: 'Cowering, fleeing, defensive behaviour' },
  { id: 'separation',        label: 'Separation Distress',    icon: '💔', description: 'Destructive behaviour when alone' },
  { id: 'aggression',        label: 'Aggressive Display',     icon: '⚠️',  description: 'Growling, snapping, posturing' },
  { id: 'overstimulation',   label: 'Overstimulation',        icon: '🌀', description: 'Unable to settle, hyper-arousal spiral' },
]

const EMERGENCY_PROTOCOLS = {
  reactive: {
    title: 'Reactive Recovery Protocol',
    immediateSteps: [
      'Increase distance from the trigger immediately — space is your most powerful tool.',
      'Turn away from the trigger. Walk parallel, not directly toward or away.',
      'Find a threshold distance where your dog can breathe and observe without reacting.',
      'Mark and reward any moment of disengagement, however brief.',
      'End the exposure on a positive note — do not push through heightened arousal.',
    ],
    recoveryActivities: [
      'Scatter feeding in a quiet space (15 minutes)',
      'Slow sniff walk in a low-stimulation environment',
      'Chew activity — frozen Kong or natural chew',
      'Body awareness exercises — calm mat work',
    ],
    preventionNote: 'Reactive behaviour is driven by an emotional state, not disobedience. Consistent threshold management, over time, expands the window of tolerance.',
  },
  panic: {
    title: 'Panic Decompression Protocol',
    immediateSteps: [
      'Remove your dog from the trigger environment immediately.',
      'Avoid restraining or forcing comfort — give space first.',
      'Lower your own arousal — breathe slowly and move calmly.',
      'Sit on the floor at your dog\'s level without direct eye contact.',
      'Allow approach on their terms. Gentle contact only when initiated by them.',
    ],
    recoveryActivities: [
      'Safe space decompression — covered crate or quiet room (30+ minutes)',
      'Gentle TTouch body circles if accepted',
      'White noise or calm music in the background',
      'Lickimat with low-value spread for gentle engagement',
    ],
    preventionNote: 'Panic responses indicate a sensitised nervous system. Predictability and controlled exposure are the long-term solutions.',
  },
  barking: {
    title: 'Vocalisation Management Protocol',
    immediateSteps: [
      'Do not repeat commands — this increases arousal.',
      'Identify and if possible remove the trigger.',
      'Interrupt with a scatter of high-value food on the floor.',
      'Redirect to an incompatible behaviour — sniffing interrupts barking.',
      'Once calm, mark and reward the quiet moment.',
    ],
    recoveryActivities: [
      'Long-line sniff walk (20–30 minutes)',
      'Mental engagement — find-it games indoors',
      'Stuffed Kong or puzzle feeder',
      'Calm settle training on mat',
    ],
    preventionNote: 'Consistent barking indicates unmet needs: attention, alerting, or frustration. Identify the function before addressing the form.',
  },
  fear: {
    title: 'Fear Recovery Protocol',
    immediateSteps: [
      'Create immediate distance from the fear stimulus.',
      'Adopt a calm, neutral posture — avoid looming or reaching over.',
      'Do not force your dog to confront what frightens them.',
      'Allow your dog to navigate the distance themselves.',
      'Mark and reward any investigative or calm behaviour.',
    ],
    recoveryActivities: [
      'Calm decompression in a familiar, safe environment',
      'Slow, rhythmic TTouch strokes if accepted',
      'Favourite enrichment activity in a quiet space',
      'Short, positive training session with easy, known skills',
    ],
    preventionNote: 'Fear responses require systematic desensitisation over time. Flooding and forced exposure deepen, rather than resolve, fear.',
  },
  separation: {
    title: 'Separation Distress Protocol',
    immediateSteps: [
      'Return calmly and without drama — do not amplify arousal on return.',
      'Ignore initial excitement until your dog reaches a neutral state.',
      'Provide a high-value enrichment item before your next departure.',
      'Begin a departure routine — same sequence every time creates predictability.',
      'Practice very short departures (seconds) and gradually extend.',
    ],
    recoveryActivities: [
      'Frozen stuffed Kong left before departures',
      'Snuffle mat or scatter feeding upon settling',
      'Background white noise or Talk Radio for ambient sound',
      'Departure cue training — short repetitions only',
    ],
    preventionNote: 'Separation distress is an emotional state, not manipulation. Systematic independence training resolves it — punishment increases it.',
  },
  aggression: {
    title: 'Safe Management Protocol',
    immediateSteps: [
      'Create space between your dog and the subject immediately.',
      'Do not physically intervene between two dogs mid-altercation.',
      'Use sound interruption — clap, whistle — to break focus.',
      'Remove your dog from the environment calmly but swiftly.',
      'Contact your behaviour professional before the next similar exposure.',
    ],
    recoveryActivities: [
      'Complete physical and mental decompression — 30+ minutes alone',
      'No further training or stimulation for the remainder of the day',
      'Review the Emergency Behaviour module in your programme',
      'Log the trigger, context, and response for your behaviourist',
    ],
    preventionNote: 'Aggressive displays are a final communication attempt. Management and professional guidance are the appropriate responses.',
  },
  overstimulation: {
    title: 'Arousal Regulation Protocol',
    immediateSteps: [
      'Remove your dog from the stimulating environment immediately.',
      'No further commands, games, or interaction for 5 minutes.',
      'Lead your dog to the quietest available space.',
      'Sit quietly — no eye contact, no stroking, no talking.',
      'Wait for physiological calm — slower breathing, softer body.',
    ],
    recoveryActivities: [
      'Scatter feeding (mental engagement with low physical arousal)',
      'Frozen lickimat in a darkened, quiet space',
      'Long-lasting natural chew',
      'Decompression rest — 45–60 minutes before next stimulation',
    ],
    preventionNote: 'Overstimulation prevents learning and damages threshold. Ending sessions before arousal peaks is always the right choice.',
  },
}

export function getEmergencyProtocol(scenarioId) {
  return EMERGENCY_PROTOCOLS[scenarioId] || EMERGENCY_PROTOCOLS.reactive
}
