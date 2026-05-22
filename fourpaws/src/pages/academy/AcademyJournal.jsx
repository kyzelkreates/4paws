// ─────────────────────────────────────────────────────────────
// FOUR PAWS — ELITE AI JOURNAL SYSTEM  (V3)
// Luxury journalling with behaviour notes, milestone entries,
// emotional logs, and cinematic archive presentation.
// ─────────────────────────────────────────────────────────────
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, BookOpen, Star, Zap, Heart, Edit3, Check, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAI } from '../../hooks/useAI'
import { loadNotes, saveNote, updateNote, deleteNote } from '../../ai/wellness'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

const NOTE_TYPES = {
  behaviour:     { label: 'Behaviour Note',      icon: '🐾', colour: '#C9A84C'  },
  milestone:     { label: 'Milestone',           icon: '⭐', colour: '#F59E0B'  },
  emotional:     { label: 'Emotional Log',       icon: '💙', colour: '#8B5CF6'  },
  recovery:      { label: 'Recovery Observation',icon: '💧', colour: '#06B6D4'  },
  transformation:{ label: 'Transformation Note', icon: '🌱', colour: '#10B981'  },
  vet:           { label: 'Vet / Professional',  icon: '🏥', colour: '#EF4444'  },
  celebration:   { label: 'Celebration',         icon: '🎉', colour: '#EC4899'  },
}

const TYPE_PROMPTS = {
  behaviour:     "What behaviour did you observe today? What was the trigger, context, and response?",
  milestone:     "Describe this milestone in detail. What happened? How did it feel?",
  emotional:     "How was your dog's emotional state today? What contributed to it?",
  recovery:      "Describe the recovery. How long did it take? What helped most?",
  transformation:"In what way is your dog different from when they started this programme?",
  vet:           "Note any professional advice, observations, or recommendations received.",
  celebration:   "What are you celebrating? Capture this moment in full.",
}

function NoteCard({ note, onEdit, onDelete }) {
  const type    = NOTE_TYPES[note.type] || NOTE_TYPES.behaviour
  const date    = new Date(note.timestamp).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })
  const time    = new Date(note.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <StaggerItem>
      <motion.div whileHover={{ y: -2 }}
        className="glass-card p-5 relative group overflow-hidden"
        style={{ border: `1px solid ${type.colour}18` }}>
        {/* Colour accent strip */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: type.colour }} />

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{type.icon}</span>
            <div>
              <div className="font-sans text-[9px] uppercase tracking-widest" style={{ color: type.colour }}>{type.label}</div>
              <div className="font-sans text-[9px] text-silver-700">{date} · {time}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(note)} className="w-6 h-6 flex items-center justify-center text-silver-600 hover:text-silver-300">
              <Edit3 size={11} />
            </button>
            <button onClick={() => onDelete(note.id)} className="w-6 h-6 flex items-center justify-center text-silver-600 hover:text-red-400">
              <Trash2 size={11} />
            </button>
          </div>
        </div>

        {note.title && (
          <div className="font-serif text-base font-medium text-pearl mb-2">{note.title}</div>
        )}
        <p className="font-sans text-sm font-light text-silver-400 leading-relaxed whitespace-pre-line">{note.content}</p>

        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {note.tags.map(tag => (
              <span key={tag} className="font-sans text-[8px] px-2 py-0.5 border border-white/8 text-silver-600">#{tag}</span>
            ))}
          </div>
        )}
      </motion.div>
    </StaggerItem>
  )
}

