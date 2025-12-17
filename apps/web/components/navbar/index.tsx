"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { featuresItems } from "./nav-data";
import { NavDropdown } from "./nav-dropdown";
import { MobileMenu } from "./mobile-menu";

export function Navbar(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    function handleScroll(): void {
      setScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3">
      <nav
        className={cn(
          "mx-auto rounded-full border transition-all duration-500 ease-out",
          scrolled
            ? "max-w-2xl bg-white/80 backdrop-blur-xl border-zinc-200/50 shadow-lg shadow-black/5"
            : "max-w-4xl bg-white/5 backdrop-blur-md border-white/10"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-500 ease-out",
            scrolled ? "h-12 px-4" : "h-14 px-5"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Athrean"
              width={32}
              height={32}
              className={cn(
                "transition-all duration-500",
                scrolled ? "w-7 h-7" : "w-8 h-8"
              )}
            />
            <span
              className={cn(
                "font-bold transition-all duration-500",
                scrolled ? "text-base text-zinc-900" : "text-lg text-white"
              )}
            >
              Athrean
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            <NavDropdown
              label="Features"
              items={featuresItems}
              isOpen={openDropdown === "features"}
              onOpen={() => setOpenDropdown("features")}
              onClose={() => setOpenDropdown(null)}
              scrolled={scrolled}
            />
            <Link
              href="/pricing"
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                scrolled
                  ? "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              )}
            >
              Pricing
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className={cn(
                "font-medium transition-all duration-500",
                scrolled
                  ? "text-sm px-2 text-zinc-600 hover:text-zinc-900"
                  : "text-sm px-3 text-zinc-300 hover:text-white"
              )}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className={cn(
                "rounded-full font-medium flex items-center gap-1 transition-all duration-500",
                scrolled
                  ? "text-xs px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white"
                  : "text-sm px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900"
              )}
            >
              Get Started
              <ArrowRight
                className={cn(
                  "transition-all duration-500",
                  scrolled ? "w-3 h-3" : "w-3.5 h-3.5"
                )}
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              scrolled
                ? "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                : "text-zinc-300 hover:text-white hover:bg-white/10"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            featuresItems={featuresItems}
            onClose={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
