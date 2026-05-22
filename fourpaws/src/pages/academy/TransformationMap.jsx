// ─────────────────────────────────────────────────────────────
// FOUR PAWS — LUXURY TRANSFORMATION MAP  (V3)
// Cinematic world-style transformation journey visualisation.
// ─────────────────────────────────────────────────────────────
import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Lock, ChevronRight, MapPin, Trophy } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import { buildTransformationMap, generateWeeklyPlan } from '../../ai/trainingStrategist'
import { TRANSFORMATION_PHASES, getCurrentPhase, getNextPhase } from '../../ai/wellness'
import { loadStreak, loadAIMemory } from '../../ai/aiMemory'
import { computeEarnedAchievements } from '../../ai/achievements'
import { computeIntelligenceScores, getClientTier } from '../../ai/archetypes'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { purifyText } from '../../ai/narrativeVoice'

function MapNode({ node, isActive, isCurrent, onClick }) {
  const colour = node.achieved ? '#C9A84C' : '#2A2A2A'
  const glow   = isCurrent ? '0 0 20px rgba(201,168,76,0.5)' : node.achieved ? '0 0 8px rgba(201,168,76,0.2)' : 'none'

  return (
    <motion.button
      onClick={() => node.achieved && onClick(node)}
      whileHover={node.achieved ? { scale: 1.15 } : {}}
      style={{ position: 'absolute', left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%,-50%)' }}
      className="z-10">
      <div className="flex flex-col items-center gap-1.5">
        <motion.div
          animate={isCurrent ? { boxShadow: ['0 0 15px rgba(201,168,76,0.4)', '0 0 30px rgba(201,168,76,0.7)', '0 0 15px rgba(201,168,76,0.4)'] } : {}}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="w-10 h-10 rounded-full flex items-center justify-center relative"
          style={{ background: node.achieved ? 'linear-gradient(135deg, #C9A84C 0%, #F5E09A 100%)' : 'rgba(30,30,30,0.9)', border: `1.5px solid ${node.achieved ? '#C9A84C' : '#2A2A2A'}`, boxShadow: glow }}>
          {isCurrent && (
            <motion.div className="absolute inset-0 rounded-full border-2 border-gold-400"
              animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }} />
          )}
          {node.achieved
            ? <span className="text-base">{node.icon}</span>
            : <Lock size={12} className="text-silver-700" />
          }
        </motion.div>
        <span className={`font-sans text-[8px] tracking-wider text-center max-w-[60px] leading-tight ${node.achieved ? 'text-gold-400' : 'text-silver-800'}`}>
          {node.label}
        </span>
      </div>
    </motion.button>
  )
}

