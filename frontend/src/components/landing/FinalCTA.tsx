'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

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
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      whileTap={{ scale: 0.97 }}
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  )
}

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32 px-6 bg-zinc-950">
      {/* Subtle texture */}
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.04]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Get started today
          </p>
          <h2 className="font-black tracking-[-0.04em] text-white" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 0.95 }}>
            Your university
            <br />
            <span className="text-zinc-500">deserves better.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-md text-zinc-400 leading-relaxed">
            Replace your legacy LMS with a platform your faculty will adopt, your students will engage with, and your leadership can report on.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <MagneticButton
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 transition-colors duration-200"
            >
              Request a demo
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </MagneticButton>
            <Link
              href="/login"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Already have an account? Sign in →
            </Link>
          </div>

          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-8 text-xs text-zinc-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {['No credit card required', 'Free plan forever', 'Cancel anytime', 'SOC2 compliant'].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-emerald-500" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
