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
    <section className="relative flex flex-col justify-center items-center px-6 pt-32 pb-20 overflow-hidden">

      {/* Browse Components badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <Link
          href="/components"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-400/30 bg-white/40 px-4 py-2 backdrop-blur-sm shadow-sm hover:bg-white/60 transition-all"
        >
          <Layers className="w-4 h-4 text-[#058b8a]" />
          <span className="text-sm font-medium text-zinc-700">
            Browse Components
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
        </Link>
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


    </section>
  );
}
