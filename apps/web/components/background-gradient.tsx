"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Dynamic import to avoid SSR issues with Three.js
const Dither = dynamic(() => import("./backgrounds/Dither"), {
    ssr: false
});

export function BackgroundGradient() {
    const pathname = usePathname();

    if (pathname.startsWith("/generate")) {
        return null;
    }

    return (
        <div className="fixed inset-0 w-full h-full -z-10 bg-[#0a0a0a]">
            <Dither
                waveColor={[0.18, 0.62, 0.58]}
                waveSpeed={0.05}
                waveFrequency={3}
                waveAmplitude={0.3}
                colorNum={4}
                pixelSize={2}
                enableMouseInteraction={true}
                mouseRadius={0.3}
            />
        </div>
    );
}
