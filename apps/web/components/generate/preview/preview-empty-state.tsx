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
        <div className="flex flex-col h-full relative bg-zinc-950">
            <PreviewHeader
                activeTab={activeTab}
                device={device}
                onTabChange={onTabChange}
                onDeviceChange={onDeviceChange}
                onRestart={onRestart}
            />

            <div className="flex-1 min-h-0 relative p-4 pt-2 bg-zinc-950">
                <div className="w-full h-full rounded-xl overflow-hidden relative border border-zinc-800 shadow-2xl flex flex-col items-center justify-center gap-12 bg-zinc-950">
                    <div className="flex flex-col items-center gap-12">
                        <div className="scale-90 md:scale-100">
                            <CardStack items={previewCards} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
