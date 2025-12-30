/**
 * File Tree Utilities
 *
 * Helper functions for building and manipulating file tree structures.
 */

import type { FileTreeNode } from '@/types/project'

/**
 * Build a tree structure from flat file paths.
 */
export function buildFileTree(paths: string[]): FileTreeNode {
  const root: FileTreeNode = {
    name: 'root',
    path: '',
    type: 'directory',
    children: [],
    isExpanded: true,
  }

  for (const filePath of paths) {
    const parts = filePath.split('/').filter(Boolean)
    let currentNode = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (!part) continue

      const isFile = i === parts.length - 1
      const currentPath = parts.slice(0, i + 1).join('/')

      // Find existing child or create new one
      let child = currentNode.children?.find((c) => c.name === part)

      if (!child) {
        child = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'directory',
          children: isFile ? undefined : [],
          isExpanded: true,
        }
        currentNode.children = currentNode.children ?? []
        currentNode.children.push(child)
      }

      if (!isFile) {
        currentNode = child
      }
    }
  }

  // Sort children: directories first, then files, alphabetically
  sortTree(root)

  return root
}

/**
 * Sort tree nodes: directories first, then files, alphabetically.
 */
function sortTree(node: FileTreeNode): void {
  if (!node.children) return

  node.children.sort((a, b) => {
    // Directories before files
    if (a.type === 'directory' && b.type === 'file') return -1
    if (a.type === 'file' && b.type === 'directory') return 1
    // Alphabetical within same type
    return a.name.localeCompare(b.name)
  })

  // Recursively sort children
  for (const child of node.children) {
    sortTree(child)
  }
}

/**
 * Get file extension from filename.
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1 || lastDot === filename.length - 1) {
    return ''
  }
  return filename.slice(lastDot + 1).toLowerCase()
}

/**
 * Get icon name based on file extension.
 */
export function getFileIconName(filename: string): string {
  const ext = getFileExtension(filename)

  const iconMap: Record<string, string> = {
    // TypeScript/JavaScript
    ts: 'typescript',
    tsx: 'react',
    js: 'javascript',
    jsx: 'react',

    // Styles
    css: 'css',
    scss: 'sass',
    sass: 'sass',
    less: 'less',

    // Config
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',

    // Markup
    html: 'html',
    md: 'markdown',
    mdx: 'markdown',

    // Images
    svg: 'svg',
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    gif: 'image',
    webp: 'image',

    // Other
    env: 'env',
    gitignore: 'git',
  }

  // Handle special filenames
  const lowerName = filename.toLowerCase()
  if (lowerName === 'package.json') return 'npm'
  if (lowerName === 'tsconfig.json') return 'typescript'
  if (lowerName === 'tailwind.config.ts' || lowerName === 'tailwind.config.js')
    return 'tailwind'
  if (lowerName === 'next.config.ts' || lowerName === 'next.config.js')
    return 'nextjs'
  if (lowerName.includes('eslint')) return 'eslint'
  if (lowerName.includes('prettier')) return 'prettier'

  return iconMap[ext] ?? 'file'
}

/**
 * Flatten tree to array of paths.
 */
export function flattenTree(node: FileTreeNode): string[] {
  const paths: string[] = []

  function traverse(n: FileTreeNode): void {
    if (n.type === 'file') {
      paths.push(n.path)
    }
    if (n.children) {
      for (const child of n.children) {
        traverse(child)
      }
    }
  }

  traverse(node)
  return paths.sort()
}

/**
 * Count files in tree.
 */
export function countFiles(node: FileTreeNode): number {
  let count = 0

  function traverse(n: FileTreeNode): void {
    if (n.type === 'file') {
      count++
    }
    if (n.children) {
      for (const child of n.children) {
        traverse(child)
      }
    }
  }

  traverse(node)
  return count
}

/**
 * Find node by path.
 */
export function findNode(
  root: FileTreeNode,
  path: string
): FileTreeNode | null {
  if (root.path === path) return root

  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, path)
      if (found) return found
    }
  }

  return null
}
