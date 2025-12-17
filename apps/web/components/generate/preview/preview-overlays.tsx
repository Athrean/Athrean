"use client";

import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Building preview..." }: LoadingOverlayProps): React.ReactElement {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-full px-6 py-3 flex items-center gap-3 shadow-xl">
        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
        <span className="text-sm font-medium text-zinc-300">{message}</span>
      </div>
    </div>
  );
}

export function UpdatingOverlay(): React.ReactElement {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/20 backdrop-blur-[1px]">
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
        <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
        <span className="text-xs font-medium text-zinc-300">Updating...</span>
      </div>
    </div>
  );
}

interface SlowWarningOverlayProps {
  onRestart: () => void;
}

export function SlowWarningOverlay({ onRestart }: SlowWarningOverlayProps): React.ReactElement {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80">
      <div className="text-center max-w-sm mx-auto p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-zinc-200 font-medium mb-2">Taking longer than expected</h3>
        <p className="text-sm text-zinc-500 mb-6">
          The preview is having trouble loading. This might be due to complex code or network issues.
        </p>
        <Button onClick={onRestart} variant="outline" className="w-full gap-2">
          <RefreshCw className="w-4 h-4" />
          Restart Preview
        </Button>
      </div>
    </div>
  );
}
