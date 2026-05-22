import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Archive, Award, BookOpen, Star, Heart } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import { loadArchive } from '../../ai/wellness'
import { loadAIMemory, loadStreak } from '../../ai/aiMemory'
import { computeEarnedAchievements, ACHIEVEMENT_TIERS } from '../../ai/achievements'
import { computeIntelligenceScores, getArchetype, getClientTier } from '../../ai/archetypes'
import { getCurrentPhase } from '../../ai/wellness'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { generateCertificateData } from '../../ai/achievements'
import { COURSES } from '../../data/courses'
import { purifyText } from '../../ai/narrativeVoice'

const TIER_METAL_STYLES = {
  BRONZE:   { bg: 'radial-gradient(circle, #CD7F32 0%, #8B4513 100%)', shadow: '0 0 16px rgba(205,127,50,0.4)' },
  SILVER:   { bg: 'radial-gradient(circle, #E8E8E8 0%, #A0A0A0 100%)', shadow: '0 0 16px rgba(192,192,192,0.4)' },
  GOLD:     { bg: 'radial-gradient(circle, #F5E09A 0%, #C9A84C 50%, #9A7D22 100%)', shadow: '0 0 20px rgba(201,168,76,0.5)' },
  PLATINUM: { bg: 'radial-gradient(circle, #F0F4FF 0%, #B8C8FF 50%, #7090E0 100%)', shadow: '0 0 20px rgba(176,196,255,0.5)' },
  DIAMOND:  { bg: 'radial-gradient(circle, #E0F8FF 0%, #9FDBFF 40%, #4FC3F7 100%)', shadow: '0 0 24px rgba(79,195,247,0.6)' },
}

function CertificateCard({ cert }) {
  return (
    <div className="relative overflow-hidden p-7"
      style={{ background: 'linear-gradient(135deg, #1A1208 0%, #2A1E0A 50%, #1A1208 100%)', border: '1px solid rgba(201,168,76,0.4)' }}>
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] text-[80px]" style={{ color: '#C9A84C' }}>🐾</div>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.8), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.8), transparent)' }} />

      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="divider-gold w-12" />
          <span className="text-2xl">🐾</span>
          <div className="divider-gold w-12" />
        </div>
        <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-gold-600 mb-2">Four Paws Academy</div>
        <div className="font-sans text-[9px] uppercase tracking-[0.35em] text-silver-500 mb-4">Certificate of Completion</div>
        <div className="font-display text-3xl font-light text-pearl mb-1">{cert.clientName}</div>
        <div className="font-sans text-[10px] text-silver-500 mb-4">in partnership with {cert.dogName}</div>
        <div className="font-serif text-xl font-light text-gold-400 italic mb-5">{cert.courseTitle}</div>
        <div className="font-sans text-xs text-silver-600 mb-3">{cert.completedDate}</div>
        <div className="font-mono text-[8px] text-silver-700 tracking-widest">{cert.certId}</div>
      </div>
    </div>
  )
}

