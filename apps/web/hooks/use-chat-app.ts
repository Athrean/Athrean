'use client'

/**
 * useChatApp Hook
 *
 * Custom hook for Build Mode app generation using Vercel AI SDK v6.
 * Handles streaming responses and tool call execution against ZenFS.
 */

import { useChat, Chat, type UIMessage } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFileSystem } from '@/lib/fs/fs-provider'
import { useGenerateStore } from '@/stores/generate-store'
import type { SupabaseConfig, FileToolCall } from '@/types/project'

// ============================================================================
// TYPES
// ============================================================================

interface UseChatAppOptions {
  model?: string
  supabaseConfig?: SupabaseConfig | null
  onFileCreated?: (path: string) => void
  onFileUpdated?: (path: string) => void
  onFileDeleted?: (path: string) => void
  onError?: (error: Error) => void
}

interface UseChatAppReturn {
  messages: UIMessage[]
  status: 'ready' | 'submitted' | 'streaming' | 'error'
  error: Error | undefined
  sendMessage: (text: string) => Promise<void>
  regenerate: () => Promise<void>
  stop: () => void
  pendingToolCalls: FileToolCall[]
  canRegenerate: boolean
}

// ============================================================================
// HOOK
// ============================================================================

export function useChatApp(options: UseChatAppOptions = {}): UseChatAppReturn {
  const {
    model,
    supabaseConfig,
    onFileCreated,
    onFileUpdated,
    onFileDeleted,
    onError,
  } = options

  const fs = useFileSystem()
  const { setFileCount } = useGenerateStore()

  // Track pending tool calls for UI feedback
  const pendingToolCalls: FileToolCall[] = []

  // Use refs to avoid stale closures in callbacks
  const fsRef = useRef(fs)
  const callbacksRef = useRef({ onFileCreated, onFileUpdated, onFileDeleted, onError })
  const setFileCountRef = useRef(setFileCount)

  // Keep refs updated
  useEffect(() => {
    fsRef.current = fs
    callbacksRef.current = { onFileCreated, onFileUpdated, onFileDeleted, onError }
    setFileCountRef.current = setFileCount
  }, [fs, onFileCreated, onFileUpdated, onFileDeleted, onError, setFileCount])

  // Create a stable chat instance with refs
  const chatRef = useRef<Chat<UIMessage> | null>(null)

  if (!chatRef.current) {
    console.log('[useChatApp] Creating new Chat instance')
    chatRef.current = new Chat({
      transport: new DefaultChatTransport({
        api: '/api/chat-app',
        body: {
          model,
          supabaseConfig,
        },
      }),
      onToolCall: async ({ toolCall }): Promise<void> => {
        console.log('[useChatApp] onToolCall invoked with:', JSON.stringify(toolCall, null, 2))

        // Execute tool calls against ZenFS
        const currentFs = fsRef.current
        const callbacks = callbacksRef.current

        try {
          const toolName = toolCall.toolName as string
          // toolCall has 'input' property with the tool arguments
          const input = ('input' in toolCall ? toolCall.input : {}) as Record<string, string>

          console.log('[useChatApp] Tool call received:', toolName, 'input:', input)

          switch (toolName) {
            case 'createFile': {
              const path = input.path
              const content = input.content
              if (path && content) {
                console.log('[useChatApp] Creating file:', path)
                await currentFs.writeFile(path, content)
                callbacks.onFileCreated?.(path)
              }
              break
            }

            case 'updateFile': {
              const path = input.path
              const content = input.content
              if (path && content) {
                console.log('[useChatApp] Updating file:', path)
                await currentFs.writeFile(path, content)
                callbacks.onFileUpdated?.(path)
              }
              break
            }

            case 'deleteFile': {
              const path = input.path
              if (path) {
                console.log('[useChatApp] Deleting file:', path)
                await currentFs.deleteFile(path)
                callbacks.onFileDeleted?.(path)
              }
              break
            }

            default:
              console.warn(`[useChatApp] Unknown tool: ${toolName}`)
          }

          // Update file count after any file operation
          const allFiles = await currentFs.getAllFiles()
          setFileCountRef.current(Object.keys(allFiles).length)
          console.log('[useChatApp] File count updated:', Object.keys(allFiles).length)
        } catch (err: unknown) {
          console.error('[useChatApp] Tool execution error:', err)
          callbacks.onError?.(err instanceof Error ? err : new Error('Tool execution failed'))
        }
      },
      onError: (err: Error) => {
        console.error('[useChatApp] Chat error:', err)
        callbacksRef.current.onError?.(err)
      },
    })
  }

  // Use the useChat hook with the Chat instance
  // Add throttling to prevent rapid state updates causing infinite loops
  const {
    messages,
    sendMessage: chatSendMessage,
    regenerate: chatRegenerate,
    status,
    error,
    stop,
  } = useChat({
    chat: chatRef.current,
    experimental_throttle: 50, // Throttle updates to max 20/second
  })

  // Wrapper for sendMessage that includes file context
  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      const currentFiles = await fs.getAllFiles()
      await chatSendMessage({
        text,
      }, {
        body: {
          model,
          supabaseConfig,
          files: currentFiles,
        },
      })
    },
    [chatSendMessage, model, supabaseConfig, fs]
  )

  // Wrapper for regenerate that includes file context
  const regenerate = useCallback(
    async (): Promise<void> => {
      const currentFiles = await fs.getAllFiles()
      await chatRegenerate({
        body: {
          model,
          supabaseConfig,
          files: currentFiles,
        },
      })
    },
    [chatRegenerate, model, supabaseConfig, fs]
  )

  // Check if we can regenerate (need at least one assistant message)
  const canRegenerate = useMemo(() => {
    return messages.some(m => m.role === 'assistant')
  }, [messages])

  // Report errors - use ref to avoid infinite loops
  const lastErrorRef = useRef<Error | null>(null)
  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      lastErrorRef.current = error
      onError?.(error)
    }
  }, [error, onError])

  return {
    messages,
    status,
    error,
    sendMessage,
    regenerate,
    stop,
    pendingToolCalls,
    canRegenerate,
  }
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Extract tool calls from messages for display.
 */
export function useToolCallsFromMessages(messages: UIMessage[]): FileToolCall[] {
  return useMemo(() => {
    const toolCalls: FileToolCall[] = []

    for (const message of messages) {
      if (message.role === 'assistant' && message.parts) {
        for (const part of message.parts) {
          // In AI SDK v6, tool parts have type like 'tool-createFile'
          const partType = part.type as string
          if (partType.startsWith('tool-')) {
            const toolName = partType.replace('tool-', '') as 'createFile' | 'updateFile' | 'deleteFile'
            const toolPart = part as unknown as { input?: Record<string, string> }
            const input = toolPart.input ?? {}

            if (toolName === 'createFile' || toolName === 'updateFile') {
              toolCalls.push({
                type: toolName,
                args: { path: input.path ?? '', content: input.content ?? '' },
              })
            } else if (toolName === 'deleteFile') {
              toolCalls.push({
                type: toolName,
                args: { path: input.path ?? '' },
              })
            }
          }
        }
      }
    }

    return toolCalls
  }, [messages])
}

/**
 * Get the last assistant message content (text parts only).
 */
export function useLastAssistantMessage(messages: UIMessage[]): string | null {
  return useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i]
      if (msg?.role === 'assistant' && msg.parts) {
        const textParts = msg.parts.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        if (textParts.length > 0) {
          return textParts.map((p) => p.text).join('')
        }
      }
    }
    return null
  }, [messages])
}
