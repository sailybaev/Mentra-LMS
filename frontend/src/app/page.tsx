import { Instrument_Serif, DM_Sans } from 'next/font/google'
import { LandingNav } from '@/components/landing/LandingNav'
import { HeroSection } from '@/components/landing/HeroSection'
import { SocialProof } from '@/components/landing/SocialProof'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { LandingFooter } from '@/components/landing/LandingFooter'

const displayFont = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const sansFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-landing',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export default function LandingPage() {
  return (
    <div
      className={`min-h-screen bg-[#FAFAF8] overflow-x-hidden ${displayFont.variable} ${sansFont.variable}`}
      style={{ fontFamily: 'var(--font-landing), system-ui, sans-serif' }}
    >
      <LandingNav />
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <PricingSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  )
}
