// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — MULTI-TRAINER ARCHITECTURE
// Role-based trainer profiles. Permissions. Specialist assignments.
// Concierge staff management. Fully offline local persistence.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit3, Trash2, ChevronLeft, Shield, User, CheckCircle, X } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { AmbientOrbs } from '../../components/ui/PageTransition'
import { purifyText } from '../../ai/narrativeVoice'

const STORAGE_KEY = 'fp_trainer_profiles'

const ROLES = [
  { id: 'head_trainer',       label: 'Head Trainer',         colour: '#C9A84C', icon: '👑', perms: ['all'] },
  { id: 'behaviour_specialist', label: 'Behaviour Specialist', colour: '#8B5CF6', icon: '🧠', perms: ['clients', 'notes', 'reports'] },
  { id: 'concierge',          label: 'Concierge Staff',       colour: '#06B6D4', icon: '✨', perms: ['clients', 'messages', 'notes'] },
  { id: 'vet_collaborator',   label: 'Vet Collaborator',      colour: '#10B981', icon: '🩺', perms: ['wellness', 'notes', 'reports'] },
  { id: 'household_coord',    label: 'Household Coordinator', colour: '#F59E0B', icon: '🏠', perms: ['clients', 'messages'] },
  { id: 'assistant',          label: 'Assistant Trainer',     colour: '#6B7280', icon: '📋', perms: ['clients'] },
]

const PERMISSION_LABELS = {
  all:       'Full Access',
  clients:   'Client Profiles',
  notes:     'Staff Notes',
  reports:   'Reporting Studio',
  messages:  'Messaging',
  wellness:  'Wellness Intelligence',
  analytics: 'Analytics',
}

function loadTrainers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

function saveTrainers(trainers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trainers))
}

