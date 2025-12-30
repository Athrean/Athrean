'use client'

/**
 * File Icon Component
 *
 * Renders appropriate icon based on file type.
 */

import {
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Image,
  Settings,
} from 'lucide-react'
import { getFileIconName } from './utils'

interface FileIconProps {
  name: string
  isDirectory: boolean
  isExpanded?: boolean
  className?: string
}

export function FileIcon({
  name,
  isDirectory,
  isExpanded = false,
  className = 'w-4 h-4',
}: FileIconProps): React.ReactElement {
  if (isDirectory) {
    return isExpanded ? (
      <FolderOpen className={`${className} text-amber-500`} />
    ) : (
      <Folder className={`${className} text-amber-500`} />
    )
  }

  const iconType = getFileIconName(name)

  switch (iconType) {
    case 'typescript':
      return <FileCode className={`${className} text-blue-400`} />

    case 'react':
      return <FileCode className={`${className} text-cyan-400`} />

    case 'javascript':
      return <FileCode className={`${className} text-yellow-400`} />

    case 'css':
    case 'sass':
    case 'less':
      return <FileCode className={`${className} text-pink-400`} />

    case 'tailwind':
      return <FileCode className={`${className} text-teal-400`} />

    case 'json':
    case 'npm':
      return <FileJson className={`${className} text-yellow-500`} />

    case 'html':
      return <FileCode className={`${className} text-orange-400`} />

    case 'markdown':
      return <FileText className={`${className} text-zinc-400`} />

    case 'image':
    case 'svg':
      return <Image className={`${className} text-purple-400`} />

    case 'nextjs':
    case 'env':
    case 'eslint':
    case 'prettier':
      return <Settings className={`${className} text-zinc-400`} />

    default:
      return <File className={`${className} text-zinc-500`} />
  }
}
