"use client";

import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import { getBookingUseCase, getPayoutUseCase } from "@/domain/di";
import type {
  HostBookingSummary,
  HostKpi,
  HostListingSummary,
  HostQuickStats,
  HostUpcomingEvent,
} from "@/domain/entities";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { formatCurrency } from "@/lib/utils/currency";
import { toastError } from "@/lib/utils/toast";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { useCallback, useEffect, useState } from "react";

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

function isActiveStatus(status?: string): boolean {
  return status === "confirmed" || status === "pending";
}

/** Returns events (check-in / check-out) that fall within the next 7 days. */
function deriveUpcoming(bookings: HostBookingSummary[]): HostUpcomingEvent[] {
  const now = new Date();
  const events: HostUpcomingEvent[] = [];

  for (const b of bookings) {
    const guestName = b.guestName ?? "Guest";
    const propertyName = b.propertyName ?? "Listing";
    for (const [type, date] of [
      ["check-in", b.checkIn],
      ["check-out", b.checkOut],
    ] as const) {
      if (!date) continue;
      const diff = differenceInCalendarDays(parseISO(date), now);
      if (diff >= 0 && diff <= 7) {
        events.push({
          id: `${b.id}-${type}`,
          guestName,
          propertyName,
          type,
          date,
        });
      }
    }
  }

  return events.sort(
    (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime(),
  );
}

interface OverviewState {
  greeting: string;
  kpis: HostKpi[];
  recentBookings: HostBookingSummary[];
  upcoming: HostUpcomingEvent[];
  quickStats: HostQuickStats;
  loading: boolean;
}

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const EMPTY_QUICK_STATS: HostQuickStats = {
  activeListings: 0,
  totalListings: 0,
  responseRate: 0,
  acceptanceRate: 0,
};

/**
 * Aggregates the host overview screen: headline KPIs, recent bookings, the
 * next-7-days check-in/out feed, and operational quick stats. Earnings come
 * from the payout summary; the rest is derived from bookings + listings.
 * Metrics the backend doesn't expose yet (occupancy, response/acceptance rate)
 * fall back to safe zeros rather than fabricating numbers.
 */
export function useOverview() {
  const [state, setState] = useState<OverviewState>({
    greeting: timeGreeting(),
    kpis: [],
    recentBookings: [],
    upcoming: [],
    quickStats: EMPTY_QUICK_STATS,
    loading: true,
  });

  const load = useCallback(async (signal?: { cancelled: boolean }) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const [bookingsResult, listings, summary] = await Promise.all([
        getBookingUseCase().getHostBookings({ limit: 20 }),
        fetchHostListings(),
        getPayoutUseCase()
          .getSummary()
          .catch(() => null),
      ]);

      if (signal?.cancelled) return;

      const bookings = (bookingsResult as { bookings?: HostBookingSummary[] })
        .bookings as HostBookingSummary[];
      const currency = summary?.currency ?? bookings[0]?.currency ?? "USD";
      const activeBookings = bookings.filter((b) => isActiveStatus(b.status));
      const publishedListings = listings.filter(
        (l) => l.status === "active" || l.status === "published",
      );

      const ratings = listings.map((l) => l.rating ?? 0).filter((r) => r > 0);
      const avgRating = ratings.length
        ? ratings.reduce((s, r) => s + r, 0) / ratings.length
        : 0;
      const reviewCount = listings.reduce(
        (s, l) => s + (l.reviewCount ?? 0),
        0,
      );

      const kpis: HostKpi[] = [
        {
          key: "earnings",
          label: `${format(new Date(), "MMM")} Earnings`,
          value: formatCurrency(summary?.thisMonth ?? 0, currency, 0),
          emoji: "💰",
          delta: null,
          href: "/dashboard/host/payouts",
        },
        {
          key: "bookings",
          label: "Active Bookings",
          value: String(activeBookings.length),
          emoji: "📅",
          delta: null,
          href: "/dashboard/host/reservations",
        },
        {
          key: "occupancy",
          label: "Avg Occupancy",
          value: "—",
          emoji: "📊",
          delta: null,
          href: "/dashboard/host/calendar",
        },
        {
          key: "rating",
          label: "Overall Rating",
          value: avgRating > 0 ? avgRating.toFixed(2) : "—",
          emoji: "⭐",
          delta: null,
          caption: reviewCount > 0 ? `${reviewCount} reviews` : undefined,
          href: "/dashboard/host/reviews",
        },
      ];

      setState({
        greeting: timeGreeting(),
        kpis,
        recentBookings: bookings.slice(0, 6),
        upcoming: deriveUpcoming(bookings),
        quickStats: {
          activeListings: publishedListings.length,
          totalListings: listings.length,
          responseRate: 0,
          acceptanceRate: 0,
        },
        loading: false,
      });
    } catch (err) {
      if (signal?.cancelled) return;
      setState((prev) => ({ ...prev, loading: false }));
      toastError(err, "Failed to load overview");
    }
  }, []);

  useEffect(() => {
    const signal = { cancelled: false };
    load(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [load]);

  return { ...state, reload: useCallback(() => load(), [load]) };
}
