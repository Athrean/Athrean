import { createServerClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"
import type { Database } from "./types"

/**
 * Creates a Supabase server client that can read cookies from the incoming
 * request and write any changes (including PKCE code verifier/session tokens)
 * to the outgoing response when available.
 */
export async function createClient(
  request?: NextRequest,
  response?: NextResponse,
): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request ? request.cookies.getAll() : cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          if (response) {
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, options)
            }
            return
          }

          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  })
}
