// ─────────────────────────────────────────────────────────────
// FOUR PAWS — PRIVATE ACADEMY CEREMONY MODE  (V3)
// Luxury milestone celebration: certificate reveals, cinematic
// achievement unlocks, transformation ceremonies.
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Star, Crown, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import { computeEarnedAchievements, ACHIEVEMENT_TIERS } from '../../ai/achievements'
import { computeIntelligenceScores, getClientTier } from '../../ai/archetypes'
import { loadStreak, loadAIMemory } from '../../ai/aiMemory'
import { ACADEMY_EVENTS } from '../../ai/trainingStrategist'
import { getCurrentPhase } from '../../ai/wellness'
import { speak, VOICE_COACH_AVAILABLE } from '../../ai/voiceCoach'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

// ── Cinematic particles ───────────────────────────────────────
function Particles({ count = 30, colour = '#C9A84C', active }) {
  if (!active) return null
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ background: colour, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          initial={{ opacity: 1, scale: 1, y: 0 }}
          animate={{ opacity: 0, scale: 0.5, y: -(100 + Math.random() * 200) }}
          transition={{ duration: 1.5 + Math.random(), delay: Math.random() * 0.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// ── Achievement ceremony card ─────────────────────────────────
function AchievementCeremony({ achievement, onClose }) {
  const [phase, setPhase]       = useState('reveal')
  const tier    = ACHIEVEMENT_TIERS[achievement.tier] || ACHIEVEMENT_TIERS.GOLD
  const metalBg = {
    BRONZE:   'radial-gradient(circle, #CD7F32 0%, #8B4513 100%)',
    SILVER:   'radial-gradient(circle, #E8E8E8 0%, #A0A0A0 100%)',
    GOLD:     'radial-gradient(circle, #F5E09A 0%, #C9A84C 50%, #9A7D22 100%)',
    PLATINUM: 'radial-gradient(circle, #F0F4FF 0%, #B8C8FF 50%, #7090E0 100%)',
    DIAMOND:  'radial-gradient(circle, #E0F8FF 0%, #9FDBFF 40%, #4FC3F7 100%)',
  }

  useEffect(() => {
    if (VOICE_COACH_AVAILABLE) {
      setTimeout(() => speak(`${achievement.name} achieved. ${achievement.unlockCopy}`), 600)
    }
    const t = setTimeout(() => setPhase('details'), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-sm p-6">
      <Particles active count={40} colour={tier.colour} />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="relative max-w-sm w-full text-center"
        style={{ background: 'linear-gradient(135deg, #0F0D07 0%, #1A1600 100%)', border: `1px solid ${tier.colour}40`, padding: '48px 40px' }}>

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 30%, ${tier.colour}15 0%, transparent 60%)` }} />

        <div className="relative z-10">
          {/* Medallion */}
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl"
            style={{ background: metalBg[achievement.tier] || metalBg.GOLD, boxShadow: `0 0 40px ${tier.colour}50` }}>
            {achievement.icon}
          </motion.div>

          {/* Rank label */}
          <div className="font-sans text-[9px] uppercase tracking-[0.4em] mb-2" style={{ color: tier.colour }}>
            {tier.label} Achievement
          </div>

          {/* Name */}
          <h2 className="luxury-heading text-3xl mb-3" style={{ color: tier.colour }}>{achievement.name}</h2>

          {/* Distinction */}
          <div className="font-sans text-xs text-silver-500 uppercase tracking-widest mb-6">{achievement.distinction}</div>

          <AnimatePresence>
            {phase === 'details' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <p className="font-serif text-sm font-light text-silver-300 italic leading-relaxed mb-6">
                  "{achievement.unlockCopy}"
                </p>
                <button onClick={onClose}
                  className="btn-gold w-full py-3 font-sans text-xs tracking-widest uppercase">
                  Continue
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Phase ceremony ─────────────────────────────────────────────
function PhaseCeremony({ phase, onClose }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 1500)
    if (VOICE_COACH_AVAILABLE) speak(`Phase ${phase.phase}: ${phase.name}. ${phase.description}`)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-sm p-6">
      <Particles active count={50} colour={phase.colour} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className="relative max-w-lg w-full text-center"
        style={{ background: 'linear-gradient(135deg, #0A0A08 0%, #141410 100%)', border: `1px solid ${phase.colour}35`, padding: '56px 48px' }}>

        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 30%, ${phase.colour}12 0%, transparent 60%)` }} />

        <div className="relative z-10">
          <motion.div className="text-6xl mb-6 block"
            animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: 2 }}>
            {phase.icon}
          </motion.div>

          <div className="font-sans text-[9px] uppercase tracking-[0.4em] mb-2" style={{ color: phase.colour }}>
            Transformation Journey · Phase {phase.phase}
          </div>

          <h2 className="luxury-heading text-4xl mb-2" style={{ color: phase.colour }}>{phase.name}</h2>
          <div className="font-sans text-sm text-silver-500 mb-6 italic">{phase.subtitle}</div>

          <AnimatePresence>
            {revealed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="font-serif text-sm font-light text-silver-300 leading-relaxed mb-8">
                  {phase.description}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {phase.milestones.map(m => (
                    <span key={m} className="font-sans text-[9px] px-3 py-1 border border-white/10 text-silver-500">{m}</span>
                  ))}
                </div>
                <button onClick={onClose}
                  className="btn-gold px-10 py-3 font-sans text-xs tracking-widest uppercase">
                  Begin Phase {phase.phase}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function AcademyCeremony() {
  const { state }  = useApp()
  const { behaviourScores, dogProfile } = useAI()
  const dog        = dogProfile || state.dogProfile
  const client     = state.clientProfile || state.currentUser
  const dogName    = dog?.name || 'Your Companion'
  const streak     = loadStreak()

  const completedLessons = Object.values(state.courseProgress)
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)

  const intScores = computeIntelligenceScores(behaviourScores, completedLessons, streak)
  const tier      = getClientTier(completedLessons)
  const phase     = getCurrentPhase(completedLessons)

  const achievements = computeEarnedAchievements({
    completedLessons, streak: streak.current || 0, completedCourses: 0,
    confidenceScore: intScores?.confidence || 0, anxietyScore: behaviourScores?.individual?.anxiety || 0,
    stabilityScore: intScores?.stability || 0, socialScore: intScores?.social || 0,
  })

  const [ceremony,  setCeremony]  = useState(null)
  const [eventOpen, setEventOpen] = useState(null)

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">

      {/* Ceremony overlays */}
      <AnimatePresence>
        {ceremony?.type === 'achievement' && (
          <AchievementCeremony achievement={ceremony.data} onClose={() => setCeremony(null)} />
        )}
        {ceremony?.type === 'phase' && (
          <PhaseCeremony phase={ceremony.data} onClose={() => setCeremony(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Recognition & Ceremony</div>
        <h1 className="luxury-heading text-4xl">{dogName}'s<br /><span className="text-gold-gradient italic">Academy Ceremonies</span></h1>
      </FadeIn>

      {/* Current status ceremony trigger */}
      <FadeIn className="mb-8">
        <div className="relative overflow-hidden glass-card p-7"
          style={{ border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.02)' }}>
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-5 text-[160px]" style={{ color: '#C9A84C', lineHeight: 1 }}>🐾</div>
          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="section-label mb-2">Current Standing</div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{tier.icon}</span>
                <div>
                  <div className="font-serif text-2xl text-pearl">{tier.name}</div>
                  <div className="font-sans text-xs text-silver-500">{completedLessons} lessons · {achievements.length} achievements</div>
                </div>
              </div>
            </div>
            <motion.button
              onClick={() => setCeremony({ type: 'phase', data: phase })}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="btn-gold flex items-center gap-2 px-6 py-3 font-sans text-xs">
              <Star size={13} /> Celebrate Current Phase
            </motion.button>
          </div>
        </div>
      </FadeIn>

      {/* Achievements gallery */}
      {achievements.length > 0 && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Distinctions</div>
          <h2 className="luxury-heading text-2xl mb-5">Replay Achievement Ceremonies</h2>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(a => {
              const tierMeta = ACHIEVEMENT_TIERS[a.tier] || ACHIEVEMENT_TIERS.GOLD
              return (
                <StaggerItem key={a.id}>
                  <motion.button
                    onClick={() => setCeremony({ type: 'achievement', data: a })}
                    whileHover={{ y: -3 }}
                    className="glass-card p-5 text-left w-full transition-all group"
                    style={{ border: `1px solid ${tierMeta.colour}20` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: `radial-gradient(circle, ${tierMeta.colour}30 0%, transparent 80%)`, border: `1px solid ${tierMeta.colour}30` }}>
                        {a.icon}
                      </div>
                      <div>
                        <div className="font-sans text-[8px] uppercase tracking-widest" style={{ color: tierMeta.colour }}>{tierMeta.label}</div>
                        <div className="font-serif text-sm font-medium text-pearl">{a.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] text-silver-600">{a.distinction}</span>
                      <span className="font-sans text-[9px] text-gold-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Replay <ChevronRight size={9} />
                      </span>
                    </div>
                  </motion.button>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </FadeIn>
      )}

      {/* Private Events */}
      <FadeIn>
        <div className="section-label mb-1">Private Events</div>
        <h2 className="luxury-heading text-2xl mb-5">Academy Calendar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACADEMY_EVENTS.map(event => (
            <motion.div key={event.id} whileHover={{ y: -3 }}
              className="glass-card p-5 cursor-pointer"
              style={{ border: `1px solid ${event.colour}20` }}
              onClick={() => setEventOpen(event)}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl flex-shrink-0">{event.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="font-sans text-[8px] uppercase tracking-widest" style={{ color: event.colour }}>{event.type}</div>
                    {event.invitation && (
                      <span className="font-sans text-[7px] px-1.5 py-0.5 border border-gold-500/30 text-gold-600">By Invitation</span>
                    )}
                  </div>
                  <div className="font-serif text-base font-medium text-pearl">{event.title}</div>
                  <div className="font-sans text-[10px] text-silver-500 mt-0.5">{event.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-[9px] text-silver-600">{event.duration} · {event.tier}</span>
                <span className="font-sans text-[9px] text-silver-700">{event.availability}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </FadeIn>

      {/* Event detail modal */}
      <AnimatePresence>
        {eventOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
            onClick={() => setEventOpen(null)}>
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full glass-card p-7"
              style={{ border: `1px solid ${eventOpen.colour}30` }}
              onClick={e => e.stopPropagation()}>
              <div className="text-4xl mb-4">{eventOpen.icon}</div>
              <div className="font-sans text-[9px] uppercase tracking-widest mb-1" style={{ color: eventOpen.colour }}>{eventOpen.type}</div>
              <h3 className="luxury-heading text-2xl mb-1">{eventOpen.title}</h3>
              <div className="font-sans text-xs text-silver-500 mb-4">{eventOpen.subtitle}</div>
              <p className="font-sans text-sm text-silver-400 font-light leading-relaxed mb-6">{eventOpen.description}</p>
              <div className="flex items-center justify-between mb-5">
                <span className="font-sans text-xs text-silver-600">{eventOpen.duration}</span>
                <span className="font-sans text-xs text-silver-600">{eventOpen.availability}</span>
              </div>
              <button onClick={() => setEventOpen(null)}
                className="w-full btn-gold py-3 font-sans text-xs tracking-widest uppercase">
                Register Interest
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
