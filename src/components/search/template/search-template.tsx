"use client";

import { DateRangePicker } from "@/components/shared/date-range-picker";
import { GuestSelector } from "@/components/shared/guest-selector";
import { LocationSearchInput } from "@/components/search/location-search-input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildPropertyLinkQueryString } from "@/lib/utils/booking-params";
import { cn } from "@/lib/utils";
import { ArrowUpDown, MapPin, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SearchFilterSidebar,
  SearchFiltersState,
  SearchHeader,
  SearchListing,
  useSearch,
  useSearchFilters,
} from "..";
import { useSearchParams } from "next/navigation";

export const SearchTemplate = () => {
  const params = useSearchParams();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const categoryParam = params.get("category") ?? "";

  const { filters, updateFilters, clearFilters } = useSearchFilters({
    category: categoryParam,
  });

  const locationLabel = filters.locationQuery.trim();
  const { properties, totalCount, isLoading, error, fetchProperties } =
    useSearch(filters);

  useEffect(() => {
    void fetchProperties();
  }, [fetchProperties]);

  const handleFiltersChange = useCallback(
    (next: SearchFiltersState) => updateFilters(next),
    [updateFilters],
  );

  const handleLocationChange = useCallback(
    (value: string) => updateFilters({ locationQuery: value }),
    [updateFilters],
  );

  const handleLocationSelect = useCallback(
    () => void fetchProperties(),
    [fetchProperties],
  );

  const handleLocationClear = useCallback(() => {
    updateFilters({ locationQuery: "" });
    requestAnimationFrame(() => void fetchProperties());
  }, [updateFilters, fetchProperties]);

  const activeFilterCount =
    filters.propertyTypes.length +
    filters.amenities.length +
    (filters.rating ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);

  const propertyLinkQueryString = useMemo(() => {
    const range = filters.dateRange;
    if (!range?.from || !range?.to) return undefined;
    return buildPropertyLinkQueryString({ from: range.from, to: range.to });
  }, [filters.dateRange]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <SearchHeader
        locationQuery={filters.locationQuery}
        categoryQuery={filters.categoryQuery}
        onLocationQueryChange={(value) =>
          updateFilters({ locationQuery: value })
        }
      />

      <main className="flex-1 overflow-hidden">
        <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden">
          {/* ── Desktop sidebar ──────────────────────────────── */}
          <div className="hidden lg:block shrink-0 sticky top-0 h-[calc(100vh-4rem)]">
            <SearchFilterSidebar
              mobileSidebarOpen={false}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearFilters}
              onShowResults={() => void fetchProperties()}
            />
          </div>

          {/* ── Mobile sidebar overlay ──────────────────────── */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <span className="font-semibold text-foreground text-sm">
                    Filters
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="size-8 rounded-lg text-muted-foreground hover:bg-background-muted"
                    aria-label="Close filters"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden w-full">
                  <SearchFilterSidebar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={clearFilters}
                    mobileSidebarOpen={mobileSidebarOpen}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Main content ─────────────────────────────────── */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {/* Top bar */}
            <div className="shrink-0 bg-white border-b border-border px-4 sm:px-6 py-3.5">
              <div className="flex items-center justify-between gap-4">
                {/* Left: search input + stays count */}
                <div className="flex items-center gap-3 min-w-0 flex-1 max-w-md">
                  <LocationSearchInput
                    value={filters.locationQuery}
                    onChange={handleLocationChange}
                    onSelect={handleLocationSelect}
                    onClear={handleLocationClear}
                    className="flex-1 min-w-0"
                  />
                  {locationLabel && (
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                      <div className="h-4 w-px bg-border" />
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span className="text-sm whitespace-nowrap">
                        <span className="text-muted-foreground">
                          {totalCount} stays in{" "}
                        </span>
                        <span className="font-semibold text-foreground">
                          {locationLabel}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <DateRangePicker
                    value={filters.dateRange}
                    onChange={(dateRange) => updateFilters({ dateRange })}
                    placeholder="Add dates"
                    variant="chip"
                    popoverAlign="end"
                    className="hidden sm:flex"
                  />

                  <div className="hidden sm:block h-4 w-px bg-border" />

                  <GuestSelector
                    value={filters.guests}
                    onChange={(guestCount) =>
                      updateFilters({ guests: guestCount })
                    }
                    showUserIcon
                    className="hidden sm:flex items-center gap-2 h-9 px-3.5 rounded-lg border border-border text-sm font-medium text-muted-foreground bg-white hover:border-primary/30 hover:text-foreground transition-colors w-auto min-w-0"
                  />

                  <div className="hidden sm:block h-4 w-px bg-border" />

                  {/* Sort dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-lg border-border text-muted-foreground hover:border-primary/30 hover:text-foreground bg-white text-sm font-medium h-9"
                      >
                        <ArrowUpDown className="size-3.5 text-muted-subtle" />
                        <span className="hidden sm:inline">
                          {filters.sortBy === "price_asc"
                            ? "Price: low → high"
                            : "Price: high → low"}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="min-w-44 rounded-lg border-border shadow-lg"
                    >
                      <DropdownMenuCheckboxItem
                        checked={filters.sortBy === "price_asc"}
                        onCheckedChange={() =>
                          handleFiltersChange({
                            ...filters,
                            sortBy: "price_asc",
                          })
                        }
                        className="text-sm"
                      >
                        Price: low → high
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.sortBy === "price_desc"}
                        onCheckedChange={() =>
                          handleFiltersChange({
                            ...filters,
                            sortBy: "price_desc",
                          })
                        }
                        className="text-sm"
                      >
                        Price: high → low
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile filter button */}
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(true)}
                    className={cn(
                      "lg:hidden flex items-center gap-2 h-9 px-3.5 rounded-lg border text-sm font-medium transition-colors",
                      activeFilterCount > 0
                        ? "bg-primary-subtle border-primary/30 text-primary"
                        : "bg-white border-border text-muted-foreground hover:border-primary/30 hover:text-foreground",
                    )}
                  >
                    <SlidersHorizontal className="size-4" />
                    {activeFilterCount > 0 && (
                      <span className="min-w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results grid */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-background">
              <SearchListing
                properties={properties}
                queryString={propertyLinkQueryString}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchTemplate;
