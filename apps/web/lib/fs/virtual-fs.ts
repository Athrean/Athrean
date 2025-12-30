/**
 * Virtual File System using ZenFS
 *
 * Provides a browser-based filesystem backed by IndexedDB.
 * Each project gets its own isolated filesystem namespace.
 */

import { configure, fs } from '@zenfs/core'
import { IndexedDB } from '@zenfs/dom'

// ============================================================================
// TYPES
// ============================================================================

interface FileSystemInstance {
  fs: typeof fs
  projectId: string
}

// ============================================================================
// STATE
// ============================================================================

let currentInstance: FileSystemInstance | null = null
let isConfiguring = false
const configurationQueue: Array<{
  projectId: string
  resolve: (instance: FileSystemInstance) => void
  reject: (error: Error) => void
}> = []

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the virtual filesystem for a specific project.
 * Uses IndexedDB as the storage backend.
 */
export async function initializeFileSystem(
  projectId: string
): Promise<FileSystemInstance> {
  // Return existing instance if same project
  if (currentInstance?.projectId === projectId) {
    return currentInstance
  }

  // Queue if already configuring
  if (isConfiguring) {
    return new Promise((resolve, reject) => {
      configurationQueue.push({ projectId, resolve, reject })
    })
  }

  isConfiguring = true

  try {
    // Configure ZenFS with IndexedDB backend
    await configure({
      mounts: {
        '/': {
          backend: IndexedDB,
          storeName: `athrean-project-${projectId}`,
        },
      },
    })

    currentInstance = { fs, projectId }

    // Ensure base directories exist
    await ensureDirectory('/src')
    await ensureDirectory('/src/app')
    await ensureDirectory('/src/components')
    await ensureDirectory('/src/lib')

    isConfiguring = false

    // Process queue
    while (configurationQueue.length > 0) {
      const queued = configurationQueue.shift()
      if (queued) {
        if (queued.projectId === projectId) {
          queued.resolve(currentInstance)
        } else {
          // Different project, re-initialize
          initializeFileSystem(queued.projectId)
            .then(queued.resolve)
            .catch(queued.reject)
        }
      }
    }

    return currentInstance
  } catch (error) {
    isConfiguring = false
    throw error
  }
}

// ============================================================================
// FILE OPERATIONS
// ============================================================================

/**
 * Read a file's content as string.
 */
export async function readFile(path: string): Promise<string> {
  ensureInitialized()
  const normalizedPath = normalizePath(path)

  try {
    const content = await fs.promises.readFile(normalizedPath, 'utf-8')
    return content as string
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      throw new FileNotFoundError(path)
    }
    throw error
  }
}

/**
 * Write content to a file. Creates parent directories if needed.
 */
export async function writeFile(path: string, content: string): Promise<void> {
  ensureInitialized()
  const normalizedPath = normalizePath(path)

  // Ensure parent directory exists
  const parentDir = getParentDirectory(normalizedPath)
  if (parentDir) {
    await ensureDirectory(parentDir)
  }

  await fs.promises.writeFile(normalizedPath, content, 'utf-8')
}

/**
 * Delete a file.
 */
export async function deleteFile(path: string): Promise<void> {
  ensureInitialized()
  const normalizedPath = normalizePath(path)

  try {
    await fs.promises.unlink(normalizedPath)
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      // File doesn't exist, that's fine
      return
    }
    throw error
  }
}

/**
 * Check if a file or directory exists.
 */
export async function exists(path: string): Promise<boolean> {
  ensureInitialized()
  const normalizedPath = normalizePath(path)

  try {
    await fs.promises.access(normalizedPath)
    return true
  } catch {
    return false
  }
}

/**
 * List files in a directory recursively.
 */
export async function listFiles(dir: string = '/'): Promise<string[]> {
  ensureInitialized()
  const normalizedDir = normalizePath(dir)
  const files: string[] = []

  async function traverse(currentPath: string): Promise<void> {
    try {
      const entries = await fs.promises.readdir(currentPath, {
        withFileTypes: true,
      })

      for (const entry of entries) {
        const fullPath = `${currentPath}/${entry.name}`.replace(/\/+/g, '/')

        if (entry.isDirectory()) {
          await traverse(fullPath)
        } else if (entry.isFile()) {
          // Return path relative to the root
          files.push(fullPath.startsWith('/') ? fullPath.slice(1) : fullPath)
        }
      }
    } catch (error) {
      if (isNodeError(error) && error.code === 'ENOENT') {
        // Directory doesn't exist
        return
      }
      throw error
    }
  }

  await traverse(normalizedDir)
  return files.sort()
}

/**
 * Get all files with their content.
 */
export async function getAllFiles(): Promise<Record<string, string>> {
  const filePaths = await listFiles('/')
  const files: Record<string, string> = {}

  for (const filePath of filePaths) {
    try {
      const content = await readFile(filePath)
      files[filePath] = content
    } catch {
      // Skip files that can't be read
    }
  }

  return files
}

/**
 * Clear all files in the project filesystem.
 */
export async function clearAllFiles(): Promise<void> {
  ensureInitialized()

  async function removeRecursive(path: string): Promise<void> {
    try {
      const entries = await fs.promises.readdir(path, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = `${path}/${entry.name}`.replace(/\/+/g, '/')

        if (entry.isDirectory()) {
          await removeRecursive(fullPath)
          await fs.promises.rmdir(fullPath)
        } else {
          await fs.promises.unlink(fullPath)
        }
      }
    } catch (error) {
      if (isNodeError(error) && error.code === 'ENOENT') {
        return
      }
      throw error
    }
  }

  await removeRecursive('/')
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function ensureInitialized(): void {
  if (!currentInstance) {
    throw new Error(
      'File system not initialized. Call initializeFileSystem first.'
    )
  }
}

function normalizePath(path: string): string {
  // Ensure path starts with /
  let normalized = path.startsWith('/') ? path : `/${path}`
  // Remove trailing slash except for root
  if (normalized !== '/' && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }
  // Collapse multiple slashes
  normalized = normalized.replace(/\/+/g, '/')
  return normalized
}

function getParentDirectory(path: string): string | null {
  const lastSlash = path.lastIndexOf('/')
  if (lastSlash <= 0) {
    return null
  }
  return path.slice(0, lastSlash)
}

async function ensureDirectory(path: string): Promise<void> {
  const normalized = normalizePath(path)

  try {
    await fs.promises.mkdir(normalized, { recursive: true })
  } catch (error) {
    if (isNodeError(error) && error.code === 'EEXIST') {
      // Directory already exists
      return
    }
    throw error
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error
}

// ============================================================================
// CUSTOM ERRORS
// ============================================================================

export class FileNotFoundError extends Error {
  constructor(path: string) {
    super(`File not found: ${path}`)
    this.name = 'FileNotFoundError'
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get file extension from path.
 */
export function getFileType(path: string): string {
  const lastDot = path.lastIndexOf('.')
  if (lastDot === -1 || lastDot === path.length - 1) {
    return ''
  }
  return path.slice(lastDot + 1).toLowerCase()
}

/**
 * Get filename from path.
 */
export function getFileName(path: string): string {
  const lastSlash = path.lastIndexOf('/')
  return lastSlash === -1 ? path : path.slice(lastSlash + 1)
}

/**
 * Check if the filesystem is initialized.
 */
export function isInitialized(): boolean {
  return currentInstance !== null
}

/**
 * Get current project ID.
 */
export function getCurrentProjectId(): string | null {
  return currentInstance?.projectId ?? null
}
