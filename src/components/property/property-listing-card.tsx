"use client";

import { Heart, ImageDown, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { PropertyEntity } from "@/domain/entities";
import { cn } from "@/lib/utils";

interface PropertyListingCardProps {
  property: PropertyEntity;
  queryString?: string;
  className?: string;
}

function formatPriceParts(p: PropertyEntity["pricing"]): {
  amount: string;
  unit: string;
} {
  return {
    amount: `₹${Math.floor(p.amount).toLocaleString("en-IN")}`,
    unit: ` / ${p.frequency}`,
  };
}

export function PropertyListingCard({
  property,
  queryString,
  className,
}: PropertyListingCardProps) {
  const imageUrl = property.images[0];
  const location = [
    property.location.city,
    property.location.state,
    property.location.country,
  ]
    .filter(Boolean)
    .join(", ");
  const rating = property.stats?.rating ?? 0;
  const { amount: priceAmount, unit: priceUnit } = formatPriceParts(
    property.pricing,
  );

  const queryParts = [
    queryString,
    `title=${encodeURIComponent(property.title)}`,
  ].filter(Boolean);
  const href = `/properties/${property.id}?${queryParts.join("&")}`;

  return (
    <Link
      href={href}
      className={cn("block group cursor-pointer", className)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* Image */}
      <div className="aspect-4/3 bg-muted rounded-2xl mb-3 overflow-hidden relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted text-muted-subtle">
            <ImageDown className="size-8" />
          </div>
        )}

        {/* Subtle gradient at bottom for legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Favourite button */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white text-foreground hover:text-primary shadow-sm transition-all"
          aria-label="Save to wishlist"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="size-3.5" />
        </Button>
      </div>

      {/* Meta */}
      <div className="px-0.5">
        <div className="flex items-start justify-between gap-3 mb-0.5">
          <p className="font-semibold text-foreground text-sm leading-snug truncate">
            {location}
          </p>
          {rating > 0 && (
            <div className="flex items-center gap-1 shrink-0 mt-px">
              <Star className="size-3 fill-warm-accent text-warm-accent" />
              <span className="text-sm font-medium text-foreground tabular-nums">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-sm truncate mb-2">
          {property.title}
        </p>

        <p className="text-foreground font-semibold text-sm">
          {priceAmount}
          <span className="font-normal text-muted-foreground text-xs">
            {priceUnit}
          </span>
        </p>
      </div>
    </Link>
  );
}
