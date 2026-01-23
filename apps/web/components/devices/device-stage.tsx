"use client"

import { forwardRef } from "react"
import { motion, MotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { SafariBrowser } from "./safari-browser"
import { MacbookPro } from "./macbook-mockup"
import { Ipad } from "./ipad-mockup"

/**
 * DeviceStage - Scroll-driven device showcase
 *
 * Scroll ranges:
 *   0% - 33%:  Safari Browser
 *   33% - 66%: MacBook Pro
 *   66% - 100%: iPad
 *
 * Each device fades/scales based on segment progress.
 * Reduced rotateY for subtler parallax.
 */

export type DeviceType = "safari" | "macbook" | "ipad"

export interface DeviceConfig {
  type: DeviceType
  mediaSrc: string
  isVideo?: boolean
  url?: string
}

export interface DeviceStageProps {
  scrollYProgress: MotionValue<number>
  devices: [DeviceConfig, DeviceConfig, DeviceConfig]
  className?: string
}

function getDeviceTransforms(scrollProgress: number, deviceIndex: number) {
  const segmentSize = 1 / 3
  const segmentStart = deviceIndex * segmentSize

  const localProgress = Math.max(0, Math.min(1, (scrollProgress - segmentStart) / segmentSize))

  const isActive = scrollProgress >= segmentStart && scrollProgress < segmentStart + segmentSize
  const isLastAndComplete = deviceIndex === 2 && scrollProgress >= 1

  let opacity = 0
  if (isActive || isLastAndComplete) {
    if (localProgress < 0.15) {
      opacity = localProgress / 0.15
    } else if (localProgress > 0.85 && !isLastAndComplete) {
      opacity = 1 - (localProgress - 0.85) / 0.15
    } else {
      opacity = 1
    }
  }

  let scale = 0.9
  if (isActive || isLastAndComplete) {
    const scaleCurve = 1 - Math.abs(localProgress - 0.5) * 0.2
    scale = 0.9 + scaleCurve * 0.1
  }

  const rotateY = isActive ? (localProgress - 0.5) * 10 : 0

  return { opacity, scale, rotateY }
}

export const DeviceStage = forwardRef<HTMLDivElement, DeviceStageProps>(
  ({ scrollYProgress, devices, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative w-full h-full flex items-center justify-center", className)}
        style={{ perspective: "1200px" }}
      >
        {devices.map((device, index) => (
          <DeviceWrapper
            key={device.type}
            device={device}
            index={index}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    )
  }
)

DeviceStage.displayName = "DeviceStage"

interface DeviceWrapperProps {
  device: DeviceConfig
  index: number
  scrollYProgress: MotionValue<number>
}

function DeviceWrapper({ device, index, scrollYProgress }: DeviceWrapperProps) {
  const opacity = useTransform(scrollYProgress, (p) => getDeviceTransforms(p, index).opacity)
  const scale = useTransform(scrollYProgress, (p) => getDeviceTransforms(p, index).scale)
  const rotateY = useTransform(scrollYProgress, (p) => getDeviceTransforms(p, index).rotateY)

  return (
    <motion.div
      className="absolute"
      style={{
        opacity,
        scale,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {device.type === "safari" && (
        <SafariBrowser
          url={device.url || "athrean.com"}
          src={device.mediaSrc}
          width={680}
          height={440}
        />
      )}
      {device.type === "macbook" && (
        <MacbookPro
          src={device.mediaSrc}
          width={650}
          height={400}
        />
      )}
      {device.type === "ipad" && (
        <Ipad
          src={device.mediaSrc}
          width={520}
          height={400}
        />
      )}
    </motion.div>
  )
}
