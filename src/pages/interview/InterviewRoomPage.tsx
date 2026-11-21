import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Video, VideoOff, Volume2, VolumeX,
  PhoneOff, Pause, Play, MessageSquare, Clock,
  Loader2, Send, Eye, ShieldCheck, Activity,
  CheckCircle2, Sparkles, BookOpen, ChevronUp,
  Award, Check, XCircle, Radio, CornerDownLeft,
  Volume1, Hand, LayoutGrid, Maximize2, User
} from 'lucide-react'
import { askGemini, isGeminiConfigured } from '../../lib/gemini'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export interface CandidateResponseRecord {
  stageName: string
  question: string
  candidateAnswer: string
  score: number
  strengths: string
  errorsDetected: string | null
  correctedAnswer: string
  timestamp: string
}

interface Message {
  role: 'interviewer' | 'user'
  content: string
  timestamp: Date
  conversationType?: 'answer' | 'casual' | 'clarification' | 'nervous' | 'admit_unknown' | 'gratitude'
  analysis?: {
    score: number
    strengths: string
    errorsDetected: string | null
    correctedAnswer: string
  }
}

interface PostureMetrics {
  eyeContactScore: number
  isSlouching: boolean
  isLookingAway: boolean
  isFidgeting: boolean
  postureStatus: 'Upright & Professional' | 'Slouching Detected' | 'Head Tilted' | 'Camera Centered'
  attitudeStatus: 'Confident & Engaged' | 'Distracted' | 'Fidgeting / Restless' | 'Attentive'
  lastFeedback: string | null
}

interface InterviewStage {
  stageName: string
  badge: string
  question: (name: string) => string
  keyPoints: string[]
  modelAnswer: string
  commonPitfalls: string[]
}

const TECHNICAL_STAGES: InterviewStage[] = [
  {
    stageName: 'Stage 1: Professional Introduction & Technical Background',
    badge: 'Introduction',
    question: (name: string) =>
      `Hello ${name}, welcome! Thank you for joining us today. My name is Anway. I'm a Senior Staff Software Engineer on the Distributed Systems infrastructure team. Before we dive into technical problems and algorithms, I want to give you the floor. Please introduce yourself — tell me about your background, the key projects you've built, and what areas of technology excite you the most.`,
    keyPoints: [
      'Concise 60-90 second elevator pitch covering education, core tech stack, and proudest project.',
      'Show passion for problem solving and continuous learning.',
      'Keep it structured: Past background → Present technical focus → Future aspiration.'
    ],
    modelAnswer:
      "Hello Anway, thank you for having me! I have a strong foundation in Computer Science and software engineering. Over the past few years, I've specialized in full-stack engineering and distributed backends, primarily working with React, TypeScript, Python, and SQL databases. Recently, I built an end-to-end scalable application with microservices and containerized workflows. What excites me most is designing resilient, low-latency systems that solve tangible problems at scale.",
    commonPitfalls: [
      'Reciting your resume line-by-line without storytelling.',
      'Rambling past 2 minutes without clear structure.',
      'Failing to mention specific technologies you are comfortable discussing.'
    ]
  },
  {
    stageName: 'Stage 2: Core CS Fundamentals & Memory Architecture',
    badge: 'CS Fundamentals',
    question: (_name: string) =>
      `Great introduction! Let's examine some core engineering fundamentals. Can you explain the internal differences between a Hash Table and a Balanced Binary Search Tree? Specifically, under what conditions does a Hash Table lookup degrade from O(1) to O(N), and how do modern runtimes mitigate this?`,
    keyPoints: [
      'Hash Table: O(1) average lookup using hash function and buckets. Degradation occurs during excessive hash collisions.',
      'BST (e.g., Red-Black Tree): O(log N) guaranteed lookup with in-order sorting.',
      'Collision resolution: Separate chaining (linked lists/trees in Java 8+) and open addressing.',
      'Treeification: Converting linked buckets to balanced trees when chain length exceeds threshold (e.g., 8 in Java).'
    ],
    modelAnswer:
      "In a Hash Table, lookups are average O(1) time because keys are mapped via a hash function into an array of buckets. However, if multiple keys hash to the same bucket (collision), it degrades to O(N) if chained linearly. In contrast, a Balanced BST (like a Red-Black Tree) guarantees O(log N) worst-case lookups and maintains sorted order. Modern engines mitigate collision degradation through prime-sized dynamic resizing and 'treeification', where bucket chains convert into balanced search trees once length exceeds a threshold like 8.",
    commonPitfalls: [
      'Stating Hash Tables are always strictly O(1) without acknowledging worst-case O(N).',
      'Forgetting how collision resolution works in practice.'
    ]
  },
  {
    stageName: 'Stage 3: Algorithmic Problem Solving & DSA Optimization',
    badge: 'DSA & Algorithms',
    question: (_name: string) =>
      `Excellent! Now let's work on an algorithmic scenario: Suppose you are given a stream of integers and need to continuously find the 'Median' of the numbers seen so far in O(1) time. How would you architect this data structure? Walk me through your design, edge cases, and time/space complexity.`,
    keyPoints: [
      'Dual Heap Pattern: Max-Heap for lower half of numbers, Min-Heap for upper half.',
      'Balancing invariant: Size difference between the two heaps must never exceed 1.',
      'Insertion time: O(log N) to insert into heaps.',
      'Median retrieval: O(1) by peeking the top of one or both heaps.'
    ],
    modelAnswer:
      "The optimal solution uses the Dual Heap pattern. We maintain two heaps: a Max-Heap for the smaller half of numbers and a Min-Heap for the larger half. Invariant: either both heaps have equal size (even count), or the Max-Heap has exactly one more element (odd count). To find the median in O(1), if total count is odd, it's the top of the Max-Heap; if even, it's the average of both tops. Inserting a new number takes O(log N) to push and rebalance heaps, with O(N) auxiliary space.",
    commonPitfalls: [
      'Proposing a single sorted array which takes O(N) insertion time.',
      'Failing to mention how to maintain the heap balance invariant.'
    ]
  },
  {
    stageName: 'Stage 4: System Architecture & Distributed Scalability',
    badge: 'System Design',
    question: (_name: string) =>
      `Let's transition to system architecture. Imagine we need to design a distributed Rate Limiter for an API gateway handling 100,000 requests per second across multiple data centers. Which rate-limiting algorithm would you choose, where would you store state, and how would you prevent race conditions under high concurrency?`,
    keyPoints: [
      'Algorithms: Token Bucket or Sliding Window Log / Counter.',
      'State Storage: In-memory distributed cache like Redis with clustered sharding.',
      'Concurrency control: Redis Lua scripts or atomic INCR/EXPIRE operations to eliminate race conditions.',
      'Fault tolerance: Local memory fallback if central cache is unreachable.'
    ],
    modelAnswer:
      "For a high-throughput API gateway, I would choose the Token Bucket algorithm for its memory efficiency and ability to handle bursts. For state storage, a centralized distributed in-memory cache like Redis Cluster is ideal. To prevent race conditions between concurrent requests, we execute the token deduction logic inside an atomic Redis Lua script. At 100k RPS, we shard keys by user ID/IP and add a local in-memory fallback cache with circuit breakers to guarantee resilience if Redis experiences latency.",
    commonPitfalls: [
      'Suggesting an RDBMS database which would bottle-neck at 100k writes/sec.',
      'Ignoring distributed race conditions when multiple app servers update counters concurrently.'
    ]
  },
  {
    stageName: 'Stage 5: Candidate Questions & Professional Wrap-Up',
    badge: 'Wrap-Up',
    question: (_name: string) =>
      `You've done very well across our technical rounds. We have a few minutes left, and interviewers love curious engineers. What thoughtful questions do you have for me about our engineering team, our architectural roadmap, or how we handle production incidents?`,
    keyPoints: [
      'Ask insightful questions about engineering culture, deployment pipelines, or technical debt.',
      'Avoid generic questions like "What are the hours?". Show technical curiosity.',
      'Inquire about team autonomy, microservices evolution, or mentorship.'
    ],
    modelAnswer:
      "Thank you, Anway! I have two questions: First, how does your engineering team balance shipping product features with refactoring technical debt and maintaining infrastructure resilience? Second, could you share how your team approaches blameless post-mortems when critical production incidents happen?",
    commonPitfalls: [
      'Saying "No, I don\'t have any questions."',
      'Asking questions easily found on Google\'s public homepage.'
    ]
  }
]

