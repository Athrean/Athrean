import {
  LandingNavbar,
  LandingHero,
  FeaturesGrid,
  ProductShowcase,
  DemoSection,
  FaqSection,
  CtaSection,
  LandingFooter,
} from "@/components/landing"

export default function LandingPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <LandingNavbar />
      <main>
        <LandingHero />
        <FeaturesGrid />
        <ProductShowcase />
        <DemoSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
