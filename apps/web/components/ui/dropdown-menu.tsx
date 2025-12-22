'use client'

import { useState, useRef, useEffect, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

interface DropdownContextValue {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

const DropdownContext = createContext<DropdownContextValue | null>(null)

function useDropdown(): DropdownContextValue {
    const context = useContext(DropdownContext)
    if (!context) throw new Error('useDropdown must be used within DropdownMenu')
    return context
}

interface DropdownMenuProps {
    children: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') setIsOpen(false)
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleEscape)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen])

    return (
        <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
            <div ref={containerRef} className="relative inline-block">
                {children}
            </div>
        </DropdownContext.Provider>
    )
}

interface DropdownMenuTriggerProps {
    children: React.ReactNode
    asChild?: boolean
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps): React.ReactElement {
    const { isOpen, setIsOpen } = useDropdown()

    return (
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
            {children}
        </div>
    )
}

interface DropdownMenuContentProps {
    children: React.ReactNode
    align?: 'start' | 'center' | 'end'
    className?: string
}

export function DropdownMenuContent({
    children,
    align = 'start',
    className,
}: DropdownMenuContentProps): React.ReactElement | null {
    const { isOpen, setIsOpen } = useDropdown()

    if (!isOpen) return null

    return (
        <div
            className={cn(
                'absolute z-50 mt-2 min-w-[200px] rounded-xl border border-zinc-800 bg-zinc-900 p-1 shadow-xl',
                'animate-in fade-in-0 zoom-in-95',
                align === 'start' && 'left-0',
                align === 'center' && 'left-1/2 -translate-x-1/2',
                align === 'end' && 'right-0',
                className
            )}
            onClick={() => setIsOpen(false)}
        >
            {children}
        </div>
    )
}

interface DropdownMenuItemProps {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    className?: string
}

export function DropdownMenuItem({
    children,
    onClick,
    disabled = false,
    className,
}: DropdownMenuItemProps): React.ReactElement {
    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors',
                'hover:bg-zinc-800 hover:text-zinc-100',
                'focus:outline-none focus:bg-zinc-800',
                disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-zinc-300',
                className
            )}
        >
            {children}
        </button>
    )
}

export function DropdownMenuSeparator({ className }: { className?: string }): React.ReactElement {
    return <div className={cn('my-1 h-px bg-zinc-800', className)} />
}

interface DropdownMenuGroupProps {
    children: React.ReactNode
    className?: string
}

export function DropdownMenuGroup({ children, className }: DropdownMenuGroupProps): React.ReactElement {
    return <div className={cn('', className)}>{children}</div>
}
