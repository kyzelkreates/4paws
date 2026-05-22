// ─────────────────────────────────────────────────────────────
// FOUR PAWS — DYNAMIC ACADEMY CONFIGURATION ENGINE
// Single Source of Truth for package-driven PWA personalisation.
// Every feature, nav item, AI system, theme, and dashboard
// renders from this configuration. Fully offline. No APIs.
// ─────────────────────────────────────────────────────────────

const CONFIG_KEY = 'fp_academy_config'

// ─────────────────────────────────────────────────────────────
// TIER DEFINITIONS
// ─────────────────────────────────────────────────────────────
export const TIER_LEVELS = {
  GOLD: {
    id: 'GOLD', name: 'Gold Tier', icon: '🥇', rank: 1,
    colour: '#C9A84C', colourRgb: '201,168,76',
    gradient: 'linear-gradient(135deg, #1A1208 0%, #2A1E0A 100%)',
    motionLevel: 'standard',
    conciergeLevel: 'basic',
  },
  PLATINUM: {
    id: 'PLATINUM', name: 'Platinum Tier', icon: '💎', rank: 2,
    colour: '#C0C0C0', colourRgb: '192,192,192',
    gradient: 'linear-gradient(135deg, #0E0E12 0%, #181820 100%)',
    motionLevel: 'enhanced',
    conciergeLevel: 'standard',
  },
  OBSIDIAN: {
    id: 'OBSIDIAN', name: 'Obsidian Tier', icon: '🌑', rank: 3,
    colour: '#C9A84C', colourRgb: '201,168,76',
    gradient: 'linear-gradient(135deg, #060606 0%, #0F0F0F 100%)',
    motionLevel: 'cinematic',
    conciergeLevel: 'premium',
  },
  FOUNDERS: {
    id: 'FOUNDERS', name: "Founders' Circle", icon: '👑', rank: 4,
    colour: '#F5E09A', colourRgb: '245,224,154',
    gradient: 'linear-gradient(135deg, #050503 0%, #0A0A06 50%, #050503 100%)',
    motionLevel: 'ultra',
    conciergeLevel: 'white_glove',
  },
  CONCIERGE: {
    id: 'CONCIERGE', name: 'Elite Concierge', icon: '⭐', rank: 5,
    colour: '#9FDBFF', colourRgb: '159,219,255',
    gradient: 'linear-gradient(135deg, #020408 0%, #060C14 50%, #020408 100%)',
    motionLevel: 'ultra',
    conciergeLevel: 'white_glove',
  },
}

