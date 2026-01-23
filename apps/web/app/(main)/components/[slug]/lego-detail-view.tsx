'use client'

import { useState } from 'react'
import { Check, Copy, Monitor, Tablet, Smartphone, Maximize2, Pencil, ExternalLink, Sun, Moon } from 'lucide-react'
import { ComponentPreview } from './component-preview'
import { CodeBlock } from '@/components/code-block'
import { trackInstall } from '@/lib/db/mutations'
import type { RegistryItem } from '@/lib/db/queries'

interface LegoDetailViewProps {
  item: RegistryItem
  code: string
}

type ViewMode = 'preview' | 'code'
type DeviceFrame = 'desktop' | 'tablet' | 'mobile'
type PreviewTheme = 'light' | 'dark'

const deviceWidths: Record<DeviceFrame, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
}

export function LegoDetailView({ item, code }: LegoDetailViewProps): React.ReactElement {
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>('desktop')
  const [commandCopied, setCommandCopied] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('light')

  const registryCommand = `npx shadcn@latest add https://athrean.com/r/${item.name}.json`

  const handleCopyCommand = async (): Promise<void> => {
    await navigator.clipboard.writeText(registryCommand)
    setCommandCopied(true)
    trackInstall(item.name).catch(() => { })
    setTimeout(() => setCommandCopied(false), 2000)
  }

  return (
    <div className="h-full w-full overflow-hidden">
      {/* Big Container with Header - fixed height matching sidebar */}
      <div className="bg-black px-6 py-4 h-full w-full flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="mb-3 shrink-0">
          <h1 className="text-2xl font-bold text-white mb-1">{item.title}</h1>
          <div className="flex items-center gap-1.5 text-sm text-zinc-500">
            <Pencil className="w-3.5 h-3.5" />
            <span className="font-mono">@athrean/{item.name}</span>
          </div>
        </div>

        {/* Smaller Container with Preview/Code */}
        <div className="flex-1 flex flex-col rounded-xl border border-zinc-800 bg-black overflow-hidden min-h-0">
          {/* Card Header */}
          <div className="flex items-center justify-between px-3 h-12 border-b border-zinc-800 bg-black shrink-0">
            {/* Left: Tabs */}
            <div className="flex items-center gap-4 h-full">
              <button
                onClick={() => setViewMode('preview')}
                className={`text-xs font-medium h-full border-b-2 transition-colors px-1 ${viewMode === 'preview'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                Preview
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`text-xs font-medium h-full border-b-2 transition-colors px-1 ${viewMode === 'code'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                Code
              </button>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              {viewMode === 'preview' && (
                <>
                  <div className="flex items-center bg-black rounded-md p-0.5 border border-zinc-800">
                    <button
                      onClick={() => setDeviceFrame('desktop')}
                      className={`p-1 rounded transition-colors ${deviceFrame === 'desktop'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      title="Desktop"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeviceFrame('tablet')}
                      className={`p-1 rounded transition-colors ${deviceFrame === 'tablet'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      title="Tablet"
                    >
                      <Tablet className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeviceFrame('mobile')}
                      className={`p-1 rounded transition-colors ${deviceFrame === 'mobile'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      title="Mobile"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Theme Toggle */}
                  <div className="flex items-center bg-black rounded-md p-0.5 border border-zinc-800">
                    <button
                      onClick={() => setPreviewTheme('light')}
                      className={`p-1 rounded transition-colors ${previewTheme === 'light'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      title="Light Mode"
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewTheme('dark')}
                      className={`p-1 rounded transition-colors ${previewTheme === 'dark'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      title="Dark Mode"
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="w-px h-3 bg-[#333333]" />
                </>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCommand}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black border border-zinc-800 text-[10px] font-mono text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                  title="Copy Install Command"
                >
                  <span className="truncate max-w-[120px]">{commandCopied ? 'Copied!' : 'npx shadcn add ...'}</span>
                  {commandCopied ? (
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                  ) : (
                    <Copy className="w-3 h-3 shrink-0" />
                  )}
                </button>
                <a
                  href={`/generate?base=${item.id}`}
                  className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md bg-white text-black hover:bg-zinc-200 transition-colors"
                >
                  <span className="hidden sm:inline">Open in AI</span>
                  <span className="sm:hidden">AI</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative bg-black overflow-auto min-h-0">
            {viewMode === 'preview' ? (
              <>
                {deviceFrame === 'desktop' && (
                  <div className="w-full h-full">
                    <ComponentPreview code={code} name={item.name} dependencies={item.dependencies} theme={previewTheme} />
                  </div>
                )}

                {deviceFrame === 'tablet' && (
                  <div className="flex items-center justify-center p-8 min-h-[600px]">
                    <div className="relative border-14 border-zinc-900 rounded-[32px] overflow-hidden bg-black shadow-2xl h-[600px] w-[768px] max-w-full shrink-0">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-1 bg-zinc-800 rounded-full mt-1.5 z-20" />
                      <div className="h-full w-full bg-white dark:bg-black">
                        <ComponentPreview code={code} name={item.name} dependencies={item.dependencies} theme={previewTheme} />
                      </div>
                    </div>
                  </div>
                )}

                {deviceFrame === 'mobile' && (
                  <div className="flex items-center justify-center p-8 min-h-[600px]">
                    <div className="relative border-14 border-zinc-900 rounded-[48px] overflow-visible bg-black shadow-2xl h-[700px] w-[360px] shrink-0">
                      {/* Dynamic Island - integrated with bezel */}
                      <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 h-[30px] w-[126px] bg-zinc-900 rounded-b-[20px] z-30 flex items-center justify-center">
                        <div className="w-20 h-[6px] bg-black rounded-full mt-2" />
                      </div>
                      <div className="h-full w-full bg-white dark:bg-black overflow-hidden rounded-[34px]">
                        <ComponentPreview code={code} name={item.name} dependencies={item.dependencies} theme={previewTheme} />
                      </div>
                      {/* Home indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-100/20 rounded-full z-20" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full w-full overflow-hidden flex flex-col">
                {/* Ensure CodeBlock takes full height and scrolls internally */}
                <div className="flex-1 overflow-auto w-full min-w-0">
                  <CodeBlock code={code} showLineNumbers className="border-0 rounded-none bg-transparent h-full w-full min-w-0" />
                </div>
              </div>
            )}
          </div>

          {/* Footer: Full Command */}
          <div className="border-t border-zinc-800 bg-black px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <code className="font-mono text-xs text-zinc-500">{registryCommand}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
