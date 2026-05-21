// ─────────────────────────────────────────────────────────────
// FOUR PAWS — CANINE PERSONALITY ARCHETYPES
// Offline AI categorisation of dog personality for personalised
// recommendations, language, and coaching approaches.
// ─────────────────────────────────────────────────────────────

export const PERSONALITY_ARCHETYPES = {
  GUARDIAN: {
    id:           'guardian',
    name:         'The Guardian',
    icon:         '🛡️',
    emoji:        '🛡️',
    tagline:      'Loyal protector with deep bonds',
    description:  'Deeply loyal and protective, the Guardian dog forms intense bonds with their family. They are watchful, discerning with strangers, and highly responsive to perceived threats. Their strength lies in devotion; their challenge lies in relaxing that vigilance.',
    traits:       ['Loyal', 'Watchful', 'Territorial', 'Discerning', 'Protective'],
    trainingFocus: ['Threshold management', 'Stranger socialisation', 'Relaxation protocols', 'Cued settle'],
    enrichment:   ['Scent tracking games', 'Boundary work', 'One-on-one engagement', 'Problem-solving activities'],
    colour:       '#8B5CF6',
    gradient:     'from-purple-900/40 to-violet-900/20',
    medalColour:  '#8B5CF6',
  },
  EXPLORER: {
    id:           'explorer',
    name:         'The Explorer',
    icon:         '🧭',
    emoji:        '🧭',
    tagline:      'Adventurous mind in constant discovery',
    description:  'Insatiably curious, the Explorer dog lives to investigate. Every walk is a research expedition, every new environment a puzzle to solve. Their energy and intelligence demand rich, varied stimulation — without it, creativity finds less desirable outlets.',
    traits:       ['Curious', 'Energetic', 'Independent', 'Intelligent', 'Motivated'],
    trainingFocus: ['Recall reliability', 'Impulse control', 'Focus building', 'Channelled energy work'],
    enrichment:   ['Nose work', 'Exploration walks in new environments', 'Complex puzzle feeders', 'Tracking games'],
    colour:       '#F59E0B',
    gradient:     'from-amber-900/40 to-yellow-900/20',
    medalColour:  '#F59E0B',
  },
  SENSITIVE_COMPANION: {
    id:           'sensitive_companion',
    name:         'The Sensitive Companion',
    icon:         '🌸',
    emoji:        '🌸',
    tagline:      'Deeply feeling, beautifully attuned',
    description:  'The Sensitive Companion feels everything deeply — environmental changes, emotional shifts in their person, subtle disruptions to routine. They are exquisitely attuned and offer profound emotional connection. Their challenge is resilience in an unpredictable world.',
    traits:       ['Empathetic', 'Gentle', 'Perceptive', 'Anxious', 'Deeply bonded'],
    trainingFocus: ['Confidence foundations', 'Optimism training', 'Independence work', 'Desensitisation'],
    enrichment:   ['Calm, predictable enrichment', 'Lickimats', 'Gentle scent work', 'Slow sniff walks'],
    colour:       '#EC4899',
    gradient:     'from-pink-900/40 to-rose-900/20',
    medalColour:  '#EC4899',
  },
  ENERGETIC_LEADER: {
    id:           'energetic_leader',
    name:         'The Energetic Leader',
    icon:         '⚡',
    emoji:        '⚡',
    tagline:      'High-octane natural drive',
    description:  'Boundless energy, natural initiative, and an innate drive to be at the front — the Energetic Leader thrives when given purpose and clear direction. Without sufficient outlet and structure, that drive redirects into reactivity, mischief, and frustration behaviour.',
    traits:       ['High-energy', 'Driven', 'Reactive', 'Bold', 'Persistent'],
    trainingFocus: ['Arousal regulation', 'Impulse control', 'Engagement training', 'Calm on cue'],
    enrichment:   ['High-intensity physical exercise', 'Tug games with rules', 'Sprint drills', 'Agility foundations'],
    colour:       '#EF4444',
    gradient:     'from-red-900/40 to-orange-900/20',
    medalColour:  '#EF4444',
  },
  CALM_OBSERVER: {
    id:           'calm_observer',
    name:         'The Calm Observer',
    icon:         '🌿',
    emoji:        '🌿',
    tagline:      'Steady presence, considered responses',
    description:  'The Calm Observer takes life at their own measured pace. Thoughtful, gentle, and selective about engagement — they are the dog that watches before acting. Their steadiness is a gift; their occasional aloofness simply means connection must be earned, not assumed.',
    traits:       ['Steady', 'Independent', 'Thoughtful', 'Selective', 'Gentle'],
    trainingFocus: ['Motivation building', 'Engagement training', 'Social confidence', 'Value building'],
    enrichment:   ['Solo enrichment activities', 'Sniff walks at natural pace', 'Calm foraging', 'Choice-based activities'],
    colour:       '#10B981',
    gradient:     'from-emerald-900/40 to-green-900/20',
    medalColour:  '#10B981',
  },
  SOCIAL_BUTTERFLY: {
    id:           'social_butterfly',
    name:         'The Social Butterfly',
    icon:         '🦋',
    emoji:        '🦋',
    tagline:      'Every person is a new best friend',
    description:  'Effortlessly social, the Social Butterfly lights up in company. They collect admirers wherever they go and find life most enjoyable when shared. The challenge lies in selective greeting, calm approaches, and maintaining focus in stimulating environments.',
    traits:       ['Sociable', 'Enthusiastic', 'Over-greeting', 'People-oriented', 'Exuberant'],
    trainingFocus: ['Calm greetings', 'Four-paws protocol', 'Focus amid distraction', 'Self-regulation'],
    enrichment:   ['Structured socialisation', 'Group classes', 'Reward-based greeting practice', 'Agility or sport'],
    colour:       '#06B6D4',
    gradient:     'from-cyan-900/40 to-sky-900/20',
    medalColour:  '#06B6D4',
  },
}

