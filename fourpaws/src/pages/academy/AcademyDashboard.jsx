// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — ACADEMY DASHBOARD
// ODIN DOCTRINE: Noiseless. Single insight. One voice. Three surfaces.
//
// What this screen answers:
//   1. What is happening with my dog right now?
//   2. What should I do next?
//   3. How is my programme progressing?
//
// Nothing else is shown. Nothing else is needed.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Lock, CheckCircle, Volume2, ArrowRight, Flame } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useIntelligenceCore } from '../../hooks/useIntelligenceCore'
import { useAcademyConfig } from '../../context/AcademyConfigContext'
import { COURSES, getTotalLessons } from '../../data/courses'
import { FadeIn } from '../../components/animations/FadeIn'
import { AmbientOrbs, IntelligenceLoader, MilestoneReveal } from '../../components/ui/PageTransition'
import { speak, VOICE_COACH_AVAILABLE } from '../../ai/voiceCoach'
import { SOUNDS } from '../../ai/intelligenceCore'
import { buildSingleSurface, MOTION } from '../../ai/narrativeVoice'
import { EMOTIONAL_STATES } from '../../ai/emotionalEngine'

// ─────────────────────────────────────────────────────────────────────────────
// COMPANION ORB — the living emotional centre
// Calm, breathing presence. Not a data widget.
// ─────────────────────────────────────────────────────────────────────────────
function CompanionOrb({ emotionalState, dogName }) {
  const es = emotionalState || EMOTIONAL_STATES.UNCERTAIN
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Outer breathing ring */}
      <div className="relative" style={{ width: 80, height: 80 }}>
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${es.glow} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: MOTION.ambient.duration, repeat: Infinity, ease: MOTION.ambient.ease }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `1px solid ${es.colour}25` }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <div className="absolute inset-3 rounded-full flex items-center justify-center"
          style={{ background: `${es.colour}10`, border: `1px solid ${es.colour}30` }}>
          <span style={{ fontSize: 26 }}>{es.icon}</span>
        </div>
      </div>
      {/* Emotional state label — quiet, secondary */}
      <div className="text-center">
        <div className="font-sans text-[9px] font-medium tracking-widest uppercase"
          style={{ color: es.colour }}>{es.specState ? es.specState.charAt(0).toUpperCase() + es.specState.slice(1) : es.label}</div>
        {dogName && (
          <div className="font-sans text-[8px] text-silver-700 mt-0.5">{dogName}</div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMARY INTELLIGENCE SURFACE
// One insight. One action. One optional observation.
// This is the entire intelligence output for the session.
// ─────────────────────────────────────────────────────────────────────────────
function IntelligenceSurface({ surface, greeting, voiceEnabled, onVoice, voiceActive }) {
  if (!surface) return null

  return (
    <FadeIn>
      <div className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 50%, transparent 100%)',
          border: '1px solid rgba(201,168,76,0.12)',
        }}>
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)' }} />

        <div className="p-6 lg:p-8">
          {/* Greeting — quiet, personal */}
          {greeting && (
            <div className="flex items-start justify-between gap-4 mb-5">
              <h2 className="font-display text-xl lg:text-2xl font-light text-pearl leading-snug flex-1">
                {greeting}
              </h2>
              {voiceEnabled && (
                <motion.button
                  onClick={onVoice}
                  whileTap={MOTION.tap}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    border: `1px solid ${voiceActive ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    background: voiceActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                  }}>
                  <Volume2 size={12} style={{ color: voiceActive ? '#C9A84C' : 'rgba(255,255,255,0.35)' }} />
                </motion.button>
              )}
            </div>
          )}

          {/* Insight */}
          <div className="mb-4">
            <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-gold-700 mb-2">Insight</div>
            <p className="font-sans text-sm text-silver-300 font-light leading-relaxed">
              {surface.insight}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px mb-4"
            style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.15), transparent)' }} />

          {/* Recommendation */}
          <div className="mb-4">
            <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-gold-700 mb-2">Recommendation</div>
            <p className="font-sans text-sm text-silver-400 font-light leading-relaxed">
              {surface.action}
            </p>
          </div>

          {/* Observation — only shown when meaningful */}
          {surface.observation && (
            <>
              <div className="h-px mb-4"
                style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }} />
              <div>
                <div className="font-sans text-[8px] uppercase tracking-[0.4em] text-silver-700 mb-2">Observation</div>
                <p className="font-sans text-xs text-silver-500 font-light leading-relaxed italic">
                  {surface.observation}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </FadeIn>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NEXT LESSON — the single most important programme action
// Minimal. Direct. No progress bars on this surface.
// ─────────────────────────────────────────────────────────────────────────────
function NextLessonCard({ courses, progress, onNavigate }) {
  // Find the single most relevant next lesson
  const nextItem = useMemo(() => {
    for (const course of courses) {
      const prog          = progress[course.id] || { completedLessons: [] }
      const totalLessons  = getTotalLessons(course)
      const completed     = prog.completedLessons?.length || 0
      if (completed < totalLessons) {
        const nextModule = course.modules?.find(m =>
          !m.lessons.every(l => prog.completedLessons.includes(l.id))
        )
        const nextLesson = nextModule?.lessons.find(l => !prog.completedLessons.includes(l.id))
        if (nextLesson) {
          return { course, nextLesson, completed, totalLessons, percent: Math.round((completed / totalLessons) * 100) }
        }
      }
    }
    return null
  }, [courses, progress])

  if (!nextItem) return null

  const { course, nextLesson, percent } = nextItem

  return (
    <FadeIn delay={0.1}>
      <motion.div
        className="relative overflow-hidden cursor-pointer"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        whileHover={{ borderColor: 'rgba(201,168,76,0.3)', ...MOTION.hover }}
        whileTap={MOTION.tap}
        onClick={() => onNavigate(course.id, nextLesson.id)}
      >
        <div className={`h-px bg-gradient-to-r ${course.color}`} />
        <div className="p-5 flex items-center gap-4">
          <span className="text-2xl flex-shrink-0">{course.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-silver-700 mb-0.5">Continue</div>
            <div className="font-serif text-sm font-medium text-pearl truncate">{nextLesson.title}</div>
            <div className="font-sans text-[10px] text-silver-600 truncate">{course.title}</div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            <span className="font-mono text-[10px] text-gold-500">{percent}%</span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
              <Play size={11} className="text-gold-500" style={{ marginLeft: 1 }} fill="currentColor" />
            </div>
          </div>
        </div>
      </motion.div>
    </FadeIn>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AVAILABLE COURSE — minimal teaser
// ─────────────────────────────────────────────────────────────────────────────
function AvailableCourseCard({ course, index }) {
  const navigate = useNavigate()
  return (
    <motion.div
      className="flex items-center gap-3 p-4 cursor-pointer"
      style={{ border: '1px solid rgba(255,255,255,0.04)' }}
      whileHover={{ borderColor: 'rgba(201,168,76,0.2)', ...MOTION.hover }}
      whileTap={MOTION.tap}
      onClick={() => { SOUNDS.tap(); navigate(`/academy/course/${course.id}`) }}
    >
      <span className="text-xl flex-shrink-0">{course.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-serif text-xs font-medium text-silver-400 truncate">{course.title}</div>
        <div className="font-sans text-[9px] text-silver-700 truncate">{course.duration}</div>
      </div>
      <Lock size={10} className="text-silver-800 flex-shrink-0" />
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// QUIET STATS — two numbers only. No grid of four.
// ─────────────────────────────────────────────────────────────────────────────
function QuietStats({ streak, completedLessons }) {
  if (!streak && !completedLessons) return null
  return (
    <FadeIn delay={0.3}>
      <div className="flex items-center gap-5 py-4 border-t border-white/[0.04]">
        {streak?.current > 0 && (
          <div className="flex items-center gap-2">
            <Flame size={11} className="text-amber-500" />
            <span className="font-sans text-[10px] text-silver-500">
              <span className="font-mono text-sm text-amber-400">{streak.current}</span>
              <span className="text-silver-700 ml-1">day streak</span>
            </span>
          </div>
        )}
        {completedLessons > 0 && (
          <div className="flex items-center gap-2">
            <CheckCircle size={11} className="text-emerald-500" />
            <span className="font-sans text-[10px] text-silver-500">
              <span className="font-mono text-sm text-emerald-400">{completedLessons}</span>
              <span className="text-silver-700 ml-1">lessons completed</span>
            </span>
          </div>
        )}
      </div>
    </FadeIn>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function AcademyDashboard() {
  const { state }   = useApp()
  const navigate    = useNavigate()
  const { can, tierMeta } = useAcademyConfig()
  const intelligence = useIntelligenceCore()
  const [milestone,   setMilestone]   = useState(null)
  const [voiceActive, setVoiceActive] = useState(false)

  const { enrolledCourses, courseProgress, dogProfile } = state
  const { core, ready, behaviourScores, emotionalState, streak } = intelligence

  const myCourses       = COURSES.filter(c => enrolledCourses.includes(c.id))
  const availableCourses = COURSES.filter(c => !enrolledCourses.includes(c.id)).slice(0, 2)

  const completedLessons = Object.values(courseProgress || {})
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)

  // Build the single-surface intelligence output
  const surface = useMemo(() =>
    buildSingleSurface(core, behaviourScores, emotionalState, streak, core?.dogName),
    [core?.dogName, behaviourScores, emotionalState, streak]
  )

  // Voice narration of the insight + action
  const handleVoice = useCallback(() => {
    if (!VOICE_COACH_AVAILABLE || !surface) return
    setVoiceActive(true)
    const script = [
      core?.narrative?.greeting || '',
      surface.insight,
      surface.action,
    ].filter(Boolean).join('. ')
    speak(script)
    setTimeout(() => setVoiceActive(false), 8000)
  }, [surface, core?.narrative?.greeting])

  // Milestone detection — minimal, only on 5-lesson intervals
  useEffect(() => {
    if (!core || completedLessons === 0) return
    if (completedLessons % 5 !== 0) return
    const key = `fp_milestone_shown_${completedLessons}`
    if (localStorage.getItem(key)) return
    setTimeout(() => {
      setMilestone({
        title: core.dogName ? `${core.dogName}'s Progress` : 'A Milestone Reached',
        subtitle: `${core.dogName || 'Your companion'} has now completed ${completedLessons} lessons — each one a permanent part of their behavioural foundation.`,
        icon: '🏆',
      })
      localStorage.setItem(key, '1')
    }, 1500)
  }, [completedLessons, core?.dogName])

  // Onboarding redirect
  useEffect(() => {
    if (!ready && state.isAuthenticated && state.userRole === 'client') {
      navigate('/academy/onboarding')
    }
  }, [ready, state.isAuthenticated])

  if (!ready && !core) {
    return <IntelligenceLoader label="Preparing your session…" />
  }

  return (
    <div className="min-h-screen p-5 lg:p-8 max-w-3xl mx-auto relative">
      {/* Single ambient orb — restrained */}
      <AmbientOrbs count={1} colour="rgba(201,168,76,0.025)" />

      {/* ── COMPANION ORB + INTELLIGENCE SURFACE ─────────── */}
      {/* Mobile: companion above, intelligence below */}
      {/* Desktop: side-by-side */}
      <div className="flex flex-col lg:flex-row items-start gap-6 mb-6">

        {/* Companion orb — emotional presence */}
        {core?.emotionalState && (
          <FadeIn className="flex-shrink-0 lg:pt-6">
            <CompanionOrb emotionalState={emotionalState} dogName={core.dogName} />
          </FadeIn>
        )}

        {/* Intelligence surface — the single output */}
        <div className="flex-1 min-w-0">
          <IntelligenceSurface
            surface={surface}
            greeting={core?.narrative?.greeting || core?.greeting}
            voiceEnabled={VOICE_COACH_AVAILABLE && can.voiceCoach}
            onVoice={handleVoice}
            voiceActive={voiceActive}
          />
        </div>
      </div>

      {/* ── QUIET STATS — two numbers, nothing more ────────── */}
      <QuietStats streak={streak} completedLessons={completedLessons} />

      {/* ── NEXT LESSON — the single programme CTA ─────────── */}
      {myCourses.length > 0 && (
        <div className="mt-5">
          <NextLessonCard
            courses={myCourses}
            progress={courseProgress}
            onNavigate={(courseId, lessonId) => {
              SOUNDS.tap()
              navigate(lessonId
                ? `/academy/course/${courseId}/lesson/${lessonId}`
                : `/academy/course/${courseId}`)
            }}
          />
        </div>
      )}

      {/* ── AVAILABLE PROGRAMMES — quiet, non-urgent ─────────── */}
      {availableCourses.length > 0 && myCourses.length === 0 && (
        <FadeIn delay={0.2} className="mt-5">
          <div className="font-sans text-[8px] uppercase tracking-[0.35em] text-silver-700 mb-3">Available Programmes</div>
          <div className="space-y-2">
            {availableCourses.map((c, i) => (
              <AvailableCourseCard key={c.id} course={c} index={i} />
            ))}
          </div>
        </FadeIn>
      )}

      {/* ── MEMBERSHIP TIER — the quietest element ──────────── */}
      {tierMeta && (
        <FadeIn delay={0.35} className="mt-6">
          <div className="flex items-center justify-between py-4 border-t border-white/[0.04]">
            <div className="flex items-center gap-2">
              <span className="text-base">{tierMeta.icon}</span>
              <span className="font-sans text-[9px] text-silver-700" style={{ color: `${tierMeta.colour}90` }}>
                {tierMeta.name}
              </span>
            </div>
            <button
              onClick={() => { SOUNDS.tap(); navigate('/academy/method') }}
              className="flex items-center gap-1.5 font-sans text-[9px] text-silver-700 hover:text-silver-400 transition-colors uppercase tracking-widest">
              The Method™ <ArrowRight size={9} />
            </button>
          </div>
        </FadeIn>
      )}

      {/* ── MILESTONE OVERLAY ──────────────────────────────── */}
      <AnimatePresence>
        {milestone && (
          <MilestoneReveal
            title={milestone.title}
            subtitle={milestone.subtitle}
            icon={milestone.icon}
            onClose={() => setMilestone(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
