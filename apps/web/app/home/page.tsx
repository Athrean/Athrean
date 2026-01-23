import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { getPublicGenerations, getUserGenerations } from "@/lib/db/queries"
import { UserProjects } from "@/components/dashboard"
import { Skeleton } from "@/components/ui/skeleton"

async function ProjectsWrapper(): Promise<React.ReactElement> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const recentProjects = await getPublicGenerations(8)
  const myProjects = user ? await getUserGenerations(user.id) : []

  return <UserProjects recentProjects={recentProjects} myProjects={myProjects} />
}

function ProjectsSkeleton(): React.ReactElement {
  return (
    <section className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-20 w-full rounded-2xl mb-8" />
        <div className="mb-12">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-4/3 rounded-xl" />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-48 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-4/3 rounded-xl mb-3" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage(): React.ReactElement {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsWrapper />
    </Suspense>
  )
}
