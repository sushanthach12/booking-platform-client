export type PaymentMethod = "online" | "pay_at_checkin";

export interface BookingRequest {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  specialRequests?: string;
  idempotencyKey: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod: PaymentMethod;
  quoteToken?: string;
}

export interface BookingResponse {
  bookingId: string;
  bookingNumber: string;
  paymentLink: string;
  paymentSessionId: string;
}

export interface CheckoutPreviewParams {
  propertyId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guestCount: number;
  roomId?: string;
}

export interface CheckoutBreakdown {
  basePricePerNight: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxRate: number;
  taxAmount: number;
  totalDiscount: number;
  grandTotal: number;
  currency: string;
}

export interface CheckoutPreviewResponse {
  quoteToken: string;
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  guestCount: number;
  breakdown: CheckoutBreakdown;
  expiresAt: string;
  availability: { available: boolean };
}

export interface BookingQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface IBookingRepository {
  previewCheckout(
    params: CheckoutPreviewParams
  ): Promise<CheckoutPreviewResponse>;
  checkAvailability(params: {
    propertyId: string;
    checkInDate: string;
    checkOutDate: string;
  }): Promise<{ available: boolean; message?: string }>;
  createBooking(request: BookingRequest): Promise<BookingResponse>;
  getBookings(params?: BookingQueryParams): Promise<unknown[]>;
  getHostBookings(params?: BookingQueryParams): Promise<unknown[]>;
  getBookingDetails(bookingId: string): Promise<unknown | null>;
  cancelBooking(bookingId: string, reason?: string): Promise<void>;
}
