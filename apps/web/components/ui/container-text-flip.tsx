"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContainerTextFlipProps {
  words?: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
  animationDuration?: number;
}

export function ContainerTextFlip({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
}: ContainerTextFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Measure all words on mount
  useEffect(() => {
    if (measureRef.current) {
      const measuredWidths = words.map((word) => {
        if (measureRef.current) {
          measureRef.current.textContent = word;
          return measureRef.current.offsetWidth;
        }
        return 0;
      });
      setWidths(measuredWidths);
    }
  }, [words]);

  // Cycle through words
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  const currentWidth = widths[currentIndex] || "auto";

  return (
    <>
      {/* Hidden element to measure text */}
      <span
        ref={measureRef}
        className={cn(
          "absolute opacity-0 pointer-events-none whitespace-nowrap",
          "inline-block text-[#28cbcb]",
          textClassName
        )}
        aria-hidden="true"
      />
      
      <span
        className={cn("relative inline-flex overflow-hidden align-bottom", className)}
        style={{
          width: currentWidth,
          transition: `width ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={words[currentIndex]}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{
              duration: animationDuration / 1000,
              ease: [0.4, 0, 0.2, 1],
            }}
            className={cn(
              "inline-block text-[#03b5b5] whitespace-nowrap font-bold",
              textClassName
            )}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}
