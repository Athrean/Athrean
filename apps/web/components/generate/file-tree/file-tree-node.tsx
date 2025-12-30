'use client'

/**
 * File Tree Node Component
 *
 * Recursive component for rendering file/folder nodes.
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FileIcon } from './file-icon'
import type { FileTreeNode as FileTreeNodeType } from '@/types/project'

interface FileTreeNodeProps {
  node: FileTreeNodeType
  level: number
  activeFilePath: string | null
  onSelectFile: (path: string) => void
  onDeleteFile?: (path: string) => void
  showDelete?: boolean
}

export function FileTreeNode({
  node,
  level,
  activeFilePath,
  onSelectFile,
  onDeleteFile,
  showDelete = false,
}: FileTreeNodeProps): React.ReactElement | null {
  const [isExpanded, setIsExpanded] = useState(node.isExpanded ?? true)
  const [isHovered, setIsHovered] = useState(false)

  const isDirectory = node.type === 'directory'
  const isActive = !isDirectory && node.path === activeFilePath
  const hasChildren = isDirectory && node.children && node.children.length > 0

  const handleClick = useCallback(() => {
    if (isDirectory) {
      setIsExpanded((prev) => !prev)
    } else {
      onSelectFile(node.path)
    }
  }, [isDirectory, node.path, onSelectFile])

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onDeleteFile && !isDirectory) {
        onDeleteFile(node.path)
      }
    },
    [isDirectory, node.path, onDeleteFile]
  )

  // Don't render root node itself, only its children
  if (level === 0 && node.name === 'root') {
    return (
      <>
        {node.children?.map((child) => (
          <FileTreeNode
            key={child.path}
            node={child}
            level={1}
            activeFilePath={activeFilePath}
            onSelectFile={onSelectFile}
            onDeleteFile={onDeleteFile}
            showDelete={showDelete}
          />
        ))}
      </>
    )
  }

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer',
          'transition-colors duration-150',
          isActive
            ? 'bg-teal-600/20 text-teal-400'
            : 'hover:bg-zinc-800 text-zinc-300',
          isHovered && showDelete && !isDirectory && 'pr-1'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Expand/Collapse arrow for directories */}
        {isDirectory ? (
          <motion.span
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="flex-shrink-0"
          >
            <ChevronRight className="w-3 h-3 text-zinc-500" />
          </motion.span>
        ) : (
          <span className="w-3" />
        )}

        {/* File/Folder icon */}
        <FileIcon
          name={node.name}
          isDirectory={isDirectory}
          isExpanded={isExpanded}
          className="w-4 h-4 flex-shrink-0"
        />

        {/* Name */}
        <span className="text-xs truncate flex-1">{node.name}</span>

        {/* Delete button (on hover) */}
        {showDelete && isHovered && !isDirectory && onDeleteFile && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-0.5 rounded hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
            title="Delete file"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Children (for directories) */}
      <AnimatePresence initial={false}>
        {isDirectory && isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {node.children?.map((child) => (
              <FileTreeNode
                key={child.path}
                node={child}
                level={level + 1}
                activeFilePath={activeFilePath}
                onSelectFile={onSelectFile}
                onDeleteFile={onDeleteFile}
                showDelete={showDelete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
