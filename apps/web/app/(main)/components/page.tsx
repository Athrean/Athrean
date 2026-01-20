import { Suspense } from 'react'
import { getRegistryItems, getCategories } from '@/lib/db/queries'
import { FeaturedSection } from '@/components/projects/featured-section'
import { Skeleton } from '@/components/ui/skeleton'
import { Search } from 'lucide-react'

interface PageProps {
    searchParams: Promise<{ category?: string; search?: string }>
}

async function ComponentsContent({ searchParams }: { searchParams: { category?: string; search?: string } }): Promise<React.ReactElement> {
    const [items, categories] = await Promise.all([
        getRegistryItems({ categoryId: searchParams.category, search: searchParams.search, limit: 100 }),
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

export default async function ComponentsPage({ searchParams }: PageProps): Promise<React.ReactElement> {
    const params = await searchParams

    return (
        <div className="h-full flex flex-col">
            <div className="bg-zinc-950 flex flex-col h-full overflow-hidden">
                {/* Header - Fixed */}
                <div className="px-6 sm:px-8 lg:px-10 pt-10 pb-6 shrink-0">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-white mb-2">Components</h1>
                        <p className="text-zinc-400">
                            Browse our collection of beautiful, animated React components.
                        </p>
                    </div>

                    {/* Search */}
                    <form className="max-w-md relative flex items-center">
                        <div className="relative w-full shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] rounded-full">
                            <input
                                type="search"
                                name="search"
                                defaultValue={params.search}
                                placeholder="Search components..."
                                className="w-full pl-6 pr-14 py-3.5 bg-zinc-900 text-zinc-100 rounded-full border-none focus:outline-none focus:ring-1 focus:ring-zinc-700 placeholder:text-zinc-500 text-sm"
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 top-1.5 p-2 bg-zinc-100 rounded-full text-zinc-900 hover:bg-white transition-colors hover:scale-105 active:scale-95"
                            >
                                <Search className="w-4 h-4" strokeWidth={2.5} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-8 lg:px-10 pb-10">
                    <Suspense fallback={<ComponentsSkeleton />}>
                        <ComponentsContent searchParams={params} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
