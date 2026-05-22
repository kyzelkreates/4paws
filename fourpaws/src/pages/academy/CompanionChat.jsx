// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — AI COMPANION CONVERSATION INTERFACE
// Offline-capable, behaviour-aware, concierge-tone conversational UI.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Brain, Sparkles, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useIntelligenceCore } from '../../hooks/useIntelligenceCore'
import {
  generateCompanionResponse, loadChatHistory, saveChatMessage,
  getProactivePrompt, clearChatHistory,
} from '../../ai/companionChat'
import { detectTransformationStage, FOUR_PAWS_METHOD } from '../../ai/fourPawsMethod'
import { loadAIMemory } from '../../ai/aiMemory'
import { SOUNDS } from '../../ai/intelligenceCore'
import { purifyText } from '../../ai/narrativeVoice'
import { FadeIn } from '../../components/animations/FadeIn'
import { AmbientOrbs } from '../../components/ui/PageTransition'
import { speak, VOICE_COACH_AVAILABLE } from '../../ai/voiceCoach'

const SUGGESTED_PROMPTS = [
  'How did my dog do today?',
  'What should we focus on tomorrow?',
  'How is the emotional recovery progressing?',
  'What enrichment would help right now?',
  'How is our training streak?',
  'Explain The Four Paws Method™',
]

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────────────────────────────────────
function MessageBubble({ message, dogName }) {
  const isUser = message.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
          <span className="text-sm">🐾</span>
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'ml-auto' : ''}`}>
        {!isUser && (
          <div className="font-sans text-[7px] uppercase tracking-[0.3em] text-gold-700 mb-1">
            {dogName ? `${dogName}'s Academy` : 'Your Academy'}
          </div>
        )}
        <div className={`px-4 py-3 font-sans text-sm font-light leading-relaxed ${
          isUser
            ? 'text-pearl'
            : 'text-silver-300'
          }`}
          style={{
            background: isUser
              ? 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.08) 100%)'
              : 'rgba(255,255,255,0.03)',
            border: isUser
              ? '1px solid rgba(201,168,76,0.25)'
              : '1px solid rgba(255,255,255,0.06)',
          }}>
          {message.content}
        </div>
        <div className="font-sans text-[8px] text-silver-800 mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPING INDICATOR
// ─────────────────────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
        <span className="text-sm">🐾</span>
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-gold-600"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CHAT PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function CompanionChat() {
  const { state }      = useApp()
  const intelligence   = useIntelligenceCore()
  const { core, behaviourScores, emotionalState, streak, intScores } = intelligence

  const memory         = useMemo(() => loadAIMemory(), [])
  const dogName        = core?.dogName   || 'your companion'
  const firstName      = core?.firstName || ''

  const stage = useMemo(() =>
    detectTransformationStage(
      behaviourScores,
      Object.values(state.courseProgress || {}).reduce((a, p) => a + (p.completedLessons?.length || 0), 0),
      streak?.current
    ), [behaviourScores]
  )

  const context = useMemo(() => ({
    dogName, firstName, behaviourScores, emotionalState, streak, stage,
    sessionCount: memory.sessionCount || 0,
  }), [dogName, firstName, behaviourScores, emotionalState, streak])

  const [messages,  setMessages]  = useState(() => {
    const history = loadChatHistory()
    if (history.length > 0) return history
    // Initial greeting
    const proactive = getProactivePrompt(dogName, behaviourScores, null, memory.sessionCount)
    const welcome   = proactive || `Welcome back. I'm here to support ${dogName}'s programme. What would you like to explore?`
    return [{ id: 'welcome', role: 'assistant', content: welcome, timestamp: new Date().toISOString() }]
  })
  const [input,     setInput]     = useState('')
  const [isTyping,  setIsTyping]  = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text) => {
    const content = (text || input).trim()
    if (!content) return
    SOUNDS.tap()

    const userMsg = { id: `u-${Date.now()}`, role: 'user', content, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    saveChatMessage(userMsg)
    setInput('')
    setIsTyping(true)

    // Simulate thinking delay
    setTimeout(() => {
      const response = purifyText(generateCompanionResponse(content, context))
      const aiMsg = { id: `a-${Date.now()}`, role: 'assistant', content: response, timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, aiMsg])
      saveChatMessage(aiMsg)
      setIsTyping(false)
      SOUNDS.notification()
    }, 800 + Math.random() * 600)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className="flex flex-col h-full min-h-screen relative">
      <AmbientOrbs count={1} colour="rgba(201,168,76,0.02)" />

      {/* Header */}
      <FadeIn>
        <div className="px-5 py-5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <Brain size={15} className="text-gold-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-base font-medium text-pearl">Companion Intelligence</h1>
              <div className="flex items-center gap-1.5">
                <motion.div className="w-1 h-1 rounded-full bg-emerald-500"
                  animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="font-sans text-[9px] text-silver-600">always available for {dogName}</span>
              </div>
            </div>
            <button onClick={() => { setMessages([]); clearChatHistory() }}
              className="w-7 h-7 flex items-center justify-center text-silver-700 hover:text-silver-400 transition-colors">
              <X size={13} />
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 academy-scroll">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} dogName={dogName} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 2 && (
        <FadeIn delay={0.2} className="px-5 pb-4 flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.slice(0, 3).map(p => (
              <button key={p} onClick={() => sendMessage(p)}
                className="font-sans text-[9px] px-3 py-1.5 text-silver-500 hover:text-silver-300 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                {p}
              </button>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Input */}
      <div className="px-5 py-4 border-t border-white/5 flex-shrink-0">
        <div className="flex items-end gap-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${dogName}…`}
            rows={1}
            className="flex-1 bg-transparent px-4 py-3 font-sans text-sm text-pearl placeholder-silver-700 resize-none focus:outline-none"
            style={{ minHeight: 44, maxHeight: 120 }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 flex items-center justify-center flex-shrink-0 mr-1 transition-all duration-200 disabled:opacity-30"
            style={{ background: input.trim() ? 'rgba(201,168,76,0.15)' : 'transparent', color: '#C9A84C' }}>
            <Send size={14} />
          </button>
        </div>
        <p className="font-sans text-[8px] text-silver-800 mt-2 text-center">
          The Four Paws Method™ · Fully offline
        </p>
      </div>
    </div>
  )
}
