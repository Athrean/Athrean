"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import GradientBlinds from "@/components/ui/gradient-blinds";

export function BackgroundGradient() {
  const pathname = usePathname();

  // Hide gradient on /generate page
  if (pathname.startsWith("/generate")) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      {/* Dark base that fades out */}
      <motion.div
        className="absolute inset-0 bg-[#1a1a1a]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          duration: 2,
          delay: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />

      {/* Gradient blinds with saturation animation */}
      <motion.div
        className="absolute inset-0"
        initial={{ filter: "saturate(0) brightness(0.3)" }}
        animate={{ filter: "saturate(1) brightness(1)" }}
        transition={{
          duration: 2.5,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <GradientBlinds
          gradientColors={["#1F1C2C", "#3d2a4d", "#6b4466", "#e8a4a4", "#f5c6c0", "#a8d4d3", "#058b8a"]}
          angle={12}
          noise={0.06}
          blindCount={18}
          blindMinWidth={50}
          spotlightRadius={0.5}
          spotlightSoftness={1.4}
          spotlightOpacity={0.3}
          mouseDampening={0.1}
          distortAmount={0}
          shineDirection="right"
          mixBlendMode="soft-light"
        />
      </motion.div>
    </div>
  );
}
