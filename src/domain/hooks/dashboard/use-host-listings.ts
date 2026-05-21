"use client";

import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { HostListingSummary } from "@/domain/entities";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { useEffect, useState } from "react";

export function useHostListings() {
  const [listings, setListings] = useState<HostListingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.HOST_ME),
          {
            headers: getJsonHeaders(),
          },
        );
        if (!res.ok) throw new Error("Failed to load listings");
        const json: { data?: { results?: HostListingSummary[] } } =
          await res.json();
        const data = Array.isArray(json.data?.results) ? json.data.results : [];
        if (!cancelled) setListings(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load listings",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = statusFilter
    ? listings.filter((l) => l.status === statusFilter)
    : listings;

  return {
    listings: filtered,
    allListings: listings,
    loading,
    error,
    statusFilter,
    setStatusFilter,
  };
}
