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

  return (
    <Link href={`/properties/${property.id}`} className="block cursor-pointer">
      <Card className={cn("border-0 shadow-none bg-transparent", className)}>
        <CardHeader className="p-0">
          {/* Image Container */}
          <div className="aspect-4/3 bg-muted rounded-2xl mb-4 overflow-hidden relative group">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={property.title}
                fill
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-muted text-foreground">
                <ImageDown />
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-4 right-4 text-black rounded-full bg-white hover:text-rose-500 hover:bg-transparent"
              aria-label="Add to favourites"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-2">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-foreground truncate flex-1 mr-2">
              {location}
            </h3>
          </div>
          <p className="text-muted-foreground text-sm truncate">
            {property.title}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-0 pt-3 px-2">
          <p className="text-foreground font-semibold">
            {priceAmount}
            <span className="font-light">{priceUnit}</span>
          </p>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-4 h-4 text-xs" />
            <span className="text-sm font-light">{rating.toFixed(2)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
