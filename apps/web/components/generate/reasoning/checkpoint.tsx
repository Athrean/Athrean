'use client'

import { motion } from 'framer-motion'
import { Flag, RotateCcw, Clock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { CheckpointProps, CheckpointListProps, Checkpoint } from '@/types/reasoning'

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return new Date(timestamp).toLocaleDateString()
}

export function CheckpointMarker({
  checkpoint,
  onRestore,
  isCurrent,
}: CheckpointProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-lg border',
        isCurrent
          ? 'border-indigo-500/30 bg-indigo-500/10'
          : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50'
      )}
    >
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center',
          isCurrent ? 'bg-indigo-500/20' : 'bg-zinc-800'
        )}
      >
        {isCurrent ? (
          <Check className="w-3 h-3 text-indigo-400" />
        ) : (
          <Flag className="w-3 h-3 text-zinc-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-300 truncate">{checkpoint.label}</p>
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <Clock className="w-3 h-3" />
          <span>{formatTimeAgo(checkpoint.timestamp)}</span>
          <span>•</span>
          <span>Message {checkpoint.messageIndex + 1}</span>
        </div>
      </div>

      {!isCurrent && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRestore(checkpoint)}
          className="h-7 px-2 text-xs text-zinc-400 hover:text-white"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Restore
        </Button>
      )}
    </motion.div>
  )
}

export function CheckpointList({
  checkpoints,
  currentIndex,
  onRestore,
}: CheckpointListProps): React.ReactElement {
  if (checkpoints.length === 0) return <></>

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Flag className="w-4 h-4 text-zinc-500" />
        <span className="text-sm font-medium text-zinc-300">Checkpoints</span>
        <span className="text-xs text-zinc-600">({checkpoints.length})</span>
      </div>

      <div className="space-y-2">
        {checkpoints.map((checkpoint) => (
          <CheckpointMarker
            key={checkpoint.id}
            checkpoint={checkpoint}
            onRestore={onRestore}
            isCurrent={checkpoint.messageIndex === currentIndex}
          />
        ))}
      </div>
    </div>
  )
}

// Inline checkpoint button to add during conversation
interface AddCheckpointButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function AddCheckpointButton({
  onClick,
  disabled = false,
}: AddCheckpointButtonProps): React.ReactElement {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="h-7 px-2 text-xs text-zinc-500 hover:text-zinc-300"
    >
      <Flag className="w-3 h-3 mr-1" />
      Save checkpoint
    </Button>
  )
}

// Simple checkpoint divider in chat
interface CheckpointDividerProps {
  checkpoint: Checkpoint
  onRestore: (checkpoint: Checkpoint) => void
}

export function CheckpointDivider({
  checkpoint,
  onRestore,
}: CheckpointDividerProps): React.ReactElement {
  return (
    <div className="flex items-center gap-3 py-2 my-2">
      <div className="flex-1 h-px bg-zinc-800" />
      <button
        type="button"
        onClick={() => onRestore(checkpoint)}
        className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
      >
        <Flag className="w-3 h-3" />
        <span>{checkpoint.label}</span>
      </button>
      <div className="flex-1 h-px bg-zinc-800" />
    </div>
  )
}
