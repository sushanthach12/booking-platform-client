"use client";

import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import { getBookingUseCase } from "@/domain/di";
import type { HostBookingSummary } from "@/domain/entities";
import { apiFetch } from "@/lib/utils/api-fetch";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { useCallback, useEffect, useState } from "react";

const PAGE_SIZE = 10;

export function useHostReservations() {
  const [bookings, setBookings] = useState<HostBookingSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [decliningId, setDecliningId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const result = await getBookingUseCase().getHostBookings({ page, limit: PAGE_SIZE });
        if (!cancelled) {
          setBookings(result.bookings as HostBookingSummary[]);
          setTotal(result.total);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const updateStatus = useCallback(
    async (bookingId: string, status: "accepted" | "declined" | "cancelled") => {
      const res = await apiFetch(
        apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.UPDATE_STATUS(bookingId)),
        {
          method: "PATCH",
          headers: getJsonHeaders(),
          body: JSON.stringify({ status }),
        },
      );
      if (res.ok) {
        const mapped = status === "accepted" ? "confirmed" : status === "declined" ? "declined" : "cancelled";
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: mapped } : b)),
        );
      }
    },
    [],
  );

  const cancelBooking = useCallback(async (id: string) => {
    setActionId(id);
    try { await updateStatus(id, "cancelled"); }
    finally { setActionId(null); }
  }, [updateStatus]);

  const confirmBooking = useCallback(async (id: string) => {
    setConfirmingId(id);
    try { await updateStatus(id, "accepted"); }
    finally { setConfirmingId(null); }
  }, [updateStatus]);

  const declineBooking = useCallback(async (id: string) => {
    setDecliningId(id);
    try { await updateStatus(id, "declined"); }
    finally { setDecliningId(null); }
  }, [updateStatus]);

  return {
    bookings,
    total,
    page,
    totalPages,
    pageSize: PAGE_SIZE,
    setPage,
    loading,
    actionId,
    confirmingId,
    decliningId,
    updateStatus,
    cancelBooking,
    confirmBooking,
    declineBooking,
  };
}
