import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, CheckCircle, Lock, Play, ArrowRight,
  Flame, AlertTriangle, BarChart2, MapPin,
  Clock, Award, Sparkles, Volume2, Bell, Activity, Brain,
  ChevronRight, Star, Zap, Wind,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useIntelligenceCore } from '../../hooks/useIntelligenceCore'
import { useAcademyConfig } from '../../context/AcademyConfigContext'
import { COURSES, getTotalLessons } from '../../data/courses'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { AmbientOrbs, IntelligenceLoader, MilestoneReveal, CardEntrance } from '../../components/ui/PageTransition'
import { speak, isVoiceEnabled, VOICE_COACH_AVAILABLE } from '../../ai/voiceCoach'
import { EMOTIONAL_STATES } from '../../ai/emotionalEngine'
import { SOUNDS } from '../../ai/intelligenceCore'

// ─────────────────────────────────────────────────────────────────────────────
// EMOTIONAL STATE ORB
// ─────────────────────────────────────────────────────────────────────────────
function EmotionalOrb({ emotionalState, size = 48 }) {
  const state = emotionalState || EMOTIONAL_STATES.UNCERTAIN
  return (
    <motion.div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <motion.div className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, ${state.glow} 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10 rounded-full flex items-center justify-center"
        style={{ width: size * 0.75, height: size * 0.75, background: `${state.colour}15`, border: `1px solid ${state.colour}40` }}>
        <span style={{ fontSize: size * 0.32 }}>{state.icon}</span>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INTELLIGENCE PULSE BADGE
// ─────────────────────────────────────────────────────────────────────────────
function IntelligencePulse({ label, value, colour = '#C9A84C', icon }) {
  return (
    <div className="flex items-center gap-2.5">
      <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: colour, boxShadow: `0 0 6px ${colour}80` }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }} />
      <div>
        <div className="font-sans text-[8px] text-silver-700 uppercase tracking-widest">{label}</div>
        <div className="font-mono text-xs font-medium" style={{ color: colour }}>{value}</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCIERGE GREETING BLOCK
// ─────────────────────────────────────────────────────────────────────────────
function ConciergeGreeting({ core, tierMeta, can }) {
  const [voiceActive, setVoiceActive] = useState(false)

  const handleVoice = useCallback(() => {
    if (!VOICE_COACH_AVAILABLE) return
    setVoiceActive(true)
    speak(`${core.greeting}. ${core.narrative.coaching || ''}`)
    setTimeout(() => setVoiceActive(false), 4000)
  }, [core.greeting, core.narrative?.coaching])

  return (
    <FadeIn>
      <div className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.02) 60%, transparent 100%)',
          border: '1px solid rgba(201,168,76,0.15)',
        }}>
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />

        <div className="relative z-10 p-7 lg:p-10">
          <div className="flex items-start gap-6 flex-wrap lg:flex-nowrap">

            {/* Emotional orb */}
            {core.emotionalState && (
              <div className="flex-shrink-0">
                <EmotionalOrb emotionalState={core.emotionalState} size={64} />
              </div>
            )}

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-6" style={{ background: tierMeta?.colour || '#C9A84C' }} />
                <span className="font-sans text-[9px] uppercase tracking-[0.3em]" style={{ color: tierMeta?.colour || '#C9A84C' }}>
                  {core.tier?.name || 'Intelligence Core'}
                </span>
              </div>

              <h2 className="font-display text-2xl lg:text-3xl font-light text-pearl mb-2 leading-snug">
                {core.narrative.greeting}
              </h2>

              {core.narrative.coaching && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-sans text-sm font-light text-silver-400 leading-relaxed mb-4 max-w-2xl">
                  {core.narrative.coaching}
                </motion.p>
              )}

              {/* Narrative insight */}
              {core.narrative.primary && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start gap-3 p-4 mb-4"
                  style={{ background: 'rgba(201,168,76,0.04)', borderLeft: '2px solid rgba(201,168,76,0.3)' }}>
                  <Brain size={13} className="text-gold-600 flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-silver-400 font-light leading-relaxed italic">
                    {core.narrative.primary}
                  </p>
                </motion.div>
              )}

              {/* Intelligence readouts */}
              {core.intScores && (
                <div className="flex flex-wrap gap-5">
                  {[
                    { label: 'Confidence', value: `${core.intScores.confidence}%`, colour: '#10B981' },
                    { label: 'Stability',  value: `${core.intScores.stability}%`,  colour: '#C9A84C' },
                    { label: 'Social',     value: `${core.intScores.social}%`,     colour: '#8B5CF6' },
                    { label: 'Streak',     value: `${core.streak?.current || 0}d`, colour: '#F59E0B' },
                  ].map(p => (
                    <IntelligencePulse key={p.label} {...p} />
                  ))}
                </div>
              )}
            </div>

            {/* Voice + Alerts */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {VOICE_COACH_AVAILABLE && can.voiceCoach && (
                <motion.button onClick={handleVoice} whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
                  style={{
                    borderColor: voiceActive ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.1)',
                    background: voiceActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                  }}>
                  <Volume2 size={14} className={voiceActive ? 'text-gold-400' : 'text-silver-600'} />
                </motion.button>
              )}
            </div>
          </div>

          {/* Emotional state label */}
          {core.emotionalState && core.emotionalState.id !== 'uncertain' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-5 pt-5 border-t border-white/5 flex items-center gap-3">
              <span className="font-sans text-[9px] uppercase tracking-widest text-silver-700">Emotional Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full"
                  style={{ background: core.emotionalState.colour, boxShadow: `0 0 4px ${core.emotionalState.colour}` }} />
                <span className="font-sans text-[10px] font-medium" style={{ color: core.emotionalState.colour }}>
                  {core.emotionalState.label}
                </span>
              </div>
              <span className="font-sans text-[10px] text-silver-600 font-light">—</span>
              <span className="font-sans text-[10px] text-silver-600 font-light italic">{core.emotionalState.desc}</span>
            </motion.div>
          )}
        </div>
      </div>
    </FadeIn>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ALERT PANEL
