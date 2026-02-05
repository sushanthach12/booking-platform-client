import { Header } from "@/components/header";
import { HeroSection } from "@/components/sections/hero-section";
import CategoryPropertyListTemplate from "@/components/property/templates/category-property-list";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoryPropertyListTemplate />
      </main>
    </div>
  );
}
