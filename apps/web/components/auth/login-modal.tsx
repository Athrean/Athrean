"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, CheckCircle2 } from "lucide-react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { login } from "@/app/auth/actions"
import { OAuthButtons } from "./oauth-buttons"
import { EmailForm } from "./email-form"
import { Divider } from "./divider"
import { AuthMessage } from "./auth-message"
import { TurnstileWidget, type TurnstileWidgetRef } from "./turnstile-widget"

const WireframeHead = dynamic(
  () => import("@/components/landing/wireframe-head").then((mod) => mod.WireframeHead),
  { ssr: false }
)

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps): React.ReactElement {
  const turnstileRef = useRef<TurnstileWidgetRef>(null)
  const [turnstileStatus, setTurnstileStatus] = useState<"pending" | "success" | "error">("pending")

  const getTurnstileToken = useCallback(() => {
    return turnstileRef.current?.getToken() ?? null
  }, [])

  const handleTurnstileVerify = (token: string) => {
    setTurnstileStatus("success")
  }

  const handleTurnstileError = () => {
    setTurnstileStatus("error")
  }

  const handleTurnstileExpire = () => {
    setTurnstileStatus("pending")
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      window.addEventListener("keydown", handleEscape)
    }
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] max-h-[85vh] overflow-hidden"
          >
            <div className="relative flex rounded-2xl border border-zinc-800 bg-black shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left side - Branding with 3D cube */}
              <div className="hidden md:flex md:flex-col w-[45%] relative overflow-hidden min-h-[480px] bg-black">
                {/* Logo at top */}
                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src="/logo.png"
                      alt="Athrean"
                      width={28}
                      height={28}
                      className="w-7 h-7"
                    />
                    <span className="text-base font-medium tracking-[0.15em] text-white/90">
                      ATHREAN
                    </span>
                  </div>
                </div>

                {/* 3D Cube in middle */}
                <div className="relative flex-1 min-h-[220px]">
                  <WireframeHead />
                </div>

                {/* Text content below the cube */}
                <div className="relative z-10 p-6 pt-0 pb-24 flex flex-col items-center text-center">
                  <h1 className="text-xl leading-tight font-medium text-white">
                    Vibe. Build. Ship.
                  </h1>
                  <h1 className="text-xl leading-tight font-medium text-teal-400 mt-1">
                    That Fast.
                  </h1>
                </div>
              </div>

              {/* Right side - Login form */}
              <div className="flex-1 bg-black p-8 md:p-10 flex flex-col justify-center">
                <div className="max-w-[340px] mx-auto w-full">
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl font-medium text-white tracking-tight mb-2">
                      Welcome to{" "}
                      <span className="tracking-widest">ATHREAN</span>
                    </h2>
                    <p className="text-sm text-zinc-400">Sign in to your account</p>
                  </div>

                  <AuthMessage />
                  <OAuthButtons />
                  <Divider />
                  <EmailForm
                    action={login}
                    buttonText="Sign in with email"
                    getTurnstileToken={getTurnstileToken}
                  />



                  <div className="flex justify-center min-h-[65px] items-center">
                    <div className={turnstileStatus === "success" ? "hidden" : "block"}>
                      <TurnstileWidget
                        ref={turnstileRef}
                        onVerify={handleTurnstileVerify}
                        onError={handleTurnstileError}
                        onExpire={handleTurnstileExpire}
                        className="filter grayscale-[0.8] hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100"
                      />
                    </div>

                    {turnstileStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-2 border border-teal-500/20"
                      >
                        <CheckCircle2 className="w-5 h-5 text-teal-400" />
                        <span className="text-sm font-medium text-teal-200">Security Check Passed</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-6 text-center">
                    <p className="text-xs text-zinc-500">
                      By signing in, you agree to our
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-xs mt-1">
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
