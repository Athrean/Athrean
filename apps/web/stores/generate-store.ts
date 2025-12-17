import { create } from 'zustand'
import type {
  ChatMessage,
  GenerateStore,
  Component,
  ReasoningStep,
  ContextUsage,
  Checkpoint,
} from '@/types'
import { generateReasoningId } from '@/types/reasoning'

export const useGenerateStore = create<GenerateStore>((set, get) => ({
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

  // Core actions
  setPendingPrompt: (prompt: string | null): void => {
    set({ pendingPrompt: prompt })
  },

  setBaseComponent: (component: Pick<Component, 'id' | 'name' | 'code'> | null): void => {
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
}))
