-- Athrean Seed Data
-- 12 curated animated components

INSERT INTO components (slug, name, description, category, tags, code, dependencies) VALUES

-- BUTTONS
('gradient-button', 'Gradient Button', 'Animated gradient border that shifts on hover with smooth transitions', 'buttons', ARRAY['button', 'gradient', 'animated', 'hover'], 
$$'use client'

import { motion } from 'framer-motion'

export default function GradientButton() {
  return (
    <motion.button
      className="relative px-8 py-3 rounded-xl font-semibold text-white overflow-hidden group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 animate-gradient-x" />
      <span className="absolute inset-[2px] bg-zinc-950 rounded-[10px]" />
      <span className="relative z-10 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
        Get Started
      </span>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
      />
    </motion.button>
  )
}$$, '{"framer-motion": "^11.0.0"}'),

('glow-button', 'Glow Button', 'Soft pulsing glow effect that intensifies on hover', 'buttons', ARRAY['button', 'glow', 'pulse', 'hover'],
$$'use client'

import { motion } from 'framer-motion'

export default function GlowButton() {
  return (
    <motion.button
      className="relative px-8 py-3 rounded-xl font-semibold text-white"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="absolute inset-0 rounded-xl bg-indigo-500 blur-lg opacity-50 group-hover:opacity-75 animate-pulse" />
      <span className="relative block px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors">
        Subscribe Now
      </span>
    </motion.button>
  )
}$$, '{"framer-motion": "^11.0.0"}'),

('magnetic-button', 'Magnetic Button', 'Button that subtly follows cursor position creating a magnetic effect', 'buttons', ARRAY['button', 'magnetic', 'cursor', 'interactive'],
$$'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.2)
    y.set((e.clientY - centerY) * 0.2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="px-8 py-3 rounded-xl bg-white text-zinc-900 font-semibold hover:shadow-lg transition-shadow"
      whileTap={{ scale: 0.95 }}
    >
      Hover Me
    </motion.button>
  )
}$$, '{"framer-motion": "^11.0.0"}'),

-- CARDS
('glass-card', 'Glass Card', 'Glassmorphism card with frosted backdrop blur and subtle border', 'cards', ARRAY['card', 'glass', 'blur', 'frosted'],
$$'use client'

import { motion } from 'framer-motion'

export default function GlassCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-80 p-6 rounded-2xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl" />
      <div className="absolute inset-0 border border-white/10 rounded-2xl" />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-4 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
        <p className="text-zinc-400 text-sm">Built for speed with optimized performance at every level.</p>
      </div>
    </motion.div>
  )
}$$, '{"framer-motion": "^11.0.0"}'),

('spotlight-card', 'Spotlight Card', 'Card with dynamic spotlight that follows cursor position', 'cards', ARRAY['card', 'spotlight', 'cursor', 'interactive'],
$$'use client'

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

export default function SpotlightCard() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-80 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden group"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(120, 119, 198, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <h3 className="text-xl font-semibold text-white mb-2">Spotlight Effect</h3>
      <p className="text-zinc-400 text-sm">Move your cursor to reveal the spotlight tracking effect.</p>
    </motion.div>
  )
}$$, '{"framer-motion": "^11.0.0"}'),

('tilt-card', 'Tilt Card', '3D perspective tilt effect on hover with smooth spring animation', 'cards', ARRAY['card', '3d', 'tilt', 'perspective'],
$$'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCard() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 300 }
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="w-80 p-6 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 cursor-pointer"
    >
      <div style={{ transform: 'translateZ(50px)' }}>
        <h3 className="text-xl font-semibold text-white mb-2">3D Tilt Effect</h3>
        <p className="text-zinc-400 text-sm">This card tilts towards your cursor with perspective depth.</p>
      </div>
    </motion.div>
  )
}$$, '{"framer-motion": "^11.0.0"}'),

