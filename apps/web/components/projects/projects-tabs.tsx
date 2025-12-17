'use client'

import Link from 'next/link'
import { LayoutGrid, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectsTabsProps {
  activeTab: 'all' | 'featured' | 'components'
}

const tabs = [
  { id: 'all' as const, label: 'All Projects', icon: LayoutGrid, href: '/projects' },
  { id: 'featured' as const, label: 'Featured', icon: Star, href: '/projects?tab=featured' },
  { id: 'components' as const, label: 'Components', icon: LayoutGrid, href: '/projects?tab=components' },
]

export function ProjectsTabs({ activeTab }: ProjectsTabsProps): React.ReactElement {
  return (
    <div className="flex gap-1 p-1.5 bg-zinc-900 rounded-2xl w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
