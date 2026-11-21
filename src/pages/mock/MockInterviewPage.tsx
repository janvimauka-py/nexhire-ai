import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Video, Code2, Users, Target, Shield, CheckCircle2,
  Clock, Award, Play, ChevronRight, Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const MODES = [
  {
    id: 'technical',
    title: 'Technical Round Simulation',
    interviewer: 'Anway',
    duration: '45 mins',
    difficulty: 'Intermediate to Hard',
    color: 'from-blue-600 to-indigo-700',
    description: 'Deep dive into data structures, algorithm optimization, and time complexity with real-time code verification.',
    link: '/interview/setup?type=technical'
  },
  {
    id: 'dsa',
    title: 'Pure DSA Problem Solving',
    interviewer: 'Anway',
    duration: '30 mins',
    difficulty: 'Hard',
    color: 'from-indigo-600 to-purple-700',
    description: 'Solve 2 timed algorithmic problems while explaining your thought process clearly to the interviewer.',
    link: '/interview/setup?type=coding'
  },
  {
    id: 'hr',
    title: 'HR & Behavioral Interview',
    interviewer: 'Arvi',
    duration: '30 mins',
    difficulty: 'All Levels',
    color: 'from-purple-600 to-pink-700',
    description: 'Master cultural fit, conflict resolution, situational judgment, and leadership principles.',
    link: '/interview/setup?type=hr'
  },
  {
    id: 'placement',
    title: 'Full Campus Placement Simulation',
    interviewer: 'Anway & Arvi',
    duration: '60 mins',
    difficulty: 'Comprehensive',
    color: 'from-orange-500 to-red-600',
    badge: 'Flagship Exam',
    description: 'Complete multi-round simulation mimicking real recruitment drives at companies like Google, Microsoft, and Amazon.',
    link: '/interview/setup?type=full'
  }
]

export default function MockInterviewPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            Mock Interview <span className="gradient-text">Modes</span>
          </h1>
          <p className="text-gray-400">
            Choose a targeted simulation mode to evaluate your readiness under realistic interview conditions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {MODES.map((mode, i) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1"
            >
              {mode.badge && (
                <div className="absolute top-4 right-4">
                  <span className="badge badge-coral text-xs">{mode.badge}</span>
                </div>
              )}

              <div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-white mb-4`}>
                  <Video className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {mode.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span>Coach: <strong className="text-white">{mode.interviewer}</strong></span> • 
                  <span>Duration: <strong className="text-white">{mode.duration}</strong></span> • 
                  <span>Level: <strong className="text-white">{mode.difficulty}</strong></span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  {mode.description}
                </p>
              </div>

              <Link
                to={mode.link}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5"
              >
                <Play className="w-4 h-4" /> Start This Simulation
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
