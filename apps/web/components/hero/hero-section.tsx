"use client";

import { type JSX } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { AiChatInput } from "./ai-chat-input";

const heroWords = ["Design", "Code", "Creativity", "UI", "Experience"];

export function HeroSection(): JSX.Element {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-16 pb-16 overflow-hidden">

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-400/30 bg-white/40 px-3 py-1.5 backdrop-blur-sm shadow-sm">
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#058b8a] text-white">
            New
          </span>
          <span className="text-sm font-medium text-zinc-700">
            AI-Powered Component Design
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
        </div>
      </motion.div>

      {/* Main headline - smaller */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-center text-3xl font-bold leading-[1.2] tracking-tight text-zinc-800 sm:text-4xl md:text-5xl max-w-3xl"
      >
        Forget Everything You Know About{" "}
        <ContainerTextFlip
          words={heroWords}
          interval={2500}
          animationDuration={600}
        />
      </motion.h1>

      {/* Subheadline - smaller */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 max-w-lg text-center text-base text-zinc-600 md:text-lg"
      >
        Create apps and components by chatting with AI
      </motion.p>

      {/* AI Chat Input - bigger and more prominent */}
      <div className="mt-10 w-full max-w-3xl px-4">
        <AiChatInput placeholder="Ask Athrean to create a component about..." />
      </div>

      {/* Secondary CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 flex items-center gap-4"
      >
        <Link
          href="/components"
          className="group flex items-center gap-2 rounded-full border border-zinc-400/40 bg-white/50 px-5 py-2.5 text-sm font-medium text-zinc-700 backdrop-blur-sm shadow-sm transition-all hover:border-zinc-500 hover:bg-white/70 hover:text-zinc-900"
        >
          <Layers className="h-4 w-4" />
          Browse Components
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-zinc-600">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-6 w-4 rounded-full border border-zinc-500/50 bg-white/30"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mt-1 h-1.5 w-1 rounded-full bg-zinc-600"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
