# Build Mode Architecture Plan

## Analysis Summary

### Open-Lovable Key Insights
1. **No function calling** - Uses XML tags (`<file path="...">`, `<package>`) parsed from streaming output
2. **Real sandbox** (E2B/Vercel) - Not Sandpack, actual Vite/Next.js dev server
3. **Surgical edit mode** - Agentic search → target file selection → minimal edits
4. **Global state tracking** - `global.sandboxState`, `global.conversationState`
5. **Edit type classification** - UPDATE_COMPONENT, ADD_FEATURE, FIX_ISSUE, etc.
6. **SSE streaming** with file/package progress events
7. **File manifest** - Component tree, routes, dependencies tracked

### Adorable Key Insights
1. **Mastra + MCP protocol** - Dynamic tool discovery from Freestyle MCP server
2. **Two-phase editing** - Smart AI (Sonnet) plans, Fast AI (Morph) applies
3. **Resumable streams** - Redis-backed stream persistence
4. **Freestyle Sandboxes** - Git-backed dev servers per user
5. **Tool execution** - `onStepFinish` callbacks stream tool results
6. **Memory system** - PostgreSQL + PgVector for conversation history

---

## Our Architecture: Hybrid Approach

We'll combine the best patterns from both:
- **XML-based output** (simpler than function calling, from open-lovable)
- **Real tool execution** (from AI SDK, like adorable)
- **ZenFS + IndexedDB** (local-first, no server sandbox needed)
- **Sandpack preview** (faster iteration than full sandbox)
- **Streaming with tool progress** (real-time UI updates)

---

## Core Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT (Browser)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  Chat Panel  │  │ File Tree    │  │  Sandpack Preview  │    │
│  │  + Tool UI   │  │ (ZenFS)      │  │  (Multi-file)      │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
│           │                │                    │               │
│           ▼                ▼                    ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              useChatApp Hook (AI SDK v6)                │   │
│  │  - Chat class with DefaultChatTransport                 │   │
│  │  - onToolCall callback executes against ZenFS           │   │
│  │  - Tool results streamed back to continue generation    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           ZenFS (Virtual Filesystem)                    │   │
│  │  - IndexedDB backend for persistence                    │   │
│  │  - Project isolation by projectId                       │   │
│  │  - Real-time file updates → UI sync                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/SSE
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER (Next.js API)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  /api/chat-app (Vercel AI SDK streamText)               │   │
│  │  - OpenRouter provider (Claude Sonnet 4)                │   │
│  │  - Tools with execute functions return success          │   │
│  │  - maxSteps/stopWhen for multi-turn tool calls          │   │
│  │  - toUIMessageStreamResponse() for streaming            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Fix Current Tool Execution (Immediate)

**Problem**: AI makes one tool call and stops.

**Solution**: Server-side tools need `execute` functions that return results so the AI continues.

```typescript
// /api/chat-app/route.ts
const fileTools = {
  createFile: tool({
    description: 'Create a new file',
    inputSchema: zodSchema(z.object({
      path: z.string(),
      content: z.string(),
    })),
    // Execute returns result → AI sees it → continues
    execute: async ({ path, content }) => {
      // Note: Actual file writing happens CLIENT-SIDE via onToolCall
      // Server just acknowledges so AI can continue
      return { success: true, path, action: 'created' }
    },
  }),
  // ... same for updateFile, deleteFile
}

const result = streamText({
  model: openrouter('anthropic/claude-sonnet-4'),
  tools: fileTools,
  maxSteps: 20, // Allow up to 20 tool call rounds
  // OR use newer API:
  // toolChoice: 'auto', // Let AI decide when to stop
})
```

**Client receives tool calls AND results**, executes against ZenFS:
```typescript
// useChatApp.ts
onToolCall: async ({ toolCall }) => {
  // Server already "executed" (returned success)
  // We execute the REAL operation here
  await fs.writeFile(toolCall.input.path, toolCall.input.content)
}
```

### Phase 2: Enhanced System Prompt

Based on open-lovable's surgical approach:

```typescript
// /lib/prompts/app-system-prompt.ts
export const APP_SYSTEM_PROMPT = `You are an expert full-stack developer building Next.js applications.

## AVAILABLE TOOLS
- createFile(path, content): Create a new file
- updateFile(path, content): Update existing file with COMPLETE new content
- deleteFile(path): Delete a file

## WORKFLOW
1. Analyze the request
2. Plan which files need to be created/modified
3. Execute file operations ONE BY ONE using tools
4. After ALL files are created, provide a brief summary

