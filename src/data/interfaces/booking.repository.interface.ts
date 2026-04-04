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
}

export interface BookingResponse {
  bookingId: string;
  bookingNumber: string;
  paymentLink: string;
  paymentSessionId: string;
}

export interface BookingQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface IBookingRepository {
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
