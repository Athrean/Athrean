'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectCarouselProps {
    children: React.ReactNode
    className?: string
}

export function ProjectCarousel({ children, className }: ProjectCarouselProps): React.ReactElement {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const checkScroll = (): void => {
        const el = scrollRef.current
        if (!el) return

        setCanScrollLeft(el.scrollLeft > 0)
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
    }

    useEffect(() => {
        checkScroll()
        const el = scrollRef.current
        if (el) {
            el.addEventListener('scroll', checkScroll)
            window.addEventListener('resize', checkScroll)
        }
        return () => {
            if (el) el.removeEventListener('scroll', checkScroll)
            window.removeEventListener('resize', checkScroll)
        }
    }, [])

    const scroll = (direction: 'left' | 'right'): void => {
        const el = scrollRef.current
        if (!el) return

        const scrollAmount = el.clientWidth * 0.8
        el.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        })
    }

    return (
        <div className={cn('relative group', className)}>
            {/* Left Arrow */}
            <button
                onClick={() => scroll('left')}
                className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all shadow-xl backdrop-blur-sm',
                    'opacity-0 group-hover:opacity-100',
                    !canScrollLeft && 'hidden'
                )}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {children}
            </div>

            {/* Right Arrow */}
            <button
                onClick={() => scroll('right')}
                className={cn(
                    'absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all shadow-xl backdrop-blur-sm',
                    'opacity-0 group-hover:opacity-100',
                    !canScrollRight && 'hidden'
                )}
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Gradient Edges */}
            <div className={cn(
                'absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-[#323333] to-transparent pointer-events-none',
                !canScrollLeft && 'hidden'
            )} />
            <div className={cn(
                'absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-[#323333] to-transparent pointer-events-none',
                !canScrollRight && 'hidden'
            )} />
        </div>
    )
}
