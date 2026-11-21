import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

export function getScoreBadge(score: number): string {
  if (score >= 90) return 'Exceptional'
  if (score >= 80) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 60) return 'Average'
  if (score >= 50) return 'Below Average'
  return 'Needs Improvement'
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'text-green-400'
    case 'medium': return 'text-yellow-400'
    case 'hard': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

export function getDifficultyBadgeClass(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-green'
    case 'medium': return 'badge-coral'
    case 'hard': return 'badge-red'
    default: return 'badge-blue'
  }
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function calculateATSScore(resumeText: string, jobDescription?: string): {
  score: number
  keywords: string[]
  missing: string[]
  suggestions: string[]
} {
  const techKeywords = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'react', 'node.js',
    'sql', 'mongodb', 'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
    'machine learning', 'deep learning', 'api', 'microservices', 'ci/cd',
    'restful', 'graphql', 'html', 'css', 'algorithms', 'data structures',
  ]

  const resumeLower = resumeText.toLowerCase()
  const found = techKeywords.filter(kw => resumeLower.includes(kw))
  const missing = techKeywords.filter(kw => !resumeLower.includes(kw)).slice(0, 5)

  let score = 40 // Base score
  score += Math.min(found.length * 3, 30) // Keywords: up to 30

  // Check for sections
  if (resumeLower.includes('experience') || resumeLower.includes('work')) score += 5
  if (resumeLower.includes('education')) score += 5
  if (resumeLower.includes('project')) score += 5
  if (resumeLower.includes('skill')) score += 5
  if (resumeLower.includes('achievement') || resumeLower.includes('award')) score += 5
  if (resumeLower.includes('certification')) score += 5

  score = Math.min(score, 100)

  const suggestions = [
    'Add quantifiable achievements (e.g., "Improved performance by 40%")',
    'Include relevant certifications and online courses',
    'Add a professional summary at the top',
    'Use strong action verbs (developed, designed, implemented, optimized)',
    'Ensure consistent formatting throughout the document',
  ]

  return { score, keywords: found, missing, suggestions }
}
