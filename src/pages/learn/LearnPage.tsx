import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Code2, MessageSquare, ChevronRight, Star } from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'

const LANGUAGES = [
  { id: 'c', label: 'C Programming', icon: '⚡', desc: 'Master the foundation of programming', topics: 9, color: 'from-blue-500 to-blue-700', level: 'Beginner' },
  { id: 'cpp', label: 'C++ Programming', icon: '🔷', desc: 'OOP, STL, and modern C++', topics: 7, color: 'from-indigo-500 to-purple-700', level: 'Intermediate' },
  { id: 'java', label: 'Java', icon: '☕', desc: 'Enterprise-grade OOP development', topics: 8, color: 'from-orange-500 to-red-600', level: 'Intermediate' },
  { id: 'python', label: 'Python', icon: '🐍', desc: 'Data science, automation, AI/ML', topics: 10, color: 'from-green-500 to-teal-700', level: 'Beginner' },
  { id: 'javascript', label: 'JavaScript', icon: '🟨', desc: 'Web development and full-stack', topics: 11, color: 'from-yellow-500 to-orange-600', level: 'Beginner' },
  { id: 'html', label: 'HTML & CSS', icon: '🌐', desc: 'Web structure and styling', topics: 6, color: 'from-red-500 to-pink-600', level: 'Beginner' },
  { id: 'sql', label: 'SQL & Databases', icon: '🗃️', desc: 'Relational databases and queries', topics: 8, color: 'from-cyan-500 to-blue-700', level: 'Intermediate' },
]

export default function LearnPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white mb-2">
            Programming <span className="gradient-text">Learning Hub</span>
          </h1>
          <p className="text-gray-400">
            Comprehensive learning modules with interview questions, MCQs, and coding exercises
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LANGUAGES.map((lang, i) => (
            <motion.div key={lang.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={`/learn/${lang.id}`} className="card block group hover:-translate-y-2 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lang.color} flex items-center justify-center text-2xl`}>
                    {lang.icon}
                  </div>
                  <span className={`badge text-xs ${lang.level === 'Beginner' ? 'badge-green' : 'badge-blue'}`}>
                    {lang.level}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">{lang.label}</h3>
                <p className="text-gray-400 text-sm mb-4">{lang.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {lang.topics} Topics</span>
                    <span className="flex items-center gap-1"><Code2 size={12} /> Exercises</span>
                    <span className="flex items-center gap-1"><MessageSquare size={12} /> Q&A</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