const HR_STAGES: InterviewStage[] = [
  {
    stageName: 'Stage 1: Self-Introduction & Career Trajectory',
    badge: 'Introduction',
    question: (name: string) =>
      `Hi ${name}, wonderful to meet you! My name is Arvi, and I lead talent acquisition and people culture. Today's conversation is designed to get to know the person behind the credentials — how you think, how you collaborate, and what motivates you. To kick things off, please introduce yourself and tell me about your journey and what brings you here today.`,
    keyPoints: [
      'Articulate elevator pitch highlighting values, work ethic, and achievements.',
      'Communicate with warmth, positive energy, and professional presence.',
      'Clear connection between past achievements and excitement for this company.'
    ],
    modelAnswer:
      "Hi Arvi, it's a pleasure to speak with you! My journey began with a curiosity for building software that makes people's lives easier. Over the course of my engineering degree, I've honed both my technical skills in full-stack development and my leadership abilities by coordinating hackathons and student engineering chapters. I thrive in collaborative environments where ownership and empathy matter just as much as technical excellence.",
    commonPitfalls: [
      'Speaking in a monotone, unenthusiastic voice.',
      'Focusing purely on technical jargon without showing interpersonal strengths.'
    ]
  },
  {
    stageName: 'Stage 2: Conflict Resolution & Team Collaboration (STAR Method)',
    badge: 'Behavioral',
    question: (name: string) =>
      `Thank you, ${name}! Collaboration is critical here. Tell me about a time when you experienced a disagreement or conflict within a project team — whether technical or interpersonal. How did you handle it and what was the outcome?`,
    keyPoints: [
      'Situation: Set context briefly.',
      'Task: What was your specific responsibility?',
      'Action: Emphasize empathetic listening, data-driven discussion, and compromise.',
      'Result: Positive outcome for the project and strengthened relationships.'
    ],
    modelAnswer:
      "During our capstone engineering project, two team members and I disagreed on whether to use GraphQL or REST for our API. Rather than let debates stall progress, I organized a 30-minute whiteboard spike where we evaluated our requirements against both options: client bandwidth, team familiarity, and delivery deadlines. When the data showed our schema was stable and REST would allow us to ship 2 weeks faster, the team aligned harmoniously. We shipped on time with zero regressions.",
    commonPitfalls: [
      'Blaming the other person or sounding defensive.',
      'Not specifying your personal action in resolving the tension.'
    ]
  },
  {
    stageName: 'Stage 3: Handling Failure, Setbacks, and Growth Mindset',
    badge: 'Resilience',
    question: (_name: string) =>
      `Great answer. In engineering, setbacks happen. Can you describe a specific time you made a significant mistake or failed to meet an expectation? How did you take ownership and what did you learn?`,
    keyPoints: [
      'Honest, genuine admission of a real mistake without deflection.',
      'Immediate constructive accountability and containment.',
      'Long-term systemic improvement or preventative measure implemented.'
    ],
    modelAnswer:
      "In a previous internship project, I pushed an unverified configuration change that briefly broke our staging integration pipeline. As soon as automated alerts fired, I notified our lead, took full ownership, and immediately reverted the commit. Afterwards, instead of simply moving on, I authored a pull-request checklist and added automated pre-commit linting to guarantee that bad configuration syntax would be caught before reaching staging. That mistake taught me the importance of defense-in-depth.",
    commonPitfalls: [
      'Choosing a fake failure like "I worked too hard."',
      'Blaming leadership, unclear specs, or teammates.'
    ]
  },
  {
    stageName: 'Stage 4: Company Culture & Candidate Questions',
    badge: 'Culture Fit',
    question: (_name: string) =>
      `That shows great self-awareness. Why do our company's mission and engineering values resonate with you personally, and what questions do you have for me about our culture and growth pathways?`,
    keyPoints: [
      'Demonstrate genuine knowledge of company culture (e.g. innovation, ownership, customer obsession).',
      'Ask questions about professional growth, peer mentorship, and team rituals.'
    ],
    modelAnswer:
      "Your commitment to user-centric engineering and continuous innovation deeply aligns with my values. I admire how your teams empower junior engineers to take end-to-end ownership. My question for you, Arvi: What differentiates the engineers who truly thrive and grow into leaders within your organization during their first year?",
    commonPitfalls: [
      'Giving generic answers that apply to any random company.',
      'Focusing solely on compensation or perks.'
    ]
  }
]

