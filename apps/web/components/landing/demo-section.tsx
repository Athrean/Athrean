"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function DemoSection(): React.ReactElement {
  return (
    <section id="demo" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-teal-400 uppercase tracking-wider mb-3">
            See It In Action
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            From Prompt to Production
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Watch how Athrean transforms your ideas into working code in
            seconds.
          </p>
        </motion.div>

        {/* Demo preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-zinc-500">athrean.com</span>
            </div>
          </div>

          {/* GIF/Video container */}
          <div className="relative aspect-video bg-zinc-950">
            <Image
              src="/banner.gif"
              alt="Athrean Demo"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
