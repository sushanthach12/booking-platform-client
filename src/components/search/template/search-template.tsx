"use client";

import { DateRangePicker } from "@/components/shared/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowUpDown,
  ChevronDown,
  MapPin,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  SearchFilterSidebar,
  SearchFiltersState,
  SearchHeader,
  SearchListing,
  useSearch,
  useSearchFilters,
} from "..";

export const SearchTemplate = () => {
  const locationLabel = "Melbourne";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { filters, updateFilters, clearFilters } = useSearchFilters();
  const { properties, totalCount, fetchProperties } = useSearch();

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiltersChange = useCallback(
    (next: SearchFiltersState) => updateFilters(next),
    [updateFilters],
  );

  const activeFilterCount =
    filters.propertyTypes.length +
    filters.amenities.length +
    (filters.rating ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <SearchHeader />
      <main className="flex-1 overflow-hidden">
        <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden bg-stone-50">
          {/* ── Desktop sidebar ──────────────────────────────── */}
          <div className="hidden lg:block shrink-0 sticky top-0 h-[calc(100vh-4rem)] shadow-sm">
            <SearchFilterSidebar
              mobileSidebarOpen={false}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* ── Mobile sidebar overlay ──────────────────────── */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
                  <span className="font-semibold text-stone-900">Filters</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="size-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100"
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
            <div className="shrink-0 bg-white border-b border-stone-200 px-4 sm:px-6 py-3.5">
              <div className="flex items-center justify-between gap-4">
                {/* ── Left: location info only ── */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-xl bg-stone-100 border border-stone-200 shrink-0 flex items-center justify-center">
                    <MapPin className="size-4 text-stone-500" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-base font-bold text-stone-900 leading-tight truncate">
                      {totalCount} stays in{" "}
                      <span className="text-stone-900">{locationLabel}</span>
                    </h1>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {filters.dateRange?.from && filters.dateRange?.to
                        ? `${format(filters.dateRange.from, "MMM d")} – ${format(filters.dateRange.to, "MMM d")}`
                        : "Any dates"}{" "}
                      · 2 guests
                    </p>
                  </div>
                </div>

                {/* ── Right: control strip ── */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Date picker chip (shadcn DateRangePicker, chip variant) */}
                  <DateRangePicker
                    value={filters.dateRange}
                    onChange={(dateRange) => updateFilters({ dateRange })}
                    placeholder="Add dates"
                    variant="chip"
                    popoverAlign="end"
                    className="hidden sm:flex"
                  />

                  <div className="hidden sm:block h-5 w-px bg-stone-200" />

                  {/* Guests chip */}
                  <button
                    type="button"
                    className="hidden sm:flex items-center gap-2 h-9 px-3.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 bg-white hover:border-stone-300 hover:text-stone-800 transition-colors"
                  >
                    <Users className="size-3.5 text-stone-400 shrink-0" />
                    2 guests
                    <ChevronDown className="size-3 text-stone-300 shrink-0" />
                  </button>

                  <div className="hidden sm:block h-5 w-px bg-stone-200" />

                  {/* Sort dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-xl border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900 bg-white text-sm font-medium h-9"
                      >
                        <ArrowUpDown className="size-3.5 text-stone-400" />
                        <span className="hidden sm:inline">
                          {filters.sortBy === "price_asc"
                            ? "Price: low → high"
                            : "Price: high → low"}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="min-w-44 rounded-xl border-stone-200 shadow-lg"
                    >
                      <DropdownMenuCheckboxItem
                        checked={filters.sortBy === "price_asc"}
                        onCheckedChange={() =>
                          handleFiltersChange({ ...filters, sortBy: "price_asc" })
                        }
                        className="text-sm"
                      >
                        Price: low → high
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filters.sortBy === "price_desc"}
                        onCheckedChange={() =>
                          handleFiltersChange({ ...filters, sortBy: "price_desc" })
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
                      "lg:hidden flex items-center gap-2 h-9 px-3.5 rounded-xl border text-sm font-medium transition-colors",
                      activeFilterCount > 0
                        ? "bg-stone-100 border-stone-300 text-stone-700"
                        : "bg-white border-stone-200 text-stone-600 hover:border-stone-300",
                    )}
                  >
                    <SlidersHorizontal className="size-4" />
                    {activeFilterCount > 0 && (
                      <span className="size-5 rounded-full bg-stone-700 text-white text-[10px] font-bold flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Active filter chips — separate row below, only when present */}
              {filters.propertyTypes.length > 0 && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {filters.propertyTypes.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 text-stone-600 text-xs font-medium rounded-full px-3 py-1"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() =>
                          handleFiltersChange({
                            ...filters,
                            propertyTypes: filters.propertyTypes.filter(
                              (x) => x !== t,
                            ),
                          })
                        }
                        className="hover:text-stone-800 transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Results grid */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <SearchListing properties={properties} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchTemplate;
