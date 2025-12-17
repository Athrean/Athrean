import { Home, Search, LayoutGrid, Star, LayoutTemplate, BookOpen } from "lucide-react"

export interface NavItem {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
    matchFn?: (pathname: string, searchParams: URLSearchParams) => boolean
}

export const mainNav: NavItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
]

export const projectNav: NavItem[] = [
    {
        name: "All projects",
        href: "/projects",
        icon: LayoutGrid,
        matchFn: (pathname, searchParams) => pathname === "/projects" && !searchParams.get("tab")
    },
    {
        name: "Featured",
        href: "/projects?tab=featured",
        icon: Star,
        matchFn: (pathname, searchParams) => pathname === "/projects" && searchParams.get("tab") === "featured"
    },
    {
        name: "Components",
        href: "/components",
        icon: Star,
        matchFn: (pathname, searchParams) => pathname === "/components" || (pathname === "/projects" && searchParams.get("tab") === "components")
    },
]

export const resourceNav: NavItem[] = [
    { name: "Templates", href: "/templates", icon: LayoutTemplate, badge: "Soon" },
    { name: "Learn", href: "/learn", icon: BookOpen },
]
