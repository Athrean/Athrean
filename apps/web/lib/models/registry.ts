/**
 * Centralized Model Registry for OpenRouter
 * Updated: December 2025
 *
 * This registry contains all available models with their pricing,
 * capabilities, and configuration. Free models are prioritized
 * for cost-effective generation.
 */

export enum Provider {
  ANTHROPIC = 'anthropic',
  OPENAI = 'openai',
  GOOGLE = 'google',
  META = 'meta',
  NVIDIA = 'nvidia',
  DEEPSEEK = 'deepseek',
  QWEN = 'qwen',
  MISTRAL = 'mistral',
  XAI = 'xai',
  XIAOMI = 'xiaomi',
  TNGTECH = 'tngtech',
  ALLENAI = 'allenai',
  KWAIPILOT = 'kwaipilot',
  NEXAGI = 'nex-agi',
  ZAI = 'z-ai',
}

export enum Capability {
  TEXT = 'text',
  CODE = 'code',
  VISION = 'vision',
  REASONING = 'reasoning',
  TOOL_USE = 'tool_use',
  FUNCTION_CALLING = 'function_calling',
  MULTIMODAL = 'multimodal',
  AGENTIC = 'agentic',
}

export enum ModelTier {
  FREE = 'free',
  BUDGET = 'budget',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

export interface ModelConfig {
  id: string
  name: string
  provider: Provider
  maxOutputTokens: number
  contextWindow: number
  inputPrice: number // per 1M tokens (0 = free)
  outputPrice: number // per 1M tokens (0 = free)
  capabilities: Capability[]
  tier: ModelTier
  isAvailable: boolean
  supportsReasoning: boolean
  supportsTools: boolean
  description?: string
}

/**
 * Free Models - $0 input/output
 * These are your competitive advantage for unlimited free tier
 */
export const FREE_MODELS: ModelConfig[] = [
  // === NVIDIA ===
  {
    id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
    name: 'Nemotron Ultra 253B',
    provider: Provider.NVIDIA,
    maxOutputTokens: 32768,
    contextWindow: 131072,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING, Capability.AGENTIC],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'NVIDIA flagship free model with 253B parameters',
  },
  {
    id: 'nvidia/nemotron-3-nano-30b-a3b:free',
    name: 'Nemotron Nano 30B',
    provider: Provider.NVIDIA,
    maxOutputTokens: 16384,
    contextWindow: 262144,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING, Capability.AGENTIC, Capability.TOOL_USE],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'Efficient MoE model for agentic AI systems with 256K context',
  },
  {
    id: 'nvidia/nemotron-nano-12b-v2-vl:free',
    name: 'Nemotron Nano 12B Vision',
    provider: Provider.NVIDIA,
    maxOutputTokens: 8192,
    contextWindow: 131072,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.MULTIMODAL],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: false,
    description: 'Vision-language model for video understanding and document intelligence',
  },

  // === DEEPSEEK ===
  {
    id: 'deepseek/deepseek-r1-0528:free',
    name: 'DeepSeek R1 0528',
    provider: Provider.DEEPSEEK,
    maxOutputTokens: 32768,
    contextWindow: 163840,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING, Capability.TOOL_USE],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'Latest DeepSeek reasoning model, on par with OpenAI o1',
  },
  {
    id: 'deepseek/deepseek-chat-v3-0324:free',
    name: 'DeepSeek Chat V3',
    provider: Provider.DEEPSEEK,
    maxOutputTokens: 16384,
    contextWindow: 131072,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'DeepSeek conversational model with strong coding abilities',
  },

  // === META LLAMA ===
  {
    id: 'meta-llama/llama-4-maverick:free',
    name: 'Llama 4 Maverick',
    provider: Provider.META,
    maxOutputTokens: 32768,
    contextWindow: 1048576,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.MULTIMODAL, Capability.TOOL_USE],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Meta flagship 400B MoE with 1M context and multimodal support',
  },
  {
    id: 'meta-llama/llama-4-scout:free',
    name: 'Llama 4 Scout',
    provider: Provider.META,
    maxOutputTokens: 16384,
    contextWindow: 524288,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.MULTIMODAL],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Efficient Llama 4 variant with 512K context',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    provider: Provider.META,
    maxOutputTokens: 8192,
    contextWindow: 131072,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.TOOL_USE],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Powerful Llama 3.3 instruction-tuned model',
  },

  // === QWEN ===
  {
    id: 'qwen/qwen3-coder:free',
    name: 'Qwen3 Coder 480B',
    provider: Provider.QWEN,
    maxOutputTokens: 32768,
    contextWindow: 262144,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.FUNCTION_CALLING, Capability.AGENTIC],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'Specialized coding model with 480B params (35B active), 256K context',
  },
  {
    id: 'qwen/qwq-32b:free',
    name: 'QwQ 32B',
    provider: Provider.QWEN,
    maxOutputTokens: 16384,
    contextWindow: 131072,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: false,
    description: 'Qwen reasoning model with chain-of-thought',
  },

  // === GOOGLE ===
  {
    id: 'google/gemma-3-27b-it:free',
    name: 'Gemma 3 27B',
    provider: Provider.GOOGLE,
    maxOutputTokens: 8192,
    contextWindow: 131072,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.MULTIMODAL],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: false,
    description: 'Google open-weight model with 140+ language support',
  },
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash Exp',
    provider: Provider.GOOGLE,
    maxOutputTokens: 8192,
    contextWindow: 1048576,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.MULTIMODAL, Capability.TOOL_USE],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Experimental Gemini 2.0 with 1M context',
  },

  // === MISTRAL ===
  {
    id: 'mistralai/devstral-2512:free',
    name: 'Devstral 2512',
    provider: Provider.MISTRAL,
    maxOutputTokens: 32768,
    contextWindow: 262144,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.AGENTIC],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Mistral 123B agentic coding model with 256K context',
  },

  // === XIAOMI ===
  {
    id: 'xiaomi/mimo-v2-flash:free',
    name: 'MiMo V2 Flash',
    provider: Provider.XIAOMI,
    maxOutputTokens: 16384,
    contextWindow: 262144,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING, Capability.AGENTIC],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'Xiaomi reasoning model for coding and agents',
  },

  // === OTHERS ===
  {
    id: 'kwaipilot/kat-coder-pro:free',
    name: 'KAT Coder Pro',
    provider: Provider.KWAIPILOT,
    maxOutputTokens: 16384,
    contextWindow: 262144,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.TOOL_USE],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Specialized coding model with tool use',
  },
  {
    id: 'tngtech/deepseek-r1t2-chimera:free',
    name: 'DeepSeek R1T2 Chimera',
    provider: Provider.TNGTECH,
    maxOutputTokens: 16384,
    contextWindow: 163840,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'TNG Tech reasoning model based on DeepSeek',
  },
  {
    id: 'nex-agi/deepseek-v3.1-nex-n1:free',
    name: 'DeepSeek V3.1 Nex N1',
    provider: Provider.NEXAGI,
    maxOutputTokens: 16384,
    contextWindow: 131072,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.AGENTIC, Capability.TOOL_USE],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'Agent-focused DeepSeek variant with tool use',
  },
  {
    id: 'z-ai/glm-4.5-air:free',
    name: 'GLM 4.5 Air',
    provider: Provider.ZAI,
    maxOutputTokens: 8192,
    contextWindow: 131072,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING, Capability.TOOL_USE],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'GLM model with reasoning and tool capabilities',
  },
  {
    id: 'allenai/olmo-3.1-32b-think:free',
    name: 'OLMo 3.1 32B Think',
    provider: Provider.ALLENAI,
    maxOutputTokens: 8192,
    contextWindow: 65536,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: false,
    description: 'Allen AI reasoning model',
  },
  {
    id: 'openai/gpt-oss-20b:free',
    name: 'GPT-OSS 20B',
    provider: Provider.OPENAI,
    maxOutputTokens: 8192,
    contextWindow: 131072,
    inputPrice: 0,
    outputPrice: 0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.TOOL_USE],
    tier: ModelTier.FREE,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'OpenAI open-source model with tool use',
  },
]

