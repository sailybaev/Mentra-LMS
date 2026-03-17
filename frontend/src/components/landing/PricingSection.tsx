'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const tiers = [
  {
    name: 'Starter',
    monthlyPrice: '$0',
    annualPrice: '$0',
    billing: 'forever free',
    description: 'Perfect for pilots and small departments.',
    features: ['Up to 3 courses', '10 students', 'AI quiz generator', 'Basic analytics'],
    cta: 'Start free',
    href: '/register',
    featured: false,
  },
  {
    name: 'Pro',
    monthlyPrice: '$49',
    annualPrice: '$39',
    billing: 'per month',
    annualBilling: 'per month, billed annually',
    savings: 'Save $120/yr',
    description: 'For growing institutions at scale.',
    features: ['Unlimited courses', '200 students', 'AI insights & summaries', 'Advanced analytics', 'Priority support'],
    cta: 'Start free trial',
    href: '/register',
    featured: true,
  },
  {
    name: 'Enterprise',
    monthlyPrice: 'Custom',
    annualPrice: 'Custom',
    billing: 'tailored pricing',
    description: 'For large universities with custom needs.',
    features: ['Unlimited everything', 'SSO / SAML', 'Custom integrations', 'Dedicated SLA', 'White-label option'],
    cta: 'Contact us',
    href: '/register',
    featured: false,
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-28 bg-white border-y border-[#E8E7E3]">
      <div className="mx-auto max-w-[1120px] px-8">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C8C6C1]">Pricing</p>
          <h2 className="text-[#111110] tracking-[-0.04em] leading-[1.05]" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
            Simple,{' '}
            <span
              style={{
                fontFamily: 'var(--font-display), Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              transparent
            </span>{' '}
            pricing.
          </h2>
          <p className="mt-3 text-[14px] text-[#9B9B97]">No surprises. Cancel or upgrade anytime.</p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-[#E8E7E3] bg-[#FAFAF8] p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                !annual ? 'bg-[#111110] text-white shadow-sm' : 'text-[#6B6B67] hover:text-[#111110]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                annual ? 'bg-[#111110] text-white shadow-sm' : 'text-[#6B6B67] hover:text-[#111110]'
              }`}
            >
              Annual
              <AnimatePresence>
                {!annual && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -right-1 -top-2.5 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white"
                  >
                    −20%
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl p-6 flex flex-col ${
                tier.featured
                  ? 'bg-[#111110] shadow-2xl shadow-black/10'
                  : 'border border-[#E8E7E3] bg-white'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-white px-3 py-0.5 text-[11px] font-semibold text-[#111110] shadow-sm">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={`text-[13px] font-semibold ${tier.featured ? 'text-[#9B9B97]' : 'text-[#6B6B67]'}`}>
                  {tier.name}
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={annual ? 'annual' : 'monthly'}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className={`text-4xl font-black tracking-[-0.04em] ${tier.featured ? 'text-white' : 'text-[#111110]'}`}
                    >
                      {annual ? tier.annualPrice : tier.monthlyPrice}
                    </motion.span>
                  </AnimatePresence>
                  <span className={`text-[13px] ${tier.featured ? 'text-[#6B6B67]' : 'text-[#9B9B97]'}`}>
                    / {annual && tier.annualBilling ? tier.annualBilling : tier.billing}
                  </span>
                </div>
                {annual && tier.savings && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white"
                  >
                    {tier.savings}
                  </motion.span>
                )}
                <p className={`mt-2 text-[13px] leading-relaxed ${tier.featured ? 'text-[#6B6B67]' : 'text-[#9B9B97]'}`}>
                  {tier.description}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                      tier.featured ? 'bg-white/10' : 'bg-[#F0EFEB]'
                    }`}>
                      <Check className={`h-2.5 w-2.5 ${tier.featured ? 'text-white' : 'text-[#6B6B67]'}`} />
                    </div>
                    <span className={`text-[13px] ${tier.featured ? 'text-[#C8C6C1]' : 'text-[#6B6B67]'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={tier.href}
                  className={`group relative overflow-hidden flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-semibold transition-colors duration-200 ${
                    tier.featured
                      ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                      : 'border border-[#E8E7E3] text-[#6B6B67] hover:border-[#C8C6C1] hover:text-[#111110] hover:bg-[#FAFAF8]'
                  }`}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent group-hover:translate-x-[250%] transition-transform duration-600 ease-in-out" />
                  {tier.cta}
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-8 text-center text-[13px] text-[#9B9B97]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  )
}
