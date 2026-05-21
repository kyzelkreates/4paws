import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Package, MessageCircle,
  LogOut, Menu, X, ChevronRight, Bell
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/academy' },
  { icon: BookOpen, label: 'My Courses', to: '/academy' },
  { icon: Package, label: 'Add-Ons', to: '/academy/addons' },
  { icon: MessageCircle, label: 'Messages', to: '/academy' },
]

export default function AcademyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { state, logout } = useApp()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const client = state.allClients?.find(c => c.id === state.currentUser?.id) || state.currentUser

  return (
    <div className="min-h-screen bg-charcoal-900 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30 border-r border-white/5"
        style={{ background: 'rgba(10,10,10,0.95)' }}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-xl">🐾</span>
            <div>
              <div className="font-display text-xs font-light tracking-[0.15em] text-pearl uppercase">Four Paws</div>
              <div className="font-sans text-[8px] font-medium tracking-[0.3em] uppercase text-gold-500">Academy</div>
            </div>
          </Link>
        </div>

        {/* Client profile */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-charcoal-900 font-sans font-semibold text-sm">
              {(client?.name || 'C').charAt(0)}
            </div>
            <div>
              <div className="font-sans text-sm font-medium text-pearl truncate max-w-[140px]">{client?.name || 'Client'}</div>
              <div className="font-sans text-xs text-silver-600">{client?.dog?.name ? `${client.dog.name} · ${client.dog.breed}` : 'Academy Member'}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map(item => {
            const active = location.pathname === item.to
            return (
              <Link key={item.label} to={item.to} className={`sidebar-item ${active ? 'active' : ''}`}>
                <item.icon size={16} />
                <span>{item.label}</span>
                {active && <ChevronRight size={12} className="ml-auto text-gold-500" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <button onClick={handleLogout} className="sidebar-item w-full text-left hover:text-red-400">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-5 h-16 border-b border-white/5"
        style={{ background: 'rgba(10,10,10,0.97)' }}>
        <Link to="/" className="flex items-center gap-2">
          <span>🐾</span>
          <span className="font-display text-sm font-light tracking-widest text-pearl uppercase">Four Paws</span>
        </Link>
        <div className="flex items-center gap-3">
          <button className="text-silver-400 hover:text-gold-400 transition-colors">
            <Bell size={18} />
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-silver-400 hover:text-pearl transition-colors">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-30 w-72 flex flex-col border-r border-white/5 lg:hidden"
              style={{ background: 'rgba(10,10,10,0.98)' }}
            >
              <div className="p-5 pt-20 space-y-1">
                {navItems.map(item => {
                  const active = location.pathname === item.to
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`sidebar-item ${active ? 'active' : ''}`}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
              <div className="mt-auto p-5 border-t border-white/5">
                <button onClick={handleLogout} className="sidebar-item w-full text-left hover:text-red-400">
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
