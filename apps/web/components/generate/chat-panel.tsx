'use client'

import { useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Sparkles, Layers, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ChatMessage, ReasoningStep, ContextUsage, Checkpoint, GenerationMode } from '@/types'
import type { FileToolCall } from '@/types/project'
import { MessageBubble, TypingIndicator } from './chat/chat-message'
import { ChatInput } from './chat/chat-input'
import { ChainOfThought } from './chain-of-thought'
import { CheckpointDivider, AddCheckpointButton } from './reasoning/checkpoint'
import { EmptyState } from './empty-state'
import { ProjectDropdown } from './project-dropdown'
import { ModeToggle } from './mode-toggle'
import { ToolProgress } from './tool-progress'

interface ChatPanelProps {
  messages: ChatMessage[]
  onSubmit: (prompt: string) => void
  isGenerating: boolean
  currentReasoning?: ReasoningStep[]
  contextUsage?: ContextUsage | null
  checkpoints?: Checkpoint[]
  onAddCheckpoint?: () => void
  onRestoreCheckpoint?: (checkpoint: Checkpoint) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  projectName?: string
  projectId?: string | null
  isAuthenticated?: boolean
  generationMode?: GenerationMode
  onModeChange?: (mode: GenerationMode) => void
  toolCalls?: FileToolCall[]
}

export function ChatPanel({
  messages,
  onSubmit,
  isGenerating,
  currentReasoning = [],
  contextUsage = null,
  checkpoints = [],
  onAddCheckpoint,
  onRestoreCheckpoint,
  isCollapsed = false,
  onToggleCollapse,
  projectName = "New Project",
  projectId = null,
  isAuthenticated = false,
  generationMode = 'component',
  onModeChange,
  toolCalls = [],
}: ChatPanelProps): React.ReactElement {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentReasoning, toolCalls])

  const getCheckpointForMessage = (messageIndex: number): Checkpoint | undefined => {
    return checkpoints.find((cp) => cp.messageIndex === messageIndex)
  }

  if (isCollapsed) {
    return (
      <div className="flex flex-col h-full bg-zinc-950 items-center py-4 border-r border-zinc-800">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 text-zinc-500 hover:text-white rounded-full mb-4"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </Button>
        <div className="flex-1 flex flex-col items-center gap-4 pt-4">
          <img
            src="/vector-logo.png"
            alt="Design Mode"
            className="w-8 h-8 object-contain opacity-50 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 flex items-center justify-between bg-zinc-950">
        <div className="flex items-center gap-3">
          <img
            src="/vector-logo.png"
            alt="Athrean"
            className="w-9 h-9 object-contain"
          />
          <div className="flex flex-col">
            {isAuthenticated ? (
              <ProjectDropdown projectName={projectName} projectId={projectId} />
            ) : (
              <span className="font-medium text-sm text-zinc-200">Athrean</span>
            )}
            <div className="flex items-center gap-1.5">
              {generationMode === 'app' ? (
                <Layers className="w-3 h-3 text-teal-400 animate-pulse" />
              ) : (
                <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
              )}
              <p className="text-xs text-zinc-500 font-medium">
                {generationMode === 'app' ? 'Build Mode' : 'Design Mode'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onModeChange && (
            <ModeToggle
              mode={generationMode}
              onModeChange={onModeChange}
              disabled={isGenerating}
            />
          )}
          {isAuthenticated && onAddCheckpoint && messages.length > 0 && !isGenerating && (
            <AddCheckpointButton onClick={onAddCheckpoint} />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-zinc-500 hover:text-white rounded-full"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-none transition-all">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col justify-end min-h-full">
            <AnimatePresence mode="popLayout">
              {messages.map((message, i) => (
                <div key={i}>
                  <MessageBubble message={message} />
                  {onRestoreCheckpoint && getCheckpointForMessage(i) && (
                    <CheckpointDivider
                      checkpoint={getCheckpointForMessage(i)!}
                      onRestore={onRestoreCheckpoint}
                    />
                  )}
                </div>
              ))}
            </AnimatePresence>

            {/* Chain of Thought - beautiful collapsible display */}
            {currentReasoning.length > 0 && (
              <ChainOfThought steps={currentReasoning} isComplete={!isGenerating} />
            )}

            {/* Tool Progress - file operations in Build Mode */}
            {generationMode === 'app' && toolCalls.length > 0 && (
              <ToolProgress toolCalls={toolCalls} isStreaming={isGenerating} />
            )}

            {isGenerating && messages[messages.length - 1]?.role === 'user' && toolCalls.length === 0 && (
              <TypingIndicator />
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSubmit={onSubmit} isGenerating={isGenerating} contextUsage={contextUsage} />
    </div>
  )
}
