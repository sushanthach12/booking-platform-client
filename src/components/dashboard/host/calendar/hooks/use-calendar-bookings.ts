"use client";

import { getBookingUseCase } from "@/domain/di";
import type { HostBookingSummary } from "@/domain/entities";
import { useEffect, useState } from "react";
import { buildMonthGrid, toKey } from "../utils/calendar.utils";

/** A month rarely holds more than this many stays. */
const FETCH_LIMIT = 100;

/**
 * Loads the host's bookings for the visible month only (the 6-week grid window),
 * so each calendar view fetches a bounded slice instead of the whole history.
 * Results are cached per month, so paging back to a visited month is instant
 * with no extra request.
 */
export function useCalendarBookings(year: number, month: number) {
  const [cache, setCache] = useState<Record<string, HostBookingSummary[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = `${year}-${month}`;
  const cached = cache[key];

  useEffect(() => {
    if (cached) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const grid = buildMonthGrid(year, month);
        const result = await getBookingUseCase().getHostBookings({
          page: 1,
          limit: FETCH_LIMIT,
          startDate: toKey(grid[0]),
          endDate: toKey(grid[grid.length - 1]),
        });
        if (!cancelled)
          setCache((prev) => ({
            ...prev,
            [key]: result.bookings as HostBookingSummary[],
          }));
      } catch {
        if (!cancelled) setError("We couldn't load your calendar. Try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const everLoaded = Object.keys(cache).length > 0;

  return {
    bookings: cached ?? [],
    /** True only on the very first fetch — drives the full-page skeleton. */
    initialLoading: loading && !everLoaded,
    /** True while fetching a not-yet-cached month — drives a subtle inline hint. */
    fetching: loading && !cached,
    error,
  };
}
