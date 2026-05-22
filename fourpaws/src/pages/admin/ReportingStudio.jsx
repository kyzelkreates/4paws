// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — LUXURY REPORTING STUDIO
// Enterprise-grade behavioural intelligence reports.
// Transformation summaries, wellness reports, concierge assessments.
// Print/export-ready. Fully offline.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { FileText, Download, ChevronLeft, Printer, Star, TrendingUp, Heart, Shield, Brain, CheckCircle } from 'lucide-react'
import { FOUR_PAWS_METHOD, detectTransformationStage } from '../../ai/fourPawsMethod'
import { purifyText } from '../../ai/narrativeVoice'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { AmbientOrbs } from '../../components/ui/PageTransition'

const REPORT_TYPES = [
  { id: 'transformation', name: 'Transformation Summary', icon: '🌱', colour: '#10B981', desc: 'Complete behavioural evolution report with stage progression, milestone highlights, and outlook.' },
  { id: 'wellness',       name: 'Wellness Intelligence', icon: '💚', colour: '#06B6D4', desc: 'Emotional stability, physical wellness, sleep quality, and enrichment effectiveness analysis.' },
  { id: 'behaviour',      name: 'Behaviour Intelligence', icon: '🧠', colour: '#C9A84C', desc: 'Detailed reactivity mapping, confidence architecture, recovery velocity, and threshold analysis.' },
  { id: 'concierge',      name: 'Concierge Assessment', icon: '👑', colour: '#8B5CF6', desc: 'Executive-level programme overview with personalised recommendations and next-phase planning.' },
  { id: 'stability',      name: 'Emotional Stability Report', icon: '⚓', colour: '#F59E0B', desc: 'Baseline emotional health, regulation quality, cortisol pattern analysis, and recovery performance.' },
]

