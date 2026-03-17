'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function LandingNav() {
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 60], [0, 1])
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 1])

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: bgOpacity,
          backgroundColor: 'rgba(250,250,248,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-[#E8E7E3]"
        style={{ opacity: borderOpacity }}
      />

      <div className="relative mx-auto flex h-[60px] max-w-[1120px] items-center justify-between px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            className="h-7 w-7 rounded-[8px] bg-[#111110] flex items-center justify-center shrink-0"
            whileHover={{ scale: 1.1, rotate: -6 }}
            transition={{ type: 'spring', stiffness: 500, damping: 14 }}
          >
            <span className="text-white text-[11px] font-bold tracking-tight">M</span>
          </motion.div>
          <span className="text-[15px] font-semibold text-[#111110] tracking-[-0.02em] transition-opacity duration-150 group-hover:opacity-70">
            Mentra
          </span>
        </Link>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <motion.div whileTap={{ scale: 0.96 }}>
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-1.5 text-[14px] font-medium text-[#6B6B67] hover:text-[#111110] transition-colors duration-150 rounded-lg hover:bg-[#111110]/[0.04]"
            >
              Sign in
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/register"
              className="group/cta relative overflow-hidden inline-flex items-center gap-1.5 rounded-[10px] bg-[#111110] px-4 py-[7px] text-[14px] font-medium text-white hover:bg-[#2A2A28] transition-colors duration-150"
            >
              {/* Shimmer */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent group-hover/cta:translate-x-[250%] transition-transform duration-600 ease-in-out" />
              Get started
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
