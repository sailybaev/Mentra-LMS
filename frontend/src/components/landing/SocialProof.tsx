'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1400
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + increment, target)
      setCount(Math.round(current))
      if (current >= target) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const logos = [
  'Kazakh National University', 'KBTU', 'Nazarbayev University', 'Al-Farabi University',
  'KIMEP', 'Satbayev University', 'EduForward', 'BrightPath Academy',
  'Kazakh National University', 'KBTU', 'Nazarbayev University', 'Al-Farabi University',
  'KIMEP', 'Satbayev University', 'EduForward', 'BrightPath Academy',
]

const stats = [
  { value: 12000, suffix: '+', label: 'Students learning' },
  { value: 98, suffix: '%', label: 'Satisfaction rate' },
  { value: 3400, suffix: '+', label: 'AI quizzes generated' },
  { value: 500, suffix: '+', label: 'Active educators' },
]

export function SocialProof() {
  return (
    <section className="border-y border-zinc-100 py-16 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 mb-14">
          {stats.map(({ value, suffix, label }, i) => (
            <motion.div
              key={label}
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-3xl font-black tracking-[-0.03em] text-zinc-950">
                <AnimatedNumber target={value} suffix={suffix} />
              </div>
              <div className="mt-1.5 text-xs text-zinc-400 font-medium">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Logo strip */}
        <div className="relative">
          <p className="mb-6 text-center text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
            Trusted by forward-thinking institutions
          </p>
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="overflow-hidden">
            <div className="marquee-track flex gap-12 w-max">
              {logos.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-zinc-400 transition-colors whitespace-nowrap cursor-default"
                >
                  <div className="h-3.5 w-3.5 rounded bg-zinc-200 shrink-0" />
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
