/**
 * In-Memory Store for Conversation Context Caching
 *
 * Provides fast access to recent conversation history without database hits.
 * Uses TTL-based eviction to prevent memory bloat.
 *
 * Pattern adapted from 1ai-develop/backend/InMemoryStore.ts
 */

export interface CachedMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

interface CacheEntry<T> {
  data: T
  evictionTime: number
}

// Configuration
const DEFAULT_TTL_MS = 5 * 60 * 1000 // 5 minutes
const EVICTION_INTERVAL_MS = 60 * 1000 // Check every minute
const MAX_ENTRIES = 10000 // Prevent unbounded growth

/**
 * Generic In-Memory Cache with TTL
 */
export class InMemoryCache<T> {
  private store: Map<string, CacheEntry<T>>
  private evictionTimer: ReturnType<typeof setInterval> | null = null
  private ttlMs: number
  private maxEntries: number

  constructor(options?: { ttlMs?: number; maxEntries?: number }) {
    this.store = new Map()
    this.ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS
    this.maxEntries = options?.maxEntries ?? MAX_ENTRIES
    this.startEvictionClock()
  }

  private startEvictionClock(): void {
    // Don't start multiple clocks
    if (this.evictionTimer) return

    this.evictionTimer = setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.store.entries()) {
        if (entry.evictionTime < now) {
          this.store.delete(key)
        }
      }
    }, EVICTION_INTERVAL_MS)

    // Allow process to exit even if timer is running
    if (typeof this.evictionTimer.unref === 'function') {
      this.evictionTimer.unref()
    }
  }

  /**
   * Get cached value
   */
  get(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null

    // Check if expired
    if (entry.evictionTime < Date.now()) {
      this.store.delete(key)
      return null
    }

    return entry.data
  }

  /**
   * Set cached value with TTL refresh
   */
  set(key: string, data: T): void {
    // Enforce max entries - remove oldest if at limit
    if (this.store.size >= this.maxEntries && !this.store.has(key)) {
      const oldestKey = this.store.keys().next().value
      if (oldestKey) {
        this.store.delete(oldestKey)
      }
    }

    this.store.set(key, {
      data,
      evictionTime: Date.now() + this.ttlMs,
    })
  }

  /**
   * Delete cached value
   */
  delete(key: string): boolean {
    return this.store.delete(key)
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Get current cache size
   */
  get size(): number {
    return this.store.size
  }

  /**
   * Clear all cached values
   */
  clear(): void {
    this.store.clear()
  }

  /**
   * Destroy the cache and stop eviction timer
   */
  destroy(): void {
    if (this.evictionTimer) {
      clearInterval(this.evictionTimer)
      this.evictionTimer = null
    }
    this.store.clear()
  }
}

/**
 * Specialized store for conversation messages
 */
class ConversationStore {
  private static instance: ConversationStore | null = null
  private cache: InMemoryCache<CachedMessage[]>

  private constructor() {
    this.cache = new InMemoryCache<CachedMessage[]>({
      ttlMs: 10 * 60 * 1000, // 10 minutes for conversations
      maxEntries: 5000,
    })
  }

  static getInstance(): ConversationStore {
    if (!ConversationStore.instance) {
      ConversationStore.instance = new ConversationStore()
    }
    return ConversationStore.instance
  }

  /**
   * Get all messages for a conversation
   */
  getMessages(conversationId: string): CachedMessage[] {
    return this.cache.get(conversationId) ?? []
  }

  /**
   * Add a message to a conversation
   */
  addMessage(conversationId: string, message: Omit<CachedMessage, 'timestamp'>): void {
    const messages = this.getMessages(conversationId)
    const newMessage: CachedMessage = {
      ...message,
      timestamp: Date.now(),
    }
    messages.push(newMessage)
    this.cache.set(conversationId, messages)
  }

  /**
   * Set all messages for a conversation (replaces existing)
   */
  setMessages(conversationId: string, messages: CachedMessage[]): void {
    this.cache.set(conversationId, messages)
  }

  /**
   * Clear a conversation from cache
   */
  clearConversation(conversationId: string): void {
    this.cache.delete(conversationId)
  }

  /**
   * Get the last N messages from a conversation
   */
  getRecentMessages(conversationId: string, count: number): CachedMessage[] {
    const messages = this.getMessages(conversationId)
    return messages.slice(-count)
  }

  /**
   * Check if conversation is cached
   */
  hasConversation(conversationId: string): boolean {
    return this.cache.has(conversationId)
  }

  /**
   * Get cache stats
   */
  getStats(): { conversationCount: number } {
    return {
      conversationCount: this.cache.size,
    }
  }
}

/**
 * Specialized store for generation results
 */
class GenerationCache {
  private static instance: GenerationCache | null = null
  private cache: InMemoryCache<string>

  private constructor() {
    this.cache = new InMemoryCache<string>({
      ttlMs: 30 * 60 * 1000, // 30 minutes for generated code
      maxEntries: 1000,
    })
  }

  static getInstance(): GenerationCache {
    if (!GenerationCache.instance) {
      GenerationCache.instance = new GenerationCache()
    }
    return GenerationCache.instance
  }

  /**
   * Cache generated code by prompt hash
   */
  cacheGeneration(promptHash: string, code: string): void {
    this.cache.set(promptHash, code)
  }

  /**
   * Get cached generation
   */
  getCachedGeneration(promptHash: string): string | null {
    return this.cache.get(promptHash)
  }

  /**
   * Check if prompt has been generated before
   */
  hasGeneration(promptHash: string): boolean {
    return this.cache.has(promptHash)
  }
}

// Export singleton instances
export const conversationStore = ConversationStore.getInstance()
export const generationCache = GenerationCache.getInstance()

// Export classes for testing
export { ConversationStore, GenerationCache }

/**
 * Utility: Create a hash from prompt for cache key
 */
export function hashPrompt(prompt: string, model: string): string {
  // Simple hash function - in production you might want to use crypto
  let hash = 0
  const str = `${prompt}:${model}`
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `gen_${Math.abs(hash).toString(36)}`
}
