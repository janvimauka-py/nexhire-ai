import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Award, TrendingUp, MessageSquare, Code2, Clock,
  Download, RotateCcw, CheckCircle, XCircle, Target,
  BarChart2, ArrowRight, Sparkles, Check
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'
import AppLayout from '../../components/layout/AppLayout'
import { getScoreColor, getScoreBadge } from '../../lib/utils'
import jsPDF from 'jspdf'

export default function InterviewReportPage() {
  const { id } = useParams()
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    const data = sessionStorage.getItem(`report_${id}`)
    if (data) {
      setReportData(JSON.parse(data))
    } else {
      setReportData({
        type: 'technical', interviewer: 'anway', difficulty: 'intermediate',
        duration: 30, messages: 14, score: 78, timestamp: new Date().toISOString(),
        candidateName: 'Candidate',
        eyeContactScore: 92,
        postureStatus: 'Upright & Professional',
        attitudeStatus: 'Confident & Engaged',
        collectedResponses: []
      })
    }
  }, [id])

  if (!reportData) return (
    <AppLayout>
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading report...</div>
      </div>
    </AppLayout>
  )

  const overallScore = reportData.score || 82
  const scores = {
    technical: Math.min(overallScore + 4, 100),
    communication: Math.min(overallScore + 6, 100),
    problemSolving: Math.min(overallScore - 3, 100),
    timeManagement: Math.min(overallScore + 2, 100),
    codeQuality: Math.min(overallScore + 1, 100),
    presentation: reportData.eyeContactScore || 90,
  }

  const radarData = [
    { subject: 'Technical', A: scores.technical, fullMark: 100 },
    { subject: 'Communication', A: scores.communication, fullMark: 100 },
    { subject: 'Problem Solving', A: scores.problemSolving, fullMark: 100 },
    { subject: 'Time Mgmt', A: scores.timeManagement, fullMark: 100 },
    { subject: 'Code Quality', A: scores.codeQuality, fullMark: 100 },
    { subject: 'Presentation', A: scores.presentation, fullMark: 100 },
  ]

  const barData = [
    { name: 'Technical', score: scores.technical },
    { name: 'Communication', score: scores.communication },
    { name: 'Problem Solving', score: scores.problemSolving },
    { name: 'Time Mgmt', score: scores.timeManagement },
    { name: 'Code Quality', score: scores.codeQuality },
    { name: 'Eye Contact', score: scores.presentation },
  ]

  const strengths = [
    'Articulate technical communication and structured problem solving.',
    'Clear understanding of core time/space complexity trade-offs.',
    'Maintained strong eye contact and professional camera posture throughout.',
  ]

  const weaknesses = [
    overallScore < 85 && 'Be sure to explicitly verify edge case boundary conditions (null/empty inputs).',
    'Deepen familiarity with high-concurrency race condition primitives like Redis Lua scripts.',
    'Continue minimizing filler words by pausing silently when formulating thoughts.',
  ].filter(Boolean) as string[]

  const recommendations = [
    { text: 'Practice Dual Heap & Sliding Window Problems', href: '/coding', type: 'DSA' },
    { text: 'Review Distributed Rate Limiting & Concurrency', href: '/learn/sql', type: 'Architecture' },
    { text: 'Practice STAR Method Behavioral Responses with Arvi', href: '/communication', type: 'HR' },
    { text: 'Simulate Google / Amazon Specific Rounds', href: '/companies/google', type: 'Company' },
  ]

  function downloadPDF() {
    const doc = new jsPDF()
    doc.setFontSize(22)
    doc.text('NEXHIRE AI - Comprehensive Interview Report', 20, 25)

    doc.setFontSize(12)
    doc.text(`Candidate: ${reportData.candidateName || 'Candidate'}`, 20, 38)
    doc.text(`Interviewer: ${reportData.interviewer === 'arvi' ? 'Arvi (Director of Talent)' : 'Anway (Senior Staff Engineer)'}`, 20, 46)
    doc.text(`Interview Type: ${reportData.type.toUpperCase()}`, 20, 54)
    doc.text(`Date: ${new Date(reportData.timestamp).toLocaleDateString()}`, 20, 62)
    doc.text(`Overall Score: ${overallScore}/100 (${getScoreBadge(overallScore)})`, 20, 70)
    doc.text(`Posture Status: ${reportData.postureStatus || 'Upright & Professional'}`, 20, 78)
    doc.text(`Eye Contact Score: ${reportData.eyeContactScore || 92}%`, 20, 86)

    doc.setFontSize(14)
    doc.text('Detailed Metric Breakdown:', 20, 102)
    doc.setFontSize(10)
    doc.text(`Technical Knowledge: ${scores.technical}/100`, 25, 112)
    doc.text(`Communication & Articulation: ${scores.communication}/100`, 25, 120)
    doc.text(`Problem Solving & Algorithms: ${scores.problemSolving}/100`, 25, 128)
    doc.text(`System Design & Scalability: ${scores.codeQuality}/100`, 25, 136)
    doc.text(`Eye Contact & Professional Posture: ${scores.presentation}/100`, 25, 144)

    if (reportData.collectedResponses && reportData.collectedResponses.length > 0) {
      doc.setFontSize(14)
      doc.text('Candidate Answers & AI Error Diagnostic Audit:', 20, 160)
      doc.setFontSize(9)
      let yPos = 170
      reportData.collectedResponses.slice(0, 3).forEach((resp: any, i: number) => {
        if (yPos > 265) {
          doc.addPage()
          yPos = 25
        }
        doc.text(`Q${i + 1}: ${resp.stageName}`, 20, yPos)
        yPos += 7
        const splitAns = doc.splitTextToSize(`Candidate Answer: "${resp.candidateAnswer}"`, 170)
        doc.text(splitAns, 25, yPos)
        yPos += splitAns.length * 5 + 2
        if (resp.errorsDetected) {
          const splitErr = doc.splitTextToSize(`Error Identified: ${resp.errorsDetected}`, 170)
          doc.text(splitErr, 25, yPos)
          yPos += splitErr.length * 5 + 4
        }
      })
    }

    doc.save(`NEXHIRE_Interview_Report_${id}.pdf`)
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Interview <span className="gradient-text">Evaluation Report</span></h1>
            <p className="text-gray-400 text-sm">
              {new Date(reportData.timestamp).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}{reportData.type} interview with {reportData.interviewer === 'arvi' ? 'Arvi' : 'Anway'}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={downloadPDF}
              className="btn-secondary flex items-center gap-2 text-sm py-2">
              <Download size={16} /> Download Full PDF
            </button>
            <Link to="/interview/setup" className="btn-primary flex items-center gap-2 text-sm py-2">
              <RotateCcw size={16} /> Practice Another Round
            </Link>
          </div>
        </motion.div>

        {/* Overall Score */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="card p-8 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(30,64,175,0.2), rgba(124,58,237,0.2))' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ background: 'radial-gradient(ellipse, #3b82f6, transparent)' }} />
          <Award size={48} className="mx-auto mb-4 text-yellow-400" />
          <div className={`text-8xl font-black mb-2 ${getScoreColor(overallScore)}`}>{overallScore}</div>
          <div className="text-white text-xl font-bold mb-1">out of 100</div>
          <div className="text-gray-300 text-base">{getScoreBadge(overallScore)} Performance</div>
          {reportData.candidateName && (
            <div className="text-blue-400 text-xs font-semibold mt-1">Candidate: {reportData.candidateName}</div>
          )}
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            {[
              { label: 'Rounds Completed', value: `${reportData.collectedResponses?.length || 5}` },
              { label: 'Session Duration', value: `${reportData.duration}m` },
              { label: 'Eye Contact', value: `${reportData.eyeContactScore || 92}%` },
              { label: 'Posture Rating', value: reportData.postureStatus || 'Upright & Professional' },
              { label: 'Demeanor', value: reportData.attitudeStatus || 'Confident & Engaged' },
            ].map(stat => (
              <div key={stat.label} className="glass rounded-xl px-4 py-2">
                <div className="text-white font-bold text-sm">{stat.value}</div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Candidate Responses & Error Audit Card */}
        {reportData.collectedResponses && reportData.collectedResponses.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-bold text-base">Candidate Answers & Error Diagnostics</h3>
              </div>
              <span className="badge badge-purple text-xs">
                {reportData.collectedResponses.length} Question Responses Logged
              </span>
            </div>

            <div className="space-y-4">
              {reportData.collectedResponses.map((item: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-blue text-[11px] font-semibold">{item.stageName}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold ${item.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'}`}>
                      Score: {item.score}/100
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-semibold block mb-0.5">Interviewer Question:</span>
                    <p className="text-gray-200 font-medium">{item.question}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/20">
                    <span className="text-blue-300 font-bold block mb-1">Your Stated Response:</span>
                    <p className="text-white italic leading-relaxed">"{item.candidateAnswer}"</p>
                  </div>

                  {item.errorsDetected && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1">
                        <XCircle className="w-4 h-4" /> Error Identified in Your Response:
                      </div>
                      <p>{item.errorsDetected}</p>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-gray-300">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
                      <Check className="w-4 h-4" /> Ideal Formulated Answer:
                    </div>
                    <p className="italic">{item.correctedAnswer}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Score Breakdown Charts */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="md:col-span-2 card p-6">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-400" /> Score Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#6b7280" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#111845', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="score" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" />
                    <stop offset="95%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="card p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Target size={18} className="text-purple-400" /> Skill Competency Radar
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 9 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="card p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-400" /> Confirmed Strengths
            </h3>
            <div className="space-y-3">
              {strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" />
                  {s}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="card p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <XCircle size={18} className="text-red-400" /> Priority Areas to Correct
            </h3>
            <div className="space-y-3">
              {weaknesses.map((w, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  {w}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="card p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Target size={18} className="text-blue-400" /> AI Recommended Practice Plan
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {recommendations.map((rec, i) => (
              <Link key={i} to={rec.href}
                className="flex items-center gap-3 p-3 rounded-xl transition-all group hover:bg-white/5"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">{rec.text}</div>
                  <div className="text-gray-500 text-xs">{rec.type}</div>
                </div>
                <ArrowRight size={14} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center pb-6">
          <Link to="/interview/setup" className="btn-primary flex items-center gap-2">
            <RotateCcw size={16} /> Practice Another Interview
          </Link>
          <Link to="/coding" className="btn-secondary flex items-center gap-2">
            <Code2 size={16} /> Practice Coding & DSA
          </Link>
          <Link to="/analytics" className="btn-secondary flex items-center gap-2">
            <BarChart2 size={16} /> Full Analytics
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
