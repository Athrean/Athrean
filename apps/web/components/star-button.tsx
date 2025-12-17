'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toggleStar } from '@/app/actions/component'
import { toast } from 'sonner'

interface StarButtonProps {
    componentId: string
    name: string
    code: string
    initialIsStarred?: boolean
    className?: string
}

export function StarButton({
    componentId,
    name,
    code,
    initialIsStarred = false,
    className
}: StarButtonProps) {
    const [isStarred, setIsStarred] = useState(initialIsStarred)
    const [isLoading, setIsLoading] = useState(false)

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (isLoading) return

        const newState = !isStarred
        setIsStarred(newState)
        setIsLoading(true)

        try {
            const result = await toggleStar(componentId, name, code, isStarred)
            if (result && 'error' in result) {
                setIsStarred(!newState) // Revert
                toast.error('Failed to update favorites')
            } else {
                toast.success(newState ? 'Added to favorites' : 'Removed from favorites')
            }
        } catch (error) {
            setIsStarred(!newState) // Revert
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "p-2 rounded-full transition-all duration-200 hover:bg-black/20 hover:scale-110 active:scale-95",
                isStarred ? "text-yellow-400" : "text-white/70 hover:text-white",
                className
            )}
            title={isStarred ? "Remove from favorites" : "Add to favorites"}
        >
            <Star
                className={cn("w-5 h-5", isStarred && "fill-current")}
                strokeWidth={isStarred ? 0 : 2}
            />
        </button>
    )
}
