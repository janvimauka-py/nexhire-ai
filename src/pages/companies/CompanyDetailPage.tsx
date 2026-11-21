import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Code2, MessageSquare, ChevronDown, AlertCircle } from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'

const COMPANY_DATA: Record<string, any> = {
  google: {
    name: 'Google', icon: '🔵',
    overview: 'Google is one of the most prestigious technology companies in the world. Their interview process is rigorous, focusing on algorithmic problem-solving, system design, and cultural fit ("Googleyness"). Expect LeetCode Medium-Hard problems.',
    disclaimer: 'Interview formats may change. This information is based on publicly available reports and common experiences. Always check Google\'s official careers page for the latest process.',
    rounds: [
      { name: 'Online Assessment / Phone Screen', desc: 'HackerRank or CodeSignal assessment (1-2 coding problems), or recruiter phone screen.' },
      { name: 'Technical Phone Interview', desc: '45-min coding interview via Google Meet with shared coding environment. 1-2 algorithmic problems.' },
      { name: 'Onsite Virtual – Round 1 (Coding)', desc: 'Algorithmic coding problem. Data structures, algorithms, optimisation. Medium-Hard difficulty.' },
      { name: 'Onsite Virtual – Round 2 (Coding)', desc: 'Another coding round with different problem type. Graphs, DP, or string manipulation.' },
      { name: 'Onsite Virtual – Round 3 (System Design)', desc: 'Design a large-scale distributed system. Focus on scalability, reliability, and trade-offs.' },
      { name: 'Onsite Virtual – Round 4 (Googleyness)', desc: 'Behavioural interview assessing cultural fit, leadership, teamwork, and "Googleyness".' },
      { name: 'Hiring Committee Review', desc: 'Your packet is reviewed by a committee. Offer is extended if approved.' },
    ],
    dsaTopics: ['Arrays & Hashing', 'Trees & Graphs (BFS/DFS)', 'Dynamic Programming', 'Binary Search', 'Sliding Window', 'Two Pointers', 'Heaps & Priority Queues', 'Trie', 'Backtracking', 'Intervals'],
    hrQuestions: [
      'Why do you want to work at Google?',
      'Tell me about a time you had to work with limited resources or tight deadlines.',
      'Describe a situation where you disagreed with your manager. How did you handle it?',
      'Tell me about a time you made a mistake. How did you fix it?',
      'What does "Googleyness" mean to you?',
      'How do you handle ambiguity when given an unclear project?',
    ],
    sampleProblems: [
      { title: 'Two Sum', difficulty: 'easy', link: '/coding/two-sum' },
      { title: 'Maximum Subarray', difficulty: 'medium', link: '/coding/max-subarray' },
      { title: 'Word Ladder', difficulty: 'hard', link: '/coding/two-sum' },
      { title: 'Meeting Rooms II', difficulty: 'medium', link: '/coding/two-sum' },
    ],
    preparation: [
      'Study LeetCode Medium and Hard problems daily (focus on Top 150)',
      'Practice system design with resources like "Designing Data-Intensive Applications"',
      'Review all major algorithm paradigms: DP, Greedy, Divide and Conquer',
      'Prepare STAR-method answers for 10+ behavioural situations',
      'Mock interviews with peers or platforms like Pramp, Interviewing.io',
    ],
  },
  amazon: {
    name: 'Amazon', icon: '🟠',
    overview: 'Amazon\'s interview process is unique due to heavy emphasis on Leadership Principles (LPs). Every interview, including technical ones, assesses LPs through behavioural questions. Prepare 14 LP stories minimum.',
    disclaimer: 'Amazon\'s process varies by team and role. The Bar Raiser is a mandatory cross-team interviewer. Information based on public sources.',
    rounds: [
      { name: 'Online Assessment (OA)', desc: 'SHL Cognitive Assessment + 2 coding problems on HackerRank. Time-limited.' },
      { name: 'Phone Screen', desc: 'Technical coding + 2-3 LP-based behavioural questions.' },
      { name: 'Onsite Loop (5-6 rounds)', desc: 'Mix of technical (coding, system design) and behavioural LP rounds.' },
      { name: 'Bar Raiser Round', desc: 'A special round by a trained Bar Raiser to maintain hiring standards.' },
    ],
    dsaTopics: ['Arrays, Strings, Hashing', 'Trees & BST', 'Graphs', 'DP', 'Sorting & Searching', 'OOP Design'],
    hrQuestions: [
      'Tell me about a time you demonstrated Customer Obsession.',
      'Describe a situation where you used data to make a decision (Data-Driven Leadership).',
      'Give an example of when you invented or simplified a process.',
      'Tell me about a time you had to deliver results with incomplete information.',
      'Have you ever had to push back on a decision? How did you handle it?',
    ],
    sampleProblems: [
      { title: 'Two Sum', difficulty: 'easy', link: '/coding/two-sum' },
      { title: 'Maximum Subarray', difficulty: 'medium', link: '/coding/max-subarray' },
      { title: 'LRU Cache', difficulty: 'medium', link: '/coding/two-sum' },
    ],
    preparation: [
      'Master all 14 Amazon Leadership Principles – prepare 2-3 STAR stories per principle',
      'Practice HackerRank-style coding problems with time constraints',
      'Study system design for distributed systems (messaging queues, databases)',
      'Focus on medium-difficulty LeetCode problems',
      'Practice thinking out loud – Amazon values communication during problem-solving',
    ],
  },
}

