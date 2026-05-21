import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, ChevronRight, CheckCircle, Clock, UserX } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { COURSES, ADDONS } from '../../data/courses'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

export default function ClientsPage() {
  const { state, dispatch, ACTIONS, notify } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', dogName: '', dogBreed: '' })

  const clients = state.allClients || []
  const filtered = clients.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.dog?.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleAdd = () => {
    if (!newClient.name || !newClient.email) return
    const client = {
      id: `client-${Date.now()}`,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      dog: { name: newClient.dogName, breed: newClient.dogBreed, age: 'Unknown' },
      joinedDate: new Date().toISOString().split('T')[0],
      enrolledCourses: [],
      ownedAddons: [],
      courseProgress: {},
      status: 'active',
      lastActive: new Date().toISOString().split('T')[0],
      totalMessages: 0,
      unreadMessages: 0,
      pwaInstalled: false,
      role: 'client',
      password: 'demo123',
    }
    dispatch({ type: ACTIONS.ADD_CLIENT, payload: client })
    notify(`${newClient.name} added to the academy.`, 'success')
    setShowAddModal(false)
    setNewClient({ name: '', email: '', phone: '', dogName: '', dogBreed: '' })
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-6xl mx-auto">
      <FadeIn className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="section-label mb-2">Academy Members</div>
          <h1 className="luxury-heading text-4xl">Client Management</h1>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-gold flex items-center gap-2 text-xs">
          <Plus size={14} /> Add Client
        </button>
      </FadeIn>

      {/* Filters */}
      <FadeIn className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients or dogs..."
            className="w-full bg-charcoal-800 border border-white/8 text-sm font-sans font-light text-pearl placeholder-silver-700 pl-9 pr-4 py-3 outline-none focus:border-gold-500/30 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`font-sans text-xs tracking-widest uppercase px-4 py-2.5 transition-all border ${
                filterStatus === s
                  ? 'border-gold-500/50 text-gold-400 bg-gold-500/5'
                  : 'border-white/8 text-silver-600 hover:border-white/20 hover:text-silver-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Client table */}
      <FadeIn>
        <div className="glass-card overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/5">
            {['Client', 'Dog', 'Progress', 'Status', ''].map(h => (
              <div key={h} className="font-sans text-[9px] tracking-widest uppercase text-silver-600">{h}</div>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-silver-600 font-sans text-sm">No clients found.</div>
          ) : (
            filtered.map((client, i) => {
              const progresses = Object.values(client.courseProgress || {}).map(p => p.percentComplete || 0)
              const avg = progresses.length ? Math.round(progresses.reduce((a, b) => a + b, 0) / progresses.length) : 0

              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                  className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-white/5 last:border-0 cursor-pointer"
                  onClick={() => navigate(`/admin/clients/${client.id}`)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-charcoal-900 font-sans font-bold text-xs flex-shrink-0">
                      {client.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-sans text-sm font-medium text-pearl truncate">{client.name}</div>
                      <div className="font-sans text-xs text-silver-600 truncate">{client.email}</div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-sans text-sm text-silver-300 truncate">{client.dog?.name || '—'}</div>
                    <div className="font-sans text-xs text-silver-600 truncate">{client.dog?.breed}</div>
                  </div>
                  <div className="text-right">
                    <div className="stat-number text-base">{avg}%</div>
                    <div className="font-sans text-[10px] text-silver-700">{client.enrolledCourses.length} courses</div>
                  </div>
                  <div>
                    <span className={`font-sans text-[10px] tracking-widest uppercase px-2 py-1 
                      ${client.status === 'active' ? 'text-emerald-400 bg-emerald-400/10' : 'text-silver-600 bg-white/5'}`}>
                      {client.status}
                    </span>
                  </div>
                  <div>
                    <ChevronRight size={14} className="text-silver-700" />
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </FadeIn>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card gold-border w-full max-w-md p-8"
          >
            <h2 className="luxury-heading text-2xl mb-6">Add New Client</h2>
            <div className="space-y-5">
              {[
                { label: 'Full Name', key: 'name', placeholder: 'Victoria Hartley' },
                { label: 'Email Address', key: 'email', placeholder: 'email@example.com' },
                { label: 'Phone Number', key: 'phone', placeholder: '+44 7700 900000' },
                { label: "Dog's Name", key: 'dogName', placeholder: 'Caspian' },
                { label: "Dog's Breed", key: 'dogBreed', placeholder: 'Golden Retriever' },
              ].map(f => (
                <div key={f.key}>
                  <label className="section-label text-[10px] block mb-1">{f.label}</label>
                  <input
                    value={newClient[f.key]}
                    onChange={e => setNewClient(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="premium-input"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowAddModal(false)} className="btn-outline-gold flex-1 text-xs">Cancel</button>
              <button onClick={handleAdd} className="btn-gold flex-1 text-xs">Add Client</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