-- HEROES
('gradient-hero', 'Gradient Hero', 'Animated mesh gradient background with floating orbs', 'heroes', ARRAY['hero', 'gradient', 'mesh', 'animated'],
$$'use client'

import { motion } from 'framer-motion'

export default function GradientHero() {
  return (
    <div className="relative min-h-[500px] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
      {/* Animated gradient orbs */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl"
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          Build Faster
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-zinc-400 max-w-xl mx-auto"
        >
          Create stunning interfaces with our collection of animated components.
        </motion.p>
      </div>
    </div>
  )
}$$, '{"framer-motion": "^11.0.0"}'),

('particles-hero', 'Particles Hero', 'Floating particle animation with mouse interaction', 'heroes', ARRAY['hero', 'particles', 'animated', 'interactive'],
$$'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function ParticlesHero() {
  const particles = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
    })), []
  )

  return (
    <div className="relative min-h-[500px] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          Particles
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-zinc-400"
        >
          Floating particles create depth and movement.
        </motion.p>
      </div>
    </div>
  )
}$$, '{"framer-motion": "^11.0.0"}'),

-- FORMS
('modern-login', 'Modern Login', 'Clean login form with floating labels and smooth animations', 'forms', ARRAY['form', 'login', 'floating-labels', 'auth'],
$$'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ModernLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 rounded-2xl bg-zinc-900 border border-zinc-800"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Welcome back</h2>
      
      <form className="space-y-6">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
          />
          <label className="absolute left-4 -top-2.5 text-sm text-zinc-400 bg-zinc-900 px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-400">
            Email
          </label>
        </div>
        
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Password"
          />
          <label className="absolute left-4 -top-2.5 text-sm text-zinc-400 bg-zinc-900 px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-400">
            Password
          </label>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
        >
          Sign In
        </motion.button>
      </form>
    </motion.div>
  )
}$$, '{"framer-motion": "^11.0.0"}'),

('animated-form', 'Animated Form', 'Form inputs with animated underline focus effects', 'forms', ARRAY['form', 'input', 'underline', 'animated'],
$$'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

function AnimatedInput({ label, type = 'text' }: { label: string; type?: string }) {
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState('')

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent border-b-2 border-zinc-700 py-3 text-white focus:outline-none"
      />
      <motion.label
        animate={{
          y: focused || value ? -24 : 0,
          scale: focused || value ? 0.85 : 1,
          color: focused ? '#818cf8' : '#71717a',
        }}
        className="absolute left-0 top-3 origin-left pointer-events-none"
      >
        {label}
      </motion.label>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 origin-left"
      />
    </div>
  )
}

export default function AnimatedForm() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md p-8 space-y-8 rounded-2xl bg-zinc-900"
    >
      <AnimatedInput label="Full Name" />
      <AnimatedInput label="Email Address" type="email" />
      <AnimatedInput label="Message" />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold"
      >
        Send Message
      </motion.button>
    </motion.div>
  )
}$$, '{"framer-motion": "^11.0.0"}'),

-- INPUTS
('search-command', 'Search Command', 'Command palette style search input with keyboard hints', 'inputs', ARRAY['input', 'search', 'command', 'keyboard'],
$$'use client'

import { motion } from 'framer-motion'
import { Search, Command } from 'lucide-react'

export default function SearchCommand() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-xl"
    >
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search components..."
          className="w-full pl-12 pr-24 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div className="absolute right-3 flex items-center gap-1 text-zinc-500">
          <kbd className="px-2 py-1 text-xs bg-zinc-800 rounded border border-zinc-700">
            <Command className="w-3 h-3 inline" />
          </kbd>
          <kbd className="px-2 py-1 text-xs bg-zinc-800 rounded border border-zinc-700">K</kbd>
        </div>
      </div>
    </motion.div>
  )
}$$, '{"framer-motion": "^11.0.0", "lucide-react": "^0.400.0"}'),

('glow-input', 'Glow Input', 'Input with animated gradient glow border on focus', 'inputs', ARRAY['input', 'glow', 'gradient', 'focus'],
$$'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function GlowInput() {
  const [focused, setFocused] = useState(false)

  return (
    <div className="relative w-full max-w-md">
      <motion.div
        animate={{
          opacity: focused ? 1 : 0,
        }}
        className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 rounded-xl blur opacity-75"
      />
      <div className="relative">
        <input
          type="text"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter your email..."
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-transparent relative z-10"
        />
      </div>
    </div>
  )
}$$, '{"framer-motion": "^11.0.0"}');

