"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function CtaSection(): React.ReactElement {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-zinc-800 bg-zinc-900/50 p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-purple-500/10" />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Build Something?
            </h2>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-8">
              Join thousands of developers using Athrean to ship faster. Start
              building for free today.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-zinc-900 transition-all hover:bg-zinc-100"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
