import {
  API_CONSTANTS,
  apiUrl,
} from "@/domain/constants/api.constant";
import { parseApiError } from "@/lib/utils/api-error";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import "reflect-metadata";
import { injectable } from "tsyringe";
import type {
  BookingQueryParams,
  BookingRequest,
  BookingResponse,
  IBookingRepository,
} from "../interfaces/booking.repository.interface";

@injectable()
export class BookingRepository implements IBookingRepository {
  async checkAvailability(params: {
    propertyId: string;
    checkInDate: string;
    checkOutDate: string;
  }): Promise<{ available: boolean; message?: string }> {
    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.CHECK_AVAILABILITY),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: params.propertyId,
          checkInDate: params.checkInDate,
          checkOutDate: params.checkOutDate,
        }),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Availability check failed"));
    }

    const { data }: { data: { available: boolean } } = await res.json();
    return {
      available: data.available,
      message: data.available ? undefined : "Selected dates are not available",
    };
  }

  async createBooking(request: BookingRequest): Promise<BookingResponse> {
    const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.ROOT), {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify({
        propertyId: request.propertyId,
        checkInDate: request.checkInDate,
        checkOutDate: request.checkOutDate,
        guestCount: request.guestCount,
        specialRequests: request.specialRequests,
        idempotencyKey: request.idempotencyKey,
        customerEmail: request.customerEmail,
        customerName: request.customerName,
        customerPhone: request.customerPhone,
      }),
    });

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Booking failed"));
    }

    const { data }: { data: BookingResponse } = await res.json();
    return data;
  }

  async getBookings(params?: BookingQueryParams): Promise<unknown[]> {
    const q = new URLSearchParams();
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.limit != null) q.set("limit", String(params.limit));
    if (params?.status) q.set("status", params.status);
    const url = `${apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.ROOT)}${q.toString() ? `?${q}` : ""}`;
    const res = await fetch(url, { headers: getJsonHeaders() });
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to load bookings"));
    }
    const json: {
      data: { bookings?: unknown[] };
    } = await res.json();
    return Array.isArray(json.data?.bookings) ? json.data.bookings : [];
  }

  async getHostBookings(params?: BookingQueryParams): Promise<unknown[]> {
    const q = new URLSearchParams();
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.limit != null) q.set("limit", String(params.limit));
    if (params?.status) q.set("status", params.status);
    const url = `${apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.HOST)}${q.toString() ? `?${q}` : ""}`;
    const res = await fetch(url, { headers: getJsonHeaders() });
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to load host bookings"));
    }
    const json: {
      data: { bookings?: unknown[] };
    } = await res.json();
    return Array.isArray(json.data?.bookings) ? json.data.bookings : [];
  }

  async getBookingDetails(bookingId: string): Promise<unknown | null> {
    const q = new URLSearchParams({ bookingId });
    const res = await fetch(
      `${apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.DETAILS)}?${q}`,
      { headers: getJsonHeaders() },
    );
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to load booking"));
    }
    const { data } = await res.json();
    return data;
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.CANCEL(bookingId)),
      {
        method: "PATCH",
        headers: getJsonHeaders(),
        body: JSON.stringify(reason ? { reason } : {}),
      },
    );
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Cancel booking failed"));
    }
  }
}
