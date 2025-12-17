'use client'

import { Heart, Tag, Eye } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Component } from '@/types'

interface FeaturedCardProps {
  component: Component
  className?: string
  imageClassName?: string
  priority?: boolean
}

export function FeaturedCard({ component, className, imageClassName, priority = false }: FeaturedCardProps): React.ReactElement {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <Link href={`/components/${component.slug}`} className={cn("block h-full", className)}>
      <motion.div
        whileHover={{ y: -2 }}
        className="h-full bg-[#323333] rounded-xl border border-zinc-800 p-2.5 flex flex-col shadow-md"
      >
        {/* Image Container */}
        <div className={cn("relative w-full rounded-lg overflow-hidden mb-2 bg-zinc-800 shrink-0", imageClassName || "aspect-[16/10]")}>
          <img
            src={`https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop`}
            alt={component.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-1 px-0.5">
          {/* Title and Subtitle */}
          <div className="mb-1.5">
            <h2 className="text-base font-semibold text-white mb-0.5 leading-tight">{component.name}</h2>
            <p className="text-zinc-400 text-xs capitalize">{component.category}</p>
          </div>

          {/* Metrics Info */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1 text-zinc-400">
              <Eye className="w-3 h-3" />
              <span className="text-xs">{component.viewCount} views</span>
            </div>
            {component.isPro && (
              <div className="flex items-center gap-1 text-zinc-400">
                <Tag className="w-3 h-3" />
                <span className="text-xs font-bold text-white">PRO</span>
              </div>
            )}
          </div>

          {/* CTA Button and Heart */}
          <div className="flex items-center gap-1.5 mt-auto">
            <button className="flex-1 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs py-2 px-3 rounded-full transition-all">
              View details
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsLiked(!isLiked)
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-700 transition-all shrink-0"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isLiked
                    ? "text-red-500 fill-red-500"
                    : "text-zinc-400 hover:text-red-400"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
