"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

function getEmailFromFormData(formData: FormData): string | null {
  const email = formData.get("email")
  if (typeof email !== "string" || !email.trim()) {
    return null
  }
  return email.trim()
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
}

export async function login(formData: FormData): Promise<never> {
  const email = getEmailFromFormData(formData)

  if (!email) {
    redirect("/login?error=" + encodeURIComponent("Email is required"))
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  })

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message))
  }

  revalidatePath("/", "layout")
  redirect("/login?message=" + encodeURIComponent("Check your email for the login link"))
}

export async function signup(formData: FormData): Promise<never> {
  const email = getEmailFromFormData(formData)

  if (!email) {
    redirect("/signup?error=" + encodeURIComponent("Email is required"))
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  })

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message))
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
