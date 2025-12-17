"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

interface EmailFormProps {
  action: (formData: FormData) => Promise<void>
  buttonText: string
}

export function EmailForm({ action, buttonText }: EmailFormProps): React.ReactElement {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData): Promise<void> => {
    setLoading(true)
    try {
      await action(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="mb-6">
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="block w-full rounded-full border border-gray-200 px-5 py-3.5 text-[15px] text-black placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-0 transition-colors mb-4"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-zinc-900 px-5 py-3.5 text-[15px] font-medium text-white hover:bg-zinc-800 transition-colors flex items-center justify-center disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : buttonText}
      </button>
    </form>
  )
}
