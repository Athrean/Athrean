"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Zap, Package, Code2, ArrowRight } from "lucide-react"
import { AiChatInput } from "@/components/hero/ai-chat-input"

const Dither = dynamic(() => import("@/components/backgrounds/Dither"), {
  ssr: false,
})

interface WorkflowStep {
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
}

const workflowSteps: WorkflowStep[] = [
  { icon: Sparkles, label: "Generate", color: "text-teal-400" },
  { icon: Zap, label: "Preview", color: "text-yellow-400" },
  { icon: Package, label: "Ship", color: "text-purple-400" },
]

export function LandingHero(): React.ReactElement {
  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Dither Background */}
      <div className="absolute inset-0 z-0">
        <Dither
          waveSpeed={0.05}
          waveFrequency={3}
          waveAmplitude={0.3}
          waveColor={[0.18, 0.62, 0.58]}
          colorNum={4}
          pixelSize={2}
          enableMouseInteraction={true}
          mouseRadius={1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl max-w-4xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        >
          Vibe. Build. Ship.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">
            That Fast.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-center text-white/80 text-base md:text-lg drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
        >
          Prompt it. Preview it. Ship it. <span className="underline decoration-wavy decoration-teal-400 underline-offset-4">No cap.</span>
        </motion.p>

        {/* Chat Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 w-full max-w-2xl px-4"
        >
          <AiChatInput placeholder="create a counter app..." />
        </motion.div>

        {/* Workflow Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex items-center gap-2"
        >
          {workflowSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.label} className="flex items-center">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-zinc-700/50 backdrop-blur-sm">
                  <Icon className={`w-4 h-4 ${step.color}`} />
                  <span className="text-sm font-medium text-white">{step.label}</span>
                </div>
                {index < workflowSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-zinc-500 mx-2" />
                )}
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Bottom Left CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative z-10 px-6 pb-8"
      >
        <p className="text-sm text-white/60 mb-1">Powered by AI + React</p>
        <p className="text-base font-medium text-white mb-4">
          Build Beautiful React Apps 10x Faster
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/80 border border-zinc-700 text-white text-sm font-medium hover:bg-zinc-800 transition-colors backdrop-blur-sm"
          >
            <Code2 className="w-4 h-4" />
            Explore Playground
          </Link>
          <Link
            href="/docs"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Read Our Docs
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
