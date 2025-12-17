'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGenerateStore } from '@/stores/generate-store'
import { cn } from '@/lib/utils'

interface PromptInputProps {
  placeholder?: string
  className?: string
}

export function PromptInput({ 
  placeholder = 'Describe your component...',
  className 
}: PromptInputProps): React.ReactElement {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const { setPendingPrompt } = useGenerateStore()

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (!input.trim()) return

    setPendingPrompt(input.trim())
    router.push('/generate')
  }

  const suggestions = [
    'A gradient button with hover glow',
    'A glassmorphism card component',
    'An animated pricing table',
  ]

  return (
    <div className={cn('w-full max-w-2xl', className)}>
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 2px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.15)'
              : '0 0 0 1px rgba(63, 63, 70, 1)',
          }}
          className="relative rounded-2xl bg-[#323333] overflow-hidden"
        >
          {/* Input */}
          <div className="flex items-center gap-3 p-4">
            <Sparkles className={cn(
              'w-5 h-5 shrink-0 transition-colors',
              isFocused ? 'text-indigo-400' : 'text-zinc-500'
            )} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-lg"
            />
            <Button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 rounded-xl gap-2"
            >
              <Zap className="w-4 h-4" />
              Generate
            </Button>
          </div>

          {/* Suggestions */}
          {!input && (
            <div className="px-4 pb-4 pt-1 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-2">Try these:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setInput(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </form>
    </div>
  )
}

