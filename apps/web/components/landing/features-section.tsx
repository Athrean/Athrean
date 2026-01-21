"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Monitor, Laptop, Tablet } from "lucide-react"
import { cn } from "@/lib/utils"
import { DeviceStage, type DeviceConfig } from "@/components/devices"

/**
 * FeaturesSection - Scroll-driven parallax showcase
 *
 * Layout: Sticky left text + animated right devices
 * Height: 300vh for smooth scroll transitions
 *
 * Scroll segments:
 *   0% - 33%:  Safari (Web)
 *   33% - 66%: MacBook (Desktop)
 *   66% - 100%: iPad (Multi-platform)
 */

interface FeatureContent {
  icon: React.ComponentType<{ className?: string }>
  label: string
  title: string
  description: string
  tag: string
}

const featureContents: FeatureContent[] = [
  {
    icon: Monitor,
    label: "WEB",
    title: "Build for the Web",
    description: "Production-ready React components that work across all modern browsers.",
    tag: "React & TypeScript",
  },
  {
    icon: Laptop,
    label: "DESKTOP",
    title: "Native Experience",
    description: "Full-featured apps that feel native on any laptop or desktop.",
    tag: "macOS & Windows",
  },
  {
    icon: Tablet,
    label: "DEPLOY",
    title: "Ship Everywhere",
    description: "Export and deploy anywhere. Your code is portable and production-ready.",
    tag: "One-Click Deploy",
  },
]

const defaultDevices: [DeviceConfig, DeviceConfig, DeviceConfig] = [
  { type: "safari", mediaSrc: "/banner.gif", isVideo: false, url: "athrean.com" },
  { type: "macbook", mediaSrc: "/banner.gif", isVideo: false },
  { type: "ipad", mediaSrc: "/banner.gif", isVideo: false },
]

export interface FeaturesSectionProps {
  devices?: [DeviceConfig, DeviceConfig, DeviceConfig]
  className?: string
}

export function FeaturesSection({
  devices = defaultDevices,
  className,
}: FeaturesSectionProps): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const activeIndex = useTransform(scrollYProgress, (p) => Math.min(2, Math.floor(p * 3)))

  return (
    <section
      ref={sectionRef}
      id="features"
      className={cn("relative min-h-[300vh]", className)}
      style={{ background: "#000" }}
    >
      {/* Barely visible top gradient for transition from hero */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(12,12,13,1) 0%, rgba(9,9,11,0) 100%)",
        }}
      />

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
            {/* Left: Text */}
            <div className="flex-1 max-w-lg">
              <Header />
              <div className="relative h-[180px] mt-8">
                {featureContents.map((content, index) => (
                  <FeatureText key={content.label} content={content} index={index} activeIndex={activeIndex} />
                ))}
              </div>
            </div>

            {/* Right: Devices */}
            <div className="flex-1 w-full max-w-2xl h-[480px] lg:h-[560px]">
              <DeviceStage scrollYProgress={scrollYProgress} devices={devices} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <ProgressDots activeIndex={activeIndex} />
    </section>
  )
}

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <span className="text-xs font-semibold text-teal-400/70 uppercase tracking-widest">
        Features
      </span>
      <h2 className="mt-3 text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
        Because Coding
        <br />
        Shouldn&apos;t Ruin
        <br />
        Your Sleep
      </h2>
    </motion.div>
  )
}

interface FeatureTextProps {
  content: FeatureContent
  index: number
  activeIndex: ReturnType<typeof useTransform<number, number>>
}

function FeatureText({ content, index, activeIndex }: FeatureTextProps) {
  const Icon = content.icon

  const opacity = useTransform(activeIndex, (a) => (a === index ? 1 : 0))
  const y = useTransform(activeIndex, (a) => (a === index ? 0 : a < index ? 16 : -16))

  return (
    <motion.div className="absolute inset-0" style={{ opacity, y }}>
      {/* Icon + Label */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{
            background: "rgba(45, 212, 191, 0.08)",
            boxShadow: "inset 0 0 0 1px rgba(45, 212, 191, 0.15)",
          }}
        >
          <Icon className="w-4 h-4 text-teal-400" />
        </div>
        <span className="text-[11px] font-bold text-teal-400/80 uppercase tracking-widest">
          {content.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-white tracking-tight mb-3">
        {content.title}
      </h3>

      {/* Description */}
      <p className="text-[15px] text-zinc-400 leading-relaxed mb-5 max-w-sm">
        {content.description}
      </p>

      {/* Tag - cloudy elevated button style */}
      <div
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-teal-400"
        style={{
          background: "rgba(45, 212, 191, 0.06)",
          boxShadow: `
            inset 0 0 0 1px rgba(45, 212, 191, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.2),
            0 4px 8px rgba(0, 0, 0, 0.15)
          `,
        }}
      >
        {content.tag}
      </div>
    </motion.div>
  )
}

interface ProgressDotsProps {
  activeIndex: ReturnType<typeof useTransform<number, number>>
}

function ProgressDots({ activeIndex }: ProgressDotsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 hidden lg:flex gap-2">
      {[0, 1, 2].map((i) => (
        <ProgressDot key={i} index={i} activeIndex={activeIndex} />
      ))}
    </div>
  )
}

function ProgressDot({
  index,
  activeIndex,
}: {
  index: number
  activeIndex: ReturnType<typeof useTransform<number, number>>
}) {
  const isActive = useTransform(activeIndex, (a) => a === index)
  const scale = useTransform(isActive, (a) => (a ? 1.4 : 1))
  const bg = useTransform(isActive, (a) => (a ? "rgb(45, 212, 191)" : "rgb(39, 39, 42)"))

  return <motion.div className="w-2 h-2 rounded-full" style={{ scale, backgroundColor: bg }} />
}
