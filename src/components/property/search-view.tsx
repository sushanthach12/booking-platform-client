"use client";

import { SearchMap } from "@/components/map/search-map";
import { Button } from "@/components/ui/button";
import type { PropertyEntity } from "@/domain/entities";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useState } from "react";
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
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<"date" | "price">("date");

  return (
    <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
      {/* List Pane */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="shrink-0 border-b border-border px-4 py-4">
          <h1 className="text-xl font-semibold">
            {totalCount} stays in {locationLabel}
          </h1>
          <p className="text-sm text-muted-foreground">
            Book your next stay at one of our properties.
          </p>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm">
              Share
            </Button>
            <Button variant="outline" size="sm">
              Save search
            </Button>
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
            <Button variant="outline" size="sm">
              More filters
            </Button>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={sortBy === "date" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy("date")}
              >
                Sort by date
              </Button>
              <span className="text-muted-foreground">|</span>
              <Button
                variant={sortBy === "price" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy("price")}
              >
                Sort by price
              </Button>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
            </div>
          </div>
        </header>

        <div className={cn(
          "p-4",
          viewMode === "grid" && "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}>
          {properties.map((property) => (
            <div key={property.id} className={viewMode === "list" ? "mb-4" : ""}>
              <PropertyCard
                property={property}
                showGuestFavorite={(property.stats?.rating ?? 0) >= 4.8}
              />
            </div>
          ))}
        </div>

        <div className="p-4">
          <Button variant="outline" className="w-full">
            Show more
          </Button>
        </div>
      </div>

      {/* Map Pane - Desktop */}
      <div className="hidden h-[50vh] shrink-0 bg-muted md:block md:h-auto md:min-h-screen md:w-[40%]">
        <SearchMap properties={properties} className="h-full" />
      </div>

      {/* Floating Map Button - Mobile */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:hidden">
        <Button size="lg" className="rounded-full shadow-lg">
          <MapPin className="mr-2 size-4" />
          Show map
        </Button>
      </div>
    </div>
  );
}
