"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Play, Pause } from "lucide-react";
import { useState } from "react";

// Brutalist Creative Bento - Bold typography with raw aesthetic
export default function Grid03() {
  const [isPlaying, setIsPlaying] = useState(true);

  const projects = [
    { name: "BRAND IDENTITY", year: "2024", status: "Live" },
    { name: "E-COMMERCE", year: "2024", status: "In Progress" },
    { name: "MOBILE APP", year: "2023", status: "Live" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F5F5F0] p-4 md:p-8 flex items-center justify-center font-mono">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between border-b-2 border-black pb-4">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs tracking-[0.3em] text-gray-600 mb-2"
            >
              DIGITAL AGENCY © 2024
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-black tracking-tighter leading-none"
            >
              WE CREATE
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-black to-gray-400">
                EXPERIENCES
              </span>
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:block text-right"
          >
            <div className="text-xs tracking-widest text-gray-500">SCROLL</div>
            <div className="text-xs tracking-widest text-gray-500">↓</div>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-3 md:gap-4">
          {/* Main Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 md:col-span-7 row-span-2 bg-black rounded-none p-8 relative overflow-hidden group cursor-pointer"
            style={{ aspectRatio: "16/10" }}
          >
            <div className="absolute inset-0 bg-linear-to-br from-black via-gray-900 to-black" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="text-white/50 text-xs tracking-widest">
                  FEATURED PROJECT
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 45 }}
                  className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all"
                >
                  <ArrowUpRight className="w-5 h-5 text-white group-hover:text-black" />
                </motion.div>
              </div>
              <div>
                <h3 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
                  NEXUS
                </h3>
                <p className="text-white/60 text-sm max-w-xs">
                  A complete digital transformation for the modern enterprise
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-6 md:col-span-5 bg-white border-2 border-black p-6 flex flex-col justify-between"
          >
            <div className="text-xs tracking-widest text-gray-500 mb-4">
              PROJECTS DELIVERED
            </div>
            <div className="text-6xl md:text-8xl font-black text-black leading-none">
              247
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="col-span-6 md:col-span-5 bg-[#FF5C00] p-6 flex flex-col justify-between"
          >
            <div className="text-xs tracking-widest text-black/70 mb-4">
              CLIENT SATISFACTION
            </div>
            <div className="text-6xl md:text-8xl font-black text-black leading-none">
              98%
            </div>
          </motion.div>

          {/* Audio/Video Player Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-12 md:col-span-4 bg-black p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-black" />
                ) : (
                  <Play className="w-6 h-6 text-black ml-1" />
                )}
              </motion.button>
              <div>
                <div className="text-white text-sm font-bold">SHOWREEL 2024</div>
                <div className="text-white/50 text-xs">02:34 / 04:12</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isPlaying ? [8, 24, 8] : 8,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isPlaying ? Infinity : 0,
                    delay: i * 0.05,
                  }}
                  className="w-1 bg-white/60 rounded-full"
                />
              ))}
            </div>
          </motion.div>

          {/* Project List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="col-span-12 md:col-span-8 bg-white border-2 border-black p-6"
          >
            <div className="text-xs tracking-widest text-gray-500 mb-4">
              RECENT WORK
            </div>
            <div className="space-y-4">
              {projects.map((project, i) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0 group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{`0${i + 1}`}</span>
                    <span className="text-lg font-bold text-black group-hover:text-gray-500 transition-colors">
                      {project.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{project.year}</span>
                    <span
                      className={`text-xs px-3 py-1 ${
                        project.status === "Live"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
