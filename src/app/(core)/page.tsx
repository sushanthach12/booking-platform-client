import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { FeaturedDestinations } from "@/components/sections/featured-destinations";
import { ForHostsSection } from "@/components/sections/for-hosts";
import { HeroSection } from "@/components/sections/hero-section";
import { NearYouSection } from "@/components/sections/near-you";
import { getPropertyUseCase } from "@/domain/di";
import { getForwardedHeaders } from "@/lib/utils/forwarded-headers";

/** Default location for the "stays near …" rail until the guest picks another. */
const DEFAULT_LOCATION = "Mumbai";

// Render per-request, never at build time. The homepage data is fetched server
// side from the live API; prerendering at build froze empty rails into static
// HTML whenever the API was unreachable during `next build` (deploy showed no
// data while client-side calls — which use the same baked URL — worked fine).
export const dynamic = "force-dynamic";

export default async function Home() {
  // Single server-side fetch for the whole homepage, biased to the default
  // location so the nearby rail matches its label on first paint. The use case
  // degrades to empty rails on failure; each section falls back to editorial
  // defaults.
  const home = await getPropertyUseCase().getHomeData(
    DEFAULT_LOCATION,
    await getForwardedHeaders(),
  );
  const cities = home.destinations.map((d) => d.city);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 1. Header */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero — includes inline search bar + featured-property stack */}
        <HeroSection featured={home.featured} />

        {/* 3. Destinations bento */}
        <FeaturedDestinations destinations={home.destinations} />

        {/* 4. Near you */}
        <NearYouSection
          properties={home.nearby}
          cities={cities}
          defaultLocation={DEFAULT_LOCATION}
        />

        {/* 5. For hosts */}
        <ForHostsSection />
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
