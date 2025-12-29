'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useGenerateStore } from '@/stores/generate-store'
import { ChatPanel } from '@/components/generate/chat-panel'
import { PreviewPanel } from '@/components/generate/preview-panel'
import { useGenerateWithReasoning } from '@/hooks/use-generate-with-reasoning'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function GeneratePage(): React.ReactElement {
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
    baseComponent,
    currentProjectId,
    projectName,
    loadProject,
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
  const startResizing = useCallback((): void => setIsResizing(true), [])
  const stopResizing = useCallback((): void => setIsResizing(false), [])
  const resize = useCallback(
    (mouseMoveEvent: MouseEvent): void => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX
        if (newWidth >= 300 && newWidth <= 600) {
          setSidebarWidth(newWidth)
        }
      }
    },
    [isResizing]
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

  return (
    <div className="flex h-screen w-full bg-zinc-950 overflow-hidden">
      {/* Left Sidebar - Chat */}
      <div
        style={{ width: isSidebarCollapsed ? 60 : sidebarWidth }}
        className={cn(
          "shrink-0 flex flex-col bg-zinc-950 relative transition-[width] duration-300 ease-in-out",
          isResizing && "transition-none"
        )}
      >
        <ChatPanel
          messages={messages}
          onSubmit={(prompt) => handleGenerate(prompt, true)}
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
        />
      </div>

      {/* Main Area - Preview */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 relative">
        {/* Resize Handle */}
        {!isSidebarCollapsed && (
          <div
            className="absolute left-0 top-0 bottom-0 w-3 -ml-1.5 cursor-col-resize z-50 group flex items-center justify-center"
            onMouseDown={startResizing}
          >
            {/* Pill Handle */}
            <div
              className={cn(
                "h-10 w-1 rounded-full transition-all duration-300 ease-out shadow-sm",
                isResizing
                  ? "bg-teal-500 h-12 w-1.5"
                  : "bg-zinc-700 group-hover:bg-zinc-500 group-hover:h-12"
              )}
            />
          </div>
        )}
        <PreviewPanel code={generatedCode} isLoading={isGenerating} />
      </div>
    </div>
  )
}
