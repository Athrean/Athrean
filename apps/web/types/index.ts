// Import reasoning types for use in this file
import type { ReasoningStep, ContextUsage, Checkpoint } from './reasoning'

// Re-export reasoning types
export * from './reasoning'

// Component from the library (curated)
export interface Component {
  id: string
  slug: string
  name: string
  description: string | null
  category: string
  tags: string[]
  code: string
  dependencies: Record<string, string>
  previewUrl: string | null
  isPro: boolean
  viewCount: number
  copyCount: number
  createdAt: string
  updatedAt: string
}

// User-saved or generated component
export interface UserComponent {
  id: string
  userId: string
  name: string
  code: string
  prompt: string | null
  source: 'generated' | 'forked' | 'saved'
  parentId: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// Generation record
export interface Generation {
  id: string
  userId: string
  prompt: string
  resultCode: string | null
  model: string
  durationMs: number | null
  createdAt: string
}

// User credits and plan
export interface UserCredits {
  userId: string
  credits: number
  plan: 'free' | 'pro'
  updatedAt: string
}

// User profile
export interface UserProfile {
  id: string
  username: string | null
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  website: string | null
  createdAt: string
  updatedAt: string
}

// Input type for updating profile
export interface UpdateProfileInput {
  username?: string
  displayName?: string
  avatarUrl?: string
  bio?: string
  website?: string
}

// Chat message in generate flow
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  reasoning?: ReasoningStep[]
  contextUsage?: ContextUsage
  timestamp?: number
}

// Request body for /generate endpoint
export interface GenerateRequest {
  prompt: string
  baseCode?: string
  history?: ChatMessage[]
  model?: string
}

// Zustand store interface for generate flow
export interface GenerateStore {
  // Core state
  pendingPrompt: string | null
  baseComponent: Pick<Component, 'id' | 'name' | 'code'> | null
  messages: ChatMessage[]
  generatedCode: string | null
  isGenerating: boolean

  // Project state
  currentProjectId: string | null
  projectName: string

  // Reasoning state
  currentReasoning: ReasoningStep[]
  currentContextUsage: ContextUsage | null
  checkpoints: Checkpoint[]

  // Core actions
  setPendingPrompt: (prompt: string | null) => void
  setBaseComponent: (component: Pick<Component, 'id' | 'name' | 'code'> | null) => void
  addMessage: (message: ChatMessage) => void
  setGeneratedCode: (code: string | null) => void
  setIsGenerating: (value: boolean) => void
  consumePendingPrompt: () => string | null
  reset: () => void

  // Project actions
  setCurrentProjectId: (id: string | null) => void
  setProjectName: (name: string) => void

  // Reasoning actions
  addReasoningStep: (step: ReasoningStep) => void
  updateReasoningStep: (id: string, updates: Partial<ReasoningStep>) => void
  clearReasoning: () => void
  setContextUsage: (usage: ContextUsage | null) => void

  // Checkpoint actions
  addCheckpoint: (label: string) => void
  restoreCheckpoint: (checkpoint: Checkpoint) => void
  clearCheckpoints: () => void
}

// Input types for mutations
export interface SaveComponentInput {
  name: string
  code: string
  prompt?: string
  source: 'generated' | 'forked' | 'saved'
  parentId?: string
  isPublic?: boolean
}

export interface LogGenerationInput {
  prompt: string
  resultCode: string | null
  model: string
  durationMs: number
}

