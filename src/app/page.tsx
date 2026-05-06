import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { ProblemSection } from '@/components/landing/problem-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { PricingSection } from '@/components/landing/pricing-section'
import { FaqSection } from '@/components/landing/faq-section'
import { CtaSection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'
import { UrgencyBanner } from '@/components/landing/urgency-banner'
import { FeedbackButton } from '@/components/landing/feedback-button'

export default function Home() {
  return (
    <div style={{ backgroundColor: '#FAFAF8' }}>
      <UrgencyBanner />
      <Navbar />
      <Hero />
      <TestimonialsSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
      <FeedbackButton />
    </div>
  )
}
