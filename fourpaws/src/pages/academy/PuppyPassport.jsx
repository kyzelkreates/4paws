import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Shield, Star, Flame, Trophy, BookOpen, Zap, Award } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import { getArchetype, getClientTier, computeIntelligenceScores } from '../../ai/archetypes'
import { computeEarnedAchievements } from '../../ai/achievements'
import { loadStreak } from '../../ai/aiMemory'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { ACHIEVEMENT_TIERS } from '../../ai/achievements'

const TIER_METAL_STYLES = {
  BRONZE:   { bg: 'radial-gradient(circle, #CD7F32 0%, #8B4513 100%)', shadow: '0 0 20px rgba(205,127,50,0.5)', text: '#FDE68A' },
  SILVER:   { bg: 'radial-gradient(circle, #E8E8E8 0%, #A0A0A0 100%)', shadow: '0 0 20px rgba(192,192,192,0.5)', text: '#1A1A1A' },
  GOLD:     { bg: 'radial-gradient(circle, #F5E09A 0%, #C9A84C 50%, #9A7D22 100%)', shadow: '0 0 24px rgba(201,168,76,0.6)', text: '#1A1A1A' },
  PLATINUM: { bg: 'radial-gradient(circle, #F0F4FF 0%, #B8C8FF 50%, #7090E0 100%)', shadow: '0 0 24px rgba(176,196,255,0.6)', text: '#1A1A1A' },
  DIAMOND:  { bg: 'radial-gradient(circle, #E0F8FF 0%, #9FDBFF 40%, #4FC3F7 100%)', shadow: '0 0 28px rgba(79,195,247,0.7)', text: '#0A1A2A' },
}

function MedallionBadge({ achievement, size = 'md' }) {
  const tier   = ACHIEVEMENT_TIERS[achievement.tier] || ACHIEVEMENT_TIERS.BRONZE
  const metal  = TIER_METAL_STYLES[achievement.tier] || TIER_METAL_STYLES.BRONZE
  const sz     = size === 'sm' ? 'w-10 h-10 text-lg' : size === 'lg' ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-xl'

  return (
    <motion.div whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }} transition={{ duration: 0.3 }}
      className={`${sz} rounded-full flex items-center justify-center relative flex-shrink-0`}
      style={{ background: metal.bg, boxShadow: metal.shadow }}>
      <span>{achievement.icon}</span>
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3) 0%, transparent 60%)' }} />
    </motion.div>
  )
}

function ScoreRing({ label, value, colour, icon }) {
  const radius = 30
  const circ   = 2 * Math.PI * radius
  const offset = circ - (value / 100) * circ

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 76 76">
          <circle cx="38" cy="38" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <motion.circle cx="38" cy="38" r={radius} fill="none" stroke={colour} strokeWidth="5"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
            style={{ strokeDasharray: circ }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base leading-none">{icon}</span>
          <span className="font-mono text-[10px] font-semibold" style={{ color: colour }}>{value}</span>
        </div>
      </div>
      <span className="font-sans text-[9px] text-silver-600 uppercase tracking-widest text-center leading-tight">{label}</span>
    </div>
  )
}

