import type { Metadata } from 'next'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/sidebar'
import { BackgroundGradient } from '@/components/background-gradient'

export const metadata: Metadata = {
  title: 'Athrean - Beautiful React Components',
  description: 'Browse curated animated components or let AI design custom ones for you.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.ReactElement> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en" className="dark">
      <body className="text-zinc-100 antialiased min-h-screen overflow-x-hidden">
        <BackgroundGradient />
        <div className="flex min-h-screen relative p-4 gap-4 w-full min-w-0 overflow-x-hidden">
          <Sidebar userEmail={session?.user?.email} />
          <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
        </div>
      </body>
    </html>
  )
}
