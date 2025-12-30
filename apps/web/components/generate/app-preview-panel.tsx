'use client'

/**
 * App Preview Panel Component
 *
 * Extended preview panel for Build Mode with file tree and multi-file preview.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Tab, Device } from './preview/types'
import { PreviewHeader } from './preview/preview-header'
import { SandpackWrapper, buildAppFiles } from './preview/sandpack-wrapper'
import {
  LoadingOverlay,
  UpdatingOverlay,
  SlowWarningOverlay,
} from './preview/preview-overlays'
import { PreviewEmptyState } from './preview/preview-empty-state'
import { FileTree } from './file-tree'
import { DownloadZip } from './download-zip'
import { useFileSystem } from '@/lib/fs/fs-provider'
import { useGenerateStore } from '@/stores/generate-store'

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
  const [showSlowWarning, setShowSlowWarning] = useState(false)

  const { files, isInitialized, getAllFiles } = useFileSystem()
  const { activeFilePath, setActiveFile, fileCount } = useGenerateStore()

  // Build Sandpack files from ZenFS
  const sandpackFiles = useMemo(() => {
    if (files.size === 0) return null
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
    setShowSlowWarning(false)
    const timer = setTimeout(() => setShowSlowWarning(true), 15000) // Longer timeout for multi-file
    return () => clearTimeout(timer)
  }, [sandpackFiles, instanceKey])

  useEffect(() => {
    if (isReady) setShowSlowWarning(false)
  }, [isReady])

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

  const handleSelectFile = useCallback(
    (path: string): void => {
      setActiveFile(path)
      setActiveTab('code')
    },
    [setActiveFile]
  )

  const isEmpty = files.size === 0

  if (isEmpty && !isLoading) {
    return (
      <div className="flex h-full">
        <FileTree
          files={files}
          activeFilePath={activeFilePath}
          onSelectFile={handleSelectFile}
          onRefresh={handleRefresh}
          className="w-56 flex-shrink-0"
        />
        <div className="flex-1">
          <PreviewEmptyState
            activeTab={activeTab}
            device={device}
            onTabChange={setActiveTab}
            onDeviceChange={setDevice}
            onRestart={handleRestart}
            message="Start chatting to generate your app..."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-zinc-950">
      {/* File Tree Sidebar */}
      <FileTree
        files={files}
        activeFilePath={activeFilePath}
        onSelectFile={handleSelectFile}
        onRefresh={handleRefresh}
        showDelete
        className="w-56 flex-shrink-0"
      />

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppPreviewHeader
          activeTab={activeTab}
          device={device}
          onTabChange={setActiveTab}
          onDeviceChange={setDevice}
          onRestart={handleRestart}
          files={files}
          projectName={projectName}
          activeFilePath={activeFilePath}
        />

        <div className="flex-1 min-h-0 relative bg-zinc-950 p-4 pt-2">
          <div className="w-full h-full bg-zinc-950 rounded-xl overflow-hidden relative border border-zinc-800 shadow-2xl">
            {activeTab === 'preview' && sandpackFiles && (
              <SandpackWrapper
                files={sandpackFiles}
                instanceKey={instanceKey}
                device={device}
                onReady={handleReady}
                onReset={handleRestart}
              />
            )}

            {activeTab === 'code' && (
              <div className="h-full overflow-auto p-4 bg-zinc-900">
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
            )}

            {!isReady && activeTab === 'preview' && !showSlowWarning && files.size > 0 && (
              <LoadingOverlay />
            )}
            {isLoading && files.size > 0 && <UpdatingOverlay />}
            {!isReady && showSlowWarning && activeTab === 'preview' && (
              <SlowWarningOverlay onRestart={handleRestart} />
            )}
          </div>
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

// ============================================================================
// APP PREVIEW HEADER
// ============================================================================

interface AppPreviewHeaderProps {
  activeTab: Tab
  device: Device
  onTabChange: (tab: Tab) => void
  onDeviceChange: (device: Device) => void
  onRestart: () => void
  files: Map<string, string>
  projectName: string
  activeFilePath: string | null
}

function AppPreviewHeader({
  activeTab,
  device,
  onTabChange,
  onDeviceChange,
  onRestart,
  files,
  projectName,
  activeFilePath,
}: AppPreviewHeaderProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
      <div className="flex items-center gap-4">
        {/* Tab buttons */}
        <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onTabChange('preview')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'preview'
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => onTabChange('code')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'code'
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Code
          </button>
        </div>

        {/* Active file indicator in code view */}
        {activeTab === 'code' && activeFilePath && (
          <span className="text-xs text-zinc-500 truncate max-w-[200px]">
            {activeFilePath}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Download ZIP */}
        <DownloadZip
          files={files}
          projectName={projectName}
          variant="icon"
        />

        {/* Device selector (preview only) */}
        {activeTab === 'preview' && (
          <select
            value={device}
            onChange={(e) => onDeviceChange(e.target.value as Device)}
            className="px-2 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded text-zinc-300"
          >
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
        )}

        {/* Restart button */}
        <button
          type="button"
          onClick={onRestart}
          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          title="Restart preview"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