/**
 * Budget Models - $0.01-$1 per 1M tokens
 * Good balance of quality and cost
 */
export const BUDGET_MODELS: ModelConfig[] = [
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: Provider.ANTHROPIC,
    maxOutputTokens: 4096,
    contextWindow: 200000,
    inputPrice: 0.25,
    outputPrice: 1.25,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION],
    tier: ModelTier.BUDGET,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Fast and affordable Claude model',
  },
  {
    id: 'anthropic/claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: Provider.ANTHROPIC,
    maxOutputTokens: 8192,
    contextWindow: 200000,
    inputPrice: 0.80,
    outputPrice: 4.0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.TOOL_USE],
    tier: ModelTier.BUDGET,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Latest fast Claude with improved capabilities',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: Provider.OPENAI,
    maxOutputTokens: 16384,
    contextWindow: 128000,
    inputPrice: 0.15,
    outputPrice: 0.60,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.TOOL_USE],
    tier: ModelTier.BUDGET,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Affordable GPT-4 quality',
  },
  {
    id: 'google/gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: Provider.GOOGLE,
    maxOutputTokens: 8192,
    contextWindow: 1048576,
    inputPrice: 0.10,
    outputPrice: 0.40,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.MULTIMODAL, Capability.TOOL_USE],
    tier: ModelTier.BUDGET,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Fast Gemini with 1M context window',
  },
  {
    id: 'meta-llama/llama-4-maverick',
    name: 'Llama 4 Maverick',
    provider: Provider.META,
    maxOutputTokens: 32768,
    contextWindow: 1048576,
    inputPrice: 0.15,
    outputPrice: 0.60,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.MULTIMODAL, Capability.TOOL_USE],
    tier: ModelTier.BUDGET,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Meta flagship with 1M context (paid tier)',
  },
  {
    id: 'mistralai/devstral-2512',
    name: 'Devstral 2512',
    provider: Provider.MISTRAL,
    maxOutputTokens: 32768,
    contextWindow: 262144,
    inputPrice: 0.05,
    outputPrice: 0.22,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.AGENTIC],
    tier: ModelTier.BUDGET,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Mistral agentic coding (paid tier)',
  },
  {
    id: 'deepseek/deepseek-r1-0528',
    name: 'DeepSeek R1 0528',
    provider: Provider.DEEPSEEK,
    maxOutputTokens: 32768,
    contextWindow: 163840,
    inputPrice: 0.40,
    outputPrice: 1.75,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING, Capability.TOOL_USE],
    tier: ModelTier.BUDGET,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'DeepSeek R1 paid tier with better rate limits',
  },
  {
    id: 'qwen/qwen3-coder',
    name: 'Qwen3 Coder 480B',
    provider: Provider.QWEN,
    maxOutputTokens: 32768,
    contextWindow: 262144,
    inputPrice: 0.22,
    outputPrice: 0.95,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.FUNCTION_CALLING, Capability.AGENTIC],
    tier: ModelTier.BUDGET,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'Qwen3 Coder paid tier',
  },
]