// Default data for companies not specifically detailed
function getDefaultData(id: string, name: string) {
  return {
    name, icon: '🏢',
    overview: `${name} has a structured interview process focusing on technical skills, problem-solving, and cultural fit. Preparation should include DSA, core CS fundamentals, and behavioural questions.`,
    disclaimer: 'Interview format may vary. Always check the official company careers page for the latest information.',
    rounds: [
      { name: 'Online Assessment', desc: 'Aptitude test, logical reasoning, and coding problems.' },
      { name: 'Technical Interview (1-2 rounds)', desc: 'DSA problems, CS fundamentals, project discussion.' },
      { name: 'HR Interview', desc: 'Communication, motivation, career goals, cultural fit.' },
    ],
    dsaTopics: ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'DP', 'Sorting'],
    hrQuestions: [
      `Why do you want to join ${name}?`,
      'Tell me about yourself and your projects.',
      'What is your greatest strength and weakness?',
      'Where do you see yourself in 5 years?',
      'Tell me about a challenging project you completed.',
    ],
    sampleProblems: [
      { title: 'Two Sum', difficulty: 'easy', link: '/coding/two-sum' },
      { title: 'Maximum Subarray', difficulty: 'medium', link: '/coding/max-subarray' },
    ],
    preparation: [
      'Master core DSA topics – arrays, trees, graphs, DP',
      'Prepare for aptitude and logical reasoning sections',
      'Practice explaining your projects clearly',
      'Work on communication and professional English',
      'Mock interviews to build confidence',
    ],
  }
}

