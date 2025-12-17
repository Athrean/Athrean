"use client";

import { useState, useEffect, useMemo } from "react";
import type { PreviewPanelProps, Tab, Device } from "./preview/types";
import { PreviewHeader } from "./preview/preview-header";
import { SandpackWrapper, buildFiles } from "./preview/sandpack-wrapper";
import { saveComponent } from "@/app/actions/component";
import { toast } from "sonner";
import { LoadingOverlay, UpdatingOverlay, SlowWarningOverlay } from "./preview/preview-overlays";
import { PreviewEmptyState } from "./preview/preview-empty-state";

export function PreviewPanel({ code, isLoading }: PreviewPanelProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [device, setDevice] = useState<Device>("desktop");
  const [instanceKey, setInstanceKey] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showSlowWarning, setShowSlowWarning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const files = useMemo(() => (code ? buildFiles(code) : null), [code]);

  useEffect(() => {
    setIsReady(false);
    setShowSlowWarning(false);
    const timer = setTimeout(() => setShowSlowWarning(true), 12000);
    return () => clearTimeout(timer);
  }, [code, instanceKey]);

  useEffect(() => {
    if (isReady) setShowSlowWarning(false);
  }, [isReady]);

  const handleRestart = (): void => setInstanceKey((k) => k + 1);
  const handleReady = (): void => setIsReady(true);

  const handleSave = async (): Promise<void> => {
    if (!code || isSaving) return;

    setIsSaving(true);
    try {
      const result = await saveComponent({
        name: `Generated Component ${new Date().toLocaleTimeString()}`,
        code: code,
        source: 'generated',
        isPublic: false
      });

      if (result.error) {
        toast.error("Failed to save project");
      } else {
        toast.success("Project saved successfully");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (!code && !isLoading) {
    return (
      <PreviewEmptyState
        activeTab={activeTab}
        device={device}
        onTabChange={setActiveTab}
        onDeviceChange={setDevice}
        onRestart={handleRestart}
        message="Getting ready..."
      />
    );
  }

  if (isLoading && !code) {
    return (
      <PreviewEmptyState
        activeTab={activeTab}
        device={device}
        onTabChange={setActiveTab}
        onDeviceChange={setDevice}
        onRestart={handleRestart}
        message="Generating preview..."
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 relative">
      <PreviewHeader
        activeTab={activeTab}
        device={device}
        onTabChange={setActiveTab}
        onDeviceChange={setDevice}
        onRestart={handleRestart}
        onSave={handleSave}
      />

      <div className="flex-1 min-h-0 relative bg-zinc-950 p-6 pt-2">
        <div className="w-full h-full bg-zinc-950 rounded-xl overflow-hidden relative border border-zinc-800 shadow-2xl">
          {activeTab === "preview" && files && (
            <SandpackWrapper
              files={files}
              instanceKey={instanceKey}
              device={device}
              onReady={handleReady}
              onReset={handleRestart}
            />
          )}

          {activeTab === "code" && code && (
            <div className="h-full overflow-auto p-4 bg-zinc-950">
              <pre className="text-sm font-mono leading-relaxed text-zinc-300 whitespace-pre-wrap">
                {code}
              </pre>
            </div>
          )}

          {!isReady && activeTab === "preview" && !showSlowWarning && <LoadingOverlay />}
          {isLoading && code && <UpdatingOverlay />}
          {!isReady && showSlowWarning && activeTab === "preview" && (
            <SlowWarningOverlay onRestart={handleRestart} />
          )}
        </div>
      </div>

      <style jsx global>{`
        .sp-wrapper, .sp-layout, .sp-preview-container, .sp-preview, .sp-preview-iframe, .sp-stack {
          height: 100% !important;
          background: transparent !important;
        }
        .sp-preview-iframe {
          border: none;
        }
      `}</style>
    </div>
  );
}
