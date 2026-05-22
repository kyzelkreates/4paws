import React, { useMemo, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Brain, Activity, TrendingUp, Shield, RefreshCw } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import { buildDigitalTwin, generateTransformationForecast, loadDigitalTwin } from '../../ai/digitalTwin'
import { getCurrentPhase, getNextPhase } from '../../ai/wellness'
import { loadStreak } from '../../ai/aiMemory'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { purifyText } from '../../ai/narrativeVoice'

const LEVEL_COLOUR = { high: '#EF4444', moderate: '#F59E0B', low: '#10B981', minimal: '#6B7280' }
const LEVEL_PCT    = { high: 80, moderate: 50, low: 25, minimal: 10 }

function TwinMetric({ label, value, icon, colour }) {
  const pct = LEVEL_PCT[value] ?? (typeof value === 'number' ? value : 50)
  const col = LEVEL_COLOUR[value] ?? colour ?? '#C9A84C'
  return (
    <div className="flex items-center gap-3">
      <span className="text-base flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-sans text-xs text-silver-400">{label}</span>
          <span className="font-sans text-[10px] capitalize font-medium" style={{ color: col }}>
            {typeof value === 'string' ? value : value + '%'}
          </span>
        </div>
        <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full"
            style={{ background: col }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }} />
        </div>
      </div>
    </div>
  )
}

function TriggerBar({ label, probability, icon }) {
  const pct   = Math.round(probability * 100)
  const color = pct > 65 ? '#EF4444' : pct > 40 ? '#F59E0B' : '#10B981'
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-sans text-xs text-silver-500">{label}</span>
          <span className="font-mono text-[10px]" style={{ color }}>{pct}%</span>
        </div>
        <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div style={{ background: color, width: `${pct}%` }} className="h-full"
            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} />
        </div>
      </div>
    </div>
  )
}

function PhaseProgressCard({ completedLessons }) {
  const phase     = getCurrentPhase(completedLessons)
  const nextPhase = getNextPhase(completedLessons)
  const progress  = nextPhase
    ? Math.round(((completedLessons - phase.minLessons) / (phase.maxLessons - phase.minLessons)) * 100)
    : 100

  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${phase.colour}25` }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-2xl"
          style={{ background: phase.colour + '15', border: `1px solid ${phase.colour}30` }}>
          {phase.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-sans text-[9px] uppercase tracking-widest mb-0.5" style={{ color: phase.colour }}>
            Phase {phase.phase} · Transformation Journey
          </div>
          <div className="font-serif text-xl font-medium text-pearl">{phase.name}</div>
          <div className="font-sans text-xs text-silver-500 mt-0.5">{phase.subtitle}</div>
        </div>
      </div>

      <p className="font-sans text-xs font-light text-silver-400 leading-relaxed mt-4 mb-4">{phase.description}</p>

      {nextPhase && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-[9px] text-silver-600 uppercase tracking-widest">Progress to Phase {nextPhase.phase}</span>
            <span className="font-mono text-[10px] text-silver-500">{completedLessons}/{phase.maxLessons} lessons</span>
          </div>
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${phase.colour}, ${nextPhase.colour})` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.4, ease: 'easeOut' }} />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {phase.milestones.map(m => (
          <span key={m} className="font-sans text-[9px] px-2 py-1 border border-white/8 text-silver-600">{m}</span>
        ))}
      </div>
    </div>
  )
}

