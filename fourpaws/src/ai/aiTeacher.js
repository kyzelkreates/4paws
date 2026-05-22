// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — AI TEACHER
// Contextual guidance intelligence. Not a tutorial. Not a chatbot.
// A quiet concierge that teaches through the system — never over it.
//
// ODIN DOCTRINE: Only appears when needed. One explanation. One action. Done.
// ─────────────────────────────────────────────────────────────────────────────

import { purifyText } from './narrativeVoice'

const STORAGE_KEY = 'fp_teacher_state'

// ─────────────────────────────────────────────────────────────────────────────
// GUIDANCE NODES
// Every teachable surface has one node.
// Each node contains exactly: explanation, action, tip (optional).
// ─────────────────────────────────────────────────────────────────────────────
export const GUIDANCE_NODES = {

  // ── PWA nodes ─────────────────────────────────────────────

  pwa_dashboard: {
    id:          'pwa_dashboard',
    surface:     'pwa',
    trigger:     'first_visit',
    explanation: 'This is your companion\'s home. It shows one insight about your dog and one recommendation for today.',
    action:      'Read the insight and try the recommendation when you\'re ready. There\'s no urgency.',
    tip:         'Everything here updates as you log observations and complete sessions.',
  },

  pwa_emotional_state: {
    id:          'pwa_emotional_state',
    surface:     'pwa',
    trigger:     'first_visit',
    explanation: 'The orb reflects your dog\'s current emotional reading — based on the profile you built during setup.',
    action:      'Open \'Daily Briefing\' for a deeper look at today\'s session context.',
    tip:         'The colour and movement are intentional. Calm blue means settled. Amber means alert.',
  },

  pwa_daily_rituals: {
    id:          'pwa_daily_rituals',
    surface:     'pwa',
    trigger:     'first_visit',
    explanation: 'Rituals are short, structured practices — morning, evening, wellness, and confidence.',
    action:      'Start with the Morning Ritual. It takes five minutes and sets the tone for the day.',
    tip:         'Each completed step is remembered. You can pick up where you left off at any time.',
  },

  pwa_companion_chat: {
    id:          'pwa_companion_chat',
    surface:     'pwa',
    trigger:     'first_visit',
    explanation: 'Ask anything about your dog\'s programme here. The responses draw from your dog\'s profile and current stage.',
    action:      'Try asking: "What should we focus on tomorrow?"',
    tip:         'All responses work fully offline.',
  },

  pwa_scenarios: {
    id:          'pwa_scenarios',
    surface:     'pwa',
    trigger:     'first_visit',
    explanation: 'Scenarios walk you through common behavioural challenges — guest arrivals, vet visits, public environments.',
    action:      'Choose a scenario your dog has struggled with recently and work through Stage 1.',
    tip:         'Each scenario includes readiness indicators so you know when to progress.',
  },

  pwa_method: {
    id:          'pwa_method',
    surface:     'pwa',
    trigger:     'first_visit',
    explanation: 'The Four Paws Method™ explains the philosophy behind every recommendation you receive.',
    action:      'Read \'Paw 1: Emotional Foundation\' — it defines the entire programme\'s approach.',
    tip:         'Understanding the methodology makes every other section more meaningful.',
  },

  pwa_briefing: {
    id:          'pwa_briefing',
    surface:     'pwa',
    trigger:     'first_visit',
    explanation: 'The Daily Briefing is your morning context — one insight, one recommendation, and an optional observation.',
    action:      'Read it before beginning any session with your dog.',
    tip:         'It adjusts based on your dog\'s emotional state and the current season.',
  },

  // ── Admin / dashboard nodes ────────────────────────────────

  admin_operations: {
    id:          'admin_operations',
    surface:     'admin',
    trigger:     'first_visit',
    explanation: 'The Operations Centre gives you a live view of all client health — engagement, activity, and priority alerts.',
    action:      'Review the Priority Queue first. High-priority alerts are the most time-sensitive.',
    tip:         'The AI generates the priority queue automatically — no manual review of every client needed.',
  },

  admin_priority_queue: {
    id:          'admin_priority_queue',
    surface:     'admin',
    trigger:     'section_focus',
    explanation: 'These alerts are generated when a client shows reduced engagement, pending activation, or programme stagnation.',
    action:      'Click any alert to go directly to that client\'s profile and take action.',
    tip:         'Alerts resolve automatically once engagement resumes.',
  },

  admin_client_matrix: {
    id:          'admin_client_matrix',
    surface:     'admin',
    trigger:     'section_focus',
    explanation: 'The Health Matrix shows all clients at a glance — last activity, lesson count, and academy status.',
    action:      'Click any row to open a client\'s full profile with notes, programme, and messaging.',
    tip:         'The activity column shows days since last engagement — this is the fastest way to identify who needs attention.',
  },

  admin_client_detail: {
    id:          'admin_client_detail',
    surface:     'admin',
    trigger:     'first_visit',
    explanation: 'This is the client\'s full concierge profile — courses, add-ons, activation status, and your private notes.',
    action:      'Add a private note using the Notes tab to record any observations about this client or their dog.',
    tip:         'The activation code at the bottom links this client\'s device to their academy.',
  },

  admin_clients: {
    id:          'admin_clients',
    surface:     'admin',
    trigger:     'first_visit',
    explanation: 'The Clients page is where you create accounts and assign programmes. Each client receives a unique activation code.',
    action:      'Create your first client using the + button. Their academy becomes accessible immediately.',
    tip:         'The activation code is how the client unlocks their PWA — it links their device to their profile.',
  },

  admin_distribution: {
    id:          'admin_distribution',
    surface:     'admin',
    trigger:     'first_visit',
    explanation: 'Distribution generates personalised PWA install instructions for each client, including their unique activation code.',
    action:      'Select a client and generate their installation package.',
    tip:         'Each package includes step-by-step instructions formatted for non-technical clients.',
  },

  admin_messages: {
    id:          'admin_messages',
    surface:     'admin',
    trigger:     'first_visit',
    explanation: 'Messages appear here when clients send notes through their academy. You can reply directly from this panel.',
    action:      'Reply to any open message to maintain concierge-level client contact.',
    tip:         'Message history is preserved in each client\'s profile.',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE MANAGEMENT — local persistence, never cloud
// ─────────────────────────────────────────────────────────────────────────────
function defaultState() {
  return {
    mode:             'guided',      // 'guided' | 'quiet'
    seenNodes:        [],            // node IDs that have been shown + dismissed
    skippedNodes:     [],            // node IDs the user explicitly skipped
    completedNodes:   [],            // node IDs the user marked as understood
    skippedSurfaces:  [],            // surface IDs ('pwa' | 'admin') user dismissed entirely
    lastSurface:      null,
    firstVisits:      {},            // { [surfaceKey]: true } — first visit tracking
    engagementSignals:{},            // { [path]: visitCount } — confusion detection
    teacherEnabled:   true,
  }
}

export function loadTeacherState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return { ...defaultState(), ...JSON.parse(raw) }
  } catch { return defaultState() }
}

