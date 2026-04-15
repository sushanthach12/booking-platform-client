import type {
  BookingQueryParams,
  BookingRequest,
  BookingResponse,
  CheckoutPreviewParams,
  CheckoutPreviewResponse,
} from "@/domain/entities";

export interface IBookingRepository {
  previewCheckout(
    params: CheckoutPreviewParams,
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
  getPropertyAvailability(propertyId: string, year: number, month: number): Promise<string[]>;
}
