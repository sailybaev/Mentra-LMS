'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Sparkles, BookOpen, BarChart2, CheckCircle } from 'lucide-react'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

function MagneticButton({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 250, damping: 20 })
  const springY = useSpring(y, { stiffness: 250, damping: 20 })

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const rect = ref.current!.getBoundingClientRect()
        x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
        y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileTap={{ scale: 0.97 }}
    >
      <Link href={href} className={className}>{children}</Link>
    </motion.div>
  )
}

/* ─── Left dark panel ─────────────────────────────────────────── */
function AIPanel() {
  const quizLines = [
    'What is gradient descent?',
    'Which optimizer converges fastest?',
    'Define overfitting in 1 sentence.',
  ]

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-white/60" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">AI Quiz Generator</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
          Live
        </span>
      </div>

      <div className="flex-1 space-y-2">
        {quizLines.map((line, i) => (
          <motion.div
            key={line}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-2.5 rounded-xl bg-white/[0.06] px-3.5 py-2.5"
          >
            <CheckCircle className="h-3.5 w-3.5 text-white/40 mt-0.5 shrink-0" />
            <span className="text-sm text-white/80 leading-snug">{line}</span>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex items-center gap-1.5 px-3.5 py-2"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1 w-1 rounded-full bg-white/30"
                animate={{ opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="text-xs text-white/30">Generating question 4…</span>
        </motion.div>
      </div>

      <div className="border-t border-white/15 pt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-black text-white tracking-tight">2.1s</p>
          <p className="text-xs text-white/50 mt-0.5">avg generation</p>
        </div>
        <div>
          <p className="text-2xl font-black text-white tracking-tight">94%</p>
          <p className="text-xs text-white/50 mt-0.5">avg score</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Right light panel ───────────────────────────────────────── */
function DashboardPanel() {
  const courses = [
    { title: 'Introduction to ML', students: 142, status: 'published' },
    { title: 'Web Development 101', students: 89, status: 'published' },
    { title: 'Data Structures', students: 0, status: 'draft' },
  ]
  const bars = [38, 55, 44, 71, 60, 84, 76]

  return (
    <div className="flex flex-col gap-5 h-full" style={{ fontSize: 11 }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-zinc-900" style={{ fontSize: 13 }}>Courses</p>
          <p className="text-zinc-400 mt-0.5">231 students enrolled</p>
        </div>
        <div className="rounded-lg bg-zinc-950 px-3 py-1.5 text-[10px] text-white font-semibold cursor-default">
          + New course
        </div>
      </div>

      {/* Course rows */}
      <div className="flex-1 space-y-1.5">
        {courses.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between rounded-xl border border-zinc-100 bg-white px-3 py-2.5 hover:border-zinc-200 transition-colors cursor-default"
          >
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-zinc-100 flex items-center justify-center shrink-0">
                <BookOpen className="h-3 w-3 text-zinc-400" />
              </div>
              <span className="font-medium text-zinc-700">{c.title}</span>
            </div>
            <div className="flex items-center gap-3">
              {c.students > 0 && <span className="text-zinc-400">{c.students} students</span>}
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                c.status === 'published' ? 'bg-zinc-100 text-zinc-500' : 'bg-zinc-50 text-zinc-300'
              }`}>
                {c.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mini analytics bar */}
      <div className="border-t border-zinc-100 pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <BarChart2 className="h-3 w-3 text-zinc-400" />
            <span className="text-zinc-500 font-medium">Completion rate</span>
          </div>
          <span className="font-semibold text-zinc-900">↑ 12% this week</span>
        </div>
        <div className="flex items-end gap-1 h-8">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm bg-zinc-900"
              style={{ height: `${h}%`, opacity: 0.1 + i * 0.13 }}
              initial={{ scaleY: 0, originY: '100%' }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.9 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Hero ────────────────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section className="relative pt-14 overflow-hidden bg-white">
      {/* Top content — centered */}
      <div className="mx-auto max-w-3xl px-6 pt-20 pb-10 text-center">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="mb-7 inline-flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-500">
              Learning management for universities
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-extrabold text-zinc-950 leading-[1.0] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(44px, 6vw, 72px)' }}
          >
            For universities that take
            <br />
            learning seriously.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-sm text-[17px] text-zinc-500 leading-relaxed"
          >
            The modern LMS your faculty will adopt, your students will open, and your office can report on.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <MagneticButton
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors duration-200"
            >
              Request a demo
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </MagneticButton>
            <MagneticButton
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-7 py-3.5 text-sm font-medium text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 transition-all duration-200"
            >
              See pricing
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Product preview container */}
      <motion.div
        className="mx-auto max-w-6xl px-6 pb-0"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="overflow-hidden rounded-t-3xl border border-b-0 border-zinc-200 grid grid-cols-1 md:grid-cols-[2fr_3fr]" style={{ minHeight: 360 }}>
          {/* Left — accent AI panel */}
          <div className="bg-emerald-600 p-8 flex flex-col">
            <AIPanel />
          </div>
          {/* Right — light dashboard panel */}
          <div className="bg-zinc-50 border-t md:border-t-0 md:border-l border-zinc-200 p-8 flex flex-col">
            <DashboardPanel />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
