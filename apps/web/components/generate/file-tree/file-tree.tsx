'use client'

/**
 * File Tree Component
 *
 * Displays project file structure with selection and actions.
 */

import { useMemo } from 'react'
import { FolderPlus, RefreshCw } from 'lucide-react'
import { FileTreeNode } from './file-tree-node'
import { buildFileTree, countFiles } from './utils'
import { cn } from '@/lib/utils'

interface FileTreeProps {
  files: Map<string, string> | Record<string, string>
  activeFilePath: string | null
  onSelectFile: (path: string) => void
  onDeleteFile?: (path: string) => void
  onRefresh?: () => void
  showDelete?: boolean
  className?: string
}

export function FileTree({
  files,
  activeFilePath,
  onSelectFile,
  onDeleteFile,
  onRefresh,
  showDelete = false,
  className,
}: FileTreeProps): React.ReactElement {
  // Convert Map to array of paths if needed
  const filePaths = useMemo(() => {
    if (files instanceof Map) {
      return Array.from(files.keys())
    }
    return Object.keys(files)
  }, [files])

  // Build tree structure
  const tree = useMemo(() => buildFileTree(filePaths), [filePaths])

  // Count files
  const fileCount = useMemo(() => countFiles(tree), [tree])

  const isEmpty = fileCount === 0

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-zinc-900/50 border-r border-zinc-800',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <FolderPlus className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Files
          </span>
          {fileCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-zinc-800 text-zinc-400 rounded">
              {fileCount}
            </span>
          )}
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Refresh files"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Tree content */}
      <div className="flex-1 overflow-y-auto py-2">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <FileTreeNode
            node={tree}
            level={0}
            activeFilePath={activeFilePath}
            onSelectFile={onSelectFile}
            onDeleteFile={onDeleteFile}
            showDelete={showDelete}
          />
        )}
      </div>
    </div>
  )
}

function EmptyState(): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
      <FolderPlus className="w-8 h-8 text-zinc-700 mb-2" />
      <p className="text-xs text-zinc-500">
        No files yet.
        <br />
        Start a conversation to generate your app.
      </p>
    </div>
  )
}

// Export everything from this module
export { FileTreeNode } from './file-tree-node'
export { FileIcon } from './file-icon'
export * from './utils'
