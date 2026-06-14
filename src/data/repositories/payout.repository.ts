import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type {
  IAddPayoutAccountInput,
  IEarningsPoint,
  IPayout,
  IPayoutAccount,
  IPayoutBalance,
  IPayoutEarnings,
  IPayoutRepository,
  IPayoutSummary,
  IPayoutUpcoming,
  IRequestPayoutResult,
} from "@/domain/interfaces";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { request, requestVoid } from "@/domain/http";
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

  async removeAccount(id: string): Promise<void> {
    await requestVoid(apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.ACCOUNT_BY_ID(id)), {
      method: "DELETE",
      headers: getJsonHeaders(),
      fallbackMessage: "Failed to remove payout account",
    });
  }

  async setPrimaryAccount(id: string): Promise<IPayoutAccount> {
    const json = await request<{ data: IPayoutAccount }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.ACCOUNT_PRIMARY(id)),
      {
        method: "PATCH",
        headers: getJsonHeaders(),
        fallbackMessage: "Failed to update primary account",
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

  async getBalance(): Promise<IPayoutBalance> {
    const json = await request<{ data?: Partial<IPayoutBalance> }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.BALANCE),
      {
        headers: getJsonHeaders(),
        fallbackMessage: "Failed to load balance",
      },
    );
    return {
      payableNow: json.data?.payableNow ?? 0,
      onHold: {
        upcoming: json.data?.onHold?.upcoming ?? 0,
        clearing: json.data?.onHold?.clearing ?? 0,
      },
      inTransit: json.data?.inTransit ?? 0,
      lifetimePaidOut: json.data?.lifetimePaidOut ?? 0,
      availableBalance: json.data?.availableBalance ?? 0,
      reserveBalance: json.data?.reserveBalance ?? 0,
      minPayoutThreshold: json.data?.minPayoutThreshold ?? 0,
      currency: json.data?.currency ?? "INR",
    };
  }

  async requestPayout(): Promise<IRequestPayoutResult> {
    const json = await request<{ data: IRequestPayoutResult }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.REQUEST),
      {
        method: "POST",
        headers: getJsonHeaders(),
        fallbackMessage: "Failed to request payout",
      },
    );
    return json.data;
  }
}
