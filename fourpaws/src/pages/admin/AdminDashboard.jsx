import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, BookOpen, MessageCircle, TrendingUp, Activity, ArrowRight, Wifi } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useApp } from '../../context/AppContext'

import { COURSES } from '../../data/courses'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs font-sans text-silver-300 border border-gold-500/20">
        <div className="text-gold-500 mb-1">{label}</div>
        <div>{payload[0].value} lessons</div>
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  const { state } = useApp()
  const [analyticsData, setAnalyticsData] = React.useState(null)
  React.useEffect(() => {
    import('../../dev/mockClients').then(({ getAnalyticsData }) => {
      setAnalyticsData(getAnalyticsData())
    })
  }, [])
  if (!analyticsData) return null
  const navigate = useNavigate()
  const analytics = analyticsData

  const statCards = [
    { icon: Users, label: 'Total Clients', value: analytics.totalClients, sub: `${analytics.activeClients} active`, to: '/admin/clients' },
    { icon: BookOpen, label: 'Total Enrollments', value: analytics.totalEnrollments, sub: `${COURSES.length} courses available`, to: '/admin/clients' },
    { icon: TrendingUp, label: 'Avg. Progress', value: `${analytics.avgProgress}%`, sub: 'across all clients', to: '/admin/analytics' },
    { icon: Wifi, label: 'PWA Installed', value: analytics.pwaInstalled, sub: `of ${analytics.totalClients} clients`, to: '/admin/distribution' },
  ]

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <FadeIn className="mb-10">
        <div className="section-label mb-2">Master Control</div>
        <h1 className="luxury-heading text-4xl lg:text-5xl mb-2">Academy Dashboard</h1>
        <p className="font-sans text-sm font-light text-silver-600">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </FadeIn>

      {/* Stat cards */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(card => (
          <StaggerItem key={card.label}>
            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => navigate(card.to)}
              className="glass-card gold-border-hover p-5 cursor-pointer"
            >
              <card.icon size={16} className="text-gold-500 mb-3" />
              <div className="stat-number text-3xl mb-1">{card.value}</div>
              <div className="font-sans text-[10px] text-silver-600 tracking-widest uppercase mb-1">{card.label}</div>
              <div className="font-sans text-[10px] text-silver-700">{card.sub}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly chart */}
        <FadeIn className="lg:col-span-2">
          <div className="glass-card p-6 h-full" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="section-label mb-1">This Week</div>
                <h3 className="font-serif text-lg text-pearl">Lesson Activity</h3>
              </div>
              <Activity size={16} className="text-gold-500" />
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={analytics.weeklyProgress} barSize={20}>
                <XAxis dataKey="day" axisLine={false} tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter' }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201,168,76,0.05)' }} />
                <Bar dataKey="lessons" fill="url(#goldGrad)" radius={[2, 2, 0, 0]} />
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5E09A" />
                    <stop offset="100%" stopColor="#B8962A" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </FadeIn>

        {/* Course popularity */}
        <FadeIn>
          <div className="glass-card p-6 h-full" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="section-label mb-1">Courses</div>
            <h3 className="font-serif text-lg text-pearl mb-5">Enrollment</h3>
            <div className="space-y-4">
              {analytics.coursePopularity.map(c => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-sans text-xs text-silver-400">{c.name}</span>
                    <span className="font-sans text-xs text-gold-500">{c.enrolled}</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.enrolled / analytics.totalClients) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <FadeIn>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="section-label mb-1">Live Feed</div>
                <h3 className="font-serif text-lg text-pearl">Recent Activity</h3>
              </div>
            </div>
            <div className="space-y-4">
              {analytics.recentActivity.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-sm font-medium text-pearl">{item.client}</span>
                    <span className="font-sans text-sm font-light text-silver-500"> {item.action}</span>
                    {item.course && <div className="font-sans text-xs text-silver-600 truncate">{item.course}</div>}
                  </div>
                  <span className="font-sans text-[10px] text-silver-700 flex-shrink-0">{item.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Quick actions */}
        <FadeIn>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="section-label mb-1">Quick Access</div>
            <h3 className="font-serif text-lg text-pearl mb-5">Control Centre</h3>
            <div className="space-y-3">
              {[
                { label: 'Manage Clients', sub: `${analytics.totalClients} members`, to: '/admin/clients', icon: Users },
                { label: 'Messages', sub: 'View all conversations', to: '/admin/messages', icon: MessageCircle },
                { label: 'Analytics', sub: 'Detailed reporting', to: '/admin/analytics', icon: TrendingUp },
                { label: 'App Distribution', sub: 'Share academy access', to: '/admin/distribution', icon: Wifi },
              ].map(item => (
                <motion.button
                  key={item.label}
                  whileHover={{ x: 4 }}
                  onClick={() => navigate(item.to)}
                  className="w-full flex items-center gap-4 p-3 rounded-none border border-white/5 hover:border-gold-500/20 transition-all text-left"
                >
                  <div className="w-8 h-8 bg-charcoal-800 flex items-center justify-center flex-shrink-0">
                    <item.icon size={14} className="text-gold-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-sans text-sm font-medium text-pearl">{item.label}</div>
                    <div className="font-sans text-xs text-silver-600">{item.sub}</div>
                  </div>
                  <ArrowRight size={14} className="text-silver-700" />
                </motion.button>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
