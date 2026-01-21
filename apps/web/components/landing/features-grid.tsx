"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Sparkles,
  Eye,
  FolderTree,
  LayoutGrid,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Feature {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  title: string
  description: string
  badge?: string
}

const initialFeatures: Feature[] = [
  {
    id: "ai-gen",
    icon: Sparkles,
    label: "AI-POWERED",
    title: "Smart Generation",
    description: "Generate production-ready components from natural language.",
    badge: "React & TS",
  },
  {
    id: "preview",
    icon: Eye,
    label: "INSTANT",
    title: "Live Preview",
    description: "See your code running instantly with Sandpack integration.",
    badge: "Real-time",
  },
  {
    id: "full-stack",
    icon: FolderTree,
    label: "COMPLETE",
    title: "Full Stack Apps",
    description: "Multi-file apps with routing and state management logic.",
    badge: "Build Mode",
  },
  {
    id: "library",
    icon: LayoutGrid,
    label: "LIBRARY",
    title: "200+ Components",
    description: "Pre-built components ready to use or customize.",
    badge: "Copy & Paste",
  },
  {
    id: "export",
    icon: Download,
    label: "EXPORT",
    title: "Ship Anywhere",
    description: "Download as ZIP or copy code directly to your project.",
    badge: "One-Click",
  },
]

export function FeaturesGrid(): React.ReactElement {
  const [cards, setCards] = useState(initialFeatures)

  const moveToEnd = (fromIndex: number) => {
    setCards((currentCards) => {
      const newCards = [...currentCards]
      const [movedCard] = newCards.splice(fromIndex, 1)
      // Add a unique key just to ensure framer treats it as a 'new' position at the end or proper reorder
      // actually, just moving it to the end of the array is enough for the position calc
      if (movedCard) {
        newCards.push(movedCard)
      }
      return newCards
    })
  }

  // Config for the stack
  const verticalDistance = 55
  const scaleStep = 0.05

  return (
    <section
      id="features"
      className="relative py-32 px-4 overflow-hidden bg-zinc-950 flex flex-col items-center justify-center min-h-screen border-t border-zinc-800 shadow-[0_-50px_100px_rgba(0,0,0,0.5)]"
    >
      {/* Zinc gradient background (Brand Theme) */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950" />

      {/* Subtle grid pattern for texture */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2371717a' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">

        {/* Left Side: Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-sm font-medium text-teal-500/80 uppercase tracking-widest mb-4">
              fin-tastic features
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              Because Coding<br />Shouldn&apos;t Ruin<br />Your Sleep
            </h2>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Transform your ideas into production-ready apps seamlessly.
              Swipe through our power-packed features designed to make you ship faster.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Card Swap Stack */}
        <div className="flex-1 w-full max-w-md h-[450px] relative flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {cards.map((feature, index) => {
              const Icon = feature.icon
              const isFirst = index === 0

              // We only show the top 4 cards for performance/visuals
              if (index > 3) return null

              return (
                <motion.div
                  key={feature.id}
                  layoutId={feature.id}
                  onClick={() => isFirst && moveToEnd(index)}
                  initial={false}
                  animate={{
                    y: index * verticalDistance,
                    scale: 1 - index * scaleStep,
                    zIndex: cards.length - index,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 30,
                  }}
                  className={cn(
                    "absolute top-0 w-80 h-[380px] p-8",
                    "rounded-[2.5rem] border border-white/10",
                    "bg-zinc-900/60 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]", // Cloudy Glassmorphism
                    "flex flex-col justify-between cursor-pointer",
                    "transition-all duration-300",
                    isFirst
                      ? "hover:border-white/20 hover:bg-zinc-800/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                      : "pointer-events-none brightness-50" // Dim cards in back
                  )}
                  style={{
                    transformOrigin: "top center",
                  }}
                >
                  {/* Top Content */}
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900/50 border border-white/5 flex items-center justify-center shadow-inner">
                        <Icon className="w-7 h-7 text-zinc-200" />
                      </div>
                      {feature.badge && (
                        <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-bold text-teal-400 uppercase tracking-wide">
                          {feature.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                      {feature.title}
                    </h3>

                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">
                      {feature.label}
                    </p>
                  </div>

                  {/* Bottom Content */}
                  <div className="relative">
                    <p className="text-base text-zinc-400 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
