"use client"

import { FolderOpen } from "lucide-react"

interface FileFolder3DProps {
  title: string
  description: string
}

export function FileFolder3D({ title, description }: FileFolder3DProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-20 h-20 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center mb-6">
        <FolderOpen className="w-10 h-10 text-zinc-700" aria-hidden="true" />
      </div>

      <h3 className="text-xl font-semibold text-white mb-2 text-center">{title}</h3>
      <p className="text-zinc-500 text-sm text-center max-w-md">{description}</p>
    </div>
  )
}
