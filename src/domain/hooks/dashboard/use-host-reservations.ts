"use client";

import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import { getBookingUseCase } from "@/domain/di";
import type { HostBookingSummary } from "@/domain/entities";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { useCallback, useEffect, useState } from "react";

export function useHostReservations() {
  const [bookings, setBookings] = useState<HostBookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getBookingUseCase().getHostBookings();
        if (!cancelled) setBookings(data as HostBookingSummary[]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const updateStatus = useCallback(
    async (bookingId: string, status: "accepted" | "declined" | "cancelled") => {
      setActionId(bookingId);
      try {
        const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.UPDATE_STATUS(bookingId)), {
          method: "PATCH",
          headers: getJsonHeaders(),
          body: JSON.stringify({ status }),
        });
        if (res.ok) {
          const mapped = status === "accepted" ? "confirmed" : "cancelled";
          setBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? { ...b, status: mapped } : b)),
          );
        }
      } finally {
        setActionId(null);
      }
    },
    [],
  );

  const cancelBooking = useCallback(
    async (id: string) => updateStatus(id, "cancelled"),
    [updateStatus],
  );

  return { bookings, loading, actionId, updateStatus, cancelBooking };
}
