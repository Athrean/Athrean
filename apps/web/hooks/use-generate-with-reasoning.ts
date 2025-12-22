'use client'

import { useCallback } from 'react'
import { useGenerateStore } from '@/stores/generate-store'
import { extractCodeFromMarkdown } from '@/lib/utils'
import { decrementCredits } from '@/lib/db/mutations'
import { createClient } from '@/lib/supabase/client'
import { saveGeneration } from '@/app/actions/component'
import type { ReasoningStep, ContextUsage } from '@/types/reasoning'
import { calculateCost } from '@/types/reasoning'
import {
  getModel,
  DEFAULT_FREE_MODEL,
} from '@/lib/models/registry'

// Use free model by default for cost savings
const DEFAULT_MODEL = DEFAULT_FREE_MODEL

interface StreamChunk {
  type: 'content' | 'reasoning' | 'usage'
  content?: string
  reasoning?: ReasoningStep
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

interface UseGenerateWithReasoningReturn {
  handleGenerate: (prompt: string, useReasoning?: boolean) => Promise<void>
  isGenerating: boolean
}

export function useGenerateWithReasoning(): UseGenerateWithReasoningReturn {
  const {
    messages,
    baseComponent,
    isGenerating,
    projectName,
    currentProjectId,
    addMessage,
    setGeneratedCode,
    setIsGenerating,
    addReasoningStep,
    updateReasoningStep,
    clearReasoning,
    setContextUsage,
    setCurrentProjectId,
    setProjectName,
  } = useGenerateStore()

  const handleGenerate = useCallback(
    async (prompt: string, useReasoning = true): Promise<void> => {
      addMessage({ role: 'user', content: prompt })
      setIsGenerating(true)
      clearReasoning()
      setContextUsage(null)

      const startTime = Date.now()
      let fullResponse = ''
      const model = DEFAULT_MODEL

      try {
        const endpoint = useReasoning ? '/generate-with-reasoning' : '/generate'
        const response = await fetch(`/api${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            baseCode: baseComponent?.code,
            history: messages,
            model,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate')
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('No response body')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          if (useReasoning) {
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              if (!line.trim()) continue

              try {
                const chunk = JSON.parse(line) as StreamChunk

                if (chunk.type === 'reasoning' && chunk.reasoning) {
                  const existingStep = useGenerateStore
                    .getState()
                    .currentReasoning.find(
                      (s) => s.title === chunk.reasoning?.title && s.status === 'thinking'
                    )

                  if (existingStep && chunk.reasoning.status === 'completed') {
                    updateReasoningStep(existingStep.id, {
                      status: 'completed',
                      content: chunk.reasoning.content,
                    })
                  } else if (!existingStep) {
                    addReasoningStep(chunk.reasoning)
                  }
                }

                if (chunk.type === 'content' && chunk.content) {
                  fullResponse += chunk.content
                  const code = extractCodeFromMarkdown(fullResponse)
                  if (code) {
                    setGeneratedCode(code)
                  }
                }

                if (chunk.type === 'usage' && chunk.usage) {
                  const modelConfig = getModel(model)
                  const contextWindow = modelConfig?.contextWindow ?? 200000
                  const contextUsage: ContextUsage = {
                    promptTokens: chunk.usage.promptTokens,
                    completionTokens: chunk.usage.completionTokens,
                    totalTokens: chunk.usage.totalTokens,
                    estimatedCost: calculateCost(chunk.usage, model),
                    model,
                    contextWindow,
                    usagePercent: (chunk.usage.totalTokens / contextWindow) * 100,
                  }
                  setContextUsage(contextUsage)
                }
              } catch {
                // Skip invalid JSON
              }
            }
          } else {
            fullResponse += buffer
            buffer = ''
            const code = extractCodeFromMarkdown(fullResponse)
            if (code) {
              setGeneratedCode(code)
            }
          }
        }

        const cleanedResponse = fullResponse
          .replace(/<thinking>[\s\S]*?<\/thinking>/g, '')
          .trim()

        addMessage({ role: 'assistant', content: cleanedResponse })

        const finalCode = extractCodeFromMarkdown(fullResponse)
        if (finalCode) {
          setGeneratedCode(finalCode)
        }

        // Log and auto-save for authenticated users
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user && finalCode) {
          const durationMs = Date.now() - startTime

          decrementCredits().catch(() => { })

          // Auto-save project if not already saved
          if (!currentProjectId) {
            const projectTitle = prompt.slice(0, 50) || projectName
            const result = await saveGeneration({
              name: projectTitle,
              code: finalCode,
              prompt: prompt,
              model,
              durationMs,
              isPublic: false,
            })

            if (result.data) {
              setCurrentProjectId(result.data.id)
              setProjectName(result.data.name)
            }
          }
        }
      } catch (error) {
        console.error('Generation error:', error)
        addMessage({
          role: 'assistant',
          content: 'Sorry, there was an error generating your component. Please try again.',
        })
      } finally {
        setIsGenerating(false)
      }
    },
    [
      messages,
      baseComponent,
      projectName,
      currentProjectId,
      addMessage,
      setGeneratedCode,
      setIsGenerating,
      addReasoningStep,
      updateReasoningStep,
      clearReasoning,
      setContextUsage,
      setCurrentProjectId,
      setProjectName,
    ]
  )

  return { handleGenerate, isGenerating }
}
