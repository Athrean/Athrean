'use client'

import { Suspense } from 'react'
import { GeneratePageContent } from '@/components/generate/generate-page-content'

function GeneratePageFallback(): React.ReactElement {
  return (
    <div className="flex h-screen w-full bg-zinc-950 items-center justify-center">
      <div className="animate-pulse text-zinc-500">Loading...</div>
    </div>
  )
}

export default function GeneratePage(): React.ReactElement {
  return (
    <Suspense fallback={<GeneratePageFallback />}>
      <GeneratePageContent />
    </Suspense>
  )
}
