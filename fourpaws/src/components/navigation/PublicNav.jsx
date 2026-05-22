import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const navLinks = [
  { label: 'Home',     to: '/'      },
  { label: 'About Us', to: '/about' },
]

export default function PublicNav() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [atTop,     setAtTop]     = useState(true)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { state } = useApp()

  const { scrollY } = useScroll()
  const navOpacity = useTransform(scrollY, [0, 60], [0, 1])

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setAtTop(y < 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const handleCTA = () => {
    if (state.isAuthenticated) navigate(state.userRole === 'admin' ? '/admin' : '/academy')
    else navigate('/login')
  }

  const isHome = location.pathname === '/'

  return (
    <>
      {/* Desktop nav */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(8,8,8,0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.5)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.1)' : '1px solid transparent',
        }}>

        {/* Gold top accent line — visible when scrolled */}
        <motion.div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 50%, transparent 100%)', opacity: scrolled ? 1 : 0 }}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.span className="text-xl"
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
                🐾
              </motion.span>
              <div>
                <div className="font-display text-sm font-light tracking-[0.22em] text-pearl uppercase leading-none transition-all duration-300 group-hover:text-gold-400">Four Paws</div>
                <div className="font-sans text-[7px] tracking-[0.38em] uppercase text-gold-700">Elite Academy</div>
              </div>
            </Link>

            {/* Desktop links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => {
                const active = location.pathname === link.to
                return (
                  <Link key={link.to} to={link.to}
                    className={`font-sans text-xs font-light tracking-widest uppercase transition-all duration-300 relative group ${active ? 'text-gold-400' : 'text-silver-400 hover:text-pearl'}`}>
                    {link.label}
                    <motion.div className="absolute -bottom-0.5 left-0 h-px"
                      style={{ background: 'linear-gradient(90deg, #C9A84C, #F5E09A)' }}
                      initial={{ width: 0 }}
                      animate={{ width: active ? '100%' : '0%' }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }} />
                  </Link>
                )
              })}

              <div className="w-px h-4 bg-silver-800" />

              {state.isAuthenticated ? (
                <motion.button onClick={handleCTA}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="font-sans text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-300"
                  style={{ color: '#C9A84C', border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.06)' }}>
                  {state.userRole === 'admin' ? 'Dashboard' : 'Academy'}
                </motion.button>
              ) : (
                <motion.button onClick={handleCTA}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-gold inline-flex items-center gap-1.5 text-xs py-2.5 px-5">
                  Enter Academy <ArrowRight size={11} />
                </motion.button>
              )}
            </nav>

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(o => !o)}
              className="lg:hidden w-9 h-9 flex items-center justify-center text-silver-400 hover:text-pearl transition-colors">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-30 lg:hidden"
            style={{ background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
            <div className="px-6 py-6 space-y-4">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className="block font-sans text-sm font-light tracking-widest uppercase py-2 transition-colors"
                  style={{ color: location.pathname === link.to ? '#C9A84C' : 'rgba(255,255,255,0.6)' }}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/5">
                <button onClick={handleCTA}
                  className="btn-gold w-full flex items-center justify-center gap-2 text-xs py-3">
                  {state.isAuthenticated ? (state.userRole === 'admin' ? 'Dashboard' : 'My Academy') : 'Enter Academy'}
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
