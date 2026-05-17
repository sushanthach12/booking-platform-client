"use client";

import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import { getBookingUseCase } from "@/domain/di";
import type {
  HostBookingSummary,
  HostDashboardStats,
  HostListingSummary,
} from "@/domain/entities";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { useEffect, useState } from "react";

async function fetchHostListings(): Promise<HostListingSummary[]> {
  try {
    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.HOST_ME),
      {
        headers: getJsonHeaders(),
      },
    );
    if (!res.ok) return [];
    const json: { data?: { properties?: HostListingSummary[] } } =
      await res.json();
    return Array.isArray(json.data?.properties) ? json.data.properties : [];
  } catch {
    return [];
  }
}

export function useHostOverview() {
  const [stats, setStats] = useState<HostDashboardStats>({
    totalListings: 0,
    totalBookings: 0,
    totalRevenue: 0,
    currency: "USD",
  });
  const [recentBookings, setRecentBookings] = useState<HostBookingSummary[]>(
    [],
  );
  const [draftListings, setDraftListings] = useState<HostListingSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [rawBookings, properties] = await Promise.all([
          getBookingUseCase().getHostBookings({ limit: 5 }),
          fetchHostListings(),
        ]);

        if (cancelled) return;

        const bookings = rawBookings.bookings as HostBookingSummary[];
        const drafts = properties.filter((p) => p.status === "draft");
        const totalRevenue = bookings.reduce(
          (sum, b) => sum + (b.totalAmount ?? 0),
          0,
        );

        setStats({
          totalListings: properties.length,
          totalBookings: bookings.length,
          totalRevenue,
          currency: "USD",
        });
        setRecentBookings(bookings.slice(0, 5));
        setDraftListings(drafts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, recentBookings, draftListings, loading };
}
