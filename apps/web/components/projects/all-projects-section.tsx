'use client'

import Link from 'next/link'
import { Sparkles, GitFork, Code } from 'lucide-react'
import { FileFolder3D } from '@/components/ui/file-folder-3d'
import type { UserComponent } from '@/types'

interface AllProjectsSectionProps {
  projects: UserComponent[]
}

const sourceIcons = {
  generated: Sparkles,
  forked: GitFork,
  saved: Code,
}

const sourceLabels = {
  generated: 'AI Generated',
  forked: 'Forked',
  saved: 'Saved',
}

function ProjectCard({ project }: { project: UserComponent }): React.ReactElement {
  const hue = (project.name.charCodeAt(0) * 15) % 360
  const SourceIcon = sourceIcons[project.source]

  return (
    <Link href={`/generate?project=${project.id}`} className="block group">
      <div
        className="aspect-4/3 rounded-2xl overflow-hidden flex flex-col p-5 transition-all duration-300 hover:scale-[1.02]"
        style={{
          background: `linear-gradient(145deg, hsl(${hue}, 40%, 10%) 0%, hsl(${hue}, 30%, 6%) 100%)`,
        }}
      >
        {/* Source Badge */}
        <div className="flex items-center gap-1.5 mb-auto">
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-900/60 text-xs text-zinc-400">
            <SourceIcon className="w-3 h-3" />
            {sourceLabels[project.source]}
          </span>
        </div>

        {/* Content */}
        <div className="mt-auto">
          <h3 className="text-base text-zinc-100 font-semibold line-clamp-2 mb-1">
            {project.name}
          </h3>
          {project.prompt && (
            <p className="text-sm text-zinc-500 line-clamp-2">
              {project.prompt}
            </p>
          )}
          <p className="text-xs text-zinc-600 mt-2">
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  )
}

export function AllProjectsSection({ projects }: AllProjectsSectionProps): React.ReactElement {
  if (projects.length === 0) {
    return (
      <FileFolder3D
        title="No projects yet"
        description="Projects created by the community will appear here. Be the first to create one!"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
