"use client"

import Link from "next/link"
import { Suspense, useRef, useCallback } from "react"
import { signup } from "../auth/actions"
import {
  AuthLayout,
  OAuthButtons,
  EmailForm,
  Divider,
  AuthMessage,
  TurnstileWidget,
} from "@/components/auth"
import type { TurnstileWidgetRef } from "@/components/auth/turnstile-widget"

function SignupContent(): React.ReactElement {
  const turnstileRef = useRef<TurnstileWidgetRef>(null)

  const getTurnstileToken = useCallback(() => {
    return turnstileRef.current?.getToken() ?? null
  }, [])

  return (
    <>
      <div className="mb-8 text-center">
        <h2 className="text-[28px] leading-[1.1] font-medium text-white tracking-tight mb-2">
          Join <span className="tracking-[0.12em]">ATHREAN</span>
        </h2>
        <p className="text-[15px] text-zinc-400 leading-relaxed">
          Create your account to get started
        </p>
      </div>

      <AuthMessage />
      <OAuthButtons />
      <Divider />
      <EmailForm
        action={signup}
        buttonText="Sign up with email"
        getTurnstileToken={getTurnstileToken}
      />

      <div className="flex justify-center mb-6">
        <TurnstileWidget ref={turnstileRef} />
      </div>

      <p className="text-center text-[14px] text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-white font-medium hover:text-zinc-300 transition-colors"
        >
          Sign In
        </Link>
      </p>
    </>
  )
}

export default function SignupPage(): React.ReactElement {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <SignupContent />
      </Suspense>
    </AuthLayout>
  )
}
