"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FaqItem {
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    question: "What can I build with Athrean?",
    answer:
      "You can build anything from simple UI components to complete multi-page applications. Athrean generates React components with TypeScript, including forms, dashboards, landing pages, data visualizations, and more.",
  },
  {
    question: "Do I need coding experience?",
    answer:
      "No coding experience is required to get started. Simply describe what you want in plain English, and Athrean will generate the code for you. However, knowing React and TypeScript helps you customize and extend the generated code.",
  },
  {
    question: "How does the AI generation work?",
    answer:
      "Athrean uses advanced language models to understand your requirements and generate clean, production-ready code. The AI considers best practices, accessibility, and modern React patterns when creating components.",
  },
  {
    question: "Is my code private?",
    answer:
      "Yes, your generated code is private by default. You can choose to make projects public to share with the community, but all code stays yours and you can export it anytime.",
  },
  {
    question: "What frameworks and technologies are supported?",
    answer:
      "Currently, Athrean generates React components with TypeScript and Tailwind CSS. We're working on adding support for more frameworks like Vue, Svelte, and Next.js-specific features.",
  },
  {
    question: "Can I use the generated code commercially?",
    answer:
      "Absolutely. All code you generate with Athrean is yours to use however you want, including in commercial projects. There are no licensing restrictions on your generated code.",
  },
]

interface FaqItemComponentProps {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
  index: number
}

function FaqItemComponent({
  item,
  isOpen,
  onToggle,
  index,
}: FaqItemComponentProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-zinc-800 last:border-b-0"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-base font-medium text-white pr-4">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-zinc-500 transition-transform duration-200 shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-zinc-400 leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FaqSection(): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 px-4 bg-black">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-teal-400 uppercase tracking-wider mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* FAQ items */}
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 px-6">
          {faqItems.map((item, index) => (
            <FaqItemComponent
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
