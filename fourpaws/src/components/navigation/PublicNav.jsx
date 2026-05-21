import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
]

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = useApp()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'backdrop-blur-xl border-b border-white/5' : ''
        }`}
        style={{ background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 relative">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)' }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-lg">🐾</span>
              </div>
              <div>
                <div className="font-display text-sm font-light tracking-[0.15em] text-pearl uppercase leading-none">
                  Four Paws
                </div>
                <div className="font-sans text-[9px] font-medium tracking-[0.3em] uppercase text-gold-500 leading-none mt-0.5">
                  Academy
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-sans text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'text-gold-400'
                      : 'text-silver-400 hover:text-pearl'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              {state.isAuthenticated ? (
                <button
                  onClick={() => navigate(state.userRole === 'admin' ? '/admin' : '/academy')}
                  className="btn-gold text-xs px-6 py-3"
                >
                  {state.userRole === 'admin' ? 'Control Centre' : 'My Academy'}
                </button>
              ) : (
                <>
                  <Link to="/login" className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-silver-400 hover:text-pearl transition-colors">
                    Sign In
                  </Link>
                  <Link to="/login" className="btn-gold text-xs px-6 py-3">
                    Join Academy
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-silver-400 hover:text-pearl transition-colors p-2"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-20 z-40 backdrop-blur-xl border-b border-white/5"
            style={{ background: 'rgba(10,10,10,0.97)' }}
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={link.to}
                    className={`block font-display text-2xl font-light tracking-tight ${
                      location.pathname === link.to ? 'text-gold-400' : 'text-pearl'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="divider-gold" />
              {state.isAuthenticated ? (
                <button
                  onClick={() => navigate(state.userRole === 'admin' ? '/admin' : '/academy')}
                  className="btn-gold w-full text-center text-xs py-4"
                >
                  {state.userRole === 'admin' ? 'Control Centre' : 'My Academy'}
                </button>
              ) : (
                <Link to="/login" className="btn-gold block w-full text-center text-xs py-4">
                  Join Academy
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
