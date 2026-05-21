// ─────────────────────────────────────────────────────────────
// FOUR PAWS — ELITE ACHIEVEMENT ARCHITECTURE
// Luxury medallion system. Not badges — earned distinctions.
// ─────────────────────────────────────────────────────────────

export const ACHIEVEMENT_TIERS = {
  BRONZE:   { label: 'Foundation',  colour: '#CD7F32', glow: 'rgba(205,127,50,0.4)'  },
  SILVER:   { label: 'Distinction', colour: '#C0C0C0', glow: 'rgba(192,192,192,0.4)' },
  GOLD:     { label: 'Excellence',  colour: '#C9A84C', glow: 'rgba(201,168,76,0.5)'  },
  PLATINUM: { label: 'Mastery',     colour: '#E8F0FE', glow: 'rgba(232,240,254,0.5)' },
  DIAMOND:  { label: 'Elite',       colour: '#9FDBFF', glow: 'rgba(159,219,255,0.5)' },
}

export const ACHIEVEMENTS = [
  // ── Progress milestones ────────────────────────────────────
  {
    id:          'first_step',
    name:        'First Step Taken',
    distinction: 'Academy Initiated',
    icon:        '🐾',
    tier:        'BRONZE',
    description: 'Your transformation journey has officially begun.',
    unlockCopy:  'The first lesson completed is the most important of all.',
    condition:   (data) => data.completedLessons >= 1,
    category:    'progress',
  },
  {
    id:          'foundation_built',
    name:        'Foundation Built',
    distinction: 'Foundational Excellence',
    icon:        '🏛️',
    tier:        'SILVER',
    description: 'Five lessons completed. The foundation is set.',
    unlockCopy:  'Foundations are invisible from the outside. They hold everything.',
    condition:   (data) => data.completedLessons >= 5,
    category:    'progress',
  },
  {
    id:          'committed_companion',
    name:        'Committed Companion',
    distinction: 'Dedication Recognised',
    icon:        '💫',
    tier:        'SILVER',
    description: 'Ten lessons completed with consistency.',
    unlockCopy:  'Commitment at this level separates the exceptional from the ordinary.',
    condition:   (data) => data.completedLessons >= 10,
    category:    'progress',
  },
  {
    id:          'transformation_underway',
    name:        'Transformation Underway',
    distinction: 'Behavioural Excellence',
    icon:        '🌟',
    tier:        'GOLD',
    description: 'Twenty lessons completed. Real change is taking hold.',
    unlockCopy:  'At this stage, the transformation is measurable. The work is real.',
    condition:   (data) => data.completedLessons >= 20,
    category:    'progress',
  },
  {
    id:          'elite_practitioner',
    name:        'Elite Practitioner',
    distinction: 'Advanced Mastery',
    icon:        '⭐',
    tier:        'GOLD',
    description: 'Thirty lessons completed. Advanced practitioner status.',
    unlockCopy:  'Thirty lessons of structured, intentional practice. Elite territory.',
    condition:   (data) => data.completedLessons >= 30,
    category:    'progress',
  },
  {
    id:          'academy_excellence',
    name:        'Academy Excellence',
    distinction: 'Platinum Standard',
    icon:        '💎',
    tier:        'PLATINUM',
    description: 'Fifty lessons. Platinum Academy standard achieved.',
    unlockCopy:  'Fifty lessons represents a lifetime of behavioural investment.',
    condition:   (data) => data.completedLessons >= 50,
    category:    'progress',
  },
  {
    id:          'grand_masters',
    name:        "Grand Master's Circle",
    distinction: 'Diamond Elite Status',
    icon:        '👑',
    tier:        'DIAMOND',
    description: 'One hundred lessons completed. Diamond status achieved.',
    unlockCopy:  'One hundred lessons. An extraordinary investment in an extraordinary companion.',
    condition:   (data) => data.completedLessons >= 100,
    category:    'progress',
  },

  // ── Streak achievements ─────────────────────────────────────
  {
    id:          'three_day_clarity',
    name:        'Three-Day Clarity',
    distinction: 'Consistency Initiated',
    icon:        '🔥',
    tier:        'BRONZE',
    description: 'Three consecutive days of training.',
    unlockCopy:  'Three days of intention. The habit is forming.',
    condition:   (data) => data.streak >= 3,
    category:    'streak',
  },
  {
    id:          'week_of_excellence',
    name:        'Week of Excellence',
    distinction: 'Seven-Day Mastery',
    icon:        '✨',
    tier:        'SILVER',
    description: 'Seven consecutive training days.',
    unlockCopy:  'Seven days of unbroken commitment. Elite consistency.',
    condition:   (data) => data.streak >= 7,
    category:    'streak',
  },
  {
    id:          'fortnight_devotion',
    name:        'Fortnight Devotion',
    distinction: 'Sustained Excellence',
    icon:        '💫',
    tier:        'GOLD',
    description: 'Fourteen consecutive training days.',
    unlockCopy:  'Fourteen days. The behaviour patterns of a lifetime are being rewritten.',
    condition:   (data) => data.streak >= 14,
    category:    'streak',
  },
  {
    id:          'month_mastery',
    name:        'Monthly Mastery',
    distinction: 'Platinum Consistency',
    icon:        '🏆',
    tier:        'PLATINUM',
    description: 'Thirty consecutive training days.',
    unlockCopy:  'Thirty days of daily practice. The transformation is irreversible.',
    condition:   (data) => data.streak >= 30,
    category:    'streak',
  },

  // ── Behaviour achievements ──────────────────────────────────
  {
    id:          'confidence_excellence',
    name:        'Confidence Excellence',
    distinction: 'Behavioural Transformation',
    icon:        '🦁',
    tier:        'GOLD',
    description: 'Confidence scores demonstrate significant improvement.',
    unlockCopy:  'Confidence is built, not born. This achievement is earned.',
    condition:   (data) => (data.confidenceScore || 0) >= 60,
    category:    'behaviour',
  },
  {
    id:          'calm_environment',
    name:        'Calm Environment Achievement',
    distinction: 'Environmental Stability',
    icon:        '🌿',
    tier:        'SILVER',
    description: 'Anxiety indicators are within the calm threshold.',
    unlockCopy:  'Environmental calm is the foundation of all learning.',
    condition:   (data) => (data.anxietyScore || 100) < 35,
    category:    'behaviour',
  },
  {
    id:          'stability_mastery',
    name:        'Behaviour Stability Mastery',
    distinction: 'Elite Behavioural Architecture',
    icon:        '🏛️',
    tier:        'GOLD',
    description: 'Behaviour stability scores exceed the excellence threshold.',
    unlockCopy:  'Stability is the hallmark of a truly transformed companion.',
    condition:   (data) => (data.stabilityScore || 0) >= 70,
    category:    'behaviour',
  },
  {
    id:          'advanced_social_confidence',
    name:        'Advanced Social Confidence',
    distinction: 'Social Excellence',
    icon:        '🦋',
    tier:        'GOLD',
    description: 'Social confidence scores indicate elite-level socialisation.',
    unlockCopy:  'Social confidence is one of the greatest gifts you can give your companion.',
    condition:   (data) => (data.socialScore || 0) >= 65,
    category:    'behaviour',
  },
  {
    id:          'elite_companion_status',
    name:        'Elite Companion Status',
    distinction: 'Transformation Complete',
    icon:        '⭐',
    tier:        'PLATINUM',
    description: 'All core behaviour scores exceed excellence thresholds.',
    unlockCopy:  'Elite Companion Status is reserved for the most dedicated partnerships.',
    condition:   (data) => (data.confidenceScore || 0) >= 70 && (data.stabilityScore || 0) >= 70 && (data.completedLessons || 0) >= 25,
    category:    'behaviour',
  },

  // ── Course achievements ─────────────────────────────────────
  {
    id:          'first_course_complete',
    name:        'Programme Graduate',
    distinction: 'First Graduation',
    icon:        '🎓',
    tier:        'GOLD',
    description: 'First complete programme graduation.',
    unlockCopy:  'Completing a full programme is a significant achievement.',
    condition:   (data) => (data.completedCourses || 0) >= 1,
    category:    'course',
  },
  {
    id:          'dual_programme',
    name:        'Dual Programme Scholar',
    distinction: 'Advanced Academic',
    icon:        '📚',
    tier:        'PLATINUM',
    description: 'Two complete programmes graduated.',
    unlockCopy:  'Two completed programmes. A commitment to comprehensive transformation.',
    condition:   (data) => (data.completedCourses || 0) >= 2,
    category:    'course',
  },
]

// ─────────────────────────────────────────────────────────────
// COMPUTE EARNED ACHIEVEMENTS
// ─────────────────────────────────────────────────────────────
export function computeEarnedAchievements(data) {
  return ACHIEVEMENTS.filter(a => {
    try { return a.condition(data) }
    catch { return false }
  })
}

/**
 * data = {
 *   completedLessons, streak, completedCourses,
 *   confidenceScore, anxietyScore, stabilityScore, socialScore
 * }
 */
export function getNewAchievements(data, alreadyEarned = []) {
  const earned  = computeEarnedAchievements(data)
  const earnedIds = new Set(alreadyEarned.map(a => a.id))
  return earned.filter(a => !earnedIds.has(a.id))
}

// ─────────────────────────────────────────────────────────────
// CERTIFICATE SYSTEM
// ─────────────────────────────────────────────────────────────
export function generateCertificateData(course, clientName, dogName, completedDate) {
  return {
    courseTitle:   course.title,
    courseIcon:    course.icon,
    clientName:    clientName || 'Academy Member',
    dogName:       dogName || 'Companion',
    completedDate: completedDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    certId:        `FPA-${course.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    academySeal:   '🐾',
  }
}
