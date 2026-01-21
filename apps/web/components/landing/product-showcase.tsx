"use client"

import { motion } from "framer-motion"
import { Layers, MessageSquare, Rocket } from "lucide-react"
import { cn } from "@/lib/utils"

interface Product {
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string
  status: "available" | "upcoming"
  gradient: string
}

const products: Product[] = [
  {
    icon: MessageSquare,
    name: "Build Mode",
    description:
      "Generate complete multi-file applications with AI. Full-stack React apps with routing, state management, and API integration.",
    status: "available",
    gradient: "from-teal-500/20 to-cyan-500/20",
  },
  {
    icon: Layers,
    name: "Component Library",
    description:
      "Browse and customize 200+ pre-built components. Copy code directly or use them as starting points for AI generation.",
    status: "available",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Rocket,
    name: "Deploy Bot",
    description:
      "One-click deployment to Vercel, Netlify, or your own infrastructure. Coming soon to make shipping even faster.",
    status: "upcoming",
    gradient: "from-orange-500/20 to-red-500/20",
  },
]

export function ProductShowcase(): React.ReactElement {
  return (
    <section className="py-24 px-4 bg-zinc-950/50">
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
            Products
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Powerful Tools at Your Fingertips
          </h2>
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const Icon = product.icon
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={cn(
                  "relative p-6 rounded-2xl border border-zinc-800 overflow-hidden",
                  "hover:border-zinc-700 transition-colors"
                )}
              >
                {/* Gradient background */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-50",
                    product.gradient
                  )}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800/80 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {product.status === "upcoming" && (
                      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2 py-1 bg-zinc-800/50 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
