import { Suspense } from 'react'
import { getRegistryItems, getCategories, getPublicGenerations, getUserFavorites } from '@/lib/db/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { FeaturedSection } from '@/components/projects/featured-section'
import { AllProjectsSection } from '@/components/projects/all-projects-section'
import { ProjectsTabs } from '@/components/projects/projects-tabs'
import { createClient } from '@/lib/supabase/server'

interface ProjectsPageProps {
  searchParams: Promise<{ tab?: string }>
}

async function ComponentsContent(): Promise<React.ReactElement> {
  const [items, categories] = await Promise.all([
    getRegistryItems({ limit: 50 }),
    getCategories(),
  ])

  // Group items by category
  const itemsByCategory: Record<string, typeof items> = {}
  for (const item of items) {
    const cat = item.categoryId || 'Uncategorized'
    if (!itemsByCategory[cat]) {
      itemsByCategory[cat] = []
    }
    itemsByCategory[cat].push(item)
  }

  return <FeaturedSection itemsByCategory={itemsByCategory} categories={categories.map(c => c.id)} />
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

  const favoriteItems = await getUserFavorites(user.id)

  if (favoriteItems.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-zinc-400">You haven't starred any components yet.</p>
      </div>
    )
  }

  // Convert RegistryItem[] to UserGeneration[] format for AllProjectsSection
  // Note: This is a workaround - in a full implementation you might want a separate component
  const projectsLike = favoriteItems.map(item => ({
    id: item.id,
    userId: user.id,
    name: item.title,
    prompt: item.description || '',
    code: item.files[0]?.content || '',
    model: null,
    durationMs: null,
    isPublic: true,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }))

  return <AllProjectsSection projects={projectsLike} />
}

async function AllProjectsContent(): Promise<React.ReactElement> {
  const projects = await getPublicGenerations(50)
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
        <Skeleton key={i} className="aspect-4/3 rounded-2xl" />
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
    <div className="h-full flex flex-col">
      <div className="bg-zinc-950 flex flex-col h-full overflow-hidden">
        {/* Header - Fixed */}
        <div className="px-6 sm:px-8 pt-10 pb-6 shrink-0 space-y-6">
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
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-10">
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
    </div>
  )
}
