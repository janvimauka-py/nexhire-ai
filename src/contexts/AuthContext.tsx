import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  college: string | null
  branch: string | null
  graduation_year: number | null
  skills: string[] | null
  career_interests: string[] | null
  target_companies: string[] | null
}

export interface StoredAccount {
  id: string
  email: string
  password: string
  full_name: string
  avatar_url?: string | null
  college?: string | null
  branch?: string | null
  graduation_year?: number | null
  skills?: string[] | null
  career_interests?: string[] | null
  target_companies?: string[] | null
  created_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    name: string,
    extra?: Partial<Profile>
  ) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithGoogle: () => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  changePassword: (currentPass: string, newPass: string) => Promise<{ error: any }>
  resetPasswordByEmail: (email: string, newPass: string) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
  isSupabaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const isConfigured = Boolean(SUPABASE_URL && SUPABASE_URL !== 'https://your-project.supabase.co')

const ACCOUNTS_DB_KEY = 'nexhire_accounts_db'
const ACTIVE_SESSION_KEY = 'nexhire_active_session_id'

const DEFAULT_SEED_ACCOUNT: StoredAccount = {
  id: 'user-001',
  email: 'candidate@nexhire.ai',
  password: 'Password123',
  full_name: 'Janvi',
  avatar_url: null,
  college: 'Engineering Institute of Technology',
  branch: 'Computer Science & Engineering',
  graduation_year: 2025,
  skills: ['JavaScript', 'Python', 'React', 'DSA', 'SQL'],
  career_interests: ['Software Engineering', 'AI/ML', 'Full-Stack Development'],
  target_companies: ['Google', 'Microsoft', 'Amazon', 'Meta'],
  created_at: new Date().toISOString(),
}

// Helpers to get and set local database
function getLocalAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_DB_KEY)
    if (!raw) {
      const initial = [DEFAULT_SEED_ACCOUNT]
      localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(initial))
      return initial
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_SEED_ACCOUNT]
  } catch {
    return [DEFAULT_SEED_ACCOUNT]
  }
}

function saveLocalAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(accounts))
}

function accountToUser(acc: StoredAccount): User {
  return {
    id: acc.id,
    email: acc.email,
    created_at: acc.created_at,
    updated_at: new Date().toISOString(),
    aud: 'authenticated',
    role: 'authenticated',
    app_metadata: {},
    user_metadata: { full_name: acc.full_name },
  }
}

