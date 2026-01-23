"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  FolderOpen,
  ChevronRight,
  ChevronLeft,
  Users,
  Heart,
} from "lucide-react"
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

// Featured template data
const featuredTemplates = [
  {
    id: "todo",
    name: "Todo Contract",
    image: "/templates/todo.png",
    users: "1.4k",
    likes: 32,
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: "vault",
    name: "Vault Contract",
    image: "/templates/vault.png",
    users: "1.4k",
    likes: 32,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "staking",
    name: "Staking Contract",
    image: "/templates/staking.png",
    users: "1.4k",
    likes: 32,
    color: "from-red-500 to-pink-500",
  },
  {
    id: "escrow",
    name: "Escrow Contract",
    image: "/templates/escrow.png",
    users: "1.4k",
    likes: 32,
    color: "from-green-500 to-teal-500",
  },
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
    <Link href={`/generate?id=${project.id}`} className="group block">
      <div className="aspect-4/3 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden mb-3 group-hover:border-zinc-600 transition-all">
        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-zinc-900 to-zinc-800">
          <FolderOpen className="w-8 h-8 text-zinc-600" />
        </div>
      </div>
      <h3 className="text-sm font-medium text-white truncate group-hover:text-teal-400 transition-colors">
        {project.name || "Untitled Project"}
      </h3>
      <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        {formatTimeAgo(project.createdAt)}
      </p>
    </Link>
  )
}

interface TemplateCardProps {
  template: (typeof featuredTemplates)[0]
}

function TemplateCard({ template }: TemplateCardProps): React.ReactElement {
  return (
    <Link href={`/generate?template=${template.id}`} className="group block">
      <div className="aspect-4/3 rounded-xl overflow-hidden mb-3 relative">
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br opacity-90",
            template.color
          )}
        />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <FolderOpen className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white group-hover:text-teal-400 transition-colors">
          {template.name}
        </h3>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {template.users}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {template.likes}
          </span>
        </div>
      </div>
    </Link>
  )
}

function EmptyState(): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4">
        <FolderOpen className="w-8 h-8 text-zinc-600" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
      <p className="text-sm text-zinc-500 max-w-xs mb-6">
        Your projects will appear here.
      </p>
      <Link
        href="/generate"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors"
      >
        Create
        <ChevronRight className="w-4 h-4" />
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

  const templatesRef = useRef<HTMLDivElement | null>(null)

  const scrollTemplates = (direction: "left" | "right"): void => {
    const container = templatesRef.current
    if (!container) return

    const scrollAmount = 320
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section className="py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Recent Builds Section - Top */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
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

            <div className="flex items-center gap-3">
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors"
              >
                Create +
              </Link>
              <Link
                href="/projects"
                className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
              >
                view all
                <ChevronRight className="w-4 h-4" />
              </Link>
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
                <EmptyState />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Featured Templates Section - Second */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium text-white">
              Featured Templates
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollTemplates("left")}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                aria-label="Scroll templates left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollTemplates("right")}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                aria-label="Scroll templates right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div
            ref={templatesRef}
            className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
          >
            {featuredTemplates.map((template) => (
              <div
                key={template.id}
                className="min-w-[260px] max-w-[260px] snap-start shrink-0"
              >
                <TemplateCard template={template} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
