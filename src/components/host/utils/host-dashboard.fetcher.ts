import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { HostBookingSummary, HostListingSummary } from "@/domain/entities";
import {
  mapRawToHostBooking,
  mapRawToHostListing,
} from "./host-dashboard.mappers";

export interface HostDashboardData {
  listings: HostListingSummary[];
  draftListings: HostListingSummary[];
  bookings: HostBookingSummary[];
  listingsError: boolean;
  draftListingsError: boolean;
  bookingsError: boolean;
}

export async function fetchHostDashboardData(
  token: string,
): Promise<HostDashboardData> {
  const headers = { Authorization: `JWT ${token}` };

  const [listingsResult, draftListingsResult, bookingsResult] =
    await Promise.allSettled([
      fetch(`${apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.HOST_ME)}?limit=50`, {
        headers,
        cache: "no-store",
      }),
      fetch(
        `${apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.HOST_ME)}?limit=50&status=draft`,
        { headers, cache: "no-store" },
      ),
      fetch(`${apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.HOST)}?limit=50`, {
        headers,
        cache: "no-store",
      }),
    ]);

  let listings: HostListingSummary[] = [];
  let listingsError = false;
  if (listingsResult.status === "fulfilled" && listingsResult.value.ok) {
    try {
      const json = (await listingsResult.value.json()) as {
        data?: { results?: unknown[] };
      };
      const results = json.data?.results;
      if (Array.isArray(results)) {
        listings = results
          .map((r) =>
            mapRawToHostListing(
              typeof r === "object" && r ? (r as Record<string, unknown>) : {},
            ),
          )
          .filter((l) => l.status !== "draft");
      }
    } catch {
      listingsError = true;
    }
  } else {
    listingsError = true;
  }

  let draftListings: HostListingSummary[] = [];
  let draftListingsError = false;
  if (
    draftListingsResult.status === "fulfilled" &&
    draftListingsResult.value.ok
  ) {
    try {
      const json = (await draftListingsResult.value.json()) as {
        data?: { results?: unknown[] };
      };
      const results = json.data?.results;
      if (Array.isArray(results)) {
        draftListings = results.map((r) =>
          mapRawToHostListing(
            typeof r === "object" && r ? (r as Record<string, unknown>) : {},
          ),
        );
      }
    } catch {
      draftListingsError = true;
    }
  } else {
    draftListingsError = true;
  }

  let bookings: HostBookingSummary[] = [];
  let bookingsError = false;
  if (bookingsResult.status === "fulfilled" && bookingsResult.value.ok) {
    try {
      const json = (await bookingsResult.value.json()) as {
        data?: { bookings?: unknown[] };
      };
      const rows = json.data?.bookings;
      if (Array.isArray(rows)) {
        bookings = rows.map((r) =>
          mapRawToHostBooking(
            typeof r === "object" && r ? (r as Record<string, unknown>) : {},
          ),
        );
      }
    } catch {
      bookingsError = true;
    }
  } else {
    bookingsError = true;
  }

  return {
    listings,
    draftListings,
    bookings,
    listingsError,
    draftListingsError,
    bookingsError,
  };
}
