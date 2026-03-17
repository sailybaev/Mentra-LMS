import { LandingNav } from '@/components/landing/LandingNav'
import { HeroSection } from '@/components/landing/HeroSection'
import { SocialProof } from '@/components/landing/SocialProof'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[#FAFAF8] overflow-x-hidden"
      style={{ fontFamily: 'system-ui, sans-serif' }}
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