function PathLine({ from, to, achieved }) {
  const midX   = (from.x + to.x) / 2
  const curveY = Math.min(from.y, to.y) - 8

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      <defs>
        <linearGradient id={`path-${from.id}-${to.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={achieved ? '#C9A84C' : '#1A1A1A'} stopOpacity="0.8" />
          <stop offset="100%" stopColor={achieved ? '#F5E09A' : '#1A1A1A'} stopOpacity={achieved ? '0.4' : '0.2'} />
        </linearGradient>
      </defs>
      <motion.path
        d={`M ${from.x}% ${from.y}% Q ${midX}% ${curveY}% ${to.x}% ${to.y}%`}
        fill="none"
        stroke={`url(#path-${from.id}-${to.id})`}
        strokeWidth={achieved ? '1.5' : '1'}
        strokeDasharray={achieved ? 'none' : '4 4'}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export default function TransformationMap() {
  const { state }  = useApp()
  const { behaviourScores, dogProfile } = useAI()
  const dog        = dogProfile || state.dogProfile
  const client     = state.clientProfile || state.currentUser
  const memory     = loadAIMemory()
  const streak     = loadStreak()

  const completedLessons = useMemo(() =>
    Object.values(state.courseProgress).reduce((a, p) => a + (p.completedLessons?.length || 0), 0),
    [state.courseProgress]
  )

  const intScores = useMemo(() => computeIntelligenceScores(behaviourScores, completedLessons, streak), [behaviourScores, completedLessons, streak])
  const tier      = useMemo(() => getClientTier(completedLessons), [completedLessons])
  const phase     = useMemo(() => getCurrentPhase(completedLessons), [completedLessons])
  const nextPhase = useMemo(() => getNextPhase(completedLessons), [completedLessons])

  const achievements = useMemo(() => computeEarnedAchievements({
    completedLessons, streak: streak.current || 0, completedCourses: 0,
    confidenceScore: intScores?.confidence || 0, anxietyScore: behaviourScores?.individual?.anxiety || 0,
    stabilityScore: intScores?.stability || 0, socialScore: intScores?.social || 0,
  }), [completedLessons, streak, intScores, behaviourScores])

  const mapData   = useMemo(() => buildTransformationMap(dog, behaviourScores, completedLessons, memory.progressMilestones || [], achievements), [dog, behaviourScores, completedLessons])

  const weekPlan  = useMemo(() => generateWeeklyPlan(dog, behaviourScores, state.enrolledCourses || [], completedLessons, streak), [dog, behaviourScores, state.enrolledCourses, completedLessons, streak])

  const [selectedNode, setSelectedNode] = useState(null)

  if (!dog || !mapData) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <h2 className="luxury-heading text-2xl mb-2">Map Not Yet Charted</h2>
          <p className="text-silver-500 font-sans text-sm">Complete onboarding to generate {dog?.name || 'your companion'}'s transformation map.</p>
        </div>
      </div>
    )
  }

  const { nodes, currentNode } = mapData

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-6xl mx-auto">

      {/* Header */}
      <FadeIn className="mb-8">
        <div className="section-label mb-1">Journey Visualisation</div>
        <h1 className="luxury-heading text-4xl">{dog.name}'s<br /><span className="text-gold-gradient italic">Transformation Map</span></h1>
      </FadeIn>

      {/* Phase banner */}
      <FadeIn className="mb-6">
        <div className="glass-card p-5 flex items-center gap-4" style={{ border: `1px solid ${phase.colour}30`, background: phase.colour + '05' }}>
          <span className="text-3xl">{phase.icon}</span>
          <div className="flex-1">
            <div className="font-sans text-[9px] uppercase tracking-widest" style={{ color: phase.colour }}>Current Phase</div>
            <div className="font-serif text-xl text-pearl">{phase.name}</div>
            <div className="font-sans text-xs text-silver-500">{phase.subtitle}</div>
          </div>
          <div className="text-right">
            <div className="stat-number text-2xl">{completedLessons}</div>
            <div className="font-sans text-[9px] text-silver-700">lessons</div>
          </div>
        </div>
      </FadeIn>

      {/* Map canvas */}
      <FadeIn className="mb-8">
        <div className="glass-card overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
          <div className="relative" style={{ height: '280px', background: 'linear-gradient(135deg, #0A0A08 0%, #0D100A 50%, #080A0D 100%)' }}>

            {/* Ambient glow at current node position */}
            {currentNode && (
              <motion.div className="absolute pointer-events-none"
                style={{ left: `${currentNode.x}%`, top: `${currentNode.y}%`, transform: 'translate(-50%,-50%)' }}
                animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
                <div className="w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)' }} />
              </motion.div>
            )}

            {/* Terrain dots */}
            {[...Array(40)].map((_, i) => (
              <div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-white/5"
                style={{ left: `${(i * 7.3) % 100}%`, top: `${(i * 13.7) % 100}%` }} />
            ))}

            {/* Path lines */}
            {nodes.slice(0, -1).map((node, i) => (
              <PathLine key={`${node.id}-${nodes[i + 1].id}`}
                from={node} to={nodes[i + 1]} achieved={nodes[i + 1].achieved} />
            ))}

            {/* Nodes */}
            {nodes.map(node => (
              <MapNode key={node.id} node={node}
                isActive={selectedNode?.id === node.id}
                isCurrent={currentNode?.id === node.id}
                onClick={setSelectedNode} />
            ))}
          </div>

          {/* Selected node detail */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="border-t border-white/5 p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedNode.icon}</span>
                  <div>
                    <div className="font-serif text-base text-pearl">{selectedNode.label}</div>
                    <div className="font-sans text-[10px] text-silver-600">Unlocked at {selectedNode.lessons} lessons</div>
                  </div>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-silver-700 hover:text-silver-400 text-xs">×</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-gold-gradient" /><span className="font-sans text-[8px] text-silver-700">Achieved</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 border-b border-dashed border-silver-800" /><span className="font-sans text-[8px] text-silver-700">Ahead</span></div>
          </div>
          {nextPhase && (
            <span className="font-sans text-[9px] text-silver-600">Next phase at {phase.maxLessons + 1} lessons</span>
          )}
        </div>
      </FadeIn>

      {/* Weekly plan */}
      {weekPlan && (
        <FadeIn className="mb-8">
          <div className="section-label mb-1">This Week's Strategy</div>
          <h2 className="luxury-heading text-2xl mb-4">Training Plan</h2>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="font-serif text-sm font-light text-silver-300 italic mb-5">"{weekPlan.coachingSummary}"</p>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
              {weekPlan.days.map((day, i) => (
                <motion.div key={day.day}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="text-center p-3 border transition-colors"
                  style={{ borderColor: day.isRest ? 'rgba(255,255,255,0.04)' : day.priority === 'high' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)', background: day.isRest ? 'rgba(255,255,255,0.01)' : day.priority === 'high' ? 'rgba(201,168,76,0.04)' : 'rgba(255,255,255,0.02)' }}>
                  <div className="font-sans text-[8px] text-silver-600 mb-1">{day.day.slice(0, 3)}</div>
                  <div className="font-sans text-[9px] font-medium mb-1" style={{ color: day.isRest ? '#4A4A4A' : day.priority === 'high' ? '#C9A84C' : '#7A7A7A' }}>
                    {day.isRest ? 'Rest' : day.priority === 'high' ? '⭐' : '·'}
                  </div>
                  <div className="font-sans text-[8px] text-silver-700 leading-tight">{day.type.split(' ')[0]}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-5 space-y-1.5">
              {weekPlan.adaptivePath.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0" />
                  <span className="font-sans text-xs text-silver-400">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Phase journey cards */}
      <FadeIn>
        <div className="section-label mb-1">Journey Phases</div>
        <h2 className="luxury-heading text-2xl mb-5">Transformation Stages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRANSFORMATION_PHASES.map((p, i) => {
            const achieved = completedLessons >= p.minLessons
            const isCurrent = completedLessons >= p.minLessons && completedLessons <= p.maxLessons
            return (
              <motion.div key={p.phase}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card p-5 relative overflow-hidden"
                style={{ border: `1px solid ${isCurrent ? p.colour + '40' : achieved ? p.colour + '20' : 'rgba(255,255,255,0.04)'}`, opacity: achieved ? 1 : 0.45 }}>
                {isCurrent && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-gold-400" style={{ boxShadow: '0 0 6px rgba(201,168,76,0.6)' }} />
                  </div>
                )}
                <span className="text-3xl block mb-3">{p.icon}</span>
                <div className="font-sans text-[8px] uppercase tracking-widest mb-0.5" style={{ color: p.colour }}>Phase {p.phase}</div>
                <div className="font-serif text-base font-medium text-pearl mb-1">{p.name}</div>
                <div className="font-sans text-[10px] text-silver-500">{p.subtitle}</div>
                <div className="font-sans text-[9px] text-silver-700 mt-2">Lessons {p.minLessons}–{p.maxLessons === 999 ? '∞' : p.maxLessons}</div>
              </motion.div>
            )
          })}
        </div>
      </FadeIn>
    </div>
  )
}