## RULES
- ALWAYS create complete, working files
- NEVER use placeholders like "// ... rest of code"
- NEVER truncate content
- For new apps, create these files in order:
  1. package.json
  2. tailwind.config.ts
  3. src/app/globals.css
  4. src/app/layout.tsx
  5. src/app/page.tsx
  6. Additional components as needed

## FILE STRUCTURE
Use this Next.js App Router structure:
- src/app/layout.tsx - Root layout
- src/app/page.tsx - Home page
- src/app/globals.css - Global styles
- src/components/ - Reusable components
- src/lib/ - Utilities

## TECH STACK
- Next.js 15 with App Router
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui components (if needed)
- Lucide React icons

When modifying existing files, output the COMPLETE file content.`
```

### Phase 3: Tool Call Progress UI

Show real-time file creation in chat:

```typescript
// components/generate/tool-progress.tsx
interface ToolProgressProps {
  toolCalls: ToolCallPart[]
}

export function ToolProgress({ toolCalls }: ToolProgressProps) {
  return (
    <div className="space-y-2">
      {toolCalls.map((call, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          {call.state === 'partial' && (
            <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
          )}
          {call.state === 'result' && (
            <Check className="w-4 h-4 text-green-400" />
          )}
          <span className="text-zinc-400">
            {call.toolName === 'createFile' && `Creating ${call.args.path}`}
            {call.toolName === 'updateFile' && `Updating ${call.args.path}`}
            {call.toolName === 'deleteFile' && `Deleting ${call.args.path}`}
          </span>
        </div>
      ))}
    </div>
  )
}
```

### Phase 4: Sandpack Multi-File Preview

The current `buildAppFiles()` is close but needs refinement:

```typescript
// preview/sandpack-wrapper.tsx
export function buildAppFiles(files: Map<string, string>): Record<string, string> {
  const sandpackFiles: Record<string, string> = {}

  for (const [path, content] of files) {
    // Strip 'src/' prefix for Sandpack (it expects /App.tsx style)
    const sandpackPath = path.startsWith('src/')
      ? `/${path.slice(4)}`
      : `/${path}`

    // Handle special Next.js files
    if (path.includes('layout.tsx')) {
      // Convert layout to regular component for Sandpack
      sandpackFiles[sandpackPath] = stripNextjsLayoutWrapper(content)
    } else if (path.includes('page.tsx')) {
      // This becomes our entry point
      sandpackFiles['/App.tsx'] = createSandpackEntry(content, files)
    } else {
      sandpackFiles[sandpackPath] = content
    }
  }

  return sandpackFiles
}
```

### Phase 5: Edit Mode (Future Enhancement)

Like open-lovable's surgical edits:

1. **Detect edit intent** from prompt
2. **Search existing files** for relevant code
3. **Provide context** to AI with only relevant files
4. **Apply minimal changes** using updateFile tool

---

## File Changes Required

### Modify: `/api/chat-app/route.ts`
- Add `execute` functions to all tools
- Change `stopWhen` to proper multi-step config
- Improve error handling

### Modify: `/hooks/use-chat-app.ts`
- Ensure onToolCall executes ZenFS operations
- Add tool progress tracking
- Better error recovery

### Modify: `/lib/prompts/app-system-prompt.ts`
- Enhanced prompt with better structure
- File ordering instructions
- Complete file rules

### Modify: `/components/generate/chat-panel.tsx`
- Add tool progress display
- Show file creation status

### Modify: `/components/generate/preview/sandpack-wrapper.tsx`
- Better Next.js → Sandpack conversion
- Handle more file types
- CSS import handling

---

## Key Differences from Reference Implementations

| Aspect | Open-Lovable | Adorable | Our Approach |
|--------|--------------|----------|--------------|
| Sandbox | E2B/Vercel (real) | Freestyle (real) | Sandpack (browser) |
| File Storage | Server memory + sandbox | Freestyle Git | ZenFS + IndexedDB |
| Tool Calls | XML parsing | MCP + Mastra | AI SDK tools |
| Streaming | Custom SSE | Resumable streams | AI SDK streams |
| Memory | Global state | PostgreSQL + PgVector | Zustand + local |

**Why our approach is simpler:**
1. No server sandbox management
2. No Redis/external dependencies
3. Instant preview (no VM startup)
4. Works offline (IndexedDB)
5. Lower infrastructure cost

**Trade-offs:**
1. Can't run backend code (API routes)
2. Limited to client-side preview
3. No persistent URLs/sharing (for now)

---

## Next Steps

1. **Immediate**: Fix tool execution (add execute functions)
2. **Today**: Test multi-file generation
3. **Tomorrow**: Polish tool progress UI
4. **This week**: Improve Sandpack conversion
5. **Later**: Add edit mode with file context
