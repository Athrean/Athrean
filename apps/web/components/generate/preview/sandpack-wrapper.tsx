"use client"

import { useMemo } from "react"
import {
  SandpackProvider,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import type { Device } from "./types"
import { DEVICE_WIDTHS } from "./types"
import { PreviewErrorBoundary } from "./preview-error-boundary"

type BundlerListenerProps = {
  onReady: () => void
  onError: (error: string) => void
}

function BundlerListener({ onReady, onError }: BundlerListenerProps): null {
  const { listen } = useSandpack()

  useMemo(() => {
    const unsubscribe = listen((msg) => {
      if (msg.type === "done" || (msg.type === "status" && msg.status === "done")) {
        onReady()
      }
      if (msg.type === "action" && msg.action === "show-error") {
        onError(msg.message || "Preview error")
      }
    })
    return unsubscribe
  }, [listen, onReady, onError])

  return null
}

type SandpackInnerProps = {
  device: Device
  onReady: () => void
  onReset: () => void
}

function SandpackInner({ device, onReady, onReset }: SandpackInnerProps): React.ReactElement {
  const [error, setError] = useState<string | null>(null)

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <div className="text-center">
          <h3 className="text-sm font-medium text-zinc-200 mb-2">Preview Error</h3>
          <p className="text-xs text-zinc-400 max-w-md line-clamp-4">{error}</p>
        </div>
        <button
          onClick={() => { setError(null); onReset() }}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      <BundlerListener onReady={onReady} onError={setError} />
      <SandpackPreview
        showNavigator={false}
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        style={{
          height: "100%",
          width: device === "desktop" ? "100%" : DEVICE_WIDTHS[device],
          margin: device === "desktop" ? 0 : "0 auto",
          border: device !== "desktop" ? "1px solid #3f3f46" : "none",
          borderRadius: device !== "desktop" ? 8 : 0,
          background: "#09090b",
        }}
      />
    </>
  )
}

import { useState } from "react"

export function buildFiles(code: string): Record<string, string> {
  return {
    "/App.tsx": `import Generated from "./Generated"

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <Generated />
    </div>
  )
}`,
    "/Generated.tsx": code,
  }
}

export function buildAppFiles(
  projectFiles: Map<string, string> | Record<string, string>
): Record<string, string> {
  const files: Record<string, string> = {}
  const entries = projectFiles instanceof Map
    ? Array.from(projectFiles.entries())
    : Object.entries(projectFiles)

  for (const [path, content] of entries) {
    if (isConfigFile(path)) continue

    const sandpackPath = normalizePath(path)
    files[sandpackPath] = transformContent(content)
  }

  const pageFile = findPageFile(entries)
  if (pageFile) {
    files["/App.tsx"] = createAppEntry(pageFile[0])
  } else if (!files["/App.tsx"]) {
    files["/App.tsx"] = createEmptyApp()
  }

  if (!hasUtilsFile(entries)) {
    files["/lib/utils.ts"] = createUtilsFile()
  }

  return files
}

function isConfigFile(path: string): boolean {
  return (
    path.includes("tailwind.config") ||
    path.includes("next.config") ||
    path.includes("tsconfig") ||
    path.includes("package.json")
  )
}

function normalizePath(path: string): string {
  let normalized = path.startsWith("/") ? path : `/${path}`
  if (normalized.startsWith("/src/")) {
    normalized = normalized.replace("/src/", "/")
  }
  return normalized
}

function transformContent(content: string): string {
  return content
    .replace(/['"]use client['"];?\s*/g, "")
    .replace(/import\s+.*from\s+['"]next\/(?:image|link|navigation|font\/.*)['"]\s*;?\s*/g, "")
    .replace(/<Image\s/g, "<img ")
    .replace(/<\/Image>/g, "</img>")
    .replace(/<Link\s/g, "<a ")
    .replace(/<\/Link>/g, "</a>")
    .replace(/from\s+['"]@\/([^'"]+)['"]/g, (_, p) => `from "/${p}"`)
}

function findPageFile(entries: Array<[string, string]>): [string, string] | null {
  const priorities = [
    "src/app/page.tsx",
    "app/page.tsx",
    "src/pages/index.tsx",
    "pages/index.tsx",
  ]

  for (const priority of priorities) {
    const match = entries.find(([p]) => p === priority || p === `/${priority}`)
    if (match) return match
  }

  return entries.find(([p]) => p.endsWith(".tsx")) ?? null
}

function createAppEntry(pagePath: string): string {
  let importPath = pagePath.startsWith("/") ? pagePath : `/${pagePath}`
  if (importPath.startsWith("/src/")) {
    importPath = importPath.replace("/src/", "/")
  }
  importPath = importPath.replace(/\.tsx$/, "")

  return `import Page from ".${importPath}"

export default function App() {
  return <Page />
}`
}

function createEmptyApp(): string {
  return `export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <p className="text-zinc-400">No preview available</p>
    </div>
  )
}`
}

function hasUtilsFile(entries: Array<[string, string]>): boolean {
  return entries.some(([p]) => p.includes("lib/utils"))
}

function createUtilsFile(): string {
  return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}`
}

type SandpackWrapperProps = {
  files: Record<string, string>
  instanceKey: number
  device: Device
  onReady: () => void
  onReset: () => void
}

export function SandpackWrapper({
  files,
  instanceKey,
  device,
  onReady,
  onReset,
}: SandpackWrapperProps): React.ReactElement {
  return (
    <PreviewErrorBoundary onReset={onReset}>
      <SandpackProvider
        key={instanceKey}
        template="react-ts"
        files={files}
        theme="dark"
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          recompileMode: "delayed",
          recompileDelay: 300,
        }}
        customSetup={{
          dependencies: {
            "framer-motion": "^10.18.0",
            "lucide-react": "^0.400.0",
            "clsx": "^2.1.0",
            "tailwind-merge": "^2.2.0",
          },
        }}
        style={{ height: "100%" }}
      >
        <SandpackInner device={device} onReady={onReady} onReset={onReset} />
      </SandpackProvider>
    </PreviewErrorBoundary>
  )
}
