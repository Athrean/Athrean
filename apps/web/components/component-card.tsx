'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StarButton } from '@/components/star-button'
import { truncate } from '@/lib/utils'
import type { Component } from '@/types'

interface ComponentCardProps {
  component: Component
  isStarred?: boolean
}

const categoryColors: Record<string, string> = {
  buttons: 'from-violet-500 to-fuchsia-500',
  cards: 'from-cyan-500 to-blue-500',
  heroes: 'from-amber-500 to-orange-500',
  forms: 'from-emerald-500 to-teal-500',
  inputs: 'from-rose-500 to-pink-500',
}

export function ComponentCard({ component, isStarred = false }: ComponentCardProps): React.ReactElement {
  const gradientClass = categoryColors[component.category] ?? 'from-zinc-500 to-zinc-600'

  return (
    <Link href={`/components/${component.slug}`}>
      <motion.article
        whileHover={{ y: -4 }}
        className="group relative rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden transition-colors hover:border-zinc-700"
      >
        {/* Preview area */}
        <div className={`h-40 bg-gradient-to-br ${gradientClass} opacity-20 group-hover:opacity-30 transition-opacity relative`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
              {component.name.charAt(0)}
            </span>
          </div>

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <StarButton
              componentId={component.id}
              name={component.name}
              code={component.code}
              initialIsStarred={isStarred}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
              {component.name}
            </h3>
            <Badge variant="secondary" className="shrink-0">
              {component.category}
            </Badge>
          </div>

          {component.description && (
            <p className="text-sm text-zinc-400 mb-3">
              {truncate(component.description, 80)}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Eye className="w-3.5 h-3.5" />
            <span>{component.viewCount.toLocaleString()}</span>
            {component.isPro && (
              <Badge variant="warning" className="ml-auto">PRO</Badge>
            )}
          </div>
        </div>

        {/* Hover border glow */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom right, transparent, rgba(99, 102, 241, 0.1))',
          }}
        />
      </motion.article>
    </Link>
  )
}

