/**
 * Base Generator Abstraction
 *
 * Abstract base class for different generation types.
 * Pattern adapted from 1ai-develop/backend/routes/apps/app.ts
 *
 * This provides a consistent interface for:
 * - Component generation
 * - App generation (future)
 * - Schema generation (future)
 */

import {
  streamCompletion,
  streamCompletionWithReasoning,
  type Message,
  type Tool,
  type StreamChunk,
} from '@/lib/openrouter'
import { rateLimit, getRateLimitForTier } from '@/lib/rate-limit'
import {
  ErrorCodes,
  createErrorResponse,
  insufficientCreditsError,
  rateLimitedError,
  validationError,
  logError,
} from '@/lib/errors'
import { getModel, isModelFree, DEFAULT_FREE_MODEL } from '@/lib/models/registry'

// ============================================================================
// TYPES
// ============================================================================

export enum GeneratorType {
  COMPONENT = 'component',
  APP = 'app',
  SCHEMA = 'schema',
  REFACTOR = 'refactor',
}

export interface GeneratorConfig {
  name: string
  type: GeneratorType
  description: string
  creditCost: number
  defaultModel: string
  systemPrompt: string
  supportsReasoning: boolean
  tools?: Tool[]
}

export interface GenerateRequest {
  prompt: string
  model?: string
  baseCode?: string
  history?: { role: 'user' | 'assistant'; content: string }[]
  useReasoning?: boolean
}

export interface GenerateContext {
  userId?: string
  userCredits?: number
  isPremium?: boolean
}

// ============================================================================
// VALIDATION (Simple, no zod dependency)
// ============================================================================

interface ValidationResult {
  success: boolean
  data?: GenerateRequest
  error?: string
}

function validateGenerateRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid request body' }
  }

  const data = body as Record<string, unknown>

  // Validate prompt
  if (!data.prompt || typeof data.prompt !== 'string') {
    return { success: false, error: 'Prompt is required' }
  }

  if (data.prompt.length > 10000) {
    return { success: false, error: 'Prompt too long (max 10000 characters)' }
  }

  // Validate optional fields
  if (data.model !== undefined && typeof data.model !== 'string') {
    return { success: false, error: 'Model must be a string' }
  }

  if (data.baseCode !== undefined && typeof data.baseCode !== 'string') {
    return { success: false, error: 'Base code must be a string' }
  }

  if (data.history !== undefined) {
    if (!Array.isArray(data.history)) {
      return { success: false, error: 'History must be an array' }
    }
    for (const msg of data.history) {
      if (!msg || typeof msg !== 'object') {
        return { success: false, error: 'Invalid history message' }
      }
      const m = msg as Record<string, unknown>
      if (m.role !== 'user' && m.role !== 'assistant') {
        return { success: false, error: 'History role must be user or assistant' }
      }
      if (typeof m.content !== 'string') {
        return { success: false, error: 'History content must be a string' }
      }
    }
  }

  return {
    success: true,
    data: {
      prompt: data.prompt as string,
      model: data.model as string | undefined,
      baseCode: data.baseCode as string | undefined,
      history: data.history as { role: 'user' | 'assistant'; content: string }[] | undefined,
      useReasoning: data.useReasoning !== false, // default true
    },
  }
}

// ============================================================================
// ABSTRACT BASE GENERATOR
// ============================================================================

export abstract class BaseGenerator {
  abstract config: GeneratorConfig

  /**
   * Validate the request
   */
  protected validateRequest(body: unknown): GenerateRequest {
    const result = validateGenerateRequest(body)
    if (!result.success || !result.data) {
      throw new ValidationError(result.error ?? 'Invalid request')
    }
    return result.data
  }

  /**
   * Check rate limit
   */
  protected checkRateLimit(userId: string, isPremium: boolean) {
    const config = getRateLimitForTier(isPremium)
    return rateLimit(userId, config)
  }

  /**
   * Check if user has enough credits
   */
  protected checkCredits(userCredits: number, model: string): boolean {
    // Free models don't require credits
    if (isModelFree(model)) {
      return true
    }
    return userCredits >= this.config.creditCost
  }

  /**
   * Build messages array from request
   */
  protected buildMessages(request: GenerateRequest): Message[] {
    const messages: Message[] = []

    // Add history
    if (request.history) {
      for (const msg of request.history) {
        messages.push({ role: msg.role, content: msg.content })
      }
    }

    // Build user message
    let userMessage = request.prompt
    if (request.baseCode) {
      userMessage = `Customize this component:\n\`\`\`tsx\n${request.baseCode}\n\`\`\`\n\n${request.prompt}`
    }
    messages.push({ role: 'user', content: userMessage })

    return messages
  }

