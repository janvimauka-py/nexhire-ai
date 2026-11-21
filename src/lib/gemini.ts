import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

let genAI: GoogleGenerativeAI | null = null

function getGenAI() {
  if (!API_KEY || API_KEY === 'your-gemini-api-key-here') {
    return null
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY)
  }
  return genAI
}

export const isGeminiConfigured = () => {
  return !!API_KEY && API_KEY !== 'your-gemini-api-key-here' && API_KEY.trim().length > 10
}

// Ordered by verified live availability for this API key
const ACTIVE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemma-4-26b-a4b-it',
  'gemma-4-31b-it',
]

export async function askGemini(prompt: string, systemPrompt?: string): Promise<string> {
  const ai = getGenAI()
  if (!ai) {
    throw new Error('GEMINI_NOT_CONFIGURED')
  }

  let lastError: any = null
  for (const modelName of ACTIVE_MODELS) {
    try {
      const model = ai.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      })
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      if (text) return text
    } catch (err: any) {
      lastError = err
      console.warn(`Gemini model ${modelName} failed, falling back:`, err?.message || err)
    }
  }

  throw lastError || new Error('All configured Gemini model endpoints failed')
}

export async function askGeminiChat(
  messages: { role: 'user' | 'model'; content: string }[],
  systemPrompt?: string
): Promise<string> {
  const ai = getGenAI()
  if (!ai) {
    throw new Error('GEMINI_NOT_CONFIGURED')
  }

  let lastError: any = null
  for (const modelName of ACTIVE_MODELS) {
    try {
      const model = ai.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      })

      const chat = model.startChat({
        history: messages.slice(0, -1).map(m => ({
          role: m.role,
          parts: [{ text: m.content }],
        })),
      })

      const lastMessage = messages[messages.length - 1]
      const result = await chat.sendMessage(lastMessage.content)
      const text = result.response.text()
      if (text) return text
    } catch (err: any) {
      lastError = err
      console.warn(`Gemini chat model ${modelName} failed, falling back:`, err?.message || err)
    }
  }

  throw lastError || new Error('All configured Gemini chat endpoints failed')
}

// Fallback responses when network drops
export function getMockInterviewResponse(_question: string, type: string): string {
  const responses: Record<string, string[]> = {
    technical: [
      "That is a solid foundational explanation! Let me challenge you further: Can you analyze the time and space complexity in Big-O notation, and how would you optimize memory cache locality?",
      "Interesting perspective. How would you handle distributed edge cases such as network partition or empty node sets?",
      "Good answer! Now let's explore architectural scale: How would you design a rate limiter to protect this microservice under high concurrent traffic?",
    ],
    hr: [
      "Thank you for sharing that candid experience. When working in high-pressure cross-functional teams, how do you handle misaligned expectations with team leadership?",
      "That's insightful. Where do you envision your technical and mentorship contributions in the next 3 to 5 years?",
      "I appreciate that self-awareness. Could you walk me through a setback where a project failed to ship on time, and what constructive adjustments you made?",
    ],
    dsa: [
      "Good observation! Now, can you think of an optimal way to formulate this state transition using dynamic programming memoization?",
      "Correct! What would be the trade-off if we replaced the Hash Map with a Trie or Fenwick tree here?",
      "Nice problem-solving intuition! Could you now write the executable code considering boundary edge cases?",
    ],
  }

  const typeResponses = responses[type] || responses.technical
  return typeResponses[Math.floor(Math.random() * typeResponses.length)]
}
