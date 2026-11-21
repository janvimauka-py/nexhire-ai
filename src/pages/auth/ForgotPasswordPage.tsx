import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle, Lock, ShieldCheck, KeyRound } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'enter_email' | 'enter_new_pass' | 'done'>('enter_email')

  const { resetPasswordByEmail } = useAuth()
  const navigate = useNavigate()

  function handleVerifyEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return toast.error('Please enter your email')
    setStep('enter_new_pass')
    toast.success('Account found! Please set your new password.')
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters.')
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match.')
    }

    setLoading(true)
    const { error } = await resetPasswordByEmail(email, newPassword)
    if (error) {
      toast.error(error.message || 'Password reset failed.')
    } else {
      setStep('done')
      toast.success('Password successfully reset! You can now log in.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Back to login
        </Link>

        <div className="card p-8 shadow-2xl border border-white/10">
          {step === 'done' ? (
            <div className="text-center py-6">
              <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2">Password Reset Complete!</h2>
              <p className="text-gray-300 text-sm mb-6">
                Your password for <strong className="text-blue-400">{email}</strong> has been updated.
              </p>
              <Link to="/login" className="btn-primary block text-center py-3 text-sm font-bold shadow-xl">
                Proceed to Log In
              </Link>
            </div>
          ) : step === 'enter_new_pass' ? (
            <>
              <div className="flex items-center gap-2.5 mb-2">
                <KeyRound className="w-5 h-5 text-purple-400" />
                <h1 className="text-2xl font-black text-white">Set New Password</h1>
              </div>
              <p className="text-gray-400 text-xs mb-6">
                Enter a new password for <strong className="text-white">{email}</strong>
              </p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-gray-300 text-xs font-semibold mb-1.5 block">New Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="input-field pl-10 text-xs"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-semibold mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="input-field pl-10 text-xs"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-sm font-bold mt-2 shadow-xl"
                >
                  {loading ? 'Updating Password...' : 'Save New Password & Log In'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-white mb-2">Forgot Password?</h1>
              <p className="text-gray-400 text-xs mb-6">
                Enter your registered student email address to reset your password.
              </p>
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div>
                  <label className="text-gray-300 text-xs font-semibold mb-1.5 block">Registered Email Address</label>
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
                <button type="submit" className="btn-primary w-full py-3 text-sm font-bold shadow-xl">
                  Verify Account & Reset Password
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
