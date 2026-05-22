// ─────────────────────────────────────────────────────────────────────────────
// THE FOUR PAWS METHOD™
// Unified branded methodology. The philosophical and scientific backbone
// of the entire platform. Every page, system, and interaction connects here.
// ─────────────────────────────────────────────────────────────────────────────

export const FOUR_PAWS_METHOD = {
  name:     'The Four Paws Method™',
  tagline:  'Behaviour. Emotion. Recovery. Excellence.',
  version:  '2.0',

  philosophy: `The Four Paws Method™ is built on a single foundational truth: sustainable behavioural transformation is always emotional first. We do not train behaviours. We cultivate the emotional environment in which healthy behaviours become the dog's natural choice. Every technique, every protocol, and every session within this programme is designed around this principle.`,

  coreFramework: [
    {
      id: 'paw_1',
      name: 'Emotional Foundation',
      icon: '🌿',
      colour: '#10B981',
      tagline: 'Stability before structure.',
      principle: 'Before any behaviour can be reliably trained, the dog must operate from an emotionally regulated baseline. The Four Paws Method™ establishes this foundation as the non-negotiable first stage of every transformation.',
      protocols: [
        'Baseline emotional assessment across 6 behavioural dimensions',
        'Cortisol depletion through structured decompression',
        'Safe-space establishment and choice architecture',
        'Parasympathetic nervous system activation through enrichment sequencing',
        'Handler attunement — learning to read the dog\'s emotional language',
      ],
      outcomeMarker: 'Dog maintains calm baseline in low-stimulation environments without handler intervention.',
    },
    {
      id: 'paw_2',
      name: 'Recovery Intelligence',
      icon: '💧',
      colour: '#06B6D4',
      tagline: 'Speed of recovery defines resilience.',
      principle: 'Every dog will encounter arousal. The measure of genuine progress is not the absence of arousal — it is the speed and quality of recovery. The Four Paws Method™ actively develops recovery pathways through deliberate nervous system work.',
      protocols: [
        'Post-arousal recovery protocol sequencing',
        'Structured calming enrichment (lickimat, snuffle, scatter) timed for cortisol windows',
        'Recovery velocity tracking across the intelligence dashboard',
        'Threshold mapping with gradual, systematic expansion',
        'Recovery reinforcement — calmness becomes the most rewarded state',
      ],
      outcomeMarker: 'Dog returns to calm baseline within 3 minutes of exposure to previously challenging stimulus.',
    },
    {
      id: 'paw_3',
      name: 'Confidence Architecture',
      icon: '🦁',
      colour: '#C9A84C',
      tagline: 'Confidence is built, not found.',
      principle: 'Genuine confidence emerges from a history of successful, pressure-free interactions with the environment. The Four Paws Method™ designs confidence through micro-wins — each small, successful experience permanently reshapes the dog\'s neural associations.',
      protocols: [
        'Choice-based environmental exploration at the dog\'s pace',
        'Novel object and surface confidence sequences',
        'Success-stacking: designing scenarios where success is guaranteed',
        'Handler separation confidence work',
        'Social confidence protocols — controlled positive exposures',
      ],
      outcomeMarker: 'Dog approaches novel environments and objects with curiosity rather than avoidance or alarm.',
    },
    {
      id: 'paw_4',
      name: 'Environmental Mastery',
      icon: '🌍',
      colour: '#8B5CF6',
      tagline: 'The world becomes their ally.',
      principle: 'The final stage of The Four Paws Method™ transforms the environment from a source of challenge into a source of enrichment. Dogs who reach Environmental Mastery move through the world with genuine composure — not because stimuli have been removed, but because they have learned to interpret the world as safe.',
      protocols: [
        'Multi-environment generalisation of trained behaviours',
        'Urban, rural, and social environment exposure protocols',
        'Distraction-proofing through progressive challenge introduction',
        'Off-lead reliability in approved environments',
        'Lifelong maintenance programme design',
      ],
      outcomeMarker: 'Dog demonstrates reliable, composed behaviour across minimum 3 distinct environmental contexts without handler management.',
    },
  ],

  transformationStages: [
    { id: 'onboarding',     name: 'Onboarding',              icon: '🌱', colour: '#10B981', desc: 'Full behavioural assessment. Baseline established. Transformation pathway designed.' },
    { id: 'stabilisation',  name: 'Stabilisation',           icon: '⚓', colour: '#06B6D4', desc: 'Emotional regulation work. Cortisol depletion. Safe environment established.' },
    { id: 'recovery',       name: 'Recovery',                icon: '💧', colour: '#C9A84C', desc: 'Arousal recovery pathways developed. Threshold mapping active.' },
    { id: 'confidence',     name: 'Confidence Building',     icon: '🦁', colour: '#F59E0B', desc: 'Micro-win architecture. Environmental confidence accumulating.' },
    { id: 'mastery',        name: 'Environmental Mastery',   icon: '🌍', colour: '#8B5CF6', desc: 'Multi-environment generalisation. Distraction proofing. Reliability.' },
    { id: 'elite',          name: 'Elite Optimisation',      icon: '⭐', colour: '#B8C8FF', desc: 'Precision refinement. Advanced generalisation. Lifelong excellence preparation.' },
    { id: 'maintenance',    name: 'Maintenance & Legacy',    icon: '👑', colour: '#F5E09A', desc: 'Maintenance programme active. Legacy archive building. Alumni status.' },
  ],

  stabilityPrinciples: [
    'Calm is a skill — it must be actively taught, not merely hoped for.',
    'Every interaction is either depositing into or withdrawing from the emotional bank.',
    'Pressure without foundation creates suppression, not transformation.',
    'The quality of the handler\'s emotional state directly influences the dog\'s nervous system.',
    'Recovery speed is the most honest measure of true behavioural progress.',
    'Enrichment is not optional — it is the substrate for sustainable behaviour.',
    'Transformation is neurological. Every consistent session literally rewires the brain.',
  ],

  calmnessProtocols: {
    immediate: [
      'Disengage from stimulation entirely',
      'Three slow, audible exhales from the handler',
      'Scatter feed or lickimat introduction',
      'Move to a lower-stimulation environment',
      'Sit with the dog — no commands, no eye contact pressure',
    ],
    shortTerm: [
      'Full decompression day with zero demands',
      'Structured sniff walks in low-stimulation environments',
      'Passive enrichment sequences (puzzle, scatter, snuffle)',
      'TTouch massage or slow grooming',
      'Calm music or white noise',
    ],
    longTerm: [
      'Systematic desensitisation programme',
      'Comprehensive enrichment calendar',
      'Regular digital twin assessment reviews',
      'Stability monitoring protocol',
      'Handler behaviour and consistency coaching',
    ],
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE DETECTOR — determines current transformation stage from data
// ─────────────────────────────────────────────────────────────────────────────
export function detectTransformationStage(behaviourScores, completedLessons, streak) {
  const ind     = behaviourScores?.individual || {}
  const anxiety = ind.anxiety     || 50
  const conf    = 100 - (ind.confidence || 50)
  const react   = ind.reactivity  || 50
  const lessons = completedLessons || 0

  if (lessons === 0)     return FOUR_PAWS_METHOD.transformationStages[0] // onboarding
  if (anxiety > 65)      return FOUR_PAWS_METHOD.transformationStages[1] // stabilisation
  if (react > 60)        return FOUR_PAWS_METHOD.transformationStages[2] // recovery
  if (conf < 40)         return FOUR_PAWS_METHOD.transformationStages[3] // confidence
  if (lessons < 15)      return FOUR_PAWS_METHOD.transformationStages[4] // mastery
  if (lessons < 25)      return FOUR_PAWS_METHOD.transformationStages[5] // elite
  return FOUR_PAWS_METHOD.transformationStages[6]                         // maintenance
}

// ─────────────────────────────────────────────────────────────────────────────
// NEXT STAGE NARRATIVE — concierge copy for the current-to-next transition
// ─────────────────────────────────────────────────────────────────────────────
export function getStageNarrative(stage, dogName) {
  const dog = dogName || 'Your companion'
  const map = {
    onboarding:    `${dog}'s programme is being precisely calibrated. Every detail of this initial phase shapes the entire transformation trajectory.`,
    stabilisation: `${dog} is currently in the Stabilisation phase — the most important investment of the entire programme. Emotional regulation now makes everything else possible.`,
    recovery:      `${dog} is developing genuine recovery intelligence. The speed of return to calm is accelerating — a direct reflection of the neural work being done.`,
    confidence:    `${dog} is accumulating environmental confidence through deliberate micro-wins. The results of this phase will express themselves for a lifetime.`,
    mastery:       `${dog} is approaching Environmental Mastery. The world is beginning to feel like a resource rather than a threat.`,
    elite:         `${dog} is in Elite Optimisation — the refinement of already strong foundations into world-class reliability.`,
    maintenance:   `${dog} has completed The Four Paws Method™ transformation. The maintenance programme sustains and deepens what has been built.`,
  }
  return map[stage.id] || map.onboarding
}

// ─────────────────────────────────────────────────────────────────────────────
// RISK DETECTION ENGINE — AI priority queue for the operations centre
// ─────────────────────────────────────────────────────────────────────────────
const RISK_KEYS = {
  CLIENT_NOTES: 'fp_client_notes',
  STAFF_NOTES:  'fp_staff_notes',
  SYNC_QUEUE:   'fp_sync_queue',
  FAMILY_DATA:  'fp_family_data',
  RITUAL_LOG:   'fp_ritual_log',
  REFLECTION_LOG: 'fp_reflection_log',
  SCENARIO_LOG: 'fp_scenario_log',
}

export { RISK_KEYS }

export function detectClientRisks(clients) {
  const now    = Date.now()
  const alerts = []

  clients.forEach(client => {
    const lastActivity = client.lastActivity ? new Date(client.lastActivity).getTime() : 0
    const daysSince    = Math.floor((now - lastActivity) / 86400000)
    const prog         = client.courseProgress || {}
    const totalLessons = Object.values(prog).reduce((a, p) => a + (p.completedLessons?.length || 0), 0)

    if (daysSince > 7 && totalLessons > 0) {
      alerts.push({
        clientId: client.id, name: client.name, dogName: client.dog?.name,
        type: 'engagement_drop', priority: 'high',
        icon: '⚠️', colour: '#EF4444',
        message: `${client.name} has not engaged for ${daysSince} days. Concierge check-in recommended.`,
      })
    } else if (daysSince > 3 && totalLessons > 0) {
      alerts.push({
        clientId: client.id, name: client.name, dogName: client.dog?.name,
        type: 'engagement_warning', priority: 'medium',
        icon: '🔔', colour: '#F59E0B',
        message: `${client.name} has been inactive for ${daysSince} days.`,
      })
    }

    if (client.academyStatus === 'pending' && daysSince > 2) {
      alerts.push({
        clientId: client.id, name: client.name, dogName: client.dog?.name,
        type: 'activation_pending', priority: 'medium',
        icon: '🔑', colour: '#C9A84C',
        message: `${client.name}'s academy is pending activation (${daysSince} days).`,
      })
    }

    if (totalLessons === 0 && client.enrolledCourses?.length > 0 && daysSince > 1) {
      alerts.push({
        clientId: client.id, name: client.name, dogName: client.dog?.name,
        type: 'no_start', priority: 'medium',
        icon: '🌱', colour: '#10B981',
        message: `${client.name} has enrolled but not started any lessons. Welcome sequence recommended.`,
      })
    }
  })

  return alerts.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return (order[a.priority] || 2) - (order[b.priority] || 2)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF NOTES — secure local persistence
// ─────────────────────────────────────────────────────────────────────────────
export function loadStaffNotes(clientId) {
  try {
    const all = JSON.parse(localStorage.getItem(RISK_KEYS.STAFF_NOTES) || '{}')
    return all[clientId] || []
  } catch { return [] }
}

export function saveStaffNote(clientId, note) {
  try {
    const all = JSON.parse(localStorage.getItem(RISK_KEYS.STAFF_NOTES) || '{}')
    if (!all[clientId]) all[clientId] = []
    all[clientId] = [{ ...note, id: `note-${Date.now()}`, createdAt: new Date().toISOString() }, ...all[clientId]]
    localStorage.setItem(RISK_KEYS.STAFF_NOTES, JSON.stringify(all))
    return all[clientId]
  } catch { return [] }
}

export function deleteStaffNote(clientId, noteId) {
  try {
    const all = JSON.parse(localStorage.getItem(RISK_KEYS.STAFF_NOTES) || '{}')
    if (all[clientId]) all[clientId] = all[clientId].filter(n => n.id !== noteId)
    localStorage.setItem(RISK_KEYS.STAFF_NOTES, JSON.stringify(all))
  } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// OFFLINE SYNC ENGINE
// Manages local-first data with sync queue for when connectivity returns.
// Future-compatible: swap pushSyncQueue for Supabase/Firebase calls.
// ─────────────────────────────────────────────────────────────────────────────
export function loadSyncQueue() {
  try { return JSON.parse(localStorage.getItem(RISK_KEYS.SYNC_QUEUE) || '[]') }
  catch { return [] }
}

export function enqueueSyncItem(type, data) {
  const queue = loadSyncQueue()
  queue.push({ id: `sync-${Date.now()}`, type, data, enqueuedAt: new Date().toISOString(), status: 'pending' })
  localStorage.setItem(RISK_KEYS.SYNC_QUEUE, JSON.stringify(queue))
}

export function markSyncItemComplete(id) {
  const queue = loadSyncQueue().filter(i => i.id !== id)
  localStorage.setItem(RISK_KEYS.SYNC_QUEUE, JSON.stringify(queue))
}

export function getSyncStatus() {
  const queue   = loadSyncQueue()
  const pending = queue.filter(i => i.status === 'pending').length
  return { pending, total: queue.length, isOnline: navigator.onLine }
}

// ─────────────────────────────────────────────────────────────────────────────
// FAMILY PARTICIPATION SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
export function loadFamilyData() {
  try { return JSON.parse(localStorage.getItem(RISK_KEYS.FAMILY_DATA) || '{"members":[],"observations":[]}') }
  catch { return { members: [], observations: [] } }
}

export function saveFamilyMember(member) {
  const data = loadFamilyData()
  const existing = data.members.findIndex(m => m.id === member.id)
  if (existing >= 0) data.members[existing] = member
  else data.members.push({ ...member, id: `fam-${Date.now()}`, addedAt: new Date().toISOString() })
  localStorage.setItem(RISK_KEYS.FAMILY_DATA, JSON.stringify(data))
}

export function addFamilyObservation(observation) {
  const data = loadFamilyData()
  data.observations = [{ ...observation, id: `obs-${Date.now()}`, timestamp: new Date().toISOString() }, ...data.observations]
  if (data.observations.length > 50) data.observations = data.observations.slice(0, 50)
  localStorage.setItem(RISK_KEYS.FAMILY_DATA, JSON.stringify(data))
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY RITUALS SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
export const DAILY_RITUALS = {
  morning: {
    id: 'morning', name: 'Morning Calmness Ritual', icon: '🌅', duration: '5 min',
    colour: '#F59E0B',
    steps: [
      { id: 'breathe',  label: 'Handler reset',        desc: 'Take 3 slow breaths before engaging with your dog. Your nervous system sets the tone for theirs.' },
      { id: 'greet',    label: 'Calm morning greeting', desc: 'Greet your dog calmly — no excitable energy. A quiet acknowledgement is more valuable than enthusiastic hellos.' },
      { id: 'scatter',  label: 'Breakfast scatter feed', desc: 'Scatter breakfast across a snuffle mat or lawn. This activates the seeking circuit and starts the day with positive cognitive engagement.' },
      { id: 'walk',     label: 'Structured sniff walk',  desc: 'A 15-minute structured walk where the lead is loose and sniffing is actively encouraged. This is the most powerful morning regulation tool available.' },
    ],
  },
  evening: {
    id: 'evening', name: 'Evening Recovery Review', icon: '🌙', duration: '10 min',
    colour: '#8B5CF6',
    steps: [
      { id: 'observe',  label: 'Quiet observation',    desc: 'Sit with your dog for 3 minutes without asking anything of them. Observe their resting posture, breathing, and overall presentation.' },
      { id: 'lickimat', label: 'Lickimat session',     desc: 'A 5-minute lickimat session before the evening wind-down activates the parasympathetic system and primes deep sleep.' },
      { id: 'reflect',  label: 'Today\'s reflection',   desc: 'Note one behaviour observation from today. One moment of calm, one moment of reactivity, or one surprise. This data shapes tomorrow\'s plan.' },
      { id: 'settle',   label: 'Calm settle signal',   desc: 'Give a consistent settle cue and allow your dog to find their preferred resting position. Consistency here builds a powerful long-term behaviour.' },
    ],
  },
  wellness: {
    id: 'wellness', name: 'Wellness Reflection', icon: '💚', duration: '3 min',
    colour: '#10B981',
    steps: [
      { id: 'appetite', label: 'Appetite check',      desc: 'Note appetite quality today — normal, reduced, or elevated. Changes in appetite are often the earliest stress indicator.' },
      { id: 'posture',  label: 'Posture observation', desc: 'Observe your dog\'s resting posture. Loose and relaxed? Tucked? Tense? This is a direct window into their emotional state.' },
      { id: 'play',     label: 'Play quality',        desc: 'Did your dog initiate play today? The willingness to play is a reliable marker of overall emotional wellbeing.' },
      { id: 'sleep',    label: 'Sleep quality',       desc: 'Did your dog sleep soundly and easily? Quality sleep is essential for neurological consolidation of training gains.' },
    ],
  },
  confidence: {
    id: 'confidence', name: 'Confidence Check-In', icon: '🦁', duration: '5 min',
    colour: '#C9A84C',
    steps: [
      { id: 'novel',   label: 'Novel object exposure', desc: 'Introduce one mild novel object today — a bag, umbrella, or unusual container. Allow investigation on the dog\'s terms with zero pressure.' },
      { id: 'choice',  label: 'Choice moment',         desc: 'Offer a fork in the walk path and let your dog choose the direction. Agency builds confidence at a neurological level.' },
      { id: 'success', label: 'Guaranteed win',        desc: 'Ask for one cue you\'re certain your dog knows well in an easy environment. End on a confident, correct response.' },
    ],
  },
}

export function loadRitualLog() {
  try { return JSON.parse(localStorage.getItem(RISK_KEYS.RITUAL_LOG) || '{}') }
  catch { return {} }
}

export function markRitualComplete(ritualId, stepId) {
  const log = loadRitualLog()
  const today = new Date().toDateString()
  if (!log[today]) log[today] = {}
  if (!log[today][ritualId]) log[today][ritualId] = []
  if (!log[today][ritualId].includes(stepId)) log[today][ritualId].push(stepId)
  localStorage.setItem(RISK_KEYS.RITUAL_LOG, JSON.stringify(log))
  return log
}

export function getTodaysRitualProgress(ritualId) {
  const log   = loadRitualLog()
  const today = new Date().toDateString()
  return log[today]?.[ritualId] || []
}

// ─────────────────────────────────────────────────────────────────────────────
// BEHAVIOUR REFLECTION SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
const REFLECTION_QUESTIONS = [
  (dog) => ({ id: 'calm_post', q: `Did ${dog} appear calmer after today's enrichment session?`, type: 'yn' }),
  (dog) => ({ id: 'env_response', q: `How did ${dog} respond to environmental stimulation today?`, type: 'scale', labels: ['Very reactive', 'Slightly reactive', 'Calm', 'Very calm'] }),
  (dog) => ({ id: 'recovery', q: `When ${dog} encountered a challenge today, how quickly did they return to calm?`, type: 'scale', labels: ['Didn\'t recover well', 'Slow recovery', 'Moderate recovery', 'Fast recovery'] }),
  (dog) => ({ id: 'confidence', q: `Did ${dog} approach anything new with curiosity rather than avoidance today?`, type: 'yn' }),
  (dog) => ({ id: 'connection', q: `How connected did ${dog} feel to you today?`, type: 'scale', labels: ['Distant', 'Somewhat engaged', 'Connected', 'Deeply bonded'] }),
  (dog) => ({ id: 'appetite', q: `Was ${dog}'s appetite normal and relaxed today?`, type: 'yn' }),
  (dog) => ({ id: 'play', q: `Did ${dog} initiate any playful behaviour today?`, type: 'yn' }),
  (dog) => ({ id: 'threshold', q: `Did ${dog} encounter any triggers today?`, type: 'yn_detail' }),
]

export function getDailyReflectionQuestion(dogName, sessionCount = 0) {
  const dog = dogName || 'your companion'
  const idx = sessionCount % REFLECTION_QUESTIONS.length
  return REFLECTION_QUESTIONS[idx](dog)
}

export function saveReflectionAnswer(questionId, answer) {
  try {
    const log   = JSON.parse(localStorage.getItem(RISK_KEYS.REFLECTION_LOG) || '[]')
    const today = new Date().toDateString()
    log.unshift({ id: `ref-${Date.now()}`, questionId, answer, date: today, timestamp: new Date().toISOString() })
    if (log.length > 100) log.splice(100)
    localStorage.setItem(RISK_KEYS.REFLECTION_LOG, JSON.stringify(log))
  } catch {}
}

export function loadReflectionLog() {
  try { return JSON.parse(localStorage.getItem(RISK_KEYS.REFLECTION_LOG) || '[]') }
  catch { return [] }
}

// ─────────────────────────────────────────────────────────────────────────────
// BEHAVIOUR SCENARIO SIMULATOR
// ─────────────────────────────────────────────────────────────────────────────
export const BEHAVIOUR_SCENARIOS = [
  {
    id: 'guest_arrival',
    name: 'Guest Arrival',
    icon: '🚪',
    colour: '#C9A84C',
    difficulty: 'Intermediate',
    desc: 'One of the most common household challenges. This scenario prepares both dog and handler for calm, controlled guest introductions.',
    stages: [
      { label: 'Before the knock',       guidance: 'Prepare a scatter feed or lickimat before guests arrive. A dog with something to do is a dog that doesn\'t need to react to the door.' },
      { label: 'The doorbell moment',    guidance: 'If your dog reacts to the doorbell, do not rush to the door. Take a breath. Wait for a moment of calm before moving. The pause teaches that calm, not rushing, opens doors.' },
      { label: 'Introduction protocol', guidance: 'Ask guests to completely ignore your dog on entry. No eye contact, no reaching to pet. Allow your dog to approach on their own terms — this is the only authentic greeting.' },
      { label: 'Settlement',             guidance: 'Once initial arousal subsides, redirect to their mat with a lickimat or chew. Guests can then offer a treat by placing it on the floor — no reaching required.' },
    ],
    readinessCues: ['Dog settles within 5 minutes', 'Able to make calm eye contact with handler', 'No persistent vocalisation after initial greeting'],
    commonMistakes: ['Exciting the dog further by greeting enthusiastically at the door', 'Allowing guests to forcibly pet an uncertain dog', 'Punishing reactivity rather than rewarding calm'],
  },
  {
    id: 'leash_walking',
    name: 'Leash Walking',
    icon: '🦮',
    colour: '#10B981',
    difficulty: 'Foundation',
    desc: 'Quality leash walking is not about suppressing pulling. It is about building a partnership where walking together is the dog\'s preferred choice.',
    stages: [
      { label: 'Pre-walk decompression', guidance: 'A 3-minute scatter feed before the walk reduces the arousal spike that causes pulling. The walk begins before you leave the house.' },
      { label: 'Threshold management',  guidance: 'The moment you feel tension in the lead, stop completely. Do not pull back. Do not walk forward. Simply pause and wait for the dog to choose to return to you.' },
      { label: 'Engagement windows',    guidance: 'On every walk, find 3 moments to ask for eye contact and reward with a treat dropped at your feet. You are building the habit of checking in without being asked.' },
      { label: 'Decompression sniffing', guidance: 'Allow a minimum of 5 minutes of genuinely unrestricted sniffing. This is not a failure of the walk — it is the most neurologically valuable part of it.' },
    ],
    readinessCues: ['5 steps of loose lead movement', 'Voluntary eye contact on walks', 'Returns to handler side after distraction'],
    commonMistakes: ['Continuing forward while the lead is tight', 'Repeating the dog\'s name as a command', 'Shortening sniff time because of time pressure'],
  },
  {
    id: 'vet_visit',
    name: 'Vet Visit Preparation',
    icon: '🏥',
    colour: '#EF4444',
    difficulty: 'Advanced',
    desc: 'Vet visits are among the highest-arousal experiences for many dogs. This protocol transforms the vet clinic from a threat into a familiar, manageable environment.',
    stages: [
      { label: 'Clinic familiarisation',  guidance: 'Visit the vet clinic on non-appointment days. Sit in the car park with treats. Go inside just to say hello. Repeat until the location is emotionally neutral.' },
      { label: 'Handling desensitisation', guidance: 'At home, practise the exact handling a vet will perform — ears, paws, mouth, belly. Pair each touch with high-value treats. Slow and deliberate.' },
      { label: 'The waiting room',        guidance: 'Bring the most calming enrichment available (frozen lickimat works well). Position away from other animals if possible. Do not force interaction.' },
      { label: 'The consultation',        guidance: 'Communicate your dog\'s needs to the vet. A fearful dog deserves a slower, gentler approach. Most vets will accommodate — they see it as good care.' },
    ],
    readinessCues: ['Accepts all 4 paws handled at home', 'Eats treats in the car park', 'Remains below threshold inside clinic'],
    commonMistakes: ['Only visiting the vet when something is wrong', 'Reassuring anxious behaviour with physical comfort before it has resolved', 'Rushing through handling out of embarrassment'],
  },
  {
    id: 'dog_encounter',
    name: 'Dog Encounter Protocol',
    icon: '🐕',
    colour: '#8B5CF6',
    difficulty: 'Intermediate',
    desc: 'Whether on-lead or off, dog encounters are the most common trigger for reactive responses. This protocol builds a reliable framework for managed introductions.',
    stages: [
      { label: 'Distance management',     guidance: 'Begin encounters at a distance where your dog notices but can still take treats. This is their "working threshold" — the foundation of all reactive training.' },
      { label: 'Parallel walking',        guidance: 'The most powerful introduction tool is not face-to-face — it is parallel walking at distance. Walk in the same direction, at least 5 metres apart.' },
      { label: 'Lead body language',      guidance: 'The tension in your lead directly communicates to your dog. Loosen your grip, take a breath, and allow a natural loop. Your calm is their instruction.' },
      { label: 'Managed introductions',   guidance: 'If introduction is appropriate, allow brief (under 3 seconds) sniff and then move apart before either dog can escalate. Short and positive beats long and ambiguous.' },
    ],
    readinessCues: ['Takes treats at 10 metre distance from known trigger dog', 'Able to disengage from approaching dog on cue', 'Maintains loose lead for 20 steps near known trigger'],
    commonMistakes: ['Allowing face-to-face on-lead greetings', 'Tightening the lead as another dog approaches', 'Expecting immediate success — proximity is built over weeks, not days'],
  },
  {
    id: 'public_environment',
    name: 'Public Environment',
    icon: '🌆',
    colour: '#06B6D4',
    difficulty: 'Advanced',
    desc: 'The urban environment presents the highest density of stimulation. This scenario builds systematic tolerance through graduated exposure.',
    stages: [
      { label: 'Environment audit',       guidance: 'Before entering any challenging environment, observe it from a comfortable distance. Identify your dog\'s arousal level before entry. If already above baseline, reschedule.' },
      { label: 'Graduated entry',         guidance: 'Enter the least stimulating access point. Stay near exits. Give yourself and your dog an easy escape route — having it available usually means you won\'t need it.' },
      { label: 'Check-in protocol',       guidance: 'Every 60 seconds, quietly ask for eye contact with a hand touch or verbal cue. This maintains your connection and provides regular reset opportunities.' },
      { label: 'Exit before threshold',   guidance: 'The golden rule: leave before your dog needs to leave. If you can see tension building, move calmly away before the response occurs. Prevention is always better than management.' },
    ],
    readinessCues: ['Maintains loose lead in quiet pedestrian street', 'Able to settle in outdoor café setting', 'Responds to name in moderate distraction environments'],
    commonMistakes: ['Starting in high-stimulation environments', 'Staying too long when the dog is doing well', 'Returning to difficult environments immediately after a difficult experience'],
  },
]

export function loadScenarioLog() {
  try { return JSON.parse(localStorage.getItem(RISK_KEYS.SCENARIO_LOG) || '{}') }
  catch { return {} }
}

export function markScenarioStageComplete(scenarioId, stageIndex) {
  const log   = loadScenarioLog()
  if (!log[scenarioId]) log[scenarioId] = { completedStages: [], practiceCount: 0 }
  if (!log[scenarioId].completedStages.includes(stageIndex)) {
    log[scenarioId].completedStages.push(stageIndex)
  }
  log[scenarioId].practiceCount = (log[scenarioId].practiceCount || 0) + 1
  log[scenarioId].lastPracticed = new Date().toISOString()
  localStorage.setItem(RISK_KEYS.SCENARIO_LOG, JSON.stringify(log))
  return log[scenarioId]
}
