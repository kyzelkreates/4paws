import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Play, CheckCircle, Lock, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getCourseById, getTotalLessons } from '../../data/courses'
import { FadeIn } from '../../components/animations/FadeIn'

export default function CourseOverview() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { state } = useApp()
  const [expandedModule, setExpandedModule] = useState(0)

  const course = getCourseById(courseId)
  const progress = state.courseProgress[courseId] || { completedLessons: [], completedModules: [] }

  if (!course) return (
    <div className="p-10 text-center text-silver-500">Course not found.</div>
  )

  const totalLessons = getTotalLessons(course)
  const completedCount = course.modules.flatMap(m => m.lessons).filter(l => progress.completedLessons?.includes(l.id)).length
  const percent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0

  const isLessonLocked = (moduleIndex, lessonIndex) => {
    if (moduleIndex === 0) return false
    const prevModule = course.modules[moduleIndex - 1]
    const prevModuleCompleted = prevModule.lessons.every(l => progress.completedLessons?.includes(l.id))
    return !prevModuleCompleted
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Back */}
      <FadeIn className="mb-8">
        <button onClick={() => navigate('/academy')}
          className="flex items-center gap-2 font-sans text-xs text-silver-500 hover:text-pearl transition-colors tracking-widest uppercase">
          <ChevronLeft size={14} /> Back to Dashboard
        </button>
      </FadeIn>

      {/* Course header */}
      <FadeIn className="glass-card gold-border p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 60% 80% at 100% 50%, ${course.accentColor}10 0%, transparent 70%)` }} />
        <div className="relative z-10">
          <div className="flex items-start gap-5 mb-6">
            <div className="text-5xl">{course.icon}</div>
            <div className="flex-1">
              <div className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold-500 mb-1">{course.level} Programme</div>
              <h1 className="luxury-heading text-3xl lg:text-4xl mb-2">{course.title}</h1>
              <p className="font-sans text-sm font-light text-silver-400">{course.subtitle}</p>
            </div>
          </div>
          <p className="font-sans text-sm font-light text-silver-400 leading-relaxed mb-6">{course.description}</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mb-6">
            {[
              [`${totalLessons}`, 'Lessons'],
              [`${course.modules.length}`, 'Modules'],
              [course.duration, 'Duration'],
              [`${percent}%`, 'Complete'],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="stat-number text-xl">{v}</div>
                <div className="font-sans text-[10px] text-silver-600 tracking-widest uppercase">{l}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
          </div>
          <div className="font-sans text-xs text-silver-600 mt-2">{completedCount} of {totalLessons} lessons complete</div>
        </div>
      </FadeIn>

      {/* Modules */}
      <div className="space-y-3">
        {course.modules.map((mod, mIdx) => {
          const modCompleted = mod.lessons.every(l => progress.completedLessons?.includes(l.id))
          const modLocked = mIdx > 0 && !course.modules[mIdx - 1].lessons.every(l => progress.completedLessons?.includes(l.id))
          const completedInMod = mod.lessons.filter(l => progress.completedLessons?.includes(l.id)).length
          const isOpen = expandedModule === mIdx

          return (
            <FadeIn key={mod.id} delay={mIdx * 0.05}>
              <div className={`glass-card ${modLocked ? 'opacity-50' : 'gold-border-hover'}`}>
                {/* Module header */}
                <button
                  onClick={() => !modLocked && setExpandedModule(isOpen ? -1 : mIdx)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                  disabled={modLocked}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-mono
                    ${modCompleted ? 'bg-gold-gradient text-charcoal-900' : 'bg-charcoal-800 border border-white/10 text-silver-500'}`}>
                    {modCompleted ? <CheckCircle size={14} /> : modLocked ? <Lock size={12} /> : mIdx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-sans text-[9px] tracking-widest uppercase text-silver-600 mb-0.5">Module {mIdx + 1}</div>
                    <div className="font-serif text-base font-medium text-pearl">{mod.title}</div>
                    <div className="font-sans text-xs text-silver-500 mt-0.5">{mod.subtitle}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-sans text-xs text-silver-600">{completedInMod}/{mod.lessons.length}</span>
                    {!modLocked && (isOpen ? <ChevronUp size={14} className="text-silver-500" /> : <ChevronDown size={14} className="text-silver-500" />)}
                  </div>
                </button>

                {/* Lessons */}
                <AnimatePresence>
                  {isOpen && !modLocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5">
                        {mod.lessons.map((lesson, lIdx) => {
                          const isDone = progress.completedLessons?.includes(lesson.id)
                          const isNext = !isDone && mod.lessons.slice(0, lIdx).every(l => progress.completedLessons?.includes(l.id))

                          return (
                            <motion.button
                              key={lesson.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: lIdx * 0.04 }}
                              onClick={() => navigate(`/academy/course/${courseId}/lesson/${lesson.id}`)}
                              className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all duration-200 border-b border-white/5 last:border-0
                                ${isNext ? 'bg-gold-500/5 hover:bg-gold-500/10' : 'hover:bg-white/3'}`}
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                                ${isDone ? 'bg-gold-gradient' : isNext ? 'border border-gold-500/50' : 'border border-white/10'}`}>
                                {isDone
                                  ? <CheckCircle size={12} className="text-charcoal-900" />
                                  : isNext
                                    ? <Play size={10} className="text-gold-400 ml-0.5" />
                                    : <span className="font-mono text-[10px] text-silver-600">{lIdx + 1}</span>
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-sans text-sm ${isDone ? 'text-silver-500 line-through' : isNext ? 'text-pearl font-medium' : 'text-silver-300'}`}>
                                  {lesson.title}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="font-sans text-[10px] text-silver-600 tracking-widest uppercase">{lesson.type}</span>
                                  <span className="text-silver-700">·</span>
                                  <span className="font-sans text-[10px] text-silver-600">{lesson.duration}</span>
                                </div>
                              </div>
                              {isNext && <span className="font-sans text-[9px] tracking-widest uppercase text-gold-500">Up Next</span>}
                            </motion.button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          )
        })}
      </div>
    </div>
  )
}
