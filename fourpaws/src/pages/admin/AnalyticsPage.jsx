import React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, CartesianGrid
} from 'recharts'
import { useApp } from '../../context/AppContext'
import { getAnalyticsData } from '../../data/clients'
import { COURSES } from '../../data/courses'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

const GOLD_SHADES = ['#F5E09A', '#C9A84C', '#B8962A', '#9A7D22', '#7D641C']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs font-sans border border-gold-500/20">
        <div className="text-gold-400 mb-1">{label}</div>
        {payload.map(p => (
          <div key={p.name} className="text-silver-300">{p.name}: {p.value}</div>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const { state } = useApp()
  const analytics = getAnalyticsData()
  const clients = state.allClients || []

  const completionData = COURSES.map(course => {
    const enrolledClients = clients.filter(c => c.enrolledCourses.includes(course.id))
    const avgProgress = enrolledClients.length
      ? Math.round(enrolledClients.reduce((acc, c) => acc + (c.courseProgress?.[course.id]?.percentComplete || 0), 0) / enrolledClients.length)
      : 0
    return { name: course.title.split(' ').slice(0, 2).join(' '), progress: avgProgress, enrolled: enrolledClients.length }
  })

  const engagementData = [
    { month: 'Jan', lessons: 45, clients: 2 },
    { month: 'Feb', lessons: 78, clients: 4 },
    { month: 'Mar', lessons: 122, clients: 5 },
  ]

  const statusData = [
    { name: 'Active', value: clients.filter(c => c.status === 'active').length },
    { name: 'Inactive', value: clients.filter(c => c.status !== 'active').length },
  ]

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-6xl mx-auto">
      <FadeIn className="mb-10">
        <div className="section-label mb-2">Insights</div>
        <h1 className="luxury-heading text-4xl lg:text-5xl">Analytics</h1>
      </FadeIn>

      {/* KPI cards */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Members', value: analytics.totalClients, delta: '+2 this month' },
          { label: 'Active Clients', value: analytics.activeClients, delta: `${Math.round((analytics.activeClients / analytics.totalClients) * 100)}% of total` },
          { label: 'Avg Progress', value: `${analytics.avgProgress}%`, delta: 'across all courses' },
          { label: 'PWA Installs', value: analytics.pwaInstalled, delta: `${Math.round((analytics.pwaInstalled / analytics.totalClients) * 100)}% adoption` },
        ].map(card => (
          <StaggerItem key={card.label}>
            <div className="glass-card gold-border-hover p-5">
              <div className="stat-number text-3xl mb-1">{card.value}</div>
              <div className="font-sans text-[10px] text-silver-600 tracking-widest uppercase mb-1">{card.label}</div>
              <div className="font-sans text-[10px] text-silver-700">{card.delta}</div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly lessons chart */}
        <FadeIn className="lg:col-span-2">
          <div className="glass-card p-6 h-full" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="section-label mb-1">Activity</div>
            <h3 className="font-serif text-lg text-pearl mb-5">Lessons Completed This Week</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.weeklyProgress} barSize={22}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter' }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201,168,76,0.05)' }} />
                <Bar dataKey="lessons" fill="url(#goldBar)" radius={[3, 3, 0, 0]} />
                <defs>
                  <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5E09A" />
                    <stop offset="100%" stopColor="#C9A84C" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </FadeIn>

        {/* Client status */}
        <FadeIn>
          <div className="glass-card p-6 h-full" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="section-label mb-1">Members</div>
            <h3 className="font-serif text-lg text-pearl mb-5">Client Status</h3>
            <div className="flex items-center justify-center">
              <PieChart width={160} height={160}>
                <Pie data={statusData} cx={75} cy={75} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={index === 0 ? '#C9A84C' : '#2A2A2A'} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="flex items-center justify-center gap-6 mt-2">
              {statusData.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2 text-center">
                  <div className="w-2 h-2 rounded-full" style={{ background: i === 0 ? '#C9A84C' : '#2A2A2A', border: i === 1 ? '1px solid rgba(255,255,255,0.2)' : 'none' }} />
                  <div>
                    <div className="font-sans text-xs text-pearl">{s.value}</div>
                    <div className="font-sans text-[10px] text-silver-600">{s.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Course progress table */}
      <FadeIn className="mb-6">
        <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="section-label mb-1">Performance</div>
          <h3 className="font-serif text-lg text-pearl mb-5">Course Progress Overview</h3>
          <div className="space-y-4">
            {completionData.map((course, i) => (
              <div key={course.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-sans text-sm text-silver-300">{course.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-xs text-silver-600">{course.enrolled} enrolled</span>
                    <span className="font-sans text-xs text-gold-400">{course.progress}% avg</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Engagement over time */}
      <FadeIn>
        <div className="glass-card p-6" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="section-label mb-1">Growth</div>
          <h3 className="font-serif text-lg text-pearl mb-5">Engagement Over Time</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={engagementData}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter' }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="lessons" stroke="#C9A84C" strokeWidth={2} dot={{ fill: '#C9A84C', r: 4 }} name="Lessons" />
              <Line type="monotone" dataKey="clients" stroke="#F5E09A" strokeWidth={1.5} strokeDasharray="4 4" dot={{ fill: '#F5E09A', r: 3 }} name="Clients" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </FadeIn>
    </div>
  )
}
