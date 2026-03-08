import type { PropertyDetailViewState } from "@/lib/utils/map-property";

export interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

/** Extended property view for book page: detail view + optional pricing extras */
export interface BookPropertyViewState extends PropertyDetailViewState {
  /** Optional weekly discount (e.g. 0.07 for 7%). Used for price breakdown. */
  weeklyDiscountPct?: number;
  /** Optional fixed taxes/fees amount for display. */
  taxes?: number;
  /** Optional cancellation deadline label (e.g. "2 April"). */
  cancellationDate?: string;
}

export interface ConfirmAndPayViewProps {
  property: BookPropertyViewState;
  /** Initial dates from URL or defaults. */
  initialCheckIn: Date;
  initialCheckOut: Date;
  /** Initial guests from URL or defaults. */
  initialGuests: GuestCount;
  /** Currency from URL (e.g. INR). */
  currency: string;
}
