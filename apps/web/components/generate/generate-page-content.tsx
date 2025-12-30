'use client'

/**
 * Generate Page Content Component
 *
 * Main content component for the generate page.
 * Handles mode switching between Component and Build App modes.
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useGenerateStore } from '@/stores/generate-store'
import { ChatPanel } from '@/components/generate/chat-panel'
import { PreviewPanel } from '@/components/generate/preview-panel'
import { AppPreviewPanel } from '@/components/generate/app-preview-panel'
import { useGenerateWithReasoning } from '@/hooks/use-generate-with-reasoning'
import { useChatApp, useToolCallsFromMessages } from '@/hooks/use-chat-app'
import { FileSystemProvider } from '@/lib/fs/fs-provider'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types'

// Generate a unique project ID for app mode
function generateProjectId(): string {
  return `project_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function GeneratePageContent(): React.ReactElement {
  const [appProjectId] = useState(() => generateProjectId())
  const { generationMode } = useGenerateStore()

  // Render different components based on mode
  // App mode needs FileSystemProvider wrapper
  if (generationMode === 'app') {
    return (
      <FileSystemProvider projectId={appProjectId}>
        <AppModeContent />
      </FileSystemProvider>
    )
  }

  return <ComponentModeContent />
}

// ============================================================================
// COMPONENT MODE
// ============================================================================

function ComponentModeContent(): React.ReactElement {
  const hasInitialized = useRef(false)
  const hasLoadedProject = useRef(false)
  const [sidebarWidth, setSidebarWidth] = useState(400)
  const [isResizing, setIsResizing] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')

  const {
    messages,
    generatedCode,
    isGenerating,
    currentReasoning,
    currentContextUsage,
    checkpoints,
    consumePendingPrompt,
    addCheckpoint,
    restoreCheckpoint,
    currentProjectId,
    projectName,
    loadProject,
    generationMode,
    setGenerationMode,
  } = useGenerateStore()

  const { handleGenerate } = useGenerateWithReasoning()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  // Load project from URL parameter
  useEffect(() => {
    if (hasLoadedProject.current || !projectId || currentProjectId === projectId) return

    const loadProjectFromUrl = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (!response.ok) {
          console.error('Failed to load project:', response.statusText)
          return
        }

        const project = await response.json()
        loadProject({
          id: project.id,
          name: project.name,
          code: project.code,
          prompt: project.prompt,
        })
        hasLoadedProject.current = true
      } catch (error) {
        console.error('Error loading project:', error)
      }
    }

    loadProjectFromUrl()
  }, [projectId, currentProjectId, loadProject])

  // Resizing logic
  const { startResizing, resize, stopResizing } = useResizing(
    isResizing,
    setIsResizing,
    setSidebarWidth
  )

  useEffect(() => {
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResizing)
    return (): void => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [resize, stopResizing])

  // Handle pending prompt on mount
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const pendingPrompt = consumePendingPrompt()
    if (pendingPrompt) {
      handleGenerate(pendingPrompt, true)
    }
  }, [consumePendingPrompt, handleGenerate])

  const handleAddCheckpoint = useCallback((): void => {
    const lastMessage = messages[messages.length - 1]
    const label = lastMessage
      ? `After: ${lastMessage.content.slice(0, 30)}...`
      : 'Checkpoint'
    addCheckpoint(label)
  }, [messages, addCheckpoint])

  const handleSubmit = useCallback(
    (prompt: string): void => {
      handleGenerate(prompt, true)
    },
    [handleGenerate]
  )

  return (
    <div className="flex h-screen w-full bg-zinc-950 overflow-hidden">
      <div
        style={{ width: isSidebarCollapsed ? 60 : sidebarWidth }}
        className={cn(
          'shrink-0 flex flex-col bg-zinc-950 relative transition-[width] duration-300 ease-in-out',
          isResizing && 'transition-none'
        )}
      >
        <ChatPanel
          messages={messages}
          onSubmit={handleSubmit}
          isGenerating={isGenerating}
          currentReasoning={currentReasoning}
          contextUsage={currentContextUsage}
          checkpoints={checkpoints}
          onAddCheckpoint={handleAddCheckpoint}
          onRestoreCheckpoint={restoreCheckpoint}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          projectName={projectName}
          projectId={currentProjectId}
          isAuthenticated={isAuthenticated}
          generationMode={generationMode}
          onModeChange={setGenerationMode}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 relative">
        {!isSidebarCollapsed && (
          <ResizeHandle isResizing={isResizing} onMouseDown={startResizing} />
        )}
        <PreviewPanel code={generatedCode} isLoading={isGenerating} />
      </div>
    </div>
  )
}

// ============================================================================
// APP MODE (with FileSystemProvider)
// ============================================================================

function AppModeContent(): React.ReactElement {
  const [sidebarWidth, setSidebarWidth] = useState(400)
  const [isResizing, setIsResizing] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const {
    projectName,
    currentProjectId,
    generationMode,
    setGenerationMode,
    supabaseConfig,
  } = useGenerateStore()

  // App mode hook - uses FileSystemProvider context
  const {
    messages: appMessages,
    sendMessage,
    status,
  } = useChatApp({
    supabaseConfig,
    onError: (error) => console.error('App generation error:', error),
  })

  const isGenerating = status === 'submitted' || status === 'streaming'

  // Extract tool calls for progress display
  const toolCalls = useToolCallsFromMessages(appMessages)

  // Check authentication status
  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  // Resizing logic
  const { startResizing, resize, stopResizing } = useResizing(
    isResizing,
    setIsResizing,
    setSidebarWidth
  )

  useEffect(() => {
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResizing)
    return (): void => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [resize, stopResizing])

  const handleSubmit = useCallback(
    async (prompt: string): Promise<void> => {
      await sendMessage(prompt)
    },
    [sendMessage]
  )

  // Convert app messages to ChatMessage format
  const messages: ChatMessage[] = appMessages.map((m) => {
    // UIMessage uses parts array for content in AI SDK v6
    let textContent = ''
    if (m.parts) {
      textContent = m.parts
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map((p) => p.text)
        .join('')
    }
    return {
      role: m.role as 'user' | 'assistant',
      content: textContent,
      timestamp: Date.now(),
    }
  })

  return (
    <div className="flex h-screen w-full bg-zinc-950 overflow-hidden">
      <div
        style={{ width: isSidebarCollapsed ? 60 : sidebarWidth }}
        className={cn(
          'shrink-0 flex flex-col bg-zinc-950 relative transition-[width] duration-300 ease-in-out',
          isResizing && 'transition-none'
        )}
      >
        <ChatPanel
          messages={messages}
          onSubmit={handleSubmit}
          isGenerating={isGenerating}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          projectName={projectName}
          projectId={currentProjectId}
          isAuthenticated={isAuthenticated}
          generationMode={generationMode}
          onModeChange={setGenerationMode}
          toolCalls={toolCalls}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 relative">
        {!isSidebarCollapsed && (
          <ResizeHandle isResizing={isResizing} onMouseDown={startResizing} />
        )}
        <AppPreviewPanel isLoading={isGenerating} projectName={projectName} />
      </div>
    </div>
  )
}

// ============================================================================
// SHARED COMPONENTS & HOOKS
// ============================================================================

function useResizing(
  isResizing: boolean,
  setIsResizing: (v: boolean) => void,
  setSidebarWidth: (v: number) => void
): {
  startResizing: () => void
  resize: (e: MouseEvent) => void
  stopResizing: () => void
} {
  const startResizing = useCallback((): void => setIsResizing(true), [setIsResizing])
  const stopResizing = useCallback((): void => setIsResizing(false), [setIsResizing])
  const resize = useCallback(
    (mouseMoveEvent: MouseEvent): void => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX
        if (newWidth >= 300 && newWidth <= 600) {
          setSidebarWidth(newWidth)
        }
      }
    },
    [isResizing, setSidebarWidth]
  )

  return { startResizing, resize, stopResizing }
}

function ResizeHandle({
  isResizing,
  onMouseDown,
}: {
  isResizing: boolean
  onMouseDown: () => void
}): React.ReactElement {
  return (
    <div
      className="absolute left-0 top-0 bottom-0 w-3 -ml-1.5 cursor-col-resize z-50 group flex items-center justify-center"
      onMouseDown={onMouseDown}
    >
      <div
        className={cn(
          'h-10 w-1 rounded-full transition-all duration-300 ease-out shadow-sm',
          isResizing
            ? 'bg-teal-500 h-12 w-1.5'
            : 'bg-zinc-700 group-hover:bg-zinc-500 group-hover:h-12'
        )}
      />
    </div>
  )
}
