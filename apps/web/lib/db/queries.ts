import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

// ============================================
// Types
// ============================================

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
  files: Array<{
    path: string
    content: string
    type: string
    target: string
  }>
  iframeHeight: string
  isPro: boolean
  isFeatured: boolean
  tags: string[]
  installCount: number
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface UserFavorite {
  id: string
  userId: string
  registryItemId: string
  createdAt: string
}

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

export interface UserCredits {
  userId: string
  credits: number
  plan: 'free' | 'pro'
  updatedAt: string
}

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

// ============================================
// Transform functions
// ============================================

function transformCategory(row: {
  id: string
  name: string
  description: string | null
  icon: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}): Category {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
    displayOrder: row.display_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformRegistryItem(row: {
  id: string
  name: string
  type: string
  title: string
  description: string | null
  author: string
  category_id: string | null
  registry_dependencies: string[]
  dependencies: unknown
  dev_dependencies: unknown
  files: unknown
  iframe_height: string
  is_pro: boolean
  is_featured: boolean
  tags: string[]
  install_count: number
  view_count: number
  created_at: string
  updated_at: string
}): RegistryItem {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    title: row.title,
    description: row.description,
    author: row.author,
    categoryId: row.category_id,
    registryDependencies: row.registry_dependencies,
    dependencies: row.dependencies as Record<string, string>,
    devDependencies: row.dev_dependencies as Record<string, string>,
    files: row.files as RegistryItem['files'],
    iframeHeight: row.iframe_height,
    isPro: row.is_pro,
    isFeatured: row.is_featured,
    tags: row.tags,
    installCount: row.install_count,
    viewCount: row.view_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformUserGeneration(row: {
  id: string
  user_id: string
  name: string
  prompt: string
  code: string
  model: string | null
  duration_ms: number | null
  is_public: boolean
  created_at: string
  updated_at: string
}): UserGeneration {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    prompt: row.prompt,
    code: row.code,
    model: row.model,
    durationMs: row.duration_ms,
    isPublic: row.is_public,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ============================================
// Category queries
// ============================================

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error || !data) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data.map(transformCategory)
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return transformCategory(data)
}

// ============================================
// Registry item queries
// ============================================

interface GetRegistryItemsOptions {
  categoryId?: string
  search?: string
  limit?: number
  featured?: boolean
}

export async function getRegistryItems(options: GetRegistryItemsOptions = {}): Promise<RegistryItem[]> {
  const supabase = await createClient()
  const { categoryId, search, limit = 50, featured } = options

  let query = supabase
    .from('registry_items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  if (featured !== undefined) {
    query = query.eq('is_featured', featured)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,name.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching registry items:', error)
    return []
  }

  return data.map(transformRegistryItem)
}

export async function getRegistryItemByName(name: string): Promise<RegistryItem | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('registry_items')
    .select('*')
    .eq('name', name)
    .single()

  if (error || !data) {
    return null
  }

  return transformRegistryItem(data)
}

export async function getFeaturedItems(limit: number = 6): Promise<RegistryItem[]> {
  return getRegistryItems({ featured: true, limit })
}

// ============================================
// User queries
// ============================================

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return {
    userId: data.user_id,
    credits: data.credits,
    plan: data.plan,
    updatedAt: data.updated_at,
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    username: data.username,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    website: data.website,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function getUserProfileByUsername(username: string): Promise<UserProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    username: data.username,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    website: data.website,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('is_username_available', {
    check_username: username,
  })

  if (error) {
    console.error('Error checking username:', error)
    return false
  }

  return data as boolean
}

// ============================================
// User favorites queries
// ============================================

export async function getUserFavorites(userId: string): Promise<RegistryItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      registry_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data) {
    console.error('Error fetching user favorites:', error)
    return []
  }

  return data
    .filter((row) => row.registry_items)
    .map((row) => transformRegistryItem(row.registry_items as any))
}

export async function isItemFavorited(userId: string, itemId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('registry_item_id', itemId)
    .single()

  return !error && !!data
}

// ============================================
// User generations queries
// ============================================

export async function getUserGenerations(userId: string): Promise<UserGeneration[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data) {
    console.error('Error fetching user generations:', error)
    return []
  }

  return data.map(transformUserGeneration)
}

export async function getPublicGenerations(limit: number = 50): Promise<UserGeneration[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_generations')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error('Error fetching public generations:', error)
    return []
  }

  return data.map(transformUserGeneration)
}

export async function getGenerationById(id: string): Promise<UserGeneration | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_generations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return transformUserGeneration(data)
}

