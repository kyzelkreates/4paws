// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — PRODUCT LOCK
// ODIN-TIER FINAL STATE DEFINITION
//
// This file defines what the product IS. It is the single source of truth
// for product identity, architecture rules, and language enforcement.
//
// No runtime logic lives here. These are constants and doctrine objects
// consumed by other systems to ensure consistency.
//
// FEATURE FREEZE: No new systems permitted beyond this spec.
// Allowed: refinement, simplification, unification, UX polishing.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT IDENTITY
// ─────────────────────────────────────────────────────────────────────────────
export const PRODUCT = {
  name:       'Four Paws Training & Enrichment Academy',
  identity:   'A Living Behavioural Intelligence Concierge System for Canine Transformation',
  tier:       'ODIN',
  version:    '3.0.0 — LOCKED',

  // What it is
  is: [
    'Behavioural Intelligence Platform',
    'Luxury Concierge Experience',
    'Digital Dog Companion System',
    'Offline-first PWA ecosystem',
  ],

  // What it is NOT — enforced at all levels
  isNot: [
    'generic SaaS dashboard',
    'gamified training app',
    'data-heavy analytics tool',
    'chatbot system',
    'an app',
    'a dashboard',
    'a training platform',
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// ARCHITECTURE LAYERS
// Three layers. Nothing outside these three layers is a primary surface.
// ─────────────────────────────────────────────────────────────────────────────
export const ARCHITECTURE = {
  layer1: {
    id:    'LBIL',
    name:  'Living Behavioural Intelligence Layer',
    role:  'Single source of truth for all intelligence. Derives insights, recommendations, emotional observations.',
    file:  'src/ai/intelligenceCore.js',
    outputsOnly: ['insights', 'recommendations', 'emotional observations'],
  },
  layer2: {
    id:    'NARRATIVE',
    name:  'Four Paws Narrative Engine',
    role:  'Single output formatter. One voice. Calm concierge tone. Observational language.',
    file:  'src/ai/narrativeVoice.js',
    rules: ['one voice only', 'never absolute', 'always observational', 'no system fragmentation'],
  },
  layer3: {
    id:    'SURFACES',
    name:  'Experience Surfaces',
    role:  'Three user-facing surfaces only. Everything else is internal.',
    surfaces: {
      intelligenceFeed: 'Behavioural insights and daily understanding',
      guidanceLayer:    'Recommendations and next actions',
      companionView:    'Digital dog avatar and emotional state',
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// EMOTIONAL CONTINUITY MODEL
// Every UI element, AI output, avatar state, and notification maps to this.
// ─────────────────────────────────────────────────────────────────────────────
export const EMOTIONAL_CONTINUITY_MODEL = {
  calm:       { internalIds: ['serene'],               specLabel: 'Calm',       priority: 1 },
  stable:     { internalIds: ['settled'],              specLabel: 'Stable',     priority: 2 },
  elevated:   { internalIds: ['alert', 'aroused'],     specLabel: 'Elevated',   priority: 3 },
  stressed:   { internalIds: ['anxious', 'reactive'],  specLabel: 'Stressed',   priority: 4 },
  recovering: { internalIds: ['recovering'],           specLabel: 'Recovering', priority: 5 },
  optimising: { internalIds: ['optimising'],           specLabel: 'Optimising', priority: 6 },
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE PRODUCT PRINCIPLES (NON-NEGOTIABLE)
// Referenced in code comments, design decisions, and review criteria.
// ─────────────────────────────────────────────────────────────────────────────
export const PRINCIPLES = {
  P1: {
    name:  'Noiseless Intelligence',
    rule:  'Only show what is necessary for understanding or action.',
    test:  'Would the user need this right now to act or understand their dog?',
  },
  P2: {
    name:  'Single Narrative Truth',
    rule:  'All outputs come from ONE voice: the Four Paws Narrative Engine.',
    test:  'Does this output feel like it came from a different system?',
  },
  P3: {
    name:  'Behavioural Realism',
    rule:  'No over-certainty, no exaggerated claims. Observational language only.',
    test:  'Is this statement absolutely certain, or appropriately observational?',
  },
  P4: {
    name:  'Luxury Calm UX',
    rule:  'Slow, soft motion. Minimal density. High whitespace. No urgency unless safety-critical.',
    test:  'Is this screen calm enough to reflect the product identity?',
  },
  P5: {
    name:  'Invisible Intelligence',
    rule:  'AI is present but not visible as "a system". No technical framing.',
    test:  'Does this feel like a system, or like a knowledgeable presence?',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE LOCK
// All UI copy, AI outputs, and notifications must pass this ruleset.
// narrativeVoice.js enforces this at runtime via purifyText().
// ─────────────────────────────────────────────────────────────────────────────
export const LANGUAGE_LOCK = {
  forbidden: [
    'AI system', 'model says', 'engine output', 'dashboard computes',
    'Intelligence Core', 'ML model', 'data shows', 'metrics confirm',
    'is improving', 'behaviour fixed', 'perfect recovery', 'AI says',
    'tracking', 'analytics', 'enterprise', 'enterprise-grade',
  ],
  required: {
    tone:     'Calm, concierge-level, professionally warm',
    language: 'Behavioural observation — never absolute',
    voice:    'One unified voice across all surfaces',
  },
  examples: {
    wrong:   'Bella is improving',
    correct: 'Bella is showing patterns consistent with gradual improvement',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION RULES
// All notifications pass through narrativeVoice.filterNotification().
// ─────────────────────────────────────────────────────────────────────────────
export const NOTIFICATION_RULES = {
  allowedTypes:    ['achievement', 'milestone', 'emergency'],
  suppressedTypes: ['data_sync', 'cache_update', 'system_ready', 'intelligence_loaded', 'profile_saved', 'auto_save', 'session_started'],
  tone:            'Calm concierge. No urgency unless safety-critical.',
  example:         'Bella may benefit from a short calm enrichment session today.',
}

// ─────────────────────────────────────────────────────────────────────────────
// UX LOCK
// Design rules enforced in CSS (globals.css) and Tailwind config.
// ─────────────────────────────────────────────────────────────────────────────
export const UX_LOCK = {
  motion: {
    enterDuration:   0.55,
    ambientDuration: 4.0,
    stagger:         0.08,
    easing:          [0.22, 1, 0.36, 1],
  },
  density:    'minimal — one primary element per screen',
  whitespace: 'high',
  animations: 'slow and soft only',
  alerts:     'no urgency unless safety-critical state',
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE FREEZE
// This is the complete allowed feature list. Nothing outside this list.
// ─────────────────────────────────────────────────────────────────────────────
export const FEATURE_FREEZE = {
  allowed: [
    'refinement',
    'simplification',
    'unification',
    'UX polishing',
    'tone correction',
    'architecture consolidation',
  ],
  prohibited: [
    'new AI systems',
    'new pages beyond current route set',
    'additional analytics layers',
    'secondary dashboards',
    'gamification systems',
    'social features',
    'cloud integration',
    'external API dependencies',
  ],
  frozenAt: '2026-05-22',
  tier:     'ODIN',
}
