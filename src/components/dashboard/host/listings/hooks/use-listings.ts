"use client";

import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import { getHostPropertyUseCase } from "@/domain/di";
import type { HostListingSummary } from "@/domain/entities";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type ListingFilter = "all" | "active" | "paused";

function isPaused(status?: string): boolean {
  return status === "paused" || status === "inactive";
}

/**
 * Loads the host's listings and provides the All/Active/Paused filter plus an
 * optimistic pause/activate toggle (persisted via the host-property use case).
 * Drafts are excluded — this screen manages published listings.
 */
export function useListings() {
  const [listings, setListings] = useState<HostListingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ListingFilter>("all");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.HOST_ME),
          { headers: getJsonHeaders() },
        );
        if (!res.ok) throw new Error("Failed to load listings");
        const json: {
          data?: {
            results?: HostListingSummary[];
            properties?: HostListingSummary[];
          };
        } = await res.json();
        const raw =
          json.data?.results ??
          json.data?.properties ??
          ([] as HostListingSummary[]);
        if (!cancelled) {
          setListings(raw.filter((l) => l.status !== "draft"));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load listings",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const paused = listings.filter((l) => isPaused(l.status)).length;
    return { all: listings.length, active: listings.length - paused, paused };
  }, [listings]);

  const filtered = useMemo(() => {
    if (filter === "active") return listings.filter((l) => !isPaused(l.status));
    if (filter === "paused") return listings.filter((l) => isPaused(l.status));
    return listings;
  }, [listings, filter]);

  const toggleStatus = useCallback(async (listing: HostListingSummary) => {
    const next = isPaused(listing.status) ? "active" : "paused";
    // Optimistic update.
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, status: next } : l)),
    );
    try {
      await getHostPropertyUseCase().setListingStatus(listing.id, next);
      toast.success(next === "paused" ? "Listing paused" : "Listing activated");
    } catch (err) {
      // Roll back on failure.
      setListings((prev) =>
        prev.map((l) =>
          l.id === listing.id ? { ...l, status: listing.status } : l,
        ),
      );
      toast.error(
        err instanceof Error ? err.message : "Failed to update listing",
      );
    }
  }, []);

  return {
    listings: filtered,
    counts,
    loading,
    error,
    filter,
    setFilter,
    toggleStatus,
  };
}
