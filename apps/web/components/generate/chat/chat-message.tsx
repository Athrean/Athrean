"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps): React.ReactElement {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[90%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed",
          isUser ? "bg-zinc-800 text-white shadow-sm" : "bg-transparent text-zinc-300 pl-0"
        )}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Athrean AI
          </div>
        )}
        <div className="whitespace-pre-wrap wrap-break-word">{message.content}</div>
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
          <Sparkles className="w-3 h-3 text-indigo-400" />
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
