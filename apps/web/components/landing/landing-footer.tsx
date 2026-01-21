"use client"

import Link from "next/link"
import Image from "next/image"

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const footerSections: FooterSection[] = [
  {
    title: "Platform",
    links: [
      { label: "AI App Builder", href: "/builder" },
      { label: "Component Library", href: "/components" },
      { label: "Templates", href: "/templates" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Athrean", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Twitter / X", href: "https://x.com/athreanai" },
      { label: "GitHub", href: "https://github.com/athrean" },
      { label: "Discord", href: "https://discord.gg/athrean" },
    ],
  },
]

// Logo width + gap for text column offset
const LOGO_WIDTH = 128
const GAP = 32
const TEXT_OFFSET = LOGO_WIDTH + GAP

export function LandingFooter(): React.ReactElement {
  return (
    <footer className="bg-black pt-24 pb-16 px-6 md:px-12 lg:px-20">
      {/* Main Content Row */}
      <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24">

        {/* Left Side: Branding */}
        <div className="flex flex-col">
          {/* Logo and Title - Baseline Aligned */}
          <div className="flex items-end gap-8">
            <Image
              src="/vector-logo.png"
              alt="Athrean"
              width={120}
              height={120}
              className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain flex-shrink-0"
            />
            <span className="text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-none">
              Athrean
            </span>
          </div>
        </div>

        {/* Right Side: Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-16">
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-white">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Copyright - Centered like Winterfell */}
      <div className="mt-20 pt-8 text-center">
        <p className="text-sm text-zinc-600">
          &copy; {new Date().getFullYear()} Athrean. Powered by AI + Creativity.
        </p>
      </div>
    </footer>
  )
}
