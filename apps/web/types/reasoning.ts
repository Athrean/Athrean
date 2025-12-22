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

// Model pricing - now uses centralized registry
// Re-export from registry for backward compatibility
import {
  getModel,
  calculateModelCost,
  MODEL_PRICING_MAP,
  type ModelConfig,
} from '@/lib/models/registry'

export interface ModelPricing {
  input: number
  output: number
  contextWindow: number
}

// Use the centralized model pricing map
export const MODEL_PRICING: Record<string, ModelPricing> = MODEL_PRICING_MAP

// Utility to calculate cost from usage (uses centralized registry)
export function calculateCost(
  usage: { promptTokens: number; completionTokens: number },
  model: string
): number {
  return calculateModelCost(model, usage.promptTokens, usage.completionTokens)
}

// Re-export model utilities for convenience
export { getModel, type ModelConfig }

// Utility to generate unique IDs
export function generateReasoningId(): string {
  return `r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
