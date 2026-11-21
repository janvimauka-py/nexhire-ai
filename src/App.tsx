import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import InterviewRoomPage from './pages/interview/InterviewRoomPage'
import InterviewSetupPage from './pages/interview/InterviewSetupPage'
import InterviewReportPage from './pages/interview/InterviewReportPage'
import CodingPage from './pages/coding/CodingPage'
import CodingProblemPage from './pages/coding/CodingProblemPage'
import LearnPage from './pages/learn/LearnPage'
import LearnTopicPage from './pages/learn/LearnTopicPage'
import CompaniesPage from './pages/companies/CompaniesPage'
import CompanyDetailPage from './pages/companies/CompanyDetailPage'
import ResumeAnalyzerPage from './pages/resume/ResumeAnalyzerPage'
import CommunicationCoachPage from './pages/communication/CommunicationCoachPage'
import AnalyticsPage from './pages/analytics/AnalyticsPage'
import RoadmapPage from './pages/roadmap/RoadmapPage'
import MockInterviewPage from './pages/mock/MockInterviewPage'
import NotFoundPage from './pages/NotFoundPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-bg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center pulse-glow">
            <span className="text-2xl font-black text-white">N</span>
          </div>
          <div className="text-blue-400 animate-pulse font-semibold">Loading NEXHIRE AI...</div>
        </div>
      </div>
    )
  }
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/interview/setup" element={<ProtectedRoute><InterviewSetupPage /></ProtectedRoute>} />
          <Route path="/interview/room" element={<ProtectedRoute><InterviewRoomPage /></ProtectedRoute>} />
          <Route path="/interview/report/:id" element={<ProtectedRoute><InterviewReportPage /></ProtectedRoute>} />
          <Route path="/coding" element={<ProtectedRoute><CodingPage /></ProtectedRoute>} />
          <Route path="/coding/:problemId" element={<ProtectedRoute><CodingProblemPage /></ProtectedRoute>} />
          <Route path="/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
          <Route path="/learn/:topic" element={<ProtectedRoute><LearnTopicPage /></ProtectedRoute>} />
          <Route path="/companies" element={<ProtectedRoute><CompaniesPage /></ProtectedRoute>} />
          <Route path="/companies/:company" element={<ProtectedRoute><CompanyDetailPage /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><ResumeAnalyzerPage /></ProtectedRoute>} />
          <Route path="/communication" element={<ProtectedRoute><CommunicationCoachPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
          <Route path="/mock" element={<ProtectedRoute><MockInterviewPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(17, 24, 69, 0.95)',
            color: '#fff',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  )
}