// ─────────────────────────────────────────────────────────────────────────────
function AlertPanel({ alert }) {
  if (!alert) return null
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 p-4 border ${alert.bgColour || 'bg-amber-500/5'} ${alert.border || 'border-amber-500/20'}`}>
      <span className="text-base flex-shrink-0 mt-0.5">{alert.icon}</span>
      <div className="flex-1 min-w-0">
        <div className={`font-sans text-[9px] font-semibold uppercase tracking-widest mb-1 ${alert.colour || 'text-amber-400'}`}>
          {alert.title}
        </div>
        <p className="font-sans text-xs text-silver-400 font-light leading-relaxed">{alert.summary}</p>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSE CARD
// ─────────────────────────────────────────────────────────────────────────────
function CourseCard({ course, progress, isEnrolled, onNavigate, index = 0 }) {
  const completedLessons = progress?.completedLessons || []
  const totalLessons     = getTotalLessons(course)
  const percent          = Math.round((completedLessons.length / totalLessons) * 100)
  const nextModule       = course.modules?.find(m => !m.lessons.every(l => completedLessons.includes(l.id)))
  const nextLesson       = nextModule?.lessons.find(l => !completedLessons.includes(l.id))

  return (
    <CardEntrance index={index}>
      <motion.div
        whileHover={{ y: -3, borderColor: 'rgba(201,168,76,0.35)' }}
        className="glass-card overflow-hidden cursor-pointer h-full"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        onClick={() => isEnrolled && onNavigate(course.id, nextLesson?.id)}
      >
        <div className={`h-px bg-gradient-to-r ${course.color}`} />

        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-3xl flex-shrink-0">{course.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-serif text-base font-medium text-pearl mb-0.5 leading-snug">{course.title}</div>
              <div className="font-sans text-[10px] text-silver-600 font-light">{course.subtitle}</div>
            </div>
            {!isEnrolled && <Lock size={12} className="text-silver-800 flex-shrink-0 mt-1" />}
          </div>

          {isEnrolled && (
            <>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-sans text-[9px] text-silver-700 uppercase tracking-widest">Progress</span>
                  <span className="font-mono text-[10px] text-gold-500">{percent}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.3, delay: index * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-[9px] text-silver-700">{completedLessons.length}/{totalLessons} lessons</span>
                {percent === 100
                  ? <span className="flex items-center gap-1 font-sans text-[9px] text-emerald-400"><CheckCircle size={10} /> Complete</span>
                  : <button className="flex items-center gap-1 font-sans text-[10px] text-gold-500 hover:text-gold-300 transition-colors">
                      <Play size={9} fill="currentColor" /> Continue
                    </button>
                }
              </div>
            </>
          )}
          {!isEnrolled && (
            <div className="flex items-center justify-between">
              <span className="font-sans text-[9px] text-silver-600">{course.duration}</span>
              <span className="font-sans text-[9px] text-gold-700 font-medium">{course.price}</span>
            </div>
          )}
        </div>
      </motion.div>
    </CardEntrance>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY INSIGHT CARD
// ─────────────────────────────────────────────────────────────────────────────
function DailyInsightCard({ insight }) {
  if (!insight) return null
  return (
    <FadeIn delay={0.3}>
      <div className="relative overflow-hidden p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(139,92,246,0.02) 100%)',
          border: '1px solid rgba(139,92,246,0.2)',
        }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }} />
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <Brain size={13} className="text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-purple-500 mb-1.5">Intelligence Core · Daily Insight</div>
            <p className="font-sans text-sm font-light text-silver-300 leading-relaxed italic">
              {insight}
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK NAVIGATION GRID
// ─────────────────────────────────────────────────────────────────────────────
function QuickNavGrid({ navItems, can }) {
  const navigate = useNavigate()
  const highlights = [
    { to: '/academy/wellness',  icon: '✨', label: 'Wellness',    feature: 'wellness_full'      },
    { to: '/academy/passport',  icon: '🪪', label: 'Passport',    feature: 'passport'            },
    { to: '/academy/journal',   icon: '📖', label: 'Journal',     feature: 'journal'             },
    { to: '/academy/twin',      icon: '🤖', label: 'Digital Twin',feature: 'digital_twin'        },
    { to: '/academy/calm',      icon: '🌸', label: 'Calm Centre', feature: 'calm_centre'         },
    { to: '/academy/map',       icon: '🗺️', label: 'Journey',     feature: 'transformation_map'  },
    { to: '/academy/stability', icon: '🛡️', label: 'Stability',   feature: 'stability_dashboard' },
    { to: '/academy/emergency', icon: '🚨', label: 'Emergency',   feature: 'emergency'           },
  ].filter(item => can.feature(item.feature))

  return (
    <FadeIn delay={0.2}>
      <div>
        <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-700 mb-3">Quick Access</div>
        <div className="grid grid-cols-4 gap-2">
          {highlights.slice(0, 8).map((item, i) => (
            <motion.button key={item.to}
              onClick={() => { SOUNDS.tap(); navigate(item.to) }}
              whileHover={{ y: -2, borderColor: 'rgba(201,168,76,0.35)' }}
              whileTap={{ scale: 0.96 }}
              className="flex flex-col items-center gap-1.5 p-3 border border-white/5 transition-all duration-200 hover:bg-gold-500/4"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-sans text-[8px] text-silver-600 uppercase tracking-widest leading-tight text-center">{item.label}</span>
            </motion.button>
          ))}
        </div>
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
  const { can, tierMeta, packageMeta, navItems, motionLevel } = useAcademyConfig()
  const intelligence = useIntelligenceCore()

  const [milestone, setMilestone] = useState(null)

  const { enrolledCourses, courseProgress } = state
  const { core, ready, behaviourScores, emotionalState, alerts, achievements, streak, narrative } = intelligence

  const myCoursesData      = COURSES.filter(c => enrolledCourses.includes(c.id))
  const availableCourses   = COURSES.filter(c => !enrolledCourses.includes(c.id)).slice(0, 2)
  const topAlert           = alerts[0] || null

  useEffect(() => {
    if (!ready && state.isAuthenticated && state.userRole === 'client') {
      navigate('/academy/onboarding')
    }
  }, [ready, state.isAuthenticated])

  // Milestone detection
  useEffect(() => {
    if (!core) return
    const completedCount = core.completedLessons
    if (completedCount > 0 && completedCount % 5 === 0) {
      const stored = localStorage.getItem(`fp_milestone_shown_${completedCount}`)
      if (!stored) {
        setTimeout(() => {
          setMilestone({
            title: 'Lesson Milestone Reached',
            subtitle: core.narrativeTemplates?.milestone || `${core.dogName} has now completed ${completedCount} lessons — each one a permanent addition to their behavioural foundation.`,
            icon: '🏆',
          })
          localStorage.setItem(`fp_milestone_shown_${completedCount}`, '1')
        }, 1200)
      }
    }
  }, [core?.completedLessons])

  const handleCourseNav = (courseId, lessonId) => {
    SOUNDS.tap()
    if (lessonId) navigate(`/academy/course/${courseId}/lesson/${lessonId}`)
    else navigate(`/academy/course/${courseId}`)
  }

  if (!ready && !core) {
    return <IntelligenceLoader label="Calibrating intelligence profile…" />
  }

  return (
    <div className="min-h-screen p-5 lg:p-8 max-w-6xl mx-auto relative">
      <AmbientOrbs count={3} colour="rgba(201,168,76,0.03)" className="fixed" />

      {/* ── CONCIERGE GREETING ─────────────────────────────── */}
      <div className="mb-6">
        {core ? (
          <ConciergeGreeting core={{ ...core, narrative }} tierMeta={tierMeta} can={can} />
        ) : (
          <FadeIn>
            <div className="glass-card p-8" style={{ border: '1px solid rgba(201,168,76,0.1)' }}>
              <div className="font-display text-2xl text-pearl">Welcome to your Academy.</div>
            </div>
          </FadeIn>
        )}
      </div>

      {/* ── ALERT PANEL ──────────────────────────────────────── */}
      {topAlert && (
        <div className="mb-5">
          <AlertPanel alert={topAlert} />
        </div>
      )}

      {/* ── DAILY INSIGHT ────────────────────────────────────── */}
      {narrative.insight && (
        <div className="mb-6">
          <DailyInsightCard insight={narrative.insight} />
        </div>
      )}

      {/* ── MAIN GRID ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT — courses */}
        <div className="lg:col-span-2 space-y-5">

          {/* Enrolled courses */}
          {myCoursesData.length > 0 && (
            <FadeIn>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-700">Active Programmes</div>
                  <Link to="/academy" className="font-sans text-[9px] text-gold-600 hover:text-gold-400 transition-colors flex items-center gap-1">
                    View All <ChevronRight size={9} />
                  </Link>
                </div>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myCoursesData.slice(0, 4).map((course, i) => (
                    <CourseCard key={course.id} course={course}
                      progress={courseProgress[course.id]}
                      isEnrolled={true}
                      onNavigate={handleCourseNav}
                      index={i}
                    />
                  ))}
                </StaggerContainer>
              </div>
            </FadeIn>
          )}

          {/* Available courses */}
          {availableCourses.length > 0 && (
            <FadeIn delay={0.15}>
              <div>
                <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-700 mb-3">Recommended Programmes</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableCourses.map((course, i) => (
                    <CourseCard key={course.id} course={course}
                      progress={null} isEnrolled={false}
                      onNavigate={() => navigate(`/academy/course/${course.id}`)}
                      index={i + 10}
                    />
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {/* Empty state */}
          {myCoursesData.length === 0 && availableCourses.length === 0 && (
            <FadeIn>
              <div className="glass-card p-10 text-center" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="text-4xl mb-4">📚</div>
                <div className="font-serif text-lg text-pearl mb-2">Your Programme Awaits</div>
                <p className="font-sans text-sm text-silver-600 font-light max-w-xs mx-auto">
                  Your behavioural intelligence profile is ready. Your programmes will appear here.
                </p>
              </div>
            </FadeIn>
          )}

          {/* Behaviour narrative secondary */}
          {narrative.secondary && (
            <FadeIn delay={0.3}>
              <div className="p-5"
                style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <div className="flex items-start gap-3">
                  <Activity size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-sans text-[8px] uppercase tracking-widest text-emerald-600 mb-1.5">Behavioural Intelligence</div>
                    <p className="font-sans text-xs text-silver-400 font-light leading-relaxed italic">{narrative.secondary}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-5">

          {/* Quick nav */}
          <QuickNavGrid navItems={navItems} can={can} />

          {/* Intelligence scores */}
          {core?.intScores && (
            <FadeIn delay={0.2}>
              <div className="glass-card p-5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-700 mb-4">Intelligence Profile</div>
                <div className="space-y-3">
                  {[
                    { label: 'Confidence',   value: core.intScores.confidence,  colour: '#10B981' },
                    { label: 'Stability',    value: core.intScores.stability,   colour: '#C9A84C' },
                    { label: 'Social',       value: core.intScores.social,      colour: '#8B5CF6' },
                    { label: 'Engagement',   value: core.intScores.engagement,  colour: '#3B82F6' },
                    { label: 'Consistency',  value: core.intScores.consistency, colour: '#F59E0B' },
                  ].map(metric => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-sans text-[9px] text-silver-600">{metric.label}</span>
                        <span className="font-mono text-[10px]" style={{ color: metric.colour }}>{metric.value}%</span>
                      </div>
                      <div className="h-0.5 bg-white/5 overflow-hidden">
                        <motion.div className="h-full rounded-full"
                          style={{ background: metric.colour }}
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {/* Streak + Progress stats */}
          <FadeIn delay={0.25}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Streak',      value: `${streak.current || 0}d`, icon: '🔥', colour: '#F59E0B' },
                { label: 'Lessons',     value: core?.completedLessons || 0, icon: '✓', colour: '#10B981' },
                { label: 'Programmes',  value: myCoursesData.length,  icon: '📚', colour: '#C9A84C' },
                { label: 'Achievements',value: (achievements || []).filter(a => a.earned).length, icon: '🏆', colour: '#8B5CF6' },
              ].map(s => (
                <div key={s.label} className="glass-card p-4 text-center"
                  style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="text-lg mb-1">{s.icon}</div>
                  <div className="font-display text-xl font-light" style={{ color: s.colour }}>{s.value}</div>
                  <div className="font-sans text-[8px] text-silver-700 uppercase tracking-widest mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Tier + Package */}
          {tierMeta && (
            <FadeIn delay={0.3}>
              <div className="p-5 relative overflow-hidden"
                style={{ background: `${tierMeta.colour}08`, border: `1px solid ${tierMeta.colour}20` }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 80% 80% at 100% 0%, ${tierMeta.colour}06 0%, transparent 70%)` }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{tierMeta.icon}</span>
                    <span className="font-sans text-[9px] uppercase tracking-widest" style={{ color: tierMeta.colour }}>
                      {tierMeta.name}
                    </span>
                  </div>
                  {packageMeta && (
                    <div className="font-sans text-xs text-silver-500 mt-1">{packageMeta.name}</div>
                  )}
                  {packageMeta?.tagline && (
                    <div className="font-serif text-[10px] italic text-silver-600 mt-0.5">{packageMeta.tagline}</div>
                  )}
                </div>
              </div>
            </FadeIn>
          )}

          {/* Recent achievements */}
          {achievements && achievements.filter(a => a.earned).length > 0 && (
            <FadeIn delay={0.35}>
              <div>
                <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-700 mb-3">Recent Milestones</div>
                <div className="space-y-2">
                  {achievements.filter(a => a.earned).slice(0, 3).map(a => (
                    <div key={a.id} className="flex items-center gap-3 p-3 border border-white/5">
                      <span className="text-xl flex-shrink-0">{a.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-sans text-xs text-pearl truncate">{a.title}</div>
                        <div className="font-sans text-[9px] text-silver-600 truncate">{a.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </div>

      {/* Milestone overlay */}
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
