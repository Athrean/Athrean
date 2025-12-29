"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  SlidersHorizontal,
  ArrowUp,
  Figma,
  Camera,
  CirclePlus,
  Clipboard,
  Upload,
  History,
  LayoutDashboard,
  Link,
  Paperclip,
  Play,
  Plus,
  Sparkles,
  LayoutTemplate,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface AttachedFile {
  id: string;
  name: string;
  file: File;
  preview?: string;
}

const ACTIONS = [
  { id: "clone-screenshot", icon: Camera, label: "Clone a Screenshot" },
  { id: "import-figma", icon: Figma, label: "Import from Figma" },
  { id: "upload-project", icon: Upload, label: "Upload a Project" },
  { id: "landing-page", icon: LayoutDashboard, label: "Landing Page" },
];

export default function Ai04({
  onSubmit,
}: {
  onSubmit?: (prompt: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState({
    autoComplete: true,
    streaming: false,
    showHistory: false,
  });

  const generateFileId = () => Math.random().toString(36).substring(7);
  const processFiles = (files: File[]) => {
    for (const file of files) {
      const fileId = generateFileId();
      const attachedFile: AttachedFile = {
        id: fileId,
        name: file.name,
        file,
      };

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setAttachedFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, preview: reader.result as string } : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      setAttachedFiles((prev) => [...prev, attachedFile]);
    }
  };
  const submitPrompt = () => {
    if (prompt.trim() && onSubmit) {
      onSubmit(prompt.trim());
      setPrompt("");
    }
  };
  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPrompt();
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitPrompt();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      <h1 className="text-pretty text-center font-semibold text-[29px] text-gray-900 tracking-tighter sm:text-[32px] md:text-[46px]">
        Prompt. Refine. Ship.
      </h1>
      <h2 className="-my-5 pb-4 text-center text-xl text-gray-500">
        Build real, working software just by describing it
      </h2>

      <div className="relative z-10 flex flex-col w-full mx-auto max-w-2xl content-center">
        <form
          className="overflow-visible rounded-xl border border-gray-200 bg-white p-2 transition-colors duration-200 focus-within:border-violet-400"
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onSubmit={handleSubmit}
        >
          {attachedFiles.length > 0 && (
            <div className="relative flex w-fit items-center gap-2 mb-2 overflow-hidden">
              {attachedFiles.map((file) => (
                <Badge
                  variant="outline"
                  className="group relative h-6 max-w-30 cursor-pointer overflow-hidden text-[13px] transition-colors hover:bg-gray-100 px-0 border-gray-200 text-gray-700"
                  key={file.id}
                >
                  <span className="flex h-full items-center gap-1.5 overflow-hidden pl-1 font-normal">
                    <div className="relative flex h-4 min-w-4 items-center justify-center">
                      {file.preview ? (
                        <Image
                          alt={file.name}
                          className="absolute inset-0 h-4 w-4 rounded border object-cover"
                          src={file.preview}
                          width={16}
                          height={16}
                        />
                      ) : (
                        <Paperclip className="opacity-60" size={12} />
                      )}
                    </div>
                    <span className="inline overflow-hidden truncate pr-1.5 transition-all">
                      {file.name}
                    </span>
                  </span>
                  <button
                    className="absolute right-1 z-10 rounded-sm p-0.5 text-gray-500 opacity-0 focus-visible:bg-gray-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-violet-400 group-hover:opacity-100"
                    onClick={() => handleRemoveFile(file.id)}
                    type="button"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <Textarea
            className="max-h-50 min-h-12 resize-none rounded-none border-none bg-white p-0 text-sm text-gray-900 placeholder:text-gray-400 shadow-none focus-visible:border-transparent focus-visible:ring-0"
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            value={prompt}
          />

          <div className="flex items-center gap-1">
            <div className="flex items-end gap-0.5 sm:gap-1">
              <input
                className="sr-only"
                multiple
                onChange={handleFileSelect}
                ref={fileInputRef}
                type="file"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="ml-[-2px] h-7 w-7 rounded-md text-gray-600 hover:bg-gray-100"
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <Plus size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="max-w-xs rounded-2xl p-1.5 bg-white"
                >
                  <DropdownMenuGroup className="space-y-1">
                    <DropdownMenuItem
                      className="rounded-[calc(1rem-6px)] text-xs text-gray-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="text-gray-500" size={16} />
                        <span>Attach Files</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-[calc(1rem-6px)] text-xs text-gray-700">
                      <div className="flex items-center gap-2">
                        <Link className="text-gray-500" size={16} />
                        <span>Import from URL</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-[calc(1rem-6px)] text-xs text-gray-700">
                      <div className="flex items-center gap-2">
                        <Clipboard className="text-gray-500" size={16} />
                        <span>Paste from Clipboard</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-[calc(1rem-6px)] text-xs text-gray-700">
                      <div className="flex items-center gap-2">
                        <LayoutTemplate className="text-gray-500" size={16} />
                        <span>Use Template</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="size-7 rounded-md text-gray-600 hover:bg-gray-100"
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <SlidersHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-48 rounded-2xl p-3 bg-white"
                >
                  <DropdownMenuGroup className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-gray-500" size={16} />
                        <Label className="text-xs text-gray-700">Auto-complete</Label>
                      </div>
                      <Switch
                        checked={settings.autoComplete}
                        className="scale-75"
                        onCheckedChange={(value) =>
                          updateSetting("autoComplete", value)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Play className="text-gray-500" size={16} />
                        <Label className="text-xs text-gray-700">Streaming</Label>
                      </div>
                      <Switch
                        checked={settings.streaming}
                        className="scale-75"
                        onCheckedChange={(value) =>
                          updateSetting("streaming", value)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <History className="text-gray-500" size={16} />
                        <Label className="text-xs text-gray-700">Show History</Label>
                      </div>
                      <Switch
                        checked={settings.showHistory}
                        className="scale-75"
                        onCheckedChange={(value) =>
                          updateSetting("showHistory", value)
                        }
                      />
                    </div>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
              <Button
                className="h-7 w-7 rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
                disabled={!prompt.trim()}
                size="icon"
                type="submit"
                variant="default"
              >
                <ArrowUp size={16} />
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center pointer-events-none z-20 rounded-[inherit] border border-gray-300 border-dashed bg-gray-100 text-gray-700 text-sm transition-opacity duration-200",
              isDragOver ? "opacity-100" : "opacity-0"
            )}
          >
            <span className="flex w-full items-center justify-center gap-1 font-medium">
              <CirclePlus className="min-w-4" size={16} />
              Drop files here to add as attachments
            </span>
          </div>
        </form>
      </div>

      <div className="max-w-250 mx-auto flex-wrap gap-3 flex min-h-0 shrink-0 items-center justify-center">
        {ACTIONS.map((action) => (
          <Button
            className="gap-2 rounded-full border-gray-200 text-gray-700 bg-white hover:bg-gray-100"
            key={action.id}
            size="sm"
            variant="outline"
          >
            <action.icon size={16} />
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
