import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Video, Code2, MessageSquare, ChevronRight, Play,
  Clock, BarChart2, Building2, Mic
} from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'

const INTERVIEW_TYPES = [
  { id: 'technical', label: 'Technical Interview', desc: 'DSA, algorithms, CS fundamentals with Anway', icon: Code2, color: 'from-blue-500 to-blue-700', interviewer: 'anway' },
  { id: 'hr', label: 'HR Interview', desc: 'Behavioural, situational, and HR questions with Arvi', icon: MessageSquare, color: 'from-purple-500 to-purple-700', interviewer: 'arvi' },
  { id: 'coding', label: 'Coding Assessment', desc: 'Live coding round with problem-solving', icon: Code2, color: 'from-green-500 to-teal-700', interviewer: 'anway' },
  { id: 'full', label: 'Full Placement Sim', desc: 'Complete placement simulation – all rounds', icon: Video, color: 'from-orange-500 to-red-600', interviewer: 'both' },
  { id: 'communication', label: 'Communication Coach', desc: 'English fluency and professional communication', icon: Mic, color: 'from-pink-500 to-rose-600', interviewer: 'arvi' },
  { id: 'company', label: 'Company Specific', desc: 'Tailored for your target company', icon: Building2, color: 'from-cyan-500 to-blue-600', interviewer: 'anway' },
]

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'DeepMind', 'Adobe', 'Infosys', 'TCS', 'Accenture']
const ROLES = ['SDE-1 / Software Engineer', 'SDE-2 / Senior Engineer', 'Data Scientist', 'ML Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Product Manager']
const DIFFICULTIES = [
  { id: 'beginner', label: 'Beginner', desc: 'Entry-level, 0–1 years experience' },
  { id: 'intermediate', label: 'Intermediate', desc: '1–3 years experience' },
  { id: 'advanced', label: 'Advanced', desc: '3–5 years experience' },
  { id: 'expert', label: 'Expert', desc: '5+ years, senior roles' },
]
const INTERVIEWERS = [
  { id: 'anway', name: 'Anway', role: 'Technical Interviewer', color: '#3b82f6', desc: 'Technical, DSA, Coding' },
  { id: 'arvi', name: 'Arvi', role: 'HR Coach', color: '#7c3aed', desc: 'HR, Communication, Soft Skills' },
]

export default function InterviewSetupPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<string>('Google')
  const [selectedRole, setSelectedRole] = useState<string>(ROLES[0])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('intermediate')
  const [selectedInterviewer, setSelectedInterviewer] = useState<string>('anway')
  const [duration, setDuration] = useState<number>(30)
  const navigate = useNavigate()

  const selectedTypeData = INTERVIEW_TYPES.find(t => t.id === selectedType)

  function handleStart() {
    if (!selectedType) return
    const params = new URLSearchParams({
      type: selectedType,
      company: selectedCompany,
      role: selectedRole,
      difficulty: selectedDifficulty,
      interviewer: selectedInterviewer,
      duration: duration.toString(),
    })
    navigate(`/interview/room?${params}`)
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white mb-2">Set Up Your <span className="gradient-text">AI Interview</span></h1>
          <p className="text-gray-400">Configure your interview session and start practising</p>
        </motion.div>

        {/* Interview Type */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-black">1</span>
            Choose Interview Type
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {INTERVIEW_TYPES.map(type => (
              <div key={type.id} onClick={() => {
                setSelectedType(type.id)
                setSelectedInterviewer(type.interviewer === 'arvi' ? 'arvi' : 'anway')
              }}
                className={`card cursor-pointer transition-all ${selectedType === type.id ? 'border-blue-500/50' : ''}`}
                style={selectedType === type.id ? { background: 'rgba(30,64,175,0.2)', border: '1px solid rgba(59,130,246,0.5)' } : {}}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                  <type.icon size={18} className="text-white" />
                </div>
                <div className="text-white font-semibold text-sm mb-1">{type.label}</div>
                <div className="text-gray-400 text-xs">{type.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Interviewer Selection */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-black">2</span>
              Select AI Interviewer
            </h2>
            <div className="space-y-3">
              {INTERVIEWERS.map(interviewer => (
                <div key={interviewer.id} onClick={() => setSelectedInterviewer(interviewer.id)}
                  className={`card cursor-pointer p-4 ${selectedInterviewer === interviewer.id ? 'border-blue-500/50' : ''}`}
                  style={selectedInterviewer === interviewer.id ? { background: `rgba(${interviewer.id === 'anway' ? '59,130,246' : '124,58,237'},0.15)`, border: `1px solid ${interviewer.color}50` } : {}}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white"
                      style={{ background: `linear-gradient(135deg, ${interviewer.color}, ${interviewer.id === 'anway' ? '#7c3aed' : '#a855f7'})` }}>
                      {interviewer.name[0]}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{interviewer.name}</div>
                      <div className="text-gray-400 text-xs">{interviewer.role} – {interviewer.desc}</div>
                    </div>
                    {selectedInterviewer === interviewer.id && (
                      <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: interviewer.color }}>
                        <ChevronRight size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="space-y-4">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-black">3</span>
              Configure Session
            </h2>

            {selectedType === 'company' && (
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Target Company</label>
                <select value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)} className="input-field">
                  {COMPANIES.map(c => <option key={c} value={c} style={{ background: '#111845' }}>{c}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Job Role</label>
              <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="input-field">
                {ROLES.map(r => <option key={r} value={r} style={{ background: '#111845' }}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Difficulty Level</label>
              <div className="grid grid-cols-2 gap-2">
                {DIFFICULTIES.map(d => (
                  <div key={d.id} onClick={() => setSelectedDifficulty(d.id)}
                    className={`card p-3 cursor-pointer text-xs ${selectedDifficulty === d.id ? 'border-blue-500/50' : ''}`}
                    style={selectedDifficulty === d.id ? { background: 'rgba(30,64,175,0.2)' } : {}}>
                    <div className="text-white font-semibold">{d.label}</div>
                    <div className="text-gray-500">{d.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 flex items-center gap-2 justify-between">
                <span>Interview Duration</span>
                <span className="text-blue-400 font-semibold">{duration} minutes</span>
              </label>
              <input type="range" min={15} max={90} step={15} value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full accent-blue-500" />
              <div className="flex justify-between text-gray-500 text-xs mt-1">
                <span>15 min</span><span>30 min</span><span>45 min</span><span>60 min</span><span>90 min</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Summary & Start */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="card p-6"
          style={{ background: 'linear-gradient(135deg, rgba(30,64,175,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(59,130,246,0.3)' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Interview Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-gray-400 text-xs mb-1">Type</div>
                  <div className="text-white text-sm font-medium">{selectedTypeData?.label || 'Not selected'}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Interviewer</div>
                  <div className="text-white text-sm font-medium capitalize">{selectedInterviewer}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Difficulty</div>
                  <div className="text-white text-sm font-medium capitalize">{selectedDifficulty}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Duration</div>
                  <div className="text-white text-sm font-medium">{duration} minutes</div>
                </div>
              </div>
            </div>
            <button onClick={handleStart} disabled={!selectedType}
              className="btn-primary text-lg px-10 py-4 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0">
              <Play size={20} /> Start Interview
            </button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  )
}
