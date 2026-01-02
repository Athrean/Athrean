'use client'

/**
 * Download ZIP Component
 *
 * Exports project files as a downloadable ZIP archive.
 */

import { useState, useCallback } from 'react'
import { Download, Loader2 } from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { cn } from '@/lib/utils'

interface DownloadZipProps {
  files: Map<string, string> | Record<string, string>
  projectName: string
  disabled?: boolean
  className?: string
  variant?: 'default' | 'icon'
}

export function DownloadZip({
  files,
  projectName,
  disabled = false,
  className,
  variant = 'default',
}: DownloadZipProps): React.ReactElement {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = useCallback(async () => {
    setIsDownloading(true)

    try {
      const zip = new JSZip()

      // Convert Map to object if needed
      const fileEntries =
        files instanceof Map ? Object.fromEntries(files) : files

      // Add all project files
      for (const [path, content] of Object.entries(fileEntries)) {
        // Ensure path doesn't start with /
        const normalizedPath = path.startsWith('/') ? path.slice(1) : path
        zip.file(normalizedPath, content)
      }

      // Add additional config files if not present
      if (!fileEntries['package.json']) {
        zip.file('package.json', generatePackageJson(projectName))
      }

      if (!fileEntries['tsconfig.json']) {
        zip.file('tsconfig.json', generateTsConfig())
      }

      if (!fileEntries['next.config.ts']) {
        zip.file('next.config.ts', generateNextConfig())
      }

      if (!fileEntries['.gitignore']) {
        zip.file('.gitignore', generateGitignore())
      }

      if (!fileEntries['README.md']) {
        zip.file('README.md', generateReadme(projectName))
      }

      // Generate ZIP blob
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      })

      // Sanitize project name for filename
      const sanitizedName = projectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      // Download the file
      saveAs(blob, `${sanitizedName || 'project'}.zip`)
    } catch (error) {
      console.error('Failed to generate ZIP:', error)
    } finally {
      setIsDownloading(false)
    }
  }, [files, projectName])

  const fileCount =
    files instanceof Map ? files.size : Object.keys(files).length
  const isDisabled = disabled || fileCount === 0 || isDownloading

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDisabled}
        className={cn(
          'p-2 rounded-lg transition-colors',
          'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200',
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        title={`Download as ZIP (${fileCount} files)`}
      >
        {isDownloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDisabled}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg',
        'bg-zinc-800 hover:bg-zinc-700 text-zinc-200',
        'border border-zinc-700 hover:border-zinc-600',
        'transition-colors duration-200',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span>Download ZIP</span>
      {fileCount > 0 && (
        <span className="text-xs text-zinc-500">({fileCount})</span>
      )}
    </button>
  )
}

// ============================================================================
// DEFAULT FILE GENERATORS
// ============================================================================

function generatePackageJson(projectName: string): string {
  const safeName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return JSON.stringify(
    {
      name: safeName || 'my-app',
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        next: '^15.0.0',
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        'framer-motion': '^11.0.0',
        'lucide-react': '^0.400.0',
        clsx: '^2.1.0',
        'tailwind-merge': '^2.3.0',
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.0.0',
        typescript: '^5.5.0',
        tailwindcss: '^4.0.0',
        postcss: '^8.4.0',
        autoprefixer: '^10.4.0',
      },
    },
    null,
    2
  )
}

function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2017',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    },
    null,
    2
  )
}

function generateNextConfig(): string {
  return `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
}

export default nextConfig
`
}

function generateGitignore(): string {
  return `# Dependencies
node_modules
.pnpm-store

# Next.js
.next
out
build

# Production
dist

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.idea
.vscode
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo
next-env.d.ts
`
}

function generateReadme(projectName: string): string {
  return `# ${projectName}

This project was generated with [Athrean](https://athrean.com).

## Getting Started

First, install dependencies:

\`\`\`bash
npm install
# or
pnpm install
# or
bun install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide Icons](https://lucide.dev/) - Icons

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
`
}
