"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Suspense } from "react"

function AuthErrorContent(): React.ReactElement {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") ?? "An authentication error occurred"

  return (
    <div className="w-full max-w-md text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>

      <h1 className="mb-2 text-2xl font-semibold text-zinc-900">
        Authentication Error
      </h1>

      <p className="mb-8 text-gray-500">{error}</p>

      <div className="flex flex-col gap-3">
        <Link
          href="/login"
          className="rounded-full bg-zinc-900 px-5 py-3 text-[15px] font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          Back to Login
        </Link>

        <Link
          href="/"
          className="rounded-full border border-gray-200 px-5 py-3 text-[15px] font-medium text-zinc-900 hover:bg-gray-50 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}

export default function AuthErrorPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <Suspense fallback={
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-zinc-900">
            Loading...
          </h1>
        </div>
      }>
        <AuthErrorContent />
      </Suspense>
    </div>
  )
}