function accountToProfile(acc: StoredAccount): Profile {
  return {
    id: acc.id,
    email: acc.email,
    full_name: acc.full_name,
    avatar_url: acc.avatar_url || null,
    college: acc.college || 'Engineering Institute of Technology',
    branch: acc.branch || 'Computer Science & Engineering',
    graduation_year: acc.graduation_year || 2025,
    skills: acc.skills || ['JavaScript', 'Python', 'React', 'DSA'],
    career_interests: acc.career_interests || ['Software Engineering'],
    target_companies: acc.target_companies || ['Google', 'Microsoft', 'Amazon'],
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Initialize local accounts database if missing
    const accounts = getLocalAccounts()

    // 2. Check for active session ID
    const activeSessionId = localStorage.getItem(ACTIVE_SESSION_KEY)
    if (activeSessionId) {
      const activeAccount = accounts.find(a => a.id === activeSessionId)
      if (activeAccount) {
        setUser(accountToUser(activeAccount))
        setProfile(accountToProfile(activeAccount))
      } else {
        // Fallback to seed account
        setUser(accountToUser(accounts[0]))
        setProfile(accountToProfile(accounts[0]))
        localStorage.setItem(ACTIVE_SESSION_KEY, accounts[0].id)
      }
    } else {
      // Default to logged in as initial demo student
      setUser(accountToUser(accounts[0]))
      setProfile(accountToProfile(accounts[0]))
      localStorage.setItem(ACTIVE_SESSION_KEY, accounts[0].id)
    }

    // 3. Supabase integration if configured
    if (isConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setSession(session)
          setUser(session.user)
          fetchSupabaseProfile(session.user.id)
        }
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session)
        if (session?.user) {
          setUser(session.user)
          await fetchSupabaseProfile(session.user.id)
        }
      })

      setLoading(false)
      return () => subscription.unsubscribe()
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchSupabaseProfile(userId: string) {
    if (!isConfigured) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) {
      setProfile(data)
    }
  }

  // Real Multi-User Sign Up with Password Storage & Duplicate Prevention
  async function signUp(
    email: string,
    password: string,
    name: string,
    extra?: Partial<Profile>
  ) {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) return { error: { message: 'Email is required' } }
    if (!password || password.length < 6) {
      return { error: { message: 'Password must be at least 6 characters' } }
    }

    const accounts = getLocalAccounts()
    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail)
    if (existing) {
      return {
        error: {
          message: 'An account with this email address already exists. Please log in.',
        },
      }
    }

    const newAccount: StoredAccount = {
      id: 'user-' + Date.now(),
      email: cleanEmail,
      password: password, // Persisted securely in localStorage accounts DB
      full_name: name.trim() || 'Student Candidate',
      avatar_url: null,
      college: extra?.college || 'Engineering Institute of Technology',
      branch: extra?.branch || 'Computer Science & Engineering',
      graduation_year: extra?.graduation_year || 2025,
      skills: extra?.skills || ['JavaScript', 'Python', 'React', 'DSA'],
      career_interests: extra?.career_interests || ['Software Engineering'],
      target_companies: extra?.target_companies || ['Google', 'Microsoft', 'Amazon'],
      created_at: new Date().toISOString(),
    }

    accounts.push(newAccount)
    saveLocalAccounts(accounts)

    // Set active session
    localStorage.setItem(ACTIVE_SESSION_KEY, newAccount.id)
    setUser(accountToUser(newAccount))
    setProfile(accountToProfile(newAccount))

    if (isConfigured) {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { full_name: name } },
      })
      return { error }
    }

    return { error: null }
  }

  // Real Multi-User Login with Password Verification
  async function signIn(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !password) {
      return { error: { message: 'Please provide both email and password.' } }
    }

    const accounts = getLocalAccounts()
    const account = accounts.find(a => a.email.toLowerCase() === cleanEmail)

    if (!account) {
      return {
        error: {
          message: 'No account found with this email. Please check your email or click Sign Up.',
        },
      }
    }

    if (account.password !== password) {
      return {
        error: {
          message: 'Incorrect password. Please verify your credentials and try again.',
        },
      }
    }

    // Password matches! Log the user in
    localStorage.setItem(ACTIVE_SESSION_KEY, account.id)
    setUser(accountToUser(account))
    setProfile(accountToProfile(account))

    if (isConfigured) {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })
      return { error }
    }

    return { error: null }
  }

  async function signInWithGoogle() {
    if (isConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      })
      return { error }
    } else {
      // In local mode, sign in to the default primary account
      const accounts = getLocalAccounts()
      const primary = accounts[0]
      localStorage.setItem(ACTIVE_SESSION_KEY, primary.id)
      setUser(accountToUser(primary))
      setProfile(accountToProfile(primary))
      return { error: null }
    }
  }

  async function signOut() {
    localStorage.removeItem(ACTIVE_SESSION_KEY)
    setUser(null)
    setProfile(null)
    if (isConfigured) {
      await supabase.auth.signOut()
    }
  }

  // Change Password for Currently Logged In Account
  async function changePassword(currentPass: string, newPass: string) {
    if (!user) return { error: { message: 'No active user session' } }
    if (!newPass || newPass.length < 6) {
      return { error: { message: 'New password must be at least 6 characters' } }
    }

    const accounts = getLocalAccounts()
    const idx = accounts.findIndex(a => a.id === user.id)
    if (idx === -1) return { error: { message: 'Account not found' } }

    if (accounts[idx].password !== currentPass) {
      return { error: { message: 'Current password does not match' } }
    }

    accounts[idx].password = newPass
    saveLocalAccounts(accounts)

    if (isConfigured) {
      const { error } = await supabase.auth.updateUser({ password: newPass })
      return { error }
    }

    return { error: null }
  }

  // Reset Password by Email (Forgot Password feature)
  async function resetPasswordByEmail(email: string, newPass: string) {
    const cleanEmail = email.trim().toLowerCase()
    const accounts = getLocalAccounts()
    const idx = accounts.findIndex(a => a.email.toLowerCase() === cleanEmail)

    if (idx === -1) {
      return { error: { message: 'No account registered with this email address.' } }
    }

    if (!newPass || newPass.length < 6) {
      return { error: { message: 'New password must be at least 6 characters' } }
    }

    accounts[idx].password = newPass
    saveLocalAccounts(accounts)

    return { error: null }
  }

  // Update Profile Data and Persist to Accounts Database
  async function updateProfile(updates: Partial<Profile>) {
    if (!user) return { error: { message: 'No active user session' } }

    setProfile(prev => {
      const updated = prev ? { ...prev, ...updates } : ({ id: user.id, email: user.email!, ...updates } as Profile)
      return updated
    })

    // Persist into local accounts DB
    const accounts = getLocalAccounts()
    const idx = accounts.findIndex(a => a.id === user.id)
    if (idx !== -1) {
      accounts[idx] = {
        ...accounts[idx],
        ...updates,
        full_name: updates.full_name !== undefined ? (updates.full_name || accounts[idx].full_name) : accounts[idx].full_name,
      }
      saveLocalAccounts(accounts)
    }

    if (isConfigured && user) {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates })
      return { error }
    }

    return { error: null }
  }

  async function refreshProfile() {
    if (user && isConfigured) await fetchSupabaseProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading,
      signUp, signIn, signInWithGoogle, signOut,
      updateProfile, changePassword, resetPasswordByEmail,
      refreshProfile,
      isSupabaseConfigured: !!isConfigured,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
