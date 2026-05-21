// ─────────────────────────────────────────────────────────────
// FOUR PAWS — COMPANION WELLNESS ECOSYSTEM
// Offline-first wellness tracking and AI enrichment generation.
// ─────────────────────────────────────────────────────────────

const WELLNESS_KEY   = 'fp_wellness_data'
const SCHEDULER_KEY  = 'fp_smart_schedule'
const RECOVERY_KEY   = 'fp_recovery_mode'
const HOUSEHOLD_KEY  = 'fp_household_data'
const THEME_KEY      = 'fp_visual_theme'
const NOTES_KEY      = 'fp_professional_notes'
const ARCHIVE_KEY    = 'fp_legacy_archive'

// ─────────────────────────────────────────────────────────────
// WELLNESS STORAGE
// ─────────────────────────────────────────────────────────────
export function loadWellnessData() {
  try { return JSON.parse(localStorage.getItem(WELLNESS_KEY) || '{}') }
  catch { return {} }
}

export function saveWellnessData(data) {
  try { localStorage.setItem(WELLNESS_KEY, JSON.stringify(data)) }
  catch {}
}

export function logWellnessEntry(entry) {
  const data = loadWellnessData()
  const log  = data.log || []
  log.unshift({ ...entry, timestamp: new Date().toISOString() })
  saveWellnessData({ ...data, log: log.slice(0, 120) })
}

export function getWellnessSummary(log = []) {
  if (!log.length) return null
  const recent = log.slice(0, 7)
  const avg = (key) => Math.round(recent.reduce((a, e) => a + (e[key] || 0), 0) / recent.length)
  return {
    avgSleep:      avg('sleep'),
    avgExercise:   avg('exercise'),
    avgNutrition:  avg('nutrition'),
    avgEnrichment: avg('enrichment'),
    avgRecovery:   avg('recovery'),
    trend:         recent[0]?.recovery > (recent[3]?.recovery || 0) ? 'improving' : 'stable',
  }
}

