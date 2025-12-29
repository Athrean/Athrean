"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Play, Pause } from "lucide-react";

type Testimonial = {
  id: number;
  quote: string;
  name: string;
  designation: string;
  src: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
    name: "Sarah Chen",
    designation: "Product Manager at TechFlow",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=500&fit=crop",
  },
  {
    id: 2,
    quote:
      "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
    name: "Michael Rodriguez",
    designation: "CTO at InnovateSphere",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop",
  },
  {
    id: 3,
    quote:
      "This solution has significantly improved our team's productivity. The intuitive searching design makes complex tasks feel effortless.",
    name: "Emily Watson",
    designation: "Operations Director at CloudScale",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=500&h=500&fit=crop",
  },
  {
    id: 4,
    quote:
      "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
    name: "James Kim",
    designation: "Engineering Lead at DataPrime",
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?w=500&h=500&fit=crop",
  },
];

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Versatile01() {
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
          setActiveIndex((prev) => (prev + 1) % testimonials.length);
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
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const activeTestimonial = testimonials[activeIndex];

  if (!activeTestimonial) return null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4 font-sans">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Left: Image Stack */}
          <div className="flex items-center gap-6">
            {/* Navigation Dots */}
            <div className="flex flex-col gap-3 items-center">
              {testimonials.map((_, index) => {
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

            {/* Stacked Images */}
            <div className="relative h-64 w-64 md:h-80 md:w-80">
              {testimonials.map((testimonial, index) => {
                const relativeIndex =
                  (index - activeIndex + testimonials.length) % testimonials.length;
                const isVisible = relativeIndex < 3;

                return (
                  <motion.div
                    key={testimonial.id}
                    className={cn(
                      "absolute rounded-3xl overflow-hidden shadow-xl border border-zinc-700/50",
                      !isVisible && "opacity-0 pointer-events-none"
                    )}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    initial={false}
                    animate={{
                      top: relativeIndex * -CARD_OFFSET,
                      scale: 1 - relativeIndex * SCALE_FACTOR,
                      zIndex: testimonials.length - relativeIndex,
                      opacity: isVisible ? 1 : 0,
                      filter: `brightness(${1 - relativeIndex * 0.15})`,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Controls */}
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

          {/* Right: Content */}
          <div className="flex-1 max-w-md">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              <motion.p className="text-lg md:text-xl text-zinc-300 leading-relaxed">
                "{activeTestimonial.quote}"
              </motion.p>
              <div>
                <p className="text-zinc-100 font-semibold text-lg">
                  {activeTestimonial.name}
                </p>
                <p className="text-zinc-500 text-sm">
                  {activeTestimonial.designation}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
