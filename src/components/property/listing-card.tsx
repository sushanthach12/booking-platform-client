"use client";

import { Heart, ImageDown, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { PropertyEntity } from "@/domain/entities";
import { cn } from "@/lib/utils/utils";

interface ListingCardProps {
  property: PropertyEntity;
  className?: string;
}

function formatPriceParts(p: PropertyEntity["pricing"]): { amount: string; unit: string } {
  return {
    amount: `$${Math.floor(p.amount).toLocaleString()}`,
    unit: ` / ${p.frequency}`,
  };
}

export function ListingCard({ property, className }: ListingCardProps) {
  const imageUrl = property.images[0];
  const location = [property.location.city, property.location.state, property.location.country]
    .filter(Boolean)
    .join(", ");
  const rating = property.stats?.rating ?? 0;
  const { amount: priceAmount, unit: priceUnit } = formatPriceParts(property.pricing);

  return (
    <Link href={`/properties/${property.id}`} className="block">
      <Card
        className={cn(
          "h-1/2 overflow-hidden rounded-xl border-border shadow-sm transition-shadow hover:shadow-md",
          className
        )}
      >
        <CardHeader className="p-0 space-y-0">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-xl bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-muted text-foreground">
                <ImageDown />
              </div>
            )}
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-3 top-3 size-9 rounded-full border border-border bg-background shadow-sm hover:bg-background"
              aria-label="Add to favourites"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="size-5 stroke-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-28 p-4">
          <p className="line-clamp-2 text-base font-semibold leading-tight text-foreground">
            {property.title}
          </p>
          <p className="mt-1 text-sm font-normal text-muted-foreground">{location}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2">
          <p className="text-sm">
            <span className="font-semibold text-foreground">{priceAmount}</span>
            <span className="font-medium text-muted-foreground">{priceUnit}</span>
          </p>
          <span className="flex shrink-0 items-center gap-1 text-sm font-normal text-foreground">
            <Star className="size-4 shrink-0 fill-indigo-300 stroke-indigo-500" aria-hidden />
            {rating.toFixed(1)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
