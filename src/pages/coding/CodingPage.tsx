import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, Filter, Code2, Clock, CheckCircle,
  Star, Flame, ChevronRight, BookOpen, Zap, Calendar
} from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'
import { getDifficultyBadgeClass } from '../../lib/utils'

const TOPICS = [
  'All', 'Arrays', 'Strings', 'Linked Lists', 'Stack & Queue', 'Trees',
  'Graphs', 'Recursion', 'Dynamic Programming', 'Greedy', 'Sorting & Searching',
  'Hashing', 'Heaps', 'Sliding Window', 'Two Pointers', 'Backtracking'
]

const PROBLEMS = [
  // Arrays
  { id: 'two-sum', title: 'Two Sum', difficulty: 'easy', topic: 'Arrays', solved: true, starred: false, acceptance: 49 },
  { id: 'best-time-buy-sell', title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', topic: 'Arrays', solved: true, starred: true, acceptance: 54 },
  { id: 'max-subarray', title: 'Maximum Subarray (Kadane\'s)', difficulty: 'medium', topic: 'Arrays', solved: false, starred: true, acceptance: 50 },
  { id: 'product-except-self', title: 'Product of Array Except Self', difficulty: 'medium', topic: 'Arrays', solved: false, starred: false, acceptance: 65 },
  { id: 'trapping-rain', title: 'Trapping Rain Water', difficulty: 'hard', topic: 'Arrays', solved: false, starred: true, acceptance: 58 },
  // Strings
  { id: 'valid-palindrome', title: 'Valid Palindrome', difficulty: 'easy', topic: 'Strings', solved: true, starred: false, acceptance: 42 },
  { id: 'longest-substring', title: 'Longest Substring Without Repeating', difficulty: 'medium', topic: 'Strings', solved: false, starred: true, acceptance: 33 },
  { id: 'anagram', title: 'Valid Anagram', difficulty: 'easy', topic: 'Strings', solved: true, starred: false, acceptance: 62 },
  { id: 'reverse-words', title: 'Reverse Words in a String', difficulty: 'medium', topic: 'Strings', solved: false, starred: false, acceptance: 38 },
  // Linked Lists
  { id: 'reverse-ll', title: 'Reverse a Linked List', difficulty: 'easy', topic: 'Linked Lists', solved: false, starred: true, acceptance: 72 },
  { id: 'merge-sorted-ll', title: 'Merge Two Sorted Lists', difficulty: 'easy', topic: 'Linked Lists', solved: false, starred: false, acceptance: 61 },
  { id: 'detect-cycle', title: 'Linked List Cycle (Floyd\'s)', difficulty: 'easy', topic: 'Linked Lists', solved: false, starred: false, acceptance: 46 },
  // Trees
  { id: 'inorder-traversal', title: 'Binary Tree Inorder Traversal', difficulty: 'easy', topic: 'Trees', solved: true, starred: false, acceptance: 73 },
  { id: 'max-depth-tree', title: 'Maximum Depth of Binary Tree', difficulty: 'easy', topic: 'Trees', solved: false, starred: false, acceptance: 73 },
  { id: 'validate-bst', title: 'Validate Binary Search Tree', difficulty: 'medium', topic: 'Trees', solved: false, starred: true, acceptance: 32 },
  { id: 'lca-bst', title: 'Lowest Common Ancestor of BST', difficulty: 'medium', topic: 'Trees', solved: false, starred: false, acceptance: 61 },
  // DP
  { id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'easy', topic: 'Dynamic Programming', solved: true, starred: false, acceptance: 51 },
  { id: 'coin-change', title: 'Coin Change', difficulty: 'medium', topic: 'Dynamic Programming', solved: false, starred: true, acceptance: 42 },
  { id: 'longest-common-subsequence', title: 'Longest Common Subsequence', difficulty: 'medium', topic: 'Dynamic Programming', solved: false, starred: true, acceptance: 57 },
  { id: '0-1-knapsack', title: '0/1 Knapsack Problem', difficulty: 'medium', topic: 'Dynamic Programming', solved: false, starred: true, acceptance: 40 },
  // Graphs
  { id: 'bfs-traversal', title: 'BFS Traversal', difficulty: 'easy', topic: 'Graphs', solved: false, starred: false, acceptance: 60 },
  { id: 'number-of-islands', title: 'Number of Islands', difficulty: 'medium', topic: 'Graphs', solved: false, starred: true, acceptance: 56 },
  { id: 'course-schedule', title: 'Course Schedule (Topological Sort)', difficulty: 'medium', topic: 'Graphs', solved: false, starred: true, acceptance: 45 },
  { id: 'dijkstra', title: 'Shortest Path – Dijkstra\'s Algorithm', difficulty: 'hard', topic: 'Graphs', solved: false, starred: true, acceptance: 38 },
]

const DAILY_CHALLENGE = {
  id: 'daily-challenge',
  title: 'Find the Duplicate Number',
  difficulty: 'medium',
  topic: 'Arrays',
  desc: 'Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive, find the duplicate number.',
}

export default function CodingPage() {
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [selectedDiff, setSelectedDiff] = useState('All')
  const [solvedFilter, setSolvedFilter] = useState('All')

  const filtered = PROBLEMS.filter(p => {
    const matchTopic = selectedTopic === 'All' || p.topic === selectedTopic
    const matchDiff = selectedDiff === 'All' || p.difficulty === selectedDiff.toLowerCase()
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchSolved = solvedFilter === 'All' || (solvedFilter === 'Solved' ? p.solved : !p.solved)
    return matchTopic && matchDiff && matchSearch && matchSolved
  })

  const solvedCount = PROBLEMS.filter(p => p.solved).length

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white mb-2">DSA & <span className="gradient-text">Coding Practice</span></h1>
          <p className="text-gray-400">LeetCode-style practice with real code execution</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Problems Solved', value: `${solvedCount}/${PROBLEMS.length}`, color: 'text-green-400', icon: CheckCircle },
            { label: 'Easy Solved', value: `${PROBLEMS.filter(p => p.difficulty === 'easy' && p.solved).length}`, color: 'text-green-400', icon: Code2 },
            { label: 'Medium Solved', value: `${PROBLEMS.filter(p => p.difficulty === 'medium' && p.solved).length}`, color: 'text-yellow-400', icon: Zap },
            { label: 'Hard Solved', value: `${PROBLEMS.filter(p => p.difficulty === 'hard' && p.solved).length}`, color: 'text-red-400', icon: Flame },
          ].map((stat, i) => (
            <div key={stat.label} className="card p-4">
              <stat.icon size={18} className={`${stat.color} mb-2`} />
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Daily Challenge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(239,68,68,0.15))', border: '1px solid rgba(249,115,22,0.3)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
              style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame size={18} className="text-orange-400" />
                  <span className="text-orange-400 font-bold">Daily Challenge</span>
                  <span className="badge badge-coral text-xs flex items-center gap-1">
                    <Calendar size={10} /> Today
                  </span>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{DAILY_CHALLENGE.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{DAILY_CHALLENGE.desc}</p>
                <div className="flex items-center gap-3">
                  <span className={`badge ${getDifficultyBadgeClass(DAILY_CHALLENGE.difficulty)} text-xs`}>
                    {DAILY_CHALLENGE.difficulty}
                  </span>
                  <span className="badge badge-blue text-xs">{DAILY_CHALLENGE.topic}</span>
                </div>
              </div>
              <Link to={`/coding/${DAILY_CHALLENGE.id}`}
                className="btn-primary flex items-center gap-2 shrink-0">
                <Play size={16} /> Solve Now
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search problems..." className="input-field pl-10" />
          </div>
          <select value={selectedDiff} onChange={e => setSelectedDiff(e.target.value)} className="input-field w-auto">
            {['All', 'Easy', 'Medium', 'Hard'].map(d => <option key={d} value={d} style={{ background: '#111845' }}>{d}</option>)}
          </select>
          <select value={solvedFilter} onChange={e => setSolvedFilter(e.target.value)} className="input-field w-auto">
            {['All', 'Solved', 'Unsolved'].map(s => <option key={s} value={s} style={{ background: '#111845' }}>{s}</option>)}
          </select>
        </div>

        {/* Topic Filter */}
        <div className="flex gap-2 flex-wrap">
          {TOPICS.map(topic => (
            <button key={topic} onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedTopic === topic
                ? 'gradient-primary text-white'
                : 'text-gray-400 hover:text-white'}`}
              style={selectedTopic !== topic ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' } : {}}>
              {topic}
            </button>
          ))}
        </div>

        {/* Problem List */}
        <div className="card overflow-hidden p-0">
          <div className="grid grid-cols-12 px-6 py-3 border-b border-white/5 text-gray-500 text-xs font-semibold uppercase tracking-wide">
            <div className="col-span-1"></div>
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Topic</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-2 text-right">Acceptance</div>
          </div>
          <div className="divide-y divide-white/5">
            {filtered.map((problem, i) => (
              <motion.div key={problem.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                <Link to={`/coding/${problem.id}`}
                  className="grid grid-cols-12 px-6 py-4 hover:bg-white/5 transition-all group items-center">
                  <div className="col-span-1">
                    {problem.solved
                      ? <CheckCircle size={18} className="text-green-400" />
                      : <div className="w-4 h-4 rounded-full border-2 border-gray-600" />}
                  </div>
                  <div className="col-span-5 flex items-center gap-2">
                    <span className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
                      {i + 1}. {problem.title}
                    </span>
                    {problem.starred && <Star size={12} className="text-yellow-400 fill-current" />}
                  </div>
                  <div className="col-span-2 text-gray-400 text-xs">{problem.topic}</div>
                  <div className="col-span-2">
                    <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)} text-xs`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="col-span-2 text-right text-gray-400 text-xs">{problem.acceptance}%</div>
                </Link>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              No problems found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

function Play({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 3l14 9-14 9V3z" />
    </svg>
  )
}
