import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { FeaturedDestinations } from "@/components/sections/featured-destinations";
import { ForHostsSection } from "@/components/sections/for-hosts";
import { HeroSection } from "@/components/sections/hero-section";
import { NearYouSection } from "@/components/sections/near-you";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 1. Header */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero — includes inline search bar */}
        <HeroSection />

        {/* 3. Destinations bento */}
        <FeaturedDestinations />

        {/* 4. Near you */}
        <NearYouSection />

        {/* 5. For hosts */}
        <ForHostsSection />
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
