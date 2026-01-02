'use client'

/**
 * File System Provider
 *
 * React context that provides virtual filesystem access to components.
 * Manages ZenFS initialization and provides file operations.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import {
  initializeFileSystem,
  readFile,
  writeFile,
  deleteFile,
  listFiles,
  exists,
  getAllFiles,
  clearAllFiles,
  isInitialized,
  getCurrentProjectId,
} from './virtual-fs'
import type { FileSystemContext } from '@/types/project'

// ============================================================================
// CONTEXT
// ============================================================================

const FileSystemContext = createContext<FileSystemContext | null>(null)

// ============================================================================
// PROVIDER
// ============================================================================

interface FileSystemProviderProps {
  projectId: string
  children: ReactNode
}

export function FileSystemProvider({
  projectId,
  children,
}: FileSystemProviderProps): React.ReactElement {
  const [isReady, setIsReady] = useState(false)
  const [files, setFiles] = useState<Map<string, string>>(new Map())
  const [error, setError] = useState<Error | null>(null)

  // Initialize filesystem when projectId changes
  useEffect(() => {
    let mounted = true

    async function init(): Promise<void> {
      try {
        setIsReady(false)
        setError(null)

        await initializeFileSystem(projectId)

        if (!mounted) return

        // Load initial file list
        const allFiles = await getAllFiles()
        setFiles(new Map(Object.entries(allFiles)))
        setIsReady(true)
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err : new Error('Failed to initialize'))
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [projectId])

  // File operations with state sync
  const handleReadFile = useCallback(async (path: string): Promise<string> => {
    return readFile(path)
  }, [])

  const handleWriteFile = useCallback(
    async (path: string, content: string): Promise<void> => {
      await writeFile(path, content)
      setFiles((prev) => {
        const next = new Map(prev)
        next.set(path.startsWith('/') ? path.slice(1) : path, content)
        return next
      })
    },
    []
  )

  const handleDeleteFile = useCallback(async (path: string): Promise<void> => {
    await deleteFile(path)
    setFiles((prev) => {
      const next = new Map(prev)
      next.delete(path.startsWith('/') ? path.slice(1) : path)
      return next
    })
  }, [])

  const handleListFiles = useCallback(
    async (dir?: string): Promise<string[]> => {
      return listFiles(dir)
    },
    []
  )

  const handleExists = useCallback(async (path: string): Promise<boolean> => {
    return exists(path)
  }, [])

  const handleGetAllFiles = useCallback(async (): Promise<
    Record<string, string>
  > => {
    const allFiles = await getAllFiles()
    setFiles(new Map(Object.entries(allFiles)))
    return allFiles
  }, [])

  const contextValue = useMemo<FileSystemContext>(
    () => ({
      isInitialized: isReady,
      projectId: isReady ? projectId : null,
      files,
      readFile: handleReadFile,
      writeFile: handleWriteFile,
      deleteFile: handleDeleteFile,
      listFiles: handleListFiles,
      exists: handleExists,
      getAllFiles: handleGetAllFiles,
    }),
    [
      isReady,
      projectId,
      files,
      handleReadFile,
      handleWriteFile,
      handleDeleteFile,
      handleListFiles,
      handleExists,
      handleGetAllFiles,
    ]
  )

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p>Failed to initialize filesystem: {error.message}</p>
      </div>
    )
  }

  return (
    <FileSystemContext.Provider value={contextValue}>
      {children}
    </FileSystemContext.Provider>
  )
}

// ============================================================================
// HOOK
// ============================================================================

export function useFileSystem(): FileSystemContext {
  const context = useContext(FileSystemContext)

  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider')
  }

  return context
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to get the current file count.
 */
export function useFileCount(): number {
  const { files } = useFileSystem()
  return files.size
}

/**
 * Hook to check if filesystem is ready.
 */
export function useFileSystemReady(): boolean {
  const { isInitialized } = useFileSystem()
  return isInitialized
}

/**
 * Hook to get a specific file's content.
 */
export function useFile(path: string): {
  content: string | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const { readFile, isInitialized } = useFileSystem()
  const [content, setContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchFile = useCallback(async () => {
    if (!isInitialized) return

    setIsLoading(true)
    setError(null)

    try {
      const fileContent = await readFile(path)
      setContent(fileContent)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to read file'))
      setContent(null)
    } finally {
      setIsLoading(false)
    }
  }, [path, readFile, isInitialized])

  useEffect(() => {
    fetchFile()
  }, [fetchFile])

  return { content, isLoading, error, refetch: fetchFile }
}
