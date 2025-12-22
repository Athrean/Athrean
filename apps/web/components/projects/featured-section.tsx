'use client'

import Link from 'next/link'
import { Carousel, SimpleCard } from '@/components/ui/apple-cards-carousel'
import type { RegistryItem } from '@/types'

interface FeaturedSectionProps {
  itemsByCategory: Record<string, RegistryItem[]>
  categories: string[]
}

const defaultImages = [
  'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=600&q=80',
  'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=600&q=80',
  'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=600&q=80',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&q=80',
  'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=600&q=80',
]

const categoryImageMap: Record<string, string[]> = {
  ai: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    'https://images.unsplash.com/photo-1676299081847-824916de030a?w=600&q=80',
    'https://images.unsplash.com/photo-1684369175833-4b445ad6bfb5?w=600&q=80',
  ],
  buttons: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&q=80',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80',
  ],
  cards: [
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&q=80',
    'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&q=80',
    'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=600&q=80',
  ],
  navigation: [
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&q=80',
    'https://images.unsplash.com/photo-1604076913837-52ab5f2c1e51?w=600&q=80',
    'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=600&q=80',
  ],
  forms: [
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
    'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=600&q=80',
    'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=600&q=80',
  ],
}

// Generate placeholder images based on category
function getCategoryImage(category: string, index: number): string {
  const images = categoryImageMap[category.toLowerCase()] ?? defaultImages
  return images[index % images.length] ?? '/placeholder.svg'
}

function formatCategoryName(category: string): string {
  return category
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function FeaturedSection({ itemsByCategory, categories }: FeaturedSectionProps): React.ReactElement {
  const sortedCategories = Object.keys(itemsByCategory).sort()

  if (sortedCategories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-zinc-300 mb-1">No components yet</h3>
        <p className="text-zinc-500 text-sm">
          Components will appear here once they are added.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-12 pt-2">
      {sortedCategories.map((category) => {
        const items = itemsByCategory[category]
        if (!items || items.length === 0) return null

        const cards = items.map((item, index) => (
          <Link key={item.id} href={`/components/${item.name}`}>
            <SimpleCard
              card={{
                src: getCategoryImage(category, index),
                title: item.title,
                category: formatCategoryName(category),
              }}
            />
          </Link>
        ))

        return (
          <section key={category} className="relative">
            <div className="flex items-center justify-between mb-4 pr-24">
              <h2 className="text-xl md:text-2xl font-semibold text-white capitalize">
                {formatCategoryName(category)}
              </h2>
              <span className="text-sm text-zinc-500">
                {items.length} {items.length === 1 ? 'component' : 'components'}
              </span>
            </div>
            <Carousel items={cards} />
          </section>
        )
      })}
    </div>
  )
}
