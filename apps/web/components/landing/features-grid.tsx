"use client"

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
  icon: React.ComponentType<{ className?: string }>
  label: string
  title: string
  description: string
  badge?: string
  rotation: number
}

const features: Feature[] = [
  {
    icon: Sparkles,
    label: "AI-POWERED",
    title: "Smart Generation",
    description: "Generate production-ready components from natural language",
    badge: "React & TS",
    rotation: -6,
  },
  {
    icon: Eye,
    label: "INSTANT",
    title: "Live Preview",
    description: "See your code running instantly with Sandpack",
    badge: "Real-time",
    rotation: -2,
  },
  {
    icon: FolderTree,
    label: "COMPLETE",
    title: "Full Stack Apps",
    description: "Multi-file apps with routing and state management",
    badge: "Build Mode",
    rotation: 2,
  },
  {
    icon: LayoutGrid,
    label: "LIBRARY",
    title: "200+ Components",
    description: "Pre-built components ready to use or customize",
    badge: "Copy & Paste",
    rotation: 4,
  },
  {
    icon: Download,
    label: "EXPORT",
    title: "Ship Anywhere",
    description: "Download as ZIP or copy code directly",
    badge: "One-Click",
    rotation: 6,
  },
]

export function FeaturesGrid(): React.ReactElement {
  return (
    <section id="features" className="relative py-24 px-4 overflow-hidden">
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 via-purple-950/60 to-zinc-950" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-3">
            fin-tastic features. zero-hassle.
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight">
            Because Coding Shouldn&apos;t Ruin Your
            <br />
            Sleep Schedule
          </h2>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-lg text-zinc-300 max-w-2xl mx-auto mb-16"
        >
          Transform your ideas into production-ready apps seamlessly.
        </motion.p>

        {/* Tilted Feature Cards */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: feature.rotation }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ rotate: 0, scale: 1.05, y: -10 }}
                className={cn(
                  "relative w-44 p-5 rounded-2xl bg-white shadow-xl cursor-pointer",
                  "transition-all duration-300"
                )}
              >
                {/* Label */}
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  {feature.label}
                </p>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-zinc-700" />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-zinc-900 mb-1">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                  {feature.description}
                </p>

                {/* Badge */}
                {feature.badge && (
                  <span className="inline-block px-2.5 py-1 rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-600">
                    {feature.badge}
                  </span>
                )}

                {/* Decorative dot */}
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-teal-400" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
