import type {
  ICreateReviewInput,
  IHostReview,
  IReviewRepository,
  IReviewResponse,
  IReviewSummary,
} from "@/domain/interfaces";
import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../di/types";

@injectable()
export class ReviewUseCase {
  constructor(
    @inject(TOKENS.IReviewRepository)
    private readonly repo: IReviewRepository,
  ) {}

  async getReviews(params?: { page?: number; limit?: number }): Promise<{
    items: IHostReview[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.repo.getReviews(params);
  }

  async getSummary(): Promise<IReviewSummary | null> {
    return this.repo.getSummary();
  }

  async replyToReview(
    reviewId: string,
    text: string,
  ): Promise<IReviewResponse> {
    const trimmed = text.trim();
    if (!trimmed) throw new Error("Reply cannot be empty");
    return this.repo.replyToReview(reviewId, trimmed);
  }

  async createReview(input: ICreateReviewInput): Promise<IHostReview> {
    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
      throw new Error("Please select a rating between 1 and 5 stars");
    }
    const comment = input.comment.trim();
    if (!comment) throw new Error("Please write a few words about your stay");
    return this.repo.createReview({ ...input, comment });
  }
}