// ─────────────────────────────────────────────────────────────
// AI ENRICHMENT GENERATOR
// ─────────────────────────────────────────────────────────────
const ENRICHMENT_BANK = {
  scent: [
    { name: 'Garden Treasure Hunt',    duration: '15 min', icon: '🌿', desc: 'Hide high-value treats around the garden in varied difficulty locations. Let your dog problem-solve independently.' },
    { name: 'Snuffle Mat Foraging',    duration: '10 min', icon: '🌾', desc: 'Fill a snuffle mat with their daily meal allowance. The nose work provides mental fatigue equivalent to 30 min physical exercise.' },
    { name: 'Muffin Tin Game',         duration: '10 min', icon: '🧁', desc: 'Cover each hole of a muffin tin with tennis balls, hide treats underneath. Dogs use problem-solving and scent to locate rewards.' },
    { name: 'Scent Box Game',          duration: '15 min', icon: '📦', desc: 'Place one box with a treat among several empty boxes. Allow the dog to investigate and reward the correct choice.' },
    { name: 'Track and Find',          duration: '20 min', icon: '👣', desc: 'Lay a scent trail with treats across the garden or home. Begin short and increase difficulty progressively.' },
  ],
  indoor: [
    { name: 'Lickimat Meditation',     duration: '15 min', icon: '😌', desc: 'Spread a calming mixture (plain yoghurt, banana, peanut butter) on a lickimat. Licking releases endorphins and reduces cortisol.' },
    { name: 'Frozen Kong Therapy',     duration: '20 min', icon: '🧊', desc: 'Fill a Kong with wet food, kibble, and treats, then freeze overnight. Provides extended mental engagement and jaw relaxation.' },
    { name: 'Find It Game',            duration: '10 min', icon: '🔍', desc: 'Toss treats across the room while the dog stays, then release with "find it". Builds impulse control alongside engagement.' },
    { name: 'Box Destruction',         duration: '15 min', icon: '📫', desc: 'Place treats inside cardboard boxes of varying difficulty. Dogs enjoy the problem-solving and destruction — it is entirely natural.' },
    { name: 'Scatter Feeding',         duration: '10 min', icon: '🌟', desc: 'Scatter the entire daily meal across grass or a carpet. Converts meal time into 10-15 minutes of natural foraging behaviour.' },
  ],
  confidence: [
    { name: 'Novel Object Introduction', duration: '10 min', icon: '🔮', desc: 'Introduce one unfamiliar object at distance. Allow approach on the dog\'s terms. Reward any investigation with calm praise.' },
    { name: 'Floor Texture Walk',       duration: '15 min', icon: '🛤️', desc: 'Create a sensory path using different textures (grass, gravel, smooth, rough). Allow the dog to choose when to step onto each surface.' },
    { name: 'Choose Your Own Walk',     duration: '20 min', icon: '🗺️', desc: 'Follow your dog\'s nose. Let them choose direction, pace, and stopping points. Choice reduces anxiety and builds confidence.' },
    { name: 'Platform Training',        duration: '10 min', icon: '🎯', desc: 'Teach your dog to place both front feet on an upturned washing-up bowl. Builds body awareness and confidence simultaneously.' },
    { name: 'Look At That Game',        duration: '15 min', icon: '👀', desc: 'At a threshold distance from a mild trigger, reward the dog for calmly observing. Builds positive emotional associations.' },
  ],
  physical: [
    { name: 'Decompression Walk',       duration: '30 min', icon: '🚶', desc: 'Long line or off-lead in a quiet environment. No commands — just allow sniffing, exploring, and self-directed movement.' },
    { name: 'Tug with Rules',           duration: '10 min', icon: '🪢', desc: 'Structured tug game with a clear start and stop cue. Teaches self-regulation alongside physical release.' },
    { name: 'Body Awareness Circuit',   duration: '15 min', icon: '🏃', desc: 'Low cavaletti poles, platforms, and balance discs create a body awareness course that builds proprioception and calm focus.' },
    { name: 'Parallel Lead Walking',    duration: '20 min', icon: '🐕', desc: 'Walk parallel to another calm dog at distance. Natural parallel movement reduces arousal compared to face-to-face greeting.' },
    { name: 'Swim or Paddle Session',   duration: '30 min', icon: '💧', desc: 'Water provides non-impact physical exercise that reduces cortisol levels significantly. Even paddling provides hydrotherapy benefit.' },
  ],
  calm: [
    { name: 'Mat Relaxation Session',   duration: '15 min', icon: '🧘', desc: 'Teach the dog to settle on a mat in a calm, quiet environment. Reward duration on the mat with calm praise. Builds a conditioned relaxation cue.' },
    { name: 'TTouch Body Work',         duration: '15 min', icon: '🤲', desc: 'Gentle circular body touches following the TTouch method. Reduces muscle tension and activates the parasympathetic nervous system.' },
    { name: 'Classical Music Session',  duration: '20 min', icon: '🎵', desc: 'Play Through A Dog\'s Ear or similar canine-specific classical music at low volume during rest time. Proven to reduce anxiety markers.' },
    { name: 'Massage and Grooming',     duration: '20 min', icon: '✨', desc: 'Slow, calm grooming with gentle pressure. Begin at the least sensitive areas, work gradually. Builds touch tolerance and deepens bond.' },
    { name: 'Breathing Exercise',       duration: '5 min',  icon: '🫁', desc: 'Lie beside your dog and breathe slowly and deeply. Dogs co-regulate with their humans. Your calm nervous system becomes their resource.' },
  ],
}

