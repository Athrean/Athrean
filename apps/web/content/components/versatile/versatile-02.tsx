"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Play, Pause } from "lucide-react";

type CardItem = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
  icon: React.ReactNode;
};

const defaultCards: CardItem[] = [
  {
    id: 0,
    name: "Full Stack Apps",
    designation: "Next.js + Supabase",
    icon: (
      <svg className="w-6 h-6 text-zinc-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    content: "Build full stack applications with database, authentication, and backend logic instantly.",
  },
  {
    id: 1,
    name: "UI Components",
    designation: "React + Tailwind",
    icon: (
      <svg className="w-6 h-6 text-zinc-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    content: "Generate beautiful, responsive UI components with Tailwind CSS and Framer Motion.",
  },
  {
    id: 2,
    name: "Instant Preview",
    designation: "Live Environment",
    icon: (
      <svg className="w-6 h-6 text-zinc-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    content: "See your changes in real-time as you chat. No setup or configuration required.",
  },
  {
    id: 3,
    name: "Steve Jobs",
    designation: "Co-founder, Apple",
    icon: (
      <svg className="w-6 h-6 text-zinc-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    content: "Design is not just what it looks like and feels like. Design is how it works.",
  },
  {
    id: 4,
    name: "Leonardo da Vinci",
    designation: "Polymath",
    icon: (
      <svg className="w-6 h-6 text-zinc-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    content: "Simplicity is the ultimate sophistication.",
  },
];

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Versatile02() {
  const CARD_OFFSET = 15;
  const SCALE_FACTOR = 0.07;
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
          setActiveIndex((prev) => (prev + 1) % defaultCards.length);
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
  }, [isPlaying, progress]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % defaultCards.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + defaultCards.length) % defaultCards.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4 font-sans">
      <div className="flex items-center gap-6 md:gap-10">
        {/* Left: Navigation Dots/Bar */}
        <div className="flex flex-col gap-3 items-center">
          {defaultCards.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={cn(
                  "relative rounded-full transition-all duration-300 bg-zinc-800",
                  isActive ? "w-1.5 h-8" : "w-1.5 h-1.5"
                )}
              >
                {isActive && (
                  <div
                    className="absolute top-0 left-0 w-full bg-zinc-400 rounded-full"
                    style={{ height: `${progress}%` }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Center: Stacked Cards */}
        <div className="relative h-60 w-60 md:h-60 md:w-96">
          {defaultCards.map((card, index) => {
            const relativeIndex = (index - activeIndex + defaultCards.length) % defaultCards.length;
            const isVisible = relativeIndex < 3;

            return (
              <motion.div
                key={card.id}
                className={cn(
                  "absolute bg-[#323333] h-60 w-60 md:h-60 md:w-96 rounded-3xl p-6 shadow-xl border border-zinc-700/50 flex flex-col justify-between origin-top-center",
                  !isVisible && "opacity-0 pointer-events-none"
                )}
                initial={false}
                animate={{
                  top: relativeIndex * -CARD_OFFSET,
                  scale: 1 - relativeIndex * SCALE_FACTOR,
                  zIndex: defaultCards.length - relativeIndex,
                  opacity: isVisible ? 1 : 0,
                  filter: `brightness(${1 - relativeIndex * 0.1})`,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                <div className="font-normal text-zinc-300">
                  <div className="flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                      {card.icon}
                    </div>
                    <p>{card.content}</p>
                  </div>
                </div>
                <div>
                  <p className="text-zinc-100 font-medium">{card.name}</p>
                  <p className="text-zinc-500 font-normal text-sm">{card.designation}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Controls */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            className="p-2 rounded-full text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
