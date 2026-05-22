import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Zap, Package, Users, RefreshCw, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import {
  generateAcademyLinkCode,
  loadRegistry,
  saveRegistry,
  getClientIdentity,
} from '../../utils/academyIdentity'
import {
  PACKAGES, TIER_LEVELS, TRANSFORMATION_PATHWAYS,
  buildAcademyConfig, FEATURE_MATRIX,
} from '../../config/academyConfig'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

const TIER_COLOUR = {
  GOLD:      '#C9A84C',
  PLATINUM:  '#C0C0C0',
  OBSIDIAN:  '#C9A84C',
  FOUNDERS:  '#F5E09A',
  CONCIERGE: '#9FDBFF',
}

function PackageCard({ pkg, isSelected, onSelect }) {
  const tier   = TIER_LEVELS[pkg.tier] || TIER_LEVELS.GOLD
  const colour = TIER_COLOUR[pkg.tier] || '#C9A84C'
  return (
    <motion.button onClick={() => onSelect(pkg.id)}
      whileHover={{ y: -2, borderColor: colour + '50' }}
      className={`glass-card p-5 text-left w-full transition-all ${isSelected ? 'ring-1' : ''}`}
      style={{ border: `1px solid ${isSelected ? colour + '60' : colour + '20'}`, boxShadow: isSelected ? `0 0 20px ${colour}15` : 'none' }}>
      <div className="flex items-start gap-3">
        <span className="text-3xl flex-shrink-0">{pkg.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-serif text-base font-medium text-pearl">{pkg.name}</div>
            {isSelected && <Check size={12} style={{ color: colour }} />}
          </div>
          <div className="font-sans text-[10px] text-silver-500 mb-2">{pkg.tagline}</div>
          <div className="flex items-center gap-2">
            <span className="font-sans text-[8px] px-2 py-0.5 border uppercase tracking-wider"
              style={{ color: colour, borderColor: colour + '30', background: colour + '10' }}>
              {tier.name}
            </span>
            <span className="font-sans text-[9px] text-silver-600">
              {Array.isArray(pkg.courses) ? pkg.courses.length : '∞'} courses
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

function FeatureList({ packageId }) {
  const pkg      = PACKAGES[packageId]
  if (!pkg) return null
  const isAll    = pkg.enabledFeatures === '__ALL__'
  const features = isAll ? Object.keys(FEATURE_MATRIX) : (pkg.enabledFeatures || [])
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-4">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 font-sans text-[9px] text-silver-600 hover:text-silver-400 uppercase tracking-widest">
        {open ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        {features.length} features included
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="grid grid-cols-2 gap-1.5 mt-3">
              {features.map(f => {
                const meta = FEATURE_MATRIX[f]
                return (
                  <div key={f} className="flex items-center gap-1.5">
                    <span className="text-xs">{meta?.icon || '•'}</span>
                    <span className="font-sans text-[9px] text-silver-500">{meta?.label || f}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function DistributionPage() {
  const { state }   = useApp()
  const registry    = loadRegistry()
  const clients     = state.allClients || []

  const [selectedClient,  setSelectedClient]  = useState(null)
  const [selectedPackage, setSelectedPackage] = useState('ELITE_COMPANION')
  const [selectedTheme,   setSelectedTheme]   = useState('obsidian_gold')
  const [generated,       setGenerated]       = useState(null)
  const [copied,          setCopied]          = useState(false)
  const [generating,      setGenerating]      = useState(false)

  const registryEntries = useMemo(() => Object.entries(registry), [registry])

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 800))

    // Build the academy config for this package
    const cfg    = buildAcademyConfig({ packageId: selectedPackage, theme: selectedTheme })
    const code   = generateAcademyLinkCode()
    const reg    = loadRegistry()

    const entry = {
      clientId:   selectedClient?.id || `client-${Date.now().toString(36)}`,
      clientName: selectedClient?.name || 'New Client',
      email:      selectedClient?.email || '',
      packageId:  selectedPackage,
      tierLevel:  cfg.tierLevel,
      createdAt:  new Date().toISOString(),
      config:     cfg,
    }

    reg[code] = entry
    saveRegistry(reg)

    setGenerated({ code, entry, cfg })
    setGenerating(false)
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-6xl mx-auto">

      <FadeIn className="mb-8">
        <div className="section-label mb-1">Package Distribution</div>
        <h1 className="luxury-heading text-4xl">Dynamic<br /><span className="text-gold-gradient italic">Academy Generator</span></h1>
        <p className="font-sans text-sm text-silver-500 mt-3 max-w-xl">
          Assign a package to a client. The system generates a personalised academy configuration and unique activation code.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Configuration panel */}
        <div className="lg:col-span-2 space-y-8">

          {/* Step 1: Client */}
          <FadeIn>
            <div className="section-label mb-1">Step 1</div>
            <h2 className="luxury-heading text-xl mb-4">Select Client</h2>
            <div className="glass-card p-5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              {clients.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                  {clients.map(c => (
                    <motion.button key={c.id} onClick={() => setSelectedClient(c)}
                      whileHover={{ x: 2 }}
                      className={`flex items-center gap-3 p-3 border text-left transition-all ${selectedClient?.id === c.id ? 'border-gold-500/30 bg-gold-500/5' : 'border-white/5 hover:border-white/12'}`}>
                      <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center text-charcoal-900 font-semibold text-xs flex-shrink-0">
                        {(c.name || 'A').charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-sans text-xs text-pearl truncate">{c.name || 'Client'}</div>
                        <div className="font-sans text-[9px] text-silver-600 truncate">{c.email || '—'}</div>
                      </div>
                      {selectedClient?.id === c.id && <Check size={11} className="text-gold-400 flex-shrink-0" />}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users size={24} className="text-silver-700 mx-auto mb-2" />
                  <div className="font-sans text-sm text-silver-600">No clients yet — add clients in the Clients section.</div>
                  <div className="font-sans text-xs text-silver-700 mt-1">You can still generate a code without selecting a client.</div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Step 2: Package */}
          <FadeIn delay={0.1}>
            <div className="section-label mb-1">Step 2</div>
            <h2 className="luxury-heading text-xl mb-4">Choose Package</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.values(PACKAGES).map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg}
                  isSelected={selectedPackage === pkg.id}
                  onSelect={setSelectedPackage} />
              ))}
            </div>
            <FeatureList packageId={selectedPackage} />
          </FadeIn>

          {/* Step 3: Theme */}
          <FadeIn delay={0.2}>
            <div className="section-label mb-1">Step 3</div>
            <h2 className="luxury-heading text-xl mb-4">Select Theme</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'obsidian_gold',    name: 'Obsidian Gold',    icon: '🌑', primary: '#C9A84C' },
                { id: 'platinum_silver',  name: 'Platinum Silver',  icon: '💎', primary: '#C0C0C0' },
                { id: 'midnight_sapphire',name: 'Midnight Sapphire',icon: '💙', primary: '#3B82F6' },
                { id: 'royal_emerald',    name: 'Royal Emerald',    icon: '💚', primary: '#10B981' },
                { id: 'ivory_luxe',       name: 'Ivory Luxe',       icon: '🤍', primary: '#D4A96A' },
              ].map(t => (
                <motion.button key={t.id} onClick={() => setSelectedTheme(t.id)}
                  whileHover={{ y: -2 }}
                  className={`flex items-center gap-2 p-3 border transition-all ${selectedTheme === t.id ? 'border-gold-500/40 bg-gold-500/5' : 'border-white/6 hover:border-white/14'}`}>
                  <span className="text-xl">{t.icon}</span>
                  <span className="font-sans text-xs text-silver-300">{t.name}</span>
                  <div className="ml-auto w-4 h-4 rounded-full border border-white/10" style={{ background: t.primary }} />
                </motion.button>
              ))}
            </div>
          </FadeIn>

          {/* Generate */}
          <FadeIn delay={0.3}>
            <motion.button onClick={handleGenerate} disabled={generating}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full btn-gold py-4 font-sans text-sm tracking-widest uppercase flex items-center justify-center gap-3 disabled:opacity-50">
              {generating
                ? <><RefreshCw size={14} className="animate-spin" /> Generating Academy…</>
                : <><Zap size={14} /> Generate Academy Configuration</>
              }
            </motion.button>
          </FadeIn>
        </div>

        {/* Right: Generated output */}
        <div className="space-y-6">

          <AnimatePresence>
            {generated && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="section-label mb-1">Generated</div>
                <h2 className="luxury-heading text-xl mb-4">Academy Configuration</h2>

                {/* Activation code card */}
                <div className="relative overflow-hidden p-6 mb-4"
                  style={{ background: 'linear-gradient(135deg, #1A1208 0%, #2A1E0A 100%)', border: '1px solid rgba(201,168,76,0.4)' }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.8), transparent)' }} />
                  <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.8), transparent)' }} />

                  <div className="text-center mb-4">
                    <div className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold-600 mb-2">Activation Code</div>
                    <div className="font-mono text-2xl font-light text-gold-400 tracking-[0.15em]">{generated.code}</div>
                  </div>

                  <motion.button onClick={() => handleCopy(generated.code)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className={`w-full py-2.5 font-sans text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                      copied ? 'border border-emerald-500/40 text-emerald-400 bg-emerald-500/8' : 'btn-gold'
                    }`}>
                    {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Code</>}
                  </motion.button>
                </div>

                {/* Config summary */}
                <div className="glass-card p-5 space-y-3" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="font-sans text-[9px] uppercase tracking-widest text-silver-700 mb-3">Configuration Summary</div>
                  {[
                    ['Package',    `${generated.cfg.packageMeta?.icon || ''} ${generated.cfg.packageName}`],
                    ['Tier',       `${generated.cfg.tierMeta?.icon || ''} ${generated.cfg.tierLevel}`],
                    ['Pathway',    generated.cfg.pathwayMeta?.name || '—'],
                    ['Theme',      generated.cfg.theme],
                    ['Features',   `${generated.cfg.enabledFeatures?.length || '∞'} enabled`],
                    ['AI Systems', `${generated.cfg.enabledAI?.length || '∞'} active`],
                    ['Concierge',  generated.cfg.conciergeLevel],
                    ['Voice',      generated.cfg.voiceCoach ? 'Enabled' : 'Disabled'],
                    ['Digital Twin',generated.cfg.digitalTwin ? 'Enabled' : 'Disabled'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="font-sans text-[9px] text-silver-600">{k}</span>
                      <span className="font-sans text-[9px] text-silver-400 font-medium">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Client note */}
                {generated.entry.clientName && (
                  <div className="mt-3 p-3 border border-white/5 bg-white/1">
                    <div className="font-sans text-[9px] text-silver-600">
                      Assigned to: <span className="text-silver-400 font-medium">{generated.entry.clientName}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Registry */}
          {registryEntries.length > 0 && (
            <FadeIn>
              <div className="section-label mb-1">Registry</div>
              <h2 className="luxury-heading text-lg mb-3">Issued Codes</h2>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {registryEntries.slice(0, 20).map(([code, entry]) => {
                  const tier   = TIER_LEVELS[entry.tierLevel] || TIER_LEVELS.GOLD
                  const colour = tier.colour || '#C9A84C'
                  return (
                    <div key={code} className="flex items-center justify-between p-3 border border-white/5 hover:border-white/10 transition-colors group">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs text-silver-400">{code}</div>
                        <div className="font-sans text-[9px] text-silver-600 truncate">
                          {entry.clientName || 'Unassigned'} · {entry.packageId || '—'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: colour }} />
                        <button onClick={() => handleCopy(code)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy size={10} className="text-silver-600" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  )
}
