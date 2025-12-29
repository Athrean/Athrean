"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface ComponentPreviewProps {
  code: string;
  name?: string;
  dependencies?: Record<string, string>;
  theme?: 'light' | 'dark';
}

export function ComponentPreview({ name, theme = 'light' }: ComponentPreviewProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  // Use local preview route with theme parameter
  const previewUrl = name ? `/legos/preview/${name}?theme=${theme}` : null;

  const handleRefresh = () => {
    setIsLoading(true);
    setKey(k => k + 1);
  };

  if (!previewUrl) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-zinc-100 text-zinc-500">
        <p className="text-sm">No preview available</p>
      </div>
    );
  }

  const bgColor = theme === 'dark' ? 'bg-zinc-900' : 'bg-white';
  const loaderBg = theme === 'dark' ? 'bg-zinc-900' : 'bg-white';

  return (
    <div className={`h-full w-full relative ${bgColor}`}>
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center ${loaderBg} z-10`}>
          <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
        </div>
      )}

      <iframe
        key={`${key}-${theme}`}
        src={previewUrl}
        className={`w-full h-full border-0 ${bgColor}`}
        onLoad={() => setIsLoading(false)}
        title={`Preview of ${name}`}
        sandbox="allow-scripts allow-same-origin"
      />

      <button
        onClick={handleRefresh}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-white/90 hover:bg-white border border-zinc-200 shadow-sm z-20 opacity-0 hover:opacity-100 transition-opacity"
        title="Refresh preview"
      >
        <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
      </button>
    </div>
  );
}