// ─────────────────────────────────────────────────────────────────────────────
// TRAINER CARD
// ─────────────────────────────────────────────────────────────────────────────
function TrainerCard({ trainer, index, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const role = ROLES.find(r => r.id === trainer.role) || ROLES[5]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="relative overflow-hidden group"
      style={{ border: `1px solid ${role.colour}18` }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${role.colour}30, transparent)` }} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-display text-lg"
              style={{ background: `${role.colour}12`, border: `1px solid ${role.colour}30`, color: role.colour }}>
              {trainer.name?.charAt(0) || '?'}
            </div>
            <div>
              <div className="font-sans text-sm font-medium text-pearl mb-0.5">{trainer.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs">{role.icon}</span>
                <span className="font-sans text-[9px] uppercase tracking-[0.3em]" style={{ color: role.colour }}>
                  {role.label}
                </span>
              </div>
              {trainer.email && (
                <div className="font-sans text-[9px] text-silver-600 mt-0.5">{trainer.email}</div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {confirmDelete ? (
                <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <button onClick={() => onDelete(trainer.id)}
                    className="font-sans text-[9px] text-red-400 uppercase tracking-widest">Remove</button>
                  <button onClick={() => setConfirmDelete(false)}
                    className="font-sans text-[9px] text-silver-600 uppercase tracking-widest">Cancel</button>
                </motion.div>
              ) : (
                <motion.div key="btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(trainer)} className="text-silver-600 hover:text-gold-400 transition-colors"><Edit3 size={13} /></button>
                  <button onClick={() => setConfirmDelete(true)} className="text-silver-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Specialisation */}
        {trainer.specialisation && (
          <p className="font-sans text-[10px] text-silver-500 font-light mt-3 leading-relaxed">{trainer.specialisation}</p>
        )}

        {/* Permissions */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {(role.id === 'head_trainer' ? Object.keys(PERMISSION_LABELS) : role.perms).map(p => (
            <span key={p} className="font-sans text-[7px] uppercase tracking-[0.25em] px-2 py-0.5"
              style={{ background: `${role.colour}08`, border: `1px solid ${role.colour}20`, color: role.colour }}>
              {PERMISSION_LABELS[p] || p}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD / EDIT FORM
// ─────────────────────────────────────────────────────────────────────────────
function TrainerForm({ trainer, onSave, onCancel }) {
  const [name,   setName]   = useState(trainer?.name || '')
  const [email,  setEmail]  = useState(trainer?.email || '')
  const [role,   setRole]   = useState(trainer?.role || 'assistant')
  const [spec,   setSpec]   = useState(trainer?.specialisation || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    onSave({ ...trainer, name: name.trim(), email: email.trim(), role, specialisation: spec.trim() })
    setSaving(false)
  }

  const selectedRole = ROLES.find(r => r.id === role)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card p-6 mb-6"
      style={{ border: '1px solid rgba(201,168,76,0.2)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="font-sans text-[9px] uppercase tracking-[0.35em] text-gold-500">
          {trainer?.id ? 'Edit Profile' : 'New Trainer Profile'}
        </div>
        <button onClick={onCancel} className="text-silver-600 hover:text-silver-400"><X size={14} /></button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-700 block mb-1.5">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="premium-input text-sm" placeholder="Dr. Sarah Whitmore" />
          </div>
          <div>
            <label className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-700 block mb-1.5">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="premium-input text-sm" placeholder="sarah@fourpawsacademy.com" type="email" />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-700 block mb-2">Role</label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {ROLES.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                className="flex items-center gap-2 px-3 py-2.5 text-left transition-all"
                style={{
                  border: `1px solid ${role === r.id ? r.colour + '40' : 'rgba(255,255,255,0.05)'}`,
                  background: role === r.id ? `${r.colour}08` : 'transparent',
                  color: role === r.id ? r.colour : '#6B7280',
                }}>
                <span className="text-xs">{r.icon}</span>
                <span className="font-sans text-[8px] uppercase tracking-wider leading-tight">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Specialisation */}
        <div>
          <label className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-700 block mb-1.5">Specialisation (optional)</label>
          <input value={spec} onChange={e => setSpec(e.target.value)} className="premium-input text-sm"
            placeholder="e.g. Reactive dog rehabilitation, separation anxiety, puppies..." />
        </div>

        {/* Permissions preview */}
        {selectedRole && (
          <div className="p-3" style={{ background: `${selectedRole.colour}05`, border: `1px solid ${selectedRole.colour}15` }}>
            <div className="font-sans text-[7px] uppercase tracking-[0.3em] text-silver-700 mb-2">Permissions</div>
            <div className="flex flex-wrap gap-1.5">
              {(selectedRole.id === 'head_trainer' ? Object.keys(PERMISSION_LABELS) : selectedRole.perms).map(p => (
                <span key={p} className="font-sans text-[7px] uppercase tracking-wider px-2 py-0.5"
                  style={{ background: `${selectedRole.colour}10`, color: selectedRole.colour }}>
                  {PERMISSION_LABELS[p] || p}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onCancel} className="btn-outline-gold text-xs px-5">Cancel</button>
          <motion.button onClick={handleSave} disabled={!name.trim() || saving}
            className="btn-gold text-xs flex items-center gap-2 px-6" whileHover={{ y: -1 }}>
            {saving ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-3 h-3 border border-charcoal-900/30 border-t-charcoal-900 rounded-full" />
            ) : (
              <><CheckCircle size={12} /> Save Profile</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function TrainerProfilesPage() {
  const navigate         = useNavigate()
  const [trainers,   setTrainers]   = useState(loadTrainers)
  const [showForm,   setShowForm]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const handleSave = (trainer) => {
    setTrainers(prev => {
      const list = trainer.id
        ? prev.map(t => t.id === trainer.id ? trainer : t)
        : [...prev, { ...trainer, id: `trainer-${Date.now()}`, createdAt: new Date().toISOString() }]
      saveTrainers(list)
      return list
    })
    setShowForm(false)
    setEditTarget(null)
  }

  const handleEdit = (trainer) => { setEditTarget(trainer); setShowForm(true) }
  const handleDelete = (id) => {
    const updated = trainers.filter(t => t.id !== id)
    saveTrainers(updated)
    setTrainers(updated)
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-4xl mx-auto">
      <AmbientOrbs count={2} colour="rgba(139,92,246,0.03)" />

      <FadeIn className="mb-10">
        <button onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-silver-600 hover:text-silver-400 transition-colors mb-6">
          <ChevronLeft size={13} />
          <span className="font-sans text-[9px] uppercase tracking-widest">Operations Centre</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold-500 mb-2">Intelligence Operations</div>
            <h1 className="luxury-heading text-3xl lg:text-4xl mb-2">Trainer Profiles</h1>
            <p className="font-sans text-sm font-light text-silver-600">Manage staff roles, permissions, and specialisations.</p>
          </div>
          <motion.button
            onClick={() => { setEditTarget(null); setShowForm(true) }}
            className="btn-gold text-xs flex items-center gap-2"
            whileHover={{ y: -2 }}
          >
            <Plus size={13} /> Add Profile
          </motion.button>
        </div>
      </FadeIn>

      <AnimatePresence>
        {showForm && (
          <TrainerForm trainer={editTarget} onSave={handleSave} onCancel={() => { setShowForm(false); setEditTarget(null) }} />
        )}
      </AnimatePresence>

      {/* Role legend */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
        {ROLES.map(r => (
          <div key={r.id} className="p-2 text-center"
            style={{ background: `${r.colour}05`, border: `1px solid ${r.colour}15` }}>
            <div className="text-base mb-1">{r.icon}</div>
            <div className="font-sans text-[7px] uppercase tracking-wider text-silver-700 leading-tight">{r.label}</div>
          </div>
        ))}
      </div>

      {/* Trainer list */}
      <AnimatePresence>
        {trainers.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 glass-card" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-3xl mb-3">👥</div>
            <p className="font-sans text-sm text-silver-600 mb-1">No trainer profiles yet.</p>
            <p className="font-sans text-xs text-silver-700">Add your first profile to get started.</p>
          </motion.div>
        ) : (
          <StaggerContainer className="grid lg:grid-cols-2 gap-4">
            {trainers.map((t, i) => (
              <StaggerItem key={t.id}>
                <TrainerCard trainer={t} index={i} onEdit={handleEdit} onDelete={handleDelete} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </AnimatePresence>
    </div>
  )
}
