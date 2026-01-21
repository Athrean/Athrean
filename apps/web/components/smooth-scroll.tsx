"use client"

import { ReactLenis } from "@studio-freight/react-lenis"

// Type assertion needed due to @studio-freight/react-lenis using outdated React types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const LenisComponent = ReactLenis as any
    return (
        <LenisComponent root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children}
        </LenisComponent>
    )
}
