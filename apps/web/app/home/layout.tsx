import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNavbar } from "@/components/dashboard"

interface HomeLayoutProps {
  children: React.ReactNode
}

export default async function HomeLayout({
  children,
}: HomeLayoutProps): Promise<React.ReactElement> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar
        userEmail={user.email}
        userAvatarUrl={user.user_metadata?.avatar_url}
      />
      <main className="pt-24">{children}</main>
    </div>
  )
}
