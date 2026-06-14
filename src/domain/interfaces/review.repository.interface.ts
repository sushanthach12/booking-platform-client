/** A host's response to a guest review. */
export interface IReviewResponse {
  text: string;
  respondedAt: string;
}

/** A single guest review across the host's listings. */
export interface IHostReview {
  id: string;
  guestName: string;
  guestAvatar?: string | null;
  propertyName: string;
  rating: number;
  comment: string;
  createdAt: string;
  /** Present when the host has already replied. */
  response?: IReviewResponse | null;
}

/** The review a guest left for a booking, with the host's optional reply. */
export interface IGuestReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  /** Present when the host has replied. */
  response?: IReviewResponse | null;
}

/** Aggregate stats for the reviews summary card. */
export interface IReviewSummary {
  averageRating: number;
  totalReviews: number;
  /** Count of reviews per star value (1–5). */
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  /** Percentage of reviews the host has responded to. */
  responseRate: number;
  /** Number of reviews responded to (numerator behind responseRate). */
  respondedCount: number;
}

/** Payload a guest submits to review a completed booking. */
export interface ICreateReviewInput {
  bookingId: string;
  /** Whole-star rating, 1–5. */
  rating: number;
  comment: string;
}

export interface IReviewRepository {
  getReviews(params?: { page?: number; limit?: number }): Promise<{
    items: IHostReview[];
    total: number;
    page: number;
    limit: number;
  }>;
  getSummary(): Promise<IReviewSummary | null>;
  /** Submit (or update) the host's reply to a review; returns the saved response. */
  replyToReview(reviewId: string, text: string): Promise<IReviewResponse>;
  /** Submit a guest review for a completed booking; returns the created review. */
  createReview(input: ICreateReviewInput): Promise<IHostReview>;
  /** Fetch the review the guest left for a booking (with host reply), or null. */
  getBookingReview(bookingId: string): Promise<IGuestReview | null>;
}
