"use client";

import { useCallback, useState } from "react";

export interface SearchFiltersState {
  priceRange: [number, number];
  propertyTypes: string[];
  amenities: string[];
  rating: string;
}

const defaultFilters: SearchFiltersState = {
  priceRange: [50, 500],
  propertyTypes: [],
  amenities: [],
  rating: "",
};

export function useSearchFilters() {
  const [filters, setFilters] = useState<SearchFiltersState>(defaultFilters);

  const updateFilters = useCallback((next: Partial<SearchFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return { filters, updateFilters, clearFilters };
}
