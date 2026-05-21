// ─────────────────────────────────────────────────────────────
// ACADEMY IDENTITY CARD
// Reusable component used in ClientDetailPage and DistributionPage.
// Displays a client's link code, activation status, linked devices,
// and provides one-click sharing / status management actions.
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy, Check, MessageSquare, Mail, RefreshCw,
  Smartphone, ShieldOff, ShieldCheck, ExternalLink
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { academyStatusLabel, ACADEMY_STATUS, registerClientInRegistry } from '../../utils/academyIdentity'

const APP_URL = window.location.origin

export default function AcademyIdentityCard({ client, onStatusChange }) {
  const { notify, dispatch, ACTIONS } = useApp()
  const [copied, setCopied] = useState(false)
  const [showDevices, setShowDevices] = useState(false)

  if (!client) return null

  const status     = academyStatusLabel(client.academyStatus || 'pending')
  const linkCode   = client.academyLinkCode || '—'
  const academyId  = client.academyId       || '—'
  const devices    = client.linkedDevices   || []
  const activationUrl = `${APP_URL}/activate`

  const copyCode = () => {
    navigator.clipboard.writeText(linkCode)
    setCopied(true)
    notify('Academy code copied!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappShare = () => {
    const msg = encodeURIComponent(
      `🐾 *Four Paws Academy — Your Access Code*\n\n` +
      `Welcome to your private academy, ${client.name.split(' ')[0]}!\n\n` +
      `*Your activation code:* \`${linkCode}\`\n\n` +
      `To activate:\n` +
      `1. Open: ${activationUrl}\n` +
      `2. Enter your code: *${linkCode}*\n` +
      `3. Your courses unlock instantly\n\n` +
      `— Four Paws Academy Team 🐾`
    )
    window.open(`https://wa.me/${(client.phone || '').replace(/\D/g, '')}?text=${msg}`, '_blank')
    notify('WhatsApp opened.', 'success')
  }

  const emailShare = () => {
    const subject = encodeURIComponent('Your Four Paws Academy Activation Code')
    const body    = encodeURIComponent(
      `Dear ${client.name},\n\n` +
      `Your exclusive Four Paws Academy access is ready.\n\n` +
      `Your Academy Code: ${linkCode}\n` +
      `Your Academy ID:   ${academyId}\n\n` +
      `To activate your academy:\n` +
      `1. Visit: ${activationUrl}\n` +
      `2. Enter your code: ${linkCode}\n` +
      `3. Your personalised programme will unlock immediately.\n\n` +
      `This code is unique to you and permanently linked to your profile.\n\n` +
      `With warmth,\nFour Paws Academy`
    )
    window.open(`mailto:${client.email}?subject=${subject}&body=${body}`)
    notify('Email client opened.', 'success')
  }

  const toggleSuspend = () => {
    const newStatus = client.academyStatus === ACADEMY_STATUS.SUSPENDED
      ? ACADEMY_STATUS.ACTIVE
      : ACADEMY_STATUS.SUSPENDED

    dispatch({
      type: ACTIONS.SET_ACADEMY_STATUS,
      payload: { clientId: client.id, status: newStatus }
    })

    // Update registry
    const updated = { ...client, academyStatus: newStatus }
    registerClientInRegistry(updated)

    notify(
      newStatus === ACADEMY_STATUS.SUSPENDED
        ? `${client.name}'s access suspended.`
        : `${client.name}'s access restored.`,
      newStatus === ACADEMY_STATUS.SUSPENDED ? 'info' : 'success'
    )
    onStatusChange?.(newStatus)
  }

  return (
    <div className="glass-card p-6 space-y-5" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="section-label mb-1">Academy Identity</div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            <span className={`font-sans text-xs font-medium ${status.colour}`}>{status.label}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[9px] text-silver-700">{academyId}</div>
        </div>
      </div>

      {/* Link code display */}
      <div>
        <div className="font-sans text-[9px] tracking-widest uppercase text-silver-600 mb-2">Academy Link Code</div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-charcoal-800 border border-white/8 px-4 py-3 flex items-center justify-between gap-3">
            <span className="font-mono text-base font-medium tracking-[0.15em] text-gold-400">{linkCode}</span>
            <motion.button
              onClick={copyCode}
              whileTap={{ scale: 0.9 }}
              className="text-silver-600 hover:text-gold-400 transition-colors flex-shrink-0"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </motion.button>
          </div>
        </div>
        <div className="font-sans text-[10px] text-silver-700 mt-1.5">
          Activation URL: <span className="text-silver-500 font-mono">{activationUrl}</span>
        </div>
      </div>

      {/* Quick share */}
      <div>
        <div className="font-sans text-[9px] tracking-widest uppercase text-silver-600 mb-2">Send Code</div>
        <div className="flex gap-2">
          <motion.button
            onClick={whatsappShare}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/8 hover:border-green-500/30 text-silver-400 hover:text-green-400 transition-all text-xs font-sans"
          >
            <MessageSquare size={13} /> WhatsApp
          </motion.button>
          <motion.button
            onClick={emailShare}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/8 hover:border-gold-500/30 text-silver-400 hover:text-gold-400 transition-all text-xs font-sans"
          >
            <Mail size={13} /> Email
          </motion.button>
          <motion.button
            onClick={() => window.open(activationUrl, '_blank')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/8 hover:border-silver-400/30 text-silver-600 hover:text-silver-300 transition-all text-xs font-sans"
          >
            <ExternalLink size={13} />
          </motion.button>
        </div>
      </div>

      {/* Linked devices */}
      <div>
        <button
          onClick={() => setShowDevices(!showDevices)}
          className="flex items-center gap-2 text-silver-500 hover:text-silver-200 transition-colors w-full text-left"
        >
          <Smartphone size={13} />
          <span className="font-sans text-[9px] tracking-widest uppercase">
            {devices.length} Linked Device{devices.length !== 1 ? 's' : ''}
          </span>
          <span className="ml-auto text-[10px]">{showDevices ? '▲' : '▼'}</span>
        </button>

        <AnimatePresence>
          {showDevices && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-2">
                {devices.length === 0 ? (
                  <p className="font-sans text-xs text-silver-700 italic">No devices linked yet.</p>
                ) : (
                  devices.map((d, i) => (
                    <div key={d.deviceId} className="flex items-center justify-between bg-charcoal-800 px-3 py-2 border border-white/5">
                      <span className="font-mono text-[10px] text-silver-400 truncate">{d.deviceId}</span>
                      <span className="font-sans text-[10px] text-silver-700 flex-shrink-0 ml-3">
                        {new Date(d.linkedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suspend / Restore */}
      <div className="pt-2 border-t border-white/5">
        <button
          onClick={toggleSuspend}
          className={`flex items-center gap-2 font-sans text-xs transition-colors ${
            client.academyStatus === ACADEMY_STATUS.SUSPENDED
              ? 'text-emerald-500 hover:text-emerald-300'
              : 'text-red-500/70 hover:text-red-400'
          }`}
        >
          {client.academyStatus === ACADEMY_STATUS.SUSPENDED
            ? <><ShieldCheck size={13} /> Restore Academy Access</>
            : <><ShieldOff size={13} />  Suspend Academy Access</>
          }
        </button>
      </div>
    </div>
  )
}
