"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface CarouselCard {
  category: string
  title: string
  src: string
  description: string
}

const data: CarouselCard[] = [
  {
    category: "Artificial Intelligence",
    title: "You can do more with AI.",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80",
    description: "Build smarter flows with reasoning-friendly UI and safety rails.",
  },
  {
    category: "Productivity",
    title: "Enhance your productivity.",
    src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?auto=format&fit=crop&w=1200&q=80",
    description: "Ship faster with presets, checkpoints, and reusable snippets.",
  },
  {
    category: "Product",
    title: "Launching the new Vision flow.",
    src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?auto=format&fit=crop&w=1200&q=80",
    description: "Hero experiences and component galleries tailored for demos.",
  },
  {
    category: "Product",
    title: "Maps for your next release.",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?auto=format&fit=crop&w=1200&q=80",
    description: "Guide users with contextual navigation and shareable views.",
  },
  {
    category: "iOS",
    title: "Photography just got better.",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?auto=format&fit=crop&w=1200&q=80",
    description: "Showcase media-rich experiences with smooth preview panes.",
  },
  {
    category: "Hiring",
    title: "Hiring for a Staff Software Engineer.",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?auto=format&fit=crop&w=1200&q=80",
    description: "Collaborate on new verticals and platform capabilities.",
  },
]

export function FeaturedCarousel(): React.ReactElement {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent snap-x snap-mandatory">
        {data.map((card, idx) => (
          <article
            key={card.title + idx}
            className={cn(
              "relative w-[320px] shrink-0 snap-start overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-950/90 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.8)]",
              "transition-transform duration-300 hover:-translate-y-1"
            )}
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={card.src}
                alt={card.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-200 border border-zinc-800/70 backdrop-blur">
                {card.category}
              </span>
            </div>
            <div className="space-y-2 p-4">
              <h3 className="text-lg font-semibold text-white leading-tight">{card.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}















