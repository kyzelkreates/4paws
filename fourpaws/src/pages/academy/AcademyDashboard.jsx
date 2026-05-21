import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, CheckCircle, Lock, Play, ArrowRight,
  Flame, Zap, AlertTriangle, BarChart2, MapPin,
  Clock, Award, Sparkles, ChevronRight, Volume2, Bell
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import { COURSES, ADDONS, getTotalLessons, getProgressPercent } from '../../data/courses'
import { FadeIn, StaggerContainer, StaggerItem, GoldLineReveal } from '../../components/animations/FadeIn'
import { CONCERN_LEVELS } from '../../ai/behaviourEngine'
import { loadStreak } from '../../ai/aiMemory'
import {
  getDynamicGreeting,
  getConciergeCoachingSummary,
  getDailyTransformationInsight,
  generatePredictiveAlerts,
  ALERT_TYPES,
} from '../../ai/concierge'
import { getArchetype, getClientTier, computeIntelligenceScores } from '../../ai/archetypes'
import { computeEarnedAchievements } from '../../ai/achievements'
import { speak, isVoiceEnabled, VOICE_COACH_AVAILABLE } from '../../ai/voiceCoach'
import { loadAIMemory } from '../../ai/aiMemory'

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

function QuickStatCard({ icon, value, label, colour = '#C9A84C', delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <div className="glass-card p-5 text-center" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-2xl mb-2">{icon}</div>
        <div className="stat-number text-2xl" style={{ color: colour }}>{value}</div>
        <div className="font-sans text-[9px] text-silver-700 uppercase tracking-widest mt-1">{label}</div>
      </div>
    </FadeIn>
  )
}

