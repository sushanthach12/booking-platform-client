import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import CategoryPropertyListTemplate from "@/components/property/templates/category-property-list";
import { FeaturedDestinations } from "@/components/sections/featured-destinations";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustBar } from "@/components/sections/trust-bar";
import { HeroSearchBar } from "@/components/shared/hero-search-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function PropertyListSkeleton() {
  return (
    <div className="py-10 px-6 lg:px-10 bg-white">
      <div className="max-w-[1240px] mx-auto">
        <Skeleton className="h-6 w-40 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-1">
        {/* 1. Hero */}
        <HeroSection />

        {/* Search bar */}
        <div className="relative z-20 px-6 lg:px-10 py-6 lg:py-8 bg-white">
          <div className="max-w-310 mx-auto">
            <HeroSearchBar />
          </div>
        </div>

        {/* 2. Popular destinations */}
        <div className="bg-white">
          <FeaturedDestinations />
        </div>

        {/* 4. Property listings by category — async RSC, streamed with skeleton */}
        <div className="border-t border-border">
          <Suspense fallback={<PropertyListSkeleton />}>
            <CategoryPropertyListTemplate />
          </Suspense>
        </div>

        {/* 5. Host CTA — dark blue gradient section */}
        {/* <CtaBanner /> */}

        {/* 6. Trust bar */}
        <TrustBar />
      </main>
      <Footer />
    </div>
  );
}
