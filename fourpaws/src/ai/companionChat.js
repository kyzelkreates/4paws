// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — AI COMPANION CONVERSATION SYSTEM
// Lightweight offline conversational interface.
// Behaviour-aware, emotionally intelligent, concierge tone.
// No external APIs. Fully local. PWA-native.
// ─────────────────────────────────────────────────────────────────────────────

const CHAT_KEY = 'fp_companion_chat'
const MAX_HISTORY = 40

// ─────────────────────────────────────────────────────────────────────────────
// INTENT RECOGNITION — keyword-based local NLU
// ─────────────────────────────────────────────────────────────────────────────
const INTENTS = [
  { id: 'how_today',       patterns: ['how did', 'how was', 'how is', 'how are', 'today'],                                    },
  { id: 'tomorrow_focus',  patterns: ['tomorrow', 'next session', 'what should we', 'what to focus', 'focus on'],            },
  { id: 'progress',        patterns: ['progress', 'improving', 'getting better', 'transformation', 'how far'],              },
  { id: 'emotional',       patterns: ['emotional', 'feeling', 'mood', 'calm', 'anxious', 'stressed', 'happy'],              },
  { id: 'training_advice', patterns: ['training', 'lesson', 'practice', 'work on', 'teach', 'behaviour'],                   },
  { id: 'recovery',        patterns: ['recovery', 'recover', 'arousal', 'threshold', 'reactive', 'reaction'],               },
  { id: 'confidence',      patterns: ['confidence', 'confident', 'scared', 'fear', 'nervous', 'shy'],                       },
  { id: 'wellness',        patterns: ['wellness', 'health', 'eating', 'sleep', 'appetite', 'energy', 'tired'],              },
  { id: 'hello',           patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon'],              },
  { id: 'thanks',          patterns: ['thank', 'thanks', 'appreciate', 'helpful'],                                           },
  { id: 'help',            patterns: ['help', 'what can', 'what do you know', 'tell me', 'guide'],                          },
  { id: 'emergency',       patterns: ['emergency', 'panic', 'scared', 'urgent', 'crisis', 'biting', 'barking', 'attack'],  },
  { id: 'enrichment',      patterns: ['enrichment', 'lickimat', 'snuffle', 'puzzle', 'play', 'toys'],                       },
  { id: 'streak',          patterns: ['streak', 'consistent', 'days', 'how long'],                                           },
  { id: 'stage',           patterns: ['stage', 'phase', 'where are we', 'method', 'four paws'],                             },
]

function detectIntent(input) {
  const lower = input.toLowerCase()
  for (const intent of INTENTS) {
    if (intent.patterns.some(p => lower.includes(p))) return intent.id
  }
  return 'general'
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE GENERATOR — concierge-quality offline responses
// ─────────────────────────────────────────────────────────────────────────────
export function generateCompanionResponse(input, context) {
  const intent  = detectIntent(input)
  const dog     = context.dogName   || 'your companion'
  const name    = context.firstName || 'there'
  const ind     = context.behaviourScores?.individual || {}
  const emotion = context.emotionalState
  const streak  = context.streak
  const stage   = context.stage

  const responses = {
    hello: [
      `Good to hear from you, ${name}. How has ${dog} been today?`,
      `Hello, ${name}. ${dog}'s programme is ready when you are. How can I help?`,
      `Welcome back, ${name}. ${dog} is in ${emotion?.label?.toLowerCase() || 'a calm'} state. What would you like to explore?`,
    ],

    how_today: [
      `${dog}'s emotional profile today is reading as ${emotion?.label?.toLowerCase() || 'settled'}. ${emotion?.desc || 'Continue the current approach.'}`,
      `Based on ${dog}'s current data, today presents ${(ind.anxiety || 50) < 40 ? 'an excellent window for structured training work' : 'an ideal opportunity for calm enrichment and recovery focus'}.`,
      `${dog} is showing ${(ind.reactivity || 50) < 40 ? 'reduced reactivity indicators today — a positive session is likely' : 'elevated arousal today. Prioritise decompression before any structured work'}.`,
    ],

    tomorrow_focus: [
      `Tomorrow's recommended focus for ${dog}: ${(ind.anxiety || 50) > 60 ? 'decompression and threshold work in a low-stimulation environment' : (100 - (ind.confidence || 50)) < 50 ? 'confidence micro-wins — one novel challenge with guaranteed success' : 'a precision session to refine an established behaviour in a new context'}.`,
      `For tomorrow, I'd suggest ${dog} benefits most from ${(ind.reactivity || 50) > 60 ? 'parallel walking practice at a comfortable distance from known triggers' : 'an engagement-focused session — 5 minutes of focused, positive work'}.`,
      `Tomorrow's session for ${dog} should begin with 10 minutes of decompression sniffing before any formal training. This sets the optimal neurological state for learning.`,
    ],

    progress: [
      `${dog}'s transformation is genuinely progressing. ${stage ? `You're currently in the ${stage.name} phase — ${stage.desc}` : 'Each session compounds the work of every previous one.'}`,
      streak?.current > 0 ? `${dog} has a ${streak.current}-day training streak — consistency of this quality is exactly what drives lasting change.` : `Every session you complete with ${dog} is a deposit into their neurological transformation. The returns compound over time.`,
      `The progress you're seeing with ${dog} reflects a carefully calibrated process. The emotional foundation work being done now will express itself as effortless composure in the coming months.`,
    ],

    emotional: [
      `${dog}'s current emotional reading is ${emotion?.label?.toLowerCase() || 'uncertain'}. ${emotion?.desc || 'Continue logging observations to build a more complete picture.'}`,
      `Emotional intelligence in dogs is most accurately read through posture, breathing, and recovery speed rather than individual behaviours. ${dog}'s data suggests ${(ind.anxiety || 50) < 40 ? 'healthy emotional regulation' : 'active emotional processing — support that with enrichment'}.`,
      `${dog}'s emotional state is contextual — it will fluctuate with environment, time of day, and handler energy. The key metric is recovery speed, which I'll continue monitoring.`,
    ],

    training_advice: [
      `For ${dog}'s current stage, the most effective training approach is ${(ind.anxiety || 50) > 60 ? 'to suspend formal demands and focus entirely on building the emotional foundation. Training on an anxious dog produces suppression, not transformation' : 'short, high-value sessions of 3-5 minutes with clear, achievable criteria'}.`,
      `${dog}'s learning is most receptive in the morning session window — cortisol peaks support new learning acquisition. If you can, schedule formal training within 2 hours of waking.`,
      `The single most powerful training decision you can make for ${dog} today is to reward every moment of calm you observe — unrequested, unprompted, and frequently. Calm becomes the default when it's the most rewarding choice.`,
    ],

    recovery: [
      `${dog}'s recovery pathway is ${(ind.reactivity || 50) < 40 ? 'developing well. Continue the threshold exposure work at the current distance and pace' : 'still building. Maintain distance from known triggers and prioritise the quality of calm moments over quantity of exposure'}.`,
      `Recovery speed is the most honest progress marker available. After an arousal event, ${dog} should be returning to baseline within ${(ind.reactivity || 50) < 50 ? '3-5 minutes' : '10-15 minutes'} — log this accurately in the behaviour journal.`,
      `Structured recovery enrichment — lickimat, scatter feed, snuffle mat — within 5 minutes of an arousal event actively accelerates ${dog}'s neurological reset.`,
    ],

    confidence: [
      `${dog}'s confidence score is currently at ${100 - (ind.confidence || 50)}%. ${(100 - (ind.confidence || 50)) > 60 ? 'Genuine environmental confidence is building — this is the most durable form of transformation.' : 'Continue the micro-win architecture — guaranteed successes in mild challenges accumulate into permanent neural change.'}`,
      `Confidence in ${dog} grows through exposure to mild challenges they navigate successfully on their own terms. Pressure and forcing never produce genuine confidence — only compliance.`,
      `One of the most powerful confidence builders for ${dog} right now is choice. Offer decisions wherever possible — route on a walk, order of enrichment activities, which toy. Agency builds confidence neurologically.`,
    ],

    wellness: [
      `${dog}'s wellness indicators are being monitored across 4 dimensions: sleep quality, appetite, exercise tolerance, and recovery capacity. The data is building over time and will generate increasingly precise recommendations.`,
      `Wellness and behaviour are directly connected for ${dog}. Sleep quality alone accounts for 30-40% of the variation in daily reactivity levels. If you notice unusual behaviour, check sleep patterns first.`,
      `For optimal wellness in ${dog}, the sequence matters: calm enrichment before exercise, decompression after arousal, and quality sleep between sessions. This rhythm supports the neurological consolidation of all training work.`,
    ],

    enrichment: [
      `For ${dog}'s current emotional state, ${(ind.anxiety || 50) > 50 ? 'passive enrichment (lickimat, snuffle mat, scatter feed) is the most appropriate choice — it activates the seeking circuit without adding arousal' : 'cognitive enrichment (puzzle feeders, scent work, novel object exploration) will provide excellent mental stimulation'}.`,
      `20 minutes of quality sniff-based enrichment provides ${dog} with the equivalent neurological fatigue of 60-90 minutes of physical exercise — with none of the arousal. For any elevated emotional state, lead with enrichment.`,
      `The most underused enrichment tool is also the simplest: scatter feeding breakfast across a garden or snuffle mat. 5 minutes of sniffing for food in the morning sets a calming neurological tone for the entire day.`,
    ],

    streak: [
      streak?.current > 0 ? `${dog}'s current training streak is ${streak.current} days. This level of consistency is the single greatest predictor of transformation speed — the data reflects the commitment you're bringing.` : `Building a training streak with ${dog} — even 5 minutes of quality engagement daily — will compound into remarkable transformation. Consistency is the key variable.`,
      `The research is clear: 15-21 consecutive days of consistent training produces measurable neurological changes in dogs. ${streak?.current > 0 ? `At ${streak.current} days, ${dog} is building exactly that foundation.` : `Every day you log creates that foundation for ${dog}.`}`,
    ],

    stage: [
      stage ? `${dog} is currently in the ${stage.name} phase of The Four Paws Method™. ${stage.desc} The work being done in this phase directly enables every subsequent stage.` : `The Four Paws Method™ is a 7-stage transformation framework: Onboarding → Stabilisation → Recovery → Confidence Building → Environmental Mastery → Elite Optimisation → Maintenance. Each stage is precisely designed.`,
      `The Four Paws Method™ is built around a single foundational truth: sustainable behavioural transformation is always emotional first. ${dog}'s programme is calibrated to this principle at every level.`,
    ],

    thanks: [
      `You're most welcome, ${name}. ${dog} is fortunate to have such a dedicated handler.`,
      `The progress ${dog} makes is a direct reflection of your consistency. Continue the work — it compounds.`,
      `Thank you, ${name}. ${dog}'s transformation is a genuine privilege to be part of.`,
    ],

    help: [
      `I'm ${dog}'s dedicated companion intelligence. Ask me about today's session, tomorrow's focus, ${dog}'s emotional state, recovery progress, confidence development, or wellness. I'm here to support you both.`,
      `I can help you understand ${dog}'s behaviour data, plan sessions, navigate challenges, and track transformation. What would be most useful right now?`,
    ],

    emergency: [
      `If ${dog} is in immediate distress, go to Emergency Mode now — it will walk you through a step-by-step calming protocol. The most important immediate action is to reduce environmental stimulation and give ${dog} space.`,
      `For acute arousal: remove the trigger from view, stop all commands, scatter some high-value treats at a distance, and sit calmly with ${dog} without pressure. Recovery begins with your calmness.`,
    ],

    general: [
      `That's an interesting observation about ${dog}. The most important data I need to give you a precise answer is recent behaviour logging — the more you log, the more intelligent my responses become.`,
      `${dog}'s programme is always generating intelligence. If you're not sure what to focus on today, the Daily Briefing has your personalised recommendation.`,
      `I'm still learning ${dog}'s individual profile. Every session you log helps me give you more precise, personalised guidance.`,
    ],
  }

  const pool = responses[intent] || responses.general
  const idx  = Math.floor(Math.random() * pool.length)
  return pool[idx]
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAT PERSISTENCE
// ─────────────────────────────────────────────────────────────────────────────
export function loadChatHistory() {
  try { return JSON.parse(localStorage.getItem(CHAT_KEY) || '[]') }
  catch { return [] }
}

export function saveChatMessage(message) {
  const history = loadChatHistory()
  history.push({ ...message, id: `msg-${Date.now()}`, timestamp: new Date().toISOString() })
  if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY)
  localStorage.setItem(CHAT_KEY, JSON.stringify(history))
}

export function clearChatHistory() {
  localStorage.removeItem(CHAT_KEY)
}

// ─────────────────────────────────────────────────────────────────────────────
// PROACTIVE PROMPTS — the AI initiates conversation
// ─────────────────────────────────────────────────────────────────────────────
export function getProactivePrompt(dogName, behaviourScores, timeContext, sessionCount) {
  const dog  = dogName || 'your companion'
  const ind  = behaviourScores?.individual || {}
  const hour = new Date().getHours()

  const prompts = []

  if (hour >= 6 && hour < 9)
    prompts.push(`Good morning. ${dog}'s morning enrichment window is open. Ready for today's briefing?`)

  if ((ind.anxiety || 0) > 65)
    prompts.push(`${dog}'s anxiety indicators are elevated today. Shall I walk you through the decompression protocol?`)

  if (sessionCount === 0)
    prompts.push(`Welcome to ${dog}'s academy. I'm here whenever you need guidance. What would you like to explore first?`)

  if (hour >= 19 && hour < 22)
    prompts.push(`Good evening. A calm close to the day benefits ${dog} enormously. How did today go?`)

  return prompts.length > 0 ? prompts[Math.floor(Math.random() * prompts.length)] : null
}
