"use client";

import { FeaturedDestinations } from "@/components/sections/featured-destinations";
import { ForHostsSection } from "@/components/sections/for-hosts";
import { HeroSection } from "@/components/sections/hero-section";
import { useHomeData } from "@/components/sections/hooks/use-home-data";
import { NearYouSection } from "@/components/sections/near-you";
import { Loader2 } from "lucide-react";

/** Default location for the "stays near …" rail until the guest picks another. */
const DEFAULT_LOCATION = "Mumbai";

/** Centered loading rail shown while the homepage data is in flight. */
function SectionLoading() {
  return (
    <section className="bg-background">
      <div className="max-w-360 mx-auto px-6 lg:px-12 py-24 flex justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    </section>
  );
}

/**
 * Client-side homepage data composition. The hero text renders immediately for
 * fast first paint; the data-driven rails fill in once the browser fetch
 * resolves. The nearby rail mounts only after data arrives so it seeds its own
 * state from real properties (its hook reads the initial list once).
 */
export function HomeSections() {
  const { data, isLoading, error } = useHomeData(DEFAULT_LOCATION);
  const cities = data?.destinations.map((d) => d.city) ?? [];

  return (
    <>
      {/* Hero — text paints right away; polaroids fill in with the data. */}
      <HeroSection featured={data?.featured} />

      {isLoading && !data ? (
        <SectionLoading />
      ) : error && !data ? (
        <section className="bg-background">
          <div className="max-w-360 mx-auto px-6 lg:px-12 py-20 text-center text-muted-foreground">
            {error}
          </div>
        </section>
      ) : (
        <>
          <FeaturedDestinations destinations={data?.destinations} />
          <NearYouSection
            properties={data?.nearby}
            cities={cities}
            defaultLocation={DEFAULT_LOCATION}
          />
        </>
      )}

      {/* Static — always available. */}
      <ForHostsSection />
    </>
  );
}
