import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Plus, Trash2, Send, CheckCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { COURSES, ADDONS, getProgressPercent } from '../../data/courses'
import { FadeIn } from '../../components/animations/FadeIn'

export default function ClientDetailPage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch, ACTIONS, notify } = useApp()
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const client = state.allClients.find(c => c.id === clientId)
  if (!client) return <div className="p-10 text-silver-500 text-center">Client not found.</div>

  const clientMessages = (state.messages || []).filter(m => m.clientId === clientId)

  const handleAssignCourse = (courseId) => {
    if (client.enrolledCourses.includes(courseId)) return
    dispatch({
      type: ACTIONS.UPDATE_CLIENT,
      payload: { ...client, enrolledCourses: [...client.enrolledCourses, courseId] }
    })
    notify(`${COURSES.find(c => c.id === courseId)?.title} assigned.`, 'success')
  }

  const handleAssignAddon = (addonId) => {
    if (client.ownedAddons.includes(addonId)) return
    dispatch({
      type: ACTIONS.UPDATE_CLIENT,
      payload: { ...client, ownedAddons: [...client.ownedAddons, addonId] }
    })
    notify(`Add-on assigned.`, 'success')
  }

  const handleRemoveCourse = (courseId) => {
    dispatch({
      type: ACTIONS.UPDATE_CLIENT,
      payload: { ...client, enrolledCourses: client.enrolledCourses.filter(id => id !== courseId) }
    })
    notify('Course removed.', 'info')
  }

  const handleSendMessage = () => {
    if (!message.trim()) return
    dispatch({
      type: ACTIONS.ADD_MESSAGE,
      payload: { id: `msg-${Date.now()}`, clientId, from: 'admin', text: message, timestamp: new Date().toISOString(), read: true }
    })
    notify('Message sent.', 'success')
    setMessage('')
  }

  const myCourses = COURSES.filter(c => client.enrolledCourses.includes(c.id))
  const myAddons = ADDONS.filter(a => client.ownedAddons.includes(a.id))
  const availableCourses = COURSES.filter(c => !client.enrolledCourses.includes(c.id))
  const availableAddons = ADDONS.filter(a => !client.ownedAddons.includes(a.id))

  const avgProgress = myCourses.length
    ? Math.round(myCourses.reduce((acc, c) => {
        const p = client.courseProgress?.[c.id]
        return acc + (p ? getProgressPercent(c.id, p.completedLessons) : 0)
      }, 0) / myCourses.length)
    : 0

  const tabs = ['overview', 'courses', 'addons', 'messages']

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">
      <FadeIn className="mb-6">
        <button onClick={() => navigate('/admin/clients')}
          className="flex items-center gap-2 font-sans text-xs text-silver-500 hover:text-pearl transition-colors tracking-widest uppercase">
          <ChevronLeft size={14} /> All Clients
        </button>
      </FadeIn>

      {/* Client header */}
      <FadeIn className="glass-card gold-border p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse 40% 80% at 100% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
        <div className="relative z-10 flex items-center gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-charcoal-900 font-display text-2xl font-light flex-shrink-0">
            {client.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="luxury-heading text-2xl lg:text-3xl">{client.name}</h1>
            <div className="font-sans text-sm text-silver-500 mt-1">{client.email}</div>
            <div className="flex flex-wrap gap-4 mt-3">
              <div>
                <div className="font-sans text-[9px] tracking-widest uppercase text-silver-700">Dog</div>
                <div className="font-sans text-xs text-silver-300">{client.dog?.name} · {client.dog?.breed}</div>
              </div>
              <div>
                <div className="font-sans text-[9px] tracking-widest uppercase text-silver-700">Joined</div>
                <div className="font-sans text-xs text-silver-300">{client.joinedDate}</div>
              </div>
              <div>
                <div className="font-sans text-[9px] tracking-widest uppercase text-silver-700">Status</div>
                <span className={`font-sans text-xs ${client.status === 'active' ? 'text-emerald-400' : 'text-silver-500'}`}>{client.status}</span>
              </div>
              <div>
                <div className="font-sans text-[9px] tracking-widest uppercase text-silver-700">Avg Progress</div>
                <div className="font-sans text-xs text-gold-400">{avgProgress}%</div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn className="flex gap-1 mb-6 border-b border-white/5 pb-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-sans text-xs tracking-widest uppercase px-4 py-3 transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-gold-500 text-gold-400'
                : 'border-transparent text-silver-600 hover:text-silver-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </FadeIn>

      {/* Overview */}
      {activeTab === 'overview' && (
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="section-label mb-3">Enrolled Courses</div>
              {myCourses.length === 0 ? <p className="font-sans text-sm text-silver-600">No courses assigned.</p> : (
                <div className="space-y-4">
                  {myCourses.map(c => {
                    const p = client.courseProgress?.[c.id]
                    const pct = p ? getProgressPercent(c.id, p.completedLessons) : 0
                    return (
                      <div key={c.id}>
                        <div className="flex justify-between mb-1">
                          <span className="font-sans text-sm text-pearl">{c.title}</span>
                          <span className="font-sans text-xs text-gold-500">{pct}%</span>
                        </div>
                        <div className="progress-bar">
                          <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="section-label mb-3">Notes</div>
              <p className="font-sans text-sm font-light text-silver-400 leading-relaxed">{client.notes || 'No notes yet.'}</p>
              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="stat-number text-xl">{client.totalMessages}</div>
                  <div className="font-sans text-[10px] text-silver-700 uppercase tracking-widest">Messages</div>
                </div>
                <div>
                  <div className={`stat-number text-xl ${client.pwaInstalled ? 'text-emerald-400' : ''}`}>
                    {client.pwaInstalled ? '✓' : '✗'}
                  </div>
                  <div className="font-sans text-[10px] text-silver-700 uppercase tracking-widest">PWA</div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Courses tab */}
      {activeTab === 'courses' && (
        <FadeIn>
          <div className="space-y-3 mb-6">
            <div className="section-label mb-3">Enrolled</div>
            {myCourses.map(c => (
              <div key={c.id} className="glass-card p-4 flex items-center gap-4" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
                <span className="text-xl">{c.icon}</span>
                <div className="flex-1">
                  <div className="font-sans text-sm font-medium text-pearl">{c.title}</div>
                  <div className="font-sans text-xs text-silver-600">{c.level} · {c.duration}</div>
                </div>
                <button onClick={() => handleRemoveCourse(c.id)} className="text-silver-700 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {availableCourses.length > 0 && (
              <>
                <div className="section-label mt-5 mb-3">Assign Course</div>
                {availableCourses.map(c => (
                  <motion.div key={c.id} whileHover={{ borderColor: 'rgba(201,168,76,0.3)' }}
                    className="glass-card p-4 flex items-center gap-4 cursor-pointer border border-white/5 transition-all"
                    onClick={() => handleAssignCourse(c.id)}>
                    <span className="text-xl">{c.icon}</span>
                    <div className="flex-1">
                      <div className="font-sans text-sm text-silver-300">{c.title}</div>
                      <div className="font-sans text-xs text-silver-600">{c.level}</div>
                    </div>
                    <Plus size={14} className="text-gold-500" />
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </FadeIn>
      )}

      {/* Add-ons tab */}
      {activeTab === 'addons' && (
        <FadeIn>
          <div className="space-y-3">
            <div className="section-label mb-3">Owned Add-Ons</div>
            {myAddons.length === 0 && <p className="font-sans text-sm text-silver-600">No add-ons assigned.</p>}
            {myAddons.map(a => (
              <div key={a.id} className="glass-card p-4 flex items-center gap-3" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
                <span>{a.icon}</span>
                <div className="flex-1">
                  <div className="font-sans text-sm font-medium text-pearl">{a.title}</div>
                  <div className="font-sans text-xs text-silver-600">{a.duration}</div>
                </div>
                <CheckCircle size={14} className="text-gold-500" />
              </div>
            ))}
            {availableAddons.length > 0 && (
              <>
                <div className="section-label mt-5 mb-3">Assign Add-On</div>
                {availableAddons.map(a => (
                  <motion.div key={a.id} whileHover={{ borderColor: 'rgba(201,168,76,0.3)' }}
                    className="glass-card p-4 flex items-center gap-3 cursor-pointer border border-white/5 transition-all"
                    onClick={() => handleAssignAddon(a.id)}>
                    <span>{a.icon}</span>
                    <div className="flex-1">
                      <div className="font-sans text-sm text-silver-300">{a.title}</div>
                    </div>
                    <Plus size={14} className="text-gold-500" />
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </FadeIn>
      )}

      {/* Messages tab */}
      {activeTab === 'messages' && (
        <FadeIn>
          <div className="glass-card p-6 mb-4 min-h-[300px] flex flex-col" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex-1 space-y-4 mb-4">
              {clientMessages.length === 0 ? (
                <p className="font-sans text-sm text-silver-600 text-center py-10">No messages yet.</p>
              ) : (
                clientMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-3 text-sm font-sans font-light leading-relaxed
                      ${msg.from === 'admin'
                        ? 'bg-gold-gradient text-charcoal-900'
                        : 'glass-card text-silver-200 border border-white/8'}`}>
                      {msg.text}
                      <div className={`text-[10px] mt-1 ${msg.from === 'admin' ? 'text-charcoal-700' : 'text-silver-600'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-3 border-t border-white/5 pt-4">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Send a message..."
                className="flex-1 bg-transparent border-b border-white/15 focus:border-gold-500/40 outline-none font-sans text-sm font-light text-pearl placeholder-silver-700 pb-2 transition-colors"
              />
              <button onClick={handleSendMessage} className="text-gold-500 hover:text-gold-300 transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
