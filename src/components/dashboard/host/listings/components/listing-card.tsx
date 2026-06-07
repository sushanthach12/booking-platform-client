"use client";

import type { HostListingSummary } from "@/domain/entities";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { Home } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ListingCardProps {
  listing: HostListingSummary;
  /** Pastel index so each card gets a distinct placeholder tint. */
  tintIndex: number;
}

/** Pastel placeholder tints (bg + icon) cycled per card. */
const TINTS = [
  { bg: "bg-blue-100", icon: "text-blue-400" },
  { bg: "bg-emerald-100", icon: "text-emerald-400" },
  { bg: "bg-rose-100", icon: "text-rose-400" },
  { bg: "bg-amber-100", icon: "text-amber-400" },
  { bg: "bg-violet-100", icon: "text-violet-400" },
  { bg: "bg-cyan-100", icon: "text-cyan-400" },
];

function isPaused(status?: string): boolean {
  return status === "paused" || status === "inactive";
}

export function ListingCard({ listing, tintIndex }: ListingCardProps) {
  const router = useRouter();
  const tint = TINTS[tintIndex % TINTS.length];
  const paused = isPaused(listing.status);
  const detailHref = `/dashboard/host/listings/${listing.id}`;

  const go = () => router.push(detailHref);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter") go();
      }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.07)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Image area */}
      <div className={cn("relative h-47.5 w-full", tint.bg)}>
        {listing.coverImage ? (
          <Image
            src={listing.coverImage}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className={cn("size-12", tint.icon)} />
          </div>
        )}

        {/* Status pill */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm">
          <span
            className={cn(
              "size-1.5 rounded-full",
              paused ? "bg-slate-400" : "bg-emerald-500",
            )}
          />
          {paused ? "Paused" : "Live"}
        </span>

        {/* Price chip */}
        {listing.basePrice != null && (
          <span className="absolute bottom-3 left-3 rounded-full bg-slate-900/85 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
            {formatCurrency(listing.basePrice, listing.currency ?? "USD", 0)}
            <span className="font-normal text-white/70"> / night</span>
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4.5">
        <h3
          className="truncate text-[15px] font-bold text-slate-900"
          style={{ textWrap: "balance" }}
        >
          {listing.title}
        </h3>
        {listing.location && (
          <p className="mt-1 truncate text-sm text-slate-400">
            {listing.location}
          </p>
        )}
      </div>
    </div>
  );
}
