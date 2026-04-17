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
    name: "Santorini",
    country: "Greece",
    properties: "240+",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bali",
    country: "Indonesia",
    properties: "510+",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Kyoto",
    country: "Japan",
    properties: "180+",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Amalfi Coast",
    country: "Italy",
    properties: "320+",
    image:
      "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Maldives",
    country: "Indian Ocean",
    properties: "95+",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Barcelona",
    country: "Spain",
    properties: "430+",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=400&q=80",
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
