// ─────────────────────────────────────────────────────────────
// FOUR PAWS — OFFLINE VOICE COACH
// Uses browser-native Web Speech API. No external services.
// Degrades gracefully on unsupported browsers.
// ─────────────────────────────────────────────────────────────

export const VOICE_COACH_AVAILABLE = typeof window !== 'undefined' && 'speechSynthesis' in window

let _activeUtterance = null

// ─────────────────────────────────────────────────────────────
// VOICE CONFIGURATION
// Aims for a calm, clear, British-sounding voice.
// ─────────────────────────────────────────────────────────────
function getBestVoice() {
  if (!VOICE_COACH_AVAILABLE) return null
  const voices = window.speechSynthesis.getVoices()

  // Prefer calm, clear English voices
  const preferred = [
    v => v.name.toLowerCase().includes('daniel'),    // macOS Daniel (UK English)
    v => v.name.toLowerCase().includes('karen'),     // macOS Karen (Australian)
    v => v.name.toLowerCase().includes('samantha'),  // macOS Samantha
    v => v.lang === 'en-GB' && !v.localService === false,
    v => v.lang === 'en-GB',
    v => v.lang.startsWith('en-'),
    v => v.lang.startsWith('en'),
  ]

  for (const test of preferred) {
    const match = voices.find(test)
    if (match) return match
  }
  return voices[0] || null
}

export const VOICE_CONFIG = {
  rate:   0.88,   // slightly slower than default — measured, authoritative
  pitch:  0.95,   // slightly lower — calm, warm
  volume: 1.0,
}

// ─────────────────────────────────────────────────────────────
// CORE SPEAK FUNCTION
// ─────────────────────────────────────────────────────────────
export function speak(text, options = {}) {
  if (!VOICE_COACH_AVAILABLE || !text) return Promise.resolve()

  return new Promise((resolve) => {
    // Stop any current speech
    window.speechSynthesis.cancel()

    const utterance        = new SpeechSynthesisUtterance(text)
    utterance.rate         = options.rate   ?? VOICE_CONFIG.rate
    utterance.pitch        = options.pitch  ?? VOICE_CONFIG.pitch
    utterance.volume       = options.volume ?? VOICE_CONFIG.volume
    utterance.onend        = () => { _activeUtterance = null; resolve() }
    utterance.onerror      = () => { _activeUtterance = null; resolve() }

    // Set voice after voices load (async in Chrome)
    const trySpeak = () => {
      const voice = getBestVoice()
      if (voice) utterance.voice = voice
      _activeUtterance = utterance
      window.speechSynthesis.speak(utterance)
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = trySpeak
    } else {
      trySpeak()
    }
  })
}

export function stopSpeaking() {
  if (!VOICE_COACH_AVAILABLE) return
  window.speechSynthesis.cancel()
  _activeUtterance = null
}

export function isSpeaking() {
  return VOICE_COACH_AVAILABLE && window.speechSynthesis.speaking
}

// ─────────────────────────────────────────────────────────────
// COACHING SCRIPTS
// ─────────────────────────────────────────────────────────────
export function speakLessonIntro(lessonTitle, dogName) {
  const dog  = dogName || 'your companion'
  const text = `Welcome to ${lessonTitle}. Take a moment to settle ${dog} before you begin. When you're both ready, we'll start.`
  return speak(text)
}

export function speakLessonComplete(lessonTitle, dogName, clientName) {
  const dog    = dogName    || 'your companion'
  const client = clientName ? (clientName.split(' ')[0] + ', ') : ''
  const text   = `${client}${dog} has completed ${lessonTitle}. Excellent work. Take a short break before continuing.`
  return speak(text)
}

export function speakDailyGreeting(greeting) {
  return speak(greeting)
}

export function speakDailyInsight(insight) {
  return speak(insight)
}

export function speakEmergencyStep(step, stepNumber, totalSteps) {
  const text = `Step ${stepNumber} of ${totalSteps}. ${step}`
  return speak(text, { rate: 0.82, pitch: 0.9 })
}

export function speakAlert(alertTitle, summary) {
  const text = `${alertTitle}. ${summary}`
  return speak(text, { rate: 0.85 })
}

export function speakAchievement(achievementName, dogName) {
  const dog  = dogName || 'your companion'
  const text = `Congratulations. ${achievementName} has been awarded to ${dog}'s academy record.`
  return speak(text, { rate: 0.82, pitch: 1.0 })
}

// ─────────────────────────────────────────────────────────────
// SETTINGS PERSISTENCE
// ─────────────────────────────────────────────────────────────
export function getVoiceSettings() {
  try {
    const raw = localStorage.getItem('fp_voice_settings')
    return raw ? JSON.parse(raw) : { enabled: false, rate: VOICE_CONFIG.rate, pitch: VOICE_CONFIG.pitch, volume: VOICE_CONFIG.volume }
  } catch {
    return { enabled: false, ...VOICE_CONFIG }
  }
}

export function saveVoiceSettings(settings) {
  try {
    localStorage.setItem('fp_voice_settings', JSON.stringify(settings))
  } catch {}
}

export function isVoiceEnabled() {
  return VOICE_COACH_AVAILABLE && getVoiceSettings().enabled
}
