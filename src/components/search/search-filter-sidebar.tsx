"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Car,
  Droplets,
  SlidersHorizontal,
  Star,
  Tv,
  Utensils,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";
import { SearchFiltersState } from "./hooks/use-search-filters";

interface SearchFilterSidebarProps {
  mobileSidebarOpen: boolean;
  filters: SearchFiltersState;
  onFiltersChange: (filters: SearchFiltersState) => void;
  onClearFilters: () => void;
}

const propertyTypes = [
  { id: "apartment", label: "Apartment" },
  { id: "house", label: "House" },
  { id: "condo", label: "Condo" },
  { id: "villa", label: "Villa" },
  { id: "studio", label: "Studio" },
  { id: "loft", label: "Loft" },
];

const amenities = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "kitchen", label: "Kitchen", icon: Utensils },
  { id: "parking", label: "Free parking", icon: Car },
  { id: "air_conditioning", label: "Air conditioning", icon: Wind },
  { id: "washer", label: "Washer", icon: Droplets },
  { id: "tv", label: "TV", icon: Tv },
  { id: "pool", label: "Pool", icon: Waves },
  { id: "heating", label: "Heating", icon: Wind },
];

const RATING_STEPS = ["Any", "3.0+", "3.5+", "4.0+", "4.5+"] as const;

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-6 border-b border-stone-100 last:border-none">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function SearchFilterSidebar({
  mobileSidebarOpen,
  filters,
  onFiltersChange,
  onClearFilters,
}: SearchFilterSidebarProps) {
  const handleCheckbox = (
    key: "propertyTypes" | "amenities",
    id: string,
    checked: boolean,
  ) => {
    onFiltersChange({
      ...filters,
      [key]: checked
        ? [...filters[key], id]
        : filters[key].filter((i) => i !== id),
    });
  };

  const ratingIndex = RATING_STEPS.indexOf(
    filters.rating as (typeof RATING_STEPS)[number],
  );
  const effectiveRatingIndex = ratingIndex === -1 ? 0 : ratingIndex;

  // const handleRoomsChange = useCallback(
  //   (key: "bedrooms" | "bathrooms", value: number) => {
  //     const current = filters[key] ?? 0;
  //     onFiltersChange({
  //       ...filters,
  //       [key]: current === value ? 0 : value,
  //     });
  //   },
  //   [filters, onFiltersChange],
  // );

  const activeFilterCount =
    filters.propertyTypes.length +
    filters.amenities.length +
    (filters.rating ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0) +
    ((filters.bedrooms ?? 0) > 0 ? 1 : 0) +
    ((filters.bathrooms ?? 0) > 0 ? 1 : 0);

  return (
    <aside className="w-full lg:w-80 h-full flex flex-col bg-white border-r border-stone-200">
      {/* ── Header ── */}
      {!mobileSidebarOpen && (
        <div className="px-6 py-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              {/* Soft terracotta tint icon box */}
              <div className="size-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="size-4 text-orange-400" />
              </div>
              <h2 className="font-semibold text-stone-900">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="size-5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {/* Always rendered — hidden via opacity when no filters active */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              disabled={activeFilterCount === 0}
              className="flex items-center gap-1 text-stone-400 hover:text-orange-500 disabled:opacity-0"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
        {/* Price range */}
        <FilterSection title="Price per night">
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(v) =>
                onFiltersChange({
                  ...filters,
                  priceRange: v as [number, number],
                })
              }
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-700 text-center">
                ${filters.priceRange[0]}
              </div>
              <span className="text-stone-300">—</span>
              <div className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-700 text-center">
                ${filters.priceRange[1]}
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Property type — pill toggles */}
        <FilterSection title="Property type">
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map(({ id, label }) => {
              const active = filters.propertyTypes.includes(id);
              return (
                <Button
                  key={id}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => handleCheckbox("propertyTypes", id, !active)}
                  className={cn(
                    "rounded-xl font-medium transition-all duration-150",
                    active
                      ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:text-stone-800",
                  )}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </FilterSection>

        {/* Amenities — icon + checkbox rows */}
        <FilterSection title="Amenities">
          <div className="space-y-0.5">
            {amenities.map(({ id, label, icon: Icon }) => {
              const checked = filters.amenities.includes(id);
              return (
                <label
                  key={id}
                  htmlFor={`amenity-${id}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors",
                    checked
                      ? "bg-orange-50 text-orange-700"
                      : "hover:bg-stone-50 text-stone-600",
                  )}
                >
                  <Checkbox
                    id={`amenity-${id}`}
                    checked={checked}
                    onCheckedChange={(c) =>
                      handleCheckbox("amenities", id, c === true)
                    }
                    className={cn(
                      "rounded-md shrink-0",
                      checked
                        ? "border-orange-400 bg-orange-400 text-white"
                        : "border-stone-300",
                    )}
                  />
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      checked ? "text-orange-400" : "text-stone-400",
                    )}
                  />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              );
            })}
          </div>
        </FilterSection>

        {/* Minimum rating — step buttons */}
        <FilterSection title="Minimum rating">
          <div className="space-y-3">
            <div className="flex gap-1.5">
              {RATING_STEPS.map((step, i) => (
                <Button
                  key={step}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() =>
                    onFiltersChange({ ...filters, rating: i === 0 ? "" : step })
                  }
                  className={cn(
                    "flex-1 py-2 rounded-xl text-xs font-semibold h-auto transition-all duration-150",
                    effectiveRatingIndex === i
                      ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                      : "bg-white text-stone-500 border-stone-200 hover:border-stone-300 hover:text-stone-700",
                  )}
                >
                  {step}
                </Button>
              ))}
            </div>
            {filters.rating && (
              <div className="flex items-center gap-1.5 text-sm text-stone-500">
                <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span>{filters.rating} & above</span>
              </div>
            )}
          </div>
        </FilterSection>

        {/* Rooms & beds */}
        {/* <FilterSection title="Rooms & beds">
          <div className="space-y-4">
            {(
              [
                { label: "Bedrooms", key: "bedrooms" as const, icon: BedDouble },
                { label: "Bathrooms", key: "bathrooms" as const, icon: Bath },
              ] as const
            ).map(({ label, key, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-stone-600 shrink-0">
                  <Icon className="size-4 text-stone-400" />
                  {label}
                </div>
                <div className="flex items-center gap-1">
                  {([0, 1, 2, 3, 4] as const).map((n) => {
                    const isActive = (filters[key] ?? 0) === n && n > 0;
                    return (
                      <Button
                        key={n}
                        variant="outline"
                        size="icon-sm"
                        type="button"
                        onClick={() => handleRoomsChange(key, n)}
                        className={cn(
                          "size-8 rounded-lg text-xs font-semibold transition-all",
                          isActive
                            ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                            : n === 0
                              ? "bg-stone-50 text-stone-400 border-stone-200"
                              : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:text-stone-800",
                        )}
                      >
                        {n === 0 ? "Any" : n === 4 ? "4+" : n}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </FilterSection> */}
      </div>

      {/* ── Footer CTA ── */}
      {!mobileSidebarOpen ? (
        <div className="shrink-0 px-6 py-4 border-t  bg-white">
          <Button
            variant="default"
            size="lg"
            className="w-full rounded-lg font-semibold text-white"
          >
            Show results
          </Button>
        </div>
      ) : (
        <div className="shrink-0 px-6 py-4 border-t bg-white">
          <Button
            variant="default"
            size="lg"
            onClick={onClearFilters}
            disabled={activeFilterCount === 0}
            className="w-full flex items-center gap-1 text-white hover:bg-orange-500 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          >
            Clear all
          </Button>
        </div>
      )}
    </aside>
  );
}
