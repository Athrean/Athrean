'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toggleFavorite } from '@/app/actions/component'
import { toast } from 'sonner'

interface StarButtonProps {
    itemId: string
    initialIsFavorited?: boolean
    className?: string
}

export function StarButton({
    itemId,
    initialIsFavorited = false,
    className
}: StarButtonProps) {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
    const [isLoading, setIsLoading] = useState(false)

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (isLoading) return

        const previousState = isFavorited
        setIsFavorited(!isFavorited)
        setIsLoading(true)

        try {
            const result = await toggleFavorite(itemId)
            if (result && 'error' in result) {
                setIsFavorited(previousState) // Revert
                toast.error('Failed to update favorites')
            } else if (result.isFavorited !== undefined) {
                setIsFavorited(result.isFavorited)
                toast.success(result.isFavorited ? 'Added to favorites' : 'Removed from favorites')
            }
        } catch {
            setIsFavorited(previousState) // Revert
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
                isFavorited ? "text-yellow-400" : "text-white/70 hover:text-white",
                className
            )}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
            <Star
                className={cn("w-5 h-5", isFavorited && "fill-current")}
                strokeWidth={isFavorited ? 0 : 2}
            />
        </button>
    )
}
