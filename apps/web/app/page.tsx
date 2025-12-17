import { Suspense } from 'react'
import Link from 'next/link'
import { getFeaturedProjects, getUserComponents } from '@/lib/db/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { HeroSection } from '@/components/hero/hero-section'
import { Navbar } from '@/components/navbar'
import { ProjectsCard } from '@/components/home/projects-card'

async function ProjectsCardWrapper(): Promise<React.ReactElement> {
  const client = await import('@/lib/supabase/server').then(m => m.createClient())
  const { data: { user } } = await client.auth.getUser()

  // Get recent public projects (community)
  const recentProjects = await getFeaturedProjects(8)

  // Get user's own projects if authenticated
  const myProjects = user ? await getUserComponents(user.id) : []

  return (
    <ProjectsCard
      recentProjects={recentProjects}
      myProjects={myProjects}
      isAuthenticated={!!user}
    />
  )
}

function ProjectsCardSkeleton(): React.ReactElement {
  return (
    <section className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl border border-zinc-800/60 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-10 w-64 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-800/60">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function HomePage(): Promise<React.ReactElement> {
  const client = await import('@/lib/supabase/server').then(m => m.createClient())
  const { data: { session } } = await client.auth.getSession()

  return (
    <div className="min-h-screen">
      {!session && <Navbar />}
      <HeroSection />

      {/* Projects Card with Tabs - Only show for authenticated users */}
      {session && (
        <Suspense fallback={<ProjectsCardSkeleton />}>
          <ProjectsCardWrapper />
        </Suspense>
      )}

      {/* Footer - Only show for unauthenticated users (authenticated users have socials in sidebar) */}
      {!session && (
        <footer className="px-4 pb-8 pt-8">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <img
              src="/vector-logo.png"
              alt="Athrean"
              className="w-12 h-12 object-contain opacity-50 hover:opacity-100 transition-opacity"
            />

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <Link
                href="https://x.com/athreanai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="https://github.com/Athrean"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
