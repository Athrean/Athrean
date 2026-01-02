"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Paperclip,
  Palette,
  Blocks,
  AudioLines,
  ArrowUp,
  ChevronDown,
} from "lucide-react";
import { useGenerateStore } from "@/stores/generate-store";
import { cn } from "@/lib/utils";

interface AiChatInputProps {
  placeholder?: string;
  className?: string;
}

export function AiChatInput({
  placeholder = "Ask Athrean to build you an app that..",
  className,
}: AiChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { setPendingPrompt } = useGenerateStore();

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!input.trim()) return;

    setPendingPrompt(input.trim());
    router.push("/generate");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={cn("w-full mx-auto", className)}
    >
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "relative rounded-[20px] bg-zinc-900 overflow-hidden transition-all duration-200",
            isFocused
              ? "ring-1 ring-zinc-600"
              : "ring-1 ring-zinc-700/50"
          )}
        >
          {/* Textarea */}
          <div className="px-5 pt-4 pb-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="w-full bg-transparent text-zinc-200 text-base placeholder-zinc-500 focus:outline-none resize-none min-h-[28px] max-h-[120px]"
              style={{
                height: "auto",
                overflow: "hidden",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-3 pb-3">
            {/* Left toolbar */}
            <div className="flex items-center gap-0.5">
              <ToolbarButton>
                <Plus className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton>
                <Paperclip className="w-4 h-4" />
                <span>Attach</span>
              </ToolbarButton>

              <ToolbarButton>
                <Palette className="w-4 h-4" />
                <span>Theme</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </ToolbarButton>
            </div>

            {/* Right toolbar */}
            <div className="flex items-center gap-1">
              {/* Build Mode indicator - always active */}
              <ToolbarButton variant="outlined" isActive>
                <Blocks className="w-4 h-4" />
                <span>Build</span>
              </ToolbarButton>

              <ToolbarButton>
                <AudioLines className="w-4 h-4" />
              </ToolbarButton>

              <button
                type="submit"
                disabled={!input.trim()}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full transition-all ml-1",
                  input.trim()
                    ? "bg-zinc-100 text-zinc-900 hover:bg-white"
                    : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                )}
              >
                <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

function ToolbarButton({
  children,
  onClick,
  variant = "default",
  isActive = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outlined";
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
        variant === "outlined" && isActive
          ? "text-teal-400 border border-teal-600 bg-teal-600/20"
          : variant === "outlined"
            ? "text-zinc-300 border border-zinc-600 hover:bg-zinc-700/50 hover:text-white"
            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50"
      )}
    >
      {children}
    </button>
  );
}
