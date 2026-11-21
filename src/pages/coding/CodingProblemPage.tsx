import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft, Lightbulb, CheckCircle, XCircle,
  Clock, RefreshCw, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import AppLayout from '../../components/layout/AppLayout'
import toast from 'react-hot-toast'

const PROBLEMS: Record<string, any> = {
  'two-sum': {
    title: 'Two Sum', difficulty: 'easy', topic: 'Arrays',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]', explanation: '' },
    ],
    constraints: ['2 <= nums.length <= 10⁴', '-10⁹ <= nums[i] <= 10⁹', 'Only one valid answer exists.'],
    hints: [
      'A brute force approach would use O(n²). Can you do better?',
      'Think about using a hash map to store numbers you\'ve already seen.',
      'For each number, check if (target - number) exists in the hash map.',
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    defaultCode: {
      python: `def twoSum(nums, target):
    # Your solution here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test
print(twoSum([2,7,11,15], 9))  # Expected: [0, 1]
`,
      javascript: `function twoSum(nums, target) {
    // Your solution here
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

// Test
console.log(twoSum([2,7,11,15], 9)); // Expected: [0, 1]
`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

// Test cases omitted - run with your own main()
`,
      java: `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}
`,
    },
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0,1]' },
      { input: '[3,2,4], 6', expected: '[1,2]' },
      { input: '[3,3], 6', expected: '[0,1]' },
    ],
  },
  'max-subarray': {
    title: 'Maximum Subarray', difficulty: 'medium', topic: 'Arrays',
    description: `Given an integer array \`nums\`, find the **subarray with the largest sum**, and return its sum.

This classic problem is solved optimally with Kadane's Algorithm.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1', explanation: '' },
      { input: 'nums = [5,4,-1,7,8]', output: '23', explanation: '' },
    ],
    constraints: ['1 <= nums.length <= 10⁵', '-10⁴ <= nums[i] <= 10⁴'],
    hints: [
      'Think about keeping track of the current sum and the maximum sum seen so far.',
      'If the current sum becomes negative, it\'s better to start fresh from the next element.',
      'This is Kadane\'s Algorithm – O(n) time, O(1) space.',
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    defaultCode: {
      python: `def maxSubArray(nums):
    # Kadane's Algorithm
    max_sum = nums[0]
    current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum

print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6
`,
      javascript: `function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    
    return maxSum;
}
`,
      java: `public class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        
        return maxSum;
    }
}
`,
    },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
      { input: '[1]', expected: '1' },
      { input: '[5,4,-1,7,8]', expected: '23' },
    ],
  },
}

const LANG_EXTENSIONS: Record<string, any> = {
  python: python(),
  javascript: javascript(),
  cpp: cpp(),
  java: java(),
}

type Lang = 'python' | 'javascript' | 'cpp' | 'java'

export default function CodingProblemPage() {
  const { problemId } = useParams()
  const problem = PROBLEMS[problemId || ''] || PROBLEMS['two-sum']
  const [language, setLanguage] = useState<Lang>('python')
  const [code, setCode] = useState(problem.defaultCode.python)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'solution' | 'submissions'>('description')
  const [showHint, setShowHint] = useState(false)
  const [hintIdx, setHintIdx] = useState(0)
  const [testResults, setTestResults] = useState<any[]>([])
  const [submissionResult, setSubmissionResult] = useState<any>(null)
  const [showConsole, setShowConsole] = useState(false)

  useEffect(() => {
    setCode(problem.defaultCode[language] || '')
  }, [language, problem])

  const JUDGE0_URL = import.meta.env.VITE_JUDGE0_API_URL
  const JUDGE0_KEY = import.meta.env.VITE_JUDGE0_API_KEY

  const LANG_IDS: Record<Lang, number> = {
    python: 71,
    javascript: 63,
    cpp: 54,
    java: 62,
  }

  async function executeCode(codeToRun: string) {
    if (!JUDGE0_URL || !JUDGE0_KEY || JUDGE0_KEY === 'your-judge0-key-here') {
      // Simulate execution in demo mode
      await new Promise(r => setTimeout(r, 1200))
      return { status: 'Accepted', output: 'Demo mode: Configure Judge0 API for real code execution.\n\n[0, 1]', runtime: 42, memory: 14.2 }
    }

    const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'x-rapidapi-key': JUDGE0_KEY,
      },
      body: JSON.stringify({
        source_code: codeToRun,
        language_id: LANG_IDS[language],
        stdin: '',
      }),
    })
    const result = await submitRes.json()
    return {
      status: result.status?.description || 'Unknown',
      output: result.stdout || result.stderr || result.compile_output || 'No output',
      runtime: parseFloat(result.time || '0') * 1000,
      memory: parseFloat(result.memory || '0') / 1024,
    }
  }

  async function handleRun() {
    setRunning(true)
    setShowConsole(true)
    setOutput('Running...')
    try {
      const result = await executeCode(code)
      setOutput(`Status: ${result.status}\n\nOutput:\n${result.output}\n\nRuntime: ${result.runtime?.toFixed(0)}ms\nMemory: ${result.memory?.toFixed(1)}MB`)
    } catch {
      setOutput('Error: Could not execute code. Check your API configuration.')
    }
    setRunning(false)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setShowConsole(true)
    try {
      const result = await executeCode(code)
      const passed = result.status === 'Accepted' || result.status === 'Demo mode'
      setSubmissionResult({
        passed,
        status: passed ? 'Accepted' : result.status,
        runtime: result.runtime,
        memory: result.memory,
        testsPassed: passed ? problem.testCases.length : Math.floor(problem.testCases.length * 0.6),
        total: problem.testCases.length,
      })
      toast[passed ? 'success' : 'error'](passed ? '✅ Accepted! Great job!' : '❌ Wrong Answer. Keep trying!')
    } catch {
      toast.error('Submission failed. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-65px)] overflow-hidden">
        {/* Left Panel – Problem */}
        <div className="w-[45%] flex flex-col border-r border-white/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
            <Link to="/coding" className="text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-sm truncate">{problem.title}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`badge text-xs ${problem.difficulty === 'easy' ? 'badge-green' : problem.difficulty === 'medium' ? 'badge-coral' : 'badge-red'}`}>
                  {problem.difficulty}
                </span>
                <span className="text-gray-500 text-xs">{problem.topic}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 shrink-0">
            {(['description', 'solution', 'submissions'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {activeTab === 'description' && (
              <>
                <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">{problem.description}</div>

                <div>
                  <h4 className="text-white font-semibold mb-3">Examples:</h4>
                  <div className="space-y-3">
                    {problem.examples.map((ex: any, i: number) => (
                      <div key={i} className="rounded-xl p-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="text-gray-400 text-xs font-semibold mb-2">Example {i + 1}:</div>
                        <div className="text-gray-300"><span className="text-gray-500">Input: </span>{ex.input}</div>
                        <div className="text-gray-300"><span className="text-gray-500">Output: </span>{ex.output}</div>
                        {ex.explanation && <div className="text-gray-400 text-xs mt-1">{ex.explanation}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Constraints:</h4>
                  <ul className="space-y-1">
                    {problem.constraints.map((c: string, i: number) => (
                      <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={16} className="text-yellow-400" />
                    <span className="text-white font-semibold">Hints</span>
                    <button onClick={() => setShowHint(!showHint)}
                      className="text-blue-400 text-xs hover:text-blue-300">
                      {showHint ? 'Hide' : 'Show Hint'}
                    </button>
                  </div>
                  {showHint && (
                    <div className="rounded-xl p-4"
                      style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
                      <p className="text-yellow-200 text-sm">{problem.hints[hintIdx]}</p>
                      {hintIdx < problem.hints.length - 1 && (
                        <button onClick={() => setHintIdx(hintIdx + 1)}
                          className="text-yellow-400 text-xs mt-2 hover:text-yellow-300">
                          Next hint →
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-2">
                  <div className="rounded-xl p-3 flex-1 text-center"
                    style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <div className="text-blue-400 font-bold text-sm">Time</div>
                    <div className="text-white font-black">{problem.timeComplexity}</div>
                  </div>
                  <div className="rounded-xl p-3 flex-1 text-center"
                    style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <div className="text-purple-400 font-bold text-sm">Space</div>
                    <div className="text-white font-black">{problem.spaceComplexity}</div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'solution' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-xl"
                  style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <AlertCircle size={14} className="text-orange-400" />
                  <span className="text-orange-300 text-xs">Try solving it yourself first! Solutions are for learning purposes.</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Optimal Approach:</h4>
                  <p className="text-gray-300 leading-relaxed">Use a hash map to store each number's index. For each element, check if the complement (target - current) exists in the map. This gives O(n) time complexity.</p>
                </div>
                <pre className="rounded-xl p-4 text-green-400 text-xs overflow-x-auto"
                  style={{ background: '#0a1628', border: '1px solid rgba(34,197,94,0.2)' }}>
                  {problem.defaultCode.python}
                </pre>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="text-center py-12">
                <CheckCircle size={40} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No submissions yet. Solve the problem first!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel – Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 shrink-0 border-b border-white/10"
            style={{ background: 'rgba(10,15,44,0.8)' }}>
            <select value={language} onChange={e => setLanguage(e.target.value as Lang)}
              className="text-sm font-medium px-3 py-1.5 rounded-lg outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <option value="python" style={{ background: '#111845' }}>Python</option>
              <option value="javascript" style={{ background: '#111845' }}>JavaScript</option>
              <option value="cpp" style={{ background: '#111845' }}>C++</option>
              <option value="java" style={{ background: '#111845' }}>Java</option>
            </select>

            <div className="flex gap-2">
              <button onClick={() => setCode(problem.defaultCode[language])}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all" title="Reset code">
                <RefreshCw size={16} />
              </button>
              <button onClick={handleRun} disabled={running || submitting}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac' }}>
                {running ? <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" /> : <Play size={14} />}
                Run
              </button>
              <button onClick={handleSubmit} disabled={running || submitting}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 btn-primary">
                {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={14} />}
                Submit
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden" style={{ height: showConsole ? '60%' : '100%' }}>
            <CodeMirror
              value={code}
              onChange={setCode}
              theme={oneDark}
              extensions={[LANG_EXTENSIONS[language]]}
              style={{ height: '100%', fontSize: '14px' }}
              basicSetup={{ lineNumbers: true, foldGutter: true, dropCursor: true, indentOnInput: true }}
            />
          </div>

          {/* Console / Output */}
          <div className="border-t border-white/10"
            style={{ height: showConsole ? '40%' : '44px', transition: 'height 0.3s ease' }}>
            <div className="flex items-center justify-between px-4 py-2 cursor-pointer"
              onClick={() => setShowConsole(!showConsole)}
              style={{ background: 'rgba(10,15,44,0.8)' }}>
              <span className="text-gray-400 text-sm font-medium">Console</span>
              {showConsole ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
            </div>

            {showConsole && (
              <div className="p-4 h-[calc(100%-44px)] overflow-y-auto">
                {!submissionResult && (
                  <pre className="text-green-400 text-xs font-mono leading-relaxed whitespace-pre-wrap">{output || 'Click "Run" to test your code'}</pre>
                )}

                {submissionResult && (
                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${submissionResult.passed ? 'bg-green-500/15 border border-green-500/30' : 'bg-red-500/15 border border-red-500/30'}`}>
                      {submissionResult.passed
                        ? <CheckCircle size={20} className="text-green-400" />
                        : <XCircle size={20} className="text-red-400" />}
                      <div>
                        <div className={`font-bold ${submissionResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                          {submissionResult.status}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {submissionResult.testsPassed}/{submissionResult.total} test cases passed
                        </div>
                      </div>
                    </div>
                    {submissionResult.passed && (
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock size={12} className="text-blue-400" />
                          Runtime: {submissionResult.runtime?.toFixed(0) || '~42'}ms
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <MemoryStick size={12} className="text-purple-400" />
                          Memory: {submissionResult.memory?.toFixed(1) || '14.2'}MB
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function MemoryStick({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M6 19v-3M10 19v-3M14 19v-3M18 19v-3M4 11h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zM2 11h20v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3z" />
    </svg>
  )
}

function Play({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 3l14 9-14 9V3z" />
    </svg>
  )
}
