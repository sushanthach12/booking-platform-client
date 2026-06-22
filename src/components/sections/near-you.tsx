"use client";

import type { PropertyEntity } from "@/domain/entities";
import { ArrowRight, Heart, Loader2, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useNearbyLocation } from "./hooks/use-nearby-location";
import { LocationModal } from "./location-modal";

const PLACEHOLDER_IMAGE = "/next.svg";

/** Short "5 guests · 2 beds" line, falling back to the property type. */
function detailLine(p: PropertyEntity): string {
  const parts: string[] = [];
  if (p.maxGuests) parts.push(`${p.maxGuests} guests`);
  if (p.beds) parts.push(`${p.beds} beds`);
  if (p.bathrooms) parts.push(`${p.bathrooms} baths`);
  if (parts.length > 0) return parts.join(" · ");
  return p.type ?? "Entire place";
}

function NearYouCard({ property }: { property: PropertyEntity }) {
  const [saved, setSaved] = useState(property.isWishlisted ?? false);

  const image = property.images?.[0] ?? PLACEHOLDER_IMAGE;
  const locationLabel = [property.location.city, property.type]
    .filter(Boolean)
    .join(" · ")
    .toUpperCase();

  return (
    <Link
      href={`/properties/${property.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-[18px] p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{ background: "#FBF8F2", boxShadow: "0 1px 0 rgba(42,59,46,0.04)", textDecoration: "none" }}
    >
      <div className="relative rounded-xl overflow-hidden bg-[#E8E2D5]" style={{ aspectRatio: "4/5" }}>
        <Image
          src={image}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSaved((v) => !v);
          }}
          aria-label={saved ? "Remove from saved" : "Save"}
          className="absolute top-2.5 right-2.5 size-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(251,248,242,0.94)" }}
        >
          <Heart
            className="size-3.5"
            style={{
              stroke: "#2A3B2E",
              fill: saved ? "#2A3B2E" : "none",
            }}
          />
        </button>
        {property.stats && property.stats.reviewCount > 0 && (
          <div
            className="absolute bottom-2.5 left-2.5 font-mono"
            style={{
              background: "rgba(31,46,34,0.85)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              color: "#FBF8F2",
              padding: "5px 10px",
              borderRadius: "999px",
              fontSize: "10px",
              letterSpacing: "0.1em",
            }}
          >
            ★ {property.stats.rating.toFixed(1)} · {property.stats.reviewCount}
          </div>
        )}
      </div>

      <div className="pt-4 px-1.5 pb-1.5">
        <p
          className="font-mono text-muted-foreground mb-1.5"
          style={{ fontSize: "10px", letterSpacing: "0.12em" }}
        >
          {locationLabel}
        </p>
        <p
          className="font-display italic text-foreground mb-1"
          style={{ fontSize: "22px", letterSpacing: "-0.01em" }}
        >
          {property.title}
        </p>
        <p className="text-muted-foreground mb-3.5" style={{ fontSize: "13px" }}>
          {detailLine(property)}
        </p>
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-semibold text-foreground" style={{ fontSize: "17px" }}>
              ₹{property.pricing.amount.toLocaleString("en-IN")}
            </span>
            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>
              {" "}/ night
            </span>
          </div>
          {property.location.state && (
            <span className="text-muted-foreground" style={{ fontSize: "11px" }}>
              {property.location.state}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function NearYouSection({
  properties = [],
  cities = [],
  defaultLocation = "",
}: {
  properties?: PropertyEntity[];
  /** Cities (with active listings) offered in the location picker. */
  cities?: string[];
  /** Server-resolved default location label for the geo chip. */
  defaultLocation?: string;
}) {
  const { location, properties: nearby, isLoading, error, changeLocation } =
    useNearbyLocation({
      initialLocation: defaultLocation,
      initialProperties: properties,
    });

  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // Only ever render real listings from the API — no demo/placeholder cards.
  const items = nearby;
  const canChangeLocation = nearby.length > 0 || cities.length > 0;
  const displayLocation = location.trim() || "you";

  const handleChangeLocation = async (next: string) => {
    setActiveFilter("All");
    await changeLocation(next);
  };

  // Filter chips are derived from the distinct property types present.
  const filterChips = useMemo(() => {
    const types = Array.from(
      new Set(items.map((p) => p.type).filter((t): t is string => Boolean(t))),
    );
    return ["All", ...types];
  }, [items]);

  const filtered =
    activeFilter === "All"
      ? items
      : items.filter((p) => p.type === activeFilter);

  const visible = (filtered.length > 0 ? filtered : items).slice(0, 4);
  const isEmpty = nearby.length === 0 && !isLoading;

  return (
    <section
      className="border-t border-b"
      style={{
        background: "#F4EFE5",
        borderColor: "rgba(42,59,46,0.08)",
      }}
    >
      <div className="max-w-360 mx-auto px-6 lg:px-12 py-20">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12 gap-8 flex-wrap">
          <div>
            {/* Geo chip */}
            <div
              className="inline-flex items-center gap-2 mb-4.5 font-sans font-medium"
              style={{
                padding: "6px 10px 6px 10px",
                background: "#FFFFFF",
                border: "1px solid rgba(42,59,46,0.10)",
                borderRadius: "999px",
                fontSize: "12px",
                color: "#2A3B2E",
              }}
            >
              <MapPin className="size-3.5 shrink-0" style={{ color: "#C2724A" }} />
              <span>
                Showing stays near <strong>{displayLocation}</strong>
              </span>
              {isLoading && (
                <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
              )}
              {canChangeLocation && (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="text-muted-foreground underline ml-1 hover:text-foreground transition-colors"
                  style={{ fontSize: "12px" }}
                >
                  change
                </button>
              )}
            </div>

            <p
              className="font-mono uppercase text-muted-foreground mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.18em" }}
            >
              03 — Fresh on Stayly
            </p>
            <h2
              className="font-sans font-semibold text-foreground"
              style={{ fontSize: "clamp(32px,4vw,56px)", lineHeight: "1", letterSpacing: "-0.04em" }}
            >
              Recently
              <br />
              <span className="font-display italic" style={{ color: "#C2724A", fontWeight: 400 }}>
                listed stays
              </span>
              .
            </h2>
          </div>

          {/* Filter chips */}
          {filterChips.length > 1 && (
            <div className="flex gap-2 flex-wrap pb-1.5">
              {filterChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveFilter(chip)}
                  className="font-sans font-medium transition-colors capitalize"
                  style={{
                    padding: "8px 16px",
                    fontSize: "13px",
                    borderRadius: "999px",
                    border: activeFilter === chip ? "none" : "1px solid rgba(42,59,46,0.12)",
                    background: activeFilter === chip ? "#1F2E22" : "#FFFFFF",
                    color: activeFilter === chip ? "#FBF8F2" : "#2A3B2E",
                    cursor: "pointer",
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="mb-6 text-sm text-destructive">{error}</p>
        )}

        {/* Cards grid */}
        {isEmpty ? (
          <p className="py-12 text-center text-muted-foreground">
            No stays found near <strong>{displayLocation}</strong> yet. Try a
            different location.
          </p>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-opacity"
            style={{ opacity: isLoading ? 0.5 : 1 }}
          >
            {visible.map((property) => (
              <NearYouCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Link
            href="/search"
            className="inline-flex items-center gap-2.5 font-sans font-medium transition-shadow hover:shadow-md"
            style={{
              padding: "14px 24px",
              background: "#FFFFFF",
              border: "1px solid rgba(42,59,46,0.12)",
              color: "#1F2E22",
              borderRadius: "999px",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            See more stays
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {canChangeLocation && (
        <LocationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          cities={cities}
          current={location}
          onSelect={handleChangeLocation}
        />
      )}
    </section>
  );
}
