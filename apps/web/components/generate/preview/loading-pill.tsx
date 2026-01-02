"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const defaultMessages = [
    "Getting ready...",
    "Analyzing requirements...",
    "Generating structure...",
    "Writing code...",
    "Polishing UI...",
    "Finalizing...",
]

interface LoadingPillProps {
    isLoading?: boolean
    messages?: string[]
}

export function LoadingPill({
    isLoading = true,
    messages = defaultMessages
}: LoadingPillProps) {
    const [msgIndex, setMsgIndex] = useState(0)

    useEffect(() => {
        if (!isLoading) return

        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % messages.length)
        }, 2500)

        return () => clearInterval(interval)
    }, [isLoading, messages.length])

    if (!isLoading) return null

    return (
        <div className="flex items-center gap-3 px-5 py-2.5 backdrop-blur-md rounded-full border border-zinc-800 shadow-xl bg-zinc-950/90 z-20">
            <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
            <div className="w-36 h-5 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={msgIndex}
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }}
                        transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
                        className="absolute inset-0 flex items-center text-sm text-zinc-400 font-medium whitespace-nowrap"
                    >
                        {messages[msgIndex]}
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    )
}
