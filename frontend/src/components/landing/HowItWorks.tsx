'use client'

import { motion } from 'framer-motion'
import { BookOpen, Sparkles, GraduationCap } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: BookOpen,
    title: 'Build your course',
    description: 'Drag and drop modules and lessons into place. Add video, rich text, or quizzes. Inline editing — no extra saves needed.',
    color: 'bg-indigo-500',
    glow: 'shadow-indigo-500/20',
    preview: (
      <div className="space-y-1.5 mt-4" style={{ fontSize: 11 }}>
        {['Module 1: Foundations', 'Module 2: Core Concepts', 'Module 3: Advanced Topics'].map((m, i) => (
          <div key={m} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${i === 0 ? 'bg-indigo-50 border border-indigo-100' : 'bg-zinc-50 border border-zinc-100'}`}>
            <div className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-indigo-500' : 'bg-zinc-300'}`} />
            <span className={i === 0 ? 'text-indigo-700 font-medium' : 'text-zinc-400'}>{m}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Let AI enrich it',
    description: 'Paste any lesson content. Our GPT-powered engine generates contextual quizzes with explanations in under 3 seconds.',
    color: 'bg-violet-500',
    glow: 'shadow-violet-500/20',
    preview: (
      <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/60 p-3 space-y-2" style={{ fontSize: 11 }}>
        <div className="flex items-center gap-2 text-violet-700">
          <Sparkles className="h-3 w-3" />
          <span className="font-medium">Generating quiz…</span>
        </div>
        {['What is backpropagation?', 'Define gradient descent.', 'Explain overfitting.'].map((q, i) => (
          <motion.div
            key={q}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="flex items-start gap-1.5"
          >
            <span className="text-violet-400 font-bold shrink-0">Q{i + 1}</span>
            <span className="text-zinc-600">{q}</span>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    number: '03',
    icon: GraduationCap,
    title: 'Students learn & grow',
    description: 'A clean, distraction-free experience. Real-time progress tracking, adaptive scoring, and certificates on completion.',
    color: 'bg-emerald-500',
    glow: 'shadow-emerald-500/20',
    preview: (
      <div className="mt-4 space-y-2" style={{ fontSize: 11 }}>
        {[
          { label: 'Introduction to ML', pct: 100, done: true },
          { label: 'Web Development', pct: 68, done: false },
          { label: 'Data Structures', pct: 30, done: false },
        ].map(({ label, pct, done }) => (
          <div key={label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className={done ? 'text-emerald-600 font-medium' : 'text-zinc-500'}>{label}</span>
              <span className={done ? 'text-emerald-500 font-semibold' : 'text-zinc-400'}>{pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-100">
              <motion.div
                className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-indigo-400'}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
]

export function HowItWorks() {
  return (
    <section className="py-28 px-6 bg-zinc-50/60">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-indigo-500">How it works</p>
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            From idea to live course{' '}
            <span className="text-zinc-300">in minutes</span>
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">No complex setup. No training required. Just build, enrich, and launch.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 relative">
          {/* Connector lines (desktop) */}
          <div className="absolute top-12 left-[calc(33.3%-12px)] right-[calc(33.3%-12px)] hidden sm:block pointer-events-none">
            <svg width="100%" height="2" className="overflow-visible">
              <motion.line
                x1="0" y1="1" x2="100%" y2="1"
                stroke="#e4e4e7" strokeWidth="2" strokeDasharray="6 4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
              />
            </svg>
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
            >
              {/* Step number */}
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${step.color} shadow-lg ${step.glow}`}>
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-3xl font-black text-zinc-100">{step.number}</span>
              </div>

              <h3 className="font-semibold text-zinc-900 tracking-tight">{step.title}</h3>
              <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">{step.description}</p>

              {step.preview}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