export default function LegacyArchive() {
  const { state }  = useApp()
  const { behaviourScores, dogProfile } = useAI()
  const dog        = dogProfile || state.dogProfile
  const client     = state.clientProfile || state.currentUser
  const memory     = loadAIMemory()
  const streak     = loadStreak()
  const archive    = loadArchive()

  const dogName    = dog?.name    || 'Your Companion'
  const clientName = client?.name || 'Academy Member'

  const completedLessons = Object.values(state.courseProgress)
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)

  const intScores  = useMemo(() => computeIntelligenceScores(behaviourScores, completedLessons, streak), [behaviourScores, completedLessons, streak])
  const archetype  = useMemo(() => getArchetype(behaviourScores, dog), [behaviourScores, dog])
  const tier       = useMemo(() => getClientTier(completedLessons), [completedLessons])
  const phase      = useMemo(() => getCurrentPhase(completedLessons), [completedLessons])

  const achievements = useMemo(() => computeEarnedAchievements({
    completedLessons,
    streak:           streak.current || 0,
    completedCourses: 0,
    confidenceScore:  intScores?.confidence || 0,
    anxietyScore:     behaviourScores?.individual?.anxiety || 0,
    stabilityScore:   intScores?.stability || 0,
    socialScore:      intScores?.social || 0,
  }), [completedLessons, streak, intScores, behaviourScores])

  // Generate certificates for any "completed" courses (100% progress)
  const completedCourses = useMemo(() => COURSES.filter(c => {
    const p = state.courseProgress[c.id]
    return p && (p.percentComplete >= 100 || p.completedModules?.length >= (c.modules?.length || 999))
  }), [state.courseProgress])

  const certificates = useMemo(() =>
    completedCourses.map(c => generateCertificateData(c, clientName, dogName)),
    [completedCourses, clientName, dogName]
  )

  const milestones = memory.progressMilestones || []
  const history    = memory.behaviourHistory    || []

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">

      {/* Header */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Permanent Record</div>
        <h1 className="luxury-heading text-4xl">{dogName}'s<br /><span className="text-gold-gradient italic">Legacy Archive</span></h1>
      </FadeIn>

      {/* Identity snapshot */}
      <FadeIn className="mb-8">
        <div className="glass-card p-6" style={{ border: '1px solid rgba(201,168,76,0.15)', background: 'rgba(201,168,76,0.02)' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: archetype?.icon || '🐾', label: 'Archetype',   value: archetype?.name || '—' },
              { icon: tier.icon,               label: 'Membership',  value: tier.name },
              { icon: phase.icon,              label: 'Phase',       value: phase.name },
              { icon: '📚',                    label: 'Total Lessons', value: completedLessons },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-serif text-sm font-medium text-pearl">{s.value}</div>
                <div className="font-sans text-[9px] text-silver-600 uppercase tracking-widest mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Certificates */}
      {certificates.length > 0 && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Certificates</div>
          <h2 className="luxury-heading text-2xl mb-5">Programme Graduations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certificates.map(cert => <CertificateCard key={cert.certId} cert={cert} />)}
          </div>
        </FadeIn>
      )}

      {/* Achievement archive */}
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
                  <div className="glass-card p-5 flex items-start gap-4" style={{ border: `1px solid ${tier.colour}20` }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
                      style={{ background: metal.bg, boxShadow: metal.shadow }}>
                      {a.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-sans text-[9px] uppercase tracking-widest mb-0.5" style={{ color: tier.colour }}>{tier.label}</div>
                      <div className="font-serif text-sm font-medium text-pearl">{a.name}</div>
                      <div className="font-sans text-[10px] text-silver-500 mt-0.5">{a.distinction}</div>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </FadeIn>
      )}

      {/* Milestone history */}
      {milestones.length > 0 && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Training Record</div>
          <h2 className="luxury-heading text-2xl mb-5">Milestone History</h2>
          <div className="space-y-3">
            {milestones.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 p-4 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                  <Star size={12} className="text-charcoal-900" />
                </div>
                <div className="flex-1">
                  <div className="font-serif text-sm text-pearl">{m.milestone}</div>
                  <div className="font-sans text-[9px] text-silver-600 mt-0.5">
                    {new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {m.dogName && ` · ${m.dogName}`}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Behaviour evolution */}
      {history.length > 0 && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Transformation Evidence</div>
          <h2 className="luxury-heading text-2xl mb-5">Behaviour Evolution</h2>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            {history.length >= 2 ? (
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-sans text-[9px] text-silver-600 mb-1">Initial Score</div>
                  <div className="stat-number text-3xl text-red-400">{history[0].overall}</div>
                  <div className="font-sans text-[8px] text-silver-700 mt-0.5">Concern Level</div>
                </div>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #EF4444, #C9A84C, #10B981)' }} />
                <div className="text-center">
                  <div className="font-sans text-[9px] text-silver-600 mb-1">Current Score</div>
                  <div className="stat-number text-3xl text-emerald-400">{history[history.length - 1].overall}</div>
                  <div className="font-sans text-[8px] text-silver-700 mt-0.5">Concern Level</div>
                </div>
              </div>
            ) : (
              <p className="font-sans text-xs text-silver-500 text-center">Behaviour evolution data will build as you progress through your programme.</p>
            )}
          </div>
        </FadeIn>
      )}

      {/* Archive items */}
      {archive.length > 0 && (
        <FadeIn>
          <div className="section-label mb-1">Personal Archive</div>
          <h2 className="luxury-heading text-2xl mb-5">Saved Memories</h2>
          <StaggerContainer className="space-y-3">
            {archive.map(entry => (
              <StaggerItem key={entry.id}>
                <div className="glass-card p-4 flex items-start gap-3" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Heart size={14} className="text-gold-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-serif text-sm text-pearl">{entry.title || 'Archive Entry'}</div>
                    {entry.note && <p className="font-sans text-xs text-silver-500 mt-0.5">{entry.note}</p>}
                    <div className="font-sans text-[9px] text-silver-700 mt-1">
                      {new Date(entry.archivedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </FadeIn>
      )}
    </div>
  )
}
