import type React from "react"
import { Globe, Layout, Database } from 'lucide-react'

interface CardItem {
    id: number
    name: string
    designation: string
    content: React.ReactElement
}

export const previewCards: CardItem[] = [
    {
        id: 0,
        name: "Publish your project",
        designation: "Instantly publish to lovable.app, buy a domain, or connect your own. Update anytime.",
        content: (
            <div className="w-full h-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col relative group">
                {/* Browser Header */}
                <div className="h-6 bg-zinc-800/50 flex items-center px-2 gap-1.5 shrink-0 border-b border-zinc-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                    <div className="ml-2 h-3 w-32 bg-zinc-800 rounded-md" />
                </div>

                {/* Browser Content */}
                <div className="flex-1 p-3 bg-zinc-950/50 relative overflow-hidden">
                    {/* Fake Webpage */}
                    <div className="w-full h-full flex flex-col gap-3">
                        {/* Nav */}
                        <div className="flex items-center justify-between">
                            <div className="w-6 h-6 rounded-md bg-blue-500/20" />
                            <div className="flex gap-2">
                                <div className="w-12 h-2 rounded-sm bg-zinc-800" />
                                <div className="w-12 h-2 rounded-sm bg-zinc-800" />
                            </div>
                        </div>

                        {/* Hero */}
                        <div className="flex gap-4 mt-2">
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="w-3/4 h-6 rounded-md bg-zinc-800" />
                                <div className="w-full h-2 rounded-md bg-zinc-800/50" />
                                <div className="w-full h-2 rounded-md bg-zinc-800/50" />
                                <div className="w-20 h-6 rounded-md bg-blue-600/50 mt-1" />
                            </div>
                            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5" />
                        </div>
                    </div>

                    {/* Overlay Badge */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent flex items-end justify-center pb-4">
                        <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-1.5 backdrop-blur-sm">
                            <Globe className="w-3 h-3 text-green-400" />
                            <span className="text-[10px] font-medium text-green-400">Live Production</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 1,
        name: "UI Components",
        designation: "Generate beautiful, responsive UI components with Tailwind CSS and Framer Motion.",
        content: (
            <div className="w-full h-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col relative group">
                <div className="p-4 flex items-center justify-center flex-1 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950">
                    <div className="flex flex-col gap-3 w-full max-w-[200px]">
                        <div className="p-3 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer group/item flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center">
                                <Layout className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="w-16 h-2 rounded bg-zinc-600" />
                                <div className="w-10 h-1.5 rounded bg-zinc-700" />
                            </div>
                        </div>
                        <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center gap-3 opacity-60">
                            <div className="w-8 h-8 rounded bg-zinc-800" />
                            <div className="flex flex-col gap-1">
                                <div className="w-12 h-2 rounded bg-zinc-800" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 2,
        name: "Database Integration",
        designation: "Full Supabase integration with real-time subscriptions, auth, and row-level security.",
        content: (
            <div className="w-full h-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col relative">
                <div className="flex items-center px-4 py-2 border-b border-zinc-800 bg-zinc-800/20 gap-2">
                    <Database className="w-3 h-3 text-emerald-400" />
                    <div className="h-1 w-12 rounded-full bg-zinc-700" />
                </div>
                <div className="p-4 flex flex-col gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-zinc-800 shrink-0" />
                            <div className="flex-1 h-2 rounded bg-zinc-800/50" />
                            <div className="w-8 h-2 rounded bg-zinc-800/30" />
                        </div>
                    ))}
                    <div className="mt-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
                        Connected to Supabase
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 3,
        name: "Authentication",
        designation: "Pre-built authentication with Supabase Auth including social providers and protected routes.",
        content: (
            <div className="w-full h-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center relative bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
                <div className="w-48 p-4 rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-2xl backdrop-blur-sm flex flex-col gap-3">
                    <div className="flex flex-col gap-1 items-center mb-1">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 mb-1" />
                        <div className="w-20 h-2 rounded bg-zinc-800" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="h-8 rounded-md bg-zinc-900 border border-zinc-800" />
                        <div className="h-8 rounded-md bg-zinc-900 border border-zinc-800" />
                        <div className="h-8 rounded-md bg-zinc-100 mt-1" />
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 4,
        name: "Edge Functions",
        designation: "Run server-side logic globally with Supabase Edge Functions. Low latency, high performance.",
        content: (
            <div className="w-full h-full rounded-xl overflow-hidden bg-[#1e1e1e] border border-zinc-800 flex flex-col relative">
                <div className="flex items-center px-4 py-2 bg-[#252526] border-b border-black/20 gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    <div className="ml-2 text-[10px] text-zinc-500 font-mono">function.ts</div>
                </div>
                <div className="p-4 font-mono text-[10px] sm:text-xs leading-relaxed text-blue-300/90">
                    <span className="text-purple-400">import</span> {"{ serve }"} <span className="text-purple-400">from</span> <span className="text-orange-400">"std/server"</span>
                    <br />
                    <br />
                    <span className="text-blue-400">serve</span>(req ={">"} {"{"}
                    <br />
                    &nbsp;&nbsp;<span className="text-purple-400">const</span> data = <span className="text-yellow-300">await</span> req.json()
                    <br />
                    &nbsp;&nbsp;<span className="text-purple-400">return new</span> <span className="text-green-400">Response</span>(...)
                    <br />
                    {"}"})
                </div>
            </div>
        ),
    },
    {
        id: 5,
        name: "Steve Jobs",
        designation: "Co-founder, Apple",
        content: (
            <div className="w-full h-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col justify-center p-6 relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01703C7.91246 16 7.01703 16.8954 7.01703 18V21H2.01703V18C2.01703 14.134 5.15104 11 9.01703 11H12.017C15.883 11 19.017 14.134 19.017 18V21H14.017ZM21.017 6H14.017V9H21.017V6ZM14.017 3H21.017V0H14.017V3ZM9.01703 3H2.01703V0H9.01703V3ZM2.01703 9H9.01703V6H2.01703V9Z" /></svg>
                </div>
                <p className="text-xl md:text-2xl font-serif italic text-zinc-300 leading-relaxed">
                    "Design is not just what it looks like and feels like. Design is how it works."
                </p>
            </div>
        ),
    },
    {
        id: 6,
        name: "Joe Sparano",
        designation: "Designer",
        content: (
            <div className="w-full h-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/30 to-zinc-950">
                <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                    "Good design is obvious. Great design is transparent."
                </p>
                <div className="w-8 h-1 bg-blue-500/50 rounded-full mt-4" />
            </div>
        ),
    },
]
