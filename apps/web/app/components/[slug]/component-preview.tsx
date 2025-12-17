"use client";

import { useState, useEffect, useMemo, Component, type ReactNode } from "react";
import {
  SandpackProvider,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

interface ComponentPreviewProps {
  code: string;
  dependencies?: Record<string, string>;
}

// ============================================================================
// Error Boundary
// ============================================================================

class PreviewErrorBoundary extends Component<
  { children: ReactNode; onReset?: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onReset?: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <button
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onReset?.();
            }}
            className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// Bundler Listener
// ============================================================================

function BundlerListener({ onReady }: { onReady: () => void }): null {
  const { listen } = useSandpack();

  useEffect(() => {
    const unsubscribe = listen((msg) => {
      if (msg.type === "done" || (msg.type === "status" && msg.status === "done")) {
        onReady();
      }
    });
    return () => unsubscribe();
  }, [listen, onReady]);

  return null;
}

// ============================================================================
// Files Builder
// ============================================================================

function buildFiles(code: string): Record<string, string> {
  return {
    "/App.tsx": `import Generated from "./Generated";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <Generated />
    </div>
  );
}`,
    "/Generated.tsx": code,
  };
}

// ============================================================================
// Main Component
// ============================================================================

export function ComponentPreview({ code, dependencies = {} }: ComponentPreviewProps): React.ReactElement {
  const [instanceKey, setInstanceKey] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showSlowWarning, setShowSlowWarning] = useState(false);

  const files = useMemo(() => buildFiles(code), [code]);

  useEffect(() => {
    setIsReady(false);
    setShowSlowWarning(false);
    const timer = setTimeout(() => setShowSlowWarning(true), 10000);
    return () => clearTimeout(timer);
  }, [instanceKey, code]);

  useEffect(() => {
    if (isReady) setShowSlowWarning(false);
  }, [isReady]);

  const handleRestart = () => setInstanceKey((k) => k + 1);
  const handleReady = () => setIsReady(true);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <span className="text-sm font-medium text-zinc-400">Live Preview</span>
        <button
          onClick={handleRestart}
          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="h-[400px] bg-zinc-950 relative">
        <PreviewErrorBoundary onReset={handleRestart}>
          <SandpackProvider
            key={instanceKey}
            template="react-ts"
            files={files}
            theme="dark"
            options={{
              externalResources: ["https://cdn.tailwindcss.com"],
              recompileMode: "delayed",
              recompileDelay: 400,
            }}
            customSetup={{
              dependencies: {
                "framer-motion": "^10.18.0",
                "lucide-react": "^0.400.0",
                ...dependencies,
              },
            }}
            style={{ height: "100%" }}
          >
            <BundlerListener onReady={handleReady} />
            <SandpackPreview
              showNavigator={false}
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              style={{ height: "100%" }}
            />
          </SandpackProvider>
        </PreviewErrorBoundary>

        {!isReady && !showSlowWarning && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 z-10">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          </div>
        )}

        {!isReady && showSlowWarning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/95 z-20 p-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mb-2" />
            <p className="text-xs text-zinc-400 mb-3">Taking too long</p>
            <button
              onClick={handleRestart}
              className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3" />
              Restart
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .sp-wrapper, .sp-layout, .sp-preview-container, .sp-preview, .sp-preview-iframe, .sp-stack {
          height: 100% !important;
        }
        .sp-layout {
          border: none !important;
          background: transparent !important;
        }
      `}</style>
    </div>
  );
}
