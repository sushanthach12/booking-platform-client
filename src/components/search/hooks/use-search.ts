"use client";

import { getPropertyUseCase } from "@/domain/di";
import type { PropertyEntity, PropertySearchParams } from "@/domain/entities";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import type { SearchFiltersState } from "./use-search-filters";

export interface SearchState {
  properties: PropertyEntity[];
  totalCount: number;
  fetchProperties: () => Promise<void>;
  setProperties: (properties: PropertyEntity[]) => void;
  setTotalCount: (totalCount: number) => void;
}

function mapFiltersToParams(filters: SearchFiltersState): PropertySearchParams {
  const guestsTotal =
    filters.guests.adults + filters.guests.children + filters.guests.infants;
  const sortBy =
    filters.sortBy === "price_desc" ? ("price" as const) : ("price" as const);
  const sortOrder = filters.sortBy === "price_desc" ? "desc" : "asc";

  return {
    location: filters.locationQuery.trim() || undefined,
    checkIn: filters.dateRange?.from
      ? format(filters.dateRange.from, "yyyy-MM-dd")
      : undefined,
    checkOut: filters.dateRange?.to
      ? format(filters.dateRange.to, "yyyy-MM-dd")
      : undefined,
    guests: guestsTotal > 0 ? guestsTotal : undefined,
    minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    maxPrice: filters.priceRange[1] < 1000 ? filters.priceRange[1] : undefined,
    propertyType:
      filters.propertyTypes.length > 0
        ? filters.propertyTypes.map((t) => t.toLowerCase())
        : undefined,
    amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
    page: 1,
    limit: 24,
    sortBy,
    sortOrder,
  };
}

export function useSearch(filters: SearchFiltersState): SearchState {
  const [properties, setProperties] = useState<PropertyEntity[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const propertyUseCase = getPropertyUseCase();

  const fetchProperties = useCallback(async () => {
    const list = await propertyUseCase.searchProperties(
      mapFiltersToParams(filters),
    );
    setProperties(list);
    setTotalCount(list.length);
  }, [propertyUseCase, filters]);

  return {
    properties,
    totalCount,
    fetchProperties,
    setProperties,
    setTotalCount,
  };
}
