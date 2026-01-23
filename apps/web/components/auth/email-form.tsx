"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

interface EmailFormProps {
  action: (formData: FormData) => Promise<void>
  buttonText: string
  getTurnstileToken?: () => string | null
}

export function EmailForm({ action, buttonText, getTurnstileToken }: EmailFormProps): React.ReactElement {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData): Promise<void> => {
    setError(null)
    setLoading(true)

    // Add turnstile token to form data
    if (getTurnstileToken) {
      const token = getTurnstileToken()
      if (!token) {
        setError("Please complete the security check")
        setLoading(false)
        return
      }
      formData.set("turnstile_token", token)
    }

    try {
      await action(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="mb-6">
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-300">
          {error}
        </div>
      )}

      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="block w-full rounded-lg border border-zinc-800 bg-transparent px-5 py-3 text-[14px] text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-0 transition-colors mb-4"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-zinc-100 px-5 py-3 text-[14px] font-medium text-zinc-950 hover:bg-white transition-colors flex items-center justify-center disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonText}
      </button>
    </form>
  )
}