export function saveTeacherState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function resetTeacherState() {
  localStorage.removeItem(STORAGE_KEY)
  return defaultState()
}

// ─────────────────────────────────────────────────────────────────────────────
// GUIDANCE ENGINE — decides when and what to show
// Returns null when silence is correct.
// ─────────────────────────────────────────────────────────────────────────────
export function getGuidanceForPath(path, surface, teacherState) {
  if (!teacherState.teacherEnabled) return null
  if (teacherState.mode === 'quiet') return null
  if (teacherState.skippedSurfaces.includes(surface)) return null

  // Map paths → node IDs
  const pathNodeMap = {
    // PWA
    '/academy/dashboard':  'pwa_dashboard',
    '/academy':            'pwa_dashboard',
    '/academy/rituals':    'pwa_daily_rituals',
    '/academy/companion':  'pwa_companion_chat',
    '/academy/scenarios':  'pwa_scenarios',
    '/academy/method':     'pwa_method',
    '/academy/briefing':   'pwa_briefing',
    // Admin
    '/admin':              'admin_operations',
    '/admin/clients':      'admin_clients',
    '/admin/distribution': 'admin_distribution',
    '/admin/messages':     'admin_messages',
  }

  // Handle dynamic routes like /admin/clients/:id
  let nodeId = pathNodeMap[path]
  if (!nodeId && path.startsWith('/admin/clients/')) nodeId = 'admin_client_detail'

  if (!nodeId) return null

  const node = GUIDANCE_NODES[nodeId]
  if (!node) return null

  // Already seen or skipped
  if (teacherState.seenNodes.includes(nodeId)) return null
  if (teacherState.skippedNodes.includes(nodeId)) return null
  if (teacherState.completedNodes.includes(nodeId)) return null

  // Only show on first visits unless it's a section_focus trigger
  if (node.trigger === 'first_visit') {
    const visitKey = `${surface}_${nodeId}`
    if (teacherState.firstVisits[visitKey]) return null
  }

  return node
}

