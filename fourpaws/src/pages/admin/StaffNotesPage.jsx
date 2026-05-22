// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — ELITE INTERNAL NOTES SYSTEM
// Private concierge staff notes with timeline. Secure local persistence.
// Behaviour observations, temperament analysis, concierge preferences.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, ChevronLeft, FileText, Tag, Clock, Search } from 'lucide-react'
import { loadStaffNotes, saveStaffNote, deleteStaffNote } from '../../ai/fourPawsMethod'
import { purifyText } from '../../ai/narrativeVoice'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'
import { AmbientOrbs } from '../../components/ui/PageTransition'

const NOTE_CATEGORIES = [
  { id: 'behaviour',   label: 'Behaviour Observation', colour: '#C9A84C', icon: '🐾' },
  { id: 'personality', label: 'Client Personality',    colour: '#8B5CF6', icon: '👤' },
  { id: 'temperament', label: 'Dog Temperament',       colour: '#10B981', icon: '🦮' },
  { id: 'concierge',   label: 'Concierge Preference',  colour: '#06B6D4', icon: '👑' },
  { id: 'recovery',    label: 'Recovery Observation',  colour: '#F59E0B', icon: '💧' },
  { id: 'wellness',    label: 'Wellness Concern',      colour: '#EF4444', icon: '❤️' },
  { id: 'general',     label: 'General Note',          colour: '#6B7280', icon: '📝' },
]

