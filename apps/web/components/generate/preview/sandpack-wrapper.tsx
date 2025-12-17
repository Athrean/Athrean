"use client";

import { useEffect, useState } from "react";
import { SandpackProvider, SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import type { Device } from "./types";
import { DEVICE_WIDTHS } from "./types";
import { PreviewErrorBoundary } from "./preview-error-boundary";

interface BundlerListenerProps {
  onReady: () => void;
  onError: (error: string) => void;
}

function BundlerListener({ onReady, onError }: BundlerListenerProps): null {
  const { listen } = useSandpack();

  useEffect(() => {
    const unsubscribe = listen((msg) => {
      if (msg.type === "done" || (msg.type === "status" && msg.status === "done")) {
        onReady();
      }
      if (msg.type === "action" && msg.action === "show-error") {
        onError(msg.message || "An error occurred in the preview");
      }
      if (msg.type === "console" && msg.log?.some((l) => l.method === "error")) {
        const errorLog = msg.log?.find((l) => l.method === "error");
        if (errorLog?.data?.[0]) {
          onError(String(errorLog.data[0]));
        }
      }
    });
    return () => unsubscribe();
  }, [listen, onReady, onError]);

  return null;
}

interface SandpackInnerProps {
  device: Device;
  onReady: () => void;
  onReset: () => void;
}

function SandpackInner({ device, onReady, onReset }: SandpackInnerProps): React.ReactElement {
  const [error, setError] = useState<string | null>(null);

  const handleError = (errorMsg: string): void => {
    setError(errorMsg);
  };

  const handleRetry = (): void => {
    setError(null);
    onReset();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <div className="text-center">
          <h3 className="text-sm font-medium text-zinc-200 mb-2">Preview Error</h3>
          <p className="text-xs text-zinc-400 max-w-md break-words line-clamp-4">{error}</p>
        </div>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <BundlerListener onReady={onReady} onError={handleError} />
      <SandpackPreview
        showNavigator={false}
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        style={{
          height: "100%",
          width: device === "desktop" ? "100%" : DEVICE_WIDTHS[device],
          margin: device === "desktop" ? 0 : "0 auto",
          border: device !== "desktop" ? "1px solid #3f3f46" : "none",
          borderRadius: device !== "desktop" ? 8 : 0,
          background: "#09090b",
        }}
      />
    </>
  );
}

export function buildFiles(code: string): Record<string, string> {
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

interface SandpackWrapperProps {
  files: Record<string, string>;
  instanceKey: number;
  device: Device;
  onReady: () => void;
  onReset: () => void;
}

export function SandpackWrapper({
  files,
  instanceKey,
  device,
  onReady,
  onReset,
}: SandpackWrapperProps): React.ReactElement {
  return (
    <PreviewErrorBoundary onReset={onReset}>
      <SandpackProvider
        key={instanceKey}
        template="react-ts"
        files={files}
        theme="dark"
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          recompileMode: "delayed",
          recompileDelay: 400,
          classes: {
            "sp-wrapper": "h-full",
            "sp-layout": "h-full",
            "sp-preview": "h-full",
          },
        }}
        customSetup={{
          dependencies: {
            "framer-motion": "^10.18.0",
            "lucide-react": "^0.400.0",
          },
        }}
        style={{ height: "100%" }}
      >
        <SandpackInner device={device} onReady={onReady} onReset={onReset} />
      </SandpackProvider>
    </PreviewErrorBoundary>
  );
}
