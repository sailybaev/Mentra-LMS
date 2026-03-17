'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, BookOpen, BarChart2, GraduationCap } from 'lucide-react'

function FeatureCard({
  icon: Icon,
  tag,
  title,
  description,
  span = 1,
  children,
  index,
}: {
  icon: React.ElementType
  tag: string
  title: string
  description: string
  span?: 1 | 2 | 3
  children?: React.ReactNode
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const spanClass = span === 2 ? 'lg:col-span-2' : span === 3 ? 'lg:col-span-3' : ''

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const rect = ref.current!.getBoundingClientRect()
        setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border border-[#E8E7E3] bg-white p-7 flex flex-col gap-5 cursor-default transition-shadow duration-300 hover:shadow-lg hover:shadow-black/[0.04] ${spanClass}`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(280px circle at ${cursor.x}px ${cursor.y}px, rgba(0,0,0,0.025), transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#111110] to-transparent transition-opacity duration-300"
        style={{ opacity: hovered ? 0.5 : 0 }}
      />

      <div className="relative z-10 flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111110]"
            whileHover={{ scale: 1.12, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            <Icon className="h-4 w-4 text-white" />
          </motion.div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C8C6C1]">{tag}</span>
        </div>

        <div>
          <h3 className="font-bold text-[#111110] tracking-tight text-[15px]">{title}</h3>
          <p className="mt-1.5 text-[13px] text-[#6B6B67] leading-relaxed">{description}</p>
        </div>

        {children && <div className="flex-1 flex flex-col justify-end">{children}</div>}
      </div>
    </motion.div>
  )
}

function QuizPreview() {
  const options = [
    { label: 'An optimizer algorithm', correct: true },
    { label: 'A dataset format', correct: false },
    { label: 'A loss function', correct: false },
  ]
  return (
    <div className="rounded-xl border border-[#F0EFEB] bg-[#FAFAF8] p-4 space-y-2">
      <p className="text-xs font-semibold text-[#111110] mb-3">What is gradient descent?</p>
      {options.map((opt, i) => (
        <motion.div
          key={opt.label}
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium ${
            opt.correct
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-[#9B9B97] border border-[#E8E7E3]'
          }`}
        >
          <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${opt.correct ? 'bg-white/60' : 'bg-[#E8E7E3]'}`} />
          {opt.label}
        </motion.div>
      ))}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-[#9B9B97]">Generated in 2.1s</span>
        <span className="text-[10px] font-semibold text-emerald-600">94% avg score ↑</span>
      </div>
    </div>
  )
}

function AnalyticsPreview() {
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']
  const bars = [38, 52, 44, 71, 58, 83, 76]
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-1.5 h-20">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              className="w-full rounded-sm bg-emerald-500"
              style={{ height: `${h}%`, opacity: 0.25 + i * 0.1 }}
              initial={{ scaleY: 0, originY: '100%' }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="text-[9px] text-[#C8C6C1]">{weeks[i]}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-[#F0EFEB] pt-3">
        <div>
          <p className="text-xs font-semibold text-emerald-700">76% completion</p>
          <p className="text-[11px] text-emerald-600 font-medium">↑ 12% vs last month</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-[#111110]">231 active</p>
          <p className="text-[11px] text-[#9B9B97]">students this week</p>
        </div>
      </div>
    </div>
  )
}

function StudentJourneyPreview() {
  const steps = [
    { label: 'Enrolled', sub: 'Auto-provisioned' },
    { label: 'Lesson watched', sub: '94% completion' },
    { label: 'Quiz passed', sub: 'AI-graded instantly' },
    { label: 'Certificate', sub: 'Auto-issued' },
  ]
  return (
    <div className="flex items-start gap-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex-1 flex items-start">
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full flex items-center">
              <motion.div
                className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mx-auto z-10 shadow-sm shadow-emerald-600/20"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 280, damping: 18 }}
              >
                {i + 1}
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  className="absolute left-1/2 right-0 h-px bg-emerald-100"
                  style={{ top: '50%' }}
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.4 }}
                />
              )}
            </div>
            <div className="mt-2.5 text-center px-1">
              <p className="text-xs font-semibold text-[#111110]">{step.label}</p>
              <p className="text-[10px] text-[#9B9B97] mt-0.5">{step.sub}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DragDropPreview() {
  const modules = ['01 — Introduction', '02 — Core Concepts', '03 — Hands-on Lab']
  return (
    <div className="space-y-2">
      {modules.map((mod, i) => (
        <motion.div
          key={mod}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.08 }}
          className="flex items-center gap-3 rounded-xl border border-[#E8E7E3] bg-[#FAFAF8] px-3 py-2.5 cursor-grab"
        >
          <div className="flex flex-col gap-[3px] shrink-0">
            {[0, 1].map((r) => (
              <div key={r} className="flex gap-[3px]">
                <div className="h-[3px] w-[3px] rounded-full bg-[#C8C6C1]" />
                <div className="h-[3px] w-[3px] rounded-full bg-[#C8C6C1]" />
              </div>
            ))}
          </div>
          <span className="text-xs font-medium text-[#6B6B67]">{mod}</span>
          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#E8E7E3]" />
        </motion.div>
      ))}
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-[#FAFAF8]">
      <div className="mx-auto max-w-[1120px] px-8">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C8C6C1]">Platform</p>
          <h2 className="text-[#111110] tracking-[-0.04em] leading-[1.05]" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
            Built for how universities{' '}
            <span
              style={{
                fontFamily: 'var(--font-display), Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              actually work.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-auto">
          <FeatureCard
            index={0}
            icon={Sparkles}
            tag="AI"
            title="Quiz generator"
            description="Generate contextual quizzes from any lesson in under 3 seconds. Questions, answers, and explanations — auto-graded."
            span={2}
          >
            <QuizPreview />
          </FeatureCard>

          <FeatureCard
            index={1}
            icon={BarChart2}
            tag="Analytics"
            title="Live dashboards"
            description="Completion rates and score trends updating in real time — exportable for board reports."
          >
            <AnalyticsPreview />
          </FeatureCard>

          <FeatureCard
            index={2}
            icon={BookOpen}
            tag="Builder"
            title="Drag & drop course builder"
            description="Reorder modules and lessons instantly. Inline title editing, no extra saves, no IT required."
          >
            <DragDropPreview />
          </FeatureCard>

          <FeatureCard
            index={3}
            icon={GraduationCap}
            tag="Students"
            title="End-to-end student journey"
            description="From enrollment to certificate — automated, trackable, and distraction-free on any device."
            span={2}
          >
            <StudentJourneyPreview />
          </FeatureCard>
        </div>
      </div>
    </section>
  )
}
