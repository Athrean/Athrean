import { NextResponse } from 'next/server'
import { getGenerationById } from '@/lib/db/queries'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(
    request: Request,
    { params }: RouteParams
): Promise<NextResponse> {
    const { id } = await params

    if (!id) {
        return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const project = await getGenerationById(id)

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Allow access if project is public OR user is the owner
    if (!project.isPublic && (!user || user.id !== project.userId)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(project)
}