// ─────────────────────────────────────────────────────────────
// PACKAGE DEFINITIONS
// ─────────────────────────────────────────────────────────────
export const PACKAGES = {
  PUPPY_FOUNDATIONS: {
    id: 'PUPPY_FOUNDATIONS',
    name: 'Puppy Foundations',
    tagline: 'The definitive first-year blueprint',
    icon: '🐾',
    tier: 'GOLD',
    colour: '#C9A84C',
    courses: ['course-1'],
    enabledFeatures: [
      'dashboard', 'courses', 'lessons', 'passport', 'journal',
      'emergency', 'wellness_basic',
    ],
    enabledAI: ['behaviour_scores', 'enrichment_basic', 'daily_insight'],
    enabledDashboards: ['main', 'passport'],
    transformationPathway: 'PUPPY',
    conciergeGreeting: true,
    voiceCoach: false,
    digitalTwin: false,
    analytics: 'basic',
    theme: 'obsidian_gold',
  },
  REACTIVE_RECOVERY: {
    id: 'REACTIVE_RECOVERY',
    name: 'Reactive Recovery',
    tagline: 'Structured transformation for reactive dogs',
    icon: '⚡',
    tier: 'PLATINUM',
    colour: '#F59E0B',
    courses: ['course-3'],
    enabledFeatures: [
      'dashboard', 'courses', 'lessons', 'passport', 'journal',
      'emergency', 'timeline', 'analytics', 'calm_centre',
      'stability_dashboard', 'wellness_full',
    ],
    enabledAI: [
      'behaviour_scores', 'enrichment_full', 'daily_insight',
      'predictive_alerts', 'trigger_intelligence', 'relapse_prevention',
    ],
    enabledDashboards: ['main', 'passport', 'stability', 'timeline'],
    transformationPathway: 'REACTIVE',
    conciergeGreeting: true,
    voiceCoach: true,
    digitalTwin: false,
    analytics: 'standard',
    theme: 'obsidian_gold',
  },
  ELITE_COMPANION: {
    id: 'ELITE_COMPANION',
    name: 'Elite Companion',
    tagline: 'Advanced behaviour optimisation',
    icon: '🌟',
    tier: 'OBSIDIAN',
    colour: '#8B5CF6',
    courses: ['course-1', 'course-2', 'course-3'],
    enabledFeatures: [
      'dashboard', 'courses', 'lessons', 'addons', 'passport',
      'journal', 'emergency', 'timeline', 'analytics', 'calm_centre',
      'stability_dashboard', 'wellness_full', 'digital_twin',
      'transformation_map', 'weekly_report', 'archive',
    ],
    enabledAI: [
      'behaviour_scores', 'enrichment_full', 'daily_insight',
      'predictive_alerts', 'trigger_intelligence', 'relapse_prevention',
      'emotional_engine', 'digital_twin', 'transformation_forecast',
      'weekly_intelligence',
    ],
    enabledDashboards: ['main', 'passport', 'stability', 'timeline', 'analytics', 'twin'],
    transformationPathway: 'ELITE',
    conciergeGreeting: true,
    voiceCoach: true,
    digitalTwin: true,
    analytics: 'advanced',
    theme: 'obsidian_gold',
  },
  ESTATE_GUARDIAN: {
    id: 'ESTATE_GUARDIAN',
    name: 'Estate Guardian',
    tagline: 'Large property & multi-handler excellence',
    icon: '🏰',
    tier: 'OBSIDIAN',
    colour: '#10B981',
    courses: ['course-2', 'course-3', 'course-4'],
    enabledFeatures: [
      'dashboard', 'courses', 'lessons', 'addons', 'passport',
      'journal', 'emergency', 'timeline', 'analytics', 'calm_centre',
      'stability_dashboard', 'wellness_full', 'digital_twin',
      'transformation_map', 'weekly_report', 'archive', 'ceremony',
    ],
    enabledAI: [
      'behaviour_scores', 'enrichment_full', 'daily_insight',
      'predictive_alerts', 'trigger_intelligence', 'relapse_prevention',
      'emotional_engine', 'digital_twin', 'transformation_forecast',
      'weekly_intelligence', 'socialisation_intel', 'environmental_profiling',
    ],
    enabledDashboards: ['main', 'passport', 'stability', 'timeline', 'analytics', 'twin', 'wellness'],
    transformationPathway: 'ESTATE',
    conciergeGreeting: true,
    voiceCoach: true,
    digitalTwin: true,
    analytics: 'enterprise',
    theme: 'royal_emerald',
  },
  PLATINUM_OPTIMISATION: {
    id: 'PLATINUM_OPTIMISATION',
    name: 'Platinum Behaviour Optimisation',
    tagline: 'The complete intelligence ecosystem',
    icon: '💎',
    tier: 'FOUNDERS',
    colour: '#C0C0C0',
    courses: ['course-1', 'course-2', 'course-3', 'course-4', 'course-5'],
    enabledFeatures: [
      'dashboard', 'courses', 'lessons', 'addons', 'passport',
      'journal', 'emergency', 'timeline', 'analytics', 'calm_centre',
      'stability_dashboard', 'wellness_full', 'digital_twin',
      'transformation_map', 'weekly_report', 'archive', 'ceremony',
      'soundscapes', 'theme_selector',
    ],
    enabledAI: [
      'behaviour_scores', 'enrichment_full', 'daily_insight',
      'predictive_alerts', 'trigger_intelligence', 'relapse_prevention',
      'emotional_engine', 'digital_twin', 'transformation_forecast',
      'weekly_intelligence', 'socialisation_intel', 'environmental_profiling',
      'handler_performance', 'consistency_engine', 'lifestyle_archetype',
    ],
    enabledDashboards: ['main', 'passport', 'stability', 'timeline', 'analytics', 'twin', 'wellness', 'ceremony'],
    transformationPathway: 'PLATINUM',
    conciergeGreeting: true,
    voiceCoach: true,
    digitalTwin: true,
    analytics: 'enterprise',
    theme: 'platinum_silver',
  },
  FOUNDERS_CIRCLE: {
    id: 'FOUNDERS_CIRCLE',
    name: "Founders' Circle",
    tagline: 'Unrestricted access — every system, every capability',
    icon: '👑',
    tier: 'FOUNDERS',
    colour: '#F5E09A',
    courses: ['course-1', 'course-2', 'course-3', 'course-4', 'course-5'],
    enabledFeatures: '__ALL__',
    enabledAI: '__ALL__',
    enabledDashboards: '__ALL__',
    transformationPathway: 'FOUNDERS',
    conciergeGreeting: true,
    voiceCoach: true,
    digitalTwin: true,
    analytics: 'enterprise',
    theme: 'obsidian_gold',
    foundersAccess: true,
  },
  EXECUTIVE_CONCIERGE: {
    id: 'EXECUTIVE_CONCIERGE',
    name: 'Executive Concierge',
    tagline: 'White-glove private transformation service',
    icon: '⭐',
    tier: 'CONCIERGE',
    colour: '#9FDBFF',
    courses: ['course-1', 'course-2', 'course-3', 'course-4', 'course-5'],
    enabledFeatures: '__ALL__',
    enabledAI: '__ALL__',
    enabledDashboards: '__ALL__',
    transformationPathway: 'CONCIERGE',
    conciergeGreeting: true,
    voiceCoach: true,
    digitalTwin: true,
    analytics: 'enterprise',
    theme: 'midnight_sapphire',
    whiteGlove: true,
  },
}

