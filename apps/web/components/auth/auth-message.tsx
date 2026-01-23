"use client"

import { useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle } from "lucide-react"

export function AuthMessage(): React.ReactElement | null {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const message = searchParams.get("message")

  if (!error && !message) {
    return null
  }

  if (error) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
        <p className="text-sm text-red-300">{error}</p>
      </div>
    )
  }

  return (
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
      <CheckCircle className="h-5 w-5 shrink-0 text-green-400" />
      <p className="text-sm text-green-300">{message}</p>
    </div>
  )
}
