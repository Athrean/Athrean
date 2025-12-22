"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Zap,
  ChevronDown,
  Circle,
  CircleDashed,
  Cloud,
  Code,
  Laptop,
  History,
  Paperclip,
  Plus,
  CircleDot,
  Bot,
  Send,
  User,
  Wand2,
  Globe,
} from "lucide-react";
import { useRef, useState } from "react";

export default function Ai03() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("Local");
  const [selectedAgent, setSelectedAgent] = useState("Agent");
  const [selectedPerformance, setSelectedPerformance] = useState("High");
  const [autoMode, setAutoMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Handle submission
    }
  };

  return (
    <div className="w-xl">
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sr-only"
          onChange={() => {}}
        />

        <div className="px-3 pt-3 pb-2 grow">
          <form onSubmit={handleSubmit}>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything"
              className="w-full bg-transparent! p-0 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder-muted-foreground resize-none border-none outline-none text-sm min-h-10 max-h-[25vh]"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
          </form>
        </div>

        <div className="mb-2 px-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-full border border-border hover:bg-accent"
                >
                  <Plus className="size-3" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="max-w-xs rounded-2xl p-1.5"
              >
                <DropdownMenuGroup className="space-y-1">
                  <DropdownMenuItem
                    className="rounded-[calc(1rem-6px)] text-xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip size={16} className="opacity-60" />
                    Attach Files
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-[calc(1rem-6px)] text-xs"
                    onClick={() => {}}
                  >
                    <Code size={16} className="opacity-60" />
                    Code Interpreter
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-[calc(1rem-6px)] text-xs"
                    onClick={() => {}}
                  >
                    <Globe size={16} className="opacity-60" />
                    Web Search
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-[calc(1rem-6px)] text-xs"
                    onClick={() => {}}
                  >
                    <History size={16} className="opacity-60" />
                    Chat History
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoMode(!autoMode)}
              className={cn(
                "h-7 px-2 rounded-full border border-border hover:bg-accent ",
                {
                  "bg-primary/10 text-primary border-primary/30": autoMode,
                  "text-muted-foreground": !autoMode,
                }
              )}
            >
              <Wand2 className="size-3" />
              <span className="text-xs">Auto</span>
            </Button>
          </div>

          <div>
            <Button
              type="submit"
              disabled={!input.trim()}
              className="size-7 p-0 rounded-full bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
            >
              <Send className="size-3 fill-primary" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0 pt-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 rounded-full border border-transparent hover:bg-accent text-muted-foreground text-xs"
            >
              <Laptop className="size-3" />
              <span>{selectedModel}</span>
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="max-w-xs rounded-2xl p-1.5 bg-popover border-border"
          >
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem
                className="rounded-[calc(1rem-6px)] text-xs"
                onClick={() => setSelectedModel("Local")}
              >
                <Laptop size={16} className="opacity-60" />
                Local
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-[calc(1rem-6px)] text-xs"
                onClick={() => setSelectedModel("Cloud")}
              >
                <Cloud size={16} className="opacity-60" />
                Cloud
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 rounded-full border border-transparent hover:bg-accent text-muted-foreground text-xs"
            >
              <User className="size-3" />
              <span>{selectedAgent}</span>
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="max-w-xs rounded-2xl p-1.5 bg-popover border-border"
          >
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem
                className="rounded-[calc(1rem-6px)] text-xs"
                onClick={() => setSelectedAgent("Agent")}
              >
                <User size={16} className="opacity-60" />
                Agent
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-[calc(1rem-6px)] text-xs"
                onClick={() => setSelectedAgent("Assistant")}
              >
                <Bot size={16} className="opacity-60" />
                Assistant
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 rounded-full border border-transparent hover:bg-accent text-muted-foreground text-xs"
            >
              <Zap className="size-3" />
              <span>{selectedPerformance}</span>
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="max-w-xs rounded-2xl p-1.5 bg-popover border-border"
          >
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem
                className="rounded-[calc(1rem-6px)] text-xs"
                onClick={() => setSelectedPerformance("High")}
              >
                <Circle size={16} className="opacity-60" />
                High
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-[calc(1rem-6px)] text-xs"
                onClick={() => setSelectedPerformance("Medium")}
              >
                <CircleDot size={16} className="opacity-60" />
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-[calc(1rem-6px)] text-xs"
                onClick={() => setSelectedPerformance("Low")}
              >
                <CircleDashed size={16} className="opacity-60" />
                Low
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />
      </div>
    </div>
  );
}
