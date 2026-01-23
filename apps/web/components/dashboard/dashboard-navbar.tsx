"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { PenTool, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavLink {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

const navLinks: NavLink[] = [
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

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "U"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-md border-b border-zinc-800/50">
      <nav className="mx-auto max-w-6xl flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/home" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Athrean"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <span className="text-sm font-medium tracking-[0.2em] text-white/90">
            ATHREAN
          </span>
        </Link>

        {/* Right: Nav links + Avatar */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {link.label}
              </Link>
            )
          })}

          {/* User Avatar */}
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
      </nav>
    </header>
  )
}
