import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, FileText, Download } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import { generateWeeklyReport } from '../../ai/digitalTwin'
import { getCurrentPhase } from '../../ai/wellness'
import { loadStreak, loadAIMemory } from '../../ai/aiMemory'
import { loadDigitalTwin } from '../../ai/digitalTwin'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { purifyText } from '../../ai/narrativeVoice'

function StatRow({ label, value, icon, colour = '#C9A84C' }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="font-sans text-xs text-silver-400">{label}</span>
      </div>
      <span className="font-mono text-sm font-medium" style={{ color: colour }}>{value ?? '—'}</span>
    </div>
  )
}

export default function WeeklyReport() {
  const { state }  = useApp()
  const { behaviourScores, dogProfile } = useAI()
  const dog        = dogProfile || state.dogProfile
  const streak     = loadStreak()
  const twin       = loadDigitalTwin()

  const completedLessons = Object.values(state.courseProgress)
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)

  const report = useMemo(() => generateWeeklyReport(
    dog, behaviourScores, state.courseProgress, streak, twin?.moodLog || []
  ), [dog, behaviourScores, state.courseProgress, streak, twin?.moodLog])

  const phase = useMemo(() => getCurrentPhase(completedLessons), [completedLessons])

  if (!dog || !report) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="luxury-heading text-2xl mb-2">Report Not Yet Available</h2>
          <p className="text-silver-500 font-sans text-sm">Complete onboarding and begin your programme to generate weekly intelligence reports.</p>
        </div>
      </div>
    )
  }

  const rating = report.progressRating

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-4xl mx-auto">

      {/* Report header */}
      <FadeIn className="mb-8">
        <div className="relative overflow-hidden p-8"
          style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.02) 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-5"
            style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="section-label mb-1">Intelligence Report</div>
                <h1 className="luxury-heading text-3xl lg:text-4xl">{report.dogName}'s<br /><span className="text-gold-gradient italic">Weekly Summary</span></h1>
                <div className="font-sans text-xs text-silver-500 mt-2">Week of {report.weekStarting}</div>
              </div>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{ background: rating.colour + '15', border: `1px solid ${rating.colour}30`, boxShadow: `0 0 20px ${rating.colour}20` }}>
                  {rating.icon}
                </div>
                <div className="font-sans text-[10px] uppercase tracking-widest" style={{ color: rating.colour }}>{rating.label}</div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Key metrics */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">This Week</div>
        <h2 className="luxury-heading text-2xl mb-4">Key Metrics</h2>
        <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <StatRow label="Lessons Completed (Total)" value={report.completedLessons} icon="📚" colour="#C9A84C" />
          <StatRow label="Training Streak"           value={`${report.streak} days`}  icon="🔥" colour="#F97316" />
          <StatRow label="Longest Streak"            value={`${report.longestStreak} days`} icon="⭐" colour="#F59E0B" />
          <StatRow label="Sessions Logged"           value={report.sessionsThisWeek}  icon="📋" colour="#8B5CF6" />
          {report.avgCalmLevel !== null && (
            <StatRow label="Average Calm Level" value={`${report.avgCalmLevel}/10`} icon="😌" colour="#10B981" />
          )}
          {report.avgStressLevel !== null && (
            <StatRow label="Average Stress Level" value={`${report.avgStressLevel}/10`} icon="😰" colour="#EF4444" />
          )}
        </div>
      </FadeIn>

      {/* Behaviour scores */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Behaviour Scores</div>
        <h2 className="luxury-heading text-2xl mb-4">Current Profile</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Confidence', value: 100 - (report.confidenceScore || 50), colour: '#C9A84C', icon: '🦁' },
            { label: 'Anxiety',    value: report.anxietyScore || 50,            colour: '#EF4444', icon: '😰', invert: true },
            { label: 'Reactivity', value: report.reactivityScore || 50,         colour: '#F59E0B', icon: '⚡', invert: true },
          ].map(s => {
            const display = s.invert ? Math.round(100 - s.value) : s.value
            return (
              <div key={s.label} className="glass-card p-4 text-center" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-mono text-2xl font-light mb-1" style={{ color: s.colour }}>{display}</div>
                <div className="h-0.5 bg-white/5 rounded-full overflow-hidden mx-auto w-full">
                  <motion.div className="h-full" style={{ background: s.colour }}
                    initial={{ width: 0 }} animate={{ width: `${display}%` }} transition={{ duration: 1.2 }} />
                </div>
                <div className="font-sans text-[9px] text-silver-700 uppercase tracking-widest mt-2">{s.label}</div>
              </div>
            )
          })}
        </div>
      </FadeIn>

      {/* Transformation phase */}
      <FadeIn className="mb-8">
        <div className="glass-card p-5 flex items-center gap-4"
          style={{ border: `1px solid ${phase.colour}25` }}>
          <span className="text-2xl">{phase.icon}</span>
          <div>
            <div className="font-sans text-[9px] uppercase tracking-widest mb-0.5" style={{ color: phase.colour }}>Transformation Journey</div>
            <div className="font-serif text-base text-pearl">Phase {phase.phase}: {phase.name}</div>
            <div className="font-sans text-xs text-silver-500">{phase.subtitle}</div>
          </div>
        </div>
      </FadeIn>

      {/* Highlights */}
      {report.highlights?.length > 0 && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">This Week's Highlights</div>
          <h2 className="luxury-heading text-2xl mb-4">Progress Notes</h2>
          <div className="space-y-3">
            {report.highlights.map((h, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-4 border border-white/5 bg-white/1">
                <div className="w-5 h-5 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
                </div>
                <p className="font-sans text-sm text-silver-300 font-light leading-relaxed">{h}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Recommended actions */}
      {report.nextActions?.length > 0 && (
        <FadeIn>
          <div className="section-label mb-1">Concierge Recommendations</div>
          <h2 className="luxury-heading text-2xl mb-4">Next Actions</h2>
          <StaggerContainer className="space-y-3">
            {report.nextActions.map((action, i) => (
              <StaggerItem key={i}>
                <div className="flex items-center gap-3 p-4 glass-card" style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-[10px] text-charcoal-900 bg-gold-gradient">{i + 1}</div>
                  <span className="font-sans text-sm text-silver-300 font-light">{action}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </FadeIn>
      )}
    </div>
  )
}
