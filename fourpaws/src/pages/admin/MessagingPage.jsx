import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Search, MessageCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { FadeIn } from '../../components/animations/FadeIn'

export default function MessagingPage() {
  const { state, dispatch, ACTIONS, notify } = useApp()
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')

  const clients = state.allClients || []
  const filtered = clients.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  )
  const selectedClient = clients.find(c => c.id === selectedClientId)
  const thread = (state.messages || []).filter(m => m.clientId === selectedClientId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  const sendMessage = () => {
    if (!message.trim() || !selectedClientId) return
    dispatch({
      type: ACTIONS.ADD_MESSAGE,
      payload: {
        id: `msg-${Date.now()}`,
        clientId: selectedClientId,
        from: 'admin',
        text: message,
        timestamp: new Date().toISOString(),
        read: true
      }
    })
    setMessage('')
    notify('Message sent.', 'success')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ height: '100vh' }}>
      {/* Sidebar — client list */}
      <div className="w-full lg:w-72 flex-shrink-0 border-r border-white/5 flex flex-col"
        style={{ background: 'rgba(12,12,12,0.9)' }}>
        <div className="p-5 border-b border-white/5">
          <div className="section-label mb-2">Messaging</div>
          <h2 className="luxury-heading text-2xl">Conversations</h2>
        </div>
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-700" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="w-full bg-charcoal-800 border border-white/5 text-xs font-sans text-pearl placeholder-silver-700 pl-8 pr-3 py-2.5 outline-none focus:border-gold-500/20 transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(client => {
            const lastMsg = (state.messages || []).filter(m => m.clientId === client.id).pop()
            const unread = (state.messages || []).filter(m => m.clientId === client.id && !m.read && m.from === 'client').length
            return (
              <motion.button
                key={client.id}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                onClick={() => setSelectedClientId(client.id)}
                className={`w-full flex items-center gap-3 p-4 border-b border-white/5 text-left transition-all
                  ${selectedClientId === client.id ? 'bg-gold-500/5 border-l-2 border-l-gold-500' : ''}`}
              >
                <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-charcoal-900 font-sans font-bold text-xs flex-shrink-0">
                  {client.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm font-medium text-pearl truncate">{client.name}</span>
                    {unread > 0 && (
                      <span className="w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center text-[9px] text-charcoal-900 font-bold flex-shrink-0">
                        {unread}
                      </span>
                    )}
                  </div>
                  {lastMsg && (
                    <div className="font-sans text-xs text-silver-600 truncate">{lastMsg.text}</div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {!selectedClient ? (
          <div className="flex-1 flex items-center justify-center text-center p-10">
            <div>
              <MessageCircle size={40} className="text-silver-700 mx-auto mb-4" />
              <div className="font-sans text-sm text-silver-600">Select a client to view their conversation</div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-4 p-5 border-b border-white/5">
              <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-charcoal-900 font-bold text-sm">
                {selectedClient.name.charAt(0)}
              </div>
              <div>
                <div className="font-sans text-sm font-medium text-pearl">{selectedClient.name}</div>
                <div className="font-sans text-xs text-silver-600">{selectedClient.dog?.name} · {selectedClient.email}</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {thread.length === 0 ? (
                <div className="text-center py-10">
                  <div className="font-sans text-sm text-silver-600">No messages yet. Start a conversation.</div>
                </div>
              ) : (
                thread.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-sm px-4 py-3 text-sm font-sans font-light leading-relaxed
                      ${msg.from === 'admin'
                        ? 'bg-gold-gradient text-charcoal-900'
                        : 'glass-card text-silver-200 border border-white/8'}`}>
                      {msg.text}
                      <div className={`text-[10px] mt-1.5 ${msg.from === 'admin' ? 'text-charcoal-700' : 'text-silver-600'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-5 border-t border-white/5">
              <div className="flex gap-3 items-end">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Write a message..."
                  rows={2}
                  className="flex-1 bg-charcoal-800 border border-white/8 text-sm font-sans font-light text-pearl placeholder-silver-700 px-4 py-3 outline-none focus:border-gold-500/30 transition-colors resize-none"
                />
                <button
                  onClick={sendMessage}
                  className="w-10 h-10 bg-gold-gradient flex items-center justify-center flex-shrink-0 hover:shadow-gold transition-all"
                >
                  <Send size={14} className="text-charcoal-900" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
