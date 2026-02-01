"use client";

import type { PropertyEntity } from "@/domain/entities";
import { PropertyCard } from "./property-card";

/**
 * Presentational search results view. All state passed from SearchListingTemplate.
 */
interface SearchViewProps {
  properties: PropertyEntity[];
  /** Derived in template from properties.length */
  totalCount: number;
  /** Optional: location label from template state */
  locationLabel?: string;
}

export function SearchView({ properties, totalCount, locationLabel = "Melbourne" }: SearchViewProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="shrink-0 border-b border-border px-4 py-4">
          <h1 className="text-xl font-semibold">
            {totalCount} stays in {locationLabel}
          </h1>
          <p className="text-sm text-muted-foreground">
            Book your next stay at one of our properties.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Share
            </button>
            <button
              type="button"
              className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Save search
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-md border border-border px-3 py-2">
              Melbourne, AU
            </span>
            <span className="rounded-md border border-border px-3 py-2">
              May 16 – May 18
            </span>
            <span className="rounded-md border border-border px-3 py-2">
              Any price
            </span>
            <button
              type="button"
              className="rounded-md border border-border px-3 py-2 font-medium hover:bg-muted"
            >
              More filters
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by date</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">Sort by price</span>
            <span className="ml-auto text-sm text-muted-foreground">
              List | Grid
            </span>
          </div>
        </header>
        <ul className="flex flex-col gap-4 p-4">
          {properties.map((property) => (
            <li key={property.id}>
              <PropertyCard
                property={property}
                showGuestFavorite={(property.stats?.rating ?? 0) >= 4.8}
              />
            </li>
          ))}
        </ul>
        <div className="p-4">
          <button
            type="button"
            className="w-full rounded-md border border-border py-2 text-sm font-medium hover:bg-muted"
          >
            Show more
          </button>
        </div>
      </div>
      <div className="hidden h-[50vh] shrink-0 bg-muted md:block md:h-auto md:min-h-screen md:w-[40%]">
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Map (sticky)
        </div>
      </div>
    </div>
  );
}
