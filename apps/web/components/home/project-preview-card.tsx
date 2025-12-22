'use client'

import Link from 'next/link'
import { Sparkles, Clock, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getProjectTimeLabel } from '@/lib/format-time'
import type { UserGeneration } from '@/types'

interface ProjectPreviewCardProps {
    project: UserGeneration
    variant?: 'grid' | 'carousel'
    showTimestamp?: boolean
}

export function ProjectPreviewCard({
    project,
    variant = 'grid',
    showTimestamp = false,
}: ProjectPreviewCardProps): React.ReactElement {
    const hue = (project.name.charCodeAt(0) * 15) % 360
    const timeInfo = getProjectTimeLabel(project.createdAt, project.updatedAt)

    const isCarousel = variant === 'carousel'

    return (
        <Link
            href={`/generate?project=${project.id}`}
            className={cn(
                'block group snap-start',
                isCarousel && 'shrink-0 w-[280px] md:w-[320px]'
            )}
        >
            <div
                className={cn(
                    'rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl',
                    isCarousel ? 'aspect-[16/10]' : 'aspect-[4/3]'
                )}
            >
                {/* Thumbnail Area */}
                <div
                    className="h-full w-full flex flex-col items-center justify-center p-5 relative"
                    style={{
                        background: `linear-gradient(145deg, hsl(${hue}, 50%, 12%) 0%, hsl(${hue}, 40%, 6%) 100%)`,
                    }}
                >
                    {/* Glass overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    {/* Icon */}
                    <Sparkles className={cn(
                        'text-white/20 mb-4 group-hover:text-white/30 transition-colors',
                        isCarousel ? 'w-12 h-12' : 'w-10 h-10'
                    )} />

                    {/* Title */}
                    <span className={cn(
                        'text-zinc-100 text-center line-clamp-2 font-semibold relative',
                        isCarousel ? 'text-lg' : 'text-base'
                    )}>
                        {project.name}
                    </span>

                    {/* Prompt preview */}
                    {project.prompt && (
                        <span className="text-sm text-zinc-500 text-center line-clamp-1 mt-2 relative">
                            {project.prompt}
                        </span>
                    )}

                    {/* Timestamp badge */}
                    {showTimestamp && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs text-zinc-400">
                            {timeInfo.type === 'edited' ? (
                                <Pencil className="w-3 h-3" />
                            ) : (
                                <Clock className="w-3 h-3" />
                            )}
                            <span>{timeInfo.text}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
