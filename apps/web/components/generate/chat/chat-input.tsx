'use client'

import { useRef, useState, type ChangeEvent, type KeyboardEvent, type FormEvent } from 'react'
import { ArrowUp, Paperclip, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ContextUsageIndicator } from '../context-usage'
import type { ContextUsage } from '@/types/reasoning'

interface ChatInputProps {
  onSubmit: (prompt: string) => void
  isGenerating: boolean
  contextUsage?: ContextUsage | null
}

function ToolbarButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50"
    >
      {children}
    </button>
  )
}

export function ChatInput({
  onSubmit,
  isGenerating,
  contextUsage,
}: ChatInputProps): React.ReactElement {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    onSubmit(input.trim())
    setInput('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value)
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  return (
    <div className="shrink-0 p-4 pt-2">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative rounded-[20px] bg-zinc-950 overflow-hidden transition-all duration-200 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]",
          isFocused
            ? "ring-1 ring-zinc-600"
            : "ring-1 ring-zinc-700/50"
        )}
      >
        {/* Textarea */}
        <div className="px-5 pt-4 pb-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Describe changes..."
            disabled={isGenerating}
            rows={1}
            className="w-full bg-transparent text-zinc-200 text-base placeholder-zinc-500 focus:outline-none resize-none min-h-[28px] max-h-[120px] disabled:opacity-50"
          />
        </div>

        {/* Toolbar - Add, Attach, Context Usage, Send */}
        <div className="flex items-center justify-between px-3 pb-3">
          {/* Left toolbar */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton>
              <Plus className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton>
              <Paperclip className="w-4 h-4" />
              <span>Attach</span>
            </ToolbarButton>
          </div>

          {/* Right - Context usage + send */}
          <div className="flex items-center gap-2">
            {contextUsage && (
              <ContextUsageIndicator usage={contextUsage} />
            )}
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-all",
                input.trim() && !isGenerating
                  ? "bg-zinc-100 text-zinc-900 hover:bg-white"
                  : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
              )}
            >
              <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </form>
      <p className="text-[10px] text-zinc-600 text-center mt-3">
        Athrean can make mistakes. Review generated code.
      </p>
    </div>
  )
}

