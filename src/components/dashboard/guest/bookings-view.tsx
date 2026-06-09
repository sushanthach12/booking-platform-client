"use client";

import { BookingsTab } from "@/components/account/bookings-tab";
import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { GuestBooking } from "@/domain/entities";
import { apiFetch } from "@/domain/http";
import { useCallback, useEffect, useRef, useState } from "react";

type BookingTab = "upcoming" | "past";

export interface BookingsSummary {
  upcomingCount: number;
  pastCount: number;
  totalSpent: number;
  currency: string;
  uniqueLocations: number;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  length: number;
}

function mapRawToGuestBooking(raw: Record<string, unknown>): GuestBooking {
  return {
    id: String(raw.id ?? ""),
    propertyId: String(raw.propertyId ?? ""),
    propertyName: String(
      raw.propertyTitle ?? raw.propertyName ?? "Unknown Property",
    ),
    location: String(raw.locationLabel ?? raw.location ?? ""),
    checkIn: String(raw.checkInDate ?? raw.checkIn ?? ""),
    checkOut: String(raw.checkOutDate ?? raw.checkOut ?? ""),
    guests: typeof raw.guestCount === "number" ? raw.guestCount : 1,
    totalAmount:
      typeof raw.totalPrice === "number"
        ? raw.totalPrice
        : typeof raw.totalAmount === "number"
          ? raw.totalAmount
          : 0,
    currency: String(raw.currency ?? "USD"),
    status: (raw.status as GuestBooking["status"]) ?? "pending",
    coverImage:
      (typeof raw.propertyImage === "string" && raw.propertyImage) ||
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    reviewLeft:
      typeof raw.reviewLeft === "boolean" ? raw.reviewLeft : undefined,
  };
}

async function fetchBookings(tab: BookingTab, page: number, limit: number) {
  const params = new URLSearchParams({
    tab,
    page: String(page),
    limit: String(limit),
  });
  const res = await apiFetch(
    `${apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.ROOT)}?${params}`,
    { cache: "no-store" },
  );
  if (!res.ok) return { bookings: [], pagination: null };

  try {
    const json = (await res.json()) as {
      data?: { bookings?: unknown[]; pagination?: PaginationMeta };
    };
    const rows = json.data?.bookings ?? [];
    return {
      bookings: rows.map((r) =>
        mapRawToGuestBooking(
          typeof r === "object" && r ? (r as Record<string, unknown>) : {},
        ),
      ),
      pagination: json.data?.pagination ?? null,
    };
  } catch {
    return { bookings: [], pagination: null };
  }
}

async function fetchSummary(): Promise<BookingsSummary> {
  const fallback: BookingsSummary = {
    upcomingCount: 0,
    pastCount: 0,
    totalSpent: 0,
    currency: "USD",
    uniqueLocations: 0,
  };

  try {
    const res = await apiFetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.SUMMARY),
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return fallback;
    const json = (await res.json()) as { data?: BookingsSummary };
    return json.data ?? fallback;
  } catch {
    return fallback;
  }
}

export function BookingsView() {
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [bookings, setBookings] = useState<GuestBooking[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<BookingsSummary | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (tab: BookingTab, p: number, lim: number) => {
    abortRef.current?.abort();
    setLoading(true);
    setBookings([]);
    const data = await fetchBookings(tab, p, lim);
    setBookings(data.bookings);
    setPagination(data.pagination);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSummary().then(setSummary);
  }, []);

  useEffect(() => {
    load(activeTab, page, limit);
  }, [activeTab, page, limit, load]);

  const handleTabChange = (tab: BookingTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (lim: number) => {
    setLimit(lim);
    setPage(1);
  };

  return (
    <div className="flex flex-col flex-1 w-full px-6 lg:px-10 py-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Bookings</h1>
      <BookingsTab
        bookings={bookings}
        pagination={pagination}
        summary={summary}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        loading={loading}
      />
    </div>
  );
}
