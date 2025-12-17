"use client"

import React, { useEffect, useRef, useState, createContext, useContext } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselContextType {
  onCardClose: (index: number) => void
  currentIndex: number
}

const CarouselContext = createContext<CarouselContextType>({
  onCardClose: () => {},
  currentIndex: 0,
})

interface CarouselProps {
  items: React.ReactNode[]
  initialScroll?: number
}

export function Carousel({ items, initialScroll = 0 }: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll
      checkScrollability()
    }
  }, [initialScroll])

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 288 + 16 // card width + gap
      const scrollPosition = index * cardWidth
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
      setCurrentIndex(index)
    }
  }

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        <div
          ref={carouselRef}
          onScroll={checkScrollability}
          className="flex w-full overflow-x-auto py-6 scroll-smooth scrollbar-hide gap-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="flex gap-4 pl-4">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.1 * index, ease: "easeOut" },
                }}
                className="shrink-0"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute right-4 -top-10 flex gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 transition-all",
              canScrollLeft
                ? "hover:bg-zinc-700 text-zinc-200"
                : "opacity-40 cursor-not-allowed text-zinc-500"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 transition-all",
              canScrollRight
                ? "hover:bg-zinc-700 text-zinc-200"
                : "opacity-40 cursor-not-allowed text-zinc-500"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

interface CardProps {
  card: {
    src: string
    title: string
    category: string
    content?: React.ReactNode
  }
  index: number
  layout?: boolean
}

export function Card({ card, index, layout = false }: CardProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { onCardClose } = useContext(CarouselContext)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    if (open) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", onKeyDown)
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    onCardClose(index)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={handleClose}
            />
            <motion.div
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-50 w-full max-w-4xl max-h-[90vh] overflow-auto bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-300" />
              </button>

              <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-t-3xl">
                <img
                  src={card.src}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                    {card.category}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {card.title}
                  </h2>
                </div>
              </div>

              <div className="p-6">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="group relative w-72 h-80 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 text-left"
      >
        <div className="absolute inset-0">
          <img
            src={card.src}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            {card.category}
          </p>
          <h3 className="text-lg font-semibold text-white leading-tight">
            {card.title}
          </h3>
        </div>
      </motion.button>
    </>
  )
}

// Simple card without modal for preview purposes
export function SimpleCard({ card }: { card: { src: string; title: string; category: string } }) {
  return (
    <div className="group relative w-72 h-80 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 cursor-pointer">
      <div className="absolute inset-0">
        <img
          src={card.src}
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
          {card.category}
        </p>
        <h3 className="text-lg font-semibold text-white leading-tight">
          {card.title}
        </h3>
      </div>
    </div>
  )
}
