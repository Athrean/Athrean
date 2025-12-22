'use client'

import { Tooltip } from '@/components/ui/tooltip'
import type { ContextUsage } from '@/types/reasoning'

interface ContextUsageIndicatorProps {
    usage: ContextUsage
}

function formatTokens(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
}

export function ContextUsageIndicator({ usage }: ContextUsageIndicatorProps): React.ReactElement {
    const percentage = Math.min(usage.usagePercent, 100)

    const tooltipContent = (
        <div className="min-w-[180px] space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-zinc-100">{percentage.toFixed(1)}%</span>
                <span className="text-sm text-zinc-400">
                    {formatTokens(usage.totalTokens)} / {formatTokens(usage.contextWindow)}
                </span>
            </div>
            <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )

    return (
        <Tooltip content={tooltipContent} side="top" align="end">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" className="transform -rotate-90">
                    <circle
                        cx="7"
                        cy="7"
                        r="5"
                        fill="transparent"
                        stroke="#3f3f46"
                        strokeWidth="2"
                    />
                    <circle
                        cx="7"
                        cy="7"
                        r="5"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray={2 * Math.PI * 5}
                        strokeDashoffset={2 * Math.PI * 5 * (1 - percentage / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                    />
                </svg>
            </div>
        </Tooltip>
    )
}
