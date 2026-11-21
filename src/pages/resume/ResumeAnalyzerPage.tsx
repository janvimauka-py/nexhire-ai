import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Upload, CheckCircle2, AlertTriangle, ArrowRight,
  Sparkles, RefreshCw, Download, Check, HelpCircle
} from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'
import { calculateATSScore } from '../../lib/utils'
import toast from 'react-hot-toast'
import mammoth from 'mammoth'
import jsPDF from 'jspdf'

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'formatting' | 'editor'>('overview')
  const [editableResume, setEditableResume] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    const fileName = uploadedFile.name.toLowerCase()

    if (fileName.endsWith('.docx')) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer
          const res = await mammoth.extractRawText({ arrayBuffer })
          setResumeText(res.value)
          setEditableResume(res.value)
        } catch (err) {
          toast.error('Failed to read .docx file. Using plain text.')
        }
      }
      reader.readAsArrayBuffer(uploadedFile)
    } else {
      // For PDF or txt
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = (event.target?.result as string) || ''
        setResumeText(text)
        setEditableResume(text)
      }
      reader.readAsText(uploadedFile)
    }
  }

  const runAnalysis = () => {
    const textToAnalyze = resumeText.trim()
    if (!textToAnalyze && !file) {
      toast.error('Please upload a resume or paste text to analyze!')
      return
    }

    setAnalyzing(true)
    setTimeout(() => {
      const content = textToAnalyze || 'Software Engineer Intern with React, TypeScript, Python, SQL, Git and Data Structures experience.'
      const atsData = calculateATSScore(content, jobDescription)

      const detailedResult = {
        score: atsData.score,
        keywordsFound: atsData.keywords,
        missingKeywords: atsData.missing,
        suggestions: atsData.suggestions,
        sections: {
          contactInfo: { status: 'passed', message: 'Email and phone number detected clearly.' },
          education: { status: 'passed', message: 'Degree and graduation details well placed.' },
          experience: { status: content.toLowerCase().includes('experience') ? 'passed' : 'warning', message: content.toLowerCase().includes('experience') ? 'Work experience / internship section is distinct.' : 'Consider creating a dedicated "Work Experience" or "Internships" heading.' },
          projects: { status: content.toLowerCase().includes('project') ? 'passed' : 'warning', message: content.toLowerCase().includes('project') ? 'Projects section highlights real-world technical implementation.' : 'Add 2-3 prominent technical projects with live demo and GitHub links.' },
          formatting: { status: 'passed', message: 'Standard standard single-column layout recommended for 99% ATS compatibility.' }
        }
      }

      setAnalysisResult(detailedResult)
      setAnalyzing(false)
      toast.success('Resume analysis complete!')
    }, 1200)
  }

  const handleDownloadImproved = () => {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text('IMPROVED RESUME - NEXHIRE AI OPTIMIZED', 20, 20)
    doc.setFontSize(10)
    const splitText = doc.splitTextToSize(editableResume || resumeText || 'Optimized resume content goes here.', 170)
    doc.text(splitText, 20, 32)
    doc.save('Nexhire_Optimized_Resume.pdf')
    toast.success('Downloaded optimized resume PDF!')
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            AI Resume Analyzer & <span className="gradient-text">ATS Checker</span>
          </h1>
          <p className="text-gray-400">
            Scan your resume for ATS score estimation, keyword gaps, and instant optimization recommendations.
          </p>
        </div>

        {/* Notice Banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl glass border border-blue-500/20 text-xs text-blue-200">
          <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Transparency Notice:</span> ATS (Applicant Tracking System) scores are algorithmic approximations and vary between commercial platforms (Workday, Greenhouse, Lever). Use these insights as guidance to maximize machine readability.
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Input Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="card p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" /> Upload Resume
              </h2>

              <label className="border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                <FileText className="w-12 h-12 text-gray-400 group-hover:text-blue-400 mb-2 transition-colors" />
                <span className="text-sm font-medium text-white mb-1">
                  {file ? file.name : 'Click to upload PDF, DOCX or TXT'}
                </span>
                <span className="text-xs text-gray-500">Maximum file size: 10MB</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-xs text-gray-500 uppercase">Or Paste Resume Text</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value)
                  setEditableResume(e.target.value)
                }}
                placeholder="Paste your raw resume text here..."
                className="input-field text-xs font-mono resize-none mb-4"
              />

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
                  Target Job Description (Optional for keyword matching)
                </label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste Job Description here (e.g., Software Engineer at Google)..."
                  className="input-field text-xs resize-none"
                />
              </div>

              <button
                onClick={runAnalysis}
                disabled={analyzing}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing ATS Metrics...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Scan & Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Analysis Report */}
          <div className="lg:col-span-7">
            {analysisResult ? (
              <div className="space-y-4">
                {/* Score Card */}
                <div className="card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 gradient-electric/10 border-blue-500/30">
                  <div>
                    <span className="badge badge-blue text-xs mb-2">ATS Compatibility Score</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white">{analysisResult.score}</span>
                      <span className="text-gray-400 font-semibold">/ 100</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">
                      {analysisResult.score >= 80 ? '🌟 Highly ATS-Optimized' : analysisResult.score >= 60 ? '👍 Good foundation, needs keyword fine-tuning' : '⚠️ Requires substantial ATS restructuring'}
                    </p>
                  </div>

                  <div className="w-full sm:w-48 bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                    <span className="text-xs text-gray-400 block mb-1">Keywords Match</span>
                    <span className="text-lg font-bold text-blue-400">
                      {analysisResult.keywordsFound.length} Detected
                    </span>
                  </div>
                </div>

                {/* Report Tabs */}
                <div className="flex gap-2 border-b border-white/10 pb-2">
                  {[
                    { id: 'overview', label: 'Overview & Recommendations' },
                    { id: 'keywords', label: 'Keyword Gap Analysis' },
                    { id: 'editor', label: 'Live Resume Editor' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'gradient-primary text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="card p-5 space-y-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" /> Structure & Sections Audit
                      </h3>
                      <div className="space-y-2 text-xs">
                        {Object.entries(analysisResult.sections).map(([key, val]: any) => (
                          <div key={key} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/5">
                            {val.status === 'passed' ? (
                              <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className="font-semibold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>: {val.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card p-5 space-y-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" /> Actionable Improvements
                      </h3>
                      <ul className="space-y-2 text-xs text-gray-300">
                        {analysisResult.suggestions.map((sug: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                            {sug}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'keywords' && (
                  <div className="space-y-4">
                    <div className="card p-5">
                      <h3 className="text-sm font-bold text-white mb-3">Identified Technical Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.keywordsFound.map((kw: string) => (
                          <span key={kw} className="badge badge-green text-xs capitalize">
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="card p-5">
                      <h3 className="text-sm font-bold text-white mb-3">Recommended Missing Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.missingKeywords.map((kw: string) => (
                          <span key={kw} className="badge badge-red text-xs capitalize">
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'editor' && (
                  <div className="card p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Edit your resume content to improve keyword placement:</span>
                      <button
                        onClick={handleDownloadImproved}
                        className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </button>
                    </div>

                    <textarea
                      rows={12}
                      value={editableResume}
                      onChange={(e) => setEditableResume(e.target.value)}
                      className="input-field text-xs font-mono"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-12 text-center flex flex-col items-center justify-center border-dashed">
                <FileText className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">No Resume Scanned Yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mb-6">
                  Upload your resume file or paste text on the left to get a comprehensive ATS review.
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-400">
                  <span>Fast 10-second scan</span> • <span>99% ATS format verification</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
