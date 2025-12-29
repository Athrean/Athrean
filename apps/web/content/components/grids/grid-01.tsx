"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Globe, BarChart3, Users, Sparkles } from "lucide-react";

// Minimal Dark Bento - Clean geometric design with subtle animations
export default function Grid01() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with edge computing",
      span: "col-span-1",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with end-to-end encryption",
      span: "col-span-1",
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Deploy to 50+ regions worldwide",
      span: "col-span-2 md:col-span-1",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "< 50ms", label: "Latency" },
    { value: "10M+", label: "Requests/day" },
  ];

  return (
    <div className="min-h-screen w-full bg-zinc-950 p-6 md:p-12 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-6"
          >
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-400">Built for developers</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Infrastructure that scales
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Deploy with confidence using our battle-tested platform
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Feature Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 md:row-span-2 bg-linear-to-br from-zinc-900 to-zinc-950 rounded-3xl p-8 border border-zinc-800 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Real-time Analytics
              </h3>
              <p className="text-zinc-400 mb-8 max-w-md">
                Monitor your infrastructure with millisecond precision. Get
                insights that matter, when they matter.
              </p>

              {/* Mock Chart */}
              <div className="h-48 flex items-end gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                  (height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                      className="flex-1 bg-linear-to-t from-violet-600 to-violet-400 rounded-t-sm opacity-80"
                    />
                  )
                )}
              </div>
            </div>
          </motion.div>

          {/* Feature Cards */}
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`${feature.span} bg-zinc-900 rounded-3xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors group`}
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                <feature.icon className="w-5 h-5 text-zinc-300" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-500">{feature.description}</p>
            </motion.div>
          ))}

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="md:col-span-3 bg-zinc-900 rounded-3xl p-8 border border-zinc-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-zinc-400" />
              <span className="text-sm text-zinc-400">
                Trusted by 10,000+ teams
              </span>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-1"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
