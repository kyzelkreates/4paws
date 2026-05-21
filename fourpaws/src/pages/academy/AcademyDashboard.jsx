import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, CheckCircle, Lock, Play, TrendingUp, Award, Package } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { COURSES, ADDONS, getTotalLessons, getProgressPercent } from '../../data/courses'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

export default function AcademyDashboard() {
  const { state } = useApp()
  const navigate = useNavigate()
  const { enrolledCourses, ownedAddons, courseProgress, clientProfile, currentUser } = state

  const client = clientProfile || currentUser
  const myCoursesData = COURSES.filter(c => enrolledCourses.includes(c.id))
  const myAddons = ADDONS.filter(a => ownedAddons.includes(a.id))

  const totalLessons = myCoursesData.reduce((acc, c) => acc + getTotalLessons(c), 0)
  const completedLessons = Object.values(courseProgress).reduce((acc, p) => acc + (p.completedLessons?.length || 0), 0)
  const overallProgress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <FadeIn className="mb-10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="section-label mb-2">{greeting()}</div>
            <h1 className="luxury-heading text-4xl lg:text-5xl">
              {client?.name?.split(' ')[0] || 'Welcome'}
            </h1>
            {client?.dog && (
              <p className="font-sans text-sm font-light text-silver-500 mt-2">
                {client.dog.name} · {client.dog.breed}
              </p>
            )}
          </div>
          <div className="glass-card gold-border p-5 flex items-center gap-4 min-w-[200px]">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-charcoal-900 font-sans font-bold text-sm flex-shrink-0">
              {(client?.name || 'A').charAt(0)}
            </div>
            <div>
              <div className="font-sans text-xs font-medium text-pearl">{client?.name}</div>
              <div className="font-sans text-[10px] text-gold-600 tracking-widest uppercase mt-0.5">Academy Member</div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Stats row */}
      <FadeIn className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BookOpen, label: 'Courses Enrolled', value: myCoursesData.length },
          { icon: CheckCircle, label: 'Lessons Complete', value: completedLessons },
          { icon: TrendingUp, label: 'Overall Progress', value: `${overallProgress}%` },
          { icon: Package, label: 'Add-Ons Owned', value: myAddons.length },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="glass-card gold-border-hover p-5"
          >
            <stat.icon size={16} className="text-gold-500 mb-3" />
            <div className="stat-number text-2xl mb-1">{stat.value}</div>
            <div className="font-sans text-[10px] text-silver-600 tracking-widest uppercase">{stat.label}</div>
          </motion.div>
        ))}
      </FadeIn>

      {/* Courses */}
      <div className="mb-10">
        <FadeIn className="flex items-center justify-between mb-6">
          <div>
            <div className="section-label mb-1">My Programmes</div>
            <h2 className="luxury-heading text-2xl">Continue Your Journey</h2>
          </div>
        </FadeIn>

        {myCoursesData.length === 0 ? (
          <div className="glass-card gold-border p-10 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="font-serif text-xl text-pearl mb-2">No programmes yet</h3>
            <p className="font-sans text-sm text-silver-500">Contact the academy to be enrolled in your first programme.</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myCoursesData.map(course => {
              const progress = courseProgress[course.id] || { completedLessons: [], completedModules: [], percentComplete: 0 }
              const percent = getProgressPercent(course.id, progress.completedLessons)
              const total = getTotalLessons(course)
              const completedCount = course.modules.flatMap(m => m.lessons).filter(l => progress.completedLessons?.includes(l.id)).length

              // Find next lesson
              let nextLesson = null
              for (const mod of course.modules) {
                for (const lesson of mod.lessons) {
                  if (!progress.completedLessons?.includes(lesson.id)) {
                    nextLesson = { lesson, module: mod }
                    break
                  }
                }
                if (nextLesson) break
              }

              return (
                <StaggerItem key={course.id}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="glass-card gold-border-hover p-6 cursor-pointer group h-full"
                    onClick={() => navigate(`/academy/course/${course.id}`)}
                  >
                    <div className="flex items-start gap-4 mb-5">
                      <div className="text-3xl">{course.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-sans text-[9px] tracking-[0.25em] uppercase text-gold-600 mb-1">{course.level}</div>
                        <h3 className="font-serif text-lg font-medium text-pearl leading-snug">{course.title}</h3>
                        <p className="font-sans text-xs text-silver-500 mt-1">{completedCount} of {total} lessons complete</p>
                      </div>
                      <div className="stat-number text-xl flex-shrink-0">{percent}%</div>
                    </div>

                    <div className="progress-bar mb-4">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                      />
                    </div>

                    {nextLesson && (
                      <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                        <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                          <Play size={10} className="text-charcoal-900 ml-0.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-sans text-[10px] text-silver-600 tracking-widest uppercase">Next Up</div>
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

      {/* Add-ons */}
      {myAddons.length > 0 && (
        <div className="mb-10">
          <FadeIn className="flex items-center justify-between mb-6">
            <div>
              <div className="section-label mb-1">My Add-Ons</div>
              <h2 className="luxury-heading text-2xl">Premium Supplements</h2>
            </div>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myAddons.map(addon => (
              <StaggerItem key={addon.id}>
                <div className="glass-card gold-border-hover p-5 h-full">
                  <div className="text-2xl mb-3">{addon.icon}</div>
                  <div className="font-sans text-[9px] tracking-widest uppercase text-gold-600 mb-1">Add-On</div>
                  <h4 className="font-serif text-base font-medium text-pearl mb-1">{addon.title}</h4>
                  <p className="font-sans text-xs text-silver-500">{addon.duration} · {addon.lessons} lessons</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      )}

      {/* Discover add-ons CTA */}
      <FadeIn>
        <div className="glass-card p-8 relative overflow-hidden"
          style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 100% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="section-label mb-2">Premium Add-Ons</div>
              <h3 className="luxury-heading text-2xl">Enhance Your Programme</h3>
              <p className="font-sans text-sm font-light text-silver-500 mt-1 max-w-sm">Six specialist programmes to complement your core journey.</p>
            </div>
            <button
              onClick={() => navigate('/academy/addons')}
              className="btn-gold text-xs"
            >
              Explore Add-Ons
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
