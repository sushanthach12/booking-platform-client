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
import { parseApiError } from "@/lib/utils/api-error";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
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
    const res = await fetch(url, { headers: getJsonHeaders() });
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to load payouts"));
    }
    const json: {
      data?: IPayout[];
      meta?: { total: number; page: number; limit: number };
    } = await res.json();
    return {
      items: Array.isArray(json.data) ? json.data : [],
      total: json.meta?.total ?? 0,
      page: json.meta?.page ?? 1,
      limit: json.meta?.limit ?? 20,
    };
  }

  async getUpcoming(): Promise<IPayoutUpcoming | null> {
    const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.UPCOMING), {
      headers: getJsonHeaders(),
    });
    if (!res.ok) {
      throw new Error(
        await parseApiError(res, "Failed to load upcoming payout"),
      );
    }
    const json: { data: IPayoutUpcoming | null } = await res.json();
    return json.data ?? null;
  }

  async getAccounts(): Promise<IPayoutAccount[]> {
    const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.ACCOUNTS), {
      headers: getJsonHeaders(),
    });
    if (!res.ok) {
      throw new Error(
        await parseApiError(res, "Failed to load payout accounts"),
      );
    }
    const json: { data?: IPayoutAccount[] } = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  }

  async addAccount(input: IAddPayoutAccountInput): Promise<IPayoutAccount> {
    const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.ACCOUNTS), {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to add payout account"));
    }
    const json: { data: IPayoutAccount } = await res.json();
    return json.data;
  }

  async getSummary(): Promise<IPayoutSummary> {
    const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.SUMMARY), {
      headers: getJsonHeaders(),
    });
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to load payout summary"));
    }
    const json: { data?: Partial<IPayoutSummary> } = await res.json();
    return {
      totalPaidOut: json.data?.totalPaidOut ?? 0,
      paidOutSince: json.data?.paidOutSince ?? null,
      thisMonth: json.data?.thisMonth ?? 0,
      currency: json.data?.currency ?? "INR",
    };
  }

  async getEarnings(months = 7): Promise<IPayoutEarnings> {
    const url = `${apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.EARNINGS)}?months=${months}`;
    const res = await fetch(url, { headers: getJsonHeaders() });
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to load earnings"));
    }
    const json: {
      data?: {
        points?: IEarningsPoint[];
        currency?: string;
        yoyChange?: number | null;
      };
    } = await res.json();
    return {
      points: Array.isArray(json.data?.points) ? json.data.points : [],
      currency: json.data?.currency ?? "INR",
      yoyChange: json.data?.yoyChange ?? null,
    };
  }
}
