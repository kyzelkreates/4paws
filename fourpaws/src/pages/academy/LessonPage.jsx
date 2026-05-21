import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle, Play, Download, Clock, BookOpen } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getCourseById } from '../../data/courses'
import { FadeIn } from '../../components/animations/FadeIn'

export default function LessonPage() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { state, completeLesson, notify } = useApp()
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [completed, setCompleted] = useState(false)

  const course = getCourseById(courseId)
  const progress = state.courseProgress[courseId] || { completedLessons: [] }

  if (!course) return <div className="p-10 text-silver-500 text-center">Course not found.</div>

  // Find lesson and surrounding context
  const allLessons = course.modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleTitle: m.title, moduleId: m.id })))
  const currentIndex = allLessons.findIndex(l => l.id === lessonId)
  const lesson = allLessons[currentIndex]
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const isAlreadyDone = progress.completedLessons?.includes(lessonId)

  useEffect(() => {
    setCompleted(isAlreadyDone)
    setVideoPlaying(false)
  }, [lessonId, isAlreadyDone])

  if (!lesson) return <div className="p-10 text-silver-500 text-center">Lesson not found.</div>

  const handleComplete = () => {
    if (!isAlreadyDone) {
      completeLesson(courseId, lessonId)
      notify('Lesson complete! Excellent work.', 'success')
    }
    setCompleted(true)
    if (nextLesson) {
      setTimeout(() => navigate(`/academy/course/${courseId}/lesson/${nextLesson.id}`), 600)
    } else {
      setTimeout(() => navigate(`/academy/course/${courseId}`), 600)
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <FadeIn className="flex items-center gap-2 mb-8 text-xs font-sans text-silver-600">
        <button onClick={() => navigate('/academy')} className="hover:text-pearl transition-colors">Dashboard</button>
        <ChevronRight size={12} />
        <button onClick={() => navigate(`/academy/course/${courseId}`)} className="hover:text-pearl transition-colors truncate max-w-[200px]">
          {course.title}
        </button>
        <ChevronRight size={12} />
        <span className="text-silver-400 truncate">{lesson.title}</span>
      </FadeIn>

      {/* Module label */}
      <FadeIn className="mb-4">
        <div className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold-600">{lesson.moduleTitle}</div>
      </FadeIn>

      {/* Lesson title */}
      <FadeIn className="mb-6">
        <h1 className="luxury-heading text-3xl lg:text-4xl">{lesson.title}</h1>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1 text-silver-500">
            <Clock size={12} />
            <span className="font-sans text-xs">{lesson.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-silver-500">
            <BookOpen size={12} />
            <span className="font-sans text-xs capitalize">{lesson.type}</span>
          </div>
          <div className="font-sans text-xs text-silver-600">Lesson {currentIndex + 1} of {allLessons.length}</div>
          {isAlreadyDone && (
            <div className="flex items-center gap-1 text-gold-500">
              <CheckCircle size={12} />
              <span className="font-sans text-xs">Complete</span>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Progress bar */}
      <FadeIn className="mb-8">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / allLessons.length) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </FadeIn>

      {/* Video player */}
      <FadeIn className="mb-8">
        <div className="glass-card gold-border aspect-video relative overflow-hidden group cursor-pointer"
          onClick={() => setVideoPlaying(!videoPlaying)}>
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.08) 0%, rgba(10,10,10,0.9) 80%)' }}>
            <div className="text-6xl mb-6">{course.icon}</div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold mb-4"
            >
              <Play size={22} className="text-charcoal-900 ml-1" />
            </motion.div>
            <div className="font-sans text-sm font-light text-silver-300 text-center px-8">{lesson.title}</div>
            <div className="font-sans text-xs text-silver-600 mt-2">{lesson.duration} · {lesson.type}</div>
          </div>
          {/* Ambient corner glow */}
          <div className="absolute top-0 right-0 w-40 h-40"
            style={{ background: 'radial-gradient(circle at 100% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-40 h-40"
            style={{ background: 'radial-gradient(circle at 0% 100%, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
        </div>
      </FadeIn>

      {/* Lesson content */}
      <FadeIn className="glass-card p-8 mb-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 className="font-serif text-xl text-pearl mb-4">Lesson Overview</h3>
        <div className="space-y-4 font-sans text-sm font-light text-silver-400 leading-relaxed">
          <p>
            In this lesson, we explore the foundational principles behind <strong className="text-silver-200">{lesson.title}</strong>. 
            Drawing on the latest research in canine cognition and behavioural science, you'll discover practical, 
            science-backed techniques that deliver lasting transformation.
          </p>
          <p>
            By the end of this lesson, you will understand the key psychological mechanisms at work, 
            have a clear action plan for your next training session, and feel confident applying these 
            principles with your own dog.
          </p>
          <p>
            This lesson is part of the <strong className="text-silver-200">{lesson.moduleTitle}</strong> module within 
            the <strong className="text-silver-200">{course.title}</strong> programme. 
            Each lesson builds deliberately on the last — creating a comprehensive, deeply effective transformation arc.
          </p>
        </div>
      </FadeIn>

      {/* Key takeaways */}
      <FadeIn className="glass-card p-8 mb-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 className="font-serif text-xl text-pearl mb-5">Key Takeaways</h3>
        <div className="space-y-3">
          {[
            'Understanding the neurological basis of this behaviour',
            'Practical application techniques for immediate results',
            'Common mistakes to avoid for sustained progress',
            'How to read your dog\'s responses and adjust accordingly',
            'Building this skill into your daily routine seamlessly',
          ].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-gold-gradient flex-shrink-0 flex items-center justify-center mt-0.5">
                <div className="w-1.5 h-1.5 bg-charcoal-900 rounded-full" />
              </div>
              <span className="font-sans text-sm font-light text-silver-300">{t}</span>
            </motion.div>
          ))}
        </div>
      </FadeIn>

      {/* Download */}
      <FadeIn className="mb-8">
        <motion.button
          whileHover={{ borderColor: 'rgba(201,168,76,0.5)' }}
          className="flex items-center gap-3 glass-card p-4 w-full text-left transition-all"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="w-9 h-9 bg-charcoal-800 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
            <Download size={14} className="text-gold-500" />
          </div>
          <div>
            <div className="font-sans text-sm font-medium text-pearl">Lesson Workbook</div>
            <div className="font-sans text-xs text-silver-600">PDF · Downloadable exercises & notes</div>
          </div>
        </motion.button>
      </FadeIn>

      {/* Navigation */}
      <FadeIn className="flex items-center gap-4 flex-wrap">
        {prevLesson && (
          <button
            onClick={() => navigate(`/academy/course/${courseId}/lesson/${prevLesson.id}`)}
            className="btn-outline-gold flex items-center gap-2 text-xs flex-1 sm:flex-none justify-center"
          >
            <ChevronLeft size={14} /> Previous
          </button>
        )}
        <div className="flex-1" />
        <motion.button
          onClick={handleComplete}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`btn-gold flex items-center gap-2 text-xs flex-1 sm:flex-none justify-center ${completed ? 'opacity-80' : ''}`}
        >
          {completed || isAlreadyDone
            ? <><CheckCircle size={14} /> {nextLesson ? 'Next Lesson' : 'Back to Course'}</>
            : <><CheckCircle size={14} /> Mark Complete {nextLesson ? '& Continue' : ''}</>
          }
          {nextLesson && <ChevronRight size={14} />}
        </motion.button>
      </FadeIn>
    </div>
  )
}
