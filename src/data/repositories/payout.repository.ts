import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { IPayout, IPayoutRepository } from "@/domain/interfaces";
import { parseApiError } from "@/lib/utils/api-error";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import "reflect-metadata";
import { injectable } from "tsyringe";

@injectable()
export class PayoutRepository implements IPayoutRepository {
  async getPayouts(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ items: IPayout[]; total: number; page: number; limit: number }> {
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

  async getUpcoming(): Promise<{
    amount: number;
    currency: string;
    scheduledDate: string;
  } | null> {
    const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.UPCOMING), {
      headers: getJsonHeaders(),
    });
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to load upcoming payout"));
    }
    const json: { data: { amount: number; currency: string; scheduledDate: string } | null } =
      await res.json();
    return json.data ?? null;
  }
}
