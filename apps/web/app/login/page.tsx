"use client"

import { Suspense, useRef, useCallback } from "react"
import { login } from "../auth/actions"
import {
  AuthLayout,
  OAuthButtons,
  EmailForm,
  Divider,
  AuthMessage,
  TurnstileWidget,
} from "@/components/auth"
import type { TurnstileWidgetRef } from "@/components/auth/turnstile-widget"

function LoginContent(): React.ReactElement {
  const turnstileRef = useRef<TurnstileWidgetRef>(null)

  const getTurnstileToken = useCallback(() => {
    return turnstileRef.current?.getToken() ?? null
  }, [])

  return (
    <>
      <div className="mb-8 text-center">
        <h2 className="text-[28px] leading-[1.1] font-medium text-white tracking-tight mb-2">
          Welcome to <span className="tracking-[0.12em]">ATHREAN</span>
        </h2>
        <p className="text-[15px] text-zinc-400 leading-relaxed">
          Sign in to your account
        </p>
      </div>

      <AuthMessage />
      <OAuthButtons />
      <Divider />
      <EmailForm
        action={login}
        buttonText="Sign in with email"
        getTurnstileToken={getTurnstileToken}
      />

      <div className="flex justify-center">
        <TurnstileWidget ref={turnstileRef} />
      </div>
    </>
  )
}

export default function LoginPage(): React.ReactElement {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <LoginContent />
      </Suspense>
    </AuthLayout>
  )
}
