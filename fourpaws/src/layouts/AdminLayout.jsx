import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, MessageCircle, BarChart3,
  Share2, LogOut, Menu, X, ChevronRight, Bell, Shield,
  FileText, StickyNote, UserCog, BookOpen,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { TeacherPanel, HelpTrigger, HelpCentre } from '../components/ui/TeacherPanel'
import { useTeacher } from '../hooks/useTeacher'

const NAV_GROUPS = [
  {
    label: 'Intelligence',
    items: [
      { icon: LayoutDashboard, label: 'Operations',   to: '/admin' },
      { icon: BarChart3,       label: 'Analytics',    to: '/admin/analytics' },
      { icon: FileText,        label: 'Reports',      to: '/admin/reports' },
    ],
  },
  {
    label: 'Clients',
    items: [
      { icon: Users,           label: 'Client Roster',to: '/admin/clients' },
      { icon: MessageCircle,   label: 'Messages',     to: '/admin/messages' },
      { icon: StickyNote,      label: 'Staff Notes',  to: '/admin/notes' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { icon: Share2,          label: 'Distribution', to: '/admin/distribution' },
      { icon: UserCog,         label: 'Trainer Team', to: '/admin/team' },
    ],
  },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const teacher = useTeacher('admin')
  const location = useLocation()
  const navigate = useNavigate()
  const { state, logout } = useApp()

  const handleLogout = () => { logout(); navigate('/') }

  const isActive = (to) => to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to)

  return (
    <div className="min-h-screen bg-charcoal-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30 border-r border-white/5"
        style={{ background: 'rgba(8,8,8,0.98)' }}>
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-xl">🐾</span>
            <div>
              <div className="font-display text-xs font-light tracking-[0.15em] text-pearl uppercase">Four Paws</div>
              <div className="font-sans text-[8px] font-medium tracking-[0.3em] uppercase text-gold-500">Control Centre</div>
            </div>
          </Link>
        </div>

        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-gold-500/50 flex items-center justify-center">
              <Shield size={14} className="text-gold-500" />
            </div>
            <div>
              <div className="font-sans text-xs font-medium text-pearl">Academy Admin</div>
              <div className="font-sans text-[10px] text-gold-600 tracking-widest uppercase">Master Access</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="mb-2">
              <div className="px-4 py-2 font-sans text-[7px] uppercase tracking-[0.4em] text-silver-800">
                {group.label}
              </div>
              {group.items.map(item => (
                <Link key={item.label} to={item.to} className={`sidebar-item ${isActive(item.to) ? 'active' : ''}`}>
                  <item.icon size={15} />
                  <span>{item.label}</span>
                  {isActive(item.to) && <ChevronRight size={11} className="ml-auto text-gold-500" />}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <div className="pb-2">
            <HelpTrigger onClick={teacher.handleOpenHelp} label="Orientation" />
          </div>
          <Link to="/" className="sidebar-item w-full text-left">
            <span className="text-[11px] tracking-widest uppercase">View Website</span>
          </Link>
          <button onClick={handleLogout} className="sidebar-item w-full text-left hover:text-red-400">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-5 h-14 border-b border-white/5"
        style={{ background: 'rgba(8,8,8,0.98)' }}>
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-gold-500" />
          <span className="font-sans text-xs font-medium tracking-widest uppercase text-pearl">Control Centre</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-silver-400 hover:text-pearl transition-colors">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-20 bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-30 w-64 flex flex-col border-r border-white/5 lg:hidden"
              style={{ background: 'rgba(8,8,8,0.99)' }}>
              <div className="p-5 pt-16 space-y-1">
                {navItems.map(item => (
                  <Link key={item.label} to={item.to} onClick={() => setSidebarOpen(false)}
                    className={`sidebar-item ${isActive(item.to) ? 'active' : ''}`}>
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-auto p-5 border-t border-white/5">
                <button onClick={handleLogout} className="sidebar-item w-full text-left hover:text-red-400">
                  <LogOut size={16} /><span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        {/* AI Teacher — contextual guidance for admin surfaces */}
        {teacher.activeNode && (
          <div className="px-6 pt-6 max-w-2xl">
            <TeacherPanel
              node={teacher.activeNode}
              variant="admin"
              onComplete={teacher.handleComplete}
              onSkip={teacher.handleSkip}
              onSkipAll={teacher.handleSkipAll}
            />
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {/* Help Centre overlay */}
      <AnimatePresence>
        {teacher.helpOpen && (
          <HelpCentre
            surface="admin"
            resumable={teacher.resumable}
            completed={teacher.completed}
            progress={teacher.progress}
            onResume={teacher.handleResumeNode}
            onClose={teacher.handleCloseHelp}
            onReset={teacher.handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
