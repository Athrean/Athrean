"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
    message: ChatMessage;
}

function extractCodeBlock(content: string): { code: string; language: string } | null {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/;
    const match = content.match(codeBlockRegex);
    if (match && match[2]) {
        return {
            language: match[1] ?? 'tsx',
            code: match[2].trim(),
        };
    }
    return null;
}

function CodeBlockDisplay({ code, language }: { code: string; language: string }): React.ReactElement {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (): Promise<void> => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = code.split('\n');
    const previewLines = lines.slice(0, 8);
    const hasMore = lines.length > 8;

    return (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/60 bg-zinc-900/80">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-500/10 flex items-center justify-center">
                        <Code2 className="w-3.5 h-3.5 text-teal-400" />
                    </div>
                    <span className="text-sm font-medium text-zinc-200">Generated Component</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-500 uppercase">
                        {language}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-teal-400" />
                            <span className="text-teal-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Preview */}
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm leading-relaxed">
                    <code className="text-zinc-300 font-mono">
                        {previewLines.map((line, i) => (
                            <div key={i} className="flex">
                                <span className="select-none text-zinc-600 w-8 shrink-0 text-right pr-4">
                                    {i + 1}
                                </span>
                                <span className="flex-1">{line}</span>
                            </div>
                        ))}
                        {hasMore && (
                            <div className="flex mt-2 pt-2 border-t border-zinc-800/50">
                                <span className="text-zinc-600 w-8 shrink-0" />
                                <span className="text-zinc-500 italic text-xs">
                                    ... {lines.length - 8} more lines
                                </span>
                            </div>
                        )}
                    </code>
                </pre>
            </div>
        </div>
    );
}

export function MessageBubble({ message }: MessageBubbleProps): React.ReactElement {
    const isUser = message.role === "user";
    const codeBlock = !isUser ? extractCodeBlock(message.content) : null;

    // For assistant messages with code, get any text before the code block
    const textBeforeCode = !isUser && codeBlock
        ? (message.content.split('```')[0] ?? '').trim()
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}
        >
            <div
                className={cn(
                    "max-w-[95%] rounded-2xl text-sm leading-relaxed",
                    isUser ? "bg-zinc-800 text-white shadow-sm px-5 py-3.5" : "bg-transparent text-zinc-300 w-full"
                )}
            >
                {!isUser && (
                    <div className="flex items-center gap-2 mb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        <img
                            src="/vector-logo.png"
                            alt="Athrean"
                            className="w-3.5 h-3.5 object-contain"
                        />
                        Athrean AI
                    </div>
                )}

                {isUser ? (
                    <div className="whitespace-pre-wrap wrap-break-word">{message.content}</div>
                ) : (
                    <div className="space-y-3">
                        {textBeforeCode && (
                            <p className="text-zinc-300">{textBeforeCode}</p>
                        )}
                        {codeBlock ? (
                            <CodeBlockDisplay code={codeBlock.code} language={codeBlock.language} />
                        ) : (
                            <div className="whitespace-pre-wrap wrap-break-word">{message.content}</div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export function TypingIndicator(): React.ReactElement {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start w-full mb-6"
        >
            <div className="pl-0">
                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <img
                        src="/vector-logo.png"
                        alt="Athrean"
                        className="w-3.5 h-3.5 object-contain"
                    />
                    Athrean AI
                </div>
                <div className="flex gap-1.5 pl-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-zinc-600 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
