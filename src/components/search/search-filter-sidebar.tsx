"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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
    <div className="py-6">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
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

  const activeFilterCount =
    filters.propertyTypes.length +
    filters.amenities.length +
    (filters.rating ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0) +
    ((filters.bedrooms ?? 0) > 0 ? 1 : 0) +
    ((filters.bathrooms ?? 0) > 0 ? 1 : 0);

  return (
    <aside className="w-full lg:w-72 h-full flex flex-col bg-white border-r border-border">
      {/* ── Header ── */}
      {!mobileSidebarOpen && (
        <div className="px-5 py-4 shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-primary-subtle border border-border flex items-center justify-center shrink-0">
                <SlidersHorizontal className="size-4 text-primary" />
              </div>
              <h2 className="font-semibold text-foreground text-sm">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="min-w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              disabled={activeFilterCount === 0}
              className="text-xs text-muted-foreground hover:text-primary disabled:opacity-0 h-7 px-2"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}

      <Separator className="shrink-0" />

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-5 scrollbar-hide">
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
              <div className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground text-center">
                ${filters.priceRange[0]}
              </div>
              <span className="text-muted-subtle text-sm">—</span>
              <div className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground text-center">
                ${filters.priceRange[1]}
              </div>
            </div>
          </div>
        </FilterSection>

        <Separator />

        {/* Property type */}
        <FilterSection title="Property type">
          <div className="flex flex-wrap gap-1.5">
            {propertyTypes.map(({ id, label }) => {
              const active = filters.propertyTypes.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleCheckbox("propertyTypes", id, !active)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium border transition-all duration-150",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <Separator />

        {/* Amenities */}
        <FilterSection title="Amenities">
          <div className="space-y-0.5">
            {amenities.map(({ id, label, icon: Icon }) => {
              const checked = filters.amenities.includes(id);
              return (
                <label
                  key={id}
                  htmlFor={`amenity-${id}`}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer transition-colors",
                    checked ? "bg-primary-subtle" : "hover:bg-background-muted",
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
                      checked ? "border-primary bg-primary text-white" : "border-border",
                    )}
                  />
                  <Icon
                    className={cn(
                      "size-3.5 shrink-0",
                      checked ? "text-primary" : "text-muted-subtle",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm",
                      checked ? "font-medium text-primary" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </FilterSection>

        <Separator />

        {/* Minimum rating */}
        <FilterSection title="Guest rating">
          <div className="space-y-3">
            <div className="flex gap-1">
              {RATING_STEPS.map((step, i) => (
                <button
                  key={step}
                  type="button"
                  onClick={() =>
                    onFiltersChange({ ...filters, rating: i === 0 ? "" : step })
                  }
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-semibold border transition-all duration-150",
                    effectiveRatingIndex === i
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-muted-foreground border-border hover:border-primary/30 hover:text-foreground",
                  )}
                >
                  {step}
                </button>
              ))}
            </div>
            {filters.rating && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star className="size-3.5 fill-warm-accent text-warm-accent shrink-0" />
                <span>{filters.rating} and above</span>
              </div>
            )}
          </div>
        </FilterSection>
      </div>

      {/* ── Footer CTA ── */}
      <Separator className="shrink-0" />
      {!mobileSidebarOpen ? (
        <div className="shrink-0 px-5 py-4">
          <Button
            variant="default"
            size="default"
            className="w-full rounded-lg font-semibold text-sm"
          >
            Show results
          </Button>
        </div>
      ) : (
        <div className="shrink-0 px-5 py-4">
          <Button
            variant="outline"
            size="default"
            onClick={onClearFilters}
            disabled={activeFilterCount === 0}
            className="w-full rounded-lg text-sm disabled:opacity-50"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </aside>
  );
}
