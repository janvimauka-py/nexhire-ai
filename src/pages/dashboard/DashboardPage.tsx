import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Video, Code2, MessageSquare, FileText, Building2, TrendingUp,
  Flame, Target, Award, ChevronRight, Play, BookOpen, Zap,
  Clock, CheckCircle, BarChart2, ArrowUpRight
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../contexts/AuthContext'

const WEEKLY_DATA = [
  { day: 'Mon', interviews: 1, problems: 3, score: 65 },
  { day: 'Tue', interviews: 0, problems: 5, score: 0 },
  { day: 'Wed', interviews: 2, problems: 2, score: 72 },
  { day: 'Thu', interviews: 1, problems: 7, score: 78 },
  { day: 'Fri', interviews: 2, problems: 4, score: 80 },
  { day: 'Sat', interviews: 3, problems: 8, score: 85 },
  { day: 'Sun', interviews: 1, problems: 6, score: 82 },
]

const SKILL_RADAR = [
  { subject: 'DSA', A: 70, fullMark: 100 },
  { subject: 'Coding', A: 75, fullMark: 100 },
  { subject: 'System Design', A: 45, fullMark: 100 },
  { subject: 'Communication', A: 80, fullMark: 100 },
  { subject: 'Problem Solving', A: 65, fullMark: 100 },
  { subject: 'CS Fundamentals', A: 72, fullMark: 100 },
]

const QUICK_ACTIONS = [
  { icon: Video, label: 'AI Interview', desc: 'Practice with Anway or Arvi', href: '/interview/setup', color: 'from-blue-500 to-blue-700', badge: 'Most Used' },
  { icon: Code2, label: 'DSA Practice', desc: 'Solve today\'s challenge', href: '/coding', color: 'from-purple-500 to-purple-700', badge: 'Daily' },
  { icon: MessageSquare, label: 'Communication', desc: 'Speak with Arvi', href: '/communication', color: 'from-green-500 to-teal-700', badge: null },
  { icon: FileText, label: 'Resume Check', desc: 'ATS score analysis', href: '/resume', color: 'from-orange-500 to-red-600', badge: null },
]

const RECENT_ACTIVITY = [
  { type: 'interview', text: 'Completed Technical Interview', score: 78, time: '2 hours ago', icon: Video },
  { type: 'coding', text: 'Solved: Two Sum (Easy)', score: null, time: '5 hours ago', icon: Code2 },
  { type: 'coding', text: 'Solved: Valid Parentheses (Easy)', score: null, time: 'Yesterday', icon: Code2 },
  { type: 'interview', text: 'Completed HR Interview', score: 85, time: '2 days ago', icon: MessageSquare },
]

const RECOMMENDED = [
  { title: 'Binary Trees – Complete Guide', type: 'DSA Topic', difficulty: 'Medium', href: '/coding' },
  { title: 'Google – System Design Round', type: 'Company Prep', difficulty: 'Hard', href: '/companies/google' },
  { title: 'Self Introduction Practice', type: 'Communication', difficulty: 'Easy', href: '/communication' },
]

export default function DashboardPage() {
  const { profile, user } = useAuth()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">
              {greeting}, <span className="gradient-text">{firstName}!</span> 👋
            </h1>
            <p className="text-gray-400 mt-1">
              {profile?.college && `${profile.college} • `}
              {profile?.branch && `${profile.branch} • `}
              Ready to ace your interviews?
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
              <Flame size={18} className="text-orange-400" />
              <span className="text-orange-400 font-bold">7 Day Streak 🔥</span>
            </div>
            <Link to="/interview/setup" className="btn-primary flex items-center gap-2 py-2">
              <Play size={16} /> Start Interview
            </Link>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Interviews Done', value: '12', icon: Video, color: 'text-blue-400', bg: 'rgba(59,130,246,0.1)' },
            { label: 'Problems Solved', value: '47', icon: Code2, color: 'text-purple-400', bg: 'rgba(124,58,237,0.1)' },
            { label: 'Avg. Score', value: '78%', icon: Award, color: 'text-yellow-400', bg: 'rgba(234,179,8,0.1)' },
            { label: 'Hours Practiced', value: '24h', icon: Clock, color: 'text-green-400', bg: 'rgba(34,197,94,0.1)' },
          ].map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <ArrowUpRight size={16} className="text-gray-600" />
              </div>
              <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.div key={action.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={action.href}
                  className="card p-5 block group cursor-pointer hover:-translate-y-2">
                  {action.badge && (
                    <span className="badge badge-blue text-xs mb-3 inline-block">{action.badge}</span>
                  )}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon size={22} className="text-white" />
                  </div>
                  <div className="text-white font-semibold text-sm">{action.label}</div>
                  <div className="text-gray-400 text-xs mt-1">{action.desc}</div>
                  <div className="mt-3 flex items-center text-blue-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Start now <ChevronRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Weekly Activity */}
          <div className="card md:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-400" /> Weekly Activity
              </h3>
              <span className="badge badge-blue text-xs">Last 7 days</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={WEEKLY_DATA}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#111845', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" fill="url(#scoreGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="problems" stroke="#7c3aed" fill="none" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3 h-0.5 bg-blue-500" /> Interview Score
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3 h-0.5 bg-purple-500 border-dashed" style={{ borderTop: '2px dashed #7c3aed', background: 'none' }} />
                Problems Solved
              </div>
            </div>
          </div>

          {/* Skill Radar */}
          <div className="card p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Target size={18} className="text-purple-400" /> Skill Map
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={SKILL_RADAR}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
            <Link to="/analytics" className="mt-4 flex items-center justify-center text-blue-400 text-sm font-medium hover:text-blue-300">
              Full Analytics <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Clock size={18} className="text-blue-400" /> Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <activity.icon size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{activity.text}</div>
                    <div className="text-gray-500 text-xs">{activity.time}</div>
                  </div>
                  {activity.score && (
                    <span className="badge badge-green text-xs">{activity.score}%</span>
                  )}
                  {!activity.score && (
                    <CheckCircle size={16} className="text-green-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Practice */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <BookOpen size={18} className="text-purple-400" /> AI Recommendations
              </h3>
              <span className="badge badge-purple text-xs">Personalised</span>
            </div>
            <div className="space-y-3">
              {RECOMMENDED.map((rec, i) => (
                <Link key={i} to={rec.href}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5 group">
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">{rec.title}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{rec.type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge text-xs ${rec.difficulty === 'Easy' ? 'badge-green' : rec.difficulty === 'Medium' ? 'badge-coral' : 'badge-red'}`}>
                      {rec.difficulty}
                    </span>
                    <ChevronRight size={14} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/roadmap" className="mt-4 flex items-center justify-center text-blue-400 text-sm font-medium hover:text-blue-300">
              View Full Roadmap <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Target Companies */}
        {profile?.target_companies && profile.target_companies.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Target size={18} className="text-coral-400" style={{ color: '#f97316' }} /> Your Target Companies
              </h3>
              <Link to="/companies" className="text-blue-400 text-sm hover:text-blue-300">View all →</Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile.target_companies.map(company => (
                <Link key={company} to={`/companies/${company.toLowerCase()}`}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg, rgba(30,64,175,0.3), rgba(124,58,237,0.3))', border: '1px solid rgba(59,130,246,0.2)' }}>
                  {company}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
