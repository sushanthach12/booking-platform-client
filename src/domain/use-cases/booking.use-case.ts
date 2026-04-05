import type {
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
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
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
      customerEmail: params.customerEmail,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      paymentMethod: params.paymentMethod,
      quoteToken: params.quoteToken,
    });
  }
}
