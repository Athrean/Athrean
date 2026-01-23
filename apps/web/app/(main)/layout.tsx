import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/sidebar'
import { BackgroundGradient } from '@/components/background-gradient'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.ReactElement> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="text-white h-screen overflow-hidden bg-black selection:bg-zinc-200 selection:text-zinc-900">
      <BackgroundGradient />
      <div className="flex h-full relative w-full min-w-0 z-10">
        <Sidebar userEmail={user?.email} />
        <main className="flex-1 h-full min-w-0 overflow-y-auto overflow-x-hidden relative scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  )
}
