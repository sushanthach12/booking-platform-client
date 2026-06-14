import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type {
  ICreateReviewInput,
  IGuestReview,
  IHostReview,
  IReviewRepository,
  IReviewResponse,
  IReviewSummary,
} from "@/domain/interfaces";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { request } from "@/domain/http";
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
    const json = await request<{
      data?: IHostReview[];
      meta?: { total: number; page: number; limit: number };
    }>(url, {
      headers: getJsonHeaders(),
      fallbackMessage: "Failed to load reviews",
    });
    return {
      items: Array.isArray(json.data) ? json.data : [],
      total: json.meta?.total ?? 0,
      page: json.meta?.page ?? 1,
      limit: json.meta?.limit ?? 20,
    };
  }

  async getSummary(): Promise<IReviewSummary | null> {
    const json = await request<{ data?: IReviewSummary | null }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.REVIEWS.SUMMARY),
      {
        headers: getJsonHeaders(),
        fallbackMessage: "Failed to load review summary",
      },
    );
    return json.data ?? null;
  }

  async replyToReview(
    reviewId: string,
    text: string,
  ): Promise<IReviewResponse> {
    const json = await request<{ data?: IReviewResponse }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.REVIEWS.REPLY(reviewId)),
      {
        method: "POST",
        headers: getJsonHeaders(),
        body: JSON.stringify({ text }),
        fallbackMessage: "Failed to submit reply",
      },
    );
    return json.data ?? { text, respondedAt: new Date().toISOString() };
  }

  async getBookingReview(bookingId: string): Promise<IGuestReview | null> {
    const json = await request<{ data?: IGuestReview | null }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.REVIEWS.BOOKING(bookingId)),
      {
        headers: getJsonHeaders(),
        fallbackMessage: "Failed to load review",
      },
    );
    return json.data ?? null;
  }

  async createReview(input: ICreateReviewInput): Promise<IHostReview> {
    const json = await request<{ data: IHostReview }>(
      apiUrl(API_CONSTANTS.ENDPOINTS.REVIEWS.ROOT),
      {
        method: "POST",
        headers: getJsonHeaders(),
        body: JSON.stringify(input),
        fallbackMessage: "Failed to submit review",
      },
    );
    return json.data;
  }
}
