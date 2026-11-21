import React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, Award, TrendingUp, CheckCircle, Video,
  Code2, Clock, Calendar, ArrowUpRight
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import AppLayout from '../../components/layout/AppLayout'

const PERFORMANCE_TREND = [
  { test: 'Test 1', technical: 65, communication: 70, overall: 67 },
  { test: 'Test 2', technical: 72, communication: 68, overall: 70 },
  { test: 'Test 3', technical: 70, communication: 75, overall: 72 },
  { test: 'Test 4', technical: 78, communication: 82, overall: 80 },
  { test: 'Test 5', technical: 84, communication: 85, overall: 84 },
  { test: 'Test 6', technical: 88, communication: 86, overall: 87 }
]

const TOPIC_MASTERY = [
  { topic: 'Arrays & Strings', mastery: 85 },
  { topic: 'Linked Lists', mastery: 78 },
  { topic: 'Trees & BST', mastery: 68 },
  { topic: 'Dynamic Programming', mastery: 55 },
  { topic: 'Graphs', mastery: 62 },
  { topic: 'System Design', mastery: 72 }
]

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            Performance <span className="gradient-text">Analytics</span>
          </h1>
          <p className="text-gray-400">
            Deep dive into your interview trends, coding progress, and skill competency metrics.
          </p>
        </div>

        {/* High Level Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Overall Readiness', value: '82%', change: '+14% this month', icon: Award, color: 'text-green-400' },
            { label: 'Average Interview', value: '84/100', change: 'Top 10th percentile', icon: Video, color: 'text-blue-400' },
            { label: 'DSA Questions', value: '47 Solved', change: '12 this week', icon: Code2, color: 'text-purple-400' },
            { label: 'Practice Time', value: '38 Hours', change: 'Consistent habit', icon: Clock, color: 'text-yellow-400' }
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card p-5"
            >
              <item.icon className={`w-6 h-6 ${item.color} mb-2`} />
              <div className="text-2xl font-black text-white">{item.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.label}</div>
              <div className="text-[11px] text-green-400 mt-2 font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> {item.change}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Progress Over Time */}
          <div className="lg:col-span-8 card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-bold text-base">Interview Score Progression</h3>
                <p className="text-xs text-gray-400">Tracking score trajectory across consecutive mock interviews</p>
              </div>
              <span className="badge badge-blue text-xs">Last 6 Sessions</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_TREND}>
                  <defs>
                    <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="test" stroke="#6b7280" fontSize={11} />
                  <YAxis domain={[50, 100]} stroke="#6b7280" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#111845', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="overall" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorOverall)" />
                  <Area type="monotone" dataKey="technical" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex gap-4 mt-3 text-xs text-gray-400 justify-center">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-blue-500" /> Overall Score
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-purple-500 border-dashed" /> Technical Sub-Score
              </div>
            </div>
          </div>

          {/* DSA Topic Mastery */}
          <div className="lg:col-span-4 card p-6">
            <h3 className="text-white font-bold text-base mb-1">DSA Topic Mastery</h3>
            <p className="text-xs text-gray-400 mb-4">Competency percentage by category</p>

            <div className="space-y-3">
              {TOPIC_MASTERY.map((t) => (
                <div key={t.topic} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-medium">{t.topic}</span>
                    <span className="text-blue-400 font-bold">{t.mastery}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full"
                      style={{ width: `${t.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
