'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState } from 'react'

export function LandingNav() {
  const { scrollY } = useScroll()
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1])
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  // const links = [
  //   { href: '#features', label: 'Features' },
  //   { href: '#pricing', label: 'Pricing' },
  // ]

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-white/90 backdrop-blur-xl" />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-zinc-200"
        style={{ opacity: borderOpacity }}
      />
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-white text-xs font-bold transition-opacity duration-200 group-hover:opacity-80">
            M
          </div>
          <span className="font-semibold text-zinc-950 tracking-tight">Mentra</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-0.5">
          {/* {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onMouseEnter={() => setHoveredLink(href)}
              onMouseLeave={() => setHoveredLink(null)}
              className="relative px-3.5 py-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 rounded-md"
            >
              {hoveredLink === href && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-md bg-zinc-100"
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                />
              )}
              <span className="relative">{label}</span>
            </Link>
          ))} */}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <Link
            href="/register"
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors duration-200"
          >
            Get started
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
