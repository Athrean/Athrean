"use client"

import { useEffect, useState } from "react"
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

  useEffect(() => {
    console.log('[BundlerListener] Setting up listener')
    const unsubscribe = listen((msg) => {
      console.log('[BundlerListener] Message:', msg.type, msg)
      if (msg.type === "done" || (msg.type === "status" && msg.status === "idle")) {
        console.log('[BundlerListener] Ready!')
        onReady()
      }
      if (msg.type === "action" && msg.action === "show-error") {
        console.log('[BundlerListener] Error:', msg)
        onError((msg as { message?: string }).message || "Preview error")
      }
    })
    return () => {
      console.log('[BundlerListener] Cleanup')
      unsubscribe()
    }
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

  console.log('[buildAppFiles] Processing', entries.length, 'files')
  console.log('[buildAppFiles] File paths:', entries.map(([p]) => p))

  for (const [path, content] of entries) {
    if (isExcludedFile(path)) {
      console.log('[buildAppFiles] Excluding:', path)
      continue
    }

    const sandpackPath = normalizePath(path)
    files[sandpackPath] = transformContent(content)
    console.log('[buildAppFiles] Added:', sandpackPath)
  }

  const pageFile = findPageFile(entries)
  console.log('[buildAppFiles] Found page file:', pageFile?.[0] ?? 'none')

  if (pageFile) {
    files["/App.tsx"] = createAppEntry(pageFile[0])
    console.log('[buildAppFiles] Created App.tsx entry for:', pageFile[0])
  } else if (!files["/App.tsx"]) {
    files["/App.tsx"] = createEmptyApp()
    console.log('[buildAppFiles] Created empty App.tsx')
  }

  if (!hasUtilsFile(entries)) {
    files["/lib/utils.ts"] = createUtilsFile()
  }

  console.log('[buildAppFiles] Final files:', Object.keys(files))
  return files
}

function isExcludedFile(path: string): boolean {
  return (
    path.includes("tailwind.config") ||
    path.includes("next.config") ||
    path.includes("tsconfig") ||
    path.includes("package.json") ||
    path.includes("layout.tsx") ||
    path.includes("layout.ts")
    // Don't exclude CSS - we need globals.css for custom styles
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
    // Strip directives
    .replace(/['"]use client['"];?\s*/g, "")
    .replace(/['"]use server['"];?\s*/g, "")
    // Strip Next.js imports
    .replace(/import\s+.*from\s+['"]next\/(?:image|link|navigation|font\/.*)['"]\s*;?\s*/g, "")
    .replace(/import\s+type\s*\{[^}]*Metadata[^}]*\}\s*from\s+['"]next['"]\s*;?\s*/g, "")
    .replace(/import\s*\{[^}]*Metadata[^}]*\}\s*from\s+['"]next['"]\s*;?\s*/g, "")
    // Strip layout imports
    .replace(/import\s+.*from\s+['"]\.\/layout['"]\s*;?\s*/g, "")
    .replace(/import\s+['"]\.\/globals\.css['"]\s*;?\s*/g, "")
    // Strip font declarations and usage
    .replace(/const\s+\w+\s*=\s*(?:Inter|Roboto|Open_Sans|Poppins|Lato|Montserrat|Source_Sans_Pro|Nunito|Raleway|Ubuntu)\s*\([^)]*\)\s*;?\s*/g, "")
    .replace(/\w+\.className/g, '""')
    // Strip metadata export
    .replace(/export\s+const\s+metadata\s*(?::\s*Metadata\s*)?=\s*\{[^}]*\}\s*;?\s*/g, "")
    // Convert Next.js components to HTML
    .replace(/<Image\s/g, "<img ")
    .replace(/<\/Image>/g, "</img>")
    .replace(/<Link\s/g, "<a ")
    .replace(/<\/Link>/g, "</a>")
    // Fix import paths
    .replace(/from\s+['"]@\/([^'"]+)['"]/g, (_, p) => `from "/${p}"`)
    // Transform custom theme colors to standard Tailwind colors
    // Pattern: bg-{custom}-{color} -> bg-{standardColor}-500
    .replace(/\b(bg|text|border|ring|fill|stroke)-[a-z]+-blue\b/g, "$1-blue-500")
    .replace(/\b(bg|text|border|ring|fill|stroke)-[a-z]+-red\b/g, "$1-red-500")
    .replace(/\b(bg|text|border|ring|fill|stroke)-[a-z]+-yellow\b/g, "$1-amber-400")
    .replace(/\b(bg|text|border|ring|fill|stroke)-[a-z]+-green\b/g, "$1-green-500")
    .replace(/\b(bg|text|border|ring|fill|stroke)-[a-z]+-purple\b/g, "$1-purple-500")
    .replace(/\b(bg|text|border|ring|fill|stroke)-[a-z]+-pink\b/g, "$1-pink-500")
    .replace(/\b(bg|text|border|ring|fill|stroke)-[a-z]+-orange\b/g, "$1-orange-500")
    .replace(/\b(bg|text|border|ring|fill|stroke)-[a-z]+-cyan\b/g, "$1-cyan-500")
    .replace(/\b(bg|text|border|ring|fill|stroke)-[a-z]+-white\b/g, "$1-white")
    .replace(/\b(bg|text|border|ring|fill|stroke)-[a-z]+-black\b/g, "$1-black")
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

  // Fallback to first TSX file that's not a layout or config
  return entries.find(([p]) =>
    p.endsWith(".tsx") &&
    !p.includes("layout") &&
    !isExcludedFile(p)
  ) ?? null
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

// Base CSS with Tailwind and shadcn CSS variables
const BASE_CSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: system-ui, -apple-system, sans-serif;
}
`

export function SandpackWrapper({
  files,
  instanceKey,
  device,
  onReady,
  onReset,
}: SandpackWrapperProps): React.ReactElement {
  // Check if there's a globals.css in the files
  const hasGlobalsCss = Object.keys(files).some(p => p.includes("globals.css"))
  const globalsImport = hasGlobalsCss ? '\nimport "./app/globals.css"' : ''

  // Add base styles to files
  const filesWithStyles = {
    ...files,
    "/styles.css": BASE_CSS,
    "/index.tsx": `import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./styles.css"${globalsImport}

const root = createRoot(document.getElementById("root")!)
root.render(<App />)
`,
  }

  return (
    <PreviewErrorBoundary onReset={onReset}>
      <SandpackProvider
        key={instanceKey}
        template="react-ts"
        files={filesWithStyles}
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
            "class-variance-authority": "^0.7.0",
            "@radix-ui/react-slot": "^1.0.2",
            "@radix-ui/react-dialog": "^1.0.5",
            "@radix-ui/react-dropdown-menu": "^2.0.6",
            "@radix-ui/react-select": "^2.0.0",
            "@radix-ui/react-tabs": "^1.0.4",
            "@radix-ui/react-tooltip": "^1.0.7",
            "@radix-ui/react-accordion": "^1.1.2",
            "@radix-ui/react-avatar": "^1.0.4",
            "@radix-ui/react-checkbox": "^1.0.4",
            "@radix-ui/react-label": "^2.0.2",
            "@radix-ui/react-popover": "^1.0.7",
            "@radix-ui/react-scroll-area": "^1.0.5",
            "@radix-ui/react-separator": "^1.0.3",
            "@radix-ui/react-switch": "^1.0.3",
          },
        }}
        style={{ height: "100%" }}
      >
        <SandpackInner device={device} onReady={onReady} onReset={onReset} />
      </SandpackProvider>
    </PreviewErrorBoundary>
  )
}
