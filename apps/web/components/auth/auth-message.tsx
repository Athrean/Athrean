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
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
      <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
      <p className="text-sm text-green-700">{message}</p>
    </div>
  )
}
