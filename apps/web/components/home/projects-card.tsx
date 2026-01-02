'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Clock, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ProjectPreviewCard } from '@/components/home/project-preview-card'
import { ProjectCarousel } from '@/components/home/project-carousel'
import { EmptyState } from '@/components/home/empty-state'
import type { UserGeneration } from '@/types'

interface ProjectsCardProps {
  recentProjects: UserGeneration[]
  myProjects: UserGeneration[]
  isAuthenticated: boolean
}

type TabType = 'recent' | 'myProjects'

const tabs = [
  { id: 'recent' as const, label: 'Recent', icon: Clock },
  { id: 'myProjects' as const, label: 'My Projects', icon: FolderOpen },
] satisfies ReadonlyArray<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }>

export function ProjectsCard({ recentProjects, myProjects, isAuthenticated }: ProjectsCardProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>('recent')

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-zinc-900 rounded-2xl p-8 md:p-10">
          <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-sm pb-6 pt-2 mb-8 -mx-8 px-8 border-b border-zinc-800/50 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-600 mb-2">Workspace</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Projects</h2>
            </div>

            <div className="flex gap-1 p-1.5 bg-zinc-950/80 rounded-2xl">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[300px]"
            >
              {activeTab === 'recent' && (
                recentProjects.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {recentProjects.slice(0, 8).map((project) => (
                      <ProjectPreviewCard
                        key={project.id}
                        project={project}
                        variant="grid"
                        showTimestamp
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState type="recent" isAuthenticated={isAuthenticated} />
                )
              )}

              {activeTab === 'myProjects' && (
                myProjects.length > 0 ? (
                  <ProjectCarousel>
                    {myProjects.map((project) => (
                      <ProjectPreviewCard
                        key={project.id}
                        project={project}
                        variant="carousel"
                        showTimestamp
                      />
                    ))}
                  </ProjectCarousel>
                ) : (
                  <EmptyState type="myProjects" isAuthenticated={isAuthenticated} />
                )
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-8">
            <div className="flex items-center gap-6 text-sm text-zinc-600">
              <span>{recentProjects.length} recent</span>
              <span>{myProjects.length} saved</span>
            </div>
            <Link href="/projects">
              <Button variant="ghost" className="gap-2 text-zinc-400 hover:text-white rounded-xl">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
