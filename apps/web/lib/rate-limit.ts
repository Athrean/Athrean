/**
 * In-Memory Rate Limiting for API Routes
 *
 * Simple, no external dependencies rate limiter.
 * Pattern adapted from 1ai-develop/backend/ratelimitter.ts
 */

// ============================================================================
// TYPES
// ============================================================================

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  maxRequests: number

  /**
   * Time window in milliseconds
   */
  windowMs: number

  /**
   * Identifier for the rate limit (e.g., 'generate', 'api')
   */
  identifier?: string
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  success: boolean

  /**
   * Maximum requests allowed
   */
  limit: number

  /**
   * Remaining requests in current window
   */
  remaining: number

  /**
   * Time in ms until the rate limit resets
   */
  resetIn: number

  /**
   * Error message if rate limited
   */
  error?: string
}

// ============================================================================
// IN-MEMORY RATE LIMITER
// ============================================================================

interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private static instance: RateLimiter | null = null
  private store: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: ReturnType<typeof setInterval> | null = null

  private constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.store.entries()) {
        if (entry.resetAt < now) {
          this.store.delete(key)
        }
      }
    }, 60 * 1000)

    // Allow process to exit even if timer is running
    if (typeof this.cleanupInterval.unref === 'function') {
      this.cleanupInterval.unref()
    }
  }

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  limit(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now()
    const entry = this.store.get(key)

    // If no entry or expired, create new window
    if (!entry || entry.resetAt < now) {
      this.store.set(key, {
        count: 1,
        resetAt: now + config.windowMs,
      })
      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        resetIn: config.windowMs,
      }
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      const resetIn = entry.resetAt - now
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        resetIn,
        error: `Rate limit exceeded. Try again in ${Math.ceil(resetIn / 1000)} seconds.`,
      }
    }

    // Increment counter
    entry.count++
    this.store.set(key, entry)

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - entry.count,
      resetIn: entry.resetAt - now,
    }
  }

  /**
   * Get current stats for monitoring
   */
  getStats(): { activeKeys: number } {
    return { activeKeys: this.store.size }
  }

  /**
   * Clear all rate limit entries (for testing)
   */
  clear(): void {
    this.store.clear()
  }
}

// ============================================================================
// MAIN RATE LIMIT FUNCTION
// ============================================================================

/**
 * Check rate limit for a given identifier
 *
 * @param identifier - Unique identifier (e.g., user ID, IP address)
 * @param config - Rate limit configuration
 * @returns RateLimitResult with success status
 *
 * @example
 * ```ts
 * const result = rateLimit(userId, {
 *   maxRequests: 30,
 *   windowMs: 60 * 1000, // 1 minute
 *   identifier: 'generate'
 * })
 *
 * if (!result.success) {
 *   return Response.json({ error: result.error }, { status: 429 })
 * }
 * ```
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const prefix = config.identifier ?? 'rl'
  const key = `${prefix}:${identifier}`
  return RateLimiter.getInstance().limit(key, config)
}

// ============================================================================
// PRESET CONFIGURATIONS (matching 1ai-develop patterns)
// ============================================================================

/**
 * Rate limit for generation endpoints
 * 30 requests per minute (like 1ai-develop)
 */
export const GENERATE_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 30,
  windowMs: 60 * 1000,
  identifier: 'generate',
}

/**
 * Rate limit for free tier users
 * 10 requests per minute
 */
export const FREE_TIER_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000,
  identifier: 'free',
}

/**
 * Rate limit for premium users
 * 100 requests per minute
 */
export const PREMIUM_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000,
  identifier: 'premium',
}

/**
 * Strict rate limit for auth endpoints
 * 5 requests per minute
 */
export const AUTH_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 60 * 1000,
  identifier: 'auth',
}

/**
 * Hourly rate limit (like 1ai-develop perHourLimiter)
 * 100 requests per hour
 */
export const HOURLY_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 60 * 1000,
  identifier: 'hourly',
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetIn / 1000).toString(),
  }
}

/**
 * Create rate limit error response
 */
export function rateLimitErrorResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'RATE_LIMIT_EXCEEDED',
      message: result.error,
      retryAfter: Math.ceil(result.resetIn / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil(result.resetIn / 1000).toString(),
        ...getRateLimitHeaders(result),
      },
    }
  )
}

/**
 * Extract identifier from request (IP or user ID)
 */
export function getRequestIdentifier(request: Request, userId?: string | null): string {
  // Prefer user ID if authenticated
  if (userId) {
    return `user:${userId}`
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ?? 'anonymous'
  return `ip:${ip}`
}

/**
 * Get rate limit config based on user tier
 */
export function getRateLimitForTier(isPremium: boolean): RateLimitConfig {
  return isPremium ? PREMIUM_RATE_LIMIT : FREE_TIER_RATE_LIMIT
}
