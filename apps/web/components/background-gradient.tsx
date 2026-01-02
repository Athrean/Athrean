"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import FlowerBackground from "@/components/ui/flower-background";

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
        className="absolute inset-0 bg-[#0a2a20]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          duration: 1.5,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />

      {/* Flower background with clash animation */}
      <motion.div
        className="absolute inset-0"
        initial={{ filter: "saturate(0) brightness(0.4)" }}
        animate={{ filter: "saturate(1) brightness(1)" }}
        transition={{
          duration: 2,
          delay: 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <FlowerBackground />
      </motion.div>
    </div>
  );
}
