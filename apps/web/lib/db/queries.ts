import { createClient } from '@/lib/supabase/server'
import type { Component, UserComponent, UserCredits, UserProfile } from '@/types'
import type { User } from '@supabase/supabase-js'

interface GetComponentsOptions {
  category?: string
  search?: string
  limit?: number
}

// Transform database row to Component type (snake_case to camelCase)
function transformComponent(row: {
  id: string
  slug: string
  name: string
  description: string | null
  category: string
  tags: string[]
  code: string
  dependencies: unknown
  preview_url: string | null
  is_pro: boolean
  view_count: number
  copy_count: number
  created_at: string
  updated_at: string
}): Component {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.category,
    tags: row.tags,
    code: row.code,
    dependencies: row.dependencies as Record<string, string>,
    previewUrl: row.preview_url,
    isPro: row.is_pro,
    viewCount: row.view_count,
    copyCount: row.copy_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Transform database row to UserComponent type
function transformUserComponent(row: {
  id: string
  user_id: string
  name: string
  code: string
  prompt: string | null
  source: 'generated' | 'forked' | 'saved'
  parent_id: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}): UserComponent {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    code: row.code,
    prompt: row.prompt,
    source: row.source,
    parentId: row.parent_id,
    isPublic: row.is_public,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getComponents(options: GetComponentsOptions = {}): Promise<Component[]> {
  const supabase = await createClient()
  const { category, search, limit = 50 } = options

  let query = supabase
    .from('components')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (category) {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching components:', error)
    return []
  }

  return data.map(transformComponent)
}

export async function getComponentBySlug(slug: string): Promise<Component | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('components')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return transformComponent(data)
}

export async function getCategories(): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('components')
    .select('category')

  if (error || !data) {
    return []
  }

  // Get unique categories
  const categories = [...new Set(data.map((row) => row.category))]
  return categories.sort()
}

export async function getUserComponents(userId: string): Promise<UserComponent[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_components')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data) {
    return []
  }

  return data.map(transformUserComponent)
}

export async function getUserSavedComponents(userId: string): Promise<UserComponent[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_components')
    .select('*')
    .eq('user_id', userId)
    .eq('source', 'saved')
    .order('created_at', { ascending: false })

  if (error || !data) {
    return []
  }

  return data.map(transformUserComponent)
}

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

interface GetPublicProjectsOptions {
  limit?: number
  category?: 'generated' | 'forked' | 'saved' | 'all'
}

// Get all public user-created projects (from prompts)
export async function getPublicProjects(options: GetPublicProjectsOptions = {}): Promise<UserComponent[]> {
  const supabase = await createClient()
  const { limit = 50, category } = options

  let query = supabase
    .from('user_components')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  // If category filter is provided, filter by source type
  if (category && category !== 'all') {
    query = query.eq('source', category as 'generated' | 'forked' | 'saved')
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching public projects:', error)
    return []
  }

  return data.map(transformUserComponent)
}

// Get featured/recent public projects for home page
export async function getFeaturedProjects(limit: number = 6): Promise<UserComponent[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_components')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }

  return data.map(transformUserComponent)
}

