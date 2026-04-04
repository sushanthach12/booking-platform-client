import type {
  BookingResponse,
  IBookingRepository,
} from "@/data/interfaces/booking.repository.interface";
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

  async checkAndCreateBooking(params: {
    propertyId: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    specialRequests?: string;
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
  }): Promise<BookingResponse> {
    const checkInDate = format(params.checkIn, "yyyy-MM-dd");
    const checkOutDate = format(params.checkOut, "yyyy-MM-dd");
    const availability = await this.repo.checkAvailability({
      propertyId: params.propertyId,
      checkInDate,
      checkOutDate,
    });
    if (!availability.available) {
      throw new Error(
        availability.message ?? "Selected dates are not available",
      );
    }
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
    });
  }
}
