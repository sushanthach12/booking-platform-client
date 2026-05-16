"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HostListingSummary } from "@/domain/entities";
import { formatCurrency } from "@/lib/utils/currency";
import { BookOpen, Edit3, ExternalLink, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HostPropertyCardProps {
  listing: HostListingSummary;
  onViewBookings: (id: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-slate-100 text-slate-500 border-slate-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

export function HostPropertyCard({
  listing,
  onViewBookings,
}: HostPropertyCardProps) {
  const statusClass = listing.status
    ? (STATUS_COLORS[listing.status] ??
      "bg-slate-100 text-slate-500 border-slate-200")
    : "";

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white overflow-hidden hover:border-slate-200 hover:shadow-sm transition-all duration-200">
      {/* Cover image */}
      <div className="relative h-44 w-full bg-slate-100">
        {listing.coverImage ? (
          <Image
            src={listing.coverImage}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ExternalLink className="size-8 text-slate-300" />
          </div>
        )}
        {listing.status && (
          <Badge
            variant="outline"
            className={`absolute top-2 right-2 text-[10px] font-semibold capitalize ${statusClass}`}
          >
            {listing.status}
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-1 truncate">
          {listing.title}
        </h3>

        {listing.location && (
          <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
            <MapPin className="size-3" />
            {listing.location}
          </p>
        )}

        <div className="flex items-center gap-3 mb-3">
          {listing.basePrice != null && (
            <span className="text-sm font-bold text-slate-900">
              {formatCurrency(listing.basePrice, listing.currency ?? "INR")}
              <span className="text-xs font-normal text-slate-400">
                {" "}
                /night
              </span>
            </span>
          )}
          {listing.rating != null && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Star className="size-3 text-amber-400 fill-amber-400" />
              {listing.rating.toFixed(1)}
              {listing.reviewCount != null && (
                <span className="text-slate-400">({listing.reviewCount})</span>
              )}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl text-xs h-8"
          >
            <Link href={`/properties/${listing.id}`}>
              <ExternalLink className="size-3 mr-1" />
              View
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl text-xs h-8"
          >
            <Link href={`/host/dashboard/listings/${listing.id}/edit`}>
              <Edit3 className="size-3 mr-1" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl text-xs h-8"
            onClick={() => onViewBookings(listing.id)}
          >
            <BookOpen className="size-3 mr-1" />
            Bookings
          </Button>
        </div>
      </div>
    </div>
  );
}
