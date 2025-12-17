'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { ReasoningProps, ReasoningStep } from '@/types/reasoning'

interface ThoughtLineProps {
  step: ReasoningStep
  index: number
}

function ThoughtLine({ step, index }: ThoughtLineProps): React.ReactElement {
  const isThinking = step.status === 'thinking'

  return (
    <motion.p
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: isThinking ? 0.5 : 0.35, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className="text-[13px] leading-relaxed text-zinc-500 italic"
    >
      {step.content || step.title}
      {isThinking && (
        <motion.span
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="ml-1"
        >
          ...
        </motion.span>
      )}
    </motion.p>
  )
}

export function Reasoning({
  steps,
}: ReasoningProps): React.ReactElement {
  if (steps.length === 0) return <></>

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-2 space-y-1"
    >
      <AnimatePresence mode="popLayout">
        {steps.map((step, index) => (
          <ThoughtLine key={step.id} step={step} index={index} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
