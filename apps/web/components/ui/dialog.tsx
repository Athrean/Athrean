'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps): React.ReactElement | null {
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') onOpenChange(false)
        }

        if (open) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = ''
        }
    }, [open, onOpenChange])

    if (!open) return null

    const handleOverlayClick = (e: React.MouseEvent): void => {
        if (e.target === overlayRef.current) onOpenChange(false)
    }

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0"
        >
            {children}
        </div>
    )
}

interface DialogContentProps {
    children: React.ReactNode
    className?: string
}

export function DialogContent({ children, className }: DialogContentProps): React.ReactElement {
    return (
        <div
            className={cn(
                'relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl',
                'animate-in zoom-in-95 fade-in-0',
                className
            )}
        >
            {children}
        </div>
    )
}

interface DialogHeaderProps {
    children: React.ReactNode
    className?: string
}

export function DialogHeader({ children, className }: DialogHeaderProps): React.ReactElement {
    return <div className={cn('mb-4', className)}>{children}</div>
}

interface DialogTitleProps {
    children: React.ReactNode
    className?: string
}

export function DialogTitle({ children, className }: DialogTitleProps): React.ReactElement {
    return <h2 className={cn('text-lg font-semibold text-zinc-100', className)}>{children}</h2>
}

interface DialogFooterProps {
    children: React.ReactNode
    className?: string
}

export function DialogFooter({ children, className }: DialogFooterProps): React.ReactElement {
    return <div className={cn('mt-6 flex justify-end gap-2', className)}>{children}</div>
}
