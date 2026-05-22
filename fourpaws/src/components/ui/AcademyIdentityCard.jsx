// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — ACADEMY IDENTITY CARD
// Premium membership card showing tier, package, intelligence readouts.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap, Award } from 'lucide-react'
import { useAcademyConfig } from '../../context/AcademyConfigContext'
import { useIntelligenceCore } from '../../hooks/useIntelligenceCore'
import { EMOTIONAL_STATES } from '../../ai/emotionalEngine'

export default function AcademyIdentityCard({ compact = false }) {
  const { tierMeta, packageMeta, can } = useAcademyConfig()
  const { core, emotionalState, streak, intelligence } = useIntelligenceCore()

  const dogName   = core?.dogName    || 'Your Companion'
  const firstName = core?.firstName  || 'Member'
  const colour    = tierMeta?.colour || '#C9A84C'
  const emState   = emotionalState   || EMOTIONAL_STATES.UNCERTAIN

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4"
        style={{ background: `${colour}06`, border: `1px solid ${colour}20` }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `${colour}15`, border: `1px solid ${colour}30` }}>
          <span className="text-sm">{tierMeta?.icon || '⭐'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-sans text-xs font-medium text-pearl truncate">{firstName}</div>
          <div className="font-sans text-[9px] truncate" style={{ color: colour }}>{tierMeta?.name || 'Academy Member'}</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: emState.colour, boxShadow: `0 0 4px ${emState.colour}` }} />
          <span className="font-sans text-[9px]" style={{ color: emState.colour }}>{emState.label}</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #0D0D0A 0%, #121208 50%, #0D0D0A 100%)`,
        border: `1px solid ${colour}30`,
        boxShadow: `0 0 30px ${colour}10`,
      }}
      whileHover={{ borderColor: colour + '50' }}
      transition={{ duration: 0.3 }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 60% at 100% 0%, ${colour}06 0%, transparent 70%)` }} />
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${colour}50, transparent)` }} />

      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l" style={{ borderColor: colour + '40' }} />
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r" style={{ borderColor: colour + '40' }} />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l" style={{ borderColor: colour + '40' }} />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r" style={{ borderColor: colour + '40' }} />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="font-sans text-[8px] uppercase tracking-[0.4em] mb-1" style={{ color: colour }}>
              Four Paws Academy
            </div>
            <div className="font-display text-xl font-light text-pearl">{dogName}</div>
            <div className="font-sans text-xs text-silver-500 mt-0.5">{firstName}'s Academy</div>
          </div>
          <div className="text-3xl">{tierMeta?.icon || '⭐'}</div>
        </div>

        {/* Tier */}
        <div className="flex items-center gap-2 mb-4 p-2"
          style={{ background: `${colour}08`, border: `1px solid ${colour}20` }}>
          <Shield size={11} style={{ color: colour }} />
          <span className="font-sans text-[10px] uppercase tracking-widest font-medium" style={{ color: colour }}>
            {tierMeta?.name || 'Academy Member'}
          </span>
        </div>

        {/* Package */}
        {packageMeta && (
          <div className="mb-4">
            <div className="font-sans text-[8px] text-silver-700 uppercase tracking-widest mb-1">Programme</div>
            <div className="font-serif text-sm text-silver-300">{packageMeta.name}</div>
          </div>
        )}

        {/* Intelligence readouts */}
        {core?.intScores && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Confidence', value: core.intScores.confidence },
              { label: 'Stability',  value: core.intScores.stability  },
              { label: 'Social',     value: core.intScores.social     },
            ].map(m => (
              <div key={m.label} className="text-center">
                <div className="font-display text-lg font-light" style={{ color: colour }}>{m.value}%</div>
                <div className="font-sans text-[8px] text-silver-700 uppercase tracking-wider">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Emotional state */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <motion.div className="w-1.5 h-1.5 rounded-full"
              style={{ background: emState.colour }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }} />
            <span className="font-sans text-[9px]" style={{ color: emState.colour }}>{emState.label}</span>
          </div>
          {streak?.current > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-sm">🔥</span>
              <span className="font-mono text-[10px] text-orange-400">{streak.current}d</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