/**
 * Determine personality archetype from behaviour scores.
 * Returns the archetype object.
 */
export function getArchetype(behaviourScores, dogProfile) {
  if (!behaviourScores) return PERSONALITY_ARCHETYPES.CALM_OBSERVER

  const { individual = {} } = behaviourScores
  const {
    anxiety = 0, reactivity = 0, confidence = 0,
    socialisation = 0, energy = 0, aggression = 0,
  } = individual

  // Score each archetype
  const scores = {
    GUARDIAN:            reactivity * 0.4 + aggression * 0.4 + (100 - socialisation) * 0.2,
    EXPLORER:            energy * 0.4 + confidence * 0.3 + (100 - anxiety) * 0.3,
    SENSITIVE_COMPANION: anxiety * 0.4 + (100 - confidence) * 0.35 + (100 - energy) * 0.25,
    ENERGETIC_LEADER:    energy * 0.45 + reactivity * 0.35 + (100 - anxiety) * 0.2,
    CALM_OBSERVER:       (100 - energy) * 0.4 + (100 - reactivity) * 0.3 + (100 - socialisation) * 0.3,
    SOCIAL_BUTTERFLY:    socialisation * 0.5 + energy * 0.3 + (100 - anxiety) * 0.2,
  }

  const winner = Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0]
  return PERSONALITY_ARCHETYPES[winner]
}

/**
 * Get a short archetype label for display in compact UI.
 */
export function getArchetypeShort(archetype) {
  if (!archetype) return null
  return { icon: archetype.icon, name: archetype.name, colour: archetype.colour }
}

// ─────────────────────────────────────────────────────────────
// ELITE CLIENT TIERS
// ─────────────────────────────────────────────────────────────
export const CLIENT_TIERS = {
  GOLD: {
    id:       'gold',
    name:     'Gold Member',
    icon:     '🥇',
    colour:   '#C9A84C',
    gradient: 'from-yellow-900/30 to-amber-900/20',
    border:   'border-yellow-500/30',
    minLessons: 0,
    benefits: ['Full course library', 'AI behaviour coaching', 'Progress analytics', 'Emergency guidance'],
  },
  PLATINUM: {
    id:       'platinum',
    name:     'Platinum Companion',
    icon:     '💎',
    colour:   '#E5E7EB',
    gradient: 'from-slate-800/40 to-gray-800/20',
    border:   'border-slate-400/30',
    minLessons: 15,
    benefits: ['All Gold benefits', 'Priority messaging', 'Behaviour timeline', 'Multi-dog profiles', 'Puppy Passport'],
  },
  ELITE: {
    id:       'elite',
    name:     'Elite Transformation',
    icon:     '⭐',
    colour:   '#818CF8',
    gradient: 'from-indigo-900/40 to-purple-900/20',
    border:   'border-indigo-400/30',
    minLessons: 30,
    benefits: ['All Platinum benefits', 'AI Concierge Voice Mode', 'Predictive alerts', 'White-glove onboarding', 'Exclusive add-ons'],
  },
  FOUNDERS: {
    id:       'founders',
    name:     "Founders' Circle",
    icon:     '👑',
    colour:   '#F59E0B',
    gradient: 'from-amber-900/40 to-orange-900/20',
    border:   'border-amber-400/30',
    minLessons: 50,
    benefits: ['All Elite benefits', 'Founders recognition', 'Concierge direct line', 'Beta feature access', 'Annual Academy Review'],
  },
}