// ─────────────────────────────────────────────────────────────
// ALL POSSIBLE NAV ITEMS — shown/hidden per config
// ─────────────────────────────────────────────────────────────
export const ALL_NAV_ITEMS = [
  // Core (always shown)
  { id: 'dashboard',    label: 'Dashboard',        to: '/academy',              icon: 'LayoutDashboard', exact: true,  feature: 'dashboard',         group: 'core'       },
  { id: 'courses',      label: 'Programmes',       to: '/academy',              icon: 'BookOpen',        exact: true,  feature: 'courses',           group: 'core'       },
  { id: 'addons',       label: 'Add-Ons',          to: '/academy/addons',       icon: 'Package',         feature: 'addons',            group: 'core'       },
  { id: 'emergency',    label: 'Emergency',        to: '/academy/emergency',    icon: 'AlertTriangle',   feature: 'emergency',         group: 'core'       },

  // V1 intelligence
  { id: 'passport',     label: 'Passport',         to: '/academy/passport',     icon: 'MapPin',          feature: 'passport',          group: 'intelligence' },
  { id: 'timeline',     label: 'Timeline',         to: '/academy/timeline',     icon: 'Clock',           feature: 'timeline',          group: 'intelligence' },
  { id: 'analytics',    label: 'Analytics',        to: '/academy/analytics',    icon: 'BarChart2',       feature: 'analytics',         group: 'intelligence' },

  // V2 systems
  { id: 'twin',         label: 'Digital Twin',     to: '/academy/twin',         icon: 'Brain',           feature: 'digital_twin',      group: 'ai'           },
  { id: 'wellness',     label: 'Wellness',         to: '/academy/wellness',     icon: 'Sparkles',        feature: 'wellness_full',     group: 'ai'           },
  { id: 'report',       label: 'Weekly Report',    to: '/academy/report',       icon: 'FileText',        feature: 'weekly_report',     group: 'ai'           },
  { id: 'archive',      label: 'Archive',          to: '/academy/archive',      icon: 'Archive',         feature: 'archive',           group: 'ai'           },

  // V3 systems
  { id: 'calm',         label: 'Calm Centre',      to: '/academy/calm',         icon: 'Wind',            feature: 'calm_centre',       group: 'premium'      },
  { id: 'map',          label: 'Journey Map',      to: '/academy/map',          icon: 'Map',             feature: 'transformation_map',group: 'premium'      },
  { id: 'journal',      label: 'Journal',          to: '/academy/journal',      icon: 'BookMarked',      feature: 'journal',           group: 'premium'      },
  { id: 'stability',    label: 'Stability',        to: '/academy/stability',    icon: 'Activity',        feature: 'stability_dashboard',group: 'premium'     },
  { id: 'ceremony',     label: 'Ceremonies',       to: '/academy/ceremony',     icon: 'Award',           feature: 'ceremony',          group: 'premium'      },

  // Final Polish systems
  { id: 'briefing',     label: 'Daily Briefing',   to: '/academy/briefing',     icon: 'Calendar',        feature: 'daily_briefing',    group: 'intelligence' },
  { id: 'milestones',   label: 'Milestones',       to: '/academy/milestones',   icon: 'TrendingUp',      feature: 'milestones',        group: 'intelligence' },
]

