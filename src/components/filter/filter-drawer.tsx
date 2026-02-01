"use client";

import { Filter } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { PriceRange } from "./price-range";
import { RoomsBedsBaths, type RoomOption } from "./rooms-beds-baths";
import { TypeOfPlace, type PlaceType } from "./type-of-place";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  resultCount?: number;
  onApply?: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  minPrice: string;
  maxPrice: string;
  placeTypes: Set<PlaceType>;
  bedrooms: RoomOption;
  beds: RoomOption;
  baths: RoomOption;
}

const defaultState: FilterState = {
  minPrice: "$0",
  maxPrice: "$500+",
  placeTypes: new Set(),
  bedrooms: "Any",
  beds: "Any",
  baths: "Any",
};

export function FilterDrawer({
  open,
  onClose,
  resultCount = 0,
  onApply,
  className,
}: FilterDrawerProps) {
  const [state, setState] = useState<FilterState>(defaultState);

  const handleClearAll = useCallback(() => {
    setState(defaultState);
  }, []);

  const handlePlaceToggle = useCallback((value: PlaceType) => {
    setState((prev) => {
      const next = new Set(prev.placeTypes);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, placeTypes: next };
    });
  }, []);

  const handleApply = useCallback(() => {
    onApply?.(state);
    onClose();
  }, [state, onApply, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        aria-hidden
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-hidden rounded-l-xl border-l border-border bg-background shadow-xl",
          className
        )}
        role="dialog"
        aria-labelledby="filters-title"
      >
        <div className="flex flex-col overflow-y-auto p-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Filter className="size-5" aria-hidden />
              <h1 id="filters-title" className="text-xl font-bold">
                Filters
              </h1>
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-sm font-medium text-destructive hover:underline"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-6 py-6">
            <PriceRange
              minPrice={state.minPrice}
              maxPrice={state.maxPrice}
              averagePrice="$133"
              onMinChange={(v) => setState((s) => ({ ...s, minPrice: v }))}
              onMaxChange={(v) => setState((s) => ({ ...s, maxPrice: v }))}
            />
            <TypeOfPlace
              selected={state.placeTypes}
              onToggle={handlePlaceToggle}
            />
            <RoomsBedsBaths
              bedrooms={state.bedrooms}
              beds={state.beds}
              baths={state.baths}
              onBedroomsChange={(v) => setState((s) => ({ ...s, bedrooms: v }))}
              onBedsChange={(v) => setState((s) => ({ ...s, beds: v }))}
              onBathsChange={(v) => setState((s) => ({ ...s, baths: v }))}
            />
          </div>
        </div>
        <div className="shrink-0 border-t border-border p-4">
          <Button
            className="w-full rounded-full"
            onClick={handleApply}
          >
            Show {resultCount > 0 ? resultCount : "X"} Homes
          </Button>
        </div>
      </aside>
    </>
  );
}