// Confusion detection — show guidance when user keeps returning to the same spot
export function detectConfusion(path, teacherState) {
  const count = teacherState.engagementSignals[path] || 0
  // If they've visited the same path 4+ times without completing the node → show guidance
  if (count >= 4) {
    const pathNodeMap = {
      '/admin': 'admin_operations',
      '/admin/clients': 'admin_clients',
      '/academy': 'pwa_dashboard',
    }
    const nodeId = pathNodeMap[path]
    if (!nodeId) return null
    if (teacherState.completedNodes.includes(nodeId)) return null
    if (teacherState.skippedNodes.includes(nodeId)) return null
    return GUIDANCE_NODES[nodeId] || null
  }
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// MARK ACTIONS — update state after user interaction
// ─────────────────────────────────────────────────────────────────────────────
export function markNodeSeen(nodeId, current) {
  const next = {
    ...current,
    seenNodes: [...new Set([...current.seenNodes, nodeId])],
    firstVisits: { ...current.firstVisits, [`${GUIDANCE_NODES[nodeId]?.surface}_${nodeId}`]: true },
  }
  saveTeacherState(next)
  return next
}

export function markNodeCompleted(nodeId, current) {
  const next = {
    ...current,
    completedNodes: [...new Set([...current.completedNodes, nodeId])],
    seenNodes:      [...new Set([...current.seenNodes, nodeId])],
    firstVisits:    { ...current.firstVisits, [`${GUIDANCE_NODES[nodeId]?.surface}_${nodeId}`]: true },
  }
  saveTeacherState(next)
  return next
}

export function skipNode(nodeId, current) {
  const next = {
    ...current,
    skippedNodes: [...new Set([...current.skippedNodes, nodeId])],
    seenNodes:    [...new Set([...current.seenNodes, nodeId])],
  }
  saveTeacherState(next)
  return next
}

export function skipSurface(surface, current) {
  const next = {
    ...current,
    skippedSurfaces: [...new Set([...current.skippedSurfaces, surface])],
    mode:            'quiet',
  }
  saveTeacherState(next)
  return next
}

export function setTeacherMode(mode, current) {
  const next = { ...current, mode }
  saveTeacherState(next)
  return next
}

export function recordPathVisit(path, current) {
  const signals = { ...current.engagementSignals }
  signals[path] = (signals[path] || 0) + 1
  const next = { ...current, engagementSignals: signals, lastSurface: path }
  saveTeacherState(next)
  return next
}

export function enableTeacher(current) {
  const next = { ...current, teacherEnabled: true, mode: 'guided', skippedSurfaces: [] }
  saveTeacherState(next)
  return next
}

// ─────────────────────────────────────────────────────────────────────────────
// HELP MENU — what's available to resume
// Returns list of skipped or unvisited nodes for a given surface
// ─────────────────────────────────────────────────────────────────────────────
export function getResumableGuidance(surface, teacherState) {
  return Object.values(GUIDANCE_NODES)
    .filter(n =>
      n.surface === surface &&
      !teacherState.completedNodes.includes(n.id) &&
      !teacherState.seenNodes.includes(n.id)
    )
    .slice(0, 4) // max 4 resumable items at once
}

export function getCompletedGuidance(surface, teacherState) {
  return Object.values(GUIDANCE_NODES)
    .filter(n => n.surface === surface && teacherState.completedNodes.includes(n.id))
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS SUMMARY — how far through the system has the user been guided?
// ─────────────────────────────────────────────────────────────────────────────
export function getTeacherProgress(surface, teacherState) {
  const surfaceNodes = Object.values(GUIDANCE_NODES).filter(n => n.surface === surface)
  const total        = surfaceNodes.length
  const completed    = surfaceNodes.filter(n => teacherState.completedNodes.includes(n.id)).length
  const skipped      = surfaceNodes.filter(n => teacherState.skippedNodes.includes(n.id)).length
  return { total, completed, skipped, remaining: total - completed - skipped }
}
