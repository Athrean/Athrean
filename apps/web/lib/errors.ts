/**
 * Standardized Error Handling
 *
 * Consistent error responses across all API routes.
 * Pattern adapted from 1ai-develop/backend/routes/ai.ts
 */

// ============================================================================
// ERROR CODES
// ============================================================================

export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Authorization errors
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  PREMIUM_REQUIRED: 'PREMIUM_REQUIRED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_MODEL: 'INVALID_MODEL',
  MISSING_PARAMETER: 'MISSING_PARAMETER',

  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  MODEL_NOT_FOUND: 'MODEL_NOT_FOUND',

  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  GENERATION_FAILED: 'GENERATION_FAILED',

  // Stream errors
  STREAM_ERROR: 'STREAM_ERROR',
  MAX_ITERATIONS: 'MAX_ITERATIONS',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

// ============================================================================
// ERROR RESPONSE TYPE
// ============================================================================

export interface ErrorResponse {
  error: ErrorCode
  message: string
  details?: Record<string, unknown>
}

// ============================================================================
// HTTP STATUS MAPPING
// ============================================================================

const errorStatusMap: Record<ErrorCode, number> = {
  [ErrorCodes.UNAUTHORIZED]: 401,
  [ErrorCodes.INVALID_TOKEN]: 401,
  [ErrorCodes.TOKEN_EXPIRED]: 401,
  [ErrorCodes.FORBIDDEN]: 403,
  [ErrorCodes.INSUFFICIENT_CREDITS]: 403,
  [ErrorCodes.PREMIUM_REQUIRED]: 403,
  [ErrorCodes.VALIDATION_ERROR]: 400,
  [ErrorCodes.INVALID_MODEL]: 400,
  [ErrorCodes.MISSING_PARAMETER]: 400,
  [ErrorCodes.RATE_LIMITED]: 429,
  [ErrorCodes.NOT_FOUND]: 404,
  [ErrorCodes.MODEL_NOT_FOUND]: 404,
  [ErrorCodes.INTERNAL_ERROR]: 500,
  [ErrorCodes.SERVICE_UNAVAILABLE]: 503,
  [ErrorCodes.GENERATION_FAILED]: 500,
  [ErrorCodes.STREAM_ERROR]: 500,
  [ErrorCodes.MAX_ITERATIONS]: 500,
}

// ============================================================================
// ERROR RESPONSE BUILDERS
// ============================================================================

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): Response {
  const status = errorStatusMap[code] ?? 500
  const body: ErrorResponse = { error: code, message }

  if (details) {
    body.details = details
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Create SSE error chunk for streaming responses
 */
export function createStreamError(
  code: ErrorCode,
  message: string
): string {
  return JSON.stringify({
    type: 'error',
    error: { code, message, retryable: isRetryable(code) },
  }) + '\n'
}

/**
 * Check if error is retryable
 */
export function isRetryable(code: ErrorCode): boolean {
  const retryableCodes: ErrorCode[] = [
    ErrorCodes.RATE_LIMITED,
    ErrorCodes.SERVICE_UNAVAILABLE,
    ErrorCodes.STREAM_ERROR,
  ]
  return retryableCodes.includes(code)
}

// ============================================================================
// COMMON ERROR RESPONSES (like 1ai-develop patterns)
// ============================================================================

/**
 * 401 Unauthorized - Not authenticated
 */
export function unauthorizedError(message = 'Authentication required'): Response {
  return createErrorResponse(ErrorCodes.UNAUTHORIZED, message)
}

/**
 * 403 Forbidden - Insufficient credits
 */
export function insufficientCreditsError(
  currentCredits: number,
  requiredCredits = 1
): Response {
  return createErrorResponse(
    ErrorCodes.INSUFFICIENT_CREDITS,
    'Insufficient credits. Please add more credits to continue.',
    { currentCredits, requiredCredits }
  )
}

/**
 * 403 Forbidden - Premium required
 */
export function premiumRequiredError(modelId: string): Response {
  return createErrorResponse(
    ErrorCodes.PREMIUM_REQUIRED,
    'This model requires a premium subscription.',
    { modelId, requiredTier: 'premium' }
  )
}

/**
 * 404 Not Found - Model not found
 */
export function modelNotFoundError(modelId: string, availableModels?: string[]): Response {
  return createErrorResponse(
    ErrorCodes.MODEL_NOT_FOUND,
    `Model '${modelId}' not found`,
    availableModels ? { availableModels: availableModels.slice(0, 10) } : undefined
  )
}

/**
 * 400 Bad Request - Validation error
 */
export function validationError(message: string, field?: string): Response {
  return createErrorResponse(
    ErrorCodes.VALIDATION_ERROR,
    message,
    field ? { field } : undefined
  )
}

/**
 * 429 Rate Limited
 */
export function rateLimitedError(retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({
      error: ErrorCodes.RATE_LIMITED,
      message: `Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`,
      retryAfter: retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfterSeconds.toString(),
      },
    }
  )
}

/**
 * 500 Internal Server Error
 */
export function internalError(message = 'An unexpected error occurred'): Response {
  return createErrorResponse(ErrorCodes.INTERNAL_ERROR, message)
}

/**
 * 500 Generation Failed
 */
export function generationFailedError(details?: string): Response {
  return createErrorResponse(
    ErrorCodes.GENERATION_FAILED,
    'Failed to generate content',
    details ? { details } : undefined
  )
}

// ============================================================================
// ERROR LOGGING
// ============================================================================

/**
 * Log error with context (for server-side use)
 */
export function logError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  const errorInfo = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
    timestamp: new Date().toISOString(),
  }

  console.error('[API Error]', JSON.stringify(errorInfo, null, 2))
}

// ============================================================================
// TRY-CATCH WRAPPER
// ============================================================================

/**
 * Wrap async handler with error handling
 */
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>
): (...args: T) => Promise<Response> {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args)
    } catch (error) {
      logError(error)
      return internalError()
    }
  }
}
