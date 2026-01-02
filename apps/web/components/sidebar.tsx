"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signout } from "@/app/auth/actions"
import { mainNav, projectNav, resourceNav, type NavItem } from "@/lib/config/navigation"
import { SidebarLink } from "@/components/sidebar/sidebar-link"
import { NavGroup } from "@/components/sidebar/nav-group"

interface SidebarProps {
  userEmail?: string
  userAvatarUrl?: string
}

export function Sidebar({ userEmail, userAvatarUrl }: SidebarProps): React.ReactElement | null {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [collapsed, setCollapsed] = useState(false)

  const firstName = useMemo((): string => {
    if (!userEmail) return "User"
    const namePart = userEmail.split("@")[0] ?? "User"
    return namePart.charAt(0).toUpperCase() + namePart.slice(1)
  }, [userEmail])

  const workspaceInitial = useMemo(
    (): string => firstName?.[0]?.toUpperCase() || "A",
    [firstName],
  )

  if (pathname.startsWith("/generate")) return null
  if (!userEmail) return null

  const handleToggle = (): void => setCollapsed((prev) => !prev)

  const isItemActive = (item: NavItem): boolean => {
    if (item.matchFn) return item.matchFn(pathname, searchParams)
    return pathname === item.href
  }

  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden border-r border-zinc-800 bg-zinc-900 transition-[width] duration-300 shrink-0",
        collapsed ? "w-[80px]" : "w-[280px]",
      )}
    >
      <div className="relative px-3 pt-3 pb-2">
        <button
          onClick={handleToggle}
          className={cn(
            "group flex w-full items-center gap-3 rounded-2xl px-2 py-2 transition-colors",
            collapsed ? "justify-center hover:bg-zinc-900/60" : "hover:bg-zinc-900/60"
          )}
        >
          <div className="relative">
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt={firstName}
                className="h-10 w-10 rounded-full object-cover border-2 border-zinc-700"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-purple-900/30">
                {workspaceInitial}
              </div>
            )}
            {collapsed && (
              <span className="pointer-events-none absolute -right-3 -bottom-3 rounded-full bg-zinc-900/80 p-1 text-zinc-300 shadow">
                <PanelLeftOpen className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 leading-tight text-left">
              <p className="text-sm font-semibold text-white">{firstName}&apos;s Workspace</p>
              <p className="text-xs text-zinc-500">Athrean</p>
            </div>
          )}
          {!collapsed && <PanelLeftClose className="h-4 w-4 text-zinc-400 group-hover:text-white" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <NavGroup title="Main" hidden={collapsed}>
          {mainNav.map((item) => (
            <SidebarLink key={item.name} item={item} active={isItemActive(item)} collapsed={collapsed} />
          ))}
        </NavGroup>

        <NavGroup title="Projects" hidden={collapsed}>
          {projectNav.map((item) => (
            <SidebarLink key={item.name} item={item} active={isItemActive(item)} collapsed={collapsed} />
          ))}
        </NavGroup>

        <NavGroup title="Resources" hidden={collapsed}>
          {resourceNav.map((item) => (
            <SidebarLink key={item.name} item={item} active={isItemActive(item)} collapsed={collapsed} />
          ))}
        </NavGroup>
      </div>

      <div className={cn("px-3 py-3", collapsed ? "flex justify-center" : "")}>
        <div className={cn("flex items-center", collapsed ? "flex-col gap-2" : "gap-3")}>
          <Link href="https://x.com/athreanai" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </Link>
          <Link href="https://github.com/Athrean" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
          </Link>
          {!collapsed && <img src="/vector-logo.png" alt="Athrean" className="w-7 h-7 object-contain opacity-40 hover:opacity-100 transition-opacity ml-auto" />}
        </div>
      </div>

      <div className="px-3 py-3">
        <form action={signout}>
          <Button variant="ghost" className={cn("w-full justify-start gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition", collapsed && "justify-center")}>
            <LogOut className="w-4 h-4" />
            {!collapsed && "Sign Out"}
          </Button>
        </form>
      </div>
    </aside >
  )
}
