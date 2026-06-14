export type PayoutStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "upcoming";

/** Cashfree beneficiary verification state for a payout account. */
export type BeneficiaryStatus = "verified" | "initiated" | "invalid" | "failed";

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
  /** e.g. "Bank account" / "UPI". */
  accountType: string;
  last4: string;
  isPrimary: boolean;
  addedAt: string;
  currency: string;
  /** Cashfree verification state; payouts allowed only when "verified". */
  beneficiaryStatus?: BeneficiaryStatus;
}

/**
 * Host earnings balance behind the Payout screen.
 */
export interface IPayoutBalance {
  /** Withdrawable now (available − reserve, gated by the threshold). */
  payableNow: number;
  /** Incoming, not yet payable. */
  onHold: {
    /** From confirmed bookings whose stay hasn't finished. */
    upcoming: number;
    /** Completed, releasing after the grace window. */
    clearing: number;
  };
  /** Dispatched, awaiting confirmation. */
  inTransit: number;
  lifetimePaidOut: number;
  availableBalance: number;
  reserveBalance: number;
  minPayoutThreshold: number;
  currency: string;
}

/** Result of requesting a host-initiated payout. */
export interface IRequestPayoutResult {
  payoutId: string;
  amount: number;
  status: PayoutStatus;
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

/** Payload to link a new bank account for payouts (India/INR). */
export interface IAddPayoutAccountInput {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
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
  addAccount(input: IAddPayoutAccountInput): Promise<IPayoutAccount>;
  getSummary(): Promise<IPayoutSummary>;
  getEarnings(months?: number): Promise<IPayoutEarnings>;
  getBalance(): Promise<IPayoutBalance>;
  requestPayout(): Promise<IRequestPayoutResult>;
}
