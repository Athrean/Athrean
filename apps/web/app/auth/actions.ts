"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { verifyTurnstileToken, getClientIp } from "@/lib/turnstile"
import { rateLimit, AUTH_RATE_LIMIT } from "@/lib/rate-limit"

function getEmailFromFormData(formData: FormData): string | null {
  const email = formData.get("email")
  if (typeof email !== "string" || !email.trim()) {
    return null
  }
  return email.trim()
}

function getTurnstileToken(formData: FormData): string {
  const token = formData.get("turnstile_token")
  return typeof token === "string" ? token : ""
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
}

/**
 * Sanitize error messages to avoid leaking internal details
 */
function sanitizeAuthError(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Common Supabase errors that can be shown safely
  if (lowerMessage.includes("invalid email")) {
    return "Please enter a valid email address"
  }
  if (lowerMessage.includes("email not confirmed")) {
    return "Please check your email to confirm your account"
  }
  if (lowerMessage.includes("rate limit") || lowerMessage.includes("too many requests")) {
    return "Too many attempts. Please try again later."
  }
  if (lowerMessage.includes("user already registered")) {
    return "An account with this email already exists"
  }

  // Default generic error - don't leak internal details
  return "Something went wrong. Please try again."
}

export async function login(formData: FormData): Promise<never> {
  const headersList = await headers()
  const clientIp = getClientIp(headersList)

  // Rate limiting
  const rateLimitResult = rateLimit(
    clientIp ?? "unknown",
    AUTH_RATE_LIMIT
  )
  if (!rateLimitResult.success) {
    redirect("/login?error=" + encodeURIComponent("Too many attempts. Please try again later."))
  }

  const email = getEmailFromFormData(formData)

  if (!email) {
    redirect("/login?error=" + encodeURIComponent("Email is required"))
  }

  // Verify Turnstile token
  const turnstileToken = getTurnstileToken(formData)
  const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIp)

  if (!turnstileResult.success) {
    redirect("/login?error=" + encodeURIComponent(turnstileResult.error ?? "Security verification failed"))
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  })

  if (error) {
    redirect("/login?error=" + encodeURIComponent(sanitizeAuthError(error.message)))
  }

  revalidatePath("/", "layout")
  redirect("/login?message=" + encodeURIComponent("Check your email for the login link"))
}

export async function signup(formData: FormData): Promise<never> {
  const headersList = await headers()
  const clientIp = getClientIp(headersList)

  // Rate limiting
  const rateLimitResult = rateLimit(
    clientIp ?? "unknown",
    AUTH_RATE_LIMIT
  )
  if (!rateLimitResult.success) {
    redirect("/signup?error=" + encodeURIComponent("Too many attempts. Please try again later."))
  }

  const email = getEmailFromFormData(formData)

  if (!email) {
    redirect("/signup?error=" + encodeURIComponent("Email is required"))
  }

  // Verify Turnstile token
  const turnstileToken = getTurnstileToken(formData)
  const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIp)

  if (!turnstileResult.success) {
    redirect("/signup?error=" + encodeURIComponent(turnstileResult.error ?? "Security verification failed"))
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  })

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(sanitizeAuthError(error.message)))
  }

  revalidatePath("/", "layout")
  redirect("/signup?message=" + encodeURIComponent("Check your email for the signup link"))
}

export async function signout(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
