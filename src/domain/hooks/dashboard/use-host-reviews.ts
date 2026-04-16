"use client";

import { useEffect, useState } from "react";

export interface HostReview {
  id: string;
  guestName: string;
  propertyName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function useHostReviews() {
  const [reviews, setReviews] = useState<HostReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reviews endpoint not yet implemented in backend — returns empty state
    setLoading(false);
    setReviews([]);
  }, []);

  return { reviews, loading };
}
