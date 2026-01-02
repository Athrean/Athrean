"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-data";

interface FeaturedCardProps {
  item: NavItem;
  onClose: () => void;
}

function FeaturedCard({ item, onClose }: FeaturedCardProps): React.ReactElement {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className="group flex flex-col rounded-2xl bg-zinc-800/80 border border-zinc-700/50 p-4 hover:bg-zinc-700/80 hover:border-zinc-600 transition-all"
    >
      <div className="w-14 h-14 rounded-xl bg-zinc-700/80 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
      <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
    </Link>
  );
}

interface SimpleItemProps {
  item: NavItem;
  onClose: () => void;
}

function SimpleItem({ item, onClose }: SimpleItemProps): React.ReactElement {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800/80 transition-colors"
    >
      <Icon className="w-5 h-5 text-zinc-400" />
      <div>
        <p className="text-sm font-medium text-zinc-200">{item.title}</p>
        <p className="text-xs text-zinc-500">{item.description}</p>
      </div>
    </Link>
  );
}

export interface NavDropdownProps {
  label: string;
  items: NavItem[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  scrolled: boolean;
}

export function NavDropdown({
  label,
  items,
  isOpen,
  onOpen,
  onClose,
  scrolled,
}: NavDropdownProps): React.ReactElement {
  const featuredItems = items.filter((item) => item.featured);
  const otherItems = items.filter((item) => !item.featured);

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
          isOpen
            ? scrolled
              ? "bg-zinc-100 text-zinc-900"
              : "bg-white/10 text-white"
            : scrolled
              ? "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
              : "text-zinc-300 hover:text-white hover:bg-white/10"
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5" />
            
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-[520px] p-3 bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 border border-zinc-700/50"
            >
              <div className="grid grid-cols-3 gap-2">
                {featuredItems.map((item) => (
                  <FeaturedCard key={item.title} item={item} onClose={onClose} />
                ))}
              </div>

              {otherItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-700/50">
                  <div className="grid grid-cols-2 gap-1">
                    {otherItems.map((item) => (
                      <SimpleItem key={item.title} item={item} onClose={onClose} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
