"use client";

import { RefreshCw, Globe, Code2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tab, Device } from "./types";

interface PreviewHeaderProps {
  activeTab: Tab;
  device: Device;
  onTabChange: (tab: Tab) => void;
  onDeviceChange: (device: Device) => void;
  onRestart: () => void;
  onSave?: () => void;
}

export function PreviewHeader({
  activeTab,
  onTabChange,
  onRestart,
}: PreviewHeaderProps): React.ReactElement {
  return (
    <div className="shrink-0 flex items-center justify-between h-12 px-4 bg-zinc-950">
      {/* Left: Tab Buttons - Lovable style pill buttons */}
      <div className="flex items-center gap-0.5 p-1 rounded-full border border-zinc-800 bg-zinc-900/50">
        {/* Preview Tab */}
        <button
          onClick={() => onTabChange("preview")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            activeTab === "preview"
              ? "text-white bg-zinc-900"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        {/* Code Tab */}
        <button
          onClick={() => onTabChange("code")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            activeTab === "code"
              ? "text-white bg-zinc-900"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>
      </div>

      {/* Center: URL bar style indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50">
        <span className="text-xs text-zinc-500 font-mono">/</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-0.5">
        <button
          className="p-2 rounded-lg hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-300 transition-colors"
          title="Export"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          onClick={onRestart}
          className="p-2 rounded-lg hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-300 transition-colors"
          title="Refresh preview"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
