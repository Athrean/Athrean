"use client";

import { RefreshCw, Smartphone, Tablet, Monitor, Share2, Code2, Eye, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  device,
  onTabChange,
  onDeviceChange,
  onRestart,
  onSave,
}: PreviewHeaderProps): React.ReactElement {
  const devices: Device[] = ["mobile", "tablet", "desktop"];

  return (
    <div className="relative h-14 shrink-0 flex items-center justify-between px-6 bg-zinc-950 z-20">
      {/* Left: View Toggle */}
      <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-full border border-zinc-800">
        <button
          onClick={() => onTabChange("preview")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
            activeTab === "preview"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
        <button
          onClick={() => onTabChange("code")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
            activeTab === "code"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Code2 className="w-3.5 h-3.5" />
          Code
        </button>
      </div>

      {/* Center: Device Toggles */}
      {activeTab === "preview" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 bg-zinc-950 p-1 rounded-full border border-zinc-800 shadow-xl z-30">
          {devices.map((d) => (
            <button
              key={d}
              onClick={() => onDeviceChange(d)}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                device === d
                  ? "bg-zinc-800 text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
              )}
              title={`View on ${d}`}
            >
              {d === "mobile" && <Smartphone className="w-4 h-4" />}
              {d === "tablet" && <Tablet className="w-4 h-4" />}
              {d === "desktop" && <Monitor className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onRestart}
          variant="ghost"
          size="sm"
          className="h-8 gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800 rounded-lg"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="text-xs">Refresh</span>
        </Button>

        {onSave && (
          <Button
            onClick={onSave}
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800 rounded-lg"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="text-xs">Save</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800 rounded-lg"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="text-xs">Export</span>
        </Button>
      </div>
    </div>
  );
}
