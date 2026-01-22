"use client"

import Image from "next/image"
import React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { WireframeHead } from "./wireframe-head"

export function DemoSection(): React.ReactElement {
  const content = [
    {
      label: "Instant Generation",
      labelColor: "text-teal-400",
      title: "DeployBot",
      subTitle: "One-click launch",
      description: "DeployBot simplifies deploying and interacting with your Solana programs. With a single click, it compiles, deploys, and generates IDLs and client SDKs, letting you instantly test and interact with your program without leaving the platform or writing extra scripts."
    },
    {
      label: "Smart Context",
      labelColor: "text-purple-400",
      title: "EditWizard",
      subTitle: "Instant tweaks",
      description: "EditWizard allows you to easily modify existing smart contracts through chat or direct code edits. It intelligently maintains Anchor conventions, syntax, and safety checks, while applying your requested changes so you can improve or refactor programs confidently and quickly."
    },
    {
      label: "Iterative Flow",
      labelColor: "text-blue-400",
      title: "TestRunner",
      subTitle: "Automated verification",
      description: "TestRunner generates and runs comprehensive test suites for your smart contracts. It understands your logic and creates edge-case scenarios to ensure your code is robust and secure before you ever deploy to mainnet."
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
