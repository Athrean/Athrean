import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type")
  const next = searchParams.get("next") ?? searchParams.get("redirect") ?? "/"
  const redirectUrl = new URL(next, origin)

  if (!code && !tokenHash) {
    // If the user already has a session, skip erroring and just continue.
    const supabase = await createClient(request)
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      return NextResponse.redirect(redirectUrl)
    }

    const errorUrl = new URL("/auth/error", origin)
    errorUrl.searchParams.set("error", "Missing authorization code")
    return NextResponse.redirect(errorUrl)
  }

  // Ensure PKCE cookies from the request are forwarded and any new session
  // cookies from Supabase are attached to the redirect response.
  const response = NextResponse.redirect(redirectUrl)
  const supabase = await createClient(request, response)
  let error = null

  if (code) {
    ;({ error } = await supabase.auth.exchangeCodeForSession(code))
  } else if (tokenHash && type) {
    ;({ error } = await supabase.auth.verifyOtp({
      type: type as "magiclink" | "recovery" | "invite" | "email_change",
      token_hash: tokenHash,
    }))
  } else {
    error = { message: "Missing authorization code" }
  }

  if (error) {
    const errorUrl = new URL("/auth/error", origin)
    errorUrl.searchParams.set("error", error.message)
    return NextResponse.redirect(errorUrl)
  }

  return response
}
