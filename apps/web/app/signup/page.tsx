"use client"

import Link from "next/link"
import { Suspense } from "react"
import { signup } from "../auth/actions"
import {
  AuthLayout,
  OAuthButtons,
  EmailForm,
  Divider,
  AuthMessage,
} from "@/components/auth"

function SignupContent(): React.ReactElement {
  return (
    <>
      <div className="mb-10 text-center">
        <h2 className="text-[44px] leading-[1.1] font-medium text-zinc-900 tracking-tight mb-4">
          Create an account
        </h2>
        <p className="text-[15px] text-gray-500 leading-relaxed">
          Join us and start your journey today.
        </p>
      </div>

      <AuthMessage />
      <OAuthButtons mode="signup" />
      <Divider />
      <EmailForm action={signup} buttonText="Sign up with email" />

      <p className="text-center text-[15px] text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-black font-bold hover:text-gray-700 transition-colors"
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
