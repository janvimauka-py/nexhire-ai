import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, School, GraduationCap, Building2,
  Code, Save, ShieldCheck, Lock, KeyRound, Eye, EyeOff,
  CheckCircle2, Database
} from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { profile, updateProfile, changePassword, user } = useAuth()

  // Profile fields state
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [college, setCollege] = useState(profile?.college || '')
  const [branch, setBranch] = useState(profile?.branch || '')
  const [gradYear, setGradYear] = useState(profile?.graduation_year || 2025)
  const [skills, setSkills] = useState((profile?.skills || ['JavaScript', 'React', 'Python', 'DSA']).join(', '))
  const [targetCompanies, setTargetCompanies] = useState((profile?.target_companies || ['Google', 'Microsoft', 'Amazon']).join(', '))
  const [savingProfile, setSavingProfile] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)

    const updates = {
      full_name: fullName.trim(),
      college: college.trim(),
      branch: branch.trim(),
      graduation_year: Number(gradYear),
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      target_companies: targetCompanies.split(',').map(s => s.trim()).filter(Boolean)
    }

    const { error } = await updateProfile(updates)
    if (error) {
      toast.error('Could not save profile changes.')
    } else {
      toast.success('Profile details saved to your student account!')
    }
    setSavingProfile(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      return toast.error('Please enter your current password.')
    }
    if (!newPassword || newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters.')
    }
    if (newPassword !== confirmPassword) {
      return toast.error('New password and confirmation do not match.')
    }

    setSavingPassword(true)
    const { error } = await changePassword(currentPassword, newPassword)
    if (error) {
      toast.error(error.message || 'Password update failed.')
    } else {
      toast.success('Password updated successfully! 🔒')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setSavingPassword(false)
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            Student <span className="gradient-text">Profile & Security</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Manage your credentials, target companies, and university background for Anway & Arvi.
          </p>
        </div>

        {/* Database Status HUD */}
        <div className="card p-5 flex items-center justify-between flex-wrap gap-4 bg-blue-950/20 border border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Account Database:</span>
                <span className="badge badge-blue text-[10px] uppercase">Persistent Local DB</span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                Logged in as <strong className="text-white">{user?.email || profile?.email}</strong>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-gray-400 block">User ID:</span>
            <span className="font-mono text-xs text-blue-300 font-bold">{user?.id || 'user-001'}</span>
          </div>
        </div>

        {/* Profile Information Form */}
        <form onSubmit={handleSaveProfile} className="card p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                {fullName ? fullName[0].toUpperCase() : 'S'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{fullName || 'Student Candidate'}</h3>
                <p className="text-xs text-gray-400">{user?.email || 'student@nexhire.ai'}</p>
              </div>
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2 shadow-lg"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Details'}</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field pl-9 text-xs"
                  placeholder="e.g. Janvi Sharma"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">College / University</label>
              <div className="relative">
                <School className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="input-field pl-9 text-xs"
                  placeholder="e.g. IIT Delhi / NIT Trichy / Stanford"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Branch / Major</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="input-field pl-9 text-xs"
                  placeholder="e.g. Computer Science & Engineering"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Graduation Year</label>
              <input
                type="number"
                value={gradYear}
                onChange={(e) => setGradYear(Number(e.target.value))}
                className="input-field text-xs"
                placeholder="2025"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
              Core Technical Skills (comma separated)
            </label>
            <div className="relative">
              <Code className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="input-field pl-9 text-xs"
                placeholder="React, Python, C++, Data Structures, System Design, SQL"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
              Target Dream Companies (comma separated)
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={targetCompanies}
                onChange={(e) => setTargetCompanies(e.target.value)}
                className="input-field pl-9 text-xs"
                placeholder="Google, Microsoft, Amazon, Meta, Apple"
              />
            </div>
          </div>
        </form>

        {/* Change Password & Security Form */}
        <form onSubmit={handleChangePassword} className="card p-8 space-y-6 shadow-2xl border border-white/10">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Password & Security</h3>
              <p className="text-xs text-gray-400">Update your account login password</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field pl-9 pr-9 text-xs"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                >
                  {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field pl-9 pr-9 text-xs"
                  placeholder="At least 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                >
                  {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-9 text-xs"
                  placeholder="Repeat new password"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2 shadow-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{savingPassword ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
