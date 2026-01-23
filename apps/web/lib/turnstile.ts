/**
 * Cloudflare Turnstile Server-Side Verification
 *
 * Verifies Turnstile tokens to protect against bots.
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export interface TurnstileVerifyResult {
  success: boolean
  "error-codes"?: string[]
  challenge_ts?: string
  hostname?: string
}

/**
 * Verify a Turnstile token server-side
 *
 * @param token - The token from the Turnstile widget
 * @param remoteIp - Optional IP address of the user
 * @returns Whether the token is valid
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  // In development, allow bypass if no secret key is set
  if (!secretKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Turnstile] No secret key set, skipping verification in development")
      return { success: true }
    }
    return { success: false, error: "Turnstile not configured" }
  }

  // Empty token means widget wasn't completed
  if (!token) {
    return { success: false, error: "Please complete the security check" }
  }

  try {
    const formData = new URLSearchParams()
    formData.append("secret", secretKey)
    formData.append("response", token)
    if (remoteIp) {
      formData.append("remoteip", remoteIp)
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      return { success: false, error: "Verification service unavailable" }
    }

    const result: TurnstileVerifyResult = await response.json()

    if (!result.success) {
      // Don't expose internal error codes to users
      return { success: false, error: "Security verification failed. Please try again." }
    }

    return { success: true }
  } catch {
    return { success: false, error: "Verification service unavailable" }
  }
}

/**
 * Get the client IP from request headers
 */
export function getClientIp(headers: Headers): string | undefined {
  // Cloudflare
  const cfIp = headers.get("cf-connecting-ip")
  if (cfIp) return cfIp

  // Standard proxied IP
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim()

  // Vercel
  const realIp = headers.get("x-real-ip")
  if (realIp) return realIp

  return undefined
}
