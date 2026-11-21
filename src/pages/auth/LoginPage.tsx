import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

function NexhireLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#logoGrad2)" />
      <text x="8" y="36" fontFamily="Inter, sans-serif" fontSize="30" fontWeight="900" fill="white">N</text>
      <circle cx="38" cy="10" r="5" fill="#f97316" opacity="0.9" />
      <circle cx="38" cy="10" r="3" fill="white" />
    </svg>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      return toast.error('Please enter both your email and password.')
    }

    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast.error(error.message || 'Login failed. Please verify your credentials.')
    } else {
      toast.success('Welcome back to NEXHIRE AI! 🚀')
      navigate('/dashboard')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    setLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      toast.error('Google login failed.')
    } else {
      toast.success('Signed in with Google!')
      navigate('/dashboard')
    }
    setLoading(false)
  }

  function handleQuickFillDemo() {
    setEmail('candidate@nexhire.ai')
    setPassword('Password123')
    toast.success('Demo credentials loaded! Click "Sign In".', { icon: '🔑' })
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-16">
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-5 hover:opacity-90 transition-opacity">
            <NexhireLogo size={46} />
            <span className="text-2xl font-black text-white">
              NEXHIRE <span className="gradient-text-blue">AI</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Student Login</h1>
          <p className="text-gray-400 text-sm">
            Access your personalized AI interview prep, DSA tests & resume audits
          </p>
        </div>

        <div className="card p-8 shadow-2xl border border-white/10">
          {/* Secure Storage Pill */}
          <div className="flex items-center gap-2 p-3 rounded-xl mb-6 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Secure Account Storage Active:</strong> Your password and interview stats are preserved securely.
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
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-xs uppercase tracking-wider">or sign in with password</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-gray-300 text-xs font-semibold mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="candidate@nexhire.ai"
                  className="input-field pl-10 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-gray-300 text-xs font-semibold">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-xl mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Fill Button */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={handleQuickFillDemo}
              type="button"
              className="w-full py-2.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-medium border border-purple-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Fill Quick Demo Account (candidate@nexhire.ai / Password123)</span>
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-blue-400 font-bold hover:text-blue-300 underline underline-offset-2">
              Sign Up Free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