function AlertBanner({ alert }) {
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 p-4 border ${alert.bgColour} ${alert.border}`}>
      <span className="text-lg flex-shrink-0">{alert.icon}</span>
      <div className="flex-1 min-w-0">
        <div className={`font-sans text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${alert.colour}`}>{alert.title}</div>
        <p className="font-sans text-xs text-silver-400 font-light leading-relaxed">{alert.summary}</p>
      </div>
    </motion.div>
  )
}

function CourseCard({ course, progress, isEnrolled, onNavigate }) {
  const completedLessons = progress?.completedLessons || []
  const totalLessons     = getTotalLessons(course)
  const percent          = Math.round((completedLessons.length / totalLessons) * 100)
  const nextModule       = course.modules.find(m => !m.lessons.every(l => completedLessons.includes(l.id)))
  const nextLesson       = nextModule?.lessons.find(l => !completedLessons.includes(l.id))

  return (
    <StaggerItem>
      <motion.div
        whileHover={{ y: -3 }}
        className="glass-card overflow-hidden cursor-pointer"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        onClick={() => isEnrolled && onNavigate(course.id, nextLesson?.id)}
      >
        {/* Gradient top bar */}
        <div className={`h-0.5 bg-gradient-to-r ${course.color}`} />

        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-3xl flex-shrink-0">{course.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-serif text-base font-medium text-pearl mb-0.5 leading-snug">{course.title}</div>
              <div className="font-sans text-[10px] text-silver-600 font-light">{course.subtitle}</div>
            </div>
            {!isEnrolled && <Lock size={13} className="text-silver-700 flex-shrink-0 mt-1" />}
          </div>

          {isEnrolled && (
            <>
              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-sans text-[9px] text-silver-600 uppercase tracking-widest">Progress</span>
                  <span className="font-mono text-[10px] text-gold-400">{percent}%</span>
                </div>
                <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gold-gradient"
                    initial={{ width: 0 }} animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-sans text-[9px] text-silver-600">
                  {completedLessons.length}/{totalLessons} lessons
                </span>
                {percent === 100 ? (
                  <span className="flex items-center gap-1 font-sans text-[9px] text-emerald-400">
                    <CheckCircle size={10} /> Complete
                  </span>
                ) : (
                  <button className="flex items-center gap-1.5 font-sans text-[10px] text-gold-400 hover:text-gold-300 transition-colors">
                    <Play size={10} fill="currentColor" /> Continue
                  </button>
                )}
              </div>
            </>
          )}

          {!isEnrolled && (
            <div className="flex items-center justify-between">
              <span className="font-sans text-[9px] text-silver-600">{course.duration}</span>
              <span className="font-sans text-[9px] text-gold-600 font-medium">{course.price}</span>
            </div>
          )}
        </div>
      </motion.div>
    </StaggerItem>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────
export default function AcademyDashboard() {
  const { state }   = useApp()
  const navigate    = useNavigate()
  const { onboardingComplete, behaviourScores, aiRecommendations, dogProfile, trainingInsights } = useAI()

  const { enrolledCourses, ownedAddons, courseProgress, clientProfile, currentUser } = state
  const client   = clientProfile || currentUser
  const dog      = dogProfile || state.dogProfile
  const dogName  = dog?.name || 'your companion'
  const firstName = (client?.name || '').split(' ')[0] || 'Welcome'
  const memory   = loadAIMemory()
  const streak   = loadStreak()

  const completedLessons = useMemo(() => Object.values(courseProgress)
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0), [courseProgress])

  const archetype  = useMemo(() => getArchetype(behaviourScores, dog), [behaviourScores, dog])
  const tier       = useMemo(() => getClientTier(completedLessons), [completedLessons])
  const intScores  = useMemo(() => computeIntelligenceScores(behaviourScores, completedLessons, streak), [behaviourScores, completedLessons, streak])
  const alerts     = useMemo(() => generatePredictiveAlerts(behaviourScores, dog, streak, completedLessons), [behaviourScores, dog, streak, completedLessons])
  const topAlert   = alerts[0] || null

  const greeting   = useMemo(() => getDynamicGreeting(client?.name, dog?.name, memory.sessionCount || 0), [client?.name, dog?.name, memory.sessionCount])
  const coaching   = useMemo(() => getConciergeCoachingSummary(client?.name, dog?.name, behaviourScores, dog?.age || 12, completedLessons), [client?.name, dog?.name, behaviourScores, dog?.age, completedLessons])
  const dailyInsight = useMemo(() => getDailyTransformationInsight(dog?.name, memory.dailyPromptIndex || 0), [dog?.name, memory.dailyPromptIndex])

  const achievements = useMemo(() => computeEarnedAchievements({
    completedLessons,
    streak:          streak.current || 0,
    completedCourses: 0,
    confidenceScore: intScores?.confidence || 0,
    anxietyScore:    behaviourScores?.individual?.anxiety || 0,
    stabilityScore:  intScores?.stability || 0,
    socialScore:     intScores?.social || 0,
  }), [completedLessons, streak, intScores, behaviourScores])

  const myCoursesData = COURSES.filter(c => enrolledCourses.includes(c.id))
  const availableCourses = COURSES.filter(c => !enrolledCourses.includes(c.id)).slice(0, 2)

  useEffect(() => {
    if (!onboardingComplete && state.isAuthenticated && state.userRole === 'client') {
      navigate('/academy/onboarding')
    }
  }, [onboardingComplete, state.isAuthenticated])

  const handleCourseNav = (courseId, lessonId) => {
    if (lessonId) navigate(`/academy/course/${courseId}/lesson/${lessonId}`)
    else navigate(`/academy/course/${courseId}`)
  }

  const handleVoiceGreeting = () => {
    if (VOICE_COACH_AVAILABLE) speak(greeting + ' ' + coaching)
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-6xl mx-auto">

      {/* ── CONCIERGE GREETING ── */}
      <FadeIn className="mb-8">
        <div className="relative overflow-hidden p-7 lg:p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 60%, transparent 100%)',
            border: '1px solid rgba(201,168,76,0.15)',
          }}>
          {/* Ambient radial */}
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

          <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              {/* Tier badge */}
              <div className="flex items-center gap-3 mb-4">
                <div className="divider-gold w-6" />
                <span className="section-label text-[9px]">{tier.name}</span>
                <span className="text-sm">{tier.icon}</span>
                {archetype && (
                  <>
                    <div className="w-px h-3 bg-white/10" />
                    <span className="font-sans text-[9px] text-silver-600">{archetype.icon} {archetype.name}</span>
                  </>
                )}
              </div>

              <h1 className="luxury-heading text-3xl lg:text-4xl mb-3 leading-tight">{greeting}</h1>

              <div className="flex items-center gap-2 mb-4">
                <GoldLineReveal />
              </div>

              <p className="font-serif text-sm font-light text-silver-300 leading-relaxed max-w-2xl italic mb-5">
                "{coaching}"
              </p>

              {/* Quick stats row */}
              <div className="flex items-center gap-5 flex-wrap">
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
                {achievements.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Award size={11} className="text-gold-500" />
                    <span className="font-sans text-xs text-silver-500">{achievements.length} distinctions</span>
                  </div>
                )}
              </div>
            </div>

            {/* Voice CTA */}
            {VOICE_COACH_AVAILABLE && (
              <motion.button onClick={handleVoiceGreeting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full border border-gold-500/20 flex items-center justify-center text-gold-500 hover:border-gold-500/40 hover:bg-gold-500/5 transition-all flex-shrink-0">
                <Volume2 size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </FadeIn>

      {/* ── PREDICTIVE ALERT (top one only) ── */}
      {topAlert && (
        <FadeIn className="mb-6">
          <AlertBanner alert={topAlert} />
        </FadeIn>
      )}

      {/* ── QUICK NAV CARDS ── */}
      <FadeIn className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { icon: <MapPin size={16} />,      label: 'Passport',   to: '/academy/passport',   colour: '#C9A84C' },
          { icon: <Clock size={16} />,       label: 'Timeline',   to: '/academy/timeline',   colour: '#10B981' },
          { icon: <BarChart2 size={16} />,   label: 'Analytics',  to: '/academy/analytics',  colour: '#8B5CF6' },
          { icon: <AlertTriangle size={16} />, label: 'Emergency', to: '/academy/emergency',  colour: '#EF4444' },
        ].map(item => (
          <Link key={item.to} to={item.to}>
            <motion.div whileHover={{ y: -2, borderColor: item.colour + '40' }} whileTap={{ scale: 0.97 }}
              className="glass-card p-4 flex items-center gap-3 cursor-pointer transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ color: item.colour, background: item.colour + '12', border: `1px solid ${item.colour}20` }}>
                {item.icon}
              </div>
              <span className="font-sans text-xs text-silver-400">{item.label}</span>
              <ChevronRight size={11} className="text-silver-700 ml-auto" />
            </motion.div>
          </Link>
        ))}
      </FadeIn>

      {/* ── DAILY INSIGHT ── */}
      {dailyInsight && (
        <FadeIn className="mb-8">
          <div className="glass-card p-5 flex items-start gap-4"
            style={{ border: '1px solid rgba(201,168,76,0.10)', background: 'rgba(201,168,76,0.02)' }}>
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: '0 0 12px rgba(201,168,76,0.2)' }}>
              <Sparkles size={13} className="text-charcoal-900" />
            </div>
            <div>
              <div className="section-label text-[9px] mb-1">Daily Insight</div>
              <p className="font-serif text-sm font-light text-silver-300 italic leading-relaxed">"{dailyInsight}"</p>
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── INTELLIGENCE SCORES (compact) ── */}
      {intScores && (
        <FadeIn className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-label mb-0.5">Behaviour Intelligence</div>
              <h2 className="luxury-heading text-xl">{dogName}'s Profile</h2>
            </div>
            <Link to="/academy/analytics" className="font-sans text-xs text-gold-500 hover:text-gold-300 flex items-center gap-1 transition-colors">
              Full Report <ArrowRight size={11} />
            </Link>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: 'confidence',  label: 'Confidence',  icon: '🦁', colour: '#C9A84C' },
              { key: 'stability',   label: 'Stability',   icon: '🌿', colour: '#10B981' },
              { key: 'focus',       label: 'Focus',       icon: '🎯', colour: '#8B5CF6' },
              { key: 'recovery',    label: 'Recovery',    icon: '💧', colour: '#06B6D4' },
              { key: 'enrichment',  label: 'Enrichment',  icon: '✨', colour: '#F59E0B' },
              { key: 'social',      label: 'Social',      icon: '🦋', colour: '#EC4899' },
            ].map(s => (
              <div key={s.key} className="glass-card p-3 text-center" style={{ border: `1px solid ${s.colour}18` }}>
                <div className="text-lg mb-1">{s.icon}</div>
                <div className="font-mono text-sm font-semibold" style={{ color: s.colour }}>{intScores[s.key] || 0}</div>
                <div className="font-sans text-[8px] text-silver-700 uppercase tracking-widest mt-0.5">{s.label}</div>
                <div className="h-0.5 mt-2 rounded-full overflow-hidden bg-white/5">
                  <motion.div style={{ background: s.colour, width: `${intScores[s.key] || 0}%` }}
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${intScores[s.key] || 0}%` }}
                    transition={{ duration: 1.2 }} />
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* ── MY PROGRAMMES ── */}
      {myCoursesData.length > 0 && (
        <FadeIn className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-label mb-0.5">Your Transformation</div>
              <h2 className="luxury-heading text-xl">Active Programmes</h2>
            </div>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCoursesData.map(course => (
              <CourseCard key={course.id} course={course}
                progress={courseProgress[course.id]}
                isEnrolled={true}
                onNavigate={handleCourseNav} />
            ))}
          </StaggerContainer>
        </FadeIn>
      )}

      {/* ── AVAILABLE PROGRAMMES ── */}
      {availableCourses.length > 0 && (
        <FadeIn className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-label mb-0.5">Recommended</div>
              <h2 className="luxury-heading text-xl">Available Programmes</h2>
            </div>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableCourses.map(course => (
              <CourseCard key={course.id} course={course}
                progress={null}
                isEnrolled={false}
                onNavigate={() => {}} />
            ))}
          </StaggerContainer>
        </FadeIn>
      )}

      {/* ── RECENT ACHIEVEMENTS ── */}
      {achievements.length > 0 && (
        <FadeIn className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-label mb-0.5">Distinctions</div>
              <h2 className="luxury-heading text-xl">Recent Achievements</h2>
            </div>
            <Link to="/academy/passport" className="font-sans text-xs text-gold-500 hover:text-gold-300 flex items-center gap-1 transition-colors">
              View All <ArrowRight size={11} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {achievements.slice(0, 4).map(a => (
              <motion.div key={a.id} whileHover={{ y: -2 }}
                className="flex items-center gap-2 glass-card px-4 py-2.5"
                style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
                <span className="text-lg">{a.icon}</span>
                <span className="font-sans text-xs text-silver-400">{a.name}</span>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* ── ARCHETYPE INSIGHT ── */}
      {archetype && (
        <FadeIn>
          <div className="glass-card p-6 flex items-start gap-4"
            style={{ border: '1px solid rgba(255,255,255,0.05)', background: archetype.gradient }}>
            <span className="text-3xl flex-shrink-0">{archetype.icon}</span>
            <div>
              <div className="section-label mb-0.5">Personality Archetype</div>
              <div className="font-serif text-lg text-pearl mb-1">{archetype.name}</div>
              <p className="font-sans text-xs font-light text-silver-400 leading-relaxed max-w-2xl">{archetype.tagline} · {archetype.traits.slice(0, 3).join(' · ')}</p>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
