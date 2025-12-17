import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { getComponentBySlug } from '@/lib/db/queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code-block'
import { ComponentPreview } from './component-preview'
import { CopyButton } from './copy-button'
import { Navbar } from '@/components/navbar'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ComponentDetailPage({ params }: PageProps): Promise<React.ReactElement> {
  const { slug } = await params
  const component = await getComponentBySlug(slug)

  if (!component) {
    notFound()
  }

  return (
    <div className="min-h-[calc(100vh-32px)]">
      <Navbar />
      <div className="bg-[#323333] rounded-2xl px-6 sm:px-8 lg:px-10 py-10 mt-4">
        {/* Back link */}
        <Link
          href="/components"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Components
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-white">{component.name}</h1>
            <Badge variant="secondary" className="capitalize">
              {component.category}
            </Badge>
            {component.isPro && <Badge variant="warning">PRO</Badge>}
          </div>

          {component.description && (
            <p className="text-zinc-400 text-lg mb-4">{component.description}</p>
          )}

          {/* Tags */}
          {component.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {component.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Preview</h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 min-h-[400px] flex items-center justify-center p-8">
              <ComponentPreview code={component.code} dependencies={component.dependencies} />
            </div>
          </div>

          {/* Code */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Code</h2>
              <div className="flex items-center gap-2">
                <CopyButton code={component.code} slug={component.slug} />
                <Link href={`/generate?base=${component.id}`}>
                  <Button variant="outline" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Customize
                  </Button>
                </Link>
              </div>
            </div>
            <CodeBlock code={component.code} showLineNumbers />
          </div>
        </div>
      </div>
    </div>
  )
}

