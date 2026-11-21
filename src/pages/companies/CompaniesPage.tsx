import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Code2, MessageSquare, Building2, Video } from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'

const COMPANIES = [
  {
    id: 'google', name: 'Google', icon: '🔵', color: 'from-blue-500 to-green-500',
    rounds: ['Online Assessment', 'Phone Screen (Technical)', 'Technical Onsite (4 rounds)', 'Hiring Committee Review'],
    focus: ['Data Structures & Algorithms', 'System Design', 'Coding (Python/Java/C++)', 'Behavioural (Googleyness)'],
    difficulty: 'Expert',
    openings: 'SDE, L3–L7, ML Engineer, TPM',
  },
  {
    id: 'microsoft', name: 'Microsoft', icon: '🟦', color: 'from-blue-600 to-blue-800',
    rounds: ['Online Assessment', 'Phone Screen', 'Onsite (4–5 rounds)', 'As-Appropriate Review'],
    focus: ['Coding & DSA', 'OOP Design', 'System Design', 'Behavioural (Growth Mindset)'],
    difficulty: 'Advanced',
    openings: 'SDE, PM, Data Scientist',
  },
  {
    id: 'amazon', name: 'Amazon', icon: '🟠', color: 'from-orange-500 to-yellow-600',
    rounds: ['OA (SHL/HackerRank)', 'Phone Screen', 'Onsite Loop (5–6 rounds)', 'Bar Raiser Round'],
    focus: ['DSA & Coding', 'Leadership Principles (14)', 'System Design', 'Behavioural STAR method'],
    difficulty: 'Advanced',
    openings: 'SDE I & II, TPM, Applied Scientist',
  },
  {
    id: 'meta', name: 'Meta', icon: '🔷', color: 'from-blue-500 to-purple-600',
    rounds: ['Recruiter Screen', 'Technical Phone', 'Onsite (Coding + System Design + Behavioural)'],
    focus: ['Pure DSA (LeetCode Hard)', 'System Design at Scale', 'Product Sense', 'Cross-functional'],
    difficulty: 'Expert',
    openings: 'E3–E5 SWE, Research Scientist',
  },
  {
    id: 'apple', name: 'Apple', icon: '⬜', color: 'from-gray-500 to-gray-700',
    rounds: ['Technical Phone Screen', 'Onsite (4–6 rounds)', 'Cross-team Interviews'],
    focus: ['Coding & Algorithms', 'System Design', 'Attention to Detail', 'Product Quality'],
    difficulty: 'Advanced',
    openings: 'Software Engineer, ML Researcher',
  },
  {
    id: 'deepmind', name: 'DeepMind', icon: '🟣', color: 'from-purple-500 to-indigo-700',
    rounds: ['CV Screen', 'Technical Interview', 'Research Presentation', 'Team Matching'],
    focus: ['ML/DL Fundamentals', 'Research Paper Discussion', 'Mathematics', 'Coding in Python'],
    difficulty: 'Expert',
    openings: 'Research Engineer, Research Scientist',
  },
  {
    id: 'adobe', name: 'Adobe', icon: '🔴', color: 'from-red-500 to-red-700',
    rounds: ['Online Test', 'Phone Screen', 'Onsite Technical', 'HR Round'],
    focus: ['DSA', 'OOP & Design Patterns', 'System Design', 'Project Discussion'],
    difficulty: 'Intermediate',
    openings: 'MTS, Computer Scientist',
  },
  {
    id: 'infosys', name: 'Infosys', icon: '🟤', color: 'from-indigo-500 to-blue-700',
    rounds: ['Online Aptitude Test', 'Technical Interview', 'HR Interview'],
    focus: ['Aptitude & Reasoning', 'Core CS Fundamentals', 'Basic DSA', 'Communication'],
    difficulty: 'Beginner',
    openings: 'Systems Engineer, Technology Analyst',
  },
  {
    id: 'tcs', name: 'TCS', icon: '🟩', color: 'from-blue-600 to-teal-600',
    rounds: ['TCS NQT (National Qualifier Test)', 'Technical Interview', 'Managerial', 'HR'],
    focus: ['Aptitude', 'Coding Skills', 'Core CS', 'Communication & English'],
    difficulty: 'Beginner',
    openings: 'Trainee, Developer, Analyst',
  },
  {
    id: 'accenture', name: 'Accenture', icon: '🔵', color: 'from-purple-500 to-blue-600',
    rounds: ['Cognitive Ability Test', 'Technical & Professional Skills', 'HR Round'],
    focus: ['Aptitude & Reasoning', 'Technical Knowledge', 'Communication', 'Situational'],
    difficulty: 'Beginner',
    openings: 'Associate Software Engineer, Analyst',
  },
]

export default function CompaniesPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white mb-2">
            Company <span className="gradient-text">Preparation</span>
          </h1>
          <p className="text-gray-400">Company-specific interview prep with rounds, questions, and mock interviews</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {COMPANIES.map((company, i) => (
            <motion.div key={company.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/companies/${company.id}`}
                className="card block group hover:-translate-y-2 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${company.color} flex items-center justify-center text-2xl`}>
                      {company.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-black text-xl group-hover:text-blue-400 transition-colors">{company.name}</h3>
                      <p className="text-gray-400 text-xs mt-0.5">{company.openings}</p>
                    </div>
                  </div>
                  <span className={`badge text-xs ${
                    company.difficulty === 'Expert' ? 'badge-red' :
                    company.difficulty === 'Advanced' ? 'badge-coral' :
                    company.difficulty === 'Intermediate' ? 'badge-blue' : 'badge-green'
                  }`}>{company.difficulty}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Interview Rounds</div>
                    <div className="space-y-1">
                      {company.rounds.slice(0, 3).map((r, j) => (
                        <div key={j} className="flex items-center gap-2 text-gray-300 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                          {r}
                        </div>
                      ))}
                      {company.rounds.length > 3 && <div className="text-gray-500 text-xs">+{company.rounds.length - 3} more</div>}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Focus Areas</div>
                    <div className="space-y-1">
                      {company.focus.slice(0, 3).map((f, j) => (
                        <div key={j} className="flex items-center gap-2 text-gray-300 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Code2 size={12} /> DSA Questions</span>
                    <span className="flex items-center gap-1"><Video size={12} /> Mock Interview</span>
                    <span className="flex items-center gap-1"><MessageSquare size={12} /> HR Questions</span>
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
