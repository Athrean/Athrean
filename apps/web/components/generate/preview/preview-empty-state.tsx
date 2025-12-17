import { Loader2 } from "lucide-react"
import { CardStack } from "@/components/ui/card-stack"
import { PreviewHeader } from "./preview-header"
import { previewCards } from "./constants"
import type { Tab, Device } from "./types"

interface PreviewEmptyStateProps {
    activeTab: Tab
    device: Device
    onTabChange: (tab: Tab) => void
    onDeviceChange: (device: Device) => void
    onRestart: () => void
    message: string
}

export function PreviewEmptyState({
    activeTab,
    device,
    onTabChange,
    onDeviceChange,
    onRestart,
    message,
}: PreviewEmptyStateProps): React.ReactElement {
    return (
        <div className="flex flex-col h-full bg-zinc-950 relative">
            <PreviewHeader
                activeTab={activeTab}
                device={device}
                onTabChange={onTabChange}
                onDeviceChange={onDeviceChange}
                onRestart={onRestart}
            />

            <div className="flex-1 min-h-0 relative bg-zinc-950 p-6 pt-2">
                <div className="w-full h-full bg-zinc-950 rounded-xl overflow-hidden relative border border-zinc-800 shadow-2xl flex flex-col items-center justify-center gap-12">
                    <div className="flex flex-col items-center gap-12">
                        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/90 backdrop-blur-md rounded-full border border-zinc-800 shadow-xl">
                            <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
                            <span className="text-sm text-zinc-400 font-medium">{message}</span>
                        </div>

                        <div className="scale-90 md:scale-100">
                            <CardStack items={previewCards} />
                        </div>
                    </div>

                    <div className="text-center space-y-2 max-w-md mx-auto px-4 z-10">
                        <h3 className="text-xl font-semibold text-zinc-100">Athrean Cloud</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Describe features, get full apps. Data, hosting, auth, AI included.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
