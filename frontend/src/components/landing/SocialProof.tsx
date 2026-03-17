'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const steps = 72
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

const stats = [
  { value: 12000, suffix: '+', label: 'Students learning', sub: 'across partner institutions' },
  { value: 98, suffix: '%', label: 'Satisfaction rate', sub: 'faculty & student surveys' },
  { value: 3400, suffix: '+', label: 'AI quizzes generated', sub: 'average score 91%' },
  { value: 500, suffix: '+', label: 'Active educators', sub: 'onboarded in under a day' },
]

const logos = [
  'Kazakh National University', 'KBTU', 'Nazarbayev University', 'Al-Farabi University',
  'KIMEP', 'Satbayev University', 'EduForward', 'BrightPath Academy',
  'Kazakh National University', 'KBTU', 'Nazarbayev University', 'Al-Farabi University',
  'KIMEP', 'Satbayev University', 'EduForward', 'BrightPath Academy',
]

export function SocialProof() {
  return (
    <section className="py-20 bg-white border-y border-[#E8E7E3]">
      <div className="mx-auto max-w-[1120px] px-8">

        <div className="grid grid-cols-2 gap-y-10 gap-x-8 sm:grid-cols-4 mb-16">
          {stats.map(({ value, suffix, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
            >
              <div className="text-[42px] font-bold text-[#111110] tracking-[-0.04em] leading-none tabular-nums">
                <AnimatedNumber target={value} suffix={suffix} />
              </div>
              <div className="mt-2.5 text-[13px] font-medium text-[#111110]">{label}</div>
              <div className="mt-0.5 text-[12px] text-[#9B9B97]">{sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="relative overflow-hidden">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C8C6C1]">
            Trusted by forward-thinking institutions
          </p>
          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
            <div className="overflow-hidden">
              <div className="marquee-track flex gap-10 w-max">
                {logos.map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[12px] font-medium text-[#C8C6C1] hover:text-[#9B9B97] transition-colors whitespace-nowrap cursor-default"
                  >
                    <div className="h-2.5 w-2.5 rounded bg-[#E8E7E3] shrink-0" />
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
