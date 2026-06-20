"use client";

import { addDays } from "date-fns";
import { useCallback, useState } from "react";
import type { DateRange } from "react-day-picker";

interface UseSearchFiltersParams {
  category?: string;
  /** Initial destination, e.g. from the hero search bar's `?location=` param. */
  location?: string;
  /** Initial latitude of the searched place from the `?lat=` param. */
  latitude?: number;
  /** Initial longitude of the searched place from the `?lng=` param. */
  longitude?: number;
  /** Initial check-in date (`yyyy-MM-dd`) from the `?checkIn=` param. */
  checkIn?: string;
  /** Initial check-out date (`yyyy-MM-dd`) from the `?checkOut=` param. */
  checkOut?: string;
  /** Initial total guest count from the `?guests=` param. */
  guests?: number;
}

export interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

export interface SearchFiltersState {
  /** Location/destination query from the header search ("Where are you going?") */
  locationQuery: string;
  /** Latitude of the selected place; enables radius search instead of text match. */
  latitude: number | null;
  /** Longitude of the selected place; enables radius search instead of text match. */
  longitude: number | null;
  categoryQuery: string;
  /** Guest counts (adults, children, infants) from the guest selector */
  guests: GuestCount;
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

const defaultGuests: GuestCount = {
  adults: 1,
  children: 0,
  infants: 0,
};

const defaultFilters: Omit<SearchFiltersState, "dateRange"> = {
  locationQuery: "",
  latitude: null,
  longitude: null,
  categoryQuery: "",
  guests: defaultGuests,
  priceRange: [500, 5000],
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

/** Parse a `yyyy-MM-dd` param into a Date, or null if absent/invalid. */
function parseDateParam(value?: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Build the initial date range from URL params, falling back to the default
 * 7-day window when neither end is provided.
 */
function getInitialDateRange(checkIn?: string, checkOut?: string): DateRange {
  const from = parseDateParam(checkIn);
  const to = parseDateParam(checkOut);
  if (!from && !to) return getDefaultDateRange();
  return { from: from ?? undefined, to: to ?? undefined };
}

/** Distribute a total guest count into adults, keeping it >= 1 adult. */
function getInitialGuests(total?: number): GuestCount {
  if (!total || total < 1) return defaultGuests;
  return { adults: total, children: 0, infants: 0 };
}

export function useSearchFilters(data: UseSearchFiltersParams) {
  const [filters, setFilters] = useState<SearchFiltersState>(() => ({
    ...defaultFilters,
    dateRange: getInitialDateRange(data.checkIn, data.checkOut),
    categoryQuery: data.category || "",
    locationQuery: data.location || "",
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    guests: getInitialGuests(data.guests),
  }));

  // // update category query from url params
  // useEffect(() => {
  //   setFilters((prev) => ({ ...prev, categoryQuery: data.category || '' }));
  // }, [data.category]);

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
