import { AppLayout } from "@/components/layout";
import { HeroSection } from "@/components/sections/hero-section";
import CategoryPropertyListTemplate from "@/components/property/templates/category-property-list";

export default async function Home() {
  return (
    <AppLayout variant="home">
      <HeroSection />
      <CategoryPropertyListTemplate />
    </AppLayout>
  );
}
