import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { streamCompletion, streamCompletionWithReasoning } from './lib/openrouter'

// Load root .env if api/.env doesn't have OPENROUTER_API_KEY
if (!process.env.OPENROUTER_API_KEY) {
  const file = Bun.file('../../.env')
  if (await file.exists()) {
    const text = await file.text()
    for (const line of text.split('\n')) {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim()
      }
    }
  }
}

const app = new Elysia()
  .use(cors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }))
  .get('/', (): { message: string } => ({ message: 'Athrean API' }))
  .get('/health', (): { status: string; hasKey: boolean } => ({
    status: 'ok',
    hasKey: !!process.env.OPENROUTER_API_KEY,
  }))
  .post(
    '/generate',
    async function* ({ body }): AsyncGenerator<string> {
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

      for await (const chunk of streamCompletion({ messages, model })) {
        yield chunk
      }
    },
    {
      body: t.Object({
        prompt: t.String(),
        baseCode: t.Optional(t.String()),
        history: t.Optional(
          t.Array(
            t.Object({
              role: t.Union([t.Literal('user'), t.Literal('assistant')]),
              content: t.String(),
            })
          )
        ),
        model: t.Optional(t.String()),
      }),
    }
  )
  .post(
    '/generate-with-reasoning',
    async function* ({ body }): AsyncGenerator<string> {
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

      for await (const chunk of streamCompletionWithReasoning({ messages, model })) {
        yield JSON.stringify(chunk) + '\n'
      }
    },
    {
      body: t.Object({
        prompt: t.String(),
        baseCode: t.Optional(t.String()),
        history: t.Optional(
          t.Array(
            t.Object({
              role: t.Union([t.Literal('user'), t.Literal('assistant')]),
              content: t.String(),
            })
          )
        ),
        model: t.Optional(t.String()),
      }),
    }
  )
  .listen(Number(process.env.PORT) || 3001)

console.log(`API running at http://localhost:${app.server?.port}`)
console.log(`OpenRouter key: ${process.env.OPENROUTER_API_KEY ? '✓ loaded' : '✗ missing'}`)

export type App = typeof app
