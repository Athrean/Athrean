/**
 * Project Types for Build Mode
 *
 * Types for multi-file Next.js project generation.
 */

// ============================================================================
// GENERATION MODE
// ============================================================================

export type GenerationMode = 'component' | 'app'

// ============================================================================
// SYNC STATUS
// ============================================================================

export type SyncStatus = 'synced' | 'pending' | 'conflict'

// ============================================================================
// PROJECT FILE
// ============================================================================

export interface ProjectFile {
  id: string
  path: string
  content: string
  fileType: string
  version: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectFileInput {
  path: string
  content: string
  fileType?: string
}

// ============================================================================
// USER PROJECT
// ============================================================================

export interface UserProject {
  id: string
  userId: string
  name: string
  description: string | null
  generationMode: GenerationMode
  framework: string
  supabaseUrl: string | null
  supabaseAnonKey: string | null
  syncStatus: SyncStatus
  localVersion: number
  remoteVersion: number
  model: string | null
  totalTokensUsed: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectWithFiles extends UserProject {
  files: ProjectFile[]
}

export interface CreateProjectInput {
  name: string
  description?: string
  generationMode: GenerationMode
  supabaseUrl?: string
  supabaseAnonKey?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  supabaseUrl?: string
  supabaseAnonKey?: string
  isPublic?: boolean
}

// ============================================================================
// SUPABASE CONFIG (User's own instance for generated apps)
// ============================================================================

export interface SupabaseConfig {
  url: string
  anonKey: string
}

// ============================================================================
// FILE TREE
// ============================================================================

export interface FileTreeNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileTreeNode[]
  isExpanded?: boolean
}

// ============================================================================
// AI TOOL CALL TYPES
// ============================================================================

export interface CreateFileToolCall {
  path: string
  content: string
}

export interface UpdateFileToolCall {
  path: string
  content: string
}

export interface DeleteFileToolCall {
  path: string
}

export type FileToolCall =
  | { type: 'createFile'; args: CreateFileToolCall }
  | { type: 'updateFile'; args: UpdateFileToolCall }
  | { type: 'deleteFile'; args: DeleteFileToolCall }

// ============================================================================
// PROJECT MESSAGE
// ============================================================================

export interface ProjectMessage {
  id: string
  projectId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  reasoning?: unknown
  contextUsage?: unknown
  toolCalls?: FileToolCall[]
  createdAt: string
}

// ============================================================================
// FILE SYSTEM CONTEXT
// ============================================================================

export interface FileSystemContext {
  isInitialized: boolean
  projectId: string | null
  files: Map<string, string>
  readFile: (path: string) => Promise<string>
  writeFile: (path: string, content: string) => Promise<void>
  deleteFile: (path: string) => Promise<void>
  listFiles: (dir?: string) => Promise<string[]>
  exists: (path: string) => Promise<boolean>
  getAllFiles: () => Promise<Record<string, string>>
}

// ============================================================================
// BUILD MODE STORE EXTENSION
// ============================================================================

export interface BuildModeState {
  generationMode: GenerationMode
  activeFilePath: string | null
  supabaseConfig: SupabaseConfig | null
  syncStatus: SyncStatus
  appProjectId: string | null
  fileCount: number
}

export interface BuildModeActions {
  setGenerationMode: (mode: GenerationMode) => void
  setActiveFile: (path: string | null) => void
  setSupabaseConfig: (config: SupabaseConfig | null) => void
  setSyncStatus: (status: SyncStatus) => void
  setAppProjectId: (id: string | null) => void
  setFileCount: (count: number) => void
  resetBuildMode: () => void
}

export type BuildModeStore = BuildModeState & BuildModeActions
