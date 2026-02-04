import { AppLayout } from "@/components/layout";
import { HeroSection } from "@/components/sections/hero-section";
import PropertyListingTemplate from "@/components/property/templates/property-list";

export default async function Home() {
  return (
    <AppLayout variant="home">
      <HeroSection />
      <PropertyListingTemplate />
    </AppLayout>
  );
}
