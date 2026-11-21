import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Video, Code2, BookOpen, Building2, FileText,
  MessageSquare, BarChart3, Map, Mic, User, Settings, LogOut,
  Menu, X, ChevronRight, Bell, Zap
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

function NexhireLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="sidebarLogo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#sidebarLogo)" />
      <text x="8" y="36" fontFamily="Inter, sans-serif" fontSize="30" fontWeight="900" fill="white">N</text>
      <circle cx="38" cy="10" r="5" fill="#f97316" opacity="0.9" />
      <circle cx="38" cy="10" r="3" fill="white" />
    </svg>
  )
}

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: Map, label: 'My Roadmap', href: '/roadmap' },
      { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    ]
  },
  {
    label: 'Practice',
    items: [
      { icon: Video, label: 'AI Interviews', href: '/interview/setup' },
      { icon: Mic, label: 'Mock Interview', href: '/mock' },
      { icon: Code2, label: 'DSA & Coding', href: '/coding' },
      { icon: MessageSquare, label: 'Communication', href: '/communication' },
    ]
  },
  {
    label: 'Learn',
    items: [
      { icon: BookOpen, label: 'Programming', href: '/learn' },
      { icon: Building2, label: 'Companies', href: '/companies' },
      { icon: FileText, label: 'Resume Analyzer', href: '/resume' },
    ]
  },
  {
    label: 'Account',
    items: [
      { icon: User, label: 'My Profile', href: '/profile' },
    ]
  },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile, signOut, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/')
  }

  const avatarInitials = (profile?.full_name || user?.email || 'U')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0f2c' }}>
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || true) && (
          <>
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 bg-black/60 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)} />
            )}

            <motion.aside
              className={`fixed md:relative inset-y-0 left-0 z-50 md:z-auto w-64 flex-shrink-0 flex flex-col
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
              style={{
                background: 'rgba(10, 15, 44, 0.95)',
                borderRight: '1px solid rgba(59, 130, 246, 0.1)',
                backdropFilter: 'blur(20px)',
                transition: 'transform 0.3s ease',
              }}>

              {/* Logo */}
              <div className="flex items-center gap-3 p-6 border-b border-white/5">
                <NexhireLogo size={36} />
                <div>
                  <span className="font-black text-white">NEXHIRE</span>
                  <span className="font-black text-blue-400"> AI</span>
                </div>
                <button className="ml-auto md:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                {NAV_SECTIONS.map(section => (
                  <div key={section.label}>
                    <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest px-3 mb-2">
                      {section.label}
                    </p>
                    <div className="space-y-1">
                      {section.items.map(item => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`sidebar-item ${location.pathname === item.href ? 'active' : ''}`}>
                          <item.icon size={18} />
                          <span className="text-sm font-medium">{item.label}</span>
                          {location.pathname === item.href && (
                            <ChevronRight size={14} className="ml-auto text-blue-400" />
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              {/* User profile */}
              <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 p-3 rounded-xl mb-2"
                  style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} className="w-full h-full object-cover rounded-full" />
                      : avatarInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-sm font-semibold truncate">
                      {profile?.full_name || 'Student'}
                    </div>
                    <div className="text-gray-500 text-xs truncate">{user?.email}</div>
                  </div>
                </div>
                <button onClick={handleSignOut}
                  className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <LogOut size={16} />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10,15,44,0.5)', backdropFilter: 'blur(10px)' }}>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="hidden md:flex items-center gap-3">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-gray-400 text-sm">
              {profile?.full_name ? `Welcome back, ${profile.full_name.split(' ')[0]}!` : 'Welcome back!'}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
            </button>
            <Link to="/profile" className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} className="w-full h-full object-cover rounded-full" />
                : avatarInitials}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
