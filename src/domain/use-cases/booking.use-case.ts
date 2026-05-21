import type {
  BookingQueryParams,
  BookingResponse,
  CheckoutPreviewParams,
  CheckoutPreviewResponse,
  PaymentMethod,
} from "@/domain/entities";
import type { IBookingRepository } from "@/domain/interfaces";
import { format } from "date-fns";
import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../di/types";

@injectable()
export class BookingUseCase {
  constructor(
    @inject(TOKENS.IBookingRepository)
    private readonly repo: IBookingRepository,
  ) {}

  /**
   * Step 1: Fetch a price breakdown and signed quote token.
   * Lightweight — no DB writes, no lock.
   */
  async previewCheckout(params: {
    propertyId: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    roomId?: string;
  }): Promise<CheckoutPreviewResponse> {
    const previewParams: CheckoutPreviewParams = {
      propertyId: params.propertyId,
      checkInDate: format(params.checkIn, "yyyy-MM-dd"),
      checkOutDate: format(params.checkOut, "yyyy-MM-dd"),
      guestCount: params.guests,
      roomId: params.roomId,
    };
    return this.repo.previewCheckout(previewParams);
  }

  /** Fetch the details of a specific booking by ID (used on the status/return page). */
  async getBookingDetails(bookingId: string): Promise<unknown | null> {
    return this.repo.getBookingDetails(bookingId);
  }

  /** Lightweight status poll — returns only status + paymentStatus without fetching full details. */
  async getBookingStatus(
    bookingId: string,
  ): Promise<{ status: string; paymentStatus: string } | null> {
    return this.repo.getBookingStatus(bookingId);
  }

  /** Fetch bookings for the currently authenticated guest. */
  async getGuestBookings(params?: BookingQueryParams): Promise<unknown[]> {
    return this.repo.getBookings(params);
  }

  /** Fetch bookings for the currently authenticated host. */
  async getHostBookings(
    params?: BookingQueryParams,
  ): Promise<{ bookings: unknown[]; total: number }> {
    return this.repo.getHostBookings(params);
  }

  /** Cancel a booking by ID (guest action). */
  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    return this.repo.cancelBooking(bookingId, reason);
  }

  /** Retry payment for a pending booking — issues a new Cashfree order without re-checking availability. */
  async retryPayment(
    bookingId: string,
  ): Promise<{ paymentSessionId: string; paymentLink: string }> {
    return this.repo.retryPayment(bookingId);
  }

  /** Check if a property is available for the given date range. */
  async checkAvailability(params: {
    propertyId: string;
    checkIn: Date;
    checkOut: Date;
  }): Promise<{ available: boolean; message?: string }> {
    return this.repo.checkAvailability({
      propertyId: params.propertyId,
      checkInDate: format(params.checkIn, "yyyy-MM-dd"),
      checkOutDate: format(params.checkOut, "yyyy-MM-dd"),
    });
  }

  /** Fetch booked date strings (YYYY-MM-DD) for a property in a given month. */
  async getPropertyAvailability(
    propertyId: string,
    year: number,
    month: number,
  ): Promise<string[]> {
    return this.repo.getPropertyAvailability(propertyId, year, month);
  }

  /**
   * Step 2: Confirm booking with the selected payment method.
   * For 'online': returns paymentLink to redirect to Cashfree.
   * For 'pay_at_checkin': booking is immediately confirmed (empty paymentLink).
   */
  async confirmBooking(params: {
    propertyId: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    paymentMethod: PaymentMethod;
    quoteToken?: string;
    specialRequests?: string;
  }): Promise<BookingResponse> {
    const checkInDate = format(params.checkIn, "yyyy-MM-dd");
    const checkOutDate = format(params.checkOut, "yyyy-MM-dd");

    return this.repo.createBooking({
      propertyId: params.propertyId,
      checkInDate,
      checkOutDate,
      guestCount: params.guests,
      specialRequests: params.specialRequests,
      idempotencyKey: crypto.randomUUID(),
      paymentMethod: params.paymentMethod,
      quoteToken: params.quoteToken,
    });
  }
}
