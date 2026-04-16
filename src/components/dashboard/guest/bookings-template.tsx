// Server Component — fetches bookings and passes initial state to BookingsView
import { BookingsView } from "./bookings-view";
import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { GuestBooking } from "@/domain/entities";
import { COOKIE_KEYS } from "@/lib/utils/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function mapRawToGuestBooking(raw: Record<string, unknown>): GuestBooking {
  const property = (typeof raw.property === "object" && raw.property
    ? raw.property
    : {}) as Record<string, unknown>;
  return {
    id: String(raw.id ?? ""),
    propertyName: String(raw.propertyTitle ?? property.title ?? raw.propertyName ?? "Unknown"),
    location: String(raw.location ?? property.location ?? ""),
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
    coverImage: String(
      property.coverImage ??
        (Array.isArray(raw.images) && raw.images[0]) ??
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    ),
    reviewLeft: typeof raw.reviewLeft === "boolean" ? raw.reviewLeft : undefined,
  };
}

export async function BookingsTemplate() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.AUTH_TOKEN)?.value;
  if (!token) redirect("/signin");

  const authHeaders = { Authorization: `JWT ${token}`, "Content-Type": "application/json" };
  const bookingsRes = await fetch(
    `${apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.ROOT)}?limit=50`,
    { headers: authHeaders, cache: "no-store" },
  );

  let rawBookings: Record<string, unknown>[] = [];
  if (bookingsRes.ok) {
    try {
      const json = (await bookingsRes.json()) as { data?: { bookings?: unknown[] } };
      const rows = json.data?.bookings;
      if (Array.isArray(rows)) {
        rawBookings = rows.map((r) =>
          typeof r === "object" && r ? (r as Record<string, unknown>) : {},
        );
      }
    } catch {
      // empty
    }
  }

  const allBookings = rawBookings.map(mapRawToGuestBooking);
  const upcoming = allBookings.filter((b) => b.status === "confirmed" || b.status === "pending");
  const past = allBookings.filter((b) => b.status === "completed" || b.status === "cancelled");

  return <BookingsView upcoming={upcoming} past={past} />;
}
