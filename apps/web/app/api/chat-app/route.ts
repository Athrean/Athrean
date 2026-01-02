/**
 * Chat App API Route
 *
 * Vercel AI SDK endpoint for Build Mode app generation.
 * Uses OpenRouter provider with structured tool calls for file operations.
 */

import { streamText, tool, stepCountIs, convertToModelMessages, type UIMessage } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { z } from 'zod'
import { zodSchema } from '@ai-sdk/provider-utils'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, GENERATE_RATE_LIMIT } from '@/lib/rate-limit'
import {
  APP_SYSTEM_PROMPT,
  getAppSystemPromptWithSupabase,
  buildFileContextMessage,
} from '@/lib/prompts/app-system-prompt'
import { getModel, isModelFree } from '@/lib/models/registry'

// Default model for Build Mode - Claude Sonnet 4 with excellent tool support
const BUILD_MODE_DEFAULT_MODEL = 'anthropic/claude-sonnet-4'

// ============================================================================
// CONFIG
// ============================================================================

export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds timeout for long generations

// ============================================================================
// TYPES
// ============================================================================

interface ChatAppRequest {
  messages: UIMessage[]
  files?: Record<string, string>
  model?: string
  supabaseConfig?: {
    url: string
    anonKey: string
  }
}

// ============================================================================
// TOOLS
// ============================================================================

const fileTools = {
  createFile: tool({
    description: 'Create a new file in the project with the specified path and content',
    inputSchema: zodSchema(
      z.object({
        path: z
          .string()
          .describe('File path relative to project root (e.g., src/app/page.tsx)'),
        content: z.string().describe('Complete file content'),
      })
    ),
    // Return success so AI continues with more tool calls
    execute: async ({ path }) => ({ success: true, path, action: 'created' }),
  }),

  updateFile: tool({
    description: 'Update an existing file with new content',
    inputSchema: zodSchema(
      z.object({
        path: z
          .string()
          .describe('File path to update (e.g., src/components/button.tsx)'),
        content: z.string().describe('New complete file content'),
      })
    ),
    execute: async ({ path }) => ({ success: true, path, action: 'updated' }),
  }),

  deleteFile: tool({
    description: 'Delete a file from the project',
    inputSchema: zodSchema(
      z.object({
        path: z.string().describe('File path to delete'),
      })
    ),
    execute: async ({ path }) => ({ success: true, path, action: 'deleted' }),
  }),
}

// ============================================================================
// ROUTE HANDLER
// ============================================================================

export async function POST(req: Request): Promise<Response> {
  try {
    // Parse request body
    const body = (await req.json()) as ChatAppRequest
    const { messages, files, model: requestedModel, supabaseConfig } = body

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get user for rate limiting (optional - allows anonymous for now)
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Rate limit if authenticated
    if (user) {
      const identifier = user.id
      const rateLimitResult = rateLimit(identifier, GENERATE_RATE_LIMIT)
      if (!rateLimitResult.success) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            resetIn: Math.ceil(rateLimitResult.resetIn / 1000),
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // Determine model - use Build Mode default which supports tools
    const modelId = requestedModel ?? BUILD_MODE_DEFAULT_MODEL
    const modelConfig = getModel(modelId)

    // Warn if model doesn't support tools, but continue (OpenRouter may route to a capable endpoint)
    if (modelConfig && !modelConfig.supportsTools) {
      console.warn(`[chat-app] Model '${modelId}' may not support tools. Consider using a tool-capable model.`)
    }

    // Initialize OpenRouter provider
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    })

    // Build system prompt
    let systemPrompt = APP_SYSTEM_PROMPT
    if (supabaseConfig?.url && supabaseConfig?.anonKey) {
      systemPrompt = getAppSystemPromptWithSupabase(supabaseConfig)
    }

    // Add file context if files exist
    if (files && Object.keys(files).length > 0) {
      systemPrompt += '\n\n' + buildFileContextMessage(files)
    }

    // Convert UIMessages to ModelMessages for streamText
    // Remove 'id' from messages as convertToModelMessages expects Omit<UIMessage, 'id'>
    const messagesWithoutId = messages.map(({ id, ...rest }) => rest)
    const modelMessages = await convertToModelMessages(messagesWithoutId, {
      tools: fileTools,
    })

    console.log('[chat-app] Starting stream with model:', modelId)
    console.log('[chat-app] Message count:', modelMessages.length)
    console.log('[chat-app] Tools available:', Object.keys(fileTools))

    // Stream response with tools
    // stopWhen: stepCountIs(N) allows N rounds of tool calls before stopping
    // With execute functions returning results, the AI will continue calling tools
    const result = streamText({
      model: openrouter(modelId),
      system: systemPrompt,
      messages: modelMessages,
      tools: fileTools,
      stopWhen: stepCountIs(15), // Allow up to 15 steps for creating multiple files
      onFinish: async ({ usage, steps }) => {
        console.log('[chat-app] Generation complete:', {
          model: modelId,
          steps: steps?.length ?? 0,
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0),
        })
      },
    })

    // Return streaming response
    return result.toUIMessageStreamResponse({
      headers: {
        'X-Model': modelId,
        'X-Model-Free': String(isModelFree(modelId)),
      },
    })
  } catch (error) {
    console.error('[chat-app] Error:', error)

    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
