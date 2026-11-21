import React from 'react'
import { motion } from 'framer-motion'
import {
  Map, CheckCircle2, Circle, ArrowRight, Sparkles,
  BookOpen, Video, Code2, Target, Calendar
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const ROADMAP_STEPS = [
  {
    week: 'Phase 1: Foundations & Core DSA',
    status: 'completed',
    items: [
      { title: 'Array Manipulation & Two Pointers', type: 'DSA', completed: true, link: '/coding/two-sum' },
      { title: 'Time & Space Complexity (Big-O analysis)', type: 'Theory', completed: true, link: '/learn/python' },
      { title: 'Self-Introduction & Elevator Pitch with Arvi', type: 'HR', completed: true, link: '/communication' }
    ]
  },
  {
    week: 'Phase 2: Intermediate Data Structures',
    status: 'current',
    items: [
      { title: 'Linked Lists & Two Pointer Cycle Detection', type: 'DSA', completed: true, link: '/coding' },
      { title: 'Binary Trees & BFS/DFS Traversal', type: 'DSA', completed: false, link: '/coding' },
      { title: 'Technical Interview with Anway (DSA Focus)', type: 'Mock', completed: false, link: '/interview/setup?type=technical' }
    ]
  },
  {
    week: 'Phase 3: Algorithms & Complex Topics',
    status: 'upcoming',
    items: [
      { title: 'Dynamic Programming & Memoization', type: 'DSA', completed: false, link: '/coding/max-subarray' },
      { title: 'Graph Algorithms: Topological Sort & Dijkstra', type: 'DSA', completed: false, link: '/coding' },
      { title: 'STAR Method Behavioral Prep with Arvi', type: 'HR', completed: false, link: '/communication' }
    ]
  },
  {
    week: 'Phase 4: Company Simulation & Full Placement',
    status: 'upcoming',
    items: [
      { title: 'Google / Amazon Company-Specific Pack', type: 'Company', completed: false, link: '/companies/google' },
      { title: 'System Design Fundamentals (Scalability, Caching)', type: 'Architecture', completed: false, link: '/learn/sql' },
      { title: 'End-to-End Placement Simulation with Anway & Arvi', type: 'Simulation', completed: false, link: '/mock' }
    ]
  }
]

export default function RoadmapPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            Personal AI <span className="gradient-text">Learning Roadmap</span>
          </h1>
          <p className="text-gray-400">
            A dynamic placement preparation curriculum tailored to your skills, target companies, and interview performance.
          </p>
        </div>

        {/* Dynamic AI Alert */}
        <div className="card p-5 border-blue-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Dynamic AI Adaptation Active</div>
              <p className="text-xs text-gray-400">
                Based on your recent scores, we prioritised Binary Tree Traversals and Behavioral practice.
              </p>
            </div>
          </div>
          <Link to="/interview/setup" className="btn-primary text-xs py-2 px-4 whitespace-nowrap">
            Take Assessment
          </Link>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {ROADMAP_STEPS.map((phase, pIdx) => (
            <motion.div
              key={phase.week}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pIdx * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${phase.status === 'completed' ? 'bg-green-400' : phase.status === 'current' ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`} />
                  <h3 className="text-white font-bold text-base">{phase.week}</h3>
                </div>
                <span className={`badge text-xs uppercase ${phase.status === 'completed' ? 'badge-green' : phase.status === 'current' ? 'badge-blue' : 'text-gray-500'}`}>
                  {phase.status}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                {phase.items.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="badge badge-purple text-[10px]">{item.type}</span>
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <h4 className="text-xs font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    <div className="mt-3 flex items-center text-[11px] text-blue-400 font-medium">
                      Start Task <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