export function generateEnrichmentPlan(behaviourScores, dogProfile, count = 5) {
  if (!dogProfile) return []

  const { anxiety = 5, confidence = 5, energy = 5, socialisation = 5, age = 12 } = dogProfile
  const ind = behaviourScores?.individual || {}

  const priorities = []

  // Determine what this dog needs most
  if ((ind.anxiety || anxiety * 10) > 60)      priorities.push('calm', 'calm', 'scent')
  if ((ind.confidence || confidence * 10) < 40) priorities.push('confidence', 'confidence')
  if ((ind.energy || energy * 10) > 70)         priorities.push('physical', 'scent')
  if (age < 10)                                  priorities.push('confidence', 'indoor', 'physical')
  if (age > 84)                                  priorities.push('calm', 'scent', 'indoor')

  // Default mix
  if (priorities.length < 3) priorities.push('scent', 'indoor', 'confidence', 'physical')

  const selected = []
  const used     = new Set()

  priorities.forEach(cat => {
    if (selected.length >= count) return
    const pool = ENRICHMENT_BANK[cat] || []
    const item = pool.find(a => !used.has(a.name))
    if (item) { selected.push({ ...item, category: cat }); used.add(item.name) }
  })

  // Fill remainder with indoor
  const indoor = ENRICHMENT_BANK.indoor.filter(a => !used.has(a.name))
  while (selected.length < count && indoor.length > 0) {
    const item = indoor.shift()
    selected.push({ ...item, category: 'indoor' })
  }

  return selected.slice(0, count)
}

// ─────────────────────────────────────────────────────────────
// RECOVERY MODES
// ─────────────────────────────────────────────────────────────
export const RECOVERY_MODES = {
  calm_home: {
    id: 'calm_home', label: 'Calm Home Mode', icon: '🏠', colour: '#10B981',
    description: 'Optimised for maximum decompression in the home environment.',
    adjustments: ['Reduce training complexity to 50%', 'Prioritise calm enrichment', 'No threshold work today', 'Extend rest periods'],
    enrichmentFocus: ['calm', 'scent'],
    lessonTypes: ['foundation', 'settle', 'calm'],
  },
  public_space: {
    id: 'public_space', label: 'Public Space Mode', icon: '🌆', colour: '#F59E0B',
    description: 'Preparation and management for public environment navigation.',
    adjustments: ['Begin 15 min below normal threshold', 'Maintain high reward rate', 'Use parallel walking', 'Exit before fatigue'],
    enrichmentFocus: ['confidence', 'calm'],
    lessonTypes: ['threshold', 'focus', 'confidence'],
  },
  guest_arrival: {
    id: 'guest_arrival', label: 'Guest Arrival Mode', icon: '🚪', colour: '#8B5CF6',
    description: 'Structured protocol for managing dog behaviour during visitor arrivals.',
    adjustments: ['Exercise before guests arrive', 'Prepare safe space exit route', 'Brief visitors on greeting protocol', 'Reward calm behaviour only'],
    enrichmentFocus: ['calm', 'indoor'],
    lessonTypes: ['greeting', 'calm', 'settle'],
  },
  vet_visit: {
    id: 'vet_visit', label: 'Vet Visit Mode', icon: '🏥', colour: '#EF4444',
    description: 'Pre- and post-veterinary visit management and recovery.',
    adjustments: ['Skip meals before the visit (unless medically required)', 'Bring highest-value treats', 'Stay calm in waiting area', 'Extended decompression post-visit'],
    enrichmentFocus: ['calm', 'indoor'],
    lessonTypes: ['touch_tolerance', 'handling', 'calm'],
  },
  travel: {
    id: 'travel', label: 'Travel Preparation Mode', icon: '🚗', colour: '#06B6D4',
    description: 'Graduated preparation for travel and new environment exposure.',
    adjustments: ['Practice car relaxation daily', 'Build positive vehicle associations', 'Short trips before long journeys', 'Bring familiar items'],
    enrichmentFocus: ['confidence', 'calm'],
    lessonTypes: ['confinement', 'confidence', 'settling'],
  },
  separation_recovery: {
    id: 'separation_recovery', label: 'Separation Recovery Mode', icon: '💔', colour: '#EC4899',
    description: 'Structured independence building and separation distress recovery.',
    adjustments: ['Micro-departures only (seconds to minutes)', 'Calm departures and returns', 'High-value pre-departure enrichment', 'No fuss on return until calm'],
    enrichmentFocus: ['indoor', 'calm'],
    lessonTypes: ['independence', 'settling', 'confidence'],
  },
}

