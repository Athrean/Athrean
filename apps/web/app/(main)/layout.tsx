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
    <div className="text-zinc-100 min-h-screen overflow-x-hidden">
      <BackgroundGradient />
      <div className="flex min-h-screen relative p-4 gap-4 w-full min-w-0 overflow-x-hidden">
        <Sidebar userEmail={user?.email} />
        <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
