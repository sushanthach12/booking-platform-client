import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { HostBookingSummary, HostListingSummary } from "@/domain/entities";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HostDashboardView } from "../host-dashboard-view";

function mapListing(raw: Record<string, unknown>): HostListingSummary {
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? "Untitled"),
    status: raw.status != null ? String(raw.status) : undefined,
  };
}

function mapBooking(raw: Record<string, unknown>): HostBookingSummary {
  return {
    id: String(raw.id ?? ""),
    bookingNumber:
      raw.bookingNumber != null ? String(raw.bookingNumber) : undefined,
    status: raw.status != null ? String(raw.status) : undefined,
    checkIn: raw.checkInDate != null ? String(raw.checkInDate) : undefined,
    checkOut: raw.checkOutDate != null ? String(raw.checkOutDate) : undefined,
    guestCount: typeof raw.guestCount === "number" ? raw.guestCount : undefined,
    totalAmount:
      typeof raw.totalPrice === "number" ? raw.totalPrice : undefined,
  };
}

export default async function HostDashboardTemplate() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/signin");

  const headers = { Authorization: `JWT ${token}` };

  const [listingsRes, draftListingsRes, bookingsRes] = await Promise.all([
    fetch(`${apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.HOST_ME)}?limit=10`, {
      headers,
      cache: "no-store",
    }),
    fetch(
      `${apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.HOST_ME)}?limit=10&status=draft`,
      { headers, cache: "no-store" },
    ),
    fetch(`${apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.HOST)}?limit=10`, {
      headers,
      cache: "no-store",
    }),
  ]);

  let listings: HostListingSummary[] = [];
  if (listingsRes.ok) {
    const json: { data?: { results?: unknown[] } } = await listingsRes.json();
    const results = json.data?.results;
    if (Array.isArray(results)) {
      listings = results
        .map((r) =>
          mapListing(
            typeof r === "object" && r ? (r as Record<string, unknown>) : {},
          ),
        )
        .filter((l) => l.status !== "draft");
    }
  }

  let draftListings: HostListingSummary[] = [];
  if (draftListingsRes.ok) {
    const json: { data?: { results?: unknown[] } } =
      await draftListingsRes.json();
    const results = json.data?.results;
    if (Array.isArray(results)) {
      draftListings = results.map((r) =>
        mapListing(
          typeof r === "object" && r ? (r as Record<string, unknown>) : {},
        ),
      );
    }
  }

  let bookings: HostBookingSummary[] = [];
  if (bookingsRes.ok) {
    const json: { data?: { bookings?: unknown[] } } = await bookingsRes.json();
    const rows = json.data?.bookings;
    if (Array.isArray(rows)) {
      bookings = rows.map((r) =>
        mapBooking(
          typeof r === "object" && r ? (r as Record<string, unknown>) : {},
        ),
      );
    }
  }

  return (
    <HostDashboardView
      listings={listings}
      draftListings={draftListings}
      bookings={bookings}
    />
  );
}
