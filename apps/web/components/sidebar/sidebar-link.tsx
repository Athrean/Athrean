import Link from "next/link"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/lib/config/navigation"

interface SidebarLinkProps {
    item: NavItem
    active: boolean
    collapsed: boolean
}

export function SidebarLink({ item, active, collapsed }: SidebarLinkProps): React.ReactElement {
    return (
        <Link
            href={item.href}
            className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                    ? "bg-zinc-800/80 text-white shadow-[0_10px_30px_-20px_rgba(0,0,0,0.9)]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/70",
                collapsed && "justify-center px-2"
            )}
        >
            <item.icon className="w-4 h-4" />
            {!collapsed && <span className="flex-1">{item.name}</span>}
            {!collapsed && item.badge && (
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
                    {item.badge}
                </span>
            )}
        </Link>
    )
}