/**
 * Standard Models - $1-$5 per 1M tokens
 * High quality for important tasks
 */
export const STANDARD_MODELS: ModelConfig[] = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: Provider.ANTHROPIC,
    maxOutputTokens: 8192,
    contextWindow: 200000,
    inputPrice: 3.0,
    outputPrice: 15.0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.TOOL_USE],
    tier: ModelTier.STANDARD,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'Excellent code generation and reasoning',
  },
  {
    id: 'anthropic/claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: Provider.ANTHROPIC,
    maxOutputTokens: 64000,
    contextWindow: 1000000,
    inputPrice: 3.0,
    outputPrice: 15.0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.TOOL_USE, Capability.REASONING],
    tier: ModelTier.STANDARD,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'Latest Claude with 1M context, 72.7% SWE-bench',
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: Provider.OPENAI,
    maxOutputTokens: 16384,
    contextWindow: 128000,
    inputPrice: 2.50,
    outputPrice: 10.0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.MULTIMODAL, Capability.TOOL_USE],
    tier: ModelTier.STANDARD,
    isAvailable: true,
    supportsReasoning: false,
    supportsTools: true,
    description: 'OpenAI flagship multimodal model',
  },
  {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: Provider.GOOGLE,
    maxOutputTokens: 65536,
    contextWindow: 1048576,
    inputPrice: 1.25,
    outputPrice: 10.0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.MULTIMODAL, Capability.TOOL_USE, Capability.REASONING],
    tier: ModelTier.STANDARD,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: '#1 on LMArena, 1M context, advanced reasoning',
  },
]

/**
 * Premium Models - $5+ per 1M tokens
 * Best quality, use sparingly
 */
export const PREMIUM_MODELS: ModelConfig[] = [
  {
    id: 'anthropic/claude-opus-4',
    name: 'Claude Opus 4',
    provider: Provider.ANTHROPIC,
    maxOutputTokens: 32000,
    contextWindow: 200000,
    inputPrice: 15.0,
    outputPrice: 75.0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.VISION, Capability.TOOL_USE, Capability.REASONING],
    tier: ModelTier.PREMIUM,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'Most capable Claude model',
  },
  {
    id: 'openai/o1',
    name: 'OpenAI o1',
    provider: Provider.OPENAI,
    maxOutputTokens: 32768,
    contextWindow: 200000,
    inputPrice: 15.0,
    outputPrice: 60.0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING],
    tier: ModelTier.PREMIUM,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: false,
    description: 'OpenAI advanced reasoning model',
  },
  {
    id: 'openai/o1-pro',
    name: 'OpenAI o1 Pro',
    provider: Provider.OPENAI,
    maxOutputTokens: 32768,
    contextWindow: 200000,
    inputPrice: 150.0,
    outputPrice: 600.0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING],
    tier: ModelTier.PREMIUM,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: false,
    description: 'OpenAI most advanced reasoning model',
  },
  {
    id: 'x-ai/grok-3',
    name: 'Grok 3',
    provider: Provider.XAI,
    maxOutputTokens: 16384,
    contextWindow: 131072,
    inputPrice: 3.0,
    outputPrice: 15.0,
    capabilities: [Capability.TEXT, Capability.CODE, Capability.REASONING],
    tier: ModelTier.PREMIUM,
    isAvailable: true,
    supportsReasoning: true,
    supportsTools: true,
    description: 'xAI flagship model',
  },
]