export function loadActiveRecoveryMode() {
  try { return localStorage.getItem(RECOVERY_KEY) || null }
  catch { return null }
}

export function setActiveRecoveryMode(modeId) {
  try {
    if (modeId) localStorage.setItem(RECOVERY_KEY, modeId)
    else localStorage.removeItem(RECOVERY_KEY)
  } catch {}
}

// ─────────────────────────────────────────────────────────────
// SMART SCHEDULER
// ─────────────────────────────────────────────────────────────
export function loadSchedule() {
  try { return JSON.parse(localStorage.getItem(SCHEDULER_KEY) || '{}') }
  catch { return {} }
}

export function saveSchedule(schedule) {
  try { localStorage.setItem(SCHEDULER_KEY, JSON.stringify(schedule)) }
  catch {}
}

export function generateSmartSchedule(dogProfile, behaviourScores, clientProfile) {
  if (!dogProfile) return null

  const { energy = 5, anxiety = 5, age = 12 } = dogProfile
  const lifestyle = clientProfile?.lifestyle || 'Moderate — regular shorter walks'
  const busyClient = lifestyle.includes('Busy') || lifestyle.includes('Working')

  const isHighEnergy = energy > 6
  const isAnxious    = anxiety > 6
  const isPuppy      = age < 10
  const isSenior     = age > 96

  return {
    morning: {
      time:     '07:30',
      type:     isHighEnergy ? 'Physical exercise' : 'Calm sniff walk',
      duration: isHighEnergy ? '30 min' : '20 min',
      notes:    isPuppy ? 'Keep to 5 min per month of age' : isSenior ? 'Gentle pace, allow extra sniff time' : 'Set the energy level for the day',
    },
    midMorning: {
      time:     '10:00',
      type:     'Training session',
      duration: busyClient ? '5 min' : '10 min',
      notes:    isAnxious ? 'Foundation skills only — keep arousal low' : 'Advance to next lesson module',
    },
    midday: {
      time:     '12:30',
      type:     'Enrichment feeding',
      duration: '15 min',
      notes:    'Scatter feed or Kong — convert meal into mental engagement',
    },
    afternoon: {
      time:     '15:00',
      type:     isAnxious ? 'Decompression rest' : 'Play and engagement',
      duration: '20 min',
      notes:    isHighEnergy ? 'Physical play before afternoon rest' : 'Calm enrichment activity',
    },
    evening: {
      time:     '18:30',
      type:     'Walk and social',
      duration: '30 min',
      notes:    isAnxious ? 'Quiet route, low stimulation' : 'Social sniff walk or neighbourhood exploration',
    },
    bedtime: {
      time:     '21:00',
      type:     'Calm settling',
      duration: '15 min',
      notes:    'Mat training, lickimat, or TTouch. Signal the end of the active day.',
    },
  }
}

// ─────────────────────────────────────────────────────────────
// HOUSEHOLD COMMAND CENTRE
// ─────────────────────────────────────────────────────────────
export function loadHouseholdData() {
  try { return JSON.parse(localStorage.getItem(HOUSEHOLD_KEY) || '{}') }
  catch { return {} }
}

export function saveHouseholdData(data) {
  try { localStorage.setItem(HOUSEHOLD_KEY, JSON.stringify(data)) }
  catch {}
}

// ─────────────────────────────────────────────────────────────
// PROFESSIONAL NOTES
// ─────────────────────────────────────────────────────────────
export function loadNotes() {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]') }
  catch { return [] }
}

export function saveNote(note) {
  const notes = loadNotes()
  notes.unshift({ ...note, id: Date.now().toString(36), timestamp: new Date().toISOString() })
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes.slice(0, 100))) }
  catch {}
}

