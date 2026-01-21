"use client"

import { motion } from "framer-motion"
import { MessageSquare, Sparkles, Download, ArrowRight } from "lucide-react"

interface WorkflowStep {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
}

const workflowSteps: WorkflowStep[] = [
  {
    icon: MessageSquare,
    title: "Describe",
    description: "Tell Athrean what you want to build in plain English",
    color: "text-blue-400",
  },
  {
    icon: Sparkles,
    title: "Generate",
    description: "AI creates your component or app with clean, production-ready code",
    color: "text-teal-400",
  },
  {
    icon: Download,
    title: "Ship",
    description: "Preview, customize, and export your code instantly",
    color: "text-purple-400",
  },
]

export function WorkflowSection(): React.ReactElement {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-teal-400 uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Three Steps to Ship
          </h2>
        </motion.div>

        {/* Workflow steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step number */}
                  <div className="relative z-10 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <Icon className={`w-7 h-7 ${step.color}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-400">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-sm max-w-xs">
                    {step.description}
                  </p>

                  {/* Arrow (mobile only) */}
                  {index < workflowSteps.length - 1 && (
                    <div className="md:hidden mt-6">
                      <ArrowRight className="w-5 h-5 text-zinc-600 rotate-90" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