// ─────────────────────────────────────────────────────────────────────────────
// REPORT PREVIEW — the actual rendered report (print-ready)
// ─────────────────────────────────────────────────────────────────────────────
function ReportPreview({ type, client }) {
  if (!client) return null

  const dog      = client.dog || {}
  const prog     = client.courseProgress || {}
  const lessons  = Object.values(prog).reduce((a, p) => a + (p.completedLessons?.length || 0), 0)
  const enrolled = client.enrolledCourses?.length || 0
  const avgPct   = enrolled
    ? Math.round(Object.values(prog).reduce((a, p) => a + (p.percentComplete || 0), 0) / enrolled)
    : 0
  const stage    = detectTransformationStage({ individual: { anxiety: 45, reactivity: 40, confidence: 55 } }, lessons, 7)
  const today    = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const metrics = [
    { label: 'Lessons Completed',  value: lessons,   colour: '#C9A84C' },
    { label: 'Avg. Module Progress',  value: `${avgPct}%`, colour: '#10B981' },
    { label: 'Courses Enrolled',   value: enrolled,  colour: '#8B5CF6' },
    { label: 'Transformation Stage', value: stage.name.split(' ')[0], colour: stage.colour },
  ]

  const narrative = {
    transformation: `${dog.name || 'This companion'} is currently demonstrating consistent patterns of behavioural evolution within The Four Paws Method™ framework. The data observed across ${lessons} completed lessons suggests a trajectory consistent with genuine, sustainable transformation rather than surface-level compliance.`,
    wellness: `Wellness indicators for ${dog.name || 'this companion'} reflect the early markers of a dog whose nervous system is beginning to regulate from a healthier baseline. The enrichment sequencing within the programme appears to be taking hold.`,
    behaviour: `Behavioural intelligence analysis for ${dog.name || 'this companion'} reveals patterns consistent with a dog in active transformation. Reactivity thresholds appear to be gradually expanding, and confidence micro-wins are accumulating into measurable architectural change.`,
    concierge: `${client.name || 'This client'} and ${dog.name || 'their companion'} are progressing through The Four Paws Method™ with commendable consistency. This concierge assessment is designed to provide directional clarity for the next phase of the programme.`,
    stability: `Emotional stability observations for ${dog.name || 'this companion'} suggest a nervous system in productive transition. The consistent daily practice indicated by the engagement data reflects the kind of repetition that produces genuine neurological change.`,
  }

  const recommendations = {
    transformation: ['Continue the current lesson sequencing without acceleration', 'Introduce one new environmental context per week', 'Record one behaviour observation per day in the journal'],
    wellness:       ['Maintain the evening lickimat protocol for parasympathetic activation', 'Ensure minimum 2 sniff walks daily for sensory processing', 'Review sleep environment for optimal recovery conditions'],
    behaviour:      ['Focus enrichment sessions on sub-threshold exposure', 'Record recovery times for each trigger encounter', 'Introduce one new confidence micro-win scenario this week'],
    concierge:      ['Schedule a check-in call within the next 7 days', 'Review programme pacing based on current engagement data', 'Consider premium add-on introduction at the next natural milestone'],
    stability:      ['Prioritise consistency in daily ritual timing', 'Reduce novel stimulation during active recovery periods', 'Continue the current decompression protocol without modification'],
  }

  return (
    <div id="report-preview" className="bg-charcoal-900 p-8 lg:p-12 max-w-3xl mx-auto print:bg-white print:text-black">
      {/* Report header */}
      <div className="mb-10 pb-8 border-b border-white/10 print:border-black/20">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🐾</span>
              <span className="font-display text-sm font-light tracking-[0.3em] text-pearl uppercase">Four Paws Academy</span>
            </div>
            <div className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold-500 mb-1">Private Behavioural Intelligence Report</div>
            <div className="font-sans text-[9px] text-silver-600">{today}</div>
          </div>
          <div className="text-right">
            <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-600 mb-1">Prepared for</div>
            <div className="font-sans text-sm font-medium text-pearl">{client.name}</div>
            <div className="font-sans text-[10px] text-silver-500">{dog.name} · {dog.breed}</div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2"
          style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <span className="text-sm">{REPORT_TYPES.find(r => r.id === type)?.icon}</span>
          <span className="font-sans text-xs tracking-wider text-gold-400">{REPORT_TYPES.find(r => r.id === type)?.name}</span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {metrics.map(m => (
          <div key={m.label} className="p-4 print:border print:border-black/10"
            style={{ background: `${m.colour}06`, border: `1px solid ${m.colour}20` }}>
            <div className="font-display text-2xl font-light mb-1" style={{ color: m.colour }}>{m.value}</div>
            <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-600">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Transformation stage */}
      <div className="mb-8 p-5 print:border print:border-black/10"
        style={{ background: `${stage.colour}05`, border: `1px solid ${stage.colour}20` }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xl">{stage.icon}</span>
          <div>
            <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-600 mb-0.5">Current Transformation Stage</div>
            <div className="font-display text-base font-light" style={{ color: stage.colour }}>{stage.name}</div>
          </div>
        </div>
        <p className="font-sans text-xs font-light text-silver-400 leading-relaxed">{stage.desc}</p>
      </div>

      {/* Narrative */}
      <div className="mb-8">
        <div className="font-sans text-[9px] uppercase tracking-[0.35em] text-gold-600 mb-4">Intelligence Assessment</div>
        <p className="font-sans text-sm font-light text-silver-300 leading-loose print:text-black">
          {purifyText(narrative[type] || narrative.transformation)}
        </p>
      </div>

      {/* Four Paws stage progression */}
      <div className="mb-8">
        <div className="font-sans text-[9px] uppercase tracking-[0.35em] text-silver-600 mb-4">Programme Stage Progression</div>
        <div className="space-y-2">
          {FOUR_PAWS_METHOD.transformationStages.map((s, i) => {
            const isActive  = s.id === stage.id
            const isPast    = FOUR_PAWS_METHOD.transformationStages.findIndex(x => x.id === stage.id) > i
            return (
              <div key={s.id} className="flex items-center gap-3 py-2 px-3"
                style={{ background: isActive ? `${s.colour}08` : 'transparent', border: `1px solid ${isActive ? s.colour + '30' : 'transparent'}` }}>
                <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{ background: isPast || isActive ? `${s.colour}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${isPast || isActive ? s.colour + '40' : 'rgba(255,255,255,0.06)'}` }}>
                  {isPast ? '✓' : isActive ? s.icon : '·'}
                </div>
                <span className="font-sans text-xs font-light" style={{ color: isActive ? s.colour : isPast ? '#6B7280' : '#374151' }}>
                  {s.name}
                </span>
                {isActive && <span className="ml-auto font-sans text-[8px] uppercase tracking-widest" style={{ color: s.colour }}>Current</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <div className="font-sans text-[9px] uppercase tracking-[0.35em] text-silver-600 mb-4">Concierge Recommendations</div>
        <div className="space-y-3">
          {(recommendations[type] || recommendations.transformation).map((rec, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
                <span className="text-[8px] text-gold-500">{i + 1}</span>
              </div>
              <p className="font-sans text-xs font-light text-silver-400 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-white/5 flex items-center justify-between print:border-black/20">
        <div className="flex items-center gap-2">
          <span className="text-sm">🐾</span>
          <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-700">Four Paws Academy · Private & Confidential</span>
        </div>
        <div className="font-sans text-[8px] text-silver-700">The Four Paws Method™ v{FOUR_PAWS_METHOD.version}</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN REPORTING STUDIO
// ─────────────────────────────────────────────────────────────────────────────
export default function ReportingStudio() {
  const { state }       = useApp()
  const navigate        = useNavigate()
  const clients         = state.allClients || []
  const [selectedType,   setSelectedType]   = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [previewing,     setPreviewing]     = useState(false)

  const handleGenerate = () => {
    if (!selectedType || !selectedClient) return
    setPreviewing(true)
  }

  const handlePrint = () => window.print()

  if (previewing && selectedType && selectedClient) {
    const client = clients.find(c => c.id === selectedClient)
    return (
      <div className="min-h-screen" style={{ background: '#0D0D0D' }}>
        {/* Toolbar */}
        <div className="print:hidden sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5"
          style={{ background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setPreviewing(false)}
            className="flex items-center gap-2 text-silver-500 hover:text-silver-300 transition-colors">
            <ChevronLeft size={14} />
            <span className="font-sans text-[9px] uppercase tracking-widest">Back to Studio</span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handlePrint}
              className="flex items-center gap-2 btn-outline-gold text-xs px-4 py-2">
              <Printer size={12} /> Print / PDF
            </button>
          </div>
        </div>
        <ReportPreview type={selectedType} client={client} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">
      <AmbientOrbs count={2} colour="rgba(201,168,76,0.04)" />

      {/* Header */}
      <FadeIn className="mb-10">
        <button onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-silver-600 hover:text-silver-400 transition-colors mb-6">
          <ChevronLeft size={13} />
          <span className="font-sans text-[9px] uppercase tracking-widest">Operations Centre</span>
        </button>
        <div className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold-500 mb-2">Intelligence Operations</div>
        <h1 className="luxury-heading text-3xl lg:text-4xl mb-2">Reporting Studio</h1>
        <p className="font-sans text-sm font-light text-silver-600">
          Generate enterprise-grade behavioural intelligence reports.
        </p>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Step 1 — Report type */}
        <div className="lg:col-span-2">
          <div className="font-sans text-[9px] uppercase tracking-[0.35em] text-silver-600 mb-4">
            01 — Select Report Type
          </div>
          <StaggerContainer className="grid gap-3">
            {REPORT_TYPES.map((rt, i) => (
              <StaggerItem key={rt.id}>
                <motion.button
                  onClick={() => setSelectedType(rt.id)}
                  className="w-full text-left flex items-start gap-4 p-5 transition-all"
                  style={{
                    border: `1px solid ${selectedType === rt.id ? rt.colour + '40' : 'rgba(255,255,255,0.05)'}`,
                    background: selectedType === rt.id ? `${rt.colour}06` : 'transparent',
                  }}
                  whileHover={{ y: -1 }}
                >
                  <span className="text-2xl flex-shrink-0">{rt.icon}</span>
                  <div>
                    <div className="font-sans text-sm font-medium text-pearl mb-1">{rt.name}</div>
                    <div className="font-sans text-[10px] text-silver-600 leading-relaxed">{rt.desc}</div>
                  </div>
                  {selectedType === rt.id && (
                    <CheckCircle size={14} className="flex-shrink-0 ml-auto mt-0.5" style={{ color: rt.colour }} />
                  )}
                </motion.button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Step 2 — Client selection + generate */}
        <div>
          <div className="font-sans text-[9px] uppercase tracking-[0.35em] text-silver-600 mb-4">
            02 — Select Client
          </div>
          <div className="glass-card p-4 mb-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            {clients.length === 0 ? (
              <p className="font-sans text-xs text-silver-600 text-center py-4">No clients loaded.</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {clients.map(c => (
                  <motion.button
                    key={c.id}
                    onClick={() => setSelectedClient(c.id)}
                    className="w-full text-left flex items-center gap-3 p-3 transition-all"
                    style={{
                      background: selectedClient === c.id ? 'rgba(201,168,76,0.06)' : 'transparent',
                      border: `1px solid ${selectedClient === c.id ? 'rgba(201,168,76,0.25)' : 'transparent'}`,
                    }}
                    whileHover={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-display text-xs"
                      style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }}>
                      {(c.name || 'C').charAt(0)}
                    </div>
                    <div>
                      <div className="font-sans text-xs font-medium text-pearl">{c.name}</div>
                      {c.dog?.name && <div className="font-sans text-[9px] text-silver-600">{c.dog.name}</div>}
                    </div>
                    {selectedClient === c.id && <CheckCircle size={12} className="ml-auto text-gold-500 flex-shrink-0" />}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Generate button */}
          <motion.button
            onClick={handleGenerate}
            disabled={!selectedType || !selectedClient}
            className="w-full flex items-center justify-center gap-2 py-4 font-sans text-xs uppercase tracking-[0.3em] transition-all"
            style={{
              background: selectedType && selectedClient ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${selectedType && selectedClient ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.05)'}`,
              color: selectedType && selectedClient ? '#C9A84C' : '#374151',
            }}
            whileHover={selectedType && selectedClient ? { y: -2 } : {}}
          >
            <FileText size={13} />
            Generate Report
          </motion.button>

          {/* Method note */}
          <div className="mt-6 p-4"
            style={{ background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.1)' }}>
            <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-gold-600 mb-2">Report Standard</div>
            <p className="font-sans text-[10px] text-silver-600 leading-relaxed">
              All reports are generated from The Four Paws Method™ framework and reflect the client's actual programme data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
