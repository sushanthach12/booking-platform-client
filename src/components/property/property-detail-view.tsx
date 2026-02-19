"use client";

import { Button } from "@/components/ui/button";
import type { PropertyDetailViewState } from "@/lib/utils/map-property";
import {
  ArrowUpDown,
  Camera,
  Car,
  ChevronRight,
  Droplets,
  Heart,
  MapPin,
  Monitor,
  ShieldAlert,
  Star,
  Tv,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import UserAvatar from "../shared/user-avatar";
import { Separator } from "../ui/separator";
import { BookingWidget } from "./booking-widget";
import { ImageGallery } from "./image-gallery";

interface PropertyDetailViewProps {
  /** All state from PropertyDetailsTemplate; no fetching in this component. */
  state: PropertyDetailViewState;
}

/** "Type in Location" e.g. "Entire apartment in Bengaluru, India" (used in split) */
function propertyTypeLocation(type: string, location: string): string {
  return `${type} in ${location}`;
}

/** "X guests · Y bedroom(s) · Z bathroom(s)" for split subtitle */
function propertyQuickStats(state: PropertyDetailViewState): string {
  const guests = state.maxGuests ?? "1";
  const beds = state.bedrooms ?? "—";
  const baths = state.bathrooms ?? "—";
  const parts = [
    `${guests} guests`,
    `${beds} bedroom${Number(beds) !== 1 ? "s" : ""}`,
    `${baths} bathroom${Number(baths) !== 1 ? "s" : ""}`,
  ];
  return parts.join(" · ");
}

/** Icon for an amenity label (match by keyword, case-insensitive) */
const AMENITY_ICONS: Array<{ match: RegExp | string; Icon: React.ComponentType<{ className?: string }> }> = [
  { match: /kitchen/i, Icon: UtensilsCrossed },
  { match: /wifi|wi-fi|wireless/i, Icon: Wifi },
  { match: /parking|car/i, Icon: Car },
  { match: /tv|television/i, Icon: Tv },
  { match: /workspace|desk|work/i, Icon: Monitor },
  { match: /wash|laundry|washer/i, Icon: Droplets },
  { match: /carbon|monoxide|co alarm/i, Icon: ShieldAlert },
  { match: /smoke alarm|detector/i, Icon: ShieldAlert },
  { match: /camera|security/i, Icon: Camera },
  { match: /lift|elevator/i, Icon: ArrowUpDown },
];

function getAmenityIcon(amenity: string): React.ComponentType<{ className?: string }> {
  const lower = amenity.toLowerCase();
  const found = AMENITY_ICONS.find(({ match }) =>
    typeof match === "string" ? lower.includes(match) : match.test(amenity),
  );
  return found?.Icon ?? UtensilsCrossed;
}

export function PropertyDetailView({ state }: PropertyDetailViewProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="flex flex-col max-w-7xl mx-auto">
      {/* 1. Property name only above the image (type + location appear in split below) */}
      <section className="w-full shrink-0 px-4 pt-6">
        <div className="mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold lg:text-3xl">{state.title}</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-full"
              onClick={() => setIsFavorited((prev) => !prev)}
              aria-label={isFavorited ? "Remove from favourites" : "Add to favourites"}
            >
              <Heart
                className={`size-6 ${isFavorited ? "fill-destructive text-destructive" : ""}`}
                aria-hidden
              />
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Image gallery - reduced height */}
      <section className="w-full shrink-0 px-4 pt-4">
        <div className="mx-auto max-w-7xl">
          <ImageGallery images={state.images} title={state.title} />
        </div>
      </section>

      {/* 3. Split until amenities: left scrolls with page; right sticky until this section leaves viewport */}
      <section className="mx-auto w-full max-w-7xl py-6">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-[1fr_360px] items-start">
          <div className="space-y-6 lg:space-y-10 lg:pt-0 lg:pr-2">
            {/* Starting data in split: type + location, then quick stats */}
            <div>
              <h2 className="text-2xl font-semibold lg:text-3xl">
                {propertyTypeLocation(state.type, state.location)}
              </h2>
              <p className="mt-1 text-base font-light lg:text-lg">
                {propertyQuickStats(state)}
              </p>
            </div>

            {/* Host section - no card, plain layout */}
            <section className="pb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <UserAvatar
                  image={state.hostImage ?? ""}
                  name={state.hostName}
                  size="lg"
                />
                <div>
                  <p className="font-semibold text-base lg:text-lg">Hosted by {state.hostName}</p>
                  <p className="text-sm text-muted-foreground lg:text-base">
                    {state.isSuperhost ? "Superhost" : ""}
                    {state.isSuperhost ? " · " : ""}
                    2 years hosting
                  </p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full justify-between">
                <span>Contact Host</span>
                <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
              </Button>
            </section>

            {/* Description */}
            {state.description && (
              <section>
                <h2 className="mb-2 font-semibold text-base lg:text-lg">Description</h2>
                <p className="text-muted-foreground line-clamp-3 text-sm lg:text-base">
                  {state.description}
                </p>
                <button
                  type="button"
                  className="mt-2 text-sm font-medium text-primary hover:underline lg:text-base"
                >
                  Read more
                </button>
              </section>
            )}

            {/* Amenities */}
            {state.amenities && state.amenities.length > 0 && (
              <section>
                <h2 className="mb-4 font-semibold text-base lg:text-lg">What this place offers</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {state.amenities.slice(0, 10).map((amenity, index) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div
                        key={`${amenity}-${index}`}
                        className="flex items-center gap-3 text-sm lg:text-base"
                      >
                        <Icon
                          className="size-5 shrink-0 stroke-[1.5] text-muted-foreground lg:size-6"
                          aria-hidden
                        />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
                {state.amenities.length > 10 && (
                  <Button
                    variant="outline"
                    className="mt-5 w-auto rounded-lg border-border bg-muted/50 px-4 py-2 font-medium text-muted-foreground hover:bg-muted hover:text-foreground text-sm lg:text-base"
                  >
                    Show all {state.amenities.length} amenities
                  </Button>
                )}
              </section>
            )}
          </div>

          {/* Sidebar: sticky while left content is in view; scrolls away when split section ends */}
          <aside className="lg:sticky lg:top-16 lg:self-start lg:shrink-0">
            <BookingWidget property={state} />
          </aside>
        </div>
      </section>

      <Separator className="my-6" />

      {/* 3. Full-width below split: rating, cancellation, map */}
      <section className="mx-auto w-full max-w-7xl py-6 pb-16 space-y-6">
        {/* Rating & reviews */}
        <section className="rounded-xl border border-border p-6">
          <h2 className="mb-4 font-semibold text-base lg:text-lg">Rating & reviews</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="size-5 fill-amber-400 text-amber-400 lg:size-6" aria-hidden />
              <span className="text-2xl font-semibold lg:text-3xl">{state.rating.toFixed(1)}</span>
            </div>
            {state.reviewCount != null && (
              <span className="text-muted-foreground text-sm lg:text-base">
                {state.reviewCount} {state.reviewCount === 1 ? "review" : "reviews"}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground lg:text-base">
            One of the most loved homes according to guests.
          </p>
          <Button variant="outline" className="mt-4 text-sm lg:text-base" size="sm">
            Show all reviews
          </Button>
        </section>

        {/* Cancellation policies and house rules */}
        <section className="rounded-xl border border-border p-6">
          <h2 className="mb-4 font-semibold text-base lg:text-lg">Cancellation & house rules</h2>
          <ul className="space-y-3 text-sm text-muted-foreground lg:text-base">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 size-2 shrink-0 rounded-full bg-foreground/60" />
              Free cancellation before 48 hours of check-in for a full refund.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 size-2 shrink-0 rounded-full bg-foreground/60" />
              Check-in after 3:00 PM · Checkout before 11:00 AM.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 size-2 shrink-0 rounded-full bg-foreground/60" />
              No smoking. Pets are not allowed.
            </li>
          </ul>
          <Button variant="link" className="mt-4 h-auto p-0 text-sm font-medium lg:text-base">
            Read full policy
          </Button>
        </section>

        {/* Map - location at the end */}
        <section className="rounded-xl border border-border overflow-hidden">
          <h2 className="flex items-center gap-2 border-b border-border p-4 font-semibold text-base lg:text-lg">
            <MapPin className="size-4 lg:size-5" aria-hidden />
            Where you&apos;ll be
          </h2>
          <div className="aspect-[16/10] w-full bg-muted flex items-center justify-center text-muted-foreground">
            {state.coordinates ? (
              <a
                href={`https://www.google.com/maps?q=${state.coordinates.lat},${state.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline hover:text-foreground lg:text-base"
              >
                View on Google Maps · {state.location}
              </a>
            ) : (
              <span className="text-sm lg:text-base">Map · {state.location}</span>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
