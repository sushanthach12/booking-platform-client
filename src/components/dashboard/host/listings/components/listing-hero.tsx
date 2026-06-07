"use client";

import { Button } from "@/components/ui/button";
import type {
  HostListingSummary,
  IBecomeHostPropertyFormData,
} from "@/domain/entities";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { Home, Pencil, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ListingHeroProps {
  propertyId: string;
  form: IBecomeHostPropertyFormData;
  summary: HostListingSummary | null;
  bookingCount: number;
  reviewCount: number;
  onToggleStatus: () => void;
}

function occupancyColor(pct: number): string {
  if (pct >= 80) return "text-emerald-600";
  if (pct >= 60) return "text-amber-600";
  return "text-red-600";
}

function StatCell({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-400">
        {label}
      </p>
      <p className={cn("mt-1 text-lg font-bold text-slate-900", valueClass)}>
        {value}
      </p>
    </div>
  );
}

/** Wide hero card: cover image left, status/title/actions/rating/stats right. */
export function ListingHero({
  propertyId,
  form,
  summary,
  bookingCount,
  reviewCount,
  onToggleStatus,
}: ListingHeroProps) {
  const router = useRouter();
  const paused = summary?.status === "paused" || summary?.status === "inactive";
  const rating = summary?.rating ?? 0;
  // Occupancy isn't returned by the API yet; show a neutral placeholder.
  const occupancy = null as number | null;
  const cover = form.images?.[0];

  return (
    <div className="overflow-hidden rounded-[14px] border border-slate-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
      <div className="flex flex-col md:flex-row">
        {/* Cover */}
        <div className="relative h-56 w-full shrink-0 bg-blue-100 md:h-auto md:w-[320px]">
          {cover ? (
            <Image
              src={cover}
              alt={form.title}
              fill
              sizes="320px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Home className="size-14 text-blue-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    paused
                      ? "bg-slate-100 text-slate-600"
                      : "bg-emerald-100 text-emerald-700",
                  )}
                >
                  {paused ? "Paused" : "Active"}
                </span>
                <span className="text-sm text-slate-400">· Listing</span>
              </div>
              <h1
                className="mt-2 text-2xl font-bold tracking-[-0.02em] text-slate-900"
                style={{ textWrap: "balance" }}
              >
                {form.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {[summary?.location, form.propertyType]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button variant="outline" size="sm" onClick={onToggleStatus}>
                {paused ? "Activate listing" : "Pause listing"}
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/host/listings/${propertyId}/edit`)
                }
              >
                <Pencil className="size-3.5" />
                Edit listing
              </Button>
            </div>
          </div>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-1.5 text-sm">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-900">
              {rating > 0 ? rating.toFixed(2) : "—"}
            </span>
            <span className="text-slate-400">· {reviewCount} reviews</span>
          </div>

          {/* Stat strip */}
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
            <StatCell
              label="Nightly rate"
              value={formatCurrency(form.basePrice ?? 0, form.currency, 0)}
            />
            <StatCell
              label="Occupancy"
              value={occupancy != null ? `${occupancy}%` : "—"}
              valueClass={occupancy != null ? occupancyColor(occupancy) : ""}
            />
            <StatCell label="Total reviews" value={String(reviewCount)} />
            <StatCell label="Bookings" value={String(bookingCount)} />
          </div>
        </div>
      </div>
    </div>
  );
}
