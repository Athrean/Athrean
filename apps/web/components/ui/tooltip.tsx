'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TooltipProps {
    children: ReactNode
    content: ReactNode
    side?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
    className?: string
    delayMs?: number
}

export function Tooltip({
    children,
    content,
    side = 'top',
    align = 'center',
    className,
    delayMs = 200,
}: TooltipProps): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const triggerRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    const updatePosition = (): void => {
        if (!triggerRef.current) return

        const rect = triggerRef.current.getBoundingClientRect()
        const scrollX = window.scrollX
        const scrollY = window.scrollY

        let top = 0
        let left = 0

        // Calculate position based on side
        switch (side) {
            case 'top':
                top = rect.top + scrollY - 8
                break
            case 'bottom':
                top = rect.bottom + scrollY + 8
                break
            case 'left':
                left = rect.left + scrollX - 8
                break
            case 'right':
                left = rect.right + scrollX + 8
                break
        }

        // Calculate alignment
        if (side === 'top' || side === 'bottom') {
            switch (align) {
                case 'start':
                    left = rect.left + scrollX
                    break
                case 'center':
                    left = rect.left + scrollX + rect.width / 2
                    break
                case 'end':
                    left = rect.right + scrollX
                    break
            }
        } else {
            switch (align) {
                case 'start':
                    top = rect.top + scrollY
                    break
                case 'center':
                    top = rect.top + scrollY + rect.height / 2
                    break
                case 'end':
                    top = rect.bottom + scrollY
                    break
            }
        }

        setPosition({ top, left })
    }

    const handleMouseEnter = (): void => {
        updatePosition()
        timeoutRef.current = setTimeout(() => setIsOpen(true), delayMs)
    }

    const handleMouseLeave = (): void => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setIsOpen(false)
    }

    const getTransformStyle = (): string => {
        const transforms: string[] = []

        if (side === 'top') transforms.push('translateY(-100%)')
        if (side === 'bottom') transforms.push('translateY(0)')
        if (side === 'left') transforms.push('translateX(-100%)')
        if (side === 'right') transforms.push('translateX(0)')

        if (side === 'top' || side === 'bottom') {
            if (align === 'center') transforms.push('translateX(-50%)')
            if (align === 'end') transforms.push('translateX(-100%)')
        } else {
            if (align === 'center') transforms.push('translateY(-50%)')
            if (align === 'end') transforms.push('translateY(-100%)')
        }

        return transforms.join(' ')
    }

    return (
        <>
            <div
                ref={triggerRef}
                className="inline-flex"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'fixed',
                                top: position.top,
                                left: position.left,
                                transform: getTransformStyle(),
                                zIndex: 9999,
                            }}
                            className={cn(
                                'px-3 py-2.5 text-xs rounded-xl',
                                'bg-zinc-900 text-zinc-100 border border-zinc-700/50',
                                'shadow-xl shadow-black/40',
                                'pointer-events-none',
                                className
                            )}
                        >
                            {content}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}
