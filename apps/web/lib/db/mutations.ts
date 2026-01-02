'use client'

import { createClient } from '@/lib/supabase/client'
import type {
  SaveGenerationInput,
  UserGeneration,
  UserProfile,
  UpdateProfileInput,
} from '@/types'

// Save a user-generated AI project (Build Mode - multi-file)
export async function saveUserGeneration(data: SaveGenerationInput): Promise<UserGeneration | null> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Store files as JSON in the code field with a marker
  const codePayload = JSON.stringify({
    __athrean_project: true,
    files: data.files,
  })

  const { data: generation, error } = await supabase
    .from('user_generations')
    .insert({
      user_id: user.id,
      name: data.name,
      code: codePayload,
      prompt: data.prompt,
      model: data.model ?? null,
      duration_ms: data.durationMs ?? null,
      is_public: data.isPublic ?? false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving generation:', error)
    return null
  }

  return {
    id: generation.id,
    userId: generation.user_id,
    name: generation.name,
    code: generation.code,
    prompt: generation.prompt,
    model: generation.model,
    durationMs: generation.duration_ms,
    isPublic: generation.is_public,
    createdAt: generation.created_at,
    updatedAt: generation.updated_at,
  }
}

// Delete a user generation
export async function deleteUserGeneration(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('user_generations')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting generation:', error)
    throw new Error('Failed to delete generation')
  }
}

// Track install count for registry items
export async function trackInstall(itemName: string): Promise<void> {
  const supabase = createClient()

  await supabase.rpc('increment_install_count', { item_name: itemName })
}

// Track view count for registry items
export async function trackView(itemName: string): Promise<void> {
  const supabase = createClient()

  await supabase.rpc('increment_registry_view_count', { item_name: itemName })
}

// Toggle favorite status for a registry item
export async function toggleFavorite(registryItemId: string): Promise<boolean> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('registry_item_id', registryItemId)
    .single()

  if (existing) {
    // Remove favorite
    await supabase
      .from('user_favorites')
      .delete()
      .eq('id', existing.id)
    return false
  } else {
    // Add favorite
    await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        registry_item_id: registryItemId,
      })
    return true
  }
}

// Decrement user credits
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

// Update user profile
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

// Update username
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
