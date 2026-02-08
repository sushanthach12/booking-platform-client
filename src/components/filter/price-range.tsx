"use client";

import { cn } from "@/lib/utils";

interface PriceRangeProps {
  minPrice: string;
  maxPrice: string;
  averagePrice?: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  className?: string;
}

export function PriceRange({
  minPrice,
  maxPrice,
  averagePrice,
  onMinChange,
  onMaxChange,
  className,
}: PriceRangeProps) {
  return (
    <section
      className={cn("space-y-3", className)}
      aria-labelledby="price-range-heading"
    >
      <h2 id="price-range-heading" className="font-semibold">
        Price range.
      </h2>
      {averagePrice != null && (
        <p className="text-sm text-muted-foreground">
          The average nightly price is {averagePrice}.
        </p>
      )}
      <div className="flex gap-3">
        <div className="flex-1 space-y-1">
          <label
            htmlFor="filter-min-price"
            className="text-sm text-muted-foreground"
          >
            Min Price
          </label>
          <input
            id="filter-min-price"
            type="text"
            value={minPrice}
            onChange={(e) => onMinChange(e.target.value)}
            placeholder="$0"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex-1 space-y-1">
          <label
            htmlFor="filter-max-price"
            className="text-sm text-muted-foreground"
          >
            Max Price
          </label>
          <input
            id="filter-max-price"
            type="text"
            value={maxPrice}
            onChange={(e) => onMaxChange(e.target.value)}
            placeholder="$500+"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>
    </section>
  );
}
