import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Brain, Code2, MessageSquare, FileText, BarChart3, Target, Shield,
  ChevronRight, Star, Play, Zap, Award, Users, TrendingUp, CheckCircle,
  ArrowRight, Mic, Video, Building2, Sparkles, BookOpen, Globe,
  Mail, Menu, X, Share2
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Features', href: '#features' },
  { label: 'AI Interviewers', href: '#interviewers' },
  { label: 'Companies', href: '#companies' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const FEATURES = [
  { icon: Video, title: 'AI Video Interviews', desc: 'Realistic video interviews with Anway & Arvi, your personal AI interviewers with voice and adaptive questioning.', color: 'from-blue-500 to-purple-600', badge: 'Most Popular' },
  { icon: Code2, title: 'DSA & Coding Practice', desc: 'LeetCode-style workspace with 500+ problems, real code execution in C, C++, Java, Python with AI hints.', color: 'from-purple-500 to-pink-600', badge: 'New' },
  { icon: FileText, title: 'AI Resume Analyzer', desc: 'ATS score, keyword analysis, job description matching, and instant improvement suggestions.', color: 'from-orange-500 to-red-600', badge: null },
  { icon: MessageSquare, title: 'Communication Coach', desc: 'Practice speaking, improve pronunciation, reduce filler words with AI-powered real-time feedback.', color: 'from-green-500 to-teal-600', badge: null },
  { icon: Building2, title: 'Company Prep', desc: 'Google, Microsoft, Amazon, Meta, and 6+ more. Company-specific rounds, questions, and mock interviews.', color: 'from-cyan-500 to-blue-600', badge: null },
  { icon: BarChart3, title: 'Smart Analytics', desc: 'Track DSA progress, interview scores, communication improvement and get a personalised learning roadmap.', color: 'from-violet-500 to-purple-600', badge: null },
]

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'DeepMind', 'Adobe', 'Infosys', 'TCS', 'Accenture']

const TESTIMONIALS = [
  { name: '[Placeholder – Genuine testimonials coming soon]', role: 'B.Tech CSE Student', text: 'This section will feature verified testimonials from real students once NEXHIRE AI launches publicly.', rating: 5, company: 'Preparing for Google' },
  { name: '[Placeholder – Genuine testimonials coming soon]', role: 'Engineering Graduate', text: 'Verified student feedback will be collected and published here after the beta program concludes.', rating: 5, company: 'Preparing for Microsoft' },
  { name: '[Placeholder – Genuine testimonials coming soon]', role: 'Fresher', text: 'Real student success stories and testimonials will appear here post-launch with full consent.', rating: 5, company: 'Preparing for Amazon' },
]

const PRICING = [
  {
    name: 'Free', price: 0, period: 'forever',
    features: ['5 AI mock interviews/month', '50 coding problems', 'Basic resume analysis', 'Company overview', 'Email support'],
    cta: 'Get Started Free', highlight: false,
  },
  {
    name: 'Pro', price: 499, period: 'month',
    features: ['Unlimited AI interviews', '500+ coding problems', 'Advanced ATS analysis', 'All company prep packs', 'Communication coach', 'Downloadable reports', 'Priority support'],
    cta: 'Start Pro Trial', highlight: true,
  },
  {
    name: 'Premium', price: 999, period: 'month',
    features: ['Everything in Pro', 'Resume editing & download', 'Personal roadmap AI', 'Live interview coaching', '1-on-1 expert sessions', 'Placement guarantee support'],
    cta: 'Go Premium', highlight: false,
  },
]

const FAQS = [
  { q: 'How realistic are the AI interviews?', a: 'NEXHIRE\'s AI interviewers Anway and Arvi use advanced AI models to conduct adaptive interviews that mirror real company interview formats, asking follow-up questions based on your answers.' },
  { q: 'Which programming languages are supported?', a: 'Our coding workspace supports C, C++, Java, and Python with real code execution through a sandboxed environment. Each submission gives you runtime, memory usage, and test results.' },
  { q: 'Is my data secure?', a: 'Yes. We use bank-grade encryption, Supabase Auth for secure authentication, and all camera/microphone access requires explicit consent. You can delete your data anytime.' },
  { q: 'Can I prepare for specific companies?', a: 'Absolutely! We have dedicated preparation packs for Google, Microsoft, Amazon, Meta, Apple, DeepMind, Adobe, Infosys, TCS, and Accenture with company-specific rounds and questions.' },
  { q: 'How is the ATS score calculated?', a: 'Our ATS score analyzes keyword density, section structure, formatting, and job description matching. Note: actual ATS systems vary — our score is an estimated benchmark to help you improve.' },
  { q: 'Do I need a webcam for interviews?', a: 'A webcam enhances the experience with body language analysis, but it\'s optional. You can practice with just audio or text-based interviews too.' },
]

