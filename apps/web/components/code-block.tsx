'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ 
  code, 
  language = 'tsx', 
  className,
  showLineNumbers = false 
}: CodeBlockProps): React.ReactElement {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <div className={cn('relative group rounded-xl bg-zinc-950 border border-zinc-800 min-w-0', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <span className="text-xs text-zinc-500 uppercase tracking-wider">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-8 w-8 text-zinc-400 hover:text-white"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto min-w-0 w-full">
        <pre className="p-4 text-sm leading-relaxed m-0 min-w-0 w-full">
          <code className="text-zinc-300 block min-w-0 w-full">
            {showLineNumbers ? (
              lines.map((line, i) => (
                <div key={i} className="flex min-w-0 w-full">
                  <span className="select-none text-zinc-600 w-8 shrink-0 text-right pr-4 flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 overflow-x-auto block">{line}</span>
                </div>
              ))
            ) : (
              <span className="block min-w-0 w-full overflow-x-auto">{code}</span>
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}

