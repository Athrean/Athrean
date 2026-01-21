"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, PenTool, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavLink {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Playground", href: "/generate", icon: PenTool },
  { label: "Docs", href: "/docs", icon: FileText },
]

interface DashboardNavbarProps {
  userEmail?: string
  userAvatarUrl?: string
}

export function DashboardNavbar({
  userEmail,
  userAvatarUrl,
}: DashboardNavbarProps): React.ReactElement {
  const pathname = usePathname()

  const userInitial = userEmail
    ? userEmail.charAt(0).toUpperCase()
    : "U"

  const displayName = userEmail
    ? `${userEmail.split("@")[0]?.charAt(0).toUpperCase()}${userEmail.split("@")[0]?.slice(1)}'s Winterfell`
    : "Dashboard"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between h-14 px-4 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
          {/* Left: Logo */}
          <Link href="/home" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Athrean"
              width={28}
              height={28}
              className="w-7 h-7"
            />
          </Link>

          {/* Center: Nav links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href ||
                (link.href === "/home" && pathname === "/")

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right: Workspace name + Avatar */}
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-sm text-zinc-400">
              {displayName}
            </span>
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover border border-zinc-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-medium text-white">
                {userInitial}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