  /**
   * Execute the generation and return a streaming response
   */
  async execute(
    request: Request,
    context: GenerateContext
  ): Promise<Response> {
    try {
      // Parse and validate request body
      const body = await request.json()
      const validatedRequest = this.validateRequest(body)

      // Determine model to use
      const model = validatedRequest.model ?? this.config.defaultModel

      // Validate model exists
      const modelConfig = getModel(model)
      if (!modelConfig) {
        return createErrorResponse(
          ErrorCodes.MODEL_NOT_FOUND,
          `Model '${model}' not found`
        )
      }

      // Check rate limit if user is authenticated
      if (context.userId) {
        const rateLimitResult = this.checkRateLimit(
          context.userId,
          context.isPremium ?? false
        )
        if (!rateLimitResult.success) {
          return rateLimitedError(Math.ceil(rateLimitResult.resetIn / 1000))
        }
      }

      // Check credits for paid models
      if (!isModelFree(model)) {
        const hasCredits = this.checkCredits(
          context.userCredits ?? 0,
          model
        )
        if (!hasCredits) {
          return insufficientCreditsError(context.userCredits ?? 0, this.config.creditCost)
        }
      }

      // Build messages
      const messages = this.buildMessages(validatedRequest)

      // Create streaming response
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start: async (controller) => {
          try {
            const generator = this.runGeneration(
              messages,
              model,
              validatedRequest.useReasoning ?? this.config.supportsReasoning
            )

            for await (const chunk of generator) {
              controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'))
            }

            controller.close()
          } catch (error) {
            logError(error, { generator: this.config.name })
            controller.error(error)
          }
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
        },
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        return validationError(error.message)
      }

      logError(error, { generator: this.config.name })
      return createErrorResponse(
        ErrorCodes.GENERATION_FAILED,
        'Failed to process generation request'
      )
    }
  }

  /**
   * Run the actual generation - can be overridden by subclasses
   */
  protected async *runGeneration(
    messages: Message[],
    model: string,
    useReasoning: boolean
  ): AsyncGenerator<StreamChunk> {
    if (useReasoning) {
      yield* streamCompletionWithReasoning({
        messages,
        model,
        tools: this.config.tools,
      })
    } else {
      for await (const content of streamCompletion({
        messages,
        model,
        tools: this.config.tools,
      })) {
        yield { type: 'content', content } as StreamChunk
      }
    }
  }
}

// ============================================================================
// VALIDATION ERROR
// ============================================================================

class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// ============================================================================
// COMPONENT GENERATOR
// ============================================================================

const COMPONENT_SYSTEM_PROMPT = `You are an expert React component designer. Create beautiful, modern UI components.

TECH STACK:
- React 18 with TypeScript
- Tailwind CSS (dark mode)
- Framer Motion for animations
- Lucide React for icons

CRITICAL RULES:
1. Start with 'use client' directive
2. Export default function component
3. MUST BE 100% SELF-CONTAINED - define ALL data/arrays INSIDE the component
4. Never reference undefined variables - if you need data, create mock data inside the component
5. Use dark theme: zinc-950 background, zinc-100 text
6. Add smooth Framer Motion animations
7. Include TypeScript interfaces for all data structures

Response format:
1. Brief explanation
2. Complete code in \`\`\`tsx block (FULLY SELF-CONTAINED)
3. Key features list

Output production-ready, visually impressive code.`

export class ComponentGenerator extends BaseGenerator {
  config: GeneratorConfig = {
    name: 'Component Generator',
    type: GeneratorType.COMPONENT,
    description: 'Generate React components with Tailwind CSS and Framer Motion',
    creditCost: 1,
    defaultModel: DEFAULT_FREE_MODEL,
    systemPrompt: COMPONENT_SYSTEM_PROMPT,
    supportsReasoning: true,
  }
}

// ============================================================================
// APP GENERATOR (Future)
// ============================================================================

const APP_SYSTEM_PROMPT = `You are an expert full-stack developer. Generate complete applications.

TECH STACK:
- Next.js 15 with App Router
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL + Auth)
- Framer Motion for animations

You will generate multiple files. For each file, use this format:

\`\`\`path:src/app/page.tsx
// file content here
\`\`\`

Generate all necessary files for a complete, working application.`

export class AppGenerator extends BaseGenerator {
  config: GeneratorConfig = {
    name: 'App Generator',
    type: GeneratorType.APP,
    description: 'Generate full-stack applications with Next.js and Supabase',
    creditCost: 5,
    defaultModel: DEFAULT_FREE_MODEL,
    systemPrompt: APP_SYSTEM_PROMPT,
    supportsReasoning: true,
    tools: [
      {
        type: 'function',
        function: {
          name: 'createFile',
          description: 'Create a new file with the given content',
          parameters: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'The file path relative to project root',
              },
              content: {
                type: 'string',
                description: 'The file content',
              },
            },
            required: ['path', 'content'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'updateFile',
          description: 'Update an existing file',
          parameters: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'The file path to update',
              },
              content: {
                type: 'string',
                description: 'The new file content',
              },
            },
            required: ['path', 'content'],
          },
        },
      },
    ],
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

const generators: Record<GeneratorType, BaseGenerator> = {
  [GeneratorType.COMPONENT]: new ComponentGenerator(),
  [GeneratorType.APP]: new AppGenerator(),
  [GeneratorType.SCHEMA]: new ComponentGenerator(), // Placeholder
  [GeneratorType.REFACTOR]: new ComponentGenerator(), // Placeholder
}

export function getGenerator(type: GeneratorType): BaseGenerator {
  return generators[type]
}

export function getComponentGenerator(): ComponentGenerator {
  return generators[GeneratorType.COMPONENT] as ComponentGenerator
}

export function getAppGenerator(): AppGenerator {
  return generators[GeneratorType.APP] as AppGenerator
}