// ─────────────────────────────────────────────────────────────
// TRANSFORMATION PATHWAYS
// ─────────────────────────────────────────────────────────────
export const TRANSFORMATION_PATHWAYS = {
  PUPPY: {
    id: 'PUPPY', name: 'Puppy Excellence Pathway',
    icon: '🐾', colour: '#C9A84C',
    phases: ['Foundation Building', 'Social Discovery', 'Confidence Expansion', 'Elite Companion Graduation'],
    focus: ['Socialisation', 'Bite inhibition', 'Foundation behaviours', 'Confidence building'],
  },
  REACTIVE: {
    id: 'REACTIVE', name: 'Reactive Recovery Pathway',
    icon: '⚡', colour: '#F59E0B',
    phases: ['Stabilisation', 'Threshold Management', 'Confidence Recovery', 'Environmental Mastery'],
    focus: ['Threshold work', 'Decompression', 'Trigger desensitisation', 'Confidence protocols'],
  },
  ELITE: {
    id: 'ELITE', name: 'Elite Behaviour Mastery',
    icon: '⭐', colour: '#8B5CF6',
    phases: ['Advanced Foundation', 'Generalisation', 'Proofing', 'Elite Optimisation'],
    focus: ['Multi-environment generalisation', 'Distraction proofing', 'Advanced cues', 'Handler refinement'],
  },
  ESTATE: {
    id: 'ESTATE', name: 'Estate Guardian Programme',
    icon: '🏰', colour: '#10B981',
    phases: ['Boundary Establishment', 'Handler Consistency', 'Environmental Mastery', 'Estate Elite'],
    focus: ['Multi-handler consistency', 'Territorial management', 'Large property navigation', 'Social protocol'],
  },
  PLATINUM: {
    id: 'PLATINUM', name: 'Platinum Behaviour Optimisation',
    icon: '💎', colour: '#C0C0C0',
    phases: ['Intelligence Assessment', 'Comprehensive Programme', 'Mastery Certification', 'Ongoing Excellence'],
    focus: ['Full behaviour optimisation', 'Digital twin analytics', 'Handler performance', 'Lifetime mastery'],
  },
  FOUNDERS: {
    id: 'FOUNDERS', name: "Founders' Circle Journey",
    icon: '👑', colour: '#F5E09A',
    phases: ['Private Onboarding', 'Bespoke Programme Design', 'Platinum Execution', 'Legacy Creation'],
    focus: ['Fully bespoke pathway', 'Concierge coaching', 'All systems active', 'Legacy archive'],
  },
  CONCIERGE: {
    id: 'CONCIERGE', name: 'Executive Concierge Experience',
    icon: '⭐', colour: '#9FDBFF',
    phases: ['White-Glove Welcome', 'Private Assessment', 'Bespoke Execution', 'Concierge Excellence'],
    focus: ['Fully concierge-managed', 'Priority access', 'All AI systems', 'Private events'],
  },
}

