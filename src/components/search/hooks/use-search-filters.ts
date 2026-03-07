"use client";

import { addDays } from "date-fns";
import { useCallback, useState } from "react";
import type { DateRange } from "react-day-picker";

export interface SearchFiltersState {
  priceRange: [number, number];
  propertyTypes: string[];
  amenities: string[];
  rating: string;
  sortBy: "price_asc" | "price_desc";
  bedrooms: number;
  bathrooms: number;
  /** Check-in and check-out; stored in state only (not in URL) */
  dateRange: DateRange | undefined;
}

const defaultFilters: Omit<SearchFiltersState, "dateRange"> = {
  priceRange: [50, 500],
  propertyTypes: [],
  amenities: [],
  rating: "",
  sortBy: "price_asc",
  bedrooms: 0,
  bathrooms: 0,
};

function getDefaultDateRange(): DateRange {
  const from = new Date();
  return { from, to: addDays(from, 7) };
}

export function useSearchFilters() {
  const [filters, setFilters] = useState<SearchFiltersState>(() => ({
    ...defaultFilters,
    dateRange: getDefaultDateRange(),
  }));

  const updateFilters = useCallback((next: Partial<SearchFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      ...defaultFilters,
      dateRange: getDefaultDateRange(),
    });
  }, []);

  return { filters, updateFilters, clearFilters };
}
