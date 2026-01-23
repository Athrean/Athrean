"use client"

import React from "react"
import { motion } from "framer-motion"
import { WireframeHead } from "./wireframe-head"

export function DemoSection(): React.ReactElement {
  const content = [
    {
      label: "Plan-First",
      labelColor: "text-teal-400",
      title: "Architect",
      subTitle: "Intelligent planning",
      description: "Athrean creates a detailed architecture plan before writing any code. It maps out components, decides on state management, and plans your entire app structure—so you get a coherent, production-ready codebase instead of a patchwork of generated snippets."
    },
    {
      label: "Smart Context",
      labelColor: "text-purple-400",
      title: "Memory",
      subTitle: "Persistent project brain",
      description: "Unlike other tools that forget context mid-generation, Athrean maintains a persistent project memory. It remembers your requirements, past decisions, and learned patterns—delivering consistent code that actually understands your project."
    },
    {
      label: "Component Library",
      labelColor: "text-blue-400",
      title: "Components",
      subTitle: "Beautiful, ready-to-use",
      description: "Access a curated library of production-ready components inspired by shadcn. Drag, drop, and customize—or let AI compose them for you. Every component follows best practices and integrates seamlessly with your Next.js stack."
    }
  ];

  return (
    <section id="demo" className="relative bg-black">
      <div className="flex flex-col lg:flex-row relative">
        {/* Sticky 3D Head Container */}
        <div className="lg:w-1/2 w-full lg:h-screen lg:sticky lg:top-0 relative h-[50vh] flex items-center justify-center bg-black z-0">
          <WireframeHead />
        </div>

        {/* Scrollable Content Container */}
        <div className="lg:w-1/2 w-full relative z-10 p-6 flex flex-col pb-24">

          {content.map((item, index) => (
            <div key={index} className="min-h-screen flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ margin: "-20% 0px -20% 0px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-lg"
              >
                {/* Pixel Font Header Style */}
                <h2 className="text-5xl md:text-7xl font-mono font-bold text-white mb-4 tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {item.title}
                </h2>
                <p className={`text-xl md:text-2xl font-bold ${item.labelColor} mb-8`}>
                  {item.subTitle}
                </p>
                <p className="text-zinc-500 text-lg md:text-xl leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
