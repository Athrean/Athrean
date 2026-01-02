'use client'

/**
 * Tool Progress Component
 *
 * Displays real-time file operations as the AI creates/updates/deletes files.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { File, FilePlus, FileEdit, Trash2, Check, Loader2 } from 'lucide-react'
import type { FileToolCall } from '@/types/project'

interface ToolProgressProps {
  toolCalls: FileToolCall[]
  isStreaming: boolean
}

function getFileIcon(type: FileToolCall['type']): React.ReactNode {
  switch (type) {
    case 'createFile':
      return <FilePlus className="w-3.5 h-3.5 text-teal-400" />
    case 'updateFile':
      return <FileEdit className="w-3.5 h-3.5 text-amber-400" />
    case 'deleteFile':
      return <Trash2 className="w-3.5 h-3.5 text-red-400" />
    default:
      return <File className="w-3.5 h-3.5 text-zinc-400" />
  }
}

function getActionLabel(type: FileToolCall['type']): string {
  switch (type) {
    case 'createFile':
      return 'Created'
    case 'updateFile':
      return 'Updated'
    case 'deleteFile':
      return 'Deleted'
    default:
      return 'Modified'
  }
}

function getFileName(path: string): string {
  return path.split('/').pop() ?? path
}

export function ToolProgress({ toolCalls, isStreaming }: ToolProgressProps): React.ReactElement | null {
  if (toolCalls.length === 0) return null

  // Get the last few tool calls for display
  const recentCalls = toolCalls.slice(-10)
  const lastCall = toolCalls[toolCalls.length - 1]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-zinc-800/50 p-3 mb-3"
    >
      <div className="flex items-center gap-2 mb-2">
        {isStreaming ? (
          <Loader2 className="w-3.5 h-3.5 text-teal-400 animate-spin" />
        ) : (
          <Check className="w-3.5 h-3.5 text-green-400" />
        )}
        <span className="text-xs font-medium text-zinc-300">
          {isStreaming ? 'Generating files...' : `${toolCalls.length} file${toolCalls.length === 1 ? '' : 's'} created`}
        </span>
      </div>

      <div className="space-y-1 max-h-[200px] overflow-y-auto scrollbar-none">
        <AnimatePresence mode="popLayout">
          {recentCalls.map((call, index) => {
            const isLast = index === recentCalls.length - 1
            const path = 'path' in call.args ? call.args.path : ''

            return (
              <motion.div
                key={`${call.type}-${path}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isLast && isStreaming ? 1 : 0.8, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 py-0.5"
              >
                {getFileIcon(call.type)}
                <span className="text-xs text-zinc-400 font-mono truncate flex-1">
                  {path}
                </span>
                {isLast && isStreaming ? (
                  <Loader2 className="w-3 h-3 text-zinc-500 animate-spin" />
                ) : (
                  <span className="text-[10px] text-zinc-600">{getActionLabel(call.type)}</span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {toolCalls.length > 10 && (
        <div className="mt-2 pt-2 border-t border-zinc-800/50">
          <span className="text-[10px] text-zinc-500">
            +{toolCalls.length - 10} more files
          </span>
        </div>
      )}
    </motion.div>
  )
}

/**
 * Compact version for inline display
 */
export function ToolProgressInline({ toolCalls, isStreaming }: ToolProgressProps): React.ReactElement | null {
  if (toolCalls.length === 0) return null

  const lastCall = toolCalls[toolCalls.length - 1]
  if (!lastCall) return null

  const path = 'path' in lastCall.args ? lastCall.args.path : ''

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-xs text-zinc-400"
    >
      {isStreaming ? (
        <Loader2 className="w-3 h-3 animate-spin text-teal-400" />
      ) : (
        <Check className="w-3 h-3 text-green-400" />
      )}
      <span className="font-mono">{getFileName(path)}</span>
      <span className="text-zinc-600">({toolCalls.length} files)</span>
    </motion.div>
  )
}
