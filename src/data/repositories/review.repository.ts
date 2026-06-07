import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type {
  IHostReview,
  IReviewRepository,
  IReviewResponse,
  IReviewSummary,
} from "@/domain/interfaces";
import { parseApiError } from "@/lib/utils/api-error";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import "reflect-metadata";
import { injectable } from "tsyringe";

@injectable()
export class ReviewRepository implements IReviewRepository {
  async getReviews(params?: { page?: number; limit?: number }): Promise<{
    items: IHostReview[];
    total: number;
    page: number;
    limit: number;
  }> {
    const q = new URLSearchParams();
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.limit != null) q.set("limit", String(params.limit));
    const url = `${apiUrl(API_CONSTANTS.ENDPOINTS.REVIEWS.HOST)}${q.toString() ? `?${q}` : ""}`;
    const res = await fetch(url, { headers: getJsonHeaders() });
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to load reviews"));
    }
    const json: {
      data?: IHostReview[];
      meta?: { total: number; page: number; limit: number };
    } = await res.json();
    return {
      items: Array.isArray(json.data) ? json.data : [],
      total: json.meta?.total ?? 0,
      page: json.meta?.page ?? 1,
      limit: json.meta?.limit ?? 20,
    };
  }

  async getSummary(): Promise<IReviewSummary | null> {
    const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.REVIEWS.SUMMARY), {
      headers: getJsonHeaders(),
    });
    if (!res.ok) {
      throw new Error(
        await parseApiError(res, "Failed to load review summary"),
      );
    }
    const json: { data?: IReviewSummary | null } = await res.json();
    return json.data ?? null;
  }

  async replyToReview(
    reviewId: string,
    text: string,
  ): Promise<IReviewResponse> {
    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.REVIEWS.REPLY(reviewId)),
      {
        method: "POST",
        headers: getJsonHeaders(),
        body: JSON.stringify({ text }),
      },
    );
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to submit reply"));
    }
    const json: { data?: IReviewResponse } = await res.json();
    return json.data ?? { text, respondedAt: new Date().toISOString() };
  }
}
