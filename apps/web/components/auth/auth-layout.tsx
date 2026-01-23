"use client"

import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"

const WireframeHead = dynamic(
  () => import("@/components/landing/wireframe-head").then((mod) => mod.WireframeHead),
  { ssr: false }
)

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps): React.ReactElement {
  return (
    <div className="flex min-h-screen w-full bg-[#0a0a0f]">
      {/* Left side - Branding with 3D cube */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950">
        {/* 3D Cube Background */}
        <div className="absolute inset-0">
          <WireframeHead />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Athrean"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-semibold tracking-[0.2em] text-white/90">
              ATHREAN
            </span>
          </div>

          {/* Main tagline */}
          <div className="max-w-md">
            <h1 className="text-[2.5rem] leading-[1.15] font-medium text-white mb-6">
              Vibe. Build. Ship.
              <br />
              <span className="text-teal-400">That Fast.</span>
            </h1>
            <p className="text-[15px] leading-relaxed text-white/60 mb-8">
              Prompt it. Preview it. Ship it. Build production-ready
              apps with AI in seconds.
            </p>
          </div>

          {/* Empty spacer */}
          <div />
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex flex-1 flex-col lg:w-1/2 bg-[#0f0f14]">
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-[400px]">{children}</div>
        </div>

        {/* Footer links */}
        <div className="px-6 py-6 lg:px-16">
          <div className="mx-auto w-full max-w-[400px] flex items-center justify-center gap-4 text-xs text-zinc-500">
            <span>By signing in, you agree to our</span>
          </div>
          <div className="mx-auto w-full max-w-[400px] flex items-center justify-center gap-2 text-xs mt-1">
            <Link
              href="/terms"
              className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2"
            >
              Terms & Service
            </Link>
            <span className="text-zinc-600">and</span>
            <Link
              href="/privacy"
              className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
