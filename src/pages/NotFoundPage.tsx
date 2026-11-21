import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-10 max-w-md w-full"
      >
        <span className="text-6xl font-black gradient-text block mb-2">404</span>
        <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-xs text-gray-400 mb-6">
          The page or interview module you requested could not be found. Let's get you back on track!
        </p>

        <div className="flex justify-center gap-3">
          <Link to="/" className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back Home
          </Link>
          <Link to="/dashboard" className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" /> Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
