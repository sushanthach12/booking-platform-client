export type PayoutStatus = "pending" | "paid" | "failed" | "upcoming";

export interface IPayout {
  id: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  scheduledDate: string;
  paidAt: string | null;
  createdAt: string;
  /** Number of bookings rolled into this payout. */
  bookingCount?: number;
  /** Masked account the funds were deposited to, e.g. "4521". */
  accountLast4?: string;
}

export interface IPayoutAccount {
  id: string;
  bankName: string;
  /** e.g. "Checking account" / "Savings account". */
  accountType: string;
  last4: string;
  isPrimary: boolean;
  addedAt: string;
  currency: string;
}

export interface IPayoutUpcoming {
  amount: number;
  currency: string;
  scheduledDate: string;
}

export interface IPayoutSummary {
  /** Total ever paid out. */
  totalPaidOut: number;
  /** Date the host first started receiving payouts (ISO). */
  paidOutSince: string | null;
  /** Net earned in the current calendar month. */
  thisMonth: number;
  currency: string;
}

/** A single bar in the earnings overview chart. */
export interface IEarningsPoint {
  /** Month label, e.g. "May" or full month name. */
  month: string;
  amount: number;
}

export interface IPayoutEarnings {
  points: IEarningsPoint[];
  currency: string;
  /** Year-over-year change as a percentage (e.g. 22 for +22%). */
  yoyChange: number | null;
}

export interface IPayoutRepository {
  getPayouts(params?: { page?: number; limit?: number }): Promise<{
    items: IPayout[];
    total: number;
    page: number;
    limit: number;
  }>;
  getUpcoming(): Promise<IPayoutUpcoming | null>;
  getAccounts(): Promise<IPayoutAccount[]>;
  getSummary(): Promise<IPayoutSummary>;
  getEarnings(months?: number): Promise<IPayoutEarnings>;
}
