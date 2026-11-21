import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mail, Lock, User, Eye, EyeOff, ShieldCheck,
  CheckCircle, ArrowRight, School, GraduationCap, Building2
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

function NexhireLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#sg)" />
      <text x="8" y="36" fontFamily="Inter, sans-serif" fontSize="30" fontWeight="900" fill="white">N</text>
      <circle cx="38" cy="10" r="5" fill="#f97316" opacity="0.9" />
      <circle cx="38" cy="10" r="3" fill="white" />
    </svg>
  )
}

const PASSWORD_REQS = [
  { label: 'At least 6 characters', test: (p: string) => p.length >= 6 },
  { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
  { label: 'Contains an uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
]

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [college, setCollege] = useState('')
  const [branch, setBranch] = useState('')
  const [targetCompanies, setTargetCompanies] = useState('Google, Microsoft, Amazon')
  const [showPass, setShowPass] = useState(false)
  const [showStudentDetails, setShowStudentDetails] = useState(false)
  const [loading, setLoading] = useState(false)

  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return toast.error('Please enter your full name.')
    if (!email.trim()) return toast.error('Please enter your email address.')
    if (password.length < 6) return toast.error('Password must be at least 6 characters.')

    setLoading(true)

    const extraProfile = {
      college: college.trim() || 'Engineering Institute of Technology',
      branch: branch.trim() || 'Computer Science & Engineering',
      graduation_year: 2025,
      skills: ['JavaScript', 'Python', 'React', 'DSA'],
      career_interests: ['Software Engineering', 'AI/ML'],
      target_companies: targetCompanies.split(',').map(s => s.trim()).filter(Boolean),
    }

    const { error } = await signUp(email, password, name, extraProfile)
    if (error) {
      toast.error(error.message || 'Signup failed. Please try again.')
    } else {
      toast.success(`Account created! Welcome to NEXHIRE AI, ${name.trim()}! 🎉`, { duration: 4000 })
      navigate('/dashboard')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    setLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      toast.error('Google signup failed.')
    } else {
      toast.success('Signed in with Google! Welcome.')
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-12">
      <div
        className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity">
            <NexhireLogo size={46} />
            <span className="text-2xl font-black text-white">
              NEXHIRE <span className="gradient-text-blue">AI</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Create Student Account</h1>
          <p className="text-gray-400 text-sm">
            Sign up to build your profile, save your credentials, and practice with Anway & Arvi
          </p>
        </div>

        <div className="card p-8 shadow-2xl border border-white/10">
          <div className="flex items-center gap-2 p-3 rounded-xl mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Persistent Account Database:</strong> Your account, password, college background, and scores will be stored securely.
            </span>
          </div>

          <button
            onClick={handleGoogle}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl mb-5 transition-all duration-300 font-semibold text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-xs uppercase tracking-wider">or register with email & password</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-gray-300 text-xs font-semibold mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Janvi Sharma"
                  className="input-field pl-10 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-xs font-semibold mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="janvi@example.com"
                  className="input-field pl-10 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-xs font-semibold mb-1.5 block">Create Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Choose a strong password"
                  className="input-field pl-10 pr-10 text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  title={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Requirements Checklist */}
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-1">
                {PASSWORD_REQS.map(req => (
                  <div
                    key={req.label}
                    className={`flex items-center gap-1.5 text-[11px] ${
                      req.test(password) ? 'text-emerald-400 font-medium' : 'text-gray-500'
                    }`}
                  >
                    <CheckCircle size={11} className={req.test(password) ? 'text-emerald-400' : 'text-gray-600'} />
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Student Background Expansion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowStudentDetails(!showStudentDetails)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>{showStudentDetails ? '▾ Hide College & Target Companies' : '▸ Add College & Target Companies (Recommended)'}</span>
              </button>

              {showStudentDetails && (
                <div className="mt-3 p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div>
                    <label className="text-gray-300 text-[11px] font-semibold mb-1 block">College / University</label>
                    <div className="relative">
                      <School size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        value={college}
                        onChange={e => setCollege(e.target.value)}
                        placeholder="e.g. IIT Bombay / NIT Delhi / Stanford"
                        className="input-field pl-9 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 text-[11px] font-semibold mb-1 block">Engineering Branch / Stream</label>
                    <div className="relative">
                      <GraduationCap size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        value={branch}
                        onChange={e => setBranch(e.target.value)}
                        placeholder="e.g. Computer Science, AI, IT, Electronics"
                        className="input-field pl-9 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 text-[11px] font-semibold mb-1 block">Target Companies (comma separated)</label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        value={targetCompanies}
                        onChange={e => setTargetCompanies(e.target.value)}
                        placeholder="Google, Microsoft, Amazon, Meta, Apple"
                        className="input-field pl-9 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-xl mt-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Your Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Start Preparing</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 underline underline-offset-2">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
