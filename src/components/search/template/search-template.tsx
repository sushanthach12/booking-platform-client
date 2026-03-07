"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import {
  ArrowUpDown,
  CalendarDays,
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
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0) +
    ((filters.bedrooms ?? 0) > 0 ? 1 : 0) +
    ((filters.bathrooms ?? 0) > 0 ? 1 : 0);

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <SearchHeader />

      <main className="flex flex-1 overflow-hidden">
        <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden bg-stone-50">

          {/* ── Desktop sidebar ──────────────────────────────── */}
          <div className="hidden lg:block shrink-0 sticky top-0 h-[calc(100vh-4rem)] shadow-sm">
            <SearchFilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* ── Mobile sidebar overlay ──────────────────────── */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
              />
              {/* Drawer */}
              <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
                  <span className="font-semibold text-stone-900">Filters</span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="size-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <SearchFilterSidebar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={clearFilters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Main content ─────────────────────────────────── */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">

            {/* Top bar */}
            <div className="shrink-0 bg-white border-b border-stone-200 px-4 sm:px-6 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* Location + date context */}
                <div className="flex items-start gap-3">
                  <div
                    className="size-10 rounded-xl bg-stone-100 border border-stone-200 shrink-0 flex items-center justify-center mt-0.5"
                  >
                    <MapPin className="size-4 text-stone-500" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-stone-900 leading-tight">
                      {totalCount} stays in{" "}
                      <span className="text-stone-900">{locationLabel}</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-stone-500">
                        <CalendarDays className="size-3" />
                        {format(new Date(), "MMM d")} –{" "}
                        {format(addDays(new Date(), 7), "MMM d")}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="flex items-center gap-1 text-xs text-stone-500">
                        <Users className="size-3" />
                        2 guests
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: filter pill (mobile) + sort */}
                <div className="flex items-center gap-2 flex-wrap">

                  {/* Mobile filter button */}
                  <button
                    onClick={() => setMobileSidebarOpen(true)}
                    className={cn(
                      "lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
                      activeFilterCount > 0
                        ? "bg-stone-100 border-stone-300 text-stone-700"
                        : "bg-white border-stone-200 text-stone-600 hover:border-stone-300",
                    )}
                  >
                    <SlidersHorizontal className="size-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="size-5 rounded-full bg-stone-700 text-white text-[10px] font-bold flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Sort dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-xl border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900 bg-white text-sm font-medium h-9"
                      >
                        <ArrowUpDown className="size-3.5 text-stone-400" />
                        {filters.sortBy === "price_asc"
                          ? "Price: low → high"
                          : "Price: high → low"}
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

                  {/* Active filter chips */}
                  {filters.propertyTypes.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 text-stone-600 text-xs font-medium rounded-full px-3 py-1"
                    >
                      {t}
                      <button
                        onClick={() =>
                          handleFiltersChange({
                            ...filters,
                            propertyTypes: filters.propertyTypes.filter((x) => x !== t),
                          })
                        }
                        className="hover:text-stone-800"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
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