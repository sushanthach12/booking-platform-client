"use client";

import { Heart, ImageDown, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { PropertyEntity } from "@/domain/entities";
import { cn } from "@/lib/utils";

interface PropertyListingCardProps {
  property: PropertyEntity;
  /** Optional query string to append when opening in new tab from search */
  queryString?: string;
  className?: string;
}

function formatPriceParts(p: PropertyEntity["pricing"]): {
  amount: string;
  unit: string;
} {
  return {
    amount: `$${Math.floor(p.amount).toLocaleString()}`,
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
      className="block cursor-pointer"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card className={cn("border-0 shadow-none bg-transparent", className)}>
        <CardHeader className="p-0">
          {/* Image container */}
          <div className="aspect-4/3 bg-muted rounded-xl mb-3 overflow-hidden relative group">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={property.title}
                fill
                className="object-cover w-full h-full group-hover:scale-[1.04] transition-transform duration-500 ease-in-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-muted text-muted-subtle">
                <ImageDown />
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 right-3 text-foreground rounded-full bg-white/90 hover:text-primary hover:bg-white"
              aria-label="Add to favourites"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-1 py-0">
          <div className="flex justify-between items-start gap-4 mb-0.5">
            <h3 className="font-semibold text-foreground truncate text-sm">
              {location}
            </h3>
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
              <span className="text-sm font-medium text-foreground">
                {rating.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm truncate max-w-[90%]">
            {property.title}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-0 pt-2 px-1">
          <p className="text-foreground font-semibold text-sm">
            {priceAmount}
            <span className="font-normal text-muted-foreground">{priceUnit}</span>
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
