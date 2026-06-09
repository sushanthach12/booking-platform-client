import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type {
  BookingQueryParams,
  BookingRequest,
  BookingResponse,
  CheckoutPreviewParams,
  CheckoutPreviewResponse,
} from "@/domain/entities";
import type { IBookingRepository } from "@/domain/interfaces";
import { request, requestVoid } from "@/domain/http";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import "reflect-metadata";
import { injectable } from "tsyringe";

@injectable()
export class BookingRepository implements IBookingRepository {
  async previewCheckout(
    params: CheckoutPreviewParams,
  ): Promise<CheckoutPreviewResponse> {
    const { data } = await request<{ data: CheckoutPreviewResponse }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.CHECKOUT_PREVIEW),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: params.propertyId,
          checkInDate: params.checkInDate,
          checkOutDate: params.checkOutDate,
          guestCount: params.guestCount,
          ...(params.roomId ? { roomId: params.roomId } : {}),
        }),
        fallbackMessage: "Failed to fetch price preview",
      },
    );
    return data;
  }

  async checkAvailability(params: {
    propertyId: string;
    checkInDate: string;
    checkOutDate: string;
  }): Promise<{ available: boolean; message?: string }> {
    const { data } = await request<{ data: { available: boolean } }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.CHECK_AVAILABILITY),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: params.propertyId,
          checkInDate: params.checkInDate,
          checkOutDate: params.checkOutDate,
        }),
        auth: false,
        fallbackMessage: "Availability check failed",
      },
    );
    return {
      available: data.available,
      message: data.available ? undefined : "Selected dates are not available",
    };
  }

  async createBooking(
    bookingRequest: BookingRequest,
  ): Promise<BookingResponse> {
    const { data } = await request<{ data: BookingResponse }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.ROOT),
      {
        method: "POST",
        headers: getJsonHeaders(),
        body: JSON.stringify({
          propertyId: bookingRequest.propertyId,
          checkInDate: bookingRequest.checkInDate,
          checkOutDate: bookingRequest.checkOutDate,
          guestCount: bookingRequest.guestCount,
          specialRequests: bookingRequest.specialRequests,
          idempotencyKey: bookingRequest.idempotencyKey,
          paymentMethod: bookingRequest.paymentMethod,
          quoteToken: bookingRequest.quoteToken,
        }),
        fallbackMessage: "Booking failed",
      },
    );
    return data;
  }

  async getBookings(params?: BookingQueryParams): Promise<unknown[]> {
    const q = new URLSearchParams();
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.limit != null) q.set("limit", String(params.limit));
    if (params?.status) q.set("status", params.status);
    const url = `${apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.ROOT)}${q.toString() ? `?${q}` : ""}`;
    const json = await request<{ data: { bookings?: unknown[] } }>(url, {
      headers: getJsonHeaders(),
      fallbackMessage: "Failed to load bookings",
    });
    return Array.isArray(json.data?.bookings) ? json.data.bookings : [];
  }

  async getHostBookings(
    params?: BookingQueryParams,
  ): Promise<{ bookings: unknown[]; total: number }> {
    const q = new URLSearchParams();
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.limit != null) q.set("limit", String(params.limit));
    if (params?.status) q.set("status", params.status);
    const url = `${apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.HOST)}${q.toString() ? `?${q}` : ""}`;
    const json = await request<{
      data: {
        bookings?: unknown[];
        total?: number;
        totalCount?: number;
        pagination?: { total?: number; totalCount?: number };
      };
    }>(url, {
      headers: getJsonHeaders(),
      fallbackMessage: "Failed to load host bookings",
    });
    const raw = Array.isArray(json.data?.bookings) ? json.data.bookings : [];
    const total =
      json.data?.pagination?.total ??
      json.data?.pagination?.totalCount ??
      json.data?.total ??
      json.data?.totalCount ??
      raw.length;

    // Normalize API field names → HostBookingSummary shape
    // API returns: checkInDate, checkOutDate, totalPrice, propertyTitle, guestCount, bookingNumber, status
    const bookings = raw.map((b) => {
      const r = b as Record<string, unknown>;
      const guest = (r.guest ?? {}) as Record<string, unknown>;
      const rawStatus = r.status as string | undefined;
      return {
        id: r.id as string,
        bookingNumber: (r.bookingNumber ?? r.booking_number) as
          | string
          | undefined,
        status: (rawStatus === "accepted" ? "confirmed" : rawStatus) as
          | string
          | undefined,
        checkIn: (r.checkInDate ?? r.checkIn ?? r.check_in_date) as
          | string
          | undefined,
        checkOut: (r.checkOutDate ?? r.checkOut ?? r.check_out_date) as
          | string
          | undefined,
        guestCount: (r.guestCount ?? r.numberOfGuests ?? r.guest_count) as
          | number
          | undefined,
        totalAmount: (r.totalPrice ??
          r.totalAmount ??
          r.total_amount ??
          r.grandTotal) as number | undefined,
        propertyId: r.propertyId as string | undefined,
        propertyName: (r.propertyTitle ?? r.propertyName ?? r.property_name) as
          | string
          | undefined,
        currency: r.currency as string | undefined,
        guestName: (r.guestName ??
          r.guest_name ??
          (`${guest.firstName ?? ""} ${guest.lastName ?? ""}`.trim() ||
            undefined)) as string | undefined,
      };
    });

    return { bookings, total };
  }

  async getBookingDetails(bookingId: string): Promise<unknown | null> {
    const q = new URLSearchParams({ bookingId });
    const json = await request<{ data: unknown } | null>(
      `${apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.DETAILS)}?${q}`,
      {
        headers: getJsonHeaders(),
        nullOn: [404],
        fallbackMessage: "Failed to load booking",
      },
    );
    return json ? json.data : null;
  }

  async getBookingStatus(
    bookingId: string,
  ): Promise<{ status: string; paymentStatus: string } | null> {
    const json = await request<{
      data: { status: string; paymentStatus: string };
    } | null>(apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.GET_STATUS(bookingId)), {
      headers: getJsonHeaders(),
      nullOn: [404],
      fallbackMessage: "Failed to load booking status",
    });
    return json ? json.data : null;
  }

  async retryPayment(
    bookingId: string,
  ): Promise<{ paymentSessionId: string; paymentLink: string }> {
    const json = await request<{
      data: { paymentSessionId: string; paymentLink: string };
    }>(apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.RETRY_PAYMENT(bookingId)), {
      method: "POST",
      headers: getJsonHeaders(),
      fallbackMessage: "Failed to retry payment",
    });
    return json.data;
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    await requestVoid(
      apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.CANCEL(bookingId)),
      {
        method: "PATCH",
        headers: getJsonHeaders(),
        body: JSON.stringify(reason ? { reason } : {}),
        fallbackMessage: "Cancel booking failed",
      },
    );
  }

  async getPropertyAvailability(
    propertyId: string,
    year: number,
    month: number,
  ): Promise<string[]> {
    try {
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      const q = new URLSearchParams({ propertyId, startDate, endDate });
      const json = await request<{ data?: { bookedDates?: string[] } }>(
        `${apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.AVAILABILITY_RANGE)}?${q}`,
        { headers: getJsonHeaders(), auth: false },
      );
      return Array.isArray(json.data?.bookedDates) ? json.data.bookedDates : [];
    } catch {
      return [];
    }
  }
}
