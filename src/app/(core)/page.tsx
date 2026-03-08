import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import CategoryPropertyListTemplate from "@/components/property/templates/category-property-list";
import { CtaBanner } from "@/components/sections/cta-banner";
import { FeaturedDestinations } from "@/components/sections/featured-destinations";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustBar } from "@/components/sections/trust-bar";
import { WhyUsSection } from "@/components/sections/why-us-section";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* 1. Full-screen cinematic hero with floating search */}
        <HeroSection />

        {/* 2. Four trust-signal icons */}
        <TrustBar />

        {/* 3. Bento-grid popular destinations */}
        <FeaturedDestinations />

        {/* 4. Category property sliders (existing) */}
        <CategoryPropertyListTemplate />

        {/* 5. Dark "why us" feature grid */}
        <WhyUsSection />

        {/* 6. Gradient CTA banner */}
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
