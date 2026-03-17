'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: "We replaced three separate tools with Mentra. The AI quiz generator alone saves our teachers 4 hours a week. The analytics are exactly what we needed.",
    author: "Sarah Chen",
    role: "Head of Learning & Development",
    org: "TechCorp Academy",
    avatar: "#6366f1",
    initials: "SC",
    stars: 5,
  },
  {
    quote: "The drag-and-drop builder is genuinely the best I've used. We rebuilt our entire onboarding curriculum in an afternoon. Students love the clean experience.",
    author: "Marcus Williams",
    role: "Training Director",
    org: "Apex Institute",
    avatar: "#10b981",
    initials: "MW",
    stars: 5,
  },
  {
    quote: "Switched from a legacy LMS. Setup took 30 minutes. Multi-tenant isolation means our enterprise clients feel safe. The speed is unreal.",
    author: "Priya Nair",
    role: "EdTech Lead",
    org: "EduScale Corp",
    avatar: "#8b5cf6",
    initials: "PN",
    stars: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-indigo-500">Testimonials</p>
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Trusted by educators{' '}
            <span className="text-zinc-300">worldwide</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group relative flex flex-col rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-lg hover:shadow-zinc-100 transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, j) => (
                  <svg key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1 text-sm text-zinc-600 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold shadow-sm"
                  style={{ backgroundColor: t.avatar }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{t.author}</p>
                  <p className="text-xs text-zinc-400">{t.role} · {t.org}</p>
                </div>
              </div>

              {/* Subtle gradient on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
