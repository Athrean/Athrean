"use client"

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react"
import Script from "next/script"

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          "error-callback"?: () => void
          "expired-callback"?: () => void
          theme?: "light" | "dark" | "auto"
          size?: "normal" | "compact"
        }
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onTurnstileLoad?: () => void
  }
}

export interface TurnstileWidgetRef {
  getToken: () => string | null
  reset: () => void
}

import { cn } from "@/lib/utils"

interface TurnstileWidgetProps {
  onVerify?: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  className?: string
}

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  function TurnstileWidget({ onVerify, onError, onExpire, className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const tokenRef = useRef<string | null>(null)
    const scriptLoadedRef = useRef(false)

    const renderWidget = useCallback(() => {
      if (!containerRef.current || !window.turnstile) return
      if (widgetIdRef.current) return // Already rendered

      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          tokenRef.current = token
          onVerify?.(token)
        },
        "error-callback": () => {
          tokenRef.current = null
          onError?.()
        },
        "expired-callback": () => {
          tokenRef.current = null
          onExpire?.()
        },
        theme: "dark",
        size: "normal",
      })
    }, [onVerify, onError, onExpire])

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      getToken: () => tokenRef.current,
      reset: () => {
        tokenRef.current = null
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current)
        }
      },
    }), [])

    useEffect(() => {
      // If script is already loaded (from another instance), render immediately
      if (window.turnstile && !widgetIdRef.current) {
        renderWidget()
      }

      return () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        }
      }
    }, [renderWidget])

    const handleScriptLoad = useCallback(() => {
      scriptLoadedRef.current = true
      renderWidget()
    }, [renderWidget])

    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
          onLoad={handleScriptLoad}
        />
        <div
          ref={containerRef}
          className={cn("flex items-center justify-center min-h-[65px]", className)}
        />
      </>
    )
  }
)