// Combine all models
export const ALL_MODELS: ModelConfig[] = [
  ...FREE_MODELS,
  ...BUDGET_MODELS,
  ...STANDARD_MODELS,
  ...PREMIUM_MODELS,
]

// Model ID type for type safety
export type ModelId = (typeof ALL_MODELS)[number]['id']

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get model by ID
 */
export function getModel(id: string): ModelConfig | undefined {
  return ALL_MODELS.find((m) => m.id === id)
}

/**
 * Get all free models
 */
export function getFreeModels(): ModelConfig[] {
  return FREE_MODELS.filter((m) => m.isAvailable)
}

/**
 * Get models by tier
 */
export function getModelsByTier(tier: ModelTier): ModelConfig[] {
  return ALL_MODELS.filter((m) => m.tier === tier && m.isAvailable)
}

/**
 * Get models by capability
 */
export function getModelsByCapability(capability: Capability): ModelConfig[] {
  return ALL_MODELS.filter((m) => m.capabilities.includes(capability) && m.isAvailable)
}

/**
 * Get models that support tools/function calling
 */
export function getToolCapableModels(): ModelConfig[] {
  return ALL_MODELS.filter((m) => m.supportsTools && m.isAvailable)
}

/**
 * Get models that support reasoning
 */
export function getReasoningModels(): ModelConfig[] {
  return ALL_MODELS.filter((m) => m.supportsReasoning && m.isAvailable)
}

/**
 * Check if model is free
 */
export function isModelFree(id: string): boolean {
  const model = getModel(id)
  return model?.tier === ModelTier.FREE
}

/**
 * Calculate cost for a generation
 */
export function calculateModelCost(
  modelId: string,
  inputTokens: number,
  outputTokens: number
): number {
  const model = getModel(modelId)
  if (!model) return 0
  if (model.tier === ModelTier.FREE) return 0

  const inputCost = (inputTokens / 1_000_000) * model.inputPrice
  const outputCost = (outputTokens / 1_000_000) * model.outputPrice
  return inputCost + outputCost
}

/**
 * Get recommended model for a task type
 */
export type TaskType = 'component' | 'app' | 'debug' | 'refactor' | 'explain'

export function getRecommendedModel(task: TaskType, preferFree = true): ModelConfig {
  if (preferFree) {
    switch (task) {
      case 'component':
        // Best free models for component generation
        return getModel('qwen/qwen3-coder:free') ?? FREE_MODELS[0]!
      case 'app':
        // Best free model for full app generation
        return getModel('deepseek/deepseek-r1-0528:free') ?? FREE_MODELS[0]!
      case 'debug':
        // Fast model for debugging
        return getModel('nvidia/nemotron-3-nano-30b-a3b:free') ?? FREE_MODELS[0]!
      case 'refactor':
        // Reasoning model for refactoring
        return getModel('deepseek/deepseek-r1-0528:free') ?? FREE_MODELS[0]!
      case 'explain':
        // Any good free model
        return getModel('meta-llama/llama-3.3-70b-instruct:free') ?? FREE_MODELS[0]!
      default:
        return FREE_MODELS[0]!
    }
  }

  // Premium recommendations
  switch (task) {
    case 'component':
      return getModel('anthropic/claude-sonnet-4') ?? STANDARD_MODELS[0]!
    case 'app':
      return getModel('google/gemini-2.5-pro') ?? STANDARD_MODELS[0]!
    case 'debug':
      return getModel('anthropic/claude-3.5-sonnet') ?? STANDARD_MODELS[0]!
    case 'refactor':
      return getModel('anthropic/claude-sonnet-4') ?? STANDARD_MODELS[0]!
    case 'explain':
      return getModel('openai/gpt-4o') ?? STANDARD_MODELS[0]!
    default:
      return STANDARD_MODELS[0]!
  }
}

/**
 * Default model for generation (free tier)
 */
export const DEFAULT_FREE_MODEL = 'deepseek/deepseek-r1-0528:free'
export const DEFAULT_PAID_MODEL = 'anthropic/claude-sonnet-4'

/**
 * Model pricing map for backward compatibility
 */
export const MODEL_PRICING_MAP: Record<string, { input: number; output: number; contextWindow: number }> =
  Object.fromEntries(
    ALL_MODELS.map((m) => [
      m.id,
      { input: m.inputPrice, output: m.outputPrice, contextWindow: m.contextWindow },
    ])
  )