export default function CompanyDetailPage() {
  const { company } = useParams()
  const data = COMPANY_DATA[company || ''] || getDefaultData(company || '', company ? company.charAt(0).toUpperCase() + company.slice(1) : 'Company')
  const [openRound, setOpenRound] = useState<number | null>(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'dsa' | 'hr' | 'prep'>('overview')

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/companies" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm">
            <ChevronLeft size={16} /> All Companies
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-4xl">
                {data.icon}
              </div>
              <div>
                <h1 className="text-4xl font-black text-white">{data.name}</h1>
                <p className="text-gray-400 mt-1">Preparation Guide & Mock Interview</p>
              </div>
            </div>
            <Link to={`/interview/setup?type=company&company=${data.name}`}
              className="btn-primary flex items-center gap-2 shrink-0">
              <Play size={16} /> Start Mock Interview
            </Link>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-xl"
          style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
          <AlertCircle size={16} className="text-orange-400 shrink-0 mt-0.5" />
          <p className="text-orange-300 text-sm">{data.disclaimer}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {([
            { id: 'overview', label: 'Interview Rounds' },
            { id: 'dsa', label: 'DSA Topics' },
            { id: 'hr', label: 'HR Questions' },
            { id: 'prep', label: 'Preparation Tips' },
          ] as const).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'gradient-primary text-white' : 'text-gray-400 hover:text-white bg-white/5'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="card p-6">
              <p className="text-gray-300 leading-relaxed">{data.overview}</p>
            </div>
            <div className="space-y-3">
              {data.rounds.map((round: any, i: number) => (
                <div key={i} className="card cursor-pointer" onClick={() => setOpenRound(openRound === i ? null : i)}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-black shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-white font-medium flex-1">{round.name}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${openRound === i ? 'rotate-180' : ''}`} />
                  </div>
                  {openRound === i && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-gray-400 text-sm mt-3 ml-11 leading-relaxed">
                      {round.desc}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* DSA Topics */}
        {activeTab === 'dsa' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.dsaTopics.map((topic: string, i: number) => (
                <div key={i} className="card p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                    <Code2 size={14} className="text-white" />
                  </div>
                  <span className="text-gray-200 text-sm">{topic}</span>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Sample Practice Problems</h3>
              <div className="space-y-2">
                {data.sampleProblems.map((p: any, i: number) => (
                  <Link key={i} to={p.link}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5 group"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Code2 size={16} className="text-blue-400" />
                    <span className="text-gray-200 text-sm flex-1 group-hover:text-blue-400 transition-colors">{p.title}</span>
                    <span className={`badge text-xs ${p.difficulty === 'easy' ? 'badge-green' : p.difficulty === 'medium' ? 'badge-coral' : 'badge-red'}`}>
                      {p.difficulty}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* HR Questions */}
        {activeTab === 'hr' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {data.hrQuestions.map((q: string, i: number) => (
              <div key={i} className="card p-4 flex items-start gap-3">
                <span className="badge badge-purple text-xs shrink-0 mt-0.5">Q{i + 1}</span>
                <span className="text-gray-200 text-sm">{q}</span>
                <Link to="/communication" className="ml-auto text-blue-400 text-xs hover:text-blue-300 shrink-0">Practice →</Link>
              </div>
            ))}
            <div className="text-center pt-4">
              <Link to="/communication" className="btn-primary inline-flex items-center gap-2">
                <MessageSquare size={16} /> Practice with Arvi
              </Link>
            </div>
          </motion.div>
        )}

        {/* Preparation Tips */}
        {activeTab === 'prep' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {data.preparation.map((tip: string, i: number) => (
              <div key={i} className="card p-4 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="text-gray-200 text-sm leading-relaxed">{tip}</span>
              </div>
            ))}
            <div className="card p-6 mt-6"
              style={{ background: 'linear-gradient(135deg, rgba(30,64,175,0.2), rgba(124,58,237,0.2))' }}>
              <h3 className="text-white font-bold mb-3">Start Your Preparation Now</h3>
              <div className="flex flex-wrap gap-3">
                <Link to="/coding" className="btn-primary text-sm py-2 flex items-center gap-2">
                  <Code2 size={14} /> DSA Practice
                </Link>
                <Link to={`/interview/setup?type=company&company=${data.name}`}
                  className="btn-secondary text-sm py-2 flex items-center gap-2">
                  <Video size={14} /> Mock Interview
                </Link>
                <Link to="/communication" className="btn-secondary text-sm py-2 flex items-center gap-2">
                  <MessageSquare size={14} /> HR Practice
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  )
}

function Play({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
}
function Video({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
}
