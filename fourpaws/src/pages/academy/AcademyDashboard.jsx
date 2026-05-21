import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen, CheckCircle, Lock, Play, TrendingUp,
  Package, Sparkles, Flame, Brain, Zap, Star, ArrowRight
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import { COURSES, ADDONS, getTotalLessons, getProgressPercent } from '../../data/courses'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { CONCERN_LEVELS, TRAIT_LABELS, getDailyPrompt } from '../../ai/behaviourEngine'
import { loadStreak } from '../../ai/aiMemory'

// ── Behaviour score bar ────────────────────────────────────────
function ScoreBar({ label, icon, value, inverted = false }) {
  const displayVal = inverted ? (100 - value) : value
  const colour     = displayVal > 70 ? '#EF4444' : displayVal > 45 ? '#F59E0B' : '#10B981'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{icon}</span>
          <span className="font-sans text-xs text-silver-400">{label}</span>
        </div>
        <span className="font-mono text-[10px] font-medium" style={{ color: colour }}>{value}/100</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${colour}99, ${colour})` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default function AcademyDashboard() {
  const { state } = useApp()
  const navigate = useNavigate()
  const { onboardingComplete, behaviourScores, aiRecommendations, dogProfile, trainingInsights, streak } = useAI()

  const { enrolledCourses, ownedAddons, courseProgress, clientProfile, currentUser } = state
  const client    = clientProfile || currentUser
  const dog       = dogProfile || state.dogProfile
  const dogName   = dog?.name || client?.dog?.name || 'your dog'
  const firstName = client?.name?.split(' ')[0] || clientProfile?.displayName || 'Welcome'
  const liveStreak = loadStreak()

  // Redirect to onboarding if not done
  useEffect(() => {
    if (!onboardingComplete && state.isAuthenticated && state.userRole === 'client') {
      navigate('/academy/onboarding')
    }
  }, [onboardingComplete, state.isAuthenticated])

  const myCoursesData = COURSES.filter(c => enrolledCourses.includes(c.id))
  const myAddons      = ADDONS.filter(a => ownedAddons.includes(a.id))
  const totalLessons  = myCoursesData.reduce((acc, c) => acc + getTotalLessons(c), 0)
  const completedLessons = Object.values(courseProgress).reduce((acc, p) => acc + (p.completedLessons?.length || 0), 0)
  const overallProgress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const dailyPrompt    = trainingInsights?.dailyPrompt || getDailyPrompt(dogName)
  const behaviourInsight = trainingInsights?.insight

  const recommendedCourses = (aiRecommendations?.courses || [])
    .map(id => COURSES.find(c => c.id === id))
    .filter(Boolean)
    .slice(0, 2)

  const concernLevel = behaviourScores?.concernLevel || null

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <FadeIn className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="section-label mb-1">{greeting()}</div>
            <h1 className="luxury-heading text-4xl lg:text-5xl">{firstName}</h1>
            {dog && (
              <div className="flex items-center gap-2 mt-2">
                <span className="font-sans text-sm text-silver-500">
                  {dog.name} · {dog.breed}
                </span>
                {concernLevel && (
                  <span className={`flex items-center gap-1.5 font-sans text-xs ${concernLevel.colour}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${concernLevel.dot}`} />
                    {concernLevel.label} concern
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="glass-card p-4 flex items-center gap-4" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
            <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center text-charcoal-900 font-display text-xl font-light flex-shrink-0">
              {(client?.name || firstName || 'A').charAt(0)}
            </div>
            <div>
              <div className="font-sans text-xs font-medium text-pearl">{client?.name || firstName}</div>
              {dog && <div className="font-sans text-[10px] text-silver-600 mt-0.5">{dog.name}'s Academy</div>}
              {liveStreak.current > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Flame size={10} className="text-orange-400" />
                  <span className="font-sans text-[9px] text-orange-400">{liveStreak.current} day streak</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── AI Daily Insight ── */}
      {(dailyPrompt || behaviourInsight) && (
        <FadeIn className="mb-8">
          <div className="glass-card p-6 relative overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 80% at 100% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                  <Brain size={12} className="text-charcoal-900" />
                </div>
                <span className="section-label text-[9px]">AI Coaching · Today</span>
              </div>
              {behaviourInsight && (
                <p className="font-serif text-base font-light text-silver-200 leading-relaxed italic mb-3">
                  "{behaviourInsight}"
                </p>
              )}
              {dailyPrompt && (
                <div className="flex items-start gap-3 pt-3 border-t border-white/5">
                  <Zap size={13} className="text-gold-500 flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-sm font-light text-silver-400 leading-relaxed">{dailyPrompt}</p>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── Stats ── */}
      <FadeIn className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpen, label: 'Programmes',       value: myCoursesData.length },
          { icon: CheckCircle, label: 'Lessons Done',  value: completedLessons     },
          { icon: TrendingUp,  label: 'Progress',      value: `${overallProgress}%` },
          { icon: Flame,       label: 'Day Streak',    value: liveStreak.current || 0 },
        ].map((stat, i) => (
          <motion.div key={stat.label} whileHover={{ y: -2 }} className="glass-card gold-border-hover p-5">
            <stat.icon size={15} className="text-gold-500 mb-3" />
            <div className="stat-number text-2xl mb-1">{stat.value}</div>
            <div className="font-sans text-[10px] text-silver-600 tracking-widest uppercase">{stat.label}</div>
          </motion.div>
        ))}
      </FadeIn>

      {/* ── Behaviour scores ── */}
      {behaviourScores && (
        <FadeIn className="mb-8">
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="section-label mb-1">Behaviour Analysis</div>
                <h3 className="font-serif text-lg text-pearl">{dogName}'s Profile</h3>
              </div>
              <div className="text-right">
                <div className="stat-number text-2xl">{behaviourScores.overall}</div>
                <div className="font-sans text-[9px] text-silver-600 uppercase tracking-widest">Concern Score</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(behaviourScores.individual || {}).map(([trait, score]) => {
                const meta = TRAIT_LABELS[trait]
                if (!meta) return null
                return (
                  <ScoreBar key={trait} label={meta.label} icon={meta.icon} value={score} />
                )
              })}
            </div>
            {behaviourScores.strengths?.length > 0 && (
              <div className="mt-5 pt-4 border-t border-white/5">
                <div className="font-sans text-[9px] tracking-widest uppercase text-silver-600 mb-2">Strengths</div>
                <div className="flex flex-wrap gap-2">
                  {behaviourScores.strengths.map(s => (
                    <span key={s} className="flex items-center gap-1 font-sans text-xs text-emerald-400 bg-emerald-400/8 border border-emerald-400/15 px-2.5 py-1">
                      <Star size={9} /> {TRAIT_LABELS[s]?.label || s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      )}

      {/* ── My programmes ── */}
      <div className="mb-8">
        <FadeIn className="flex items-center justify-between mb-5">
          <div>
            <div className="section-label mb-1">My Programmes</div>
            <h2 className="luxury-heading text-2xl">Continue {dogName}'s Journey</h2>
          </div>
        </FadeIn>

        {myCoursesData.length === 0 ? (
          <div className="glass-card p-10 text-center" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-4xl mb-4">📚</div>
            <h3 className="font-serif text-xl text-pearl mb-2">No programmes assigned yet</h3>
            <p className="font-sans text-sm text-silver-500">Contact the academy to be enrolled in your first programme.</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myCoursesData.map(course => {
              const progress  = courseProgress[course.id] || { completedLessons: [], completedModules: [] }
              const percent   = getProgressPercent(course.id, progress.completedLessons)
              const total     = getTotalLessons(course)
              const completed = course.modules.flatMap(m => m.lessons).filter(l => progress.completedLessons?.includes(l.id)).length

              let nextLesson = null
              for (const mod of course.modules) {
                for (const lesson of mod.lessons) {
                  if (!progress.completedLessons?.includes(lesson.id)) {
                    nextLesson = { lesson, module: mod }; break
                  }
                }
                if (nextLesson) break
              }

              return (
                <StaggerItem key={course.id}>
                  <motion.div whileHover={{ y: -3 }}
                    className="glass-card gold-border-hover p-6 cursor-pointer h-full"
                    onClick={() => navigate(`/academy/course/${course.id}`)}>
                    <div className="flex items-start gap-4 mb-5">
                      <div className="text-3xl">{course.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-sans text-[9px] tracking-[0.25em] uppercase text-gold-600 mb-1">{course.level}</div>
                        <h3 className="font-serif text-lg font-medium text-pearl leading-snug">{course.title}</h3>
                        <p className="font-sans text-xs text-silver-500 mt-1">{completed} of {total} lessons</p>
                      </div>
                      <div className="stat-number text-xl flex-shrink-0">{percent}%</div>
                    </div>
                    <div className="progress-bar mb-4">
                      <motion.div className="progress-fill" initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }} />
                    </div>
                    {nextLesson && (
                      <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                        <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                          <Play size={10} className="text-charcoal-900 ml-0.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-sans text-[10px] text-silver-600 uppercase tracking-widest">Next Up</div>
                          <div className="font-sans text-xs text-silver-300 truncate">{nextLesson.lesson.title}</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        )}
      </div>

      {/* ── AI Course Recommendations ── */}
      {recommendedCourses.length > 0 && (
        <FadeIn className="mb-8">
          <div className="glass-card p-6" style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-gold-500" />
              <span className="section-label text-[9px]">AI Recommendations for {dogName}</span>
            </div>
            <h3 className="font-serif text-lg text-pearl mb-4">Suggested Programmes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedCourses.map(c => (
                <motion.div key={c.id} whileHover={{ borderColor: 'rgba(201,168,76,0.35)' }}
                  className="flex items-center gap-4 p-4 border border-white/6 transition-all cursor-pointer"
                  onClick={() => navigate(`/academy/course/${c.id}`)}>
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-sans text-[9px] text-gold-600 tracking-widest uppercase mb-0.5">{c.level}</div>
                    <div className="font-sans text-sm text-pearl truncate">{c.title}</div>
                    <div className="font-sans text-xs text-silver-600">{c.duration}</div>
                  </div>
                  <ArrowRight size={13} className="text-silver-700 flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── Enrichment plan ── */}
      {aiRecommendations?.enrichment?.length > 0 && (
        <FadeIn className="mb-8">
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Brain size={14} className="text-gold-500" />
              <span className="section-label text-[9px]">Today's Enrichment Plan</span>
            </div>
            <h3 className="font-serif text-lg text-pearl mb-4">{dogName}'s Daily Activities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(aiRecommendations.enrichment || []).slice(0, 6).map(activity => (
                <div key={activity.name} className="glass-card p-4" style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{activity.icon}</span>
                    <div>
                      <div className="font-sans text-xs font-medium text-pearl">{activity.name}</div>
                      <div className="font-sans text-[9px] text-gold-600">{activity.frequency}</div>
                    </div>
                  </div>
                  <p className="font-sans text-[10px] font-light text-silver-500 leading-relaxed">{activity.desc}</p>
                  <div className="font-sans text-[9px] text-silver-700 mt-2">{activity.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── Add-ons owned ── */}
      {myAddons.length > 0 && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">My Add-Ons</div>
          <h2 className="luxury-heading text-2xl mb-4">Premium Supplements</h2>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myAddons.map(addon => (
              <StaggerItem key={addon.id}>
                <div className="glass-card gold-border-hover p-5">
                  <div className="text-2xl mb-3">{addon.icon}</div>
                  <div className="font-sans text-[9px] tracking-widest uppercase text-gold-600 mb-1">Add-On</div>
                  <h4 className="font-serif text-base font-medium text-pearl mb-1">{addon.title}</h4>
                  <p className="font-sans text-xs text-silver-500">{addon.duration} · {addon.lessons} lessons</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </FadeIn>
      )}

      {/* ── Explore add-ons CTA ── */}
      <FadeIn>
        <div className="glass-card p-8 relative overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 100% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="section-label mb-2">Premium Add-Ons</div>
              <h3 className="luxury-heading text-2xl">Enhance {dogName}'s Programme</h3>
              <p className="font-sans text-sm font-light text-silver-500 mt-1 max-w-sm">Six specialist supplements — AI-matched to your dog's profile.</p>
            </div>
            <button onClick={() => navigate('/academy/addons')} className="btn-gold text-xs">
              Explore Add-Ons
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
