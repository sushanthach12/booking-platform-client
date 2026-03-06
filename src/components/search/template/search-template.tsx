"use client";

import { addDays, format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { SearchFilterSidebar, SearchFiltersState, SearchListing, useSearch, useSearchFilters } from "..";

export const SearchTemplate = () => {
  const locationLabel = "Melbourne";

  const [sortBy, setSortBy] = useState<"date" | "price" | "recommended">(
    "recommended",
  );
  const { filters, updateFilters, clearFilters } = useSearchFilters();

  const { properties, totalCount, fetchProperties } = useSearch();

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiltersChange = useCallback(
    (next: SearchFiltersState) => {
      updateFilters(next);
    },
    [updateFilters],
  );

  return (
    <div className="flex w-full h-[calc(100vh-4.1rem)] overflow-hidden bg-background">
      <div className="hidden lg:block shrink-0 sticky top-0 h-[calc(100vh-4rem)]">
        <SearchFilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={clearFilters}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <header className="shrink-0 border-b border-border bg-background px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {totalCount} stays in {locationLabel}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {format(new Date(), "MMM d")} – {format(addDays(new Date(), 7), "MMM d")}
              </p>
            </div>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "price" | "recommended")
              }
              className="text-sm border border-input rounded-lg bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-fit"
              aria-label="Sort by"
            >
              <option value="recommended">Recommended</option>
              <option value="price">Price (low to high)</option>
              <option value="date">Newest</option>
            </select>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <SearchListing properties={properties} />
        </div>
      </div>
    </div>
  );
}

export default SearchTemplate;