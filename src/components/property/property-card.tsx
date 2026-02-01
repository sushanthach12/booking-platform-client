"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { PropertyEntity } from "@/domain/entities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";

interface PropertyCardProps {
  property: PropertyEntity;
  showGuestFavorite?: boolean;
  className?: string;
}

function formatPrice(p: PropertyEntity["pricing"]): string {
  return `$${p.amount} ${p.currency}`;
}

export function PropertyCard({
  property,
  showGuestFavorite = false,
  className,
}: PropertyCardProps) {
  const imageUrl = property.images[0] ?? "/next.svg";
  const location = [property.location.city, property.location.state].filter(Boolean).join(", ");
  const rating = property.stats?.rating ?? 0;
  const reviewCount = property.stats?.reviewCount ?? 0;
  const hostName = property.host?.name ?? "Host";
  const amenities = (property.amenities ?? []).slice(0, 2).join(" • ");

  return (
    <Link
      href={`/properties/${property.id}`}
      className={cn(
        "flex gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="relative h-32 w-40 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className="object-cover"
          sizes="160px"
        />
        {showGuestFavorite && (
          <Badge variant="guestFavorite" className="absolute left-2 top-2">
            Guest favourite
          </Badge>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">
          {property.type ?? "Entire rental unit"} in {property.location.city}
        </p>
        <p className="font-semibold leading-tight">{property.title}</p>
        {amenities && (
          <p className="mt-1 text-sm text-muted-foreground">{amenities}</p>
        )}
        <div className="mt-2 flex items-center gap-1 text-sm">
          <Star className="size-4 fill-current" aria-hidden />
          <span>{rating.toFixed(1)}</span>
          <span className="text-muted-foreground">· {reviewCount} reviews</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="size-5">
            <AvatarImage src={property.host?.image} alt={hostName} />
            <AvatarFallback className="text-xs">{hostName[0]}</AvatarFallback>
          </Avatar>
          <span>Hosted by {hostName}</span>
        </div>
        <p className="mt-2 font-semibold">{formatPrice(property.pricing)}</p>
      </div>
    </Link>
  );
}