function NoteEditor({ initialNote = null, onSave, onCancel }) {
  const [type,    setType]    = useState(initialNote?.type    || 'behaviour')
  const [title,   setTitle]   = useState(initialNote?.title   || '')
  const [content, setContent] = useState(initialNote?.content || '')
  const [tags,    setTags]    = useState(initialNote?.tags?.join(', ') || '')

  const handleSave = () => {
    if (!content.trim()) return
    const note = { type, title: title.trim(), content: content.trim(), tags: tags.split(',').map(t => t.trim()).filter(Boolean) }
    onSave(note, initialNote?.id)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6" style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="section-label">{initialNote ? 'Edit Entry' : 'New Journal Entry'}</div>
        <button onClick={onCancel} className="text-silver-600 hover:text-silver-300"><X size={14} /></button>
      </div>

      {/* Type selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.entries(NOTE_TYPES).map(([id, meta]) => (
          <button key={id} onClick={() => setType(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border font-sans text-[9px] uppercase tracking-wider transition-all ${
              type === id ? 'border-gold-500/40 text-gold-400 bg-gold-500/8' : 'border-white/8 text-silver-600 hover:border-white/16'
            }`}>
            <span>{meta.icon}</span> {meta.label}
          </button>
        ))}
      </div>

      {/* Title */}
      <input value={title} onChange={e => setTitle(e.target.value)}
        placeholder="Entry title (optional)"
        className="luxury-input w-full mb-4 px-0 py-2 border-0 border-b border-white/10 focus:border-gold-500/30 bg-transparent"
      />

      {/* Prompt */}
      <div className="font-sans text-[9px] text-silver-700 italic mb-2">{TYPE_PROMPTS[type]}</div>

      {/* Content */}
      <textarea value={content} onChange={e => setContent(e.target.value)}
        placeholder="Write your observation…"
        rows={5}
        className="w-full bg-white/2 border border-white/8 text-silver-300 text-sm font-sans font-light p-4 resize-none mb-4 placeholder-silver-800 focus:outline-none focus:border-gold-500/30 leading-relaxed"
      />

      {/* Tags */}
      <input value={tags} onChange={e => setTags(e.target.value)}
        placeholder="Tags: threshold, confidence, recall (comma-separated)"
        className="luxury-input w-full mb-5 text-xs"
      />

      <div className="flex items-center justify-end gap-3">
        <button onClick={onCancel} className="font-sans text-xs text-silver-600 hover:text-silver-300">Cancel</button>
        <motion.button onClick={handleSave} disabled={!content.trim()}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="btn-gold flex items-center gap-1.5 px-5 py-2.5 font-sans text-xs disabled:opacity-40">
          <Check size={11} /> Save Entry
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function AcademyJournal() {
  const { state }  = useApp()
  const { dogProfile } = useAI()
  const dog        = dogProfile || state.dogProfile
  const dogName    = dog?.name || 'Academy'

  const [notes,       setNotes]      = useState(() => loadNotes())
  const [composing,   setComposing]  = useState(false)
  const [editNote,    setEditNote]   = useState(null)
  const [filterType,  setFilterType] = useState('all')

  const filteredNotes = useMemo(() =>
    filterType === 'all' ? notes : notes.filter(n => n.type === filterType),
    [notes, filterType]
  )

  const handleSave = (noteData, existingId) => {
    if (existingId) {
      updateNote(existingId, noteData)
    } else {
      saveNote(noteData)
    }
    setNotes(loadNotes())
    setComposing(false)
    setEditNote(null)
  }

  const handleDelete = (id) => {
    deleteNote(id)
    setNotes(loadNotes())
  }

  const handleEdit = (note) => {
    setEditNote(note)
    setComposing(false)
  }

  // Stats
  const statsByType = useMemo(() =>
    notes.reduce((acc, n) => { acc[n.type] = (acc[n.type] || 0) + 1; return acc }, {}),
    [notes]
  )

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-4xl mx-auto">

      {/* Header */}
      <FadeIn className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="section-label mb-1">Private Journal</div>
          <h1 className="luxury-heading text-4xl">{dogName}'s<br /><span className="text-gold-gradient italic">Academy Journal</span></h1>
        </div>
        {!composing && !editNote && (
          <motion.button onClick={() => setComposing(true)}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="btn-gold flex items-center gap-2 px-5 py-3 font-sans text-xs">
            <Plus size={13} /> New Entry
          </motion.button>
        )}
      </FadeIn>

      {/* Stats strip */}
      {notes.length > 0 && (
        <FadeIn className="flex flex-wrap gap-3 mb-6">
          {[
            { icon: '📝', label: 'Total Entries', value: notes.length },
            { icon: '⭐', label: 'Milestones',    value: statsByType.milestone || 0 },
            { icon: '🌱', label: 'Transformations',value: statsByType.transformation || 0 },
            { icon: '💙', label: 'Emotional Logs', value: statsByType.emotional || 0 },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 glass-card px-4 py-2.5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-sm">{s.icon}</span>
              <span className="font-mono text-sm text-gold-400">{s.value}</span>
              <span className="font-sans text-[9px] text-silver-600">{s.label}</span>
            </div>
          ))}
        </FadeIn>
      )}

      {/* Compose / Edit */}
      <AnimatePresence>
        {(composing || editNote) && (
          <FadeIn className="mb-8">
            <NoteEditor
              initialNote={editNote}
              onSave={handleSave}
              onCancel={() => { setComposing(false); setEditNote(null) }}
            />
          </FadeIn>
        )}
      </AnimatePresence>

      {/* Filter bar */}
      {notes.length > 0 && (
        <FadeIn className="flex flex-wrap gap-2 mb-5">
          <button onClick={() => setFilterType('all')}
            className={`font-sans text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-all ${filterType === 'all' ? 'border-gold-500/40 text-gold-400 bg-gold-500/8' : 'border-white/6 text-silver-600 hover:border-white/14'}`}>
            All ({notes.length})
          </button>
          {Object.entries(statsByType).map(([type, count]) => {
            const meta = NOTE_TYPES[type]
            if (!meta) return null
            return (
              <button key={type} onClick={() => setFilterType(type)}
                className={`flex items-center gap-1 font-sans text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-all ${filterType === type ? 'border-gold-500/40 text-gold-400 bg-gold-500/8' : 'border-white/6 text-silver-600 hover:border-white/14'}`}>
                <span>{meta.icon}</span> {meta.label} ({count})
              </button>
            )
          })}
        </FadeIn>
      )}

      {/* Notes list */}
      {filteredNotes.length > 0 ? (
        <StaggerContainer className="space-y-4">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </StaggerContainer>
      ) : (
        <FadeIn>
          <div className="glass-card p-12 text-center" style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="text-5xl mb-4">📖</div>
            <h3 className="luxury-heading text-2xl mb-2">Your Journal Awaits</h3>
            <p className="font-sans text-sm text-silver-500 mb-6 max-w-sm mx-auto">
              Every observation you record becomes part of {dogName}'s permanent academy record and contributes to the AI intelligence engine.
            </p>
            <motion.button onClick={() => setComposing(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="btn-gold inline-flex items-center gap-2 px-6 py-3 font-sans text-xs">
              <Plus size={12} /> Write First Entry
            </motion.button>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