export function getClientTier(completedLessons = 0) {
  if (completedLessons >= 50) return CLIENT_TIERS.FOUNDERS
  if (completedLessons >= 30) return CLIENT_TIERS.ELITE
  if (completedLessons >= 15) return CLIENT_TIERS.PLATINUM
  return CLIENT_TIERS.GOLD
}

// ─────────────────────────────────────────────────────────────
// ENVIRONMENT INTELLIGENCE
// ─────────────────────────────────────────────────────────────
export const ENVIRONMENT_PROFILES = {
  'Small flat / apartment':        { challenge: 'high',   enrichmentBoost: ['scent_work', 'indoor_foraging', 'decompression'], note: 'Limited space requires creative enrichment to meet physical and mental needs.' },
  'House with small garden':       { challenge: 'medium', enrichmentBoost: ['garden_sniff', 'fetch', 'sunbathing'], note: 'Moderate outdoor access is excellent for regulation with supplementary walks.' },
  'House with large garden':       { challenge: 'low',    enrichmentBoost: ['free_exploration', 'garden_games', 'digging_zone'], note: 'Garden access provides excellent natural enrichment and decompression opportunity.' },
  'Rural property with land':      { challenge: 'low',    enrichmentBoost: ['tracking', 'long_line_exploration', 'nature_exposure'], note: 'Rural environments provide exceptional sensory enrichment and natural behaviour outlets.' },
  'Property near busy roads':      { challenge: 'high',   enrichmentBoost: ['indoor_enrichment', 'calm_parallel_walks', 'protected_garden'], note: 'Traffic exposure requires managed desensitisation and alternative enrichment sources.' },
  'Property in quiet area':        { challenge: 'low',    enrichmentBoost: ['neighbourhood_exploration', 'social_walks', 'off_lead_time'], note: 'Low-stimulation base provides ideal recovery environment between training exposures.' },
}

export function getEnvironmentInsight(homeEnvironment, dogProfile) {
  const env  = ENVIRONMENT_PROFILES[homeEnvironment]
  if (!env)  return null
  const dog  = dogProfile?.name || 'your companion'
  return {
    challenge:     env.challenge,
    enrichmentBoost: env.enrichmentBoost,
    note:          env.note.replace('your companion', dog),
  }
}

// ─────────────────────────────────────────────────────────────
// INTELLIGENCE SCORING ENGINE — Extended
// ─────────────────────────────────────────────────────────────
export function computeIntelligenceScores(behaviourScores, completedLessons, streakData) {
  if (!behaviourScores) return null
  const { individual = {}, overall = 50 } = behaviourScores
  const streak   = streakData?.current || 0
  const lessons  = completedLessons || 0

  // Confidence score — inverse of concern
  const confidence = Math.max(0, Math.min(100, 100 - (individual.confidence || 50)))
  // Stability score — composite
  const stability  = Math.max(0, Math.min(100, Math.round(
    (100 - (individual.anxiety || 50)) * 0.4 +
    (100 - (individual.reactivity || 50)) * 0.35 +
    (100 - (individual.aggression || 0)) * 0.25
  )))
  // Focus score — based on training consistency
  const focus      = Math.min(100, Math.round(lessons * 3 + streak * 5))
  // Recovery score — based on training history
  const recovery   = Math.min(100, Math.round(
    (100 - (individual.fearfulness || 50)) * 0.5 +
    (100 - (individual.anxiety || 50)) * 0.5
  ))
  // Enrichment score — based on streak
  const enrichment = Math.min(100, streak * 15 + (lessons > 10 ? 25 : 0))
  // Social score
  const social     = Math.max(0, Math.min(100, 100 - (individual.socialisation || 50)))

  return { confidence, stability, focus, recovery, enrichment, social }
}
