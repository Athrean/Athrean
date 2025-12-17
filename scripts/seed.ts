#!/usr/bin/env bun
/**
 * Database Seed Script
 * Seeds the components table with 12 curated animated components.
 * Usage: bun db:seed
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
})

interface ComponentSeed {
  slug: string
  name: string
  description: string
  category: string
  tags: string[]
  code: string
  dependencies: Record<string, string>
}

const components: ComponentSeed[] = [
  {
    slug: 'gradient-button',
    name: 'Gradient Button',
    description: 'Animated gradient border that shifts on hover',
    category: 'buttons',
    tags: ['button', 'gradient', 'animated'],
    code: `'use client'
import { motion } from 'framer-motion'

export default function GradientButton() {
  return (
    <motion.button
      className="relative px-8 py-3 rounded-xl font-semibold text-white overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="absolute inset-0 bg-linear-to-r from-violet-600 via-fuchsia-600 to-pink-600" />
      <span className="absolute inset-[2px] bg-zinc-950 rounded-[10px]" />
      <span className="relative z-10 bg-linear-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
        Get Started
      </span>
    </motion.button>
  )
}`,
    dependencies: { 'framer-motion': '^11.0.0' },
  },
  {
    slug: 'glow-button',
    name: 'Glow Button',
    description: 'Soft pulsing glow effect on hover',
    category: 'buttons',
    tags: ['button', 'glow', 'pulse'],
    code: `'use client'
import { motion } from 'framer-motion'

export default function GlowButton() {
  return (
    <motion.button className="relative px-8 py-3 rounded-xl font-semibold text-white" whileHover={{ scale: 1.02 }}>
      <span className="absolute inset-0 rounded-xl bg-indigo-500 blur-lg opacity-50 animate-pulse" />
      <span className="relative block px-8 py-3 rounded-xl bg-indigo-600">Subscribe Now</span>
    </motion.button>
  )
}`,
    dependencies: { 'framer-motion': '^11.0.0' },
  },
  {
    slug: 'magnetic-button',
    name: 'Magnetic Button',
    description: 'Button that follows cursor with magnetic effect',
    category: 'buttons',
    tags: ['button', 'magnetic', 'interactive'],
    code: `'use client'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'

export default function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const xSpring = useSpring(x, { damping: 15, stiffness: 150 })
  const ySpring = useSpring(y, { damping: 15, stiffness: 150 })

  return (
    <motion.button
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((e.clientX - rect.left - rect.width / 2) * 0.2)
        y.set((e.clientY - rect.top - rect.height / 2) * 0.2)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      className="px-8 py-3 rounded-xl bg-white text-zinc-900 font-semibold"
      whileTap={{ scale: 0.95 }}
    >
      Hover Me
    </motion.button>
  )
}`,
    dependencies: { 'framer-motion': '^11.0.0' },
  },
  {
    slug: 'glass-card',
    name: 'Glass Card',
    description: 'Glassmorphism card with frosted blur',
    category: 'cards',
    tags: ['card', 'glass', 'blur'],
    code: `'use client'
import { motion } from 'framer-motion'

export default function GlassCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-80 p-6 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl" />
      <div className="absolute inset-0 border border-white/10 rounded-2xl" />
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
        <p className="text-zinc-400 text-sm">Built for speed with optimized performance.</p>
      </div>
    </motion.div>
  )
}`,
    dependencies: { 'framer-motion': '^11.0.0' },
  },
  {
    slug: 'spotlight-card',
    name: 'Spotlight Card',
    description: 'Card with cursor-following spotlight',
    category: 'cards',
    tags: ['card', 'spotlight', 'interactive'],
    code: `'use client'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

export default function SpotlightCard() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }}
      className="relative w-80 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 group"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: useMotionTemplate\`radial-gradient(350px at \${mouseX}px \${mouseY}px, rgba(99,102,241,0.15), transparent 80%)\` }}
      />
      <h3 className="text-xl font-semibold text-white mb-2">Spotlight</h3>
      <p className="text-zinc-400 text-sm">Move cursor to reveal effect.</p>
    </motion.div>
  )
}`,
    dependencies: { 'framer-motion': '^11.0.0' },
  },
  {
    slug: 'tilt-card',
    name: 'Tilt Card',
    description: '3D perspective tilt on hover',
    category: 'cards',
    tags: ['card', '3d', 'tilt'],
    code: `'use client'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCard() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { damping: 20, stiffness: 300 })
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { damping: 20, stiffness: 300 })

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - rect.left - rect.width / 2)
        y.set(e.clientY - rect.top - rect.height / 2)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="w-80 p-6 rounded-2xl bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700"
    >
      <h3 className="text-xl font-semibold text-white mb-2">3D Tilt</h3>
      <p className="text-zinc-400 text-sm">Card tilts towards cursor.</p>
    </motion.div>
  )
}`,
    dependencies: { 'framer-motion': '^11.0.0' },
  },
  {
    slug: 'gradient-hero',
    name: 'Gradient Hero',
    description: 'Animated mesh gradient background',
    category: 'heroes',
    tags: ['hero', 'gradient', 'animated'],
    code: `'use client'
import { motion } from 'framer-motion'

export default function GradientHero() {
  return (
    <div className="relative min-h-[400px] bg-zinc-950 flex items-center justify-center overflow-hidden">
      <motion.div animate={{ x: [0, 50, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-20 left-20 w-72 h-72 bg-violet-600/30 rounded-full blur-3xl" />
      <motion.div animate={{ x: [0, -50, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-20 right-20 w-72 h-72 bg-fuchsia-600/30 rounded-full blur-3xl" />
      <h1 className="relative z-10 text-5xl font-bold text-white">Build Faster</h1>
    </div>
  )
}`,
    dependencies: { 'framer-motion': '^11.0.0' },
  },
  {
    slug: 'particles-hero',
    name: 'Particles Hero',
    description: 'Floating particle animation',
    category: 'heroes',
    tags: ['hero', 'particles', 'animated'],
    code: `'use client'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function ParticlesHero() {
  const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 3 + 1, dur: Math.random() * 15 + 10
  })), [])

  return (
    <div className="relative min-h-[400px] bg-zinc-950 flex items-center justify-center overflow-hidden">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-white/20" style={{ left: \`\${p.x}%\`, top: \`\${p.y}%\`, width: p.size, height: p.size }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: p.dur, repeat: Infinity }} />
      ))}
      <h1 className="relative z-10 text-5xl font-bold text-white">Particles</h1>
    </div>
  )
}`,
    dependencies: { 'framer-motion': '^11.0.0' },
  },
  {
    slug: 'modern-login',
    name: 'Modern Login',
    description: 'Clean login form with floating labels',
    category: 'forms',
    tags: ['form', 'login', 'auth'],
    code: `'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ModernLogin() {
  const [email, setEmail] = useState('')
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-80 p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
      <h2 className="text-2xl font-bold text-white mb-6">Welcome back</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 mb-4 bg-zinc-800 rounded-xl text-white" />
      <input type="password" placeholder="Password" className="w-full px-4 py-3 mb-6 bg-zinc-800 rounded-xl text-white" />
      <button className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold">Sign In</button>
    </motion.div>
  )
}`,
    dependencies: { 'framer-motion': '^11.0.0' },
  },
  {
    slug: 'animated-form',
    name: 'Animated Form',
    description: 'Form with animated underline inputs',
    category: 'forms',
    tags: ['form', 'input', 'animated'],
    code: `'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function AnimatedForm() {
  const [focused, setFocused] = useState<string | null>(null)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-80 p-8 space-y-6 rounded-2xl bg-zinc-900">
      {['Name', 'Email', 'Message'].map((label) => (
        <div key={label} className="relative">
          <input onFocus={() => setFocused(label)} onBlur={() => setFocused(null)} placeholder={label}
            className="w-full bg-transparent border-b-2 border-zinc-700 py-3 text-white focus:outline-none" />
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: focused === label ? 1 : 0 }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 origin-left" />
        </div>
      ))}
      <button className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold">Send</button>
    </motion.div>
  )
}`,
    dependencies: { 'framer-motion': '^11.0.0' },
  },
  {
    slug: 'search-command',
    name: 'Search Command',
    description: 'Command palette style search',
    category: 'inputs',
    tags: ['input', 'search', 'command'],
    code: `'use client'
import { Search, Command } from 'lucide-react'

export default function SearchCommand() {
  return (
    <div className="relative w-96">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
      <input placeholder="Search..." className="w-full pl-12 pr-20 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white" />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
        <kbd className="px-2 py-1 text-xs bg-zinc-800 rounded border border-zinc-700"><Command className="w-3 h-3 inline" /></kbd>
        <kbd className="px-2 py-1 text-xs bg-zinc-800 rounded border border-zinc-700">K</kbd>
      </div>
    </div>
  )
}`,
    dependencies: { 'lucide-react': '^0.400.0' },
  },
  {
    slug: 'glow-input',
    name: 'Glow Input',
    description: 'Input with gradient glow on focus',
    category: 'inputs',
    tags: ['input', 'glow', 'gradient'],
    code: `'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function GlowInput() {
  const [focused, setFocused] = useState(false)
  return (
    <div className="relative w-80">
      <motion.div animate={{ opacity: focused ? 1 : 0 }} className="absolute -inset-0.5 bg-linear-to-r from-violet-600 via-fuchsia-600 to-pink-600 rounded-xl blur opacity-75" />
      <input onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="Enter email..."
        className="relative w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none z-10" />
    </div>
  )
}`,
    dependencies: { 'framer-motion': '^11.0.0' },
  },
]

async function seed(): Promise<void> {
  console.log('🌱 Seeding database...\n')

  await supabase.from('components').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const { data, error } = await supabase.from('components').insert(components).select()

  if (error) {
    console.error('❌ Failed:', error.message)
    process.exit(1)
  }

  console.log(`✅ Seeded ${data.length} components\n`)
  data.forEach((c) => console.log(`   • ${c.name}`))
  console.log('\n🎉 Done!')
}

seed()
