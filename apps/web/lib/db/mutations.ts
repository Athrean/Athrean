'use client'

import { createClient } from '@/lib/supabase/client'
import type {
  SaveComponentInput,
  LogGenerationInput,
  UserComponent,
  UserProfile,
  UpdateProfileInput,
} from '@/types'

export async function saveUserComponent(data: SaveComponentInput): Promise<UserComponent | null> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data: component, error } = await supabase
    .from('user_components')
    .insert({
      user_id: user.id,
      name: data.name,
      code: data.code,
      prompt: data.prompt ?? null,
      source: data.source,
      parent_id: data.parentId ?? null,
      is_public: data.isPublic ?? false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving component:', error)
    return null
  }

  return {
    id: component.id,
    userId: component.user_id,
    name: component.name,
    code: component.code,
    prompt: component.prompt,
    source: component.source,
    parentId: component.parent_id,
    isPublic: component.is_public,
    createdAt: component.created_at,
    updatedAt: component.updated_at,
  }
}

export async function deleteUserComponent(id: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('user_components')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting component:', error)
    throw new Error('Failed to delete component')
  }
}

export async function trackCopy(slug: string): Promise<void> {
  const supabase = createClient()
  
  await supabase.rpc('increment_copy_count', { component_slug: slug })
}

export async function trackView(slug: string): Promise<void> {
  const supabase = createClient()
  
  await supabase.rpc('increment_view_count', { component_slug: slug })
}

export async function logGeneration(data: LogGenerationInput): Promise<void> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('generations').insert({
    user_id: user.id,
    prompt: data.prompt,
    result_code: data.resultCode,
    model: data.model,
    duration_ms: data.durationMs,
  })
}

export async function decrementCredits(): Promise<number> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase.rpc('decrement_credits', { p_user_id: user.id })

  if (error) {
    console.error('Error decrementing credits:', error)
    throw new Error('Failed to decrement credits')
  }

  return data as number
}

export async function updateUserProfile(input: UpdateProfileInput): Promise<UserProfile | null> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const updateData: Record<string, unknown> = {}
  if (input.displayName !== undefined) updateData.display_name = input.displayName
  if (input.avatarUrl !== undefined) updateData.avatar_url = input.avatarUrl
  if (input.bio !== undefined) updateData.bio = input.bio
  if (input.website !== undefined) updateData.website = input.website

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    website: profile.website,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  }
}

export async function updateUsername(newUsername: string): Promise<boolean> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase.rpc('update_username', {
    new_username: newUsername,
  })

  if (error) {
    console.error('Error updating username:', error)
    throw new Error(error.message)
  }

  return data as boolean
}

