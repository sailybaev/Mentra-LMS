'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
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
    <section id="pricing" className="py-28 px-6 bg-zinc-50/50">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Pricing</p>
          <h2 className="text-4xl font-black tracking-[-0.03em] text-zinc-950 sm:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-zinc-400">No surprises. Cancel or upgrade anytime.</p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                !annual ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                annual ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Annual
              <AnimatePresence>
                {!annual && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -right-1 -top-2.5 rounded-full bg-zinc-950 px-1.5 py-0.5 text-[9px] font-bold text-white"
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
                  ? 'bg-zinc-950 shadow-2xl shadow-zinc-900/20'
                  : 'border border-zinc-200 bg-white shadow-sm'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-white px-3 py-0.5 text-[11px] font-semibold text-zinc-900 shadow-sm">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={`text-sm font-semibold ${tier.featured ? 'text-zinc-400' : 'text-zinc-500'}`}>
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
                      className={`text-4xl font-black tracking-[-0.03em] ${tier.featured ? 'text-white' : 'text-zinc-950'}`}
                    >
                      {annual ? tier.annualPrice : tier.monthlyPrice}
                    </motion.span>
                  </AnimatePresence>
                  <span className={`text-sm ${tier.featured ? 'text-zinc-500' : 'text-zinc-400'}`}>
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
                <p className={`mt-2 text-sm ${tier.featured ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {tier.description}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                      tier.featured ? 'bg-white/10' : 'bg-zinc-100'
                    }`}>
                      <Check className={`h-2.5 w-2.5 ${tier.featured ? 'text-white' : 'text-zinc-600'}`} />
                    </div>
                    <span className={`text-sm ${tier.featured ? 'text-zinc-300' : 'text-zinc-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-colors duration-200 ${
                  tier.featured
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                    : 'border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-8 text-center text-sm text-zinc-400"
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
