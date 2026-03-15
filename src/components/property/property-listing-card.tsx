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
          <div className="aspect-[4/3] bg-stone-100 rounded-3xl mb-4 overflow-hidden relative group">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={property.title}
                fill
                className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-700 ease-in-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-stone-100 text-stone-300">
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
        <CardContent className="px-1 py-0 border-none">
          <div className="flex justify-between items-start gap-4 mb-0.5">
            <h3 className="font-semibold text-stone-900 truncate">
              {location}
            </h3>
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-stone-900 text-stone-900" />
              <span className="text-sm font-medium text-stone-900">
                {rating.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-stone-500 text-sm truncate max-w-[90%] font-medium">
            {property.title}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-0 pt-2 px-1">
          <p className="text-stone-900 font-semibold mt-1">
            {priceAmount}
            <span className="font-normal text-stone-600">{priceUnit}</span>
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
