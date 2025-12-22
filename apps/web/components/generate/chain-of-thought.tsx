'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReasoningStep } from '@/types/reasoning'

interface ChainOfThoughtProps {
    steps: ReasoningStep[]
    isComplete?: boolean
}

function StepIcon({ status }: { status: ReasoningStep['status'] }): React.ReactElement {
    if (status === 'completed') {
        return (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4 h-4 rounded-full bg-teal-500/20 flex items-center justify-center"
            >
                <Check className="w-2.5 h-2.5 text-teal-400" />
            </motion.div>
        )
    }

    return (
        <div className="w-4 h-4 rounded-full bg-zinc-600/20 flex items-center justify-center">
            <Loader2 className="w-2.5 h-2.5 text-zinc-400 animate-spin" />
        </div>
    )
}

export function ChainOfThought({ steps, isComplete = false }: ChainOfThoughtProps): React.ReactElement {
    const [isExpanded, setIsExpanded] = useState(true)

    if (steps.length === 0) return <></>

    const thinkingCount = steps.filter(s => s.status === 'thinking').length
    const completedCount = steps.filter(s => s.status === 'completed').length

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border border-zinc-800/60 bg-zinc-900/50 overflow-hidden"
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/30 transition-colors"
            >
                <div className="flex items-center gap-2.5">
                    <img
                        src="/vector-logo.png"
                        alt="Athrean"
                        className="w-5 h-5 object-contain"
                    />
                    <span className="text-sm font-medium text-zinc-200">
                        {isComplete ? 'Reasoning Complete' : 'Thinking...'}
                    </span>
                    {!isComplete && thinkingCount > 0 && (
                        <motion.span
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-xs text-zinc-500"
                        >
                            {completedCount}/{steps.length} steps
                        </motion.span>
                    )}
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                </motion.div>
            </button>

            {/* Steps */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-3 pt-1 space-y-2">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start gap-2.5"
                                >
                                    <div className="mt-0.5">
                                        <StepIcon status={step.status} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "text-sm leading-relaxed",
                                            step.status === 'completed' ? "text-zinc-400" : "text-zinc-300"
                                        )}>
                                            {step.content || step.title}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
