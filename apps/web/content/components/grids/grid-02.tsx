"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Glassmorphism Light Bento - Elegant frosted glass with vibrant accents
export default function Grid02() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const integrations = [
    { name: "Slack", color: "#E01E5A", icon: "S" },
    { name: "Notion", color: "#000000", icon: "N" },
    { name: "Figma", color: "#F24E1E", icon: "F" },
    { name: "GitHub", color: "#181717", icon: "G" },
    { name: "Linear", color: "#5E6AD2", icon: "L" },
    { name: "Vercel", color: "#000000", icon: "V" },
  ];

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-rose-50 via-white to-sky-50 p-6 md:p-12 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-gray-600">All systems operational</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4"
          >
            Your workspace, unified
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            Connect all your tools in one beautiful interface
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4 auto-rows-[140px]">
          {/* Integration Hub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="col-span-12 md:col-span-8 row-span-2 bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl shadow-gray-200/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-violet-200/30 to-pink-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Integrations
              </h3>
              <p className="text-gray-500 mb-6">
                Connect with 100+ tools you already use
              </p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {integrations.map((int, i) => (
                  <motion.div
                    key={int.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    onHoverStart={() => setHoveredCard(i)}
                    onHoverEnd={() => setHoveredCard(null)}
                    className="aspect-square bg-white rounded-2xl shadow-lg shadow-gray-200/50 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform border border-gray-100"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: int.color }}
                    >
                      {int.icon}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Time Saved Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="col-span-6 md:col-span-4 row-span-2 bg-linear-to-br from-violet-500 to-purple-600 rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="text-white/70 text-sm mb-2">Time saved</div>
                <div className="text-5xl font-bold text-white mb-1">12h</div>
                <div className="text-white/70 text-sm">per week</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 backdrop-blur-sm"
                    />
                  ))}
                </div>
                <span className="text-white/80 text-sm">+2,340 users</span>
              </div>
            </div>
          </motion.div>

          {/* Productivity Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="col-span-6 md:col-span-4 row-span-1 bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl shadow-gray-200/50"
          >
            <div className="flex items-center justify-between h-full">
              <div>
                <div className="text-gray-500 text-sm mb-1">Productivity</div>
                <div className="text-3xl font-bold text-gray-900">+47%</div>
              </div>
              <div className="flex items-end gap-1 h-16">
                {[30, 45, 35, 55, 70, 60, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="w-3 bg-linear-to-t from-emerald-500 to-emerald-300 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tasks Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 }}
            className="col-span-6 md:col-span-4 row-span-1 bg-linear-to-br from-amber-400 to-orange-500 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between h-full">
              <div>
                <div className="text-white/80 text-sm mb-1">Tasks completed</div>
                <div className="text-3xl font-bold text-white">1,284</div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                <span className="text-white font-bold">89%</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="col-span-12 md:col-span-4 row-span-1 bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl shadow-gray-200/50"
          >
            <div className="flex items-center gap-4 h-full">
              <div className="flex gap-2">
                {["Create", "Import", "Share"].map((action, i) => (
                  <motion.button
                    key={action}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
