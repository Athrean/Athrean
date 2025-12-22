import { streamCompletionWithReasoning } from '@/lib/openrouter'
import { rateLimit, GENERATE_RATE_LIMIT, getRequestIdentifier } from '@/lib/rate-limit'
import { getModel, DEFAULT_FREE_MODEL, isModelFree } from '@/lib/models/registry'
import {
  createErrorResponse,
  ErrorCodes,
  rateLimitedError,
  validationError,
  logError,
} from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface RequestBody {
  prompt: string
  baseCode?: string
  history?: { role: 'user' | 'assistant'; content: string }[]
  model?: string
}

export async function POST(request: Request) {
  try {
    // Get user for rate limiting
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Rate limit check
    const identifier = getRequestIdentifier(request, user?.id)
    const rateLimitResult = rateLimit(identifier, GENERATE_RATE_LIMIT)

    if (!rateLimitResult.success) {
      return rateLimitedError(Math.ceil(rateLimitResult.resetIn / 1000))
    }

    const body = (await request.json()) as RequestBody
    const { prompt, baseCode, history = [], model: requestedModel } = body

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return validationError('Prompt is required', 'prompt')
    }

    // Determine model - prefer free models for unauthenticated users
    const model = requestedModel ?? DEFAULT_FREE_MODEL

    // Validate model exists
    const modelConfig = getModel(model)
    if (!modelConfig) {
      return createErrorResponse(
        ErrorCodes.MODEL_NOT_FOUND,
        `Model '${model}' not found. Using default model.`
      )
    }

    // Build messages
    const messages: { role: 'user' | 'assistant'; content: string }[] = []

    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content })
    }

    let userMessage = prompt
    if (baseCode) {
      userMessage = `Customize this component:\n\`\`\`tsx\n${baseCode}\n\`\`\`\n\n${prompt}`
    }
    messages.push({ role: 'user', content: userMessage })

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamCompletionWithReasoning({ messages, model })) {
            controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'))
          }
          controller.close()
        } catch (error) {
          logError(error, { route: 'generate-with-reasoning', model })
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Model': model,
        'X-Model-Free': isModelFree(model) ? 'true' : 'false',
      },
    })
  } catch (error) {
    logError(error, { route: 'generate-with-reasoning' })
    return createErrorResponse(
      ErrorCodes.GENERATION_FAILED,
      'Failed to generate'
    )
  }
}