function RealisticAnway({ speaking, isBlinking }: { speaking: boolean; isBlinking: boolean }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a1638] via-[#0d1d4d] to-[#08102b] p-4 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 text-center flex flex-col items-center">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center p-1.5 shadow-2xl avatar-ring"
          style={{
            background: 'linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa)',
            boxShadow: speaking ? '0 0 55px rgba(59, 130, 246, 0.8)' : '0 0 25px rgba(59, 130, 246, 0.3)'
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full rounded-full overflow-hidden">
            <circle cx="100" cy="100" r="98" fill="#0d1b3e" />
            <path d="M75 145 L100 165 L125 145 L140 200 L60 200 Z" fill="#1e293b" />
            <path d="M85 140 L100 162 L115 140 L120 180 L80 180 Z" fill="#ffffff" />
            <path d="M96 158 L104 158 L102 188 L98 188 Z" fill="#2563eb" />
            <polygon points="60,180 82,145 98,188 70,200" fill="#0f172a" />
            <polygon points="140,180 118,145 102,188 130,200" fill="#0f172a" />
            <ellipse cx="100" cy="98" rx="42" ry="48" fill="#f8d7b8" />
            <ellipse cx="100" cy="106" rx="34" ry="38" fill="#f3caa1" />
            <path d="M58 88 Q62 48 100 48 Q138 48 142 88 Q135 62 100 62 Q65 62 58 88 Z" fill="#1e1b18" />
            <path d="M60 85 Q75 52 105 52 Q132 52 140 85 Q125 65 102 65 Q72 65 60 85 Z" fill="#2e2620" />
            <path d="M72 82 Q84 78 94 82" stroke="#2e2620" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M106 82 Q116 78 128 82" stroke="#2e2620" strokeWidth="3" fill="none" strokeLinecap="round" />

            {isBlinking ? (
              <>
                <line x1="74" y1="92" x2="90" y2="92" stroke="#1e1b18" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="110" y1="92" x2="126" y2="92" stroke="#1e1b18" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <ellipse cx="82" cy="92" rx="7.5" ry="5.5" fill="#ffffff" />
                <circle cx="83" cy="92" r="3.8" fill="#1e3a8a" />
                <circle cx="84" cy="91" r="1.4" fill="#ffffff" />
                <ellipse cx="118" cy="92" rx="7.5" ry="5.5" fill="#ffffff" />
                <circle cx="117" cy="92" r="3.8" fill="#1e3a8a" />
                <circle cx="118" cy="91" r="1.4" fill="#ffffff" />
              </>
            )}

            <path d="M100 92 L98 108 L103 108" stroke="#d49b6a" strokeWidth="2" fill="none" strokeLinecap="round" />

            {speaking ? (
              <motion.ellipse
                animate={{ ry: [2, 7, 3, 8, 2] }}
                transition={{ duration: 0.32, repeat: Infinity }}
                cx="100" cy="126" rx="9" ry="5" fill="#991b1b"
              />
            ) : (
              <path d="M92 125 Q100 129 108 125" stroke="#991b1b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}

            <ellipse cx="58" cy="98" rx="4" ry="8" fill="#f8d7b8" />
            <ellipse cx="142" cy="98" rx="4" ry="8" fill="#f8d7b8" />
          </svg>
        </motion.div>

        <div className="mt-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-white font-black text-lg tracking-wide">ANWAY</h3>
            <span className="badge badge-blue text-[10px] uppercase">Senior Staff Engineer</span>
          </div>
          <p className="text-blue-300 text-xs mt-0.5">Google & Meta Interview Specialist • Distributed Systems</p>

          {speaking && (
            <div className="flex justify-center items-center gap-1 mt-2.5 h-4">
              {[40, 80, 95, 65, 90, 55, 95, 70, 45].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [`${h * 0.16}px`, `${h * 0.22}px`, `${h * 0.12}px`] }}
                  transition={{ duration: 0.3 + (i % 3) * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1 bg-gradient-to-t from-blue-500 to-cyan-300 rounded-full"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RealisticArvi({ speaking, isBlinking }: { speaking: boolean; isBlinking: boolean }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-b from-[#1e0e38] via-[#2a134d] to-[#120724] p-4 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 text-center flex flex-col items-center">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center p-1.5 shadow-2xl avatar-ring"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
            boxShadow: speaking ? '0 0 55px rgba(168, 85, 247, 0.8)' : '0 0 25px rgba(168, 85, 247, 0.3)'
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full rounded-full overflow-hidden">
            <circle cx="100" cy="100" r="98" fill="#1d1133" />
            <path d="M78 145 L100 168 L122 145 L144 200 L56 200 Z" fill="#3b0764" />
            <path d="M88 142 L100 162 L112 142 L116 185 L84 185 Z" fill="#ffffff" />
            <polygon points="56,180 80,145 100,175 68,200" fill="#2e1065" />
            <polygon points="144,180 120,145 100,175 132,200" fill="#2e1065" />
            <path d="M50 85 Q45 130 55 170 Q70 175 75 140 Q55 110 65 85 Z" fill="#231709" />
            <path d="M150 85 Q155 130 145 170 Q130 175 125 140 Q145 110 135 85 Z" fill="#231709" />
            <ellipse cx="100" cy="98" rx="38" ry="45" fill="#fbe1ce" />
            <ellipse cx="100" cy="104" rx="32" ry="36" fill="#f7d4bd" />
            <path d="M58 85 Q70 45 100 45 Q130 45 142 85 Q130 60 100 60 Q65 60 58 85 Z" fill="#2e1f10" />
            <path d="M58 85 Q80 62 108 72 Q90 60 62 82 Z" fill="#422d17" />
            <path d="M72 82 Q82 76 92 81" stroke="#2e1f10" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M108 81 Q118 76 128 82" stroke="#2e1f10" strokeWidth="2.4" fill="none" strokeLinecap="round" />

            {isBlinking ? (
              <>
                <line x1="74" y1="91" x2="90" y2="91" stroke="#231709" strokeWidth="2.4" strokeLinecap="round" />
                <line x1="110" y1="91" x2="126" y2="91" stroke="#231709" strokeWidth="2.4" strokeLinecap="round" />
              </>
            ) : (
              <>
                <ellipse cx="82" cy="91" rx="7.5" ry="5.5" fill="#ffffff" />
                <circle cx="83" cy="91" r="3.6" fill="#581c87" />
                <circle cx="84" cy="90" r="1.3" fill="#ffffff" />
                <ellipse cx="118" cy="91" rx="7.5" ry="5.5" fill="#ffffff" />
                <circle cx="117" cy="91" r="3.6" fill="#581c87" />
                <circle cx="118" cy="90" r="1.3" fill="#ffffff" />
              </>
            )}

            <path d="M100 93 L98 107 L102 107" stroke="#dea27c" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {speaking ? (
              <motion.ellipse
                animate={{ ry: [2, 6, 2.5, 7, 2] }}
                transition={{ duration: 0.32, repeat: Infinity }}
                cx="100" cy="124" rx="8" ry="4.5" fill="#be123c"
              />
            ) : (
              <path d="M93 124 Q100 128 107 124" stroke="#be123c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}

            <circle cx="58" cy="102" r="2.5" fill="#fbbf24" />
            <circle cx="142" cy="102" r="2.5" fill="#fbbf24" />
          </svg>
        </motion.div>

        <div className="mt-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-white font-black text-lg tracking-wide">ARVI</h3>
            <span className="badge badge-purple text-[10px] uppercase">Director of People & Talent</span>
          </div>
          <p className="text-purple-300 text-xs mt-0.5">Behavioral Psychologist & STAR Assessment Lead</p>

          {speaking && (
            <div className="flex justify-center items-center gap-1 mt-2.5 h-4">
              {[40, 80, 95, 65, 90, 55, 95, 70, 45].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [`${h * 0.16}px`, `${h * 0.22}px`, `${h * 0.12}px`] }}
                  transition={{ duration: 0.3 + (i % 3) * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1 bg-gradient-to-t from-purple-500 to-pink-300 rounded-full"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InterviewRoomPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { profile } = useAuth()

  const type = searchParams.get('type') || 'technical'
  const interviewer = searchParams.get('interviewer') || 'anway'
  const difficulty = searchParams.get('difficulty') || 'intermediate'
  const duration = parseInt(searchParams.get('duration') || '30')

  const candidateName = profile?.full_name || 'Janvi'
  const stages: InterviewStage[] = interviewer === 'arvi' ? HR_STAGES : TECHNICAL_STAGES

  // Hardware permission state
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [testingMic, setTestingMic] = useState(false)
  const [micLevel, setMicLevel] = useState(0)

  // Layout mode: 'split' (both large side by side) | 'interviewer' | 'candidate'
  const [layoutMode, setLayoutMode] = useState<'split' | 'interviewer' | 'candidate'>('split')

  // Interview stage state
  const [currentStageIdx, setCurrentStageIdx] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [collectedResponses, setCollectedResponses] = useState<CandidateResponseRecord[]>([])
  const [userInput, setUserInput] = useState('')
  const [interviewerSpeaking, setInterviewerSpeaking] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [soundOn, setSoundOn] = useState(true)
  const [paused, setPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [currentCaption, setCurrentCaption] = useState('')
  const [showModelAnswer, setShowModelAnswer] = useState(false)

  // Explicit Turn-Taking State
  const [interviewTurn, setInterviewTurn] = useState<'interviewer_speaking' | 'candidate_listening' | 'evaluating'>('interviewer_speaking')
  const [liveCandidateSpeech, setLiveCandidateSpeech] = useState('')

  // Posture AI State
  const [postureMetrics, setPostureMetrics] = useState<PostureMetrics>({
    eyeContactScore: 94,
    isSlouching: false,
    isLookingAway: false,
    isFidgeting: false,
    postureStatus: 'Upright & Professional',
    attitudeStatus: 'Confident & Engaged',
    lastFeedback: null,
  })

  // Video and Stream Refs
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const timerRef = useRef<any>(null)
  const visionIntervalRef = useRef<any>(null)
  const lastSpokenPostureWarning = useRef<number>(0)
  const previousFrameData = useRef<Uint8ClampedArray | null>(null)

  // Speech Recognition Refs
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<any>(null)
  const accumulatedSpeechRef = useRef<string>('')
  const interviewTurnRef = useRef<'interviewer_speaking' | 'candidate_listening' | 'evaluating'>('interviewer_speaking')
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Synchronize turn ref
  useEffect(() => {
    interviewTurnRef.current = interviewTurn
  }, [interviewTurn])

  // Blinking cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 160)
    }, 3800)
    return () => clearInterval(blinkInterval)
  }, [])

  // Setup Camera and Mic on Mount
  useEffect(() => {
    initCameraAndMic()
    return () => {
      stopCameraAndMic()
      stopRecognitionEngine()
      if (visionIntervalRef.current) clearInterval(visionIntervalRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  // Re-attach video stream to videoRef whenever video element mounts or state changes
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(e => console.warn('Webcam stream play err:', e))
    }
  }, [permissionsGranted, camOn, layoutMode])

  // Countdown timer
  useEffect(() => {
    if (permissionsGranted && !paused) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleEndInterview()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [permissionsGranted, paused])

  // Manage speech recognition when turn changes
  useEffect(() => {
    if (!permissionsGranted || paused || !micOn) {
      stopRecognitionEngine()
      return
    }

    if (interviewTurn === 'candidate_listening') {
      startRecognitionEngine()
    } else {
      stopRecognitionEngine()
    }
  }, [permissionsGranted, paused, micOn, interviewTurn])

  // Callback ref to guarantee stream is always attached to the DOM element
  const setCandidateVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el
    if (el && streamRef.current) {
      el.srcObject = streamRef.current
      el.play().catch(e => console.warn('Video auto-play handled:', e))
    }
  }

  async function initCameraAndMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: true
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(e => console.warn('Video play:', e))
      }

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioCtx.createAnalyser()
      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)
      analyser.fftSize = 64

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      const checkAudio = () => {
        if (!testingMic) return
        analyser.getByteFrequencyData(dataArray)
        const avg = dataArray.reduce((p, c) => p + c, 0) / dataArray.length
        setMicLevel(Math.min(100, Math.round((avg / 128) * 100)))
        requestAnimationFrame(checkAudio)
      }
      setTestingMic(true)
      requestAnimationFrame(checkAudio)
    } catch {
      toast.error('Camera or microphone permission required. Please allow access.')
    }
  }

  function stopCameraAndMic() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  function toggleCam() {
    const next = !camOn
    setCamOn(next)
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = next
      })
    }
    toast(next ? 'Camera enabled' : 'Camera disabled', { icon: next ? '📹' : '🚫' })
  }

  function toggleMic() {
    const next = !micOn
    setMicOn(next)
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = next
      })
    }
    toast(next ? 'Microphone active' : 'Microphone muted', { icon: next ? '🎤' : '🔇' })
  }

  // Vision Posture Analyzer Loop
  function startVisionPostureAnalysis() {
    visionIntervalRef.current = setInterval(() => {
      if (!videoRef.current || !canvasRef.current || !camOn) return

      const video = videoRef.current
      const canvas = canvasRef.current
      if (video.videoWidth === 0 || video.videoHeight === 0) return

      canvas.width = 160
      canvas.height = 120
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(video, 0, 0, 160, 120)
      const frame = ctx.getImageData(0, 0, 160, 120)
      const data = frame.data

      let totalBrightness = 0
      let weightedY = 0
      let weightedX = 0
      let motionDelta = 0

      for (let i = 0; i < data.length; i += 16) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const brightness = (r + g + b) / 3

        const pixelIndex = i / 4
        const x = pixelIndex % 160
        const y = Math.floor(pixelIndex / 160)

        if (y < 85) {
          weightedY += y * brightness
          weightedX += x * brightness
          totalBrightness += brightness
        }

        if (previousFrameData.current) {
          const diff = Math.abs(brightness - previousFrameData.current[i])
          if (diff > 25) motionDelta += diff
        }
      }

      previousFrameData.current = new Uint8ClampedArray(data)

      const centerY = totalBrightness > 0 ? weightedY / totalBrightness : 45
      const centerX = totalBrightness > 0 ? weightedX / totalBrightness : 80

      const isSlouching = centerY > 53
      const isLookingAway = centerX < 55 || centerX > 105
      const isFidgeting = motionDelta > 45000

      let postureStatus: PostureMetrics['postureStatus'] = 'Upright & Professional'
      if (isSlouching) postureStatus = 'Slouching Detected'
      else if (isLookingAway) postureStatus = 'Head Tilted'

      let attitudeStatus: PostureMetrics['attitudeStatus'] = 'Confident & Engaged'
      if (isFidgeting) attitudeStatus = 'Fidgeting / Restless'
      else if (isLookingAway) attitudeStatus = 'Distracted'

      const eyeScore = Math.max(50, Math.min(100, Math.round(96 - (isLookingAway ? 28 : 0) - (isSlouching ? 15 : 0))))

      setPostureMetrics(prev => ({
        ...prev,
        eyeContactScore: eyeScore,
        isSlouching,
        isLookingAway,
        isFidgeting,
        postureStatus,
        attitudeStatus,
      }))

      const now = Date.now()
      if (now - lastSpokenPostureWarning.current > 30000 && interviewTurnRef.current === 'candidate_listening') {
        if (isSlouching) {
          toast('Tip: Sit upright with shoulders back for maximum executive presence.', { icon: '🧘', duration: 4000 })
          lastSpokenPostureWarning.current = now
        } else if (isLookingAway) {
          toast('Tip: Maintain steady eye contact with the camera lens.', { icon: '👁️', duration: 4000 })
          lastSpokenPostureWarning.current = now
        }
      }
    }, 1000)
  }

  // Voice Selection for Anway (Male) & Arvi (Female)
  function applyBestVoice(utterance: SpeechSynthesisUtterance) {
    if (!('speechSynthesis' in window)) return
    const voices = window.speechSynthesis.getVoices()
    if (!voices || voices.length === 0) return

    if (interviewer === 'anway') {
      const maleVoice = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Guy') ||
         v.name.includes('Daniel') || v.name.includes('Alex') || v.name.includes('Male') ||
         v.name.includes('George'))
      ) || voices.find(v => v.lang.startsWith('en'))
      if (maleVoice) utterance.voice = maleVoice
    } else {
      const femaleVoice = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Zira') || v.name.includes('Jenny') || v.name.includes('Samantha') ||
         v.name.includes('Victoria') || v.name.includes('Karen') || v.name.includes('Female') ||
         v.name.includes('Ava') || v.name.includes('Google US English'))
      ) || voices.find(v => v.lang.startsWith('en'))
      if (femaleVoice) utterance.voice = femaleVoice
    }
  }

  // Interviewer Speech Generator
  function speakInterviewerText(text: string, onCompleted?: () => void) {
    if (!soundOn || !('speechSynthesis' in window)) {
      setInterviewerSpeaking(false)
      setCurrentCaption('')
      setInterviewTurn('candidate_listening')
      if (onCompleted) onCompleted()
      return
    }

    window.speechSynthesis.cancel()
    setInterviewTurn('interviewer_speaking')
    setInterviewerSpeaking(true)
    setCurrentCaption(text)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = interviewer === 'arvi' ? 1.15 : 0.93
    applyBestVoice(utterance)
    currentUtteranceRef.current = utterance

    utterance.onend = () => {
      setInterviewerSpeaking(false)
      setCurrentCaption('')
      currentUtteranceRef.current = null
      setInterviewTurn('candidate_listening')
      setLiveCandidateSpeech('')
      accumulatedSpeechRef.current = ''
      toast.success('Your turn! Anway is listening to you now — speak freely.', { duration: 3000 })
      if (onCompleted) onCompleted()
    }

    utterance.onerror = () => {
      setInterviewerSpeaking(false)
      setCurrentCaption('')
      currentUtteranceRef.current = null
      setInterviewTurn('candidate_listening')
      if (onCompleted) onCompleted()
    }

    window.speechSynthesis.speak(utterance)
  }

  // Candidate Interruption Action (Barge-In)
  function handleCandidateInterrupt() {
    if (interviewTurn === 'interviewer_speaking' || window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setInterviewerSpeaking(false)
      setCurrentCaption('')
      currentUtteranceRef.current = null
      setInterviewTurn('candidate_listening')
      setLiveCandidateSpeech('')
      accumulatedSpeechRef.current = ''
      toast('Interrupted: Anway is listening to your question or answer!', { icon: '✋', duration: 2500 })
    }
  }

  // Real-Time Speech Recognition Engine
  function startRecognitionEngine() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return
    }

    stopRecognitionEngine()

    try {
      const SpeechRec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRec()
      recognitionRef.current = recognition
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (e: any) => {
        if (interviewTurnRef.current !== 'candidate_listening') return

        let interim = ''
        let finalSegment = ''

        for (let i = e.resultIndex; i < e.results.length; i++) {
          const item = e.results[i]
          const txt = item[0].transcript
          if (item.isFinal) {
            finalSegment += txt + ' '
          } else {
            interim += txt
          }
        }

        const combinedLive = (accumulatedSpeechRef.current + ' ' + finalSegment + ' ' + interim).trim()
        if (combinedLive.length > 0) {
          setLiveCandidateSpeech(combinedLive)
        }

        if (finalSegment) {
          accumulatedSpeechRef.current = (accumulatedSpeechRef.current + ' ' + finalSegment).trim()
        }

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }

        silenceTimerRef.current = setTimeout(() => {
          const completeSpokenAnswer = (accumulatedSpeechRef.current + ' ' + interim).trim()
          if (completeSpokenAnswer.length >= 3 && interviewTurnRef.current === 'candidate_listening') {
            submitCandidateResponse(completeSpokenAnswer, 'spoken')
          }
        }, 1700)
      }

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition status:', event.error)
        }
      }

      recognition.onend = () => {
        if (permissionsGranted && micOn && !paused && interviewTurnRef.current === 'candidate_listening') {
          setTimeout(() => {
            try {
              recognition.start()
            } catch {
              // active
            }
          }, 250)
        }
      }

      recognition.start()
    } catch (err) {
      console.warn('Recognition setup exception:', err)
    }
  }

  function stopRecognitionEngine() {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        // ignore
      }
      recognitionRef.current = null
    }
  }

  function handleEnterRoom() {
    setPermissionsGranted(true)
    startVisionPostureAnalysis()

    const firstQuestion = stages[0].question(candidateName)
    setMessages([{ role: 'interviewer', content: firstQuestion, timestamp: new Date() }])

    setTimeout(() => {
      speakInterviewerText(firstQuestion)
    }, 600)
  }

  // Unified Response Processor
  async function submitCandidateResponse(rawContent: string, inputMethod: 'spoken' | 'typed') {
    const candidateMessage = rawContent.trim()
    if (!candidateMessage || interviewTurnRef.current === 'evaluating' || paused) return

    stopRecognitionEngine()
    setInterviewTurn('evaluating')
    setLiveCandidateSpeech('')
    accumulatedSpeechRef.current = ''
    if (inputMethod === 'typed') setUserInput('')

    const activeStage = stages[currentStageIdx]
    const currentQuestionText = activeStage.question(candidateName)
    const nextStageIdx = Math.min(currentStageIdx + 1, stages.length - 1)
    const nextPlannedQuestion = stages[nextStageIdx].question(candidateName)

    try {
      let spokenReply: string
      let conversationType: 'answer' | 'casual' | 'clarification' | 'nervous' | 'admit_unknown' | 'gratitude' = 'answer'
      let advancesStage = true
      let errorAnalysis: {
        score: number
        strengths: string
        errorsDetected: string | null
        correctedAnswer: string
      }

      if (isGeminiConfigured()) {
        const evaluationPrompt = `You are ${interviewer === 'anway' ? 'Anway, Senior Staff Engineer at Google' : 'Arvi, Director of Talent'}.
The candidate is ${candidateName}.
This is a REAL-TIME live technical interview.

CURRENT INTERVIEW QUESTION:
"${currentQuestionText}"

CORE CONCEPTS EXPECTED:
${activeStage.keyPoints.join('; ')}

CANDIDATE'S ACTUAL RESPONSE (via ${inputMethod}):
"${candidateMessage}"

RECENT CONVERSATION CONTEXT:
${messages.slice(-4).map(m => `${m.role === 'interviewer' ? (interviewer === 'anway' ? 'Anway' : 'Arvi') : candidateName}: "${m.content}"`).join('\n')}

INSTRUCTIONS:
1. GREETING / CASUAL BANTER: Respond with warmth and natural charm, then invite them into the question. advancesStage: false.
2. NERVOUSNESS: Reassure with genuine empathy. advancesStage: false.
3. CLARIFICATION REQUEST: Re-explain the problem clearly with an intuitive analogy. advancesStage: false.
4. ADMISSION OF NOT KNOWING: Guide them constructively with a hint. advancesStage: false.
5. GRATITUDE: Acknowledge politely. advancesStage: false.
6. TECHNICAL / BEHAVIORAL ANSWER OR CODE:
   - Identify what they got RIGHT (strengths).
   - Identify explicitly WHERE THEY WERE WRONG (errors detected: Big-O mistakes, concurrency race conditions, missing edge cases, or weak STAR answers).
   - Give the ideal corrected formulation.
   - Formulate spoken feedback where you acknowledge their answer, point out the error clearly, give proper logic, and transition to: "${nextPlannedQuestion}".
   - advancesStage: true.

RETURN STRICT JSON ONLY:
{
  "conversationType": "answer" | "casual" | "clarification" | "nervous" | "admit_unknown" | "gratitude",
  "advancesStage": true,
  "spokenFeedback": "Your exact spoken response to the candidate...",
  "score": 82,
  "strengths": "1 sentence on what they answered accurately",
  "errorsDetected": "Explicitly state where they were wrong, or 'No critical errors detected. Minor optimization possible.'",
  "correctedAnswer": "1-2 sentence ideal reference solution"
}`

        const raw = await askGemini(evaluationPrompt)
        const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim()

        try {
          const parsed = JSON.parse(cleaned)
          conversationType = parsed.conversationType || 'answer'
          advancesStage = Boolean(parsed.advancesStage)
          spokenReply = parsed.spokenFeedback || `Thank you for sharing that, ${candidateName}. Let's examine our next problem: ${nextPlannedQuestion}`
          errorAnalysis = {
            score: typeof parsed.score === 'number' ? parsed.score : 80,
            strengths: parsed.strengths || 'Demonstrated understanding of core concepts.',
            errorsDetected: parsed.errorsDetected || null,
            correctedAnswer: parsed.correctedAnswer || activeStage.modelAnswer
          }
        } catch {
          spokenReply = `Thank you, ${candidateName}. In reviewing your answer, be mindful of boundary conditions and runtime complexity. Let's proceed: ${nextPlannedQuestion}`
          errorAnalysis = {
            score: 75,
            strengths: 'Good conceptual approach.',
            errorsDetected: 'Ensure you clearly define time complexity and boundary conditions.',
            correctedAnswer: activeStage.modelAnswer
          }
        }
      } else {
        const lower = candidateMessage.toLowerCase()
        if (lower.includes('good morning') || lower.includes('hello') || lower.includes('hi')) {
          conversationType = 'casual'
          advancesStage = false
          spokenReply = `Good morning, ${candidateName}! It's wonderful to have you here today. Take a comfortable breath. Are you ready to begin with our question?`
          errorAnalysis = { score: 90, strengths: 'Polite and professional greeting.', errorsDetected: null, correctedAnswer: activeStage.modelAnswer }
        } else if (lower.includes('nervous') || lower.includes('scared') || lower.includes('worried')) {
          conversationType = 'nervous'
          advancesStage = false
          spokenReply = `That's completely okay, ${candidateName}. Take your time. This is a supportive practice environment, and we are here to help you build confidence. Whenever you're ready, tell me your thoughts.`
          errorAnalysis = { score: 85, strengths: 'Honest self-awareness.', errorsDetected: null, correctedAnswer: activeStage.modelAnswer }
        } else if (lower.includes('explain again') || lower.includes('repeat') || lower.includes('simpler')) {
          conversationType = 'clarification'
          advancesStage = false
          spokenReply = `Of course! In simple terms: ${activeStage.keyPoints[0]}. How would you start thinking about this?`
          errorAnalysis = { score: 85, strengths: 'Asked for clarification proactively.', errorsDetected: null, correctedAnswer: activeStage.modelAnswer }
        } else if (lower.includes("don't know") || lower.includes('dont know') || lower.includes('not sure')) {
          conversationType = 'admit_unknown'
          advancesStage = false
          spokenReply = `No problem at all! Let's approach it step by step. A good first clue: consider how ${activeStage.keyPoints[0]} could be applied. What do you think?`
          errorAnalysis = { score: 70, strengths: 'Recognized knowledge boundary honestly.', errorsDetected: 'Requires conceptual guidance on this topic.', correctedAnswer: activeStage.modelAnswer }
        } else if (lower.includes('thank you') || lower.includes('thanks')) {
          conversationType = 'gratitude'
          advancesStage = false
          spokenReply = `You're very welcome! Let's continue.`
          errorAnalysis = { score: 90, strengths: 'Courteous communication.', errorsDetected: null, correctedAnswer: activeStage.modelAnswer }
        } else {
          advancesStage = true
          conversationType = 'answer'
          const detectedError = candidateMessage.length < 25
            ? 'Response was too brief and lacked architectural depth or Big-O analysis.'
            : candidateMessage.toLowerCase().includes('o(1)') && activeStage.badge === 'DSA & Algorithms'
            ? 'Heap insertion requires O(log N) rather than O(1).'
            : 'Make sure to explicitly detail edge case handling such as duplicate values or concurrency.'

          spokenReply = `Thank you, ${candidateName}. You covered important ground, but remember that ${detectedError} Now, let's look at our next question: ${nextPlannedQuestion}`
          errorAnalysis = {
            score: candidateMessage.length > 40 ? 82 : 68,
            strengths: 'Clear communication and relevant technical terminology.',
            errorsDetected: detectedError,
            correctedAnswer: activeStage.modelAnswer
          }
        }
      }

      if (advancesStage) {
        const responseRecord: CandidateResponseRecord = {
          stageName: activeStage.stageName,
          question: currentQuestionText,
          candidateAnswer: candidateMessage,
          score: errorAnalysis.score,
          strengths: errorAnalysis.strengths,
          errorsDetected: errorAnalysis.errorsDetected,
          correctedAnswer: errorAnalysis.correctedAnswer,
          timestamp: new Date().toLocaleTimeString()
        }
        setCollectedResponses(prev => [...prev, responseRecord])
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'user',
          content: candidateMessage,
          timestamp: new Date(),
          conversationType,
          analysis: advancesStage ? errorAnalysis : undefined
        },
        {
          role: 'interviewer',
          content: spokenReply,
          timestamp: new Date()
        }
      ])

      if (advancesStage) {
        setCurrentStageIdx(nextStageIdx)
      }

      speakInterviewerText(spokenReply, () => {
        if (advancesStage && nextStageIdx >= stages.length - 1 && currentStageIdx === stages.length - 2) {
          setTimeout(() => {
            const wrapup = `Thank you so much, ${candidateName}. That concludes all scheduled rounds for today's interview. I have recorded all your answers and compiled a detailed error diagnostic report for you!`
            setMessages(prev => [...prev, { role: 'interviewer', content: wrapup, timestamp: new Date() }])
            speakInterviewerText(wrapup)
          }, 1500)
        }
      })
    } catch (err) {
      console.error(err)
      toast.error('AI response encountered an issue. Please try again.')
      setInterviewTurn('candidate_listening')
    }
  }

  function handleEndInterview() {
    stopCameraAndMic()
    stopRecognitionEngine()
    if (visionIntervalRef.current) clearInterval(visionIntervalRef.current)
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()

    const reportId = Date.now().toString()
    const reportData = {
      type,
      interviewer,
      difficulty,
      duration,
      candidateName,
      messages: messages.length,
      score: collectedResponses.length > 0
        ? Math.round(collectedResponses.reduce((acc, r) => acc + r.score, 0) / collectedResponses.length)
        : 82,
      eyeContactScore: postureMetrics.eyeContactScore,
      postureStatus: postureMetrics.postureStatus,
      attitudeStatus: postureMetrics.attitudeStatus,
      collectedResponses,
      timestamp: new Date().toISOString(),
    }
    sessionStorage.setItem(`report_${reportId}`, JSON.stringify(reportData))
    navigate(`/interview/report/${reportId}`)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const currentStage = stages[currentStageIdx]

  // Permission Gate Screen
  if (!permissionsGranted) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-xl w-full p-8 space-y-6"
        >
          <div className="text-center space-y-2">
            <span className="badge badge-blue text-xs uppercase tracking-wider">
              Realistic Interview Room Entry
            </span>
            <h1 className="text-2xl font-black text-white">
              Equipment & Real-Time Webcam Setup
            </h1>
            <p className="text-xs text-gray-300">
              Welcome, <strong>{candidateName}</strong>! {interviewer === 'anway' ? 'Anway (Senior Staff Engineer)' : 'Arvi (Director of Talent)'} is ready to interview you with real-time video and voice.
            </p>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center shadow-2xl">
            <video
              ref={setCandidateVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform -scale-x-100"
            />
            <canvas ref={canvasRef} className="hidden" />

            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Webcam Preview
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 px-3 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10">
              <Mic className="w-4 h-4 text-blue-400" />
              <div className="flex-1 bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-blue-500 h-full transition-all duration-75"
                  style={{ width: `${Math.max(15, micLevel)}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-gray-300">
                {micLevel > 10 ? 'Microphone Active' : 'Speak to test mic'}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-gray-300 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Prominent Candidate Video:</strong> Your live webcam face is displayed side-by-side with Anway just like a real interview call.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Natural Real-Time Dialogue:</strong> Anway asks questions and speaks clearly. Once he finishes, he listens to you in real time.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Instant Interruption (Barge-In):</strong> Click "Interrupt Anway" at any time if you want to speak immediately.</span>
            </div>
          </div>

          <button
            onClick={handleEnterRoom}
            className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
          >
            <ShieldCheck className="w-4 h-4" />
            Enter Official Interview Room
          </button>
        </motion.div>
      </div>
    )
  }

  // Live Interview Room
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#050a1a]">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-2 bg-[#0a0f2c]/95 border-b border-blue-500/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-white font-bold text-sm uppercase tracking-wider">Live Interview Call</span>
          </div>
          <span className="badge badge-blue text-xs uppercase">{type}</span>
          <span className="badge badge-purple text-xs capitalize">{currentStage.badge}</span>
        </div>

        {/* Current Round Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
          <span className="text-blue-400 font-bold">{currentStage.stageName}</span>
          <span className="text-gray-500">({currentStageIdx + 1} of {stages.length})</span>
        </div>

        {/* Live Status HUD */}
        <div className="flex items-center gap-3">
          {/* Turn-Taking State Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
            interviewTurn === 'candidate_listening'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse'
              : interviewTurn === 'evaluating'
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-blue-500/20 border-blue-500/30 text-blue-300'
          }`}>
            {interviewTurn === 'candidate_listening' ? (
              <>
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>🎤 Anway is listening to you...</span>
              </>
            ) : interviewTurn === 'evaluating' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Anway is diagnosing errors...</span>
              </>
            ) : (
              <>
                <Volume1 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>Anway is speaking...</span>
              </>
            )}
          </div>

          {/* Layout Toggle */}
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => setLayoutMode('split')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                layoutMode === 'split' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Split View (Interviewer & Candidate Side-by-Side)"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Dual View</span>
            </button>
            <button
              onClick={() => setLayoutMode('interviewer')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                layoutMode === 'interviewer' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Interviewer Focus with Floating PiP"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Interviewer</span>
            </button>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-sm text-white">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Main Video Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Video Call Grid */}
        <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
          {/* Main Stage: Dual View (Interviewer + Candidate Live Face) */}
          <div className="flex-1 relative rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Tile 1: AI Interviewer */}
            <div className={`relative rounded-2xl overflow-hidden border border-blue-500/20 shadow-2xl flex flex-col ${
              layoutMode === 'candidate' ? 'hidden' : 'flex-1'
            }`}>
              {interviewer === 'anway' ? (
                <RealisticAnway speaking={interviewerSpeaking} isBlinking={isBlinking} />
              ) : (
                <RealisticArvi speaking={interviewerSpeaking} isBlinking={isBlinking} />
              )}

              {/* Turn Action Banner directly over Avatar */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20">
                {interviewTurn === 'interviewer_speaking' && (
                  <button
                    onClick={handleCandidateInterrupt}
                    className="px-3 py-1 rounded-full bg-red-600/80 hover:bg-red-600 backdrop-blur-md border border-red-400/50 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg transition-all"
                    title="Interrupt and speak immediately"
                  >
                    <Hand className="w-3 h-3" />
                    <span>✋ Interrupt</span>
                  </button>
                )}

                {interviewTurn === 'candidate_listening' && (
                  <div className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md border border-emerald-400/60 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Listening to you</span>
                  </div>
                )}
              </div>

              {/* Live Subtitles / Captions for Interviewer Speech */}
              {currentCaption && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none z-20">
                  <div className="max-w-2xl px-4 py-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-white text-xs text-center shadow-2xl leading-relaxed">
                    <span className="text-blue-400 font-bold mr-1.5">
                      {interviewer === 'anway' ? 'Anway:' : 'Arvi:'}
                    </span>
                    {currentCaption}
                  </div>
                </div>
              )}
            </div>

            {/* Tile 2: YOU - Candidate Live Webcam (Prominent & Clear!) */}
            <div className={`relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-black/80 shadow-2xl flex flex-col items-center justify-center ${
              layoutMode === 'interviewer' ? 'hidden' : 'flex-1'
            }`}>
              {camOn ? (
                <video
                  ref={setCandidateVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-3xl font-bold">
                    {candidateName ? candidateName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">{candidateName}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Camera is currently muted</p>
                  </div>
                  <button
                    onClick={toggleCam}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Turn Camera On</span>
                  </button>
                </div>
              )}

              {/* Hidden Canvas for Vision Posture Processing */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Top Overlays on Candidate Video */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none z-20">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white font-semibold">
                  <span className={`w-2 h-2 rounded-full ${interviewTurn === 'candidate_listening' ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span>You ({candidateName})</span>
                  {interviewTurn === 'candidate_listening' && (
                    <span className="badge badge-emerald text-[9px] uppercase px-1.5 py-0">Speaking</span>
                  )}
                </div>

                <div className={`px-3 py-1 rounded-full backdrop-blur-md font-bold text-[11px] border ${
                  postureMetrics.isSlouching || postureMetrics.isLookingAway
                    ? 'bg-amber-500/90 text-black border-amber-400 animate-pulse'
                    : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                }`}>
                  {postureMetrics.postureStatus}
                </div>
              </div>

              {/* Live Interim Spoken Words Banner (Candidate Words In Real-Time) */}
              {interviewTurn === 'candidate_listening' && liveCandidateSpeech && (
                <div className="absolute bottom-16 left-4 right-4 flex justify-center z-20 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl px-4 py-2 rounded-xl bg-emerald-950/90 backdrop-blur-md border border-emerald-400/60 text-white text-xs text-center shadow-xl"
                  >
                    <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Speaking Live:</span>
                    </div>
                    <p className="font-medium italic text-white text-xs">"{liveCandidateSpeech}"</p>
                  </motion.div>
                </div>
              )}

              {/* Bottom Overlays on Candidate Video */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
                {/* Eye Contact Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[11px] text-gray-200">
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  <span>Eye Contact:</span>
                  <span className="font-mono text-emerald-400 font-bold">{postureMetrics.eyeContactScore}%</span>
                </div>

                {/* Live Audio Meter */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[11px]">
                  <Mic className={`w-3.5 h-3.5 ${micLevel > 15 ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <div className="w-16 bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-75"
                      style={{ width: `${Math.min(100, micLevel * 1.5)}%` }}
                    />
                  </div>
                  <span className="font-mono text-emerald-400 font-bold text-[10px]">{micLevel}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Action Controls & Status */}
          <div className="rounded-2xl bg-[#0a0f2c]/90 border border-white/10 flex items-center justify-between gap-3 px-6 py-2.5">
            {/* Left Action: Done Speaking or Interrupt */}
            <div className="flex items-center gap-2">
              {interviewTurn === 'candidate_listening' && (
                <button
                  onClick={() => {
                    const finalAnswer = liveCandidateSpeech.trim() || accumulatedSpeechRef.current.trim()
                    if (finalAnswer) {
                      submitCandidateResponse(finalAnswer, 'spoken')
                    } else {
                      toast('Speak into your microphone first, or type below.', { icon: '🎤' })
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all animate-pulse"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Done Speaking (Submit Answer)</span>
                </button>
              )}

              {interviewTurn === 'interviewer_speaking' && (
                <button
                  onClick={handleCandidateInterrupt}
                  className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <Hand className="w-4 h-4" />
                  <span>Interrupt {interviewer === 'anway' ? 'Anway' : 'Arvi'}</span>
                </button>
              )}
            </div>

            {/* Center Controls: Mic, Cam, Sound, Model Answer, Pause */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMic}
                className={`p-2.5 rounded-xl flex items-center gap-1.5 transition-all text-xs font-semibold ${
                  micOn ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
                title="Microphone toggle"
              >
                {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{micOn ? 'Mic On' : 'Muted'}</span>
              </button>

              <button
                onClick={toggleCam}
                className={`p-2.5 rounded-xl flex items-center gap-1.5 transition-all text-xs font-semibold ${
                  camOn ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
                title="Camera toggle"
              >
                {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{camOn ? 'Cam Live' : 'Cam Off'}</span>
              </button>

              <button
                onClick={() => setSoundOn(!soundOn)}
                className={`p-2.5 rounded-xl flex items-center gap-1.5 transition-all text-xs font-semibold ${
                  soundOn ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-white/10 text-gray-400 border border-white/10'
                }`}
                title="AI voice toggle"
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">{soundOn ? 'AI Sound' : 'AI Muted'}</span>
              </button>

              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className={`p-2.5 rounded-xl flex items-center gap-1.5 transition-all text-xs font-semibold ${
                  showModelAnswer ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' : 'bg-white/5 text-gray-300 border border-white/10'
                }`}
                title="View model solution"
              >
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">Model Answer</span>
              </button>

              <button
                onClick={() => setPaused(!paused)}
                className="p-2.5 rounded-xl flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                title="Pause interview"
              >
                {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span className="hidden sm:inline">{paused ? 'Resume' : 'Pause'}</span>
              </button>
            </div>

            {/* Right Action: End Call */}
            <div>
              <button
                onClick={handleEndInterview}
                className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Conclude and view score report"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Chat & Error Analysis Panel */}
        <div className="w-80 lg:w-[440px] border-l border-blue-500/20 bg-[#0a0f2c]/95 flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-white font-bold text-xs uppercase">Transcript & Live Error Audit</span>
            </div>
            <button
              onClick={() => setShowModelAnswer(!showModelAnswer)}
              className="badge badge-purple text-[10px] flex items-center gap-1 cursor-pointer hover:bg-purple-600/30"
            >
              <Sparkles className="w-3 h-3" />
              {showModelAnswer ? 'Hide Guide' : 'Show Ideal Answer'}
            </button>
          </div>

          {/* Model Answer Drawer */}
          <AnimatePresence>
            {showModelAnswer && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-white/10 bg-purple-950/20 p-4 space-y-3 overflow-hidden text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-400" /> What Top Interviewers Look For:
                  </span>
                  <button onClick={() => setShowModelAnswer(false)} className="text-gray-400 hover:text-white">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>

                <ul className="space-y-1.5 text-gray-300 text-[11px]">
                  {currentStage.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-500/30">
                  <span className="font-semibold text-purple-200 block mb-1 text-[11px]">Best-in-Class Model Answer:</span>
                  <p className="text-gray-300 italic text-[11px] leading-relaxed">{currentStage.modelAnswer}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transcript Messages with Live Error Diagnostic Cards */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`${msg.role === 'user' ? 'ml-4' : 'mr-4'} space-y-2`}>
                <div className={`text-[11px] font-bold flex items-center gap-1.5 ${
                  msg.role === 'user' ? 'justify-end text-blue-400' : 'text-purple-400'
                }`}>
                  {msg.role === 'user' ? (
                    <>
                      <span>{candidateName} (Your Response)</span>
                      {msg.conversationType && msg.conversationType !== 'answer' && (
                        <span className="badge badge-blue text-[9px] uppercase px-1.5 py-0.2">
                          {msg.conversationType}
                        </span>
                      )}
                    </>
                  ) : (
                    <span>{interviewer === 'anway' ? 'Anway (Interviewer)' : 'Arvi (Interviewer)'}</span>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`p-3.5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap font-sans ${
                  msg.role === 'user'
                    ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-200'
                }`}>
                  {msg.content}
                </div>

                {/* Real-Time Error Diagnostic Breakdown for Candidate's Answer */}
                {msg.role === 'user' && msg.analysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-2 text-[11px]"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                      <span className="font-bold text-gray-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        AI Response Assessment
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        msg.analysis.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        Score: {msg.analysis.score}/100
                      </span>
                    </div>

                    {/* What was accurate */}
                    <div className="flex items-start gap-1.5 text-emerald-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-400 font-semibold">Strengths: </strong>
                        {msg.analysis.strengths}
                      </div>
                    </div>

                    {/* Where the candidate was wrong (Errors Detected) */}
                    {msg.analysis.errorsDetected && (
                      <div className="flex items-start gap-1.5 text-rose-300 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-rose-400 font-bold">Errors / Flaws Identified: </strong>
                          {msg.analysis.errorsDetected}
                        </div>
                      </div>
                    )}

                    {/* Corrected Formulation */}
                    <div className="text-gray-300 bg-white/5 p-2 rounded-lg border border-white/5">
                      <strong className="text-blue-300 font-semibold block mb-0.5">Recommended Formulation:</strong>
                      <span className="italic">{msg.analysis.correctedAnswer}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}

            {interviewTurn === 'evaluating' && (
              <div className="mr-6 p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-blue-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{interviewer === 'anway' ? 'Anway' : 'Arvi'} is evaluating your code/answer for errors...</span>
              </div>
            )}
          </div>

          {/* Response Input (Type code or text + Instant Send) */}
          <div className="p-3 border-t border-white/10 space-y-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (interviewTurn === 'candidate_listening') {
                    const speech = liveCandidateSpeech.trim() || accumulatedSpeechRef.current.trim()
                    if (speech) submitCandidateResponse(speech, 'spoken')
                    else toast('Speak into your microphone, or type your answer.', { icon: '🎤' })
                  } else {
                    handleCandidateInterrupt()
                  }
                }}
                className={`p-2.5 rounded-xl border shrink-0 transition-all ${
                  interviewTurn === 'candidate_listening'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                    : 'bg-white/5 text-gray-400 border-white/10'
                }`}
                title={interviewTurn === 'candidate_listening' ? 'Mic listening' : 'Start speaking'}
              >
                <Mic className="w-4 h-4" />
              </button>
              <textarea
                rows={2}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (userInput.trim()) {
                      submitCandidateResponse(userInput.trim(), 'typed')
                    }
                  }
                }}
                placeholder="Speak hands-free, or type code/answers here... AI checks errors in real time (Enter to send)"
                className="input-field text-xs py-2 flex-1 resize-none"
                disabled={interviewTurn === 'evaluating' || paused}
              />
              <button
                onClick={() => {
                  if (userInput.trim()) {
                    submitCandidateResponse(userInput.trim(), 'typed')
                  }
                }}
                disabled={!userInput.trim() || interviewTurn === 'evaluating' || paused}
                className="btn-primary p-2.5 text-xs rounded-xl disabled:opacity-40 shrink-0 self-end mb-1"
                title="Send for Real-Time Evaluation"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <Radio className={`w-3 h-3 ${interviewTurn === 'candidate_listening' ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>
                  {interviewTurn === 'candidate_listening'
                    ? 'Listening live — speak your answer!'
                    : interviewTurn === 'interviewer_speaking'
                    ? 'Anway is speaking — listen or click Interrupt'
                    : 'Evaluating your answer...'}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <span>Press</span>
                <kbd className="px-1 py-0.5 rounded bg-white/10 text-[9px] text-gray-300 font-mono flex items-center gap-0.5">
                  <CornerDownLeft className="w-2.5 h-2.5" /> Enter
                </kbd>
                <span>to type</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
