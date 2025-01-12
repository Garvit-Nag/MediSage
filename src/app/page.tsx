// app/page.tsx
import Navbar from '@/components/navbar'
import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/features-section'

import Footer from '@/components/footer'

import { WhyChooseUs } from '@/components/why-choose-us'
import HowItWorks from '@/components/how-it-works'
import FAQ from '@/components/faq'
import { TestimonialsSection } from '@/components/testimonials-section'
import PricingSection from '@/components/pricing'


export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <WhyChooseUs />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQ />
      <PricingSection />
      <Footer />
    </main>
  )
}