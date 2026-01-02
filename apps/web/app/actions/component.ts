'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { SaveGenerationInput } from '@/types'

// Save a user-generated project (Build Mode - multi-file)
export async function saveGeneration(input: SaveGenerationInput) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Store files as JSON in the code field with a marker
    const codePayload = JSON.stringify({
        __athrean_project: true,
        files: input.files,
    })

    const { data, error } = await supabase
        .from('user_generations')
        .insert({
            user_id: user.id,
            name: input.name,
            code: codePayload,
            prompt: input.prompt,
            model: input.model ?? null,
            duration_ms: input.durationMs ?? null,
            is_public: input.isPublic ?? false,
        })
        .select()
        .single()

    if (error) {
        console.error('Error saving generation:', error)
        return { error: 'Failed to save generation' }
    }

    revalidatePath('/projects')
    revalidatePath('/')
    return { data }
}

// Toggle favorite status for a registry item
export async function toggleFavorite(registryItemId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
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
        const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('id', existing.id)

        if (error) {
            console.error('Error removing favorite:', error)
            return { error: 'Failed to remove favorite' }
        }

        revalidatePath('/projects')
        revalidatePath('/favorites')
        return { success: true, isFavorited: false }
    } else {
        // Add favorite
        const { error } = await supabase
            .from('user_favorites')
            .insert({
                user_id: user.id,
                registry_item_id: registryItemId,
            })

        if (error) {
            console.error('Error adding favorite:', error)
            return { error: 'Failed to add favorite' }
        }

        revalidatePath('/projects')
        revalidatePath('/favorites')
        return { success: true, isFavorited: true }
    }
}

// Rename a user generation
export async function renameGeneration(generationId: string, newName: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { error } = await supabase
        .from('user_generations')
        .update({ name: newName })
        .eq('id', generationId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error renaming generation:', error)
        return { error: 'Failed to rename generation' }
    }

    revalidatePath('/projects')
    revalidatePath('/generate')
    return { success: true }
}

// Delete a user generation
export async function deleteGeneration(generationId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { error } = await supabase
        .from('user_generations')
        .delete()
        .eq('id', generationId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting generation:', error)
        return { error: 'Failed to delete generation' }
    }

    revalidatePath('/projects')
    return { success: true }
}

// Track install count for a registry item
export async function trackInstall(itemName: string) {
    const supabase = await createClient()

    const { error } = await supabase.rpc('increment_install_count', { item_name: itemName })

    if (error) {
        console.error('Error tracking install:', error)
    }
}

// Track view count for a registry item  
export async function trackView(itemName: string) {
    const supabase = await createClient()

    const { error } = await supabase.rpc('increment_registry_view_count', { item_name: itemName })

    if (error) {
        console.error('Error tracking view:', error)
    }
}
