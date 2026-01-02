'use client'

/**
 * App Preview Panel Component
 *
 * Extended preview panel for Build Mode with file tree and multi-file preview.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Globe, Code2, RefreshCw, Save } from 'lucide-react'
import { toast } from 'sonner'
import type { Tab, Device } from './preview/types'
import { SandpackWrapper, buildAppFiles } from './preview/sandpack-wrapper'
import { PreviewEmptyState } from './preview/preview-empty-state'
import { previewCards } from './preview/constants'
import { FileTree } from './file-tree'
import { DownloadZip } from './download-zip'
import { useFileSystem } from '@/lib/fs/fs-provider'
import { useGenerateStore } from '@/stores/generate-store'
import { cn } from '@/lib/utils'
import { CardStack } from '@/components/ui/card-stack'
import { saveGeneration } from '@/app/actions/component'

interface AppPreviewPanelProps {
  isLoading: boolean
  projectName: string
}

export function AppPreviewPanel({
  isLoading,
  projectName,
}: AppPreviewPanelProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>('preview')
  const [device, setDevice] = useState<Device>('desktop')
  const [instanceKey, setInstanceKey] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { files, getAllFiles } = useFileSystem()
  const { activeFilePath, setActiveFile, setCurrentProjectId } = useGenerateStore()

  // Build Sandpack files from ZenFS
  const sandpackFiles = useMemo(() => {
    console.log('[AppPreviewPanel] files.size:', files.size)
    if (files.size === 0) return null
    console.log('[AppPreviewPanel] Building sandpack files from:', Array.from(files.keys()))
    return buildAppFiles(files)
  }, [files])

  // Get active file content for code view
  const activeFileContent = useMemo(() => {
    if (!activeFilePath) return null
    return files.get(activeFilePath) ?? null
  }, [files, activeFilePath])

  // Reset ready state when files change
  useEffect(() => {
    setIsReady(false)
  }, [sandpackFiles, instanceKey])

  const handleRestart = useCallback((): void => {
    setInstanceKey((k) => k + 1)
  }, [])

  const handleReady = useCallback((): void => {
    setIsReady(true)
  }, [])

  const handleRefresh = useCallback(async (): Promise<void> => {
    await getAllFiles()
    handleRestart()
  }, [getAllFiles, handleRestart])

  const handleSave = useCallback(async (): Promise<void> => {
    if (files.size === 0 || isSaving) return

    setIsSaving(true)
    try {
      // Convert Map to Record for storage
      const filesRecord: Record<string, string> = {}
      files.forEach((content, path) => {
        filesRecord[path] = content
      })

      const result = await saveGeneration({
        name: projectName || `Project ${new Date().toLocaleTimeString()}`,
        files: filesRecord,
        prompt: 'Build Mode project',
        isPublic: false,
      })

      if (result.error) {
        toast.error('Failed to save project')
      } else {
        toast.success('Project saved successfully')
        if (result.data?.id) {
          setCurrentProjectId(result.data.id)
        }
      }
    } catch {
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }, [files, isSaving, projectName, setCurrentProjectId])

  const isEmpty = files.size === 0

  // Empty state - show card stack without file tree (no files yet)
  if (isEmpty && !isLoading) {
    return (
      <PreviewEmptyState
        activeTab={activeTab}
        device={device}
        onTabChange={setActiveTab}
        onDeviceChange={setDevice}
        onRestart={handleRestart}
        message="Start chatting to generate your app..."
      />
    )
  }

  // Show loading overlay while generating or bundling
  // But always render Sandpack so it can bundle and call onReady
  const showLoadingOverlay = isLoading || !isReady

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden bg-zinc-950">
      {/* Header with tabs */}
      <AppPreviewHeader
        activeTab={activeTab}
        device={device}
        onTabChange={setActiveTab}
        onDeviceChange={setDevice}
        onRestart={handleRestart}
        onSave={handleSave}
        isSaving={isSaving}
        files={files}
        projectName={projectName}
        activeFilePath={activeFilePath}
      />

      {/* Content area */}
      <div className="flex-1 min-h-0 relative p-4 pt-2 bg-zinc-950">
        <div className="w-full h-full rounded-xl overflow-hidden relative border border-zinc-800 shadow-2xl bg-zinc-950">

          {/* Preview Tab - always render Sandpack, overlay loading state */}
          {activeTab === 'preview' && (
            <div className="relative h-full">
              {/* Always render Sandpack so it can bundle */}
              {sandpackFiles && (
                <SandpackWrapper
                  files={sandpackFiles}
                  instanceKey={instanceKey}
                  device={device}
                  onReady={handleReady}
                  onReset={handleRestart}
                />
              )}

              {/* Loading overlay */}
              {showLoadingOverlay && (
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10 bg-zinc-950/95">
                  <PreviewEmptyStateContent
                    message={isLoading ? "Generating preview..." : "Building preview..."}
                  />
                </div>
              )}
            </div>
          )}

          {/* Code Tab - file tree + code content (no overlays) */}
          {activeTab === 'code' && (
            <div className="flex h-full">
              {/* File Tree inside Code view */}
              <FileTree
                files={files}
                activeFilePath={activeFilePath}
                onSelectFile={(path) => setActiveFile(path)}
                onRefresh={handleRefresh}
                showDelete
                className="w-56 shrink-0 border-r border-zinc-800"
              />

              {/* Code content */}
              <div className="flex-1 h-full overflow-auto p-4 bg-zinc-900">
                {activeFileContent ? (
                  <>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-800">
                      <span className="text-xs text-zinc-500">{activeFilePath}</span>
                    </div>
                    <pre className="text-sm font-mono leading-relaxed text-zinc-300 whitespace-pre-wrap">
                      {activeFileContent}
                    </pre>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-500">
                    <p className="text-sm">Select a file to view its content</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .sp-wrapper, .sp-layout, .sp-preview-container, .sp-preview, .sp-preview-iframe, .sp-stack {
          height: 100% !important;
          background: transparent !important;
        }
        .sp-preview-iframe {
          border: none;
        }
      `}</style>
    </div>
  )
}

import { LoadingPill } from '@/components/generate/preview/loading-pill'

// Simple empty state content for inside the preview panel
function PreviewEmptyStateContent({ message }: { message: string }): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-6">
      <LoadingPill />
      <CardStack items={previewCards} />
    </div>
  )
}

// ============================================================================
// APP PREVIEW HEADER - Lovable-style icon tabs
// ============================================================================

interface AppPreviewHeaderProps {
  activeTab: Tab
  device: Device
  onTabChange: (tab: Tab) => void
  onDeviceChange: (device: Device) => void
  onRestart: () => void
  onSave: () => void
  isSaving: boolean
  files: Map<string, string>
  projectName: string
  activeFilePath: string | null
}

function AppPreviewHeader({
  activeTab,
  onTabChange,
  onRestart,
  onSave,
  isSaving,
  files,
  projectName,
}: AppPreviewHeaderProps): React.ReactElement {
  return (
    <div className="shrink-0 flex items-center justify-between h-12 px-4 bg-zinc-950">
      {/* Left: Tab Buttons - Lovable style pill buttons */}
      <div className="flex items-center gap-0.5 p-1 rounded-full border border-zinc-800 bg-zinc-900/50">
        {/* Preview Tab */}
        <button
          type="button"
          onClick={() => onTabChange('preview')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
            activeTab === 'preview'
              ? 'text-white bg-zinc-900'
              : 'text-zinc-500 hover:text-zinc-300'
          )}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        {/* Code/Files Tab */}
        <button
          type="button"
          onClick={() => onTabChange('code')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
            activeTab === 'code'
              ? 'text-white bg-zinc-900'
              : 'text-zinc-500 hover:text-zinc-300'
          )}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>
      </div>

      {/* Center: URL bar style indicator (optional, can be expanded later) */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50">
        <span className="text-xs text-zinc-500 font-mono">/</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-0.5">
        {/* Save button */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || files.size === 0}
          className={cn(
            'p-2 rounded-lg transition-colors',
            isSaving || files.size === 0
              ? 'text-zinc-600 cursor-not-allowed'
              : 'hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-300'
          )}
          title={isSaving ? 'Saving...' : 'Save project'}
        >
          <Save className={cn('w-4 h-4', isSaving && 'animate-pulse')} />
        </button>

        {/* Download ZIP */}
        <DownloadZip
          files={files}
          projectName={projectName}
          variant="icon"
        />

        {/* Restart button */}
        <button
          type="button"
          onClick={onRestart}
          className="p-2 rounded-lg hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-300 transition-colors"
          title="Restart preview"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
