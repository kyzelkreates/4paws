// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — FAMILY PARTICIPATION SYSTEM
// Shared routines. Household coordination. Family members & handlers.
// Shared behavioural observations. Fully offline.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Users, MessageSquare, CheckCircle, X, Heart } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useIntelligenceCore } from '../../hooks/useIntelligenceCore'
import {
  loadFamilyData, saveFamilyMember, addFamilyObservation,
} from '../../ai/fourPawsMethod'
import { purifyText } from '../../ai/narrativeVoice'
import { SOUNDS } from '../../ai/intelligenceCore'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { AmbientOrbs } from '../../components/ui/PageTransition'

const MEMBER_ROLES = [
  { id: 'partner',    label: 'Partner / Spouse',  icon: '💑', colour: '#C9A84C' },
  { id: 'child',      label: 'Child',             icon: '👧', colour: '#10B981' },
  { id: 'handler',    label: 'Dog Handler',       icon: '🦮', colour: '#8B5CF6' },
  { id: 'caregiver',  label: 'Caregiver',         icon: '🤝', colour: '#06B6D4' },
  { id: 'other',      label: 'Other',             icon: '👤', colour: '#6B7280' },
]

const OBSERVATION_TAGS = [
  'calm behaviour', 'reactive episode', 'played well', 'anxious', 'confident',
  'toilet incident', 'good meal', 'refused food', 'great walk', 'difficult walk',
]

