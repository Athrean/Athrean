import { create } from 'zustand'
import type {
  ChatMessage,
  GenerateStore,
  RegistryItem,
  ReasoningStep,
  ContextUsage,
  Checkpoint,
  GenerationMode,
  SyncStatus,
  SupabaseConfig,
  BuildModeStore,
} from '@/types'
import { generateReasoningId } from '@/types/reasoning'

type CombinedStore = GenerateStore & BuildModeStore

export const useGenerateStore = create<CombinedStore>((set, get) => ({
  // Core state
  pendingPrompt: null,
  baseComponent: null,
  messages: [],
  generatedCode: null,
  isGenerating: false,

  // Project state
  currentProjectId: null,
  projectName: 'New Project',

  // Reasoning state
  currentReasoning: [],
  currentContextUsage: null,
  checkpoints: [],

  // Build Mode state
  generationMode: 'component' as GenerationMode,
  activeFilePath: null,
  supabaseConfig: null,
  syncStatus: 'synced' as SyncStatus,
  appProjectId: null,
  fileCount: 0,

  // Core actions
  setPendingPrompt: (prompt: string | null): void => {
    set({ pendingPrompt: prompt })
  },

  setBaseComponent: (component: Pick<RegistryItem, 'id' | 'name' | 'title'> & { code: string } | null): void => {
    set({ baseComponent: component })
  },

  addMessage: (message: ChatMessage): void => {
    const messageWithTimestamp: ChatMessage = {
      ...message,
      timestamp: message.timestamp ?? Date.now(),
    }
    set((state) => ({
      messages: [...state.messages, messageWithTimestamp],
    }))
  },

  setGeneratedCode: (code: string | null): void => {
    set({ generatedCode: code })
  },

  setIsGenerating: (value: boolean): void => {
    set({ isGenerating: value })
  },

  consumePendingPrompt: (): string | null => {
    const prompt = get().pendingPrompt
    set({ pendingPrompt: null })
    return prompt
  },

  reset: (): void => {
    set({
      pendingPrompt: null,
      baseComponent: null,
      messages: [],
      generatedCode: null,
      isGenerating: false,
      currentProjectId: null,
      projectName: 'New Project',
      currentReasoning: [],
      currentContextUsage: null,
      checkpoints: [],
    })
  },

  // Project actions
  setCurrentProjectId: (id: string | null): void => {
    set({ currentProjectId: id })
  },

  setProjectName: (name: string): void => {
    set({ projectName: name })
  },

  loadProject: (project: { id: string; name: string; code: string; prompt: string }): void => {
    const timestamp = Date.now()
    set({
      currentProjectId: project.id,
      projectName: project.name,
      generatedCode: project.code,
      messages: [
        { role: 'user', content: project.prompt, timestamp },
        { role: 'assistant', content: `\`\`\`tsx\n${project.code}\n\`\`\``, timestamp: timestamp + 1 },
      ],
      // Clear reasoning/checkpoints for loaded projects
      currentReasoning: [],
      currentContextUsage: null,
      checkpoints: [],
    })
  },

  // Reasoning actions
  addReasoningStep: (step: ReasoningStep): void => {
    set((state) => ({
      currentReasoning: [...state.currentReasoning, step],
    }))
  },

  updateReasoningStep: (id: string, updates: Partial<ReasoningStep>): void => {
    set((state) => ({
      currentReasoning: state.currentReasoning.map((step) =>
        step.id === id ? { ...step, ...updates } : step
      ),
    }))
  },

  clearReasoning: (): void => {
    set({ currentReasoning: [] })
  },

  setContextUsage: (usage: ContextUsage | null): void => {
    set({ currentContextUsage: usage })
  },

  // Checkpoint actions
  addCheckpoint: (label: string): void => {
    const state = get()
    const checkpoint: Checkpoint = {
      id: generateReasoningId(),
      messageIndex: state.messages.length - 1,
      label,
      timestamp: Date.now(),
      generatedCode: state.generatedCode,
    }
    set((state) => ({
      checkpoints: [...state.checkpoints, checkpoint],
    }))
  },

  restoreCheckpoint: (checkpoint: Checkpoint): void => {
    set((state) => ({
      messages: state.messages.slice(0, checkpoint.messageIndex + 1),
      generatedCode: checkpoint.generatedCode,
      currentReasoning: [],
      currentContextUsage: null,
    }))
  },

  clearCheckpoints: (): void => {
    set({ checkpoints: [] })
  },

  // Build Mode actions
  setGenerationMode: (mode: GenerationMode): void => {
    set({
      generationMode: mode,
      // Reset some state when switching modes
      activeFilePath: null,
      generatedCode: null,
    })
  },

  setActiveFile: (path: string | null): void => {
    set({ activeFilePath: path })
  },

  setSupabaseConfig: (config: SupabaseConfig | null): void => {
    set({ supabaseConfig: config })
  },

  setSyncStatus: (status: SyncStatus): void => {
    set({ syncStatus: status })
  },

  setAppProjectId: (id: string | null): void => {
    set({ appProjectId: id })
  },

  setFileCount: (count: number): void => {
    set({ fileCount: count })
  },

  resetBuildMode: (): void => {
    set({
      generationMode: 'component',
      activeFilePath: null,
      supabaseConfig: null,
      syncStatus: 'synced',
      appProjectId: null,
      fileCount: 0,
    })
  },
}))
