'use client'

/**
 * Mode Toggle Component
 *
 * Toggle between Component mode and Build App mode for generation.
 */

import { motion } from 'framer-motion'
import { Puzzle, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GenerationMode } from '@/types/project'

interface ModeToggleProps {
  mode: GenerationMode
  onModeChange: (mode: GenerationMode) => void
  disabled?: boolean
  className?: string
}

export function ModeToggle({
  mode,
  onModeChange,
  disabled = false,
  className,
}: ModeToggleProps): React.ReactElement {
  return (
    <div
      className={cn(
        'flex items-center gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <ModeButton
        isActive={mode === 'component'}
        onClick={() => onModeChange('component')}
        icon={<Puzzle className="w-3.5 h-3.5" />}
        label="Component"
        activeColor="bg-violet-600"
        disabled={disabled}
      />
      <ModeButton
        isActive={mode === 'app'}
        onClick={() => onModeChange('app')}
        icon={<Layers className="w-3.5 h-3.5" />}
        label="Build App"
        activeColor="bg-teal-600"
        disabled={disabled}
      />
    </div>
  )
}

interface ModeButtonProps {
  isActive: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  activeColor: string
  disabled?: boolean
}

function ModeButton({
  isActive,
  onClick,
  icon,
  label,
  activeColor,
  disabled,
}: ModeButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md',
        'transition-colors duration-200',
        isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="mode-toggle-active"
          className={cn('absolute inset-0 rounded-md', activeColor)}
          initial={false}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 35,
          }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </button>
  )
}

// Compact version for smaller spaces
interface ModeToggleCompactProps {
  mode: GenerationMode
  onModeChange: (mode: GenerationMode) => void
  disabled?: boolean
  className?: string
}

export function ModeToggleCompact({
  mode,
  onModeChange,
  disabled = false,
  className,
}: ModeToggleCompactProps): React.ReactElement {
  return (
    <div
      className={cn(
        'flex items-center gap-0.5 p-0.5 bg-zinc-900/80 rounded-md border border-zinc-800',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onModeChange('component')}
        disabled={disabled}
        className={cn(
          'p-1.5 rounded transition-colors',
          mode === 'component'
            ? 'bg-violet-600 text-white'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
        )}
        title="Component Mode"
      >
        <Puzzle className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onModeChange('app')}
        disabled={disabled}
        className={cn(
          'p-1.5 rounded transition-colors',
          mode === 'app'
            ? 'bg-teal-600 text-white'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
        )}
        title="Build App Mode"
      >
        <Layers className="w-4 h-4" />
      </button>
    </div>
  )
}