export default function DigitalTwin() {
  const { state }  = useApp()
  const { behaviourScores, dogProfile } = useAI()
  const [twin, setTwin] = useState(null)
  const [rebuilding, setRebuilding] = useState(false)
  const streak     = loadStreak()

  const dog        = dogProfile || state.dogProfile
  const dogName    = dog?.name  || 'Your Companion'

  const completedLessons = Object.values(state.courseProgress)
    .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)

  const forecast = useMemo(() =>
    generateTransformationForecast(dog, behaviourScores, completedLessons, streak),
    [dog, behaviourScores, completedLessons, streak]
  )

  useEffect(() => {
    if (dog && behaviourScores) {
      const t = buildDigitalTwin(dog, behaviourScores, completedLessons, streak)
      setTwin(t)
    } else {
      setTwin(loadDigitalTwin())
    }
  }, [dog, behaviourScores, completedLessons])

  const handleRebuild = async () => {
    setRebuilding(true)
    await new Promise(r => setTimeout(r, 1400))
    const t = buildDigitalTwin(dog, behaviourScores, completedLessons, streak)
    setTwin(t)
    setRebuilding(false)
  }

  if (!dog) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="luxury-heading text-2xl mb-2">Digital Twin Not Initialised</h2>
          <p className="text-silver-500 font-sans text-sm">Complete onboarding to generate {dogName}'s digital twin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">

      {/* Header */}
      <FadeIn className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="section-label mb-1">AI Behaviour Model</div>
          <h1 className="luxury-heading text-4xl">{dogName}'s<br /><span className="text-gold-gradient italic">Digital Twin</span></h1>
        </div>
        <motion.button onClick={handleRebuild} disabled={rebuilding} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 font-sans text-xs px-4 py-2 border border-gold-500/20 text-gold-500 hover:border-gold-500/40 transition-all disabled:opacity-50">
          <RefreshCw size={12} className={rebuilding ? 'animate-spin' : ''} />
          {rebuilding ? 'Modelling…' : 'Refresh Model'}
        </motion.button>
      </FadeIn>

      {/* Predictive summary */}
      {twin?.predictiveSummary && (
        <FadeIn className="mb-8">
          <div className="glass-card p-6 flex items-start gap-4"
            style={{ border: '1px solid rgba(201,168,76,0.15)', background: 'rgba(201,168,76,0.02)' }}>
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: '0 0 15px rgba(201,168,76,0.3)' }}>
              <Brain size={16} className="text-charcoal-900" />
            </div>
            <div>
              <div className="section-label mb-1">AI Assessment</div>
              <p className="font-serif text-sm font-light text-silver-300 leading-relaxed italic">"{twin.predictiveSummary}"</p>
              {twin.modelledAt && (
                <div className="font-sans text-[9px] text-silver-700 mt-2">
                  Modelled {new Date(twin.modelledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Transformation phase */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Journey</div>
        <h2 className="luxury-heading text-2xl mb-4">Transformation Phase</h2>
        <PhaseProgressCard completedLessons={completedLessons} />
      </FadeIn>

      {/* Main twin data grid */}
      {twin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Behaviour tendencies */}
          <FadeIn>
            <div className="glass-card p-6 h-full" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2 mb-5">
                <Activity size={14} className="text-gold-500" />
                <div className="section-label text-[9px]">Behaviour Tendencies</div>
              </div>
              <div className="space-y-4">
                {twin.behaviourTendencies && Object.entries(twin.behaviourTendencies).map(([key, val]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
                  return <TwinMetric key={key} label={label} value={val} icon="⚙️" />
                })}
              </div>
            </div>
          </FadeIn>

          {/* Energy pattern */}
          <FadeIn delay={0.1}>
            <div className="glass-card p-6 h-full" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2 mb-5">
                <Zap size={14} className="text-amber-400" />
                <div className="section-label text-[9px]">Energy Pattern</div>
              </div>
              <div className="space-y-3">
                {twin.energyPattern && Object.entries(twin.energyPattern).map(([key, val]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
                  const colour = val === 'high' ? '#EF4444' : val === 'moderate' || val === 'active' ? '#F59E0B' : '#10B981'
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="font-sans text-xs text-silver-500">{label}</span>
                      <span className="font-sans text-[10px] capitalize px-2 py-0.5 border"
                        style={{ color: colour, borderColor: colour + '30', background: colour + '10' }}>{val}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeIn>

          {/* Stress sensitivity */}
          <FadeIn delay={0.15}>
            <div className="glass-card p-6 h-full" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2 mb-5">
                <Shield size={14} className="text-red-400" />
                <div className="section-label text-[9px]">Stress Sensitivity</div>
              </div>
              <div className="space-y-3">
                {twin.stressSensitivity && Object.entries(twin.stressSensitivity).map(([key, val]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
                  const colour = val === 'high' || val === 'slow' || val === 'extended' || val === 'elevated' ? '#EF4444'
                    : val === 'moderate' || val === 'cautious' ? '#F59E0B' : '#10B981'
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="font-sans text-xs text-silver-500">{label}</span>
                      <span className="font-sans text-[10px] capitalize px-2 py-0.5 border"
                        style={{ color: colour, borderColor: colour + '30', background: colour + '10' }}>{val}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeIn>

          {/* Confidence trajectory */}
          <FadeIn delay={0.2}>
            <div className="glass-card p-6 h-full" style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp size={14} className="text-gold-500" />
                <div className="section-label text-[9px]">Confidence Trajectory</div>
              </div>
              {twin.confidenceTrajectory && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="stat-number text-2xl">{twin.confidenceTrajectory.currentScore}</div>
                      <div className="font-sans text-[9px] text-silver-700 mt-1">Current Score</div>
                    </div>
                    <div className="text-center">
                      <div className="stat-number text-2xl text-emerald-400">{twin.confidenceTrajectory.projectedScore}</div>
                      <div className="font-sans text-[9px] text-silver-700 mt-1">Projected Score</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-sans text-[9px] text-silver-600">Growth Velocity</span>
                      <span className="font-sans text-[10px] text-gold-400 capitalize">{twin.confidenceTrajectory.growthVelocity}</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-sans text-[9px] text-silver-600 mb-0.5">Stabilisation Target</div>
                    <div className="font-mono text-xs text-silver-400">{twin.confidenceTrajectory.stabilisationDate}</div>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      )}

      {/* Trigger likelihood */}
      {twin?.triggerLikelihood && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">Predictive Analysis</div>
          <h2 className="luxury-heading text-2xl mb-4">Trigger Likelihood Map</h2>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Sound triggers',     twin.triggerLikelihood.sound,          '🔊'],
                ['Stranger approach',  twin.triggerLikelihood.strangers,       '👤'],
                ['Other dogs',         twin.triggerLikelihood.otherDogs,       '🐕'],
                ['Sudden movement',    twin.triggerLikelihood.suddenMovement,  '💨'],
                ['Confinement',        twin.triggerLikelihood.confinement,     '📦'],
                ['Separation',         twin.triggerLikelihood.separation,      '💔'],
              ].map(([label, prob, icon]) => (
                <TriggerBar key={label} label={label} probability={prob} icon={icon} />
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Transformation forecast */}
      {forecast && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">AI Forecasting</div>
          <h2 className="luxury-heading text-2xl mb-4">Transformation Forecast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Trajectory',        value: forecast.trajectoryLabel, icon: '🚀', colour: '#C9A84C' },
              { label: 'To Confidence Goal', value: `~${forecast.weeksToConfidenceGoal}w`, icon: '🦁', colour: '#10B981' },
              { label: 'To Calm Threshold',  value: `~${forecast.weeksToCalm}w`,           icon: '🌿', colour: '#06B6D4' },
              { label: 'Consistency Score',  value: forecast.consistencyScore + '%',        icon: '🔥', colour: '#F59E0B' },
            ].map(s => (
              <div key={s.label} className="glass-card p-5 text-center" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-mono text-xl font-semibold mb-1" style={{ color: s.colour }}>{s.value}</div>
                <div className="font-sans text-[9px] text-silver-700 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="glass-card p-4 mt-4" style={{ border: '1px solid rgba(201,168,76,0.1)' }}>
            <div className="font-sans text-[9px] text-gold-600 uppercase tracking-widest mb-1">AI Recommendation</div>
            <p className="font-sans text-xs text-silver-400 font-light">{forecast.recommendation}</p>
          </div>
        </FadeIn>
      )}

      {/* Enrichment responsiveness */}
      {twin?.enrichmentResponsiveness && (
        <FadeIn>
          <div className="section-label mb-1">Enrichment Intelligence</div>
          <h2 className="luxury-heading text-2xl mb-4">Responsiveness Profile</h2>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(twin.enrichmentResponsiveness).map(([key, val]) => {
                const label  = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
                const colour = val === 'high' || val === 'essential' ? '#10B981' : val === 'moderate' || val === 'beneficial' ? '#C9A84C' : '#6B7280'
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colour }} />
                    <div className="flex-1">
                      <div className="font-sans text-xs text-silver-400">{label}</div>
                      <div className="font-sans text-[10px] capitalize" style={{ color: colour }}>{val}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
