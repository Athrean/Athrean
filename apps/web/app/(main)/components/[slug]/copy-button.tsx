'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackInstall } from '@/lib/db/mutations'

interface CopyButtonProps {
  code: string
  name: string
}

export function CopyButton({ code, name }: CopyButtonProps): React.ReactElement {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(code)
    setCopied(true)

    // Track the copy/install (fire and forget)
    trackInstall(name).catch(() => {
      // Ignore tracking errors
    })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button onClick={handleCopy} className="gap-2">
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy Code
        </>
      )}
    </Button>
  )
}
