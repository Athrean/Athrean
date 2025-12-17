import { Suspense } from 'react'
import { getComponents, getCategories, getPublicProjects, getUserSavedComponents } from '@/lib/db/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { FeaturedSection } from '@/components/projects/featured-section'
import { AllProjectsSection } from '@/components/projects/all-projects-section'
import { ProjectsTabs } from '@/components/projects/projects-tabs'
import { createClient } from '@/lib/supabase/server'

interface ProjectsPageProps {
  searchParams: Promise<{ tab?: string }>
}

async function ComponentsContent(): Promise<React.ReactElement> {
  const [components, categories] = await Promise.all([
    getComponents({ limit: 50 }),
    getCategories(),
  ])

  // Group components by category
  const componentsByCategory: Record<string, typeof components> = {}
  for (const component of components) {
    const cat = component.category || 'Uncategorized'
    if (!componentsByCategory[cat]) {
      componentsByCategory[cat] = []
    }
    componentsByCategory[cat].push(component)
  }

  // Reuse FeaturedSection for components grid display as it handles categorization well
  return <FeaturedSection componentsByCategory={componentsByCategory} categories={categories} />
}

async function FavoritesContent(): Promise<React.ReactElement> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-zinc-400">Please sign in to view your featured items.</p>
      </div>
    )
  }

  const projects = await getUserSavedComponents(user.id)

  if (projects.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-zinc-400">You haven't starred any components yet.</p>
      </div>
    )
  }

  return <AllProjectsSection projects={projects} />
}

async function AllProjectsContent(): Promise<React.ReactElement> {
  const projects = await getPublicProjects({ limit: 50 })
  return <AllProjectsSection projects={projects} />
}

function ComponentsSkeleton(): React.ReactElement {
  return (
    <div className="space-y-12 pt-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="w-72 h-80 rounded-3xl shrink-0" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function GridSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
      ))}
    </div>
  )
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps): Promise<React.ReactElement> {
  const params = await searchParams
  // Default to 'all' if not specified
  const activeTabRaw = params.tab || 'all'
  // Validate tab value
  const activeTab = (['all', 'featured', 'components'].includes(activeTabRaw) ? activeTabRaw : 'all') as 'all' | 'featured' | 'components'

  let title = 'All Projects'
  let description = 'Browse all projects created by the community.'
  let subtitle = 'Community'

  if (activeTab === 'components') {
    title = 'Components'
    description = 'Explore highlighted components and concepts, organized by category.'
    subtitle = 'Library'
  } else if (activeTab === 'featured') {
    title = 'Featured'
    description = 'Your starred and favorite components.'
    subtitle = 'Favorites'
  }

  return (
    <div className="min-h-[calc(100vh-32px)]">
      <div className="bg-[#323333] rounded-2xl px-6 sm:px-8 py-10 space-y-6 h-full">
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500 mb-2">
            {subtitle}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            {title}
          </h1>
          <p className="text-zinc-400 mt-2 max-w-2xl">
            {description}
          </p>
        </div>

        {/* Tabs */}
        <ProjectsTabs activeTab={activeTab} />

        {/* Content */}
        {activeTab === 'components' && (
          <Suspense fallback={<ComponentsSkeleton />}>
            <ComponentsContent />
          </Suspense>
        )}

        {activeTab === 'featured' && (
          <Suspense fallback={<GridSkeleton />}>
            <FavoritesContent />
          </Suspense>
        )}

        {activeTab === 'all' && (
          <Suspense fallback={<GridSkeleton />}>
            <AllProjectsContent />
          </Suspense>
        )}
      </div>
    </div>
  )
}
