'use client'

import Link from 'next/link'
import { FolderOpen, ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileFolder3D } from '@/components/ui/file-folder-3d'

type EmptyStateType = 'recent' | 'myProjects'

interface EmptyStateProps {
    type: EmptyStateType
    isAuthenticated: boolean
}

export function EmptyState({ type, isAuthenticated }: EmptyStateProps): React.ReactElement | null {
    if (type === 'myProjects') {
        if (!isAuthenticated) {
            return (
                <div className="text-center py-16">
                    <FolderOpen className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h4 className="text-xl text-zinc-200 font-semibold mb-2">Sign in to see your projects</h4>
                    <p className="text-zinc-500 mb-6">Your saved projects will appear here</p>
                    <Link href="/auth/login">
                        <Button variant="outline" className="gap-2 px-6 py-3 rounded-xl">
                            Sign In
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            )
        }

        return (
            <div className="flex flex-col items-center">
                <FileFolder3D
                    title="No projects yet"
                    description="Start creating to see your projects here"
                />
                <Link href="/generate">
                    <Button className="gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 -mt-8 relative z-10">
                        <Plus className="w-4 h-4" />
                        Create New
                    </Button>
                </Link>
            </div>
        )
    }

    if (type === 'recent') {
        return (
            <div className="flex flex-col items-center">
                <FileFolder3D
                    title="No recent projects"
                    description="Projects created from prompts will appear here"
                />
                <Link href="/generate">
                    <Button className="gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 -mt-8 relative z-10">
                        <Plus className="w-4 h-4" />
                        Create New
                    </Button>
                </Link>
            </div>
        )
    }

    return null
}
