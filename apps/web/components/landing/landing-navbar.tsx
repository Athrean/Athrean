"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight, Home } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { LoginModal } from "@/components/auth"
import type { User } from "@supabase/supabase-js"

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Docs", href: "/docs" },
]

export function LandingNavbar(): React.ReactElement {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleNavClick = (href: string): void => {
    if (href.startsWith("#")) {
      setMobileMenuOpen(false)
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openLoginModal = (): void => {
    setMobileMenuOpen(false)
    setLoginModalOpen(true)
  }

  const userInitial = user?.email?.charAt(0).toUpperCase() ?? "U"
  const userAvatarUrl = user?.user_metadata?.avatar_url

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <nav className="mx-auto max-w-5xl rounded-full border border-white/10 bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center justify-between h-14 px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Athrean"
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <span className="font-semibold text-lg text-white">Athrean</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth buttons / User menu */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
              ) : user ? (
                <>
                  <Link
                    href="/home"
                    className="flex items-center gap-2 text-sm px-4 py-2 font-medium text-zinc-300 hover:text-white transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                  <Link href="/home">
                    {userAvatarUrl ? (
                      <img
                        src={userAvatarUrl}
                        alt="User avatar"
                        className="w-8 h-8 rounded-full object-cover border border-zinc-700 hover:border-zinc-500 transition-colors"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 hover:border-zinc-500 flex items-center justify-center text-sm font-medium text-white transition-colors">
                        {userInitial}
                      </div>
                    )}
                  </Link>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="text-sm px-4 py-2 font-medium text-zinc-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="rounded-full text-sm px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mx-auto mt-2 max-w-sm rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 p-4"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="px-4 py-3 rounded-xl text-zinc-300 hover:bg-zinc-800/80 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 border-t border-zinc-800" />
                {user ? (
                  <Link
                    href="/home"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={openLoginModal}
                      className="px-4 py-3 rounded-xl text-zinc-200 hover:bg-zinc-800/80 transition-colors text-left"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={openLoginModal}
                      className="px-4 py-3 rounded-xl bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  )
}