export function updateNote(id, patch) {
  const notes  = loadNotes()
  const idx    = notes.findIndex(n => n.id === id)
  if (idx > -1) notes[idx] = { ...notes[idx], ...patch, updatedAt: new Date().toISOString() }
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)) }
  catch {}
}

export function deleteNote(id) {
  const notes = loadNotes().filter(n => n.id !== id)
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)) }
  catch {}
}

// ─────────────────────────────────────────────────────────────
// VISUAL THEMES
// ─────────────────────────────────────────────────────────────
export const VISUAL_THEMES = {
  obsidian_gold: {
    id:       'obsidian_gold',
    name:     'Obsidian Gold',
    icon:     '🌑',
    primary:  '#C9A84C',
    bg:       '#0A0A0A',
    surface:  '#141414',
    text:     '#F5F0E8',
    accent:   '#F5E09A',
  },
  platinum_silver: {
    id:       'platinum_silver',
    name:     'Platinum Silver',
    icon:     '💎',
    primary:  '#C0C0C0',
    bg:       '#0C0C12',
    surface:  '#16161E',
    text:     '#F0F0F8',
    accent:   '#E8E8FF',
  },
  midnight_sapphire: {
    id:       'midnight_sapphire',
    name:     'Midnight Sapphire',
    icon:     '💙',
    primary:  '#3B82F6',
    bg:       '#060B14',
    surface:  '#0D1421',
    text:     '#E8F0FF',
    accent:   '#93C5FD',
  },
  royal_emerald: {
    id:       'royal_emerald',
    name:     'Royal Emerald',
    icon:     '💚',
    primary:  '#10B981',
    bg:       '#060E0A',
    surface:  '#0D1810',
    text:     '#E8FFF4',
    accent:   '#6EE7B7',
  },
  ivory_luxe: {
    id:       'ivory_luxe',
    name:     'Ivory Luxe',
    icon:     '🤍',
    primary:  '#D4A96A',
    bg:       '#0E0C09',
    surface:  '#1A1812',
    text:     '#FFF8F0',
    accent:   '#F5DEB3',
  },
}

export function loadActiveTheme() {
  try {
    const id = localStorage.getItem(THEME_KEY) || 'obsidian_gold'
    return VISUAL_THEMES[id] || VISUAL_THEMES.obsidian_gold
  } catch { return VISUAL_THEMES.obsidian_gold }
}

export function saveActiveTheme(themeId) {
  try { localStorage.setItem(THEME_KEY, themeId) }
  catch {}
}

// ─────────────────────────────────────────────────────────────
// LEGACY ARCHIVE
// ─────────────────────────────────────────────────────────────
export function loadArchive() {
  try { return JSON.parse(localStorage.getItem(ARCHIVE_KEY) || '[]') }
  catch { return [] }
}

export function archiveEntry(entry) {
  const archive = loadArchive()
  archive.unshift({ ...entry, archivedAt: new Date().toISOString(), id: Date.now().toString(36) })
  try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive)) }
  catch {}
}

// ─────────────────────────────────────────────────────────────
// TRANSFORMATION PHASES
// ─────────────────────────────────────────────────────────────
export const TRANSFORMATION_PHASES = [
  {
    phase: 1, name: 'Stabilisation',
    subtitle: 'Building the Foundation',
    icon: '🌱', colour: '#6B7280',
    description: 'Establishing safety, routine, and fundamental trust. Every calm moment is a building block.',
    minLessons: 0, maxLessons: 7,
    milestones: ['First lesson completed', 'Routine established', 'Safe space identified'],
  },
  {
    phase: 2, name: 'Confidence Building',
    subtitle: 'Growing from Within',
    icon: '🌿', colour: '#10B981',
    description: 'Core confidence protocols activate. The dog begins to make positive associations with previously challenging stimuli.',
    minLessons: 8, maxLessons: 19,
    milestones: ['Calm on mat achieved', 'Reduced threshold reactivity', 'Voluntary engagement increasing'],
  },
  {
    phase: 3, name: 'Environmental Mastery',
    subtitle: 'Conquering the World',
    icon: '🌳', colour: '#C9A84C',
    description: 'Generalisation of trained behaviours to new environments and situations. True transfer of learning.',
    minLessons: 20, maxLessons: 39,
    milestones: ['Multi-environment success', 'Unprompted calm responses', 'Proactive engagement visible'],
  },
  {
    phase: 4, name: 'Elite Optimisation',
    subtitle: 'The Transformation Complete',
    icon: '⭐', colour: '#F59E0B',
    description: 'Refinement and optimisation of elite behaviour. The dog operates consistently at their highest potential.',
    minLessons: 40, maxLessons: 999,
    milestones: ['Consistent threshold mastery', 'Self-regulation visible', 'Exceptional social confidence'],
  },
]

