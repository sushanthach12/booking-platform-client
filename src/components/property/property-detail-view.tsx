"use client";

import {
  ArrowUpDown,
  Bath,
  BedDouble,
  Camera,
  Car,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Heart,
  MapPin,
  Monitor,
  Share2,
  ShieldAlert,
  Star,
  Tv,
  Users,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import { useWishlistToggle } from "@/domain/hooks/use-wishlist-toggle";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { PropertyDetailViewState } from "@/lib/utils/map-property";
import UserAvatar from "../shared/user-avatar";
import { BookingWidget } from "./booking-widget";
import { ImageGallery } from "./image-gallery";

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

const AMENITY_ICONS: Array<{
  match: RegExp;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { match: /kitchen/i, Icon: UtensilsCrossed },
  { match: /wifi|wi-fi|wireless/i, Icon: Wifi },
  { match: /parking|car/i, Icon: Car },
  { match: /tv|television/i, Icon: Tv },
  { match: /workspace|desk|work/i, Icon: Monitor },
  { match: /wash|laundry|washer/i, Icon: Droplets },
  { match: /carbon|co alarm/i, Icon: ShieldAlert },
  { match: /smoke alarm|detector/i, Icon: ShieldAlert },
  { match: /camera|security/i, Icon: Camera },
  { match: /lift|elevator/i, Icon: ArrowUpDown },
];

function getAmenityIcon(amenity: string) {
  return (
    AMENITY_ICONS.find(({ match }) => match.test(amenity))?.Icon ??
    UtensilsCrossed
  );
}

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span
        className="block w-1 h-5 rounded-full shrink-0"
        style={{
          background: "linear-gradient(180deg, #f04e28 0%, #f2ab1a 100%)",
        }}
      />
      <h2 className="font-semibold text-lg text-stone-900">{children}</h2>
    </div>
  );
}