// ─────────────────────────────────────────────────────────────
// CONCIERGE GREETING SCRIPTS per tier
// ─────────────────────────────────────────────────────────────
export const CONCIERGE_GREETINGS = {
  basic:       (name, dog) => `Welcome back, ${name}. ${dog}'s programme is ready.`,
  standard:    (name, dog) => `Good to have you here, ${name}. ${dog} is making exceptional progress — your programme continues today.`,
  premium:     (name, dog) => `${name}, your concierge academy is prepared. ${dog}'s intelligence profile has been updated — a new insight awaits you today.`,
  white_glove: (name, dog) => `Welcome, ${name}. ${dog}'s private transformation programme is fully prepared. Your dedicated concierge system is active — today presents an exceptional opportunity for progress.`,
}

// ─────────────────────────────────────────────────────────────
// FEATURE MATRIX — which features each capability unlocks
// ─────────────────────────────────────────────────────────────
export const FEATURE_MATRIX = {
  dashboard:            { label: 'Main Dashboard',          icon: '🏠', tier: 1 },
  courses:              { label: 'Course Library',           icon: '📚', tier: 1 },
  lessons:              { label: 'Lesson Player',            icon: '▶️',  tier: 1 },
  emergency:            { label: 'Emergency Mode',           icon: '🚨', tier: 1 },
  journal:              { label: 'Academy Journal',          icon: '📖', tier: 1 },
  passport:             { label: 'Puppy Passport',           icon: '🪪', tier: 1 },
  addons:               { label: 'Add-On Library',           icon: '🧩', tier: 2 },
  timeline:             { label: 'Behaviour Timeline',       icon: '📅', tier: 2 },
  analytics:            { label: 'Analytics Dashboard',      icon: '📊', tier: 2 },
  wellness_basic:       { label: 'Basic Wellness',           icon: '🌿', tier: 2 },
  wellness_full:        { label: 'Full Wellness Suite',      icon: '✨', tier: 3 },
  calm_centre:          { label: 'Calmness Centre',          icon: '🌸', tier: 2 },
  stability_dashboard:  { label: 'Stability Dashboard',      icon: '🛡️', tier: 3 },
  digital_twin:         { label: 'AI Digital Twin',          icon: '🤖', tier: 3 },
  transformation_map:   { label: 'Transformation Map',       icon: '🗺️',  tier: 3 },
  weekly_report:        { label: 'Weekly Intelligence',      icon: '📋', tier: 3 },
  archive:              { label: 'Legacy Archive',           icon: '🗄️',  tier: 3 },
  ceremony:             { label: 'Academy Ceremonies',       icon: '🎖️',  tier: 4 },
  soundscapes:          { label: 'Ambient Soundscapes',      icon: '🎵', tier: 3 },
  theme_selector:       { label: 'Visual Theme System',      icon: '🎨', tier: 3 },
}

// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────
export function loadAcademyConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveAcademyConfig(config) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({
      ...config,
      savedAt: new Date().toISOString(),
      version: 3,
    }))
  } catch {}
}

export function clearAcademyConfig() {
  try { localStorage.removeItem(CONFIG_KEY) } catch {}
}

