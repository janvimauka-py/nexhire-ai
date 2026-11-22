import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Video, VideoOff, Volume2, VolumeX,
  PhoneOff, Pause, Play, MessageSquare, Clock,
  Loader2, Send, Eye, ShieldCheck, Activity,
  CheckCircle2, Sparkles, Hand, LayoutGrid, Maximize2,
  Radio, Volume1, AlertCircle, CornerDownLeft
} from 'lucide-react'
import { askGeminiChat, isGeminiConfigured } from '../../lib/gemini'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export type ConversationState =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'THINKING'
  | 'SPEAKING'
  | 'INTERRUPTED'
  | 'ERROR'

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
  role: 'user' | 'model'
  content: string
  timestamp: Date
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
          <p className="text-blue-300 text-xs mt-0.5">Google Technical Lead • Real-Time AI Conversational Coach</p>

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
          <p className="text-purple-300 text-xs mt-0.5">Behavioral Psychologist & STAR Coach • Real-Time AI</p>

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

  // Hardware permission state
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [testingMic, setTestingMic] = useState(false)
  const [micLevel, setMicLevel] = useState(0)
  const [hasVideoStream, setHasVideoStream] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Layout mode
  const [layoutMode, setLayoutMode] = useState<'split' | 'interviewer' | 'candidate'>('split')

  // Real-Time Conversational AI State Machine
  // IDLE | LISTENING | PROCESSING | THINKING | SPEAKING | INTERRUPTED | ERROR
  const [conversationState, setConversationState] = useState<ConversationState>('IDLE')
  const [messages, setMessages] = useState<Message[]>([])
  const [liveCandidateSpeech, setLiveCandidateSpeech] = useState('')
  const [userInput, setUserInput] = useState('')
  const [currentCaption, setCurrentCaption] = useState('')
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [soundOn, setSoundOn] = useState(true)
  const [paused, setPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isBlinking, setIsBlinking] = useState(false)

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
  const previousFrameData = useRef<Uint8ClampedArray | null>(null)

  // Conversational AI Engine Refs
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<any>(null)
  const accumulatedSpeechRef = useRef<string>('')
  const conversationStateRef = useRef<ConversationState>('IDLE')
  const chatHistoryRef = useRef<{ role: 'user' | 'model'; content: string }[]>([])
  const isGeneratingRef = useRef<boolean>(false)

  // Sync state ref
  useEffect(() => {
    conversationStateRef.current = conversationState
  }, [conversationState])

  // Blinking cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 160)
    }, 3800)
    return () => clearInterval(blinkInterval)
  }, [])

  // Camera & Mic setup
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

  // Continuous speech recognition manager
  useEffect(() => {
    if (!permissionsGranted || paused || !micOn) {
      stopRecognitionEngine()
      return
    }

    // Keep recognition active for listening & barge-in detection
    startRecognitionEngine()
  }, [permissionsGranted, paused, micOn])

  // Callback ref to guarantee stream is always attached to the DOM element
  const setCandidateVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el
    if (el) {
      el.muted = true
      el.defaultMuted = true
      el.playsInline = true
      el.setAttribute('playsinline', 'true')
      el.setAttribute('muted', 'true')
      el.setAttribute('autoplay', 'true')
      if (streamRef.current) {
        if (el.srcObject !== streamRef.current) {
          el.srcObject = streamRef.current
        }
        el.play().then(() => setHasVideoStream(true)).catch(e => console.warn('Video auto-play handled:', e))
      }
    }
  }

  async function initCameraAndMic() {
    setCameraError(null)
    try {
      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            facingMode: 'user'
          },
          audio: true
        })
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: true
          })
        } catch {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          } catch {
            stream = await navigator.mediaDevices.getUserMedia({ video: true })
          }
        }
      }

      streamRef.current = stream
      setHasVideoStream(true)

      if (videoRef.current) {
        videoRef.current.muted = true
        videoRef.current.defaultMuted = true
        videoRef.current.playsInline = true
        videoRef.current.setAttribute('playsinline', 'true')
        videoRef.current.setAttribute('muted', 'true')
        videoRef.current.srcObject = stream
        videoRef.current.play().then(() => setHasVideoStream(true)).catch(e => console.warn('Video play:', e))
      }

      // Safe AudioContext setup
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
        if (AudioCtxClass && stream.getAudioTracks().length > 0) {
          const audioCtx = new AudioCtxClass()
          if (audioCtx.state === 'suspended') {
            const resumeAudio = () => {
              audioCtx.resume()
              window.removeEventListener('click', resumeAudio)
            }
            window.addEventListener('click', resumeAudio, { once: true })
          }
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
        }
      } catch (audioErr) {
        console.warn('AudioContext note:', audioErr)
      }
    } catch (err: any) {
      console.error('Camera init error:', err)
      setCameraError(err?.message || 'Camera access denied or unavailable')
      toast.error('Camera access needed. Please grant permissions in your browser URL bar.')
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
    }, 1000)
  }

  // Voice Selection
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

  // Clean Markdown & Emojis from Spoken Text
  function cleanSpokenText(text: string): string {
    return text
      .replace(/[*#_~`>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .trim()
  }

  // AI Speech Delivery (TTS)
  function speakResponse(text: string) {
    const cleaned = cleanSpokenText(text)
    if (!cleaned) {
      setConversationState('LISTENING')
      return
    }

    if (!soundOn || !('speechSynthesis' in window)) {
      setConversationState('LISTENING')
      return
    }

    window.speechSynthesis.cancel()
    setConversationState('SPEAKING')
    setCurrentCaption(cleaned)

    const utterance = new SpeechSynthesisUtterance(cleaned)
    utterance.rate = 0.96
    utterance.pitch = interviewer === 'arvi' ? 1.15 : 0.93
    applyBestVoice(utterance)

    utterance.onend = () => {
      if (conversationStateRef.current === 'SPEAKING') {
        setCurrentCaption('')
        setConversationState('LISTENING')
        setLiveCandidateSpeech('')
        accumulatedSpeechRef.current = ''
      }
    }

    utterance.onerror = (e) => {
      console.warn('TTS utterance event:', e)
      setCurrentCaption('')
      setConversationState('LISTENING')
    }

    window.speechSynthesis.speak(utterance)
  }

  // Instant Interruption (Barge-In)
  function handleInterruption() {
    if (conversationStateRef.current === 'SPEAKING' || window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setConversationState('INTERRUPTED')
      setCurrentCaption('')
      setTimeout(() => {
        setConversationState('LISTENING')
      }, 150)
      toast('Anway paused to listen to you', { icon: '👂', duration: 1500 })
    }
  }

  // Real-Time Continuous Speech Recognition & Voice Activity Detection
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

        const activeWords = (accumulatedSpeechRef.current + ' ' + finalSegment + ' ' + interim).trim()

        if (activeWords.length > 0) {
          // If AI was speaking, student just spoke: Trigger Barge-in immediately!
          if (conversationStateRef.current === 'SPEAKING' || window.speechSynthesis.speaking) {
            handleInterruption()
          }

          if (conversationStateRef.current !== 'THINKING' && conversationStateRef.current !== 'PROCESSING') {
            setConversationState('LISTENING')
          }

          setLiveCandidateSpeech(activeWords)

          if (finalSegment) {
            accumulatedSpeechRef.current = (accumulatedSpeechRef.current + ' ' + finalSegment).trim()
          }

          // Voice Activity Detection: Reset silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current)
          }

          // When student pauses for 1.35 seconds after speaking, process the response!
          silenceTimerRef.current = setTimeout(() => {
            const completeUtterance = (accumulatedSpeechRef.current + ' ' + interim).trim()
            if (completeUtterance.length >= 2 && !isGeneratingRef.current) {
              processStudentSpeech(completeUtterance)
            }
          }, 1350)
        }
      }

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition warning:', event.error)
        }
      }

      recognition.onend = () => {
        // Auto-restart continuous listening if session is still active
        if (permissionsGranted && micOn && !paused) {
          setTimeout(() => {
            try {
              recognition.start()
            } catch {
              // already active
            }
          }, 200)
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

  // System Prompt for True Conversational AI Agent
  function getSystemPrompt() {
    if (interviewer === 'anway') {
      return `You are Anway, an intelligent, friendly, and perceptive Senior Staff Software Engineer at Google conducting a 1-on-1 career and interview preparation session with a student named ${candidateName}.

CORE CONVERSATIONAL INSTRUCTIONS:
1. Speak in natural, human conversational English. Do NOT use markdown symbols (no asterisks *, no bullet points, no headers #, no code fences) because your words are spoken directly via text-to-speech. Keep responses conversational and concise (2-4 sentences max per turn).
2. Listen carefully to everything the student says. Understand the actual meaning, intent, and context before responding. Never assume what the student is going to say. Never generate the next interview question until you have processed the student's latest response.
3. Handle every student interaction dynamically:
   - GREETING: If they greet you ("Good morning", "Hello", "Hi"), greet them warmly and ask how they are doing or what they'd like to practice.
   - CHOOSE TOPIC: If they specify a topic ("I want to practice C programming", "Let's do DSA", "System Design"), enthusiastically adopt that topic and ask a relevant question or ask their preference.
   - QUESTIONS: If they ask a question ("What is an array?", "How does a hash table work?"), explain it clearly, accurately, and intuitively.
   - SIMPLIFICATION: If they ask to simplify ("Can you explain in simpler English?"), use a relatable real-world analogy.
   - SWITCH TOPICS: If they want to change topics ("Let's switch from C to C++"), pivot immediately without resistance.
   - STOP: If they say "Stop the interview", acknowledge politely and wrap up gracefully.
   - HINTS: If they are stuck or ask for a hint, provide a gentle, thought-provoking hint without revealing the whole answer.
   - REPEAT: If they ask to repeat the question, repeat or rephrase it clearly.
   - ANSWERS: If they answer your technical question:
     * Acknowledge what they got right.
     * If there's an error (e.g. wrong Big-O complexity, memory leak, missing edge case), point it out politely and constructively.
     * Ask an intelligent follow-up question based on what they just said.
4. Maintain full context of the entire conversation history. Never repeat fixed scripts. Never behave like a scripted robot.`
    }

    return `You are Arvi, Director of Talent & People Culture and an expert Behavioral Interview & Communication Coach, having a 1-on-1 session with a student named ${candidateName}.

CORE CONVERSATIONAL INSTRUCTIONS:
1. Speak in warm, empathetic, professional spoken English. Do NOT use markdown formatting (no asterisks, bullet points, headers, or emojis) because your words are spoken directly via text-to-speech. Keep responses concise (2-4 sentences max per turn).
2. Listen carefully to everything the student says. Understand their actual emotions, tone, and context before responding.
3. Handle every scenario dynamically:
   - GREETINGS: Greet warmly and build rapport.
   - NERVOUSNESS: Reassure with genuine empathy if they feel anxious.
   - BEHAVIORAL QUESTIONS: Guide them using the STAR method (Situation, Task, Action, Result).
   - FEEDBACK: When they answer, praise their authenticity, point out any area to strengthen (e.g., more emphasis on personal impact or teamwork), and ask a natural follow-up question.
   - ADAPT: If they ask questions about company culture, career growth, or want to change focus, adapt immediately.
   - STOP: If they want to stop, wrap up warmly with encouraging feedback.
4. Never recite fixed scripts. Treat this as an authentic, real-time conversation between two human beings.`
  }

  // Student Input Processor (Real-Time AI Reasoning)
  async function processStudentSpeech(speechText: string) {
    const raw = speechText.trim()
    if (!raw || isGeneratingRef.current || paused) return

    isGeneratingRef.current = true
    setConversationState('THINKING')
    setLiveCandidateSpeech('')
    accumulatedSpeechRef.current = ''
    setUserInput('')

    // Append student message to chat history
    const userMsg: Message = { role: 'user', content: raw, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])

    chatHistoryRef.current.push({ role: 'user', content: raw })

    try {
      let aiResponseText = ''

      if (isGeminiConfigured()) {
        const systemPrompt = getSystemPrompt()
        aiResponseText = await askGeminiChat(chatHistoryRef.current, systemPrompt)
      } else {
        // High-quality conversational heuristic fallback if offline
        const lower = raw.toLowerCase()
        if (lower.includes('good morning') || lower.includes('hello') || lower.includes('hi')) {
          aiResponseText = `Good morning! How are you doing today? What would you like to prepare for today?`
        } else if (lower.includes('c programming') || lower.includes('practise c')) {
          aiResponseText = `C is a fantastic language for building strong fundamentals. Would you prefer basic memory and pointers, or coding problems?`
        } else if (lower.includes('what is an array')) {
          aiResponseText = `An array is a fixed-size collection of elements of the same type stored in contiguous blocks of memory. Does that make sense, or would you like a quick example?`
        } else if (lower.includes('simpler') || lower.includes('simple english')) {
          aiResponseText = `Think of an array like a row of numbered lockers in a hallway, where every locker is the exact same size and holds the same type of item. Because they are right next to each other, you can instantly find any locker by its number.`
        } else if (lower.includes('stop')) {
          aiResponseText = `No problem at all, we can stop right here. You did a great job today. Let me know whenever you'd like to practice again!`
        } else if (lower.includes('switch to c++') || lower.includes('c++')) {
          aiResponseText = `Great choice! C++ gives us powerful features like object-oriented programming, references, and the standard template library. What topic in C++ would you like to explore first?`
        } else {
          aiResponseText = `I understand. You mentioned ${raw}. Tell me more about your thoughts on this, or what part you'd like to dive deeper into?`
        }
      }

      // Add model response to history
      chatHistoryRef.current.push({ role: 'model', content: aiResponseText })
      const aiMsg: Message = { role: 'model', content: aiResponseText, timestamp: new Date() }
      setMessages(prev => [...prev, aiMsg])

      // Speak response dynamically
      speakResponse(aiResponseText)
    } catch (err: any) {
      console.error('Conversational AI error:', err)
      setConversationState('ERROR')
      toast.error('AI response error. Please try again.')
      setTimeout(() => {
        setConversationState('LISTENING')
      }, 2000)
    } finally {
      isGeneratingRef.current = false
    }
  }

  // Enter Room Gate
  function handleEnterRoom() {
    setPermissionsGranted(true)
    startVisionPostureAnalysis()

    if (videoRef.current && streamRef.current) {
      videoRef.current.muted = true
      videoRef.current.defaultMuted = true
      videoRef.current.playsInline = true
      videoRef.current.setAttribute('playsinline', 'true')
      videoRef.current.setAttribute('muted', 'true')
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().then(() => setHasVideoStream(true)).catch(e => console.warn(e))
    }

    // Dynamic initial welcome greeting
    const welcome = interviewer === 'anway'
      ? `Hello ${candidateName}, welcome! I'm Anway, Senior Staff Engineer at Google. It's great to have you here today. What would you like to focus on for our session?`
      : `Hi ${candidateName}, wonderful to meet you! I'm Arvi, Director of Talent. I'm excited to help you master communication and behavioral interviews today. How are you feeling, and where would you like to start?`

    chatHistoryRef.current.push({ role: 'model', content: welcome })
    setMessages([{ role: 'model', content: welcome, timestamp: new Date() }])

    setTimeout(() => {
      speakResponse(welcome)
    }, 600)
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
      score: 85,
      eyeContactScore: postureMetrics.eyeContactScore,
      postureStatus: postureMetrics.postureStatus,
      attitudeStatus: postureMetrics.attitudeStatus,
      collectedResponses: messages.filter(m => m.role === 'user').map(m => ({
        stageName: 'Conversational Turn',
        question: 'Interactive Dialogue',
        candidateAnswer: m.content,
        score: 85,
        strengths: 'Engaged in natural conversational dialogue.',
        errorsDetected: null,
        correctedAnswer: m.content,
        timestamp: m.timestamp.toLocaleTimeString(),
      })),
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
              NEXHIRE AI • Real-Time Voice Room
            </span>
            <h1 className="text-2xl font-black text-white">
              Equipment & Conversational Setup
            </h1>
            <p className="text-xs text-gray-300">
              Welcome, <strong>{candidateName}</strong>! {interviewer === 'anway' ? 'Anway' : 'Arvi'} will converse with you naturally in real-time. Say whatever is on your mind.
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
              Live Webcam Ready
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
              <span><strong>True Conversational Agent:</strong> No hardcoded scripts. Anway and Arvi genuinely listen, think, and respond to what you say.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Instant Interruption (Barge-In):</strong> Speak at any time while the AI is talking—they will immediately pause and listen to you.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Natural Dialogue:</strong> Ask questions, ask for hints, simplify language, or change topics whenever you want.</span>
            </div>
          </div>

          <button
            onClick={handleEnterRoom}
            className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
          >
            <ShieldCheck className="w-4 h-4" />
            Enter Real-Time Interview Room
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
            <span className="text-white font-bold text-sm uppercase tracking-wider">Live Conversational Call</span>
          </div>
          <span className="badge badge-blue text-xs uppercase">{type}</span>
          <span className="badge badge-purple text-xs capitalize">{interviewer}</span>
        </div>

        {/* State Machine Status HUD Badge */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
            conversationState === 'LISTENING'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse'
              : conversationState === 'THINKING' || conversationState === 'PROCESSING'
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : conversationState === 'SPEAKING'
              ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
              : conversationState === 'INTERRUPTED'
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : 'bg-white/5 border-white/10 text-gray-400'
          }`}>
            {conversationState === 'LISTENING' ? (
              <>
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>🟢 LISTENING: Speak naturally...</span>
              </>
            ) : conversationState === 'THINKING' || conversationState === 'PROCESSING' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>🟡 THINKING: Anway is processing...</span>
              </>
            ) : conversationState === 'SPEAKING' ? (
              <>
                <Volume1 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>🟣 SPEAKING: (Speak to interrupt)</span>
              </>
            ) : conversationState === 'INTERRUPTED' ? (
              <>
                <Hand className="w-3.5 h-3.5 text-rose-400" />
                <span>⚡ INTERRUPTED: Listening to you...</span>
              </>
            ) : (
              <>
                <Activity className="w-3.5 h-3.5 text-gray-400" />
                <span>IDLE: Ready</span>
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
              title="Split View (Side-by-Side)"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Dual View</span>
            </button>
            <button
              onClick={() => setLayoutMode('interviewer')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                layoutMode === 'interviewer' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Focus View"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Focus</span>
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
                <RealisticAnway speaking={conversationState === 'SPEAKING'} isBlinking={isBlinking} />
              ) : (
                <RealisticArvi speaking={conversationState === 'SPEAKING'} isBlinking={isBlinking} />
              )}

              {/* State Banner directly over Avatar */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20">
                {conversationState === 'SPEAKING' && (
                  <button
                    onClick={handleInterruption}
                    className="px-3 py-1 rounded-full bg-red-600/80 hover:bg-red-600 backdrop-blur-md border border-red-400/50 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg transition-all"
                    title="Interrupt and speak immediately"
                  >
                    <Hand className="w-3 h-3" />
                    <span>✋ Interrupt {interviewer === 'anway' ? 'Anway' : 'Arvi'}</span>
                  </button>
                )}

                {conversationState === 'LISTENING' && (
                  <div className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md border border-emerald-400/60 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Listening to you live</span>
                  </div>
                )}

                {conversationState === 'THINKING' && (
                  <div className="px-3 py-1 rounded-full bg-amber-600/90 backdrop-blur-md border border-amber-400/60 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Thinking...</span>
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

            {/* Tile 2: YOU - Candidate Live Webcam */}
            <div className={`relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-black/80 shadow-2xl flex flex-col items-center justify-center ${
              layoutMode === 'interviewer' ? 'hidden' : 'flex-1'
            }`}>
              {camOn ? (
                <>
                  <video
                    ref={setCandidateVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  {!hasVideoStream && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <VideoOff className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Allow Camera Access</h4>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs">
                          {cameraError || 'Please allow camera permissions in your browser bar.'}
                        </p>
                      </div>
                      <button
                        onClick={initCameraAndMic}
                        className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow-lg"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Allow / Start Webcam</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-3xl font-bold">
                    {candidateName ? candidateName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">{candidateName}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Camera is muted</p>
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

              <canvas ref={canvasRef} className="hidden" />

              {/* Top Overlays on Candidate Video */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none z-20">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white font-semibold">
                  <span className={`w-2 h-2 rounded-full ${conversationState === 'LISTENING' ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span>You ({candidateName})</span>
                  {conversationState === 'LISTENING' && (
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

              {/* Live Candidate Spoken Words Banner */}
              {liveCandidateSpeech && (
                <div className="absolute bottom-16 left-4 right-4 flex justify-center z-20 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl px-4 py-2 rounded-xl bg-emerald-950/90 backdrop-blur-md border border-emerald-400/60 text-white text-xs text-center shadow-xl"
                  >
                    <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Hearing You:</span>
                    </div>
                    <p className="font-medium italic text-white text-xs">"{liveCandidateSpeech}"</p>
                  </motion.div>
                </div>
              )}

              {/* Bottom Overlays on Candidate Video */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[11px] text-gray-200">
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  <span>Eye Contact:</span>
                  <span className="font-mono text-emerald-400 font-bold">{postureMetrics.eyeContactScore}%</span>
                </div>

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

          {/* Bottom Bar: Action Controls */}
          <div className="rounded-2xl bg-[#0a0f2c]/90 border border-white/10 flex items-center justify-between gap-3 px-6 py-2.5">
            <div className="flex items-center gap-2">
              {conversationState === 'LISTENING' && liveCandidateSpeech && (
                <button
                  onClick={() => {
                    const finalAnswer = liveCandidateSpeech.trim() || accumulatedSpeechRef.current.trim()
                    if (finalAnswer) {
                      processStudentSpeech(finalAnswer)
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all animate-pulse"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Spoken Answer</span>
                </button>
              )}

              {conversationState === 'SPEAKING' && (
                <button
                  onClick={handleInterruption}
                  className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <Hand className="w-4 h-4" />
                  <span>Interrupt {interviewer === 'anway' ? 'Anway' : 'Arvi'}</span>
                </button>
              )}
            </div>

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
                onClick={() => setPaused(!paused)}
                className="p-2.5 rounded-xl flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                title="Pause interview"
              >
                {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span className="hidden sm:inline">{paused ? 'Resume' : 'Pause'}</span>
              </button>
            </div>

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

        {/* Right Side: Conversation Transcript Panel */}
        <div className="w-80 lg:w-[440px] border-l border-blue-500/20 bg-[#0a0f2c]/95 flex flex-col">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-white font-bold text-xs uppercase">Live Conversation History</span>
            </div>
            <span className="badge badge-emerald text-[10px] flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              AI Agent Active
            </span>
          </div>

          {/* Transcript Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`${msg.role === 'user' ? 'ml-4' : 'mr-4'} space-y-1.5`}>
                <div className={`text-[11px] font-bold flex items-center gap-1.5 ${
                  msg.role === 'user' ? 'justify-end text-blue-400' : 'text-purple-400'
                }`}>
                  {msg.role === 'user' ? `${candidateName} (You)` : (interviewer === 'anway' ? 'Anway (Google Staff Engineer)' : 'Arvi (Talent Director)')}
                </div>

                <div className={`p-3.5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap font-sans ${
                  msg.role === 'user'
                    ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {conversationState === 'THINKING' && (
              <div className="mr-6 p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-amber-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{interviewer === 'anway' ? 'Anway' : 'Arvi'} is thinking and formulating a response...</span>
              </div>
            )}
          </div>

          {/* Response Input (Type code or text + Instant Send) */}
          <div className="p-3 border-t border-white/10 space-y-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (conversationState === 'SPEAKING') {
                    handleInterruption()
                  }
                }}
                className={`p-2.5 rounded-xl border shrink-0 transition-all ${
                  conversationState === 'LISTENING'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                    : 'bg-white/5 text-gray-400 border-white/10'
                }`}
                title={conversationState === 'LISTENING' ? 'Microphone listening live' : 'Speak answer'}
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
                      processStudentSpeech(userInput.trim())
                    }
                  }
                }}
                placeholder="Speak hands-free, or type questions/code here... (Enter to send)"
                className="input-field text-xs py-2 flex-1 resize-none"
                disabled={conversationState === 'THINKING' || paused}
              />
              <button
                onClick={() => {
                  if (userInput.trim()) {
                    processStudentSpeech(userInput.trim())
                  }
                }}
                disabled={!userInput.trim() || conversationState === 'THINKING' || paused}
                className="btn-primary p-2.5 text-xs rounded-xl disabled:opacity-40 shrink-0 self-end mb-1"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <Radio className={`w-3 h-3 ${conversationState === 'LISTENING' ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>
                  {conversationState === 'LISTENING'
                    ? 'Microphone listening live — speak anytime!'
                    : conversationState === 'SPEAKING'
                    ? 'AI speaking — speak anytime to interrupt'
                    : 'AI ready'}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <span>Press</span>
                <kbd className="px-1 py-0.5 rounded bg-white/10 text-[9px] text-gray-300 font-mono flex items-center gap-0.5">
                  <CornerDownLeft className="w-2.5 h-2.5" /> Enter
                </kbd>
                <span>to send</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
