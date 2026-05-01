"use client";

import { getBookingUseCase } from "@/domain/di";
import type { GuestBooking } from "@/domain/entities";
import { useCallback, useState } from "react";

type BookingTab = "upcoming" | "past";

export function useGuestBookings(initial: {
  upcoming: GuestBooking[];
  past: GuestBooking[];
}) {
  const [upcoming, setUpcoming] = useState<GuestBooking[]>(initial.upcoming);
  const [past, setPast] = useState<GuestBooking[]>(initial.past);
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const cancelBooking = useCallback(async (id: string) => {
    setCancellingId(id);
    try {
      await getBookingUseCase().cancelBooking(id);
      const update = (list: GuestBooking[]) =>
        list.map((b) =>
          b.id === id ? { ...b, status: "cancelled" as const } : b,
        );
      setUpcoming(update);
      setPast(update);
    } finally {
      setCancellingId(null);
    }
  }, []);

  return {
    upcoming,
    past,
    activeTab,
    setActiveTab,
    cancellingId,
    cancelBooking,
  };
}