// ─────────────────────────────────────────────────────────────────────────────
// NOTE CARD
// ─────────────────────────────────────────────────────────────────────────────
function NoteCard({ note, index, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const cat    = NOTE_CATEGORIES.find(c => c.id === note.category) || NOTE_CATEGORIES[6]
  const timeAgo = (ts) => {
    if (!ts) return ''
    const diff = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(diff / 3600000)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative p-5 group"
      style={{ border: `1px solid ${cat.colour}18`, background: `${cat.colour}03` }}
    >
      <div className="absolute top-0 left-0 h-full w-0.5" style={{ background: cat.colour }} />

      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">{cat.icon}</span>
          <span className="font-sans text-[8px] uppercase tracking-[0.3em]" style={{ color: cat.colour }}>
            {cat.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-sans text-[9px] text-silver-700 flex items-center gap-1">
            <Clock size={9} /> {timeAgo(note.createdAt)}
          </span>
          <AnimatePresence mode="wait">
            {confirmDelete ? (
              <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <button onClick={() => onDelete(note.id)}
                  className="font-sans text-[9px] text-red-400 hover:text-red-300 uppercase tracking-widest">Delete</button>
                <button onClick={() => setConfirmDelete(false)}
                  className="font-sans text-[9px] text-silver-600 uppercase tracking-widest">Cancel</button>
              </motion.div>
            ) : (
              <motion.button key="trash" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => setConfirmDelete(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-silver-700 hover:text-red-400">
                <Trash2 size={12} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {note.title && (
        <div className="font-sans text-sm font-medium text-pearl mb-2">{note.title}</div>
      )}
      <p className="font-sans text-xs font-light text-silver-400 leading-relaxed">
        {purifyText(note.text)}
      </p>

      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {note.tags.map(tag => (
            <span key={tag} className="font-sans text-[8px] uppercase tracking-wider px-2 py-0.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6B7280' }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD NOTE FORM
// ─────────────────────────────────────────────────────────────────────────────
function AddNoteForm({ clientId, onSaved }) {
  const [title,    setTitle]    = useState('')
  const [text,     setText]     = useState('')
  const [category, setCategory] = useState('general')
  const [tags,     setTags]     = useState('')
  const [saving,   setSaving]   = useState(false)

  const handleSave = async () => {
    if (!text.trim()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    saveStaffNote(clientId, {
      title:    title.trim(),
      text:     text.trim(),
      category,
      tags:     tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    setTitle(''); setText(''); setTags(''); setCategory('general')
    setSaving(false)
    onSaved()
  }

  const cat = NOTE_CATEGORIES.find(c => c.id === category)

  return (
    <div className="glass-card p-6 mb-6" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
      <div className="font-sans text-[9px] uppercase tracking-[0.35em] text-gold-500 mb-5">New Note</div>

      <div className="space-y-4">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title (optional)"
          className="premium-input text-sm"
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter your observation or note..."
          rows={4}
          className="premium-input text-sm resize-none"
        />

        {/* Category */}
        <div>
          <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-700 mb-2">Category</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {NOTE_CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-left transition-all"
                style={{
                  border: `1px solid ${category === c.id ? c.colour + '40' : 'rgba(255,255,255,0.05)'}`,
                  background: category === c.id ? `${c.colour}08` : 'transparent',
                  color: category === c.id ? c.colour : '#6B7280',
                }}
              >
                <span className="text-xs">{c.icon}</span>
                <span className="font-sans text-[8px] uppercase tracking-wider truncate">{c.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-700 mb-2">Tags (comma separated)</div>
          <input
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. reactivity, doorbell, progress"
            className="premium-input text-sm"
          />
        </div>

        <div className="flex justify-end">
          <motion.button
            onClick={handleSave}
            disabled={!text.trim() || saving}
            className="btn-gold text-xs flex items-center gap-2 px-6"
            whileHover={{ y: -1 }}
          >
            {saving ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-3 h-3 border border-charcoal-900/30 border-t-charcoal-900 rounded-full" />
            ) : (
              <><Plus size={12} /> Save Note</>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN STAFF NOTES PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function StaffNotesPage() {
  const { state }         = useApp()
  const navigate          = useNavigate()
  const clients           = state.allClients || []
  const [selectedClient, setSelectedClient] = useState(clients[0]?.id || null)
  const [notes,          setNotes]          = useState([])
  const [search,         setSearch]         = useState('')
  const [filterCat,      setFilterCat]      = useState('all')
  const [version,        setVersion]        = useState(0)

  const client = clients.find(c => c.id === selectedClient)

  useEffect(() => {
    if (selectedClient) setNotes(loadStaffNotes(selectedClient))
  }, [selectedClient, version])

  const filtered = useMemo(() => {
    return notes
      .filter(n => filterCat === 'all' || n.category === filterCat)
      .filter(n => !search || (n.text + n.title).toLowerCase().includes(search.toLowerCase()))
  }, [notes, search, filterCat])

  const handleDelete = (noteId) => {
    deleteStaffNote(selectedClient, noteId)
    setVersion(v => v + 1)
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">
      <AmbientOrbs count={2} colour="rgba(201,168,76,0.03)" />

      <FadeIn className="mb-8">
        <button onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-silver-600 hover:text-silver-400 transition-colors mb-6">
          <ChevronLeft size={13} />
          <span className="font-sans text-[9px] uppercase tracking-widest">Operations Centre</span>
        </button>
        <div className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold-500 mb-2">Intelligence Operations</div>
        <h1 className="luxury-heading text-3xl lg:text-4xl mb-2">Concierge Notes</h1>
        <p className="font-sans text-sm font-light text-silver-600">Private staff observations. Secure local persistence.</p>
      </FadeIn>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Client selector */}
        <div>
          <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-silver-700 mb-3">Select Client</div>
          <div className="space-y-1">
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
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-display text-[10px]"
                  style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }}>
                  {(c.name || 'C').charAt(0)}
                </div>
                <div>
                  <div className="font-sans text-xs text-pearl truncate">{c.name?.split(' ')[0]}</div>
                  {c.dog?.name && <div className="font-sans text-[8px] text-silver-600">{c.dog.name}</div>}
                </div>
                {loadStaffNotes(c.id).length > 0 && (
                  <span className="ml-auto font-mono text-[8px] text-gold-600">{loadStaffNotes(c.id).length}</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notes area */}
        <div className="lg:col-span-3">
          {selectedClient ? (
            <>
              {/* Client header */}
              {client && (
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-display"
                    style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }}>
                    {(client.name || 'C').charAt(0)}
                  </div>
                  <div>
                    <div className="font-sans text-sm font-medium text-pearl">{client.name}</div>
                    {client.dog?.name && <div className="font-sans text-[9px] text-silver-500">{client.dog.name} · {client.dog.breed}</div>}
                  </div>
                  <div className="ml-auto font-sans text-[8px] uppercase tracking-widest text-silver-700">
                    {filtered.length} note{filtered.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}

              {/* Add form */}
              <AddNoteForm clientId={selectedClient} onSaved={() => setVersion(v => v + 1)} />

              {/* Filters */}
              {notes.length > 0 && (
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <div className="relative flex-1 min-w-0">
                    <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-700" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search notes..."
                      className="premium-input pl-8 text-xs py-2"
                    />
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {['all', ...NOTE_CATEGORIES.map(c => c.id)].map(cat => {
                      const c = NOTE_CATEGORIES.find(x => x.id === cat)
                      return (
                        <button key={cat} onClick={() => setFilterCat(cat)}
                          className="px-2.5 py-1 font-sans text-[8px] uppercase tracking-wider transition-colors"
                          style={{
                            border: `1px solid ${filterCat === cat ? (c?.colour || '#C9A84C') + '40' : 'rgba(255,255,255,0.06)'}`,
                            color: filterCat === cat ? (c?.colour || '#C9A84C') : '#6B7280',
                          }}>
                          {cat === 'all' ? 'All' : c?.icon}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Notes list */}
              <AnimatePresence>
                <div className="space-y-3">
                  {filtered.map((note, i) => (
                    <NoteCard key={note.id} note={note} index={i} onDelete={handleDelete} />
                  ))}
                  {filtered.length === 0 && notes.length === 0 && (
                    <div className="text-center py-12">
                      <FileText size={24} className="text-silver-800 mx-auto mb-3" />
                      <p className="font-sans text-sm text-silver-600">No notes yet.</p>
                      <p className="font-sans text-xs text-silver-700 mt-1">Add your first concierge observation above.</p>
                    </div>
                  )}
                  {filtered.length === 0 && notes.length > 0 && (
                    <div className="text-center py-8">
                      <p className="font-sans text-xs text-silver-600">No notes match your filter.</p>
                    </div>
                  )}
                </div>
              </AnimatePresence>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="font-sans text-sm text-silver-600">Select a client to view their notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
