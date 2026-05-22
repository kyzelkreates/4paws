// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — ADMIN LOGIN PAGE
// Admin-only credential entry. Clients access via /activate with their code.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Shield, Key } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ADMIN_USER } from '../../data/adminUser'
import { seedRegistryFromClients } from '../../utils/academyIdentity'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const navigate = useNavigate()
  const { setUser, dispatch, ACTIONS, notify } = useApp()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    // ── Admin login ──────────────────────────────────────────
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      setUser(ADMIN_USER)
      // @firewall-ignore-start — runtime-only dynamic import
      const { DEMO_CLIENTS } = await import('../../dev/mockClients')
      dispatch({ type: ACTIONS.SET_ALL_CLIENTS, payload: DEMO_CLIENTS })
      seedRegistryFromClients(DEMO_CLIENTS)
      // @firewall-ignore-end
      notify('Welcome back to the Control Centre', 'success')
      navigate('/admin')
      return
    }

    setError('Invalid credentials. Admin access only.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3">
            <span className="text-3xl">🐾</span>
            <div className="text-left">
              <div className="font-display text-lg font-light tracking-[0.2em] text-pearl uppercase">Four Paws</div>
              <div className="font-sans text-[9px] font-medium tracking-[0.35em] uppercase text-gold-500">Academy</div>
            </div>
          </div>
        </div>

        <div className="glass-card gold-border p-10">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={13} className="text-gold-500" />
              <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-gold-600">Control Centre</span>
            </div>
            <h1 className="luxury-heading text-3xl mb-2">Admin Access</h1>
            <p className="font-sans text-sm font-light text-silver-500">Sign in to manage your academy</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="section-label text-[10px] block mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="premium-input"
                placeholder="admin@fourpawsacademy.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="section-label text-[10px] block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="premium-input pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-0 bottom-3 text-silver-600 hover:text-silver-300 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-sans text-xs text-red-400">
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 text-xs">
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border border-charcoal-900/30 border-t-charcoal-900 rounded-full"
                />
              ) : (
                <>Enter Control Centre <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          {/* Client activation path */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="font-sans text-xs text-silver-600 mb-3">Are you a client with an activation code?</p>
            <Link
              to="/activate"
              className="inline-flex items-center gap-2 btn-outline-gold text-xs w-full justify-center"
            >
              <Key size={13} /> Activate Your Academy
            </Link>
          </div>
        </div>

        <p className="text-center mt-6 font-sans text-xs font-light text-silver-700">
          Four Paws Academy — Private Access Only
        </p>
      </motion.div>
    </div>
  )
}
