'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Loader2, Search, Image, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChainOfThoughtProps, ReasoningStep } from '@/types/reasoning'

interface StepIconProps {
  status: ReasoningStep['status']
  title: string
}

function StepIcon({ status, title }: StepIconProps): React.ReactElement {
  const lowerTitle = title.toLowerCase()

  // Determine icon based on step title
  const getIcon = (): React.ReactElement => {
    if (lowerTitle.includes('search') || lowerTitle.includes('finding')) {
      return <Search className="w-3.5 h-3.5" />
    }
    if (lowerTitle.includes('image') || lowerTitle.includes('visual')) {
      return <Image className="w-3.5 h-3.5" />
    }
    if (lowerTitle.includes('think') || lowerTitle.includes('analyz')) {
      return <Lightbulb className="w-3.5 h-3.5" />
    }

    // Default icons based on status
    if (status === 'completed') {
      return <CheckCircle2 className="w-3.5 h-3.5" />
    }
    if (status === 'thinking') {
      return <Loader2 className="w-3.5 h-3.5 animate-spin" />
    }
    return <Circle className="w-3.5 h-3.5" />
  }

  const colorClass = {
    pending: 'text-zinc-600',
    thinking: 'text-indigo-400',
    completed: 'text-emerald-400',
  } satisfies Record<ReasoningStep['status'], string>

  return <span className={colorClass[status]}>{getIcon()}</span>
}

interface StepCardProps {
  step: ReasoningStep
  index: number
  total: number
}

function StepCard({ step, index, total }: StepCardProps): React.ReactElement {
  const statusStyles = {
    pending: 'border-zinc-800 bg-zinc-900/30',
    thinking: 'border-indigo-500/30 bg-indigo-500/5',
    completed: 'border-emerald-500/20 bg-emerald-500/5',
  } satisfies Record<ReasoningStep['status'], string>

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn('rounded-lg border p-3', statusStyles[step.status])}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <StepIcon status={step.status} title={step.title} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-zinc-300">{step.title}</span>
            <span className="text-xs text-zinc-600">
              {index + 1}/{total}
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
            {step.content}
          </p>
          {step.durationMs !== undefined && step.status === 'completed' && (
            <span className="text-xs text-zinc-600 mt-1 inline-block">
              {step.durationMs}ms
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface ProgressBarProps {
  completed: number
  total: number
  isStreaming: boolean
}

function ProgressBar({ completed, total, isStreaming }: ProgressBarProps): React.ReactElement {
  const percent = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-zinc-500">Progress</span>
        <span className="text-xs text-zinc-400">
          {completed}/{total} steps
        </span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.3 }}
          className={cn(
            'h-full rounded-full',
            isStreaming ? 'bg-indigo-500' : 'bg-emerald-500'
          )}
        />
      </div>
    </div>
  )
}

export function ChainOfThought({
  steps,
  isStreaming,
  showProgress = true,
}: ChainOfThoughtProps): React.ReactElement {
  if (steps.length === 0) return <></>

  const completedCount = steps.filter((s) => s.status === 'completed').length

  return (
    <div className="space-y-3">
      {showProgress && (
        <ProgressBar
          completed={completedCount}
          total={steps.length}
          isStreaming={isStreaming}
        />
      )}

      <div className="space-y-2">
        {steps.map((step, index) => (
          <StepCard key={step.id} step={step} index={index} total={steps.length} />
        ))}
      </div>
    </div>
  )
}
