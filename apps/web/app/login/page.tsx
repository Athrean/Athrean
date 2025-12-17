"use client"

import Link from "next/link"
import { Suspense } from "react"
import { login } from "../auth/actions"
import {
  AuthLayout,
  OAuthButtons,
  EmailForm,
  Divider,
  AuthMessage,
} from "@/components/auth"

function LoginContent(): React.ReactElement {
  return (
    <>
      <div className="mb-10 text-center">
        <h2 className="text-[44px] leading-[1.1] font-medium text-zinc-900 tracking-tight mb-4">
          Welcome back!
        </h2>
        <p className="text-[15px] text-gray-500 leading-relaxed">
          Your work, your team, your flow — all in one place.
        </p>
      </div>

      <AuthMessage />
      <OAuthButtons mode="signin" />
      <Divider />
      <EmailForm action={login} buttonText="Sign in with email" />

      <p className="text-center text-[15px] text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-black font-bold hover:text-gray-700 transition-colors"
        >
          Sign Up
        </Link>
      </p>
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