// ─────────────────────────────────────────────────────────────────────────────
// ADD MEMBER FORM
// ─────────────────────────────────────────────────────────────────────────────
function AddMemberForm({ onSave, onCancel }) {
  const [name,   setName]   = useState('')
  const [role,   setRole]   = useState('partner')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    saveFamilyMember({ name: name.trim(), role, addedAt: new Date().toISOString() })
    setSaving(false)
    onSave()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="glass-card p-5 mb-5"
      style={{ border: '1px solid rgba(201,168,76,0.2)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="font-sans text-[9px] uppercase tracking-[0.35em] text-gold-500">Add Household Member</div>
        <button onClick={onCancel} className="text-silver-600 hover:text-silver-400"><X size={13} /></button>
      </div>
      <div className="space-y-4">
        <input value={name} onChange={e => setName(e.target.value)}
          className="premium-input text-sm" placeholder="Name" />
        <div className="grid grid-cols-3 gap-2">
          {MEMBER_ROLES.map(r => (
            <button key={r.id} onClick={() => setRole(r.id)}
              className="py-2.5 text-center transition-all"
              style={{
                border: `1px solid ${role === r.id ? r.colour + '40' : 'rgba(255,255,255,0.05)'}`,
                background: role === r.id ? `${r.colour}08` : 'transparent',
              }}>
              <div className="text-base mb-0.5">{r.icon}</div>
              <div className="font-sans text-[7px] uppercase tracking-wider" style={{ color: role === r.id ? r.colour : '#6B7280' }}>
                {r.label.split(' ')[0]}
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="btn-outline-gold text-xs px-4">Cancel</button>
          <motion.button onClick={handleSave} disabled={!name.trim() || saving}
            className="btn-gold text-xs flex items-center gap-1.5 px-5" whileHover={{ y: -1 }}>
            {saving ? '...' : <><Plus size={11} /> Add</>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD OBSERVATION FORM
// ─────────────────────────────────────────────────────────────────────────────
function AddObservationForm({ members, dogName, onSave, onCancel }) {
  const [text,       setText]       = useState('')
  const [reporter,   setReporter]   = useState('')
  const [tags,       setTags]       = useState([])
  const [saving,     setSaving]     = useState(false)

  const handleSave = async () => {
    if (!text.trim()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    addFamilyObservation({ text: text.trim(), reporter, tags, dogName })
    setSaving(false)
    onSave()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="glass-card p-5 mb-5"
      style={{ border: '1px solid rgba(16,185,129,0.2)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="font-sans text-[9px] uppercase tracking-[0.35em] text-emerald-500">Shared Observation</div>
        <button onClick={onCancel} className="text-silver-600 hover:text-silver-400"><X size={13} /></button>
      </div>
      <div className="space-y-4">
        {members.length > 0 && (
          <div>
            <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-700 mb-2">Observed by</div>
            <div className="flex flex-wrap gap-2">
              {['Me', ...members.map(m => m.name)].map(name => (
                <button key={name} onClick={() => setReporter(name)}
                  className="px-3 py-1.5 font-sans text-[9px] transition-all"
                  style={{
                    border: `1px solid ${reporter === name ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    color: reporter === name ? '#10B981' : '#6B7280',
                    background: reporter === name ? 'rgba(16,185,129,0.06)' : 'transparent',
                  }}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder={`What did you observe about ${dogName} today?`}
          rows={3} className="premium-input text-sm resize-none w-full" />
        <div>
          <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-700 mb-2">Quick tags</div>
          <div className="flex flex-wrap gap-1.5">
            {OBSERVATION_TAGS.map(tag => (
              <button key={tag} onClick={() => {
                setTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag])
                SOUNDS.tap()
              }}
                className="px-2.5 py-1 font-sans text-[8px] transition-all"
                style={{
                  border: `1px solid ${tags.includes(tag) ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.05)'}`,
                  color: tags.includes(tag) ? '#10B981' : '#6B7280',
                  background: tags.includes(tag) ? 'rgba(16,185,129,0.06)' : 'transparent',
                }}>
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="btn-outline-gold text-xs px-4">Cancel</button>
          <motion.button onClick={handleSave} disabled={!text.trim() || saving}
            className="btn-gold text-xs flex items-center gap-1.5 px-5" whileHover={{ y: -1 }}>
            {saving ? '...' : <><MessageSquare size={11} /> Record</>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function FamilyParticipation() {
  const { state }   = useApp()
  const { profile } = useIntelligenceCore()
  const dogName     = profile?.dogName || state.dogProfile?.name || 'your companion'

  const [data,        setData]        = useState({ members: [], observations: [] })
  const [showAddMem,  setShowAddMem]  = useState(false)
  const [showAddObs,  setShowAddObs]  = useState(false)
  const [activeTab,   setActiveTab]   = useState('household')
  const [version,     setVersion]     = useState(0)

  useEffect(() => { setData(loadFamilyData()) }, [version])

  const timeAgo = (ts) => {
    if (!ts) return ''
    const diff = Date.now() - new Date(ts).getTime()
    const hrs = Math.floor(diff / 3600000)
    if (hrs < 1) return 'Just now'
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }

  return (
    <div className="min-h-screen p-5 lg:p-8 max-w-2xl mx-auto">
      <AmbientOrbs count={2} colour="rgba(16,185,129,0.04)" />

      <FadeIn className="mb-8">
        <div className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold-500 mb-1">Academy</div>
        <h1 className="luxury-heading text-2xl mb-1">Household</h1>
        <p className="font-sans text-xs font-light text-silver-600">
          Family members and shared observations for {dogName}.
        </p>
      </FadeIn>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-6">
        {[
          { id: 'household', label: `Members (${data.members.length})` },
          { id: 'observations', label: `Observations (${data.observations.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="px-4 py-3 font-sans text-[9px] uppercase tracking-[0.3em] transition-colors"
            style={{ color: activeTab === t.id ? '#C9A84C' : '#6B7280', borderBottom: activeTab === t.id ? '1px solid #C9A84C' : '1px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'household' && (
          <motion.div key="household" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-end mb-4">
              <motion.button onClick={() => setShowAddMem(true)}
                className="btn-gold text-xs flex items-center gap-1.5" whileHover={{ y: -1 }}>
                <Plus size={11} /> Add Member
              </motion.button>
            </div>

            <AnimatePresence>
              {showAddMem && (
                <AddMemberForm onSave={() => { setVersion(v => v + 1); setShowAddMem(false) }} onCancel={() => setShowAddMem(false)} />
              )}
            </AnimatePresence>

            {data.members.length === 0 ? (
              <div className="text-center py-12">
                <Users size={24} className="text-silver-800 mx-auto mb-3" />
                <p className="font-sans text-sm text-silver-600">No household members added yet.</p>
                <p className="font-sans text-xs text-silver-700 mt-1">Add family members who interact with {dogName}.</p>
              </div>
            ) : (
              <StaggerContainer className="grid gap-3">
                {data.members.map((m, i) => {
                  const role = MEMBER_ROLES.find(r => r.id === m.role) || MEMBER_ROLES[4]
                  return (
                    <StaggerItem key={m.id}>
                      <div className="flex items-center gap-4 p-4"
                        style={{ border: `1px solid ${role.colour}15`, background: `${role.colour}03` }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: `${role.colour}12`, border: `1px solid ${role.colour}25` }}>
                          {role.icon}
                        </div>
                        <div>
                          <div className="font-sans text-sm font-medium text-pearl">{m.name}</div>
                          <div className="font-sans text-[9px] uppercase tracking-wider" style={{ color: role.colour }}>
                            {role.label}
                          </div>
                        </div>
                        <div className="ml-auto font-sans text-[8px] text-silver-700">
                          Added {timeAgo(m.addedAt)}
                        </div>
                      </div>
                    </StaggerItem>
                  )
                })}
              </StaggerContainer>
            )}
          </motion.div>
        )}

        {activeTab === 'observations' && (
          <motion.div key="observations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-end mb-4">
              <motion.button onClick={() => setShowAddObs(true)}
                className="btn-gold text-xs flex items-center gap-1.5" whileHover={{ y: -1 }}>
                <MessageSquare size={11} /> Add Observation
              </motion.button>
            </div>

            <AnimatePresence>
              {showAddObs && (
                <AddObservationForm
                  members={data.members}
                  dogName={dogName}
                  onSave={() => { setVersion(v => v + 1); setShowAddObs(false) }}
                  onCancel={() => setShowAddObs(false)}
                />
              )}
            </AnimatePresence>

            {data.observations.length === 0 ? (
              <div className="text-center py-12">
                <Heart size={24} className="text-silver-800 mx-auto mb-3" />
                <p className="font-sans text-sm text-silver-600">No shared observations yet.</p>
                <p className="font-sans text-xs text-silver-700 mt-1">Everyone in the household can contribute observations.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.observations.map((obs, i) => (
                  <motion.div key={obs.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-4"
                    style={{ border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {obs.reporter && (
                          <span className="font-sans text-[9px] uppercase tracking-wider text-gold-600">{obs.reporter}</span>
                        )}
                      </div>
                      <span className="font-sans text-[8px] text-silver-700">{timeAgo(obs.timestamp)}</span>
                    </div>
                    <p className="font-sans text-xs font-light text-silver-400 leading-relaxed mb-2">
                      {purifyText(obs.text)}
                    </p>
                    {obs.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {obs.tags.map(tag => (
                          <span key={tag} className="font-sans text-[7px] uppercase tracking-wider px-2 py-0.5"
                            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', color: '#10B981' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
