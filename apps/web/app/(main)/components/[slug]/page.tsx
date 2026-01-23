import { notFound } from 'next/navigation'
import { getRegistryItemByName } from '@/lib/db/queries'
import { LegoDetailView } from './lego-detail-view'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ComponentDetailPage({ params }: PageProps): Promise<React.ReactElement> {
  const { slug } = await params
  const item = await getRegistryItemByName(slug)

  if (!item) {
    notFound()
  }

  // Get the code from the first file in the registry item
  const code = item.files[0]?.content || ''

  return (
    <div className="h-full bg-black">
      <LegoDetailView item={item} code={code} />
    </div>
  )
}
