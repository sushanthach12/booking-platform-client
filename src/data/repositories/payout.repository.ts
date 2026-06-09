import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type {
  IAddPayoutAccountInput,
  IEarningsPoint,
  IPayout,
  IPayoutAccount,
  IPayoutEarnings,
  IPayoutRepository,
  IPayoutSummary,
  IPayoutUpcoming,
} from "@/domain/interfaces";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { request } from "@/domain/http";
import "reflect-metadata";
import { injectable } from "tsyringe";

@injectable()
export class PayoutRepository implements IPayoutRepository {
  async getPayouts(params?: { page?: number; limit?: number }): Promise<{
    items: IPayout[];
    total: number;
    page: number;
    limit: number;
  }> {
    const q = new URLSearchParams();
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.limit != null) q.set("limit", String(params.limit));
    const url = `${apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.ROOT)}${q.toString() ? `?${q}` : ""}`;
    const json = await request<{
      data?: IPayout[];
      meta?: { total: number; page: number; limit: number };
    }>(url, {
      headers: getJsonHeaders(),
      fallbackMessage: "Failed to load payouts",
    });
    return {
      items: Array.isArray(json.data) ? json.data : [],
      total: json.meta?.total ?? 0,
      page: json.meta?.page ?? 1,
      limit: json.meta?.limit ?? 20,
    };
  }

  async getUpcoming(): Promise<IPayoutUpcoming | null> {
    const json = await request<{ data: IPayoutUpcoming | null }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.UPCOMING),
      {
        headers: getJsonHeaders(),
        fallbackMessage: "Failed to load upcoming payout",
      },
    );
    return json.data ?? null;
  }

  async getAccounts(): Promise<IPayoutAccount[]> {
    const json = await request<{ data?: IPayoutAccount[] }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.ACCOUNTS),
      {
        headers: getJsonHeaders(),
        fallbackMessage: "Failed to load payout accounts",
      },
    );
    return Array.isArray(json.data) ? json.data : [];
  }

  async addAccount(input: IAddPayoutAccountInput): Promise<IPayoutAccount> {
    const json = await request<{ data: IPayoutAccount }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.ACCOUNTS),
      {
        method: "POST",
        headers: getJsonHeaders(),
        body: JSON.stringify(input),
        fallbackMessage: "Failed to add payout account",
      },
    );
    return json.data;
  }

  async getSummary(): Promise<IPayoutSummary> {
    const json = await request<{ data?: Partial<IPayoutSummary> }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.SUMMARY),
      {
        headers: getJsonHeaders(),
        fallbackMessage: "Failed to load payout summary",
      },
    );
    return {
      totalPaidOut: json.data?.totalPaidOut ?? 0,
      paidOutSince: json.data?.paidOutSince ?? null,
      thisMonth: json.data?.thisMonth ?? 0,
      currency: json.data?.currency ?? "INR",
    };
  }

  async getEarnings(months = 7): Promise<IPayoutEarnings> {
    const url = `${apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.EARNINGS)}?months=${months}`;
    const json = await request<{
      data?: {
        points?: IEarningsPoint[];
        currency?: string;
        yoyChange?: number | null;
      };
    }>(url, {
      headers: getJsonHeaders(),
      fallbackMessage: "Failed to load earnings",
    });
    return {
      points: Array.isArray(json.data?.points) ? json.data.points : [],
      currency: json.data?.currency ?? "INR",
      yoyChange: json.data?.yoyChange ?? null,
    };
  }
}
