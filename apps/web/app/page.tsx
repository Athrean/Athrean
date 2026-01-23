import {
  LandingNavbar,
  LandingHero,
  FeaturesSection,
  DemoSection,
  FaqSection,
  LandingFooter,
} from "@/components/landing"

export default function LandingPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <LandingNavbar />
      <main>
        {/* Sticky Hero Section (The "Window") */}
        <div className="sticky top-0 h-screen z-0">
          <LandingHero />
        </div>

        {/* Features Curtain (Slides UP over the Hero) */}
        <div className="relative z-10 bg-zinc-950">
          <FeaturesSection />
          <DemoSection />
          <FaqSection />
          <LandingFooter />
        </div>
      </main>
    </div>
  )
}
