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
    <section className="relative overflow-hidden py-32 bg-[#111110]">
      {/* Dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(5,150,105,0.08), transparent)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1120px] px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4A4A47]">
            Get started today
          </p>
          <h2
            className="text-white tracking-[-0.04em] leading-[0.95]"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
          >
            Your university
            <br />
            <span
              style={{
                fontFamily: 'var(--font-display), Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                color: '#6B6B67',
              }}
            >
              deserves better.
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-md text-[15px] text-[#6B6B67] leading-relaxed">
            Replace your legacy LMS with a platform your faculty will adopt, your students will engage with, and your leadership can report on.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="relative">
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-[14px] border border-white/20"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-[14px] border border-white/10"
                animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              />
              <MagneticButton
                href="/register"
                className="group relative overflow-hidden inline-flex items-center gap-2 rounded-[12px] bg-white px-8 py-3.5 text-[14px] font-semibold text-[#111110] hover:bg-[#F0EFEB] transition-colors duration-200"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-black/[0.04] to-transparent group-hover:translate-x-[250%] transition-transform duration-700 ease-in-out" />
                Request a demo
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </MagneticButton>
            </div>
            <motion.div whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Link
                href="/login"
                className="text-[14px] text-[#4A4A47] hover:text-white transition-colors"
              >
                Already have an account? Sign in →
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-8 text-[12px] text-[#4A4A47]"
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
