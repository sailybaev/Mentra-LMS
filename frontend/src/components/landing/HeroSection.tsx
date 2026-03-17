'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, BookOpen, CheckCircle2, BarChart2, Sparkles, Users } from 'lucide-react'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function MagneticButton({ href, children, className }: { href: string; children: React.ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 280, damping: 22 })
  const sy = useSpring(y, { stiffness: 280, damping: 22 })
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.25)
        y.set((e.clientY - r.top - r.height / 2) * 0.25)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileTap={{ scale: 0.97 }}
    >
      <Link href={href} className={className}>{children}</Link>
    </motion.div>
  )
}

/* Live course UI mockup */
function ProductMockup() {
  const modules = [
    { title: 'Module 1 — Foundations', lessons: 4, complete: 4 },
    { title: 'Module 2 — Core Concepts', lessons: 6, complete: 3 },
    { title: 'Module 3 — Applied Practice', lessons: 5, complete: 0 },
  ]
  const students = [
    { initials: 'AK', score: 94, status: 'Passed' },
    { initials: 'ML', score: 87, status: 'Passed' },
    { initials: 'JB', score: 72, status: 'In Progress' },
    { initials: 'RS', score: null, status: 'Not started' },
  ]

  return (
    <div className="rounded-2xl overflow-hidden border border-[#E2E0DB] bg-white shadow-[0_2px_40px_rgba(0,0,0,0.07)]">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#F0EFEB] bg-[#FAFAF8]">
        <div className="h-2.5 w-2.5 rounded-full bg-[#E8E7E3]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#E8E7E3]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#E8E7E3]" />
        <div className="ml-3 flex-1 h-5 rounded-md bg-[#F0EFEB] max-w-[200px]" />
      </div>

      <div className="grid grid-cols-[1fr_1px_1fr] min-h-[340px]">
        {/* Left: Course content */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[12px] font-semibold text-[#111110] tracking-tight">Introduction to ML</p>
              <p className="text-[11px] text-[#9B9B97] mt-0.5">142 students enrolled</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-700">Published</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-[#9B9B97]">Overall progress</span>
              <span className="text-[11px] font-semibold text-[#111110]">58%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#F0EFEB] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: '58%' }}
                transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-1.5">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-2.5 rounded-xl border border-[#F0EFEB] bg-[#FAFAF8] px-3 py-2"
              >
                <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${
                  mod.complete === mod.lessons ? 'bg-emerald-500' : 'bg-[#F0EFEB]'
                }`}>
                  {mod.complete === mod.lessons
                    ? <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    : <BookOpen className="h-3 w-3 text-[#9B9B97]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-[#111110] truncate">{mod.title}</p>
                </div>
                <span className="text-[10px] text-[#9B9B97] shrink-0">{mod.complete}/{mod.lessons}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="bg-[#F0EFEB]" />

        {/* Right: Student grades */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[12px] font-semibold text-[#111110] tracking-tight">Recent grades</p>
            <div className="flex items-center gap-1">
              <BarChart2 className="h-3 w-3 text-[#9B9B97]" />
              <span className="text-[10px] text-[#9B9B97]">AI-graded</span>
            </div>
          </div>

          <div className="space-y-1.5">
            {students.map((s, i) => (
              <motion.div
                key={s.initials}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-2.5 rounded-xl border border-[#F0EFEB] px-3 py-2"
              >
                <div className="h-6 w-6 rounded-full bg-[#111110] flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-white">{s.initials}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#111110]">{s.status}</span>
                    {s.score !== null && (
                      <span className={`text-[11px] font-bold ${s.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {s.score}%
                      </span>
                    )}
                  </div>
                  {s.score !== null && (
                    <div className="mt-1 h-1 rounded-full bg-[#F0EFEB] overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${s.score >= 80 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${s.score}%` }}
                        transition={{ delay: 0.9 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI insight */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="mt-3 flex items-start gap-2 rounded-xl bg-[#F0FDF4] border border-emerald-100 px-3 py-2.5"
          >
            <Sparkles className="h-3 w-3 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-[10px] text-emerald-700 leading-relaxed">
              <span className="font-semibold">AI Insight:</span> Module 2 has a 34% drop-off rate — suggest adding a review quiz.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#FAFAF8] border-t border-[#F0EFEB]">
        <div className="flex items-center gap-3">
          {[
            { Icon: Users, label: '142 students' },
            { Icon: CheckCircle2, label: '83% avg completion' },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon className="h-3 w-3 text-[#9B9B97]" />
              <span className="text-[11px] text-[#6B6B67]">{label}</span>
            </div>
          ))}
        </div>
        <motion.div
          className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 cursor-pointer"
          whileHover={{ scale: 1.03 }}
        >
          <span className="text-[10px] font-semibold text-white">View gradebook</span>
        </motion.div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative pt-[60px] overflow-hidden">
      {/* Subtle grid bg */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(17,17,16,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Fade top gradient */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FAFAF8] to-transparent z-10" />

      <div className="relative z-10 mx-auto max-w-[1120px] px-8 pt-20 pb-16">
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center text-center">

          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E7E3] bg-white px-4 py-1.5 text-[12px] font-medium text-[#6B6B67]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Built for universities &amp; academies
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="max-w-[780px] text-[#111110] leading-[1.0] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(48px, 6.5vw, 82px)' }}
          >
            The LMS your students{' '}
            <span
              className="text-[#111110]"
              style={{
                fontFamily: 'var(--font-display), Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              actually open.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[440px] text-[17px] text-[#6B6B67] leading-[1.65] tracking-[-0.01em]"
          >
            The modern learning platform your faculty will adopt, your students will engage with, and your leadership can report on.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-9 flex flex-col sm:flex-row gap-3 items-center">
            <MagneticButton
              href="/register"
              className="group relative overflow-hidden inline-flex items-center gap-2 rounded-[12px] bg-[#111110] px-7 py-3.5 text-[14px] font-semibold text-white hover:bg-[#2A2A28] transition-colors duration-200"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent group-hover:translate-x-[250%] transition-transform duration-700 ease-in-out" />
              Request a demo
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </MagneticButton>
            <MagneticButton
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-[12px] border border-[#E2E0DB] bg-white px-7 py-3.5 text-[14px] font-medium text-[#6B6B67] hover:text-[#111110] hover:border-[#C8C6C1] transition-all duration-200"
            >
              See pricing
            </MagneticButton>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-1.5"
          >
            {['No credit card', '14-day free trial', 'Cancel anytime'].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-[12px] text-[#9B9B97]">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Product mockup */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
          >
            <ProductMockup />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
