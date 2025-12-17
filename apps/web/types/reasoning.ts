// Reasoning step for chain-of-thought visualization
export interface ReasoningStep {
  id: string
  title: string
  content: string
  status: 'pending' | 'thinking' | 'completed'
  durationMs?: number
}

// Checkpoint for conversation state restoration
export interface Checkpoint {
  id: string
  messageIndex: number
  label: string
  timestamp: number
  generatedCode: string | null
}

// Context usage for token/cost tracking
export interface ContextUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCost: number
  model: string
  contextWindow: number
  usagePercent: number
}

// Extended message with reasoning metadata
export interface ReasoningMessage {
  role: 'user' | 'assistant' | 'reasoning'
  content: string
  reasoning?: ReasoningStep[]
  contextUsage?: ContextUsage
  checkpointId?: string
  timestamp: number
}

// API response with reasoning data
export interface GenerateResponseWithReasoning {
  content: string
  reasoning?: ReasoningStep[]
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// Props for reasoning components
export interface ReasoningProps {
  steps: ReasoningStep[]
}

export interface ChainOfThoughtProps {
  steps: ReasoningStep[]
  isStreaming: boolean
  showProgress?: boolean
}

export interface ContextProps {
  usage: ContextUsage | null
  showCost?: boolean
  showProgress?: boolean
}

export interface CheckpointProps {
  checkpoint: Checkpoint
  onRestore: (checkpoint: Checkpoint) => void
  isCurrent: boolean
}

export interface CheckpointListProps {
  checkpoints: Checkpoint[]
  currentIndex: number
  onRestore: (checkpoint: Checkpoint) => void
}

// Model pricing per 1M tokens (input/output)
export interface ModelPricing {
  input: number
  output: number
  contextWindow: number
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  'anthropic/claude-3.5-sonnet': {
    input: 3.0,
    output: 15.0,
    contextWindow: 200000,
  },
  'anthropic/claude-sonnet-4-20250514': {
    input: 3.0,
    output: 15.0,
    contextWindow: 200000,
  },
  'openai/gpt-4o': {
    input: 2.5,
    output: 10.0,
    contextWindow: 128000,
  },
  'openai/gpt-4o-mini': {
    input: 0.15,
    output: 0.6,
    contextWindow: 128000,
  },
} satisfies Record<string, ModelPricing>

// Default pricing fallback
const DEFAULT_PRICING: ModelPricing = {
  input: 3.0,
  output: 15.0,
  contextWindow: 200000,
}

// Utility to calculate cost from usage
export function calculateCost(
  usage: { promptTokens: number; completionTokens: number },
  model: string
): number {
  const pricing = MODEL_PRICING[model] ?? DEFAULT_PRICING
  const inputCost = (usage.promptTokens / 1_000_000) * pricing.input
  const outputCost = (usage.completionTokens / 1_000_000) * pricing.output
  return inputCost + outputCost
}

// Utility to generate unique IDs
export function generateReasoningId(): string {
  return `r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
