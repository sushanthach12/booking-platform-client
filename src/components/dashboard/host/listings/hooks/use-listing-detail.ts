"use client";

import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import {
  getBookingUseCase,
  getHostPropertyUseCase,
  getReviewUseCase,
} from "@/domain/di";
import type {
  HostBookingSummary,
  HostListingSummary,
  IBecomeHostPropertyFormData,
} from "@/domain/entities";
import type { IHostReview } from "@/domain/interfaces";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

async function fetchListingSummary(
  propertyId: string,
): Promise<HostListingSummary | null> {
  try {
    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.HOST_ME),
      {
        headers: getJsonHeaders(),
      },
    );
    if (!res.ok) return null;
    const json: {
      data?: {
        results?: HostListingSummary[];
        properties?: HostListingSummary[];
      };
    } = await res.json();
    const list = json.data?.results ?? json.data?.properties ?? [];
    return list.find((l) => l.id === propertyId) ?? null;
  } catch {
    return null;
  }
}

interface ListingDetailState {
  form: IBecomeHostPropertyFormData | null;
  summary: HostListingSummary | null;
  bookings: HostBookingSummary[];
  reviews: IHostReview[];
  loading: boolean;
  error: string | null;
}

/**
 * Loads everything the listing detail page renders across its tabs: the full
 * property form (about/amenities/rules/pricing/photos), the listing summary
 * (rating, status, location), this listing's bookings, and its reviews.
 * Exposes an optimistic pause/activate toggle.
 */
export function useListingDetail(propertyId: string) {
  const [state, setState] = useState<ListingDetailState>({
    form: null,
    summary: null,
    bookings: [],
    reviews: [],
    loading: true,
    error: null,
  });

  const load = useCallback(
    async (signal?: { cancelled: boolean }) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const [edit, summary, bookingsResult, reviewsResult] =
          await Promise.all([
            getHostPropertyUseCase().getPropertyForEdit(propertyId),
            fetchListingSummary(propertyId),
            getBookingUseCase()
              .getHostBookings({ limit: 100 })
              .catch(() => ({ bookings: [] })),
            getReviewUseCase()
              .getReviews({ page: 1, limit: 50 })
              .catch(() => ({ items: [] as IHostReview[] })),
          ]);

        if (signal?.cancelled) return;

        const allBookings = (
          bookingsResult as { bookings?: HostBookingSummary[] }
        ).bookings as HostBookingSummary[];
        const bookings = allBookings.filter((b) => b.propertyId === propertyId);
        const reviewItems =
          (reviewsResult as { items?: IHostReview[] }).items ?? [];
        const reviews = reviewItems.filter(
          (r) => r.propertyName === edit?.form.title,
        );

        setState({
          form: edit?.form ?? null,
          summary,
          bookings,
          reviews,
          loading: false,
          error: edit ? null : "Listing not found",
        });
      } catch (err) {
        if (signal?.cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load listing",
        }));
      }
    },
    [propertyId],
  );

  useEffect(() => {
    const signal = { cancelled: false };
    load(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [load]);

  const toggleStatus = useCallback(async () => {
    const current = state.summary?.status;
    const next =
      current === "paused" || current === "inactive" ? "active" : "paused";
    setState((prev) => ({
      ...prev,
      summary: prev.summary ? { ...prev.summary, status: next } : prev.summary,
    }));
    try {
      await getHostPropertyUseCase().setListingStatus(propertyId, next);
      toast.success(next === "paused" ? "Listing paused" : "Listing activated");
    } catch (err) {
      setState((prev) => ({
        ...prev,
        summary: prev.summary
          ? { ...prev.summary, status: current }
          : prev.summary,
      }));
      toast.error(
        err instanceof Error ? err.message : "Failed to update listing",
      );
    }
  }, [propertyId, state.summary?.status]);

  return { ...state, reload: useCallback(() => load(), [load]), toggleStatus };
}
