interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface StreamCompletionOptions {
  messages: Message[]
  model?: string
  includeReasoning?: boolean
}

export interface StreamChunk {
  type: 'content' | 'reasoning' | 'usage'
  content?: string
  reasoning?: ReasoningStep
  usage?: UsageData
}

interface ReasoningStep {
  id: string
  title: string
  content: string
  status: 'pending' | 'thinking' | 'completed'
  durationMs?: number
}

interface UsageData {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

const DEFAULT_MODEL = 'anthropic/claude-3.5-sonnet'

const SYSTEM_PROMPT = `You are an expert React component designer. Create beautiful, modern UI components.

TECH STACK:
- React 18 with TypeScript
- Tailwind CSS (dark mode)
- Framer Motion for animations
- Lucide React for icons

CRITICAL RULES:
1. Start with 'use client' directive
2. Export default function component
3. MUST BE 100% SELF-CONTAINED - define ALL data/arrays INSIDE the component
4. Never reference undefined variables - if you need data, create mock data inside the component
5. Use dark theme: zinc-950 background, zinc-100 text
6. Add smooth Framer Motion animations
7. Include TypeScript interfaces for all data structures

EXAMPLE STRUCTURE:
\`\`\`tsx
'use client'

import { motion } from 'framer-motion'
import { Icon } from 'lucide-react'
import { useState } from 'react'

interface ItemType {
  id: number
  name: string
}

export default function ComponentName() {
  // Define ALL mock data INSIDE the component
  const items: ItemType[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
\`\`\`

Response format:
1. Brief explanation
2. Complete code in \`\`\`tsx block (FULLY SELF-CONTAINED)
3. Key features list

Output production-ready, visually impressive code.`

const REASONING_SYSTEM_PROMPT = `You are an expert React component designer. Create beautiful, modern UI components.

IMPORTANT: Before writing code, show your reasoning process using <thinking> tags. Structure your thoughts as steps:

<thinking>
<step title="Understanding Requirements">Analyze what the user is asking for...</step>
<step title="Component Architecture">Plan the component structure...</step>
<step title="Styling Strategy">Decide on visual approach...</step>
<step title="Animation Plan">Plan Framer Motion animations...</step>
</thinking>

After reasoning, provide your response.

TECH STACK:
- React 18 with TypeScript
- Tailwind CSS (dark mode)
- Framer Motion for animations
- Lucide React for icons

CRITICAL RULES:
1. Start with 'use client' directive
2. Export default function component
3. MUST BE 100% SELF-CONTAINED - define ALL data/arrays INSIDE the component
4. Never reference undefined variables - if you need data, create mock data inside the component
5. Use dark theme: zinc-950 background, zinc-100 text
6. Add smooth Framer Motion animations
7. Include TypeScript interfaces for all data structures

Response format:
1. <thinking> block with reasoning steps
2. Brief explanation
3. Complete code in \`\`\`tsx block (FULLY SELF-CONTAINED)
4. Key features list

Output production-ready, visually impressive code.`

function generateId(): string {
  return `r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function parseReasoningSteps(thinkingContent: string): ReasoningStep[] {
  const stepRegex = /<step\s+title="([^"]+)">([\s\S]*?)<\/step>/g
  const steps: ReasoningStep[] = []
  let match: RegExpExecArray | null

  while ((match = stepRegex.exec(thinkingContent)) !== null) {
    const title = match[1] ?? 'Step'
    const content = match[2] ?? ''
    steps.push({
      id: generateId(),
      title,
      content: content.trim(),
      status: 'completed',
    })
  }

  return steps
}

export async function* streamCompletion(
  options: StreamCompletionOptions
): AsyncGenerator<string> {
  const { messages, model = DEFAULT_MODEL, includeReasoning = false } = options

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set')
  }

  const systemPrompt = includeReasoning ? REASONING_SYSTEM_PROMPT : SYSTEM_PROMPT

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
      'X-Title': 'Athrean',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter error: ${error}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        if (!trimmed.startsWith('data: ')) continue

        try {
          const json = JSON.parse(trimmed.slice(6))
          const content = json.choices?.[0]?.delta?.content
          if (content) {
            yield content
          }
        } catch {
          // Skip invalid JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

export async function* streamCompletionWithReasoning(
  options: StreamCompletionOptions
): AsyncGenerator<StreamChunk> {
  const { messages, model = DEFAULT_MODEL } = options

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set')
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
      'X-Title': 'Athrean',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: REASONING_SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
      stream_options: { include_usage: true },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter error: ${error}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body')
  }

  const decoder = new TextDecoder()
  let buffer = ''
  let inThinking = false
  let thinkingBuffer = ''
  let currentStepIndex = 0
  const emittedStepIds = new Set<string>()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        if (!trimmed.startsWith('data: ')) continue

        try {
          const json = JSON.parse(trimmed.slice(6))

          // Check for usage data
          if (json.usage) {
            yield {
              type: 'usage',
              usage: {
                promptTokens: json.usage.prompt_tokens,
                completionTokens: json.usage.completion_tokens,
                totalTokens: json.usage.total_tokens,
              },
            }
          }

          const content = json.choices?.[0]?.delta?.content
          if (!content) continue

          // Parse thinking tags in real-time
          if (content.includes('<thinking>')) {
            inThinking = true
            thinkingBuffer = ''
          }

          if (inThinking) {
            thinkingBuffer += content

            // Check for completed steps
            const steps = parseReasoningSteps(thinkingBuffer)
            for (const step of steps) {
              if (!emittedStepIds.has(step.id)) {
                emittedStepIds.add(step.id)
                yield {
                  type: 'reasoning',
                  reasoning: { ...step, status: 'completed' },
                }
              }
            }

            // Check for step in progress
            const partialStepMatch = thinkingBuffer.match(/<step\s+title="([^"]+)">(?![\s\S]*<\/step>)/)
            if (partialStepMatch) {
              const stepId = `pending_${currentStepIndex}`
              const stepTitle = partialStepMatch[1] ?? 'Processing'
              if (!emittedStepIds.has(stepId)) {
                emittedStepIds.add(stepId)
                yield {
                  type: 'reasoning',
                  reasoning: {
                    id: stepId,
                    title: stepTitle,
                    content: 'Processing...',
                    status: 'thinking',
                  },
                }
                currentStepIndex++
              }
            }
          }

          if (content.includes('</thinking>')) {
            inThinking = false
          }

          // Only yield content outside of thinking tags
          if (!inThinking && !content.includes('<thinking>') && !content.includes('</thinking>')) {
            const cleanContent = content.replace(/<\/?thinking>/g, '')
            if (cleanContent) {
              yield { type: 'content', content: cleanContent }
            }
          }
        } catch {
          // Skip invalid JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