export function getCurrentPhase(completedLessons) {
  return TRANSFORMATION_PHASES.find(
    p => completedLessons >= p.minLessons && completedLessons <= p.maxLessons
  ) || TRANSFORMATION_PHASES[0]
}

export function getNextPhase(completedLessons) {
  const current = getCurrentPhase(completedLessons)
  return TRANSFORMATION_PHASES.find(p => p.phase === current.phase + 1) || null
}

// ─────────────────────────────────────────────────────────────
// SOUNDSCAPES (offline — Web Audio API tones)
// ─────────────────────────────────────────────────────────────
export const SOUNDSCAPES = [
  { id: 'calm_recovery',   name: 'Calm Recovery',    icon: '🌊', desc: 'Deep, slow tones for post-session decompression.',   baseFreq: 174, beatFreq: 0.5 },
  { id: 'sleep_support',   name: 'Sleep Support',    icon: '🌙', desc: 'Delta-range binaural tones for rest and recovery.',  baseFreq: 136, beatFreq: 0.5 },
  { id: 'anxiety_calm',    name: 'Anxiety Calm',     icon: '🕊️', desc: 'Theta-wave frequencies for anxiety reduction.',      baseFreq: 528, beatFreq: 4   },
  { id: 'focus_training',  name: 'Focus Training',   icon: '🎯', desc: 'Alpha-range tones that support learning and recall.',baseFreq: 396, beatFreq: 10  },
  { id: 'nature_walk',     name: 'Nature Ambience',  icon: '🌿', desc: 'White noise + nature frequencies for calm alertness.',baseFreq: 285, beatFreq: 7  },
]

let _audioContext = null
let _oscillators  = []

export function playSoundscape(soundscape) {
  stopSoundscape()
  if (typeof window === 'undefined' || !window.AudioContext && !window.webkitAudioContext) return false

  try {
    _audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const { baseFreq, beatFreq } = soundscape

    // Left channel
    const oscLeft   = _audioContext.createOscillator()
    const gainLeft  = _audioContext.createGain()
    const panLeft   = _audioContext.createStereoPanner()
    oscLeft.frequency.value = baseFreq
    oscLeft.type            = 'sine'
    gainLeft.gain.value     = 0.08
    panLeft.pan.value       = -1
    oscLeft.connect(gainLeft).connect(panLeft).connect(_audioContext.destination)
    oscLeft.start()

    // Right channel (binaural beat)
    const oscRight  = _audioContext.createOscillator()
    const gainRight = _audioContext.createGain()
    const panRight  = _audioContext.createStereoPanner()
    oscRight.frequency.value = baseFreq + beatFreq
    oscRight.type            = 'sine'
    gainRight.gain.value     = 0.08
    panRight.pan.value       = 1
    oscRight.connect(gainRight).connect(panRight).connect(_audioContext.destination)
    oscRight.start()

    _oscillators = [oscLeft, oscRight]
    return true
  } catch { return false }
}

export function stopSoundscape() {
  try {
    _oscillators.forEach(o => { try { o.stop(); o.disconnect() } catch {} })
    _oscillators = []
    if (_audioContext) { _audioContext.close(); _audioContext = null }
  } catch {}
}

export function isSoundscapePlaying() {
  return _oscillators.length > 0 && _audioContext?.state === 'running'
}