// ─────────────────────────────────────────────────────────────
// CONFIG BUILDER — generates full academy profile
// ─────────────────────────────────────────────────────────────
export function buildAcademyConfig(overrides = {}) {
  const packageId = overrides.packageId || 'ELITE_COMPANION'
  const pkg       = PACKAGES[packageId] || PACKAGES.ELITE_COMPANION
  const tier      = TIER_LEVELS[pkg.tier] || TIER_LEVELS.GOLD

  const isAll  = (v) => v === '__ALL__'
  const allFeat = Object.keys(FEATURE_MATRIX)
  const allAI  = [
    'behaviour_scores', 'enrichment_full', 'daily_insight', 'predictive_alerts',
    'trigger_intelligence', 'relapse_prevention', 'emotional_engine', 'digital_twin',
    'transformation_forecast', 'weekly_intelligence', 'socialisation_intel',
    'environmental_profiling', 'handler_performance', 'consistency_engine', 'lifestyle_archetype',
  ]
  const allDash = ['main', 'passport', 'stability', 'timeline', 'analytics', 'twin', 'wellness', 'ceremony']

  const config = {
    academyId:             overrides.academyId   || null,
    clientId:              overrides.clientId    || null,
    packageId,
    packageName:           pkg.name,
    packageIcon:           pkg.icon,
    tierLevel:             pkg.tier,
    tierMeta:              tier,
    colour:                pkg.colour || tier.colour,
    theme:                 overrides.theme       || pkg.theme   || 'obsidian_gold',
    transformationPathway: overrides.pathway     || pkg.transformationPathway || 'ELITE',
    pathwayMeta:           TRANSFORMATION_PATHWAYS[overrides.pathway || pkg.transformationPathway || 'ELITE'],

    // Feature access
    enabledFeatures:   isAll(pkg.enabledFeatures)  ? allFeat  : (pkg.enabledFeatures || []),
    enabledAI:         isAll(pkg.enabledAI)         ? allAI    : (pkg.enabledAI      || []),
    enabledDashboards: isAll(pkg.enabledDashboards) ? allDash  : (pkg.enabledDashboards || []),
    enabledCourses:    overrides.enabledCourses  || pkg.courses || [],
    enabledAddons:     overrides.enabledAddons   || [],

    // Capabilities
    voiceCoach:        pkg.voiceCoach   ?? false,
    digitalTwin:       pkg.digitalTwin  ?? false,
    analyticsLevel:    pkg.analytics    || 'basic',
    conciergeLevel:    tier.conciergeLevel,
    motionLevel:       overrides.motionLevel || tier.motionLevel,
    foundersAccess:    pkg.foundersAccess   ?? false,
    whiteGlove:        pkg.whiteGlove       ?? false,
    conciergeGreeting: pkg.conciergeGreeting ?? false,

    // Dynamic nav
    navItems: buildDynamicNav(isAll(pkg.enabledFeatures) ? allFeat : (pkg.enabledFeatures || [])),

    // Meta
    generatedAt: new Date().toISOString(),
  }

  return config
}

export function buildDynamicNav(enabledFeatures) {
  return ALL_NAV_ITEMS.filter(item =>
    !item.feature || enabledFeatures.includes(item.feature)
  )
}

// ─────────────────────────────────────────────────────────────
// FEATURE CHECK HELPERS
// ─────────────────────────────────────────────────────────────
export function hasFeature(config, feature) {
  if (!config) return true // fallback: show everything if no config
  if (config.enabledFeatures === '__ALL__') return true
  return (config.enabledFeatures || []).includes(feature)
}

export function hasAICapability(config, capability) {
  if (!config) return true
  if (config.enabledAI === '__ALL__') return true
  return (config.enabledAI || []).includes(capability)
}

export function hasDashboard(config, dashboard) {
  if (!config) return true
  if (config.enabledDashboards === '__ALL__') return true
  return (config.enabledDashboards || []).includes(dashboard)
}

export function getMotionLevel(config) {
  return config?.motionLevel || 'standard'
}

export function getConciergeGreeting(config, clientName, dogName) {
  const level = config?.conciergeLevel || 'basic'
  const fn    = CONCIERGE_GREETINGS[level] || CONCIERGE_GREETINGS.basic
  return fn(clientName?.split(' ')[0] || 'there', dogName || 'your companion')
}
