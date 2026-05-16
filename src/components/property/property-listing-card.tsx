"use client";

import { Heart, ImageDown, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { PropertyEntity } from "@/domain/entities";
import { useWishlistToggle } from "@/domain/hooks/use-wishlist-toggle";
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
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: p.currency || "INR",
    maximumFractionDigits: 0,
  }).format(Math.floor(p.amount));
  return {
    amount: formatted,
    unit: ` / ${p.frequency}`,
  };
}

export function PropertyListingCard({
  property,
  queryString,
  className,
}: PropertyListingCardProps) {
  const imageUrl = property.images[0];
  const location = [property.location.city, property.location.state]
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

  const { wishlisted, loading: wishlistLoading, toggle, isAuthed } = useWishlistToggle(property.id, property.isWishlisted ?? false);

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

        {/* Wishlist button — only for authenticated users */}
        {isAuthed && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={wishlistLoading}
            className={cn(
              "absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all",
              wishlisted ? "text-rose-500" : "text-foreground hover:text-primary",
            )}
            aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            onClick={toggle}
          >
            <Heart className={cn("size-3.5", wishlisted && "fill-rose-500")} />
          </Button>
        )}
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
