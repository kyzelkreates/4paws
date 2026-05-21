import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2, MessageSquare, Mail, Wifi, Bluetooth, Smartphone,
  Copy, Check, ExternalLink, Send, Users, QrCode
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

const APP_URL = window.location.origin

export default function DistributionPage() {
  const { state, notify } = useApp()
  const [copied, setCopied] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [emailTo, setEmailTo] = useState('')
  const [whatsappNum, setWhatsappNum] = useState('')

  const clients = state.allClients || []

  const copyLink = () => {
    navigator.clipboard.writeText(APP_URL)
    setCopied(true)
    notify('Academy link copied!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const sendWhatsApp = (number) => {
    const msg = encodeURIComponent(
      `Welcome to Four Paws Training & Enrichment Academy 🐾\n\nYour private academy access is ready. Click below to install your personalised academy app:\n\n${APP_URL}\n\nOnce installed, sign in with your email and password to begin your transformation journey.\n\n— The Four Paws Academy Team`
    )
    const url = `https://wa.me/${number.replace(/\D/g, '')}?text=${msg}`
    window.open(url, '_blank')
    notify('WhatsApp opened.', 'success')
  }

  const sendEmail = (to) => {
    const subject = encodeURIComponent('Your Four Paws Academy Access Is Ready')
    const body = encodeURIComponent(
      `Dear Academy Member,\n\nWelcome to Four Paws Training & Enrichment Academy.\n\nYour exclusive access to our luxury canine transformation platform is now ready.\n\nTo get started:\n1. Visit: ${APP_URL}\n2. Sign in with your registered email and password\n3. Install the app on your device for the full experience\n\nWe look forward to accompanying you and your dog on this extraordinary journey.\n\nWith warmth,\nThe Four Paws Academy Team`
    )
    window.open(`mailto:${to}?subject=${subject}&body=${body}`)
    notify('Email client opened.', 'success')
  }

  const methods = [
    {
      id: 'whatsapp',
      icon: MessageSquare,
      label: 'WhatsApp',
      desc: 'Send academy access directly via WhatsApp',
      color: '#25D366',
      status: 'ready',
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      desc: 'Deliver a premium access email to your client',
      color: '#C9A84C',
      status: 'ready',
    },
    {
      id: 'link',
      icon: Copy,
      label: 'Copy Link',
      desc: 'Copy the academy URL to share anywhere',
      color: '#9C9C9C',
      status: 'ready',
    },
    {
      id: 'nfc',
      icon: Wifi,
      label: 'NFC Tap',
      desc: 'Luxury NFC card tap-to-access distribution',
      color: '#7EC8E3',
      status: 'coming',
    },
    {
      id: 'bluetooth',
      icon: Bluetooth,
      label: 'Bluetooth',
      desc: 'Proximity-based access sharing',
      color: '#B388FF',
      status: 'coming',
    },
    {
      id: 'wifi',
      icon: Wifi,
      label: 'WiFi Direct',
      desc: 'Local network instant distribution',
      color: '#FF8FAB',
      status: 'coming',
    },
  ]

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">
      <FadeIn className="mb-10">
        <div className="section-label mb-2">Access Control</div>
        <h1 className="luxury-heading text-4xl lg:text-5xl mb-3">App Distribution</h1>
        <p className="font-sans text-base font-light text-silver-500 max-w-xl">
          Share the Four Paws Academy app with your clients through multiple premium channels.
        </p>
      </FadeIn>

      {/* App card */}
      <FadeIn className="glass-card gold-border p-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 100% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
        <div className="relative z-10 flex items-center gap-5 flex-wrap">
          <div className="w-16 h-16 bg-charcoal-800 border border-gold-500/20 flex items-center justify-center text-3xl flex-shrink-0">
            🐾
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-sans text-[9px] tracking-widest uppercase text-gold-500 mb-1">PWA Academy App</div>
            <h2 className="font-serif text-xl text-pearl mb-1">Four Paws Training & Enrichment Academy</h2>
            <div className="font-sans text-xs text-silver-500 font-mono truncate">{APP_URL}</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <div className="stat-number text-xl">{clients.filter(c => c.pwaInstalled).length}</div>
              <div className="font-sans text-[9px] text-silver-700 uppercase tracking-widest">Installed</div>
            </div>
            <div className="text-center">
              <div className="stat-number text-xl">{clients.length}</div>
              <div className="font-sans text-[9px] text-silver-700 uppercase tracking-widest">Clients</div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Distribution methods */}
      <FadeIn className="mb-8">
        <div className="section-label mb-4">Distribution Channels</div>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {methods.map(method => (
            <StaggerItem key={method.id}>
              <motion.div
                whileHover={method.status === 'ready' ? { y: -3, borderColor: `${method.color}40` } : {}}
                onClick={() => method.status === 'ready' && setSelectedMethod(method.id)}
                className={`glass-card p-5 cursor-pointer transition-all border
                  ${method.status === 'coming' ? 'opacity-50 cursor-default border-white/5' : 'border-white/8 hover:border-opacity-50'}
                  ${selectedMethod === method.id ? 'border-gold-500/40 bg-gold-500/5' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-none"
                    style={{ background: `${method.color}15`, border: `1px solid ${method.color}30` }}>
                    <method.icon size={16} style={{ color: method.color }} />
                  </div>
                  {method.status === 'coming' && (
                    <span className="font-sans text-[9px] tracking-widest uppercase text-silver-600 bg-charcoal-800 px-2 py-0.5">
                      Soon
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-base font-medium text-pearl mb-1">{method.label}</h3>
                <p className="font-sans text-xs text-silver-500">{method.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </FadeIn>

      {/* Action panel */}
      <AnimatePresence>
        {selectedMethod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card gold-border p-8 mb-8"
          >
            {selectedMethod === 'whatsapp' && (
              <div>
                <div className="section-label mb-2">WhatsApp Distribution</div>
                <h3 className="luxury-heading text-2xl mb-5">Send Academy Access</h3>
                <div className="mb-5">
                  <label className="section-label text-[10px] block mb-2">WhatsApp Number</label>
                  <input
                    value={whatsappNum}
                    onChange={e => setWhatsappNum(e.target.value)}
                    placeholder="+44 7700 900000"
                    className="premium-input max-w-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-3 mb-5">
                  {clients.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setWhatsappNum(c.phone)}
                      className="font-sans text-xs px-3 py-1.5 border border-white/10 hover:border-gold-500/30 text-silver-400 hover:text-silver-200 transition-all"
                    >
                      {c.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
                <button onClick={() => whatsappNum && sendWhatsApp(whatsappNum)} className="btn-gold text-xs flex items-center gap-2">
                  <Send size={13} /> Open WhatsApp
                </button>
              </div>
            )}

            {selectedMethod === 'email' && (
              <div>
                <div className="section-label mb-2">Email Distribution</div>
                <h3 className="luxury-heading text-2xl mb-5">Send Access Email</h3>
                <div className="mb-5">
                  <label className="section-label text-[10px] block mb-2">Client Email</label>
                  <input
                    value={emailTo}
                    onChange={e => setEmailTo(e.target.value)}
                    placeholder="client@email.com"
                    className="premium-input max-w-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-3 mb-5">
                  {clients.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setEmailTo(c.email)}
                      className="font-sans text-xs px-3 py-1.5 border border-white/10 hover:border-gold-500/30 text-silver-400 hover:text-silver-200 transition-all"
                    >
                      {c.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
                <button onClick={() => emailTo && sendEmail(emailTo)} className="btn-gold text-xs flex items-center gap-2">
                  <Mail size={13} /> Send Email
                </button>
              </div>
            )}

            {selectedMethod === 'link' && (
              <div>
                <div className="section-label mb-2">Direct Link</div>
                <h3 className="luxury-heading text-2xl mb-5">Academy URL</h3>
                <div className="flex items-center gap-3 p-4 bg-charcoal-800 border border-white/8 mb-5">
                  <code className="font-mono text-sm text-gold-400 flex-1 truncate">{APP_URL}</code>
                  <button onClick={copyLink} className="text-silver-500 hover:text-gold-400 transition-colors flex-shrink-0">
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={copyLink} className="btn-gold text-xs flex items-center gap-2">
                    {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Link</>}
                  </button>
                  <a href={APP_URL} target="_blank" rel="noreferrer" className="btn-outline-gold text-xs flex items-center gap-2">
                    <ExternalLink size={13} /> Open App
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client PWA status */}
      <FadeIn>
        <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="section-label mb-1">Adoption</div>
              <h3 className="font-serif text-lg text-pearl">Client PWA Status</h3>
            </div>
            <Smartphone size={16} className="text-gold-500" />
          </div>
          <div className="space-y-3">
            {clients.map(c => (
              <div key={c.id} className="flex items-center gap-4">
                <div className="w-7 h-7 rounded-full bg-charcoal-800 flex items-center justify-center text-xs font-sans font-bold text-silver-400 flex-shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 font-sans text-sm text-silver-300">{c.name}</div>
                <div className="font-sans text-xs text-silver-600">{c.dog?.name}</div>
                <div className={`flex items-center gap-1.5 font-sans text-xs ${c.pwaInstalled ? 'text-emerald-400' : 'text-silver-600'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${c.pwaInstalled ? 'bg-emerald-400' : 'bg-silver-700'}`} />
                  {c.pwaInstalled ? 'Installed' : 'Not installed'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