function StatPill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-stone-100 rounded-xl px-3.5 py-2 text-sm font-medium text-stone-700">
      <Icon className="size-4 text-orange-500 shrink-0" />
      {label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────

export type InitialDateRange = { from: Date; to: Date };

interface PropertyDetailViewProps {
  state: PropertyDetailViewState;
  /** Pre-fill booking widget dates from URL (e.g. from search). */
  initialDateRange?: InitialDateRange;
}

export function PropertyDetailView({
  state,
  initialDateRange,
}: PropertyDetailViewProps) {
  const { wishlisted: isFavorited, loading: wishlistLoading, toggle: toggleWishlist } = useWishlistToggle(state.id);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const visibleAmenities = showAllAmenities
    ? (state.amenities ?? [])
    : (state.amenities ?? []).slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 1. Page header ─────────────────────────────────── */}
        <header className="pt-6 pb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Location breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-2">
              <MapPin className="size-3 text-orange-500 shrink-0" />
              <span>{state.location}</span>
            </div>

            <h1 className="text-2xl font-bold text-stone-900 lg:text-4xl leading-tight">
              {state.title}
            </h1>

            {/* Rating + review count inline */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-amber-500 text-amber-500" />
                <span className="text-sm font-semibold text-stone-900">
                  {state.rating}
                </span>
                {state.reviewCount != null && (
                  <span className="text-sm text-stone-500">
                    ({state.reviewCount} reviews)
                  </span>
                )}
              </div>
              {state.isSuperhost && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5">
                  <CheckCircle2 className="size-3" />
                  Superhost
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <button
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl px-3 py-2 transition-colors"
              aria-label="Share property"
            >
              <Share2 className="size-3.5" />
              Share
            </button>
            <button
              onClick={toggleWishlist}
              disabled={wishlistLoading}
              aria-label={isFavorited ? "Remove from favourites" : "Save"}
              className={cn(
                "flex items-center gap-1.5 text-xs font-semibold rounded-xl px-3 py-2 transition-all",
                isFavorited
                  ? "bg-orange-50 text-orange-600 border border-orange-200"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900",
              )}
            >
              <Heart
                className={cn(
                  "size-3.5 transition-all",
                  isFavorited ? "fill-orange-500 text-orange-500" : "",
                )}
              />
              {isFavorited ? "Saved" : "Save"}
            </button>
          </div>
        </header>

        {/* ── 2. Image gallery ───────────────────────────────── */}
        <section className="pb-6">
          <ImageGallery
            propertyId={state.id}
            images={state.images}
            title={state.title}
          />
        </section>

        {/* ── 3. Quick-stat pills ────────────────────────────── */}
        <div className="flex flex-wrap gap-2 pb-8">
          <StatPill icon={Users} label={`${state.maxGuests ?? 1} guests`} />
          <StatPill
            icon={BedDouble}
            label={`${state.bedrooms ?? "—"} bedroom${
              Number(state.bedrooms) !== 1 ? "s" : ""
            }`}
          />
          <StatPill
            icon={Bath}
            label={`${state.bathrooms ?? "—"} bathroom${
              Number(state.bathrooms) !== 1 ? "s" : ""
            }`}
          />
          <div className="flex items-center gap-2 bg-stone-100 rounded-xl px-3.5 py-2 text-sm font-medium text-stone-700">
            <span className="text-stone-400 text-xs">type</span>
            <span className="capitalize">{state.type}</span>
          </div>
        </div>

        {/* ── 4. Two-column split ────────────────────────────── */}
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-[1fr_360px] items-start pb-16">
          {/* Left column */}
          <div className="space-y-10">
            {/* Host */}
            <section className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-stone-200 bg-stone-50/60">
              <div className="flex items-center gap-4">
                <UserAvatar
                  image={state.hostImage ?? ""}
                  name={state.hostName}
                  size="lg"
                />
                <div>
                  <p className="font-semibold text-stone-900">
                    Hosted by {state.hostName}
                  </p>
                  <p className="text-sm text-stone-500 mt-0.5">
                    {[state.isSuperhost ? "Superhost" : null, "2 years hosting"]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 rounded-xl border-stone-300 text-stone-700 hover:border-orange-400 hover:text-orange-600 gap-1.5 text-sm"
              >
                Contact
                <ChevronRight className="size-3.5" />
              </Button>
            </section>

            <Separator className="bg-stone-200" />

            {/* Description */}
            {state.description && (
              <section>
                <SectionLabel>About this place</SectionLabel>
                <p
                  className={cn(
                    "text-stone-600 leading-relaxed text-sm lg:text-base transition-all",
                    !descExpanded && "line-clamp-4",
                  )}
                >
                  {state.description}
                </p>
                <button
                  type="button"
                  onClick={() => setDescExpanded((p) => !p)}
                  className="mt-3 text-sm font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2 transition-colors"
                >
                  {descExpanded ? "Show less" : "Read more"}
                </button>
              </section>
            )}

            <Separator className="bg-stone-200" />

            {/* Amenities */}
            {(state.amenities?.length ?? 0) > 0 && (
              <section>
                <SectionLabel>What this place offers</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {visibleAmenities.map((amenity, i) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div
                        key={`${amenity}-${i}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-700"
                      >
                        <div className="size-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-xs">
                          <Icon className="size-4 text-orange-500" />
                        </div>
                        {amenity}
                      </div>
                    );
                  })}
                </div>
                {(state.amenities?.length ?? 0) > 10 && (
                  <button
                    type="button"
                    onClick={() => setShowAllAmenities((p) => !p)}
                    className="mt-4 text-sm font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2 transition-colors"
                  >
                    {showAllAmenities
                      ? "Show less"
                      : `Show all ${state.amenities!.length} amenities`}
                  </button>
                )}
              </section>
            )}
          </div>

          {/* Right: sticky booking widget */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            {/* Price teaser above widget */}
            {/* <div className="mb-3 px-1">
              <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                From
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-stone-900">
                  ${state.pricing.amount ?? "—"}
                </span>
                <span className="text-stone-500 text-sm">/ night</span>
              </div>
            </div> */}
            <BookingWidget
              property={state}
              initialDateRange={initialDateRange}
            />
          </aside>
        </div>

        {/* ── 5. Full-width sections ─────────────────────────── */}
        <div className="space-y-6 pb-20">
          {/* Rating & reviews */}
          <section className="rounded-2xl border border-stone-200 bg-stone-50/40 p-6 lg:p-8">
            <SectionLabel>Rating & reviews</SectionLabel>
            <div className="flex flex-wrap items-end gap-6">
              {/* Big score — inline style guarantees gradient renders regardless of Tailwind purge */}
              <div
                className="flex flex-col items-center justify-center size-24 rounded-2xl shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #f04e28 0%, #f2ab1a 100%)",
                }}
              >
                <Star
                  className="size-5 mb-1"
                  style={{
                    fill: "rgba(255,255,255,0.8)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                />
                <span
                  className="text-3xl font-bold leading-none"
                  style={{ color: "#fff" }}
                >
                  {state.rating}
                </span>
                <span
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  out of 5
                </span>
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-lg">
                  One of the most loved homes
                </p>
                {state.reviewCount != null && (
                  <p className="text-stone-500 text-sm mt-1">
                    Based on {state.reviewCount}{" "}
                    {state.reviewCount === 1 ? "review" : "reviews"}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-xl border-stone-300 text-stone-700 hover:border-orange-400 hover:text-orange-600 text-sm"
                >
                  Show all reviews
                </Button>
              </div>
            </div>
          </section>

          {/* Cancellation & house rules */}
          <section className="rounded-2xl border border-stone-200 p-6 lg:p-8">
            <SectionLabel>Cancellation & house rules</SectionLabel>
            <ul className="space-y-3">
              {[
                "Free cancellation before 48 hours of check-in for a full refund.",
                "Check-in after 3:00 PM · Checkout before 11:00 AM.",
                "No smoking. Pets are not allowed.",
              ].map((rule) => (
                <li
                  key={rule}
                  className="flex items-start gap-3 text-sm text-stone-600 lg:text-base"
                >
                  <span className="mt-1.5 size-1.5 rounded-full bg-orange-400 shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
            <Button
              variant="link"
              className="mt-4 h-auto p-0 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Read full policy →
            </Button>
          </section>

          {/* Map */}
          <section className="rounded-2xl border border-stone-200 overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-stone-200 bg-stone-50">
              <div className="size-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
                <MapPin className="size-3.5 text-orange-500" />
              </div>
              <h2 className="font-semibold text-stone-900">
                Where you&apos;ll be
              </h2>
              <span className="text-sm text-stone-500 ml-1">
                — {state.location}
              </span>
            </div>

            <div className="aspect-16/7 w-full bg-stone-100 flex items-center justify-center relative overflow-hidden">
              {/* Decorative map placeholder with warm tones */}
              <div className="absolute inset-0 bg-linear-to-br from-stone-100 via-amber-50 to-stone-200" />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg,transparent,transparent 39px,#a39380 39px,#a39380 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,#a39380 39px,#a39380 40px)",
                }}
              />
              {state.coordinates ? (
                <a
                  href={`https://www.google.com/maps?q=${state.coordinates.lat},${state.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 inline-flex items-center gap-2 bg-white border border-stone-200 shadow-md rounded-xl px-5 py-2.5 text-sm font-semibold text-stone-900 hover:border-orange-400 hover:text-orange-600 transition-colors"
                >
                  <MapPin className="size-4 text-orange-500" />
                  Open in Google Maps
                </a>
              ) : (
                <span className="relative z-10 text-sm text-stone-400">
                  Map · {state.location}
                </span>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
