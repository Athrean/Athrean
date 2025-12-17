'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { SaveComponentInput } from '@/types'

export async function saveComponent(input: SaveComponentInput) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data, error } = await supabase
        .from('user_components')
        .insert({
            user_id: user.id,
            name: input.name,
            code: input.code,
            prompt: input.prompt,
            source: input.source,
            parent_id: input.parentId,
            is_public: input.isPublic ?? false,
        })
        .select()
        .single()

    if (error) {
        console.error('Error saving component:', error)
        return { error: 'Failed to save component' }
    }

    revalidatePath('/projects')
    return { data }
}

export async function toggleStar(componentId: string, name: string, code: string, isStarred: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    if (isStarred) {
        // Unstar = Delete the saved component reference
        // We need to find the user_component that corresponds to this component
        // Assuming we are "unstarring" a component we previously saved.
        // However, we might need the ID of the *user_component* entry, not the original component ID.
        // If we are passed the original component ID (parentId), we delete the entry with that parentId.

        const { error } = await supabase
            .from('user_components')
            .delete()
            .eq('user_id', user.id)
            .eq('parent_id', componentId)
            .eq('source', 'saved')

        if (error) {
            console.error('Error unstarring component:', error)
            return { error: 'Failed to unstar component' }
        }
    } else {
        // Star = Save as "saved" source
        const { error } = await supabase
            .from('user_components')
            .insert({
                user_id: user.id,
                name: name,
                code: code,
                source: 'saved',
                parent_id: componentId, // Reference to original
                is_public: false,
            })

        if (error) {
            console.error('Error starring component:', error)
            return { error: 'Failed to star component' }
        }
    }

    revalidatePath('/projects')
    revalidatePath('/starred')
    return { success: true }
}

export async function renameProject(projectId: string, newName: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { error } = await supabase
        .from('user_components')
        .update({ name: newName })
        .eq('id', projectId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error renaming project:', error)
        return { error: 'Failed to rename project' }
    }

    revalidatePath('/projects')
    revalidatePath('/generate')
    return { success: true }
}