export default function PuppyPassport() {
  const { state }  = useApp()
  const { behaviourScores, dogProfile } = useAI()
  const dog        = dogProfile || state.dogProfile
  const client     = state.clientProfile || state.currentUser
  const streak     = loadStreak()

  const completedLessons = Object.values(state.courseProgress)
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)

  const archetype  = useMemo(() => getArchetype(behaviourScores, dog), [behaviourScores, dog])
  const tier       = useMemo(() => getClientTier(completedLessons), [completedLessons])
  const intScores  = useMemo(() => computeIntelligenceScores(behaviourScores, completedLessons, streak), [behaviourScores, completedLessons, streak])

  const achievements = useMemo(() => computeEarnedAchievements({
    completedLessons,
    streak:           streak.current || 0,
    completedCourses: 0,
    confidenceScore:  intScores?.confidence || 0,
    anxietyScore:     behaviourScores?.individual?.anxiety || 0,
    stabilityScore:   intScores?.stability || 0,
    socialScore:      intScores?.social || 0,
  }), [completedLessons, streak, intScores, behaviourScores])

  const dogName    = dog?.name    || 'Your Companion'
  const clientName = client?.name || 'Academy Member'

  if (!dog) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🐾</div>
          <h2 className="luxury-heading text-2xl mb-2">Passport Not Yet Created</h2>
          <p className="text-silver-500 font-sans text-sm">Complete onboarding to generate {dogName}'s Puppy Passport.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Identity Document</div>
        <h1 className="luxury-heading text-4xl">{dogName}'s<br /><span className="text-gold-gradient italic">Academy Passport</span></h1>
      </FadeIn>

      {/* ── Passport card ── */}
      <FadeIn className="mb-8">
        <div className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1A1208 0%, #2A1E0A 40%, #1A1208 100%)', border: '1px solid rgba(201,168,76,0.4)', boxShadow: '0 0 60px rgba(201,168,76,0.1), inset 0 0 60px rgba(201,168,76,0.03)' }}>

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]"
            style={{ fontSize: '180px', fontFamily: 'serif', letterSpacing: '0.1em', color: '#C9A84C', userSelect: 'none' }}>
            🐾
          </div>

          {/* Gold border lines */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.8), transparent)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.8), transparent)' }} />

          <div className="relative z-10 p-8 lg:p-10">
            <div className="flex items-start gap-6 flex-wrap">

              {/* Portrait area */}
              <div className="flex-shrink-0">
                <div className="w-28 h-28 lg:w-32 lg:h-32 relative"
                  style={{ border: '2px solid rgba(201,168,76,0.5)', background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 100%)' }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl">{archetype?.icon || '🐾'}</span>
                    <span className="font-sans text-[8px] text-gold-600 mt-2 tracking-widest uppercase">{archetype?.name}</span>
                  </div>
                  <div className="absolute top-1 right-1 w-5 h-5 bg-gold-gradient rounded-full flex items-center justify-center">
                    <span className="text-[8px]">✓</span>
                  </div>
                </div>
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="font-display text-3xl lg:text-4xl font-light text-pearl">{dogName}</div>
                  <div className="flex items-center gap-1.5 px-3 py-1 border"
                    style={{ borderColor: tier.colour + '40', background: tier.colour + '12' }}>
                    <span className="text-sm">{tier.icon}</span>
                    <span className="font-sans text-[9px] uppercase tracking-widest" style={{ color: tier.colour }}>{tier.name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {[
                    ['Breed',      dog.breed      || '—'],
                    ['Age',        dog.age ? `${Math.round(dog.age / 12 * 10) / 10}y` : '—'],
                    ['Owner',      clientName.split(' ')[0]],
                    ['Archetype',  archetype?.name || '—'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="font-sans text-[9px] text-gold-600 uppercase tracking-[0.25em] mb-0.5">{label}</div>
                      <div className="font-sans text-sm font-medium text-pearl">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={11} className="text-gold-500" />
                    <span className="font-sans text-xs text-silver-500">{completedLessons} lessons</span>
                  </div>
                  {streak.current > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Flame size={11} className="text-orange-400" />
                      <span className="font-sans text-xs text-orange-400">{streak.current}-day streak</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Trophy size={11} className="text-gold-500" />
                    <span className="font-sans text-xs text-silver-500">{achievements.length} achievements</span>
                  </div>
                </div>
              </div>

              {/* Academy seal */}
              <div className="flex-shrink-0 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 100%)', border: '2px solid rgba(201,168,76,0.4)' }}>
                  <span className="text-2xl">🐾</span>
                </div>
                <div className="font-sans text-[7px] text-gold-600 tracking-[0.3em] uppercase mt-2">Certified</div>
              </div>
            </div>

            {/* Archetype description */}
            {archetype && (
              <div className="mt-6 pt-5 border-t" style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
                <div className="font-sans text-[9px] text-gold-600 uppercase tracking-[0.25em] mb-1">{archetype.tagline}</div>
                <p className="font-serif text-sm font-light text-silver-300 leading-relaxed italic max-w-2xl">{archetype.description}</p>
              </div>
            )}
          </div>
        </div>
      </FadeIn>

      {/* ── Intelligence scores ── */}
      {intScores && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Intelligence Profile</div>
          <h2 className="luxury-heading text-2xl mb-5">Behavioural Scores</h2>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="flex flex-wrap justify-around gap-6">
              <ScoreRing label="Confidence"  value={intScores.confidence}  colour="#C9A84C" icon="🦁" />
              <ScoreRing label="Stability"   value={intScores.stability}   colour="#10B981" icon="🌿" />
              <ScoreRing label="Focus"       value={intScores.focus}       colour="#8B5CF6" icon="🎯" />
              <ScoreRing label="Recovery"    value={intScores.recovery}    colour="#06B6D4" icon="💧" />
              <ScoreRing label="Enrichment"  value={intScores.enrichment}  colour="#F59E0B" icon="✨" />
              <ScoreRing label="Social"      value={intScores.social}      colour="#EC4899" icon="🦋" />
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── Achievements ── */}
      {achievements.length > 0 && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Distinctions</div>
          <h2 className="luxury-heading text-2xl mb-5">Achievement Collection</h2>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map(a => {
              const metal = TIER_METAL_STYLES[a.tier] || TIER_METAL_STYLES.BRONZE
              const tier  = ACHIEVEMENT_TIERS[a.tier] || ACHIEVEMENT_TIERS.BRONZE
              return (
                <StaggerItem key={a.id}>
                  <motion.div whileHover={{ y: -2 }} className="glass-card p-5 flex items-start gap-4"
                    style={{ border: `1px solid ${tier.colour}25` }}>
                    <MedallionBadge achievement={a} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-[8px] uppercase tracking-[0.3em] mb-0.5" style={{ color: tier.colour }}>{tier.label} · {a.category}</div>
                      <div className="font-serif text-base font-medium text-pearl mb-0.5">{a.name}</div>
                      <div className="font-sans text-[10px] text-silver-500 font-light leading-snug">{a.distinction}</div>
                    </div>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </FadeIn>
      )}

      {/* ── Archetype traits ── */}
      {archetype && (
        <FadeIn className="mb-8">
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="section-label mb-1">Training Focus</div>
            <h3 className="luxury-heading text-xl mb-4">{dogName}'s Development Priorities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="font-sans text-[9px] uppercase tracking-widest text-silver-600 mb-3">Core Traits</div>
                <div className="flex flex-wrap gap-2">
                  {archetype.traits.map(t => (
                    <span key={t} className="font-sans text-xs px-3 py-1.5 border border-white/8 text-silver-400">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-sans text-[9px] uppercase tracking-widest text-silver-600 mb-3">Training Priorities</div>
                <div className="space-y-2">
                  {archetype.trainingFocus.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0" />
                      <span className="font-sans text-xs text-silver-400">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
