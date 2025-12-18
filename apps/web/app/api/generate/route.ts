import { streamCompletion } from '@/lib/openrouter'

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
    const body = (await request.json()) as RequestBody
    const { prompt, baseCode, history = [], model } = body

    const messages: { role: 'user' | 'assistant'; content: string }[] = []

    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content })
    }

    let userMessage = prompt
    if (baseCode) {
      userMessage = `Customize this component:\n\`\`\`tsx\n${baseCode}\n\`\`\`\n\n${prompt}`
    }
    messages.push({ role: 'user', content: userMessage })

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamCompletion({ messages, model })) {
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Generate error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
