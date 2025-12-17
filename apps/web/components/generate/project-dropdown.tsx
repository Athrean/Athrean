'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Home, Pencil, Star, Loader2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGenerateStore } from '@/stores/generate-store'
import { renameProject, toggleStar } from '@/app/actions/component'
import { toast } from 'sonner'

interface ProjectDropdownProps {
    projectName: string
    projectId: string | null
}

export function ProjectDropdown({ projectName, projectId }: ProjectDropdownProps): React.ReactElement {
    const router = useRouter()
    const { setProjectName } = useGenerateStore()
    const [isRenameOpen, setIsRenameOpen] = useState(false)
    const [newName, setNewName] = useState(projectName)
    const [isRenaming, setIsRenaming] = useState(false)
    const [isStarring, setIsStarring] = useState(false)

    const handleGoToWorkspace = (): void => {
        router.push('/')
    }

    const handleRename = async (): Promise<void> => {
        if (!projectId || !newName.trim() || isRenaming) return

        setIsRenaming(true)
        try {
            const result = await renameProject(projectId, newName.trim())
            if (result.error) {
                toast.error('Failed to rename project')
            } else {
                setProjectName(newName.trim())
                toast.success('Project renamed')
                setIsRenameOpen(false)
            }
        } catch {
            toast.error('An error occurred')
        } finally {
            setIsRenaming(false)
        }
    }

    const handleStar = async (): Promise<void> => {
        if (!projectId || isStarring) return

        setIsStarring(true)
        try {
            const result = await toggleStar(projectId, projectName, '', false)
            if (result.error) {
                toast.error('Failed to star project')
            } else {
                toast.success('Project starred')
            }
        } catch {
            toast.error('An error occurred')
        } finally {
            setIsStarring(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 hover:bg-zinc-900/50 rounded-lg px-2 py-1 transition-colors group">
                        <span className="font-medium text-sm text-zinc-200">{projectName}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-zinc-900 border-zinc-800">
                    <DropdownMenuItem onClick={handleGoToWorkspace} className="gap-2 cursor-pointer">
                        <Home className="w-4 h-4" />
                        Go to Workspace
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem
                        onClick={() => {
                            setNewName(projectName)
                            setIsRenameOpen(true)
                        }}
                        disabled={!projectId}
                        className="gap-2 cursor-pointer"
                    >
                        <Pencil className="w-4 h-4" />
                        Rename project
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleStar} disabled={!projectId || isStarring} className="gap-2 cursor-pointer">
                        {isStarring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                        Star project
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100">Rename Project</DialogTitle>
                    </DialogHeader>
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Project name"
                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename()
                        }}
                    />
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRenameOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleRename} disabled={isRenaming || !newName.trim()}>
                            {isRenaming ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