function StarField() {
  return (
    <div className="stars">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            '--duration': `${Math.random() * 3 + 2}s`,
            '--opacity': `${Math.random() * 0.5 + 0.3}`,
            animationDelay: `${Math.random() * 3}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

function NexhireLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#logoGrad)" />
      <text x="8" y="36" fontFamily="Inter, sans-serif" fontSize="30" fontWeight="900" fill="white">N</text>
      <circle cx="38" cy="10" r="5" fill="#f97316" opacity="0.9" />
      <circle cx="38" cy="10" r="3" fill="white" />
    </svg>
  )
}

function AnwayAvatar() {
  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-full avatar-ring flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)' }}>
        <svg viewBox="0 0 100 100" className="w-28 h-28">
          <circle cx="50" cy="35" r="22" fill="#93c5fd" />
          <ellipse cx="50" cy="80" rx="30" ry="20" fill="#1d4ed8" />
          <circle cx="50" cy="35" r="18" fill="#bfdbfe" />
          <ellipse cx="43" cy="32" rx="4" ry="5" fill="#1e3a8a" />
          <ellipse cx="57" cy="32" rx="4" ry="5" fill="#1e3a8a" />
          <path d="M42 42 Q50 48 58 42" stroke="#1e3a8a" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="30" y="55" width="40" height="8" rx="4" fill="#2563eb" />
          <text x="50" y="92" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Inter, sans-serif">ANWAY</text>
        </svg>
      </div>
      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center pulse-glow">
        <Mic size={14} className="text-white" />
      </div>
    </div>
  )
}

function ArviAvatar() {
  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-full avatar-ring flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
        <svg viewBox="0 0 100 100" className="w-28 h-28">
          <circle cx="50" cy="35" r="22" fill="#c4b5fd" />
          <ellipse cx="50" cy="80" rx="30" ry="20" fill="#6d28d9" />
          <circle cx="50" cy="35" r="18" fill="#ddd6fe" />
          <ellipse cx="43" cy="32" rx="4" ry="5" fill="#4c1d95" />
          <ellipse cx="57" cy="32" rx="4" ry="5" fill="#4c1d95" />
          <path d="M42 42 Q50 48 58 42" stroke="#4c1d95" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M30 20 Q50 10 70 20 Q70 15 50 10 Q30 15 30 20" fill="#7c3aed" />
          <text x="50" y="92" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Inter, sans-serif">ARVI</text>
        </svg>
      </div>
      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center pulse-glow">
        <MessageSquare size={14} className="text-white" />
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [typedText, setTypedText] = useState('')
  const heroTexts = ['Google', 'Microsoft', 'Amazon', 'Meta', 'DeepMind', 'Apple']
  const [heroIdx, setHeroIdx] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  useEffect(() => {
    const text = heroTexts[heroIdx]
    let i = 0
    const interval = setInterval(() => {
      if (i <= text.length) {
        setTypedText(text.slice(0, i))
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setHeroIdx(prev => (prev + 1) % heroTexts.length), 1500)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [heroIdx])

  return (
    <div className="min-h-screen animated-bg relative overflow-x-hidden">
      <StarField />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <NexhireLogo size={40} />
            <div>
              <span className="text-xl font-black text-white">NEXHIRE</span>
              <span className="text-xl font-black gradient-text-blue"> AI</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(item => (
              <a key={item.label} href={item.href}
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm py-2">Log In</Link>
            <Link to="/signup" className="btn-primary text-sm py-2">Start Free</Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden px-6 py-4 border-t border-white/10 space-y-3">
            {NAV_ITEMS.map(item => (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                className="block text-gray-400 hover:text-white py-2 text-sm font-medium">
                {item.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="btn-secondary text-sm py-2 flex-1 text-center">Log In</Link>
              <Link to="/signup" className="btn-primary text-sm py-2 flex-1 text-center">Start Free</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.section style={{ opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="badge badge-blue mb-6 inline-flex items-center gap-2">
              <Sparkles size={12} />
              AI-Powered Interview Preparation Platform
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Your Next Interview
            <br />
            <span className="gradient-text">Starts Here.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Master coding, improve communication, practice real-world interviews and become career-ready
            with your personal AI interview coaches.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="text-lg text-gray-400 mb-10">
            Crack your dream job at{' '}
            <span className="gradient-text font-bold typing-cursor">{typedText}</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup"
              className="btn-primary text-base px-8 py-4 flex items-center gap-2 justify-center">
              <Play size={18} /> Start Preparing Free
            </Link>
            <a href="#features"
              className="btn-secondary text-base px-8 py-4 flex items-center gap-2 justify-center">
              <ChevronRight size={18} /> Explore Features
            </a>
          </motion.div>

          {/* AI Interviewer Previews */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <div className="card text-center px-8 py-6 float-animation">
              <AnwayAvatar />
              <h3 className="text-white font-bold mt-4 text-lg">Anway</h3>
              <p className="text-blue-400 text-sm">Technical Interviewer</p>
              <p className="text-gray-400 text-xs mt-1">DSA • Coding • System Design</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black gradient-text mb-2">VS</div>
              <div className="text-gray-400 text-sm">Choose your coach</div>
            </div>
            <div className="card text-center px-8 py-6 float-animation" style={{ animationDelay: '1s' }}>
              <ArviAvatar />
              <h3 className="text-white font-bold mt-4 text-lg">Arvi</h3>
              <p className="text-purple-400 text-sm">HR Interviewer</p>
              <p className="text-gray-400 text-xs mt-1">Communication • Behaviour • Soft Skills</p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '500+', label: 'DSA Problems' },
              { value: '10+', label: 'Company Prep Packs' },
              { value: '8', label: 'Programming Languages' },
              { value: '24/7', label: 'AI Availability' },
            ].map(stat => (
              <div key={stat.label} className="glass rounded-xl p-4">
                <div className="text-2xl font-black gradient-text">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Why NEXHIRE */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="badge badge-purple mb-4 inline-block">Why NEXHIRE?</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything You Need to <span className="gradient-text">Get Hired</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The only platform that combines AI interviews, coding practice, resume analysis, and communication coaching in one place.
            </p>
          </motion.div>

          <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div key={feature.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card group cursor-pointer relative overflow-hidden">
                {feature.badge && (
                  <span className="absolute top-4 right-4 badge badge-blue text-xs">{feature.badge}</span>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                <div className="mt-4 flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight size={16} className="ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Interviewers */}
      <section id="interviewers" className="py-24 px-6 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="badge badge-blue mb-4 inline-block">Meet Your AI Coaches</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Anway & Arvi – Your <span className="gradient-text">AI Interviewers</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="card p-8">
              <div className="flex items-center gap-6 mb-6">
                <AnwayAvatar />
                <div>
                  <h3 className="text-2xl font-black text-white">Anway</h3>
                  <p className="text-blue-400 font-semibold">Technical AI Interviewer</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {['DSA', 'System Design', 'Coding', 'CS Fundamentals'].map(tag => (
                      <span key={tag} className="badge badge-blue text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Anway is your intelligent technical interviewer. He specialises in Data Structures, Algorithms, System Design and Coding questions. He asks challenging follow-up questions, explains your mistakes and helps you improve your problem-solving approach.
              </p>
              <div className="space-y-3">
                {['Adaptive questioning based on your answers', 'Real-time code evaluation', 'Detailed technical feedback', 'Follow-up probing questions', 'Explains the optimal solution'].map(point => (
                  <div key={point} className="flex items-center gap-3 text-gray-300 text-sm">
                    <CheckCircle size={16} className="text-blue-400 shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
              <Link to="/signup" className="btn-primary mt-6 w-full text-center block">
                Practice with Anway
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="card p-8">
              <div className="flex items-center gap-6 mb-6">
                <ArviAvatar />
                <div>
                  <h3 className="text-2xl font-black text-white">Arvi</h3>
                  <p className="text-purple-400 font-semibold">HR & Communication Coach</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {['HR', 'Behavioural', 'Communication', 'Soft Skills'].map(tag => (
                      <span key={tag} className="badge badge-purple text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Arvi is your intelligent, friendly HR interviewer and communication coach. She specialises in behavioural questions, professional communication, self-introduction and helps build your confidence for real interviews.
              </p>
              <div className="space-y-3">
                {['Behavioural & situational questions', 'Communication analysis & feedback', 'Professional English coaching', 'Confidence building exercises', 'Answer structure improvement'].map(point => (
                  <div key={point} className="flex items-center gap-3 text-gray-300 text-sm">
                    <CheckCircle size={16} className="text-purple-400 shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
              <Link to="/signup" className="mt-6 w-full text-center block px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
                Practice with Arvi
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Companies */}
      <section id="companies" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="badge badge-coral mb-4 inline-block">Company Prep</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Prepare for <span className="gradient-text">Top Companies</span>
            </h2>
            <p className="text-gray-400">Dedicated interview prep for 10+ leading technology companies</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {COMPANIES.map((company, i) => (
              <motion.div key={company}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card text-center py-6 cursor-pointer group">
                <div className="text-3xl mb-2">
                  {['🔵', '🟦', '🟠', '🔷', '⬜', '🟣', '🔴', '🟤', '🟩', '🔵'][i]}
                </div>
                <div className="text-white font-semibold text-sm">{company}</div>
                <div className="text-gray-500 text-xs mt-1 group-hover:text-blue-400 transition-colors">View Prep →</div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
              Start Company Prep <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-4">
            <span className="badge badge-green mb-4 inline-block">Student Stories</span>
            <h2 className="text-4xl font-black text-white mb-2">What Students Say</h2>
          </motion.div>
          <div className="text-center mb-12">
            <span className="badge badge-coral text-xs">
              ⚠️ Placeholder – Genuine verified testimonials will be published after launch
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm italic mb-4">"{t.text}"</p>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-white font-medium text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                  <div className="text-blue-400 text-xs mt-1">{t.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="badge badge-blue mb-4 inline-block">Pricing</span>
            <h2 className="text-4xl font-black text-white mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="text-gray-400">Start free. Upgrade when you're ready.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((plan, i) => (
              <motion.div key={plan.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`card p-8 relative ${plan.highlight ? 'border-blue-500/50' : ''}`}
                style={plan.highlight ? { background: 'rgba(30, 64, 175, 0.15)', border: '1px solid rgba(59,130,246,0.4)' } : {}}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge badge-blue text-xs px-4">Most Popular</span>
                  </div>
                )}
                <h3 className="text-white font-bold text-xl mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">
                    {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-gray-400 text-sm">/{plan.period}</span>}
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                      <CheckCircle size={16} className="text-green-400 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link to="/signup"
                  className={`w-full text-center block py-3 rounded-xl font-semibold transition-all duration-300 ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="card p-16 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(30,64,175,0.3), rgba(124,58,237,0.3))' }}>
            <div className="absolute inset-0 opacity-20"
              style={{ background: 'radial-gradient(ellipse at center, #3b82f6, transparent)' }} />
            <div className="relative z-10">
              <Zap size={48} className="text-yellow-400 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-white mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Join thousands of students preparing smarter with NEXHIRE AI.
                Your next interview could be your best one.
              </p>
              <Link to="/signup" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
                Start Preparing Now <ArrowRight size={20} />
              </Link>
              <p className="text-gray-500 text-sm mt-4">Free to start. No credit card required.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <NexhireLogo size={36} />
                <div>
                  <span className="font-black text-white">NEXHIRE</span>
                  <span className="font-black gradient-text-blue"> AI</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Your Skills. Your Future. Your Next Hire.</p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors"><Globe size={18} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors"><Share2 size={18} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors"><Mail size={18} /></a>
              </div>
            </div>
            {[
              { title: 'Platform', links: ['AI Interviews', 'DSA Practice', 'Resume Analyzer', 'Communication Coach', 'Company Prep'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Press', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-white font-semibold mb-4">{col.title}</h4>
                <div className="space-y-2">
                  {col.links.map(link => (
                    <a key={link} href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 NEXHIRE AI. All rights reserved.</p>
            <p className="text-gray-500 text-sm">Made with ❤️ for students and job seekers worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
      <div className="card cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-between">
          <span className="text-white font-medium">{question}</span>
          <ChevronRight size={18} className={`text-blue-400 transition-transform ${open ? 'rotate-90' : ''}`} />
        </div>
        {open && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="text-gray-400 text-sm mt-4 leading-relaxed">
            {answer}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
