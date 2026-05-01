// src/components/account/templates/account-template.tsx
// Async Server Component — fetches real data, passes serialisable props to AccountView

import { AccountView } from "@/components/account/account-view";
import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type {
  GuestBooking,
  GuestBookingsSummary,
  GuestProfile,
  User,
} from "@/domain/entities";
import { differenceInDays, parseISO } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function mapRawToGuestBooking(raw: Record<string, unknown>): GuestBooking {
  const property = (
    typeof raw.property === "object" && raw.property ? raw.property : {}
  ) as Record<string, unknown>;
  return {
    id: String(raw.id ?? ""),
    propertyName: String(
      raw.propertyTitle ?? property.title ?? raw.propertyName ?? "Unknown",
    ),
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
    reviewLeft:
      typeof raw.reviewLeft === "boolean" ? raw.reviewLeft : undefined,
  };
}

export async function AccountTemplate() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/signin");

  const authUserRaw = cookieStore.get("auth_user")?.value;
  let cookieUser: User | null = null;
  if (authUserRaw) {
    try {
      cookieUser = JSON.parse(authUserRaw) as User;
    } catch {
      // ignore malformed cookie
    }
  }

  const authHeaders = {
    Authorization: `JWT ${token}`,
    "Content-Type": "application/json",
  };

  // Fetch richer profile + bookings in parallel
  const [profileRes, bookingsRes] = await Promise.all([
    fetch(apiUrl(API_CONSTANTS.ENDPOINTS.USERS.PROFILE), {
      headers: authHeaders,
      cache: "no-store",
    }),
    fetch(`${apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.ROOT)}?limit=50`, {
      headers: authHeaders,
      cache: "no-store",
    }),
  ]);

  // Build GuestProfile — merge cookie user with richer API data when available
  let profile: GuestProfile = {
    id: cookieUser?.id ?? "",
    firstName: cookieUser?.firstName ?? "",
    lastName: cookieUser?.lastName ?? "",
    email: cookieUser?.email ?? "",
    phone: "",
    avatarUrl: cookieUser?.avatar ?? null,
    memberSince: cookieUser?.createdAt ?? new Date().toISOString(),
    bio: "",
    location: "",
    isVerified: false,
  };

  if (profileRes.ok) {
    try {
      const { data } = (await profileRes.json()) as {
        data: Record<string, unknown>;
      };
      profile = {
        ...profile,
        phone: typeof data.phone === "string" ? data.phone : "",
        bio: typeof data.bio === "string" ? data.bio : "",
        location: typeof data.location === "string" ? data.location : "",
        isVerified:
          typeof data.isVerified === "boolean" ? data.isVerified : false,
        avatarUrl:
          typeof data.avatar === "string" ? data.avatar : profile.avatarUrl,
      };
    } catch {
      // use cookie-based profile
    }
  }

  // Build GuestBookingsSummary
  let rawBookings: Record<string, unknown>[] = [];
  if (bookingsRes.ok) {
    try {
      const json = (await bookingsRes.json()) as {
        data?: { bookings?: unknown[] };
      };
      const rows = json.data?.bookings;
      if (Array.isArray(rows)) {
        rawBookings = rows.map((r) =>
          typeof r === "object" && r ? (r as Record<string, unknown>) : {},
        );
      }
    } catch {
      // empty bookings
    }
  }

  const allBookings = rawBookings.map(mapRawToGuestBooking);
  const upcoming = allBookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending",
  );
  const past = allBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled",
  );

  const completed = allBookings.filter((b) => b.status === "completed");
  const nightsStayed = completed.reduce((sum, b) => {
    try {
      return sum + differenceInDays(parseISO(b.checkOut), parseISO(b.checkIn));
    } catch {
      return sum;
    }
  }, 0);
  const totalSpent = allBookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const bookingsSummary: GuestBookingsSummary = {
    upcoming,
    past,
    stats: {
      totalTrips: completed.length,
      nightsStayed,
      totalSpent,
      countriesVisited: 0,
    },
  };

  return <AccountView profile={profile} bookingsSummary={bookingsSummary} />;
}
