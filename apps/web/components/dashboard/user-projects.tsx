"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Clock, FolderOpen, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserGeneration } from "@/types"

interface UserProjectsProps {
  recentProjects: UserGeneration[]
  myProjects: UserGeneration[]
}

type TabType = "recent" | "myProjects"

interface Tab {
  id: TabType
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const tabs: Tab[] = [
  { id: "recent", label: "Recent", icon: Clock },
  { id: "myProjects", label: "My Projects", icon: FolderOpen },
]

function formatTimeAgo(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  return then.toLocaleDateString()
}

interface ProjectCardProps {
  project: UserGeneration
}

function ProjectCard({ project }: ProjectCardProps): React.ReactElement {
  return (
    <Link
      href={`/generate?id=${project.id}`}
      className="group block"
    >
      <div className="aspect-[4/3] rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden mb-3 group-hover:border-zinc-700 transition-colors">
        <div className="w-full h-full flex items-center justify-center bg-zinc-900">
          <FolderOpen className="w-8 h-8 text-zinc-700" />
        </div>
      </div>
      <h3 className="text-sm font-medium text-white truncate group-hover:text-teal-400 transition-colors">
        {project.name || "Untitled Project"}
      </h3>
      <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        {formatTimeAgo(project.createdAt)}
      </p>
    </Link>
  )
}

function EmptyState({ type }: { type: TabType }): React.ReactElement {
  const isRecent = type === "recent"

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
        <FolderOpen className="w-8 h-8 text-zinc-600" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">
        {isRecent ? "No recent projects" : "No saved projects"}
      </h3>
      <p className="text-sm text-zinc-500 max-w-xs mb-6">
        {isRecent
          ? "Projects created from prompts will appear here."
          : "Your saved projects will appear here."}
      </p>
      <Link
        href="/generate"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors"
      >
        Start generating
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

export function UserProjects({
  recentProjects,
  myProjects,
}: UserProjectsProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>("recent")

  const currentProjects = activeTab === "recent" ? recentProjects : myProjects

  return (
    <section className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/projects"
              className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
            >
              User projects
              <ChevronRight className="w-4 h-4" />
            </Link>
            <span className="text-zinc-700">|</span>
            <Link
              href="/projects"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              view all
            </Link>
          </div>
        </div>

        {/* Empty prompt banner */}
        <Link
          href="/generate"
          className="block mb-8 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all group"
        >
          <div className="flex items-center justify-between">
            <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
              No projects found. Start by generating one.
            </p>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
          </div>
        </Link>

        {/* Featured Templates Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Featured Templates</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Placeholder template cards */}
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/3] rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-zinc-600 text-sm">Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Recent Builds Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Most Recent Builds</h2>
            <div className="flex gap-1 p-1 bg-zinc-900 rounded-full border border-zinc-800">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                      isActive
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-500 hover:text-zinc-300"
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
            >
              {currentProjects.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {currentProjects.slice(0, 8).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <EmptyState type={activeTab} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
