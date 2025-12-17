"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NavItem } from "./nav-data";

interface MobileMenuProps {
  featuresItems: NavItem[];
  onClose: () => void;
}

export function MobileMenu({
  featuresItems,
  onClose,
}: MobileMenuProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="md:hidden mt-2 mx-auto max-w-4xl bg-[#323333] backdrop-blur-xl rounded-2xl border border-zinc-700/50 shadow-xl overflow-hidden"
    >
      <div className="p-4">
        <div className="space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Features
          </p>
          {featuresItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-200 hover:bg-zinc-700/50 transition-colors"
            >
              <item.icon className="w-5 h-5 text-zinc-400" />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-700/50">
          <Link
            href="/pricing"
            onClick={onClose}
            className="block px-3 py-2.5 rounded-xl text-zinc-200 hover:bg-zinc-700/50 font-medium transition-colors"
          >
            Pricing
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-700/50 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 rounded-full">
            Sign In
          </Button>
          <Button size="sm" className="flex-1 rounded-full gap-1">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
