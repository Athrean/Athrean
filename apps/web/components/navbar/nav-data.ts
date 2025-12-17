import {
  Wand2,
  Layers,
  Palette,
  Zap,
  Star,
  BookOpen,
  FileText,
  Users,
  Award,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  featured?: boolean;
}

export const featuresItems: NavItem[] = [
  {
    icon: Wand2,
    title: "AI Design Mode",
    description: "Generate custom components with AI.",
    href: "/generate",
    featured: true,
  },
  {
    icon: Layers,
    title: "Component Library",
    description: "Browse curated components.",
    href: "/components",
    featured: true,
  },
  {
    icon: Palette,
    title: "Theme Studio",
    description: "Customize themes and styles.",
    href: "/themes",
    featured: true,
  },
  {
    icon: Zap,
    title: "Quick Start",
    description: "Get started in seconds.",
    href: "/docs/quickstart",
  },
  {
    icon: Star,
    title: "What's New",
    description: "Latest features and updates.",
    href: "/changelog",
  },
];

export const exploreItems: NavItem[] = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Guides and API reference.",
    href: "/docs",
    featured: true,
  },
  {
    icon: FileText,
    title: "Blog",
    description: "Tips, tutorials, and insights.",
    href: "/blog",
    featured: true,
  },
  {
    icon: Users,
    title: "About Us",
    description: "The team behind Athrean.",
    href: "/about",
    featured: true,
  },
  {
    icon: Award,
    title: "Showcase",
    description: "Projects built with Athrean.",
    href: "/showcase",
  },
];
