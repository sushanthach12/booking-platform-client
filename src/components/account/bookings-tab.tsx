"use client";

import { Button } from "@/components/ui/button";
import { GuestBooking } from "@/domain/entities";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { BookingCard } from "./booking-card";

interface BookingsTabProps {
  upcoming: GuestBooking[];
  past: GuestBooking[];
  cancellingId: string | null;
  onCancel: (id: string) => void;
}

export function BookingsTab({ upcoming, past, cancellingId, onCancel }: BookingsTabProps) {
  if (upcoming.length === 0 && past.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <Calendar className="size-10 mx-auto mb-3 opacity-30" />
        <p className="font-semibold text-slate-600">No bookings yet</p>
        <p className="text-sm mt-1">Start exploring and book your first stay.</p>
        <Button asChild className="mt-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white">
          <Link href="/search">Browse properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">
            Upcoming
          </h2>
          <div className="space-y-3">
            {upcoming.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancel={onCancel}
                cancellingId={cancellingId}
              />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">
            Past trips
          </h2>
          <div className="space-y-3">
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
