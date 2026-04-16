export interface IPayout {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  scheduledDate: string;
  paidAt: string | null;
  createdAt: string;
}

export interface IPayoutRepository {
  getPayouts(params?: { page?: number; limit?: number }): Promise<{
    items: IPayout[];
    total: number;
    page: number;
    limit: number;
  }>;
  getUpcoming(): Promise<{
    amount: number;
    currency: string;
    scheduledDate: string;
  } | null>;
}
