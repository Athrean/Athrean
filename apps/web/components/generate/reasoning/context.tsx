'use client'

import { motion } from 'framer-motion'
import type { ContextProps, ContextUsage } from '@/types/reasoning'

interface ContextWheelProps {
  usage: ContextUsage
  size?: number
}

function ContextWheel({ usage, size = 32 }: ContextWheelProps): React.ReactElement {
  const strokeWidth = 2.5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percent = Math.min(usage.usagePercent, 100)
  const offset = circumference - (percent / 100) * circumference

  const getColor = (): string => {
    if (percent > 80) return '#ef4444'
    if (percent > 60) return '#f59e0b'
    return '#a78bfa'
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[8px] font-medium text-zinc-500">
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  )
}

export function Context({ usage }: ContextProps): React.ReactElement {
  if (!usage) return <></>

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
      <ContextWheel usage={usage} size={32} />
      <span className="text-[11px] text-zinc-600">
        {usage.totalTokens.toLocaleString()} tokens
      </span>
    </motion.div>
  )
}

export function ContextInline({ tokens, cost }: { tokens: number; cost?: number }): React.ReactElement {
  return (
    <span className="text-[11px] text-zinc-600">
      {tokens.toLocaleString()} tokens
      {cost !== undefined && ` · $${cost < 0.01 ? '<0.01' : cost.toFixed(3)}`}
    </span>
  )
}

export function ContextWheelInline({ usage }: { usage: ContextUsage | null }): React.ReactElement {
  if (!usage) return <></>
  return <ContextWheel usage={usage} size={24} />
}

export function ContextFull({ usage }: { usage: ContextUsage | null }): React.ReactElement {
  if (!usage) return <></>
  return <Context usage={usage} />
}
