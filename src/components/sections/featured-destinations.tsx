// ─────────────────────────────────────────────────────────────────
// components/sections/featured-destinations.tsx
// Server component — no 'use client' needed
// ─────────────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DESTINATIONS = [
  {
    name: "Goa",
    country: "India",
    properties: "620+",
    image:
      "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Jaipur",
    country: "Rajasthan",
    properties: "380+",
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Kerala",
    country: "South India",
    properties: "510+",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Manali",
    country: "Himachal Pradesh",
    properties: "290+",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Ladakh",
    country: "Jammu & Kashmir",
    properties: "175+",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Andaman",
    country: "Island Territory",
    properties: "140+",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
] as const;

export function FeaturedDestinations() {
  return (
    <section className="py-10 px-6 lg:px-10 bg-white border-b border-border">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1.5">
              Top destinations
            </p>
            <h2 className="text-lg font-semibold text-foreground">
              Popular destinations
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-primary hover:text-primary-dark hover:bg-primary-subtle gap-1 font-semibold"
          >
            <Link href="/search">
              View all <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {/* Horizontal scroll on mobile, equal columns on desktop */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-6 lg:overflow-visible snap-x snap-mandatory">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.name}
              href={`/search?location=${encodeURIComponent(dest.name)}`}
              className="group relative shrink-0 w-32 lg:w-auto rounded-xl overflow-hidden snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div className="relative aspect-3/4">
                <Image
                  src={dest.image}
                  alt={`${dest.name}, ${dest.country}`}
                  fill
                  sizes="(max-width: 1024px) 128px, calc((100vw - 10rem) / 6)"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-2.5">
                  <p className="text-white font-bold text-xs leading-tight">
                    {dest.name}
                  </p>
                  <p className="text-white/60 text-[10px]">
                    {dest.properties} stays
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
