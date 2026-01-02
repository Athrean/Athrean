"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    content: React.ReactNode;
  }[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 15;
  const SCALE_FACTOR = scaleFactor || 0.07;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const duration = 5000;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now() - (progress / 100) * duration;
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = (elapsed / duration) * 100;

        if (newProgress >= 100) {
          setProgress(0);
          startTimeRef.current = Date.now();
          setActiveIndex((prev) => (prev + 1) % items.length);
        } else {
          setProgress(newProgress);
        }
      }, 16);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, items.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {/* Left: Navigation Dots/Bar */}
      <div className="flex flex-col gap-3 items-center">
        {items.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              className={cn(
                "relative rounded-full transition-all duration-300 bg-zinc-800/50",
                isActive ? "w-1 h-8" : "w-1 h-1"
              )}
            >
              {isActive && (
                <div
                  className="absolute top-0 left-0 w-full bg-zinc-500/80 rounded-full"
                  style={{ height: `${progress}%` }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Center: Stacked Cards */}
      <div className="relative h-60 w-60 md:h-[280px] md:w-[420px]">
        {items.map((card, index) => {
          const relativeIndex = (index - activeIndex + items.length) % items.length;

          // Show 3 cards (0, 1, 2)
          const isVisible = relativeIndex < 3;

          return (
            <motion.div
              key={card.id}
              className={cn(
                "absolute bg-[#18181b] h-60 w-60 md:h-[280px] md:w-[420px] rounded-[24px] p-4 shadow-2xl border border-white/5 flex flex-col justify-between origin-top-center",
                !isVisible && "opacity-0 pointer-events-none"
              )}
              initial={false}
              animate={{
                top: relativeIndex * -CARD_OFFSET,
                scale: 1 - relativeIndex * SCALE_FACTOR,
                zIndex: items.length - relativeIndex,
                opacity: isVisible ? 1 : 0,
                // Add brightness diff for depth
                filter: `brightness(${1 - relativeIndex * 0.1})`,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <div className="w-full h-32 md:h-40 relative">
                {card.content}
              </div>
              <div className="px-1">
                <p className="text-zinc-100 font-semibold text-base mb-1">{card.name}</p>
                <p className="text-zinc-500 font-medium text-xs leading-relaxed line-clamp-2">{card.designation}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Right: Controls */}
      <div className="flex flex-col gap-1">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-full text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={togglePlay}
          className="p-1.5 rounded-full text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          onClick={handleNext}
          className="p-1.5 rounded-full text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
