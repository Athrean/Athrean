// Import reasoning types for use in this file
import type { ReasoningStep, ContextUsage, Checkpoint } from './reasoning'

// Re-export reasoning types
export * from './reasoning'

// ============================================
// Registry-based Component Library Types
// ============================================

// Category for organizing components
export interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Registry item (component in the library)
export interface RegistryItem {
  id: string
  name: string
  type: string
  title: string
  description: string | null
  author: string
  categoryId: string | null
  registryDependencies: string[]
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  files: RegistryFile[]
  iframeHeight: string
  isPro: boolean
  isFeatured: boolean
  tags: string[]
  installCount: number
  viewCount: number
  createdAt: string
  updatedAt: string
}

// File within a registry item
export interface RegistryFile {
  path: string
  content: string
  type: string
  target: string
}

// User favorite (saved component)
export interface UserFavorite {
  id: string
  userId: string
  registryItemId: string
  createdAt: string
}

// User-generated component (AI generated)
export interface UserGeneration {
  id: string
  userId: string
  name: string
  prompt: string
  code: string
  model: string | null
  durationMs: number | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
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

// ============================================
// Chat & Generation Types
// ============================================

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
  baseComponent: Pick<RegistryItem, 'id' | 'name' | 'title'> & { code: string } | null
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
  setBaseComponent: (component: Pick<RegistryItem, 'id' | 'name' | 'title'> & { code: string } | null) => void
  addMessage: (message: ChatMessage) => void
  setGeneratedCode: (code: string | null) => void
  setIsGenerating: (value: boolean) => void
  consumePendingPrompt: () => string | null
  reset: () => void

  // Project actions
  setCurrentProjectId: (id: string | null) => void
  setProjectName: (name: string) => void
  loadProject: (project: { id: string; name: string; code: string; prompt: string }) => void

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
export interface SaveGenerationInput {
  name: string
  code: string
  prompt: string
  model?: string
  durationMs?: number
  isPublic?: boolean
}

export interface LogGenerationInput {
  prompt: string
  resultCode: string | null
  model: string
  durationMs: number
}

// ============================================
// Registry Format Types (shadcn-compatible)
// ============================================

export type RegistryItemType =
  | "registry:lib"
  | "registry:block"
  | "registry:component"
  | "registry:ui"
  | "registry:hook"
  | "registry:theme"
  | "registry:page"
  | "registry:file"
  | "registry:style"
  | "registry:item"

export interface Registry {
  $schema: string
  name: string
  homepage: string
  items: RegistryItem[]
}
