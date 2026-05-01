"use client";

import { HostBookingsTab } from "@/components/host/host-bookings-tab";
import { useHostReservations } from "@/domain/hooks/dashboard/use-host-reservations";

export function ReservationsView() {
  const { bookings, loading, actionId, cancelBooking } = useHostReservations();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-3">
          <div className="h-8 w-44 bg-slate-100 rounded-lg" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Reservations</h1>
      <HostBookingsTab
        bookings={bookings}
        propertyFilter={null}
        onClearPropertyFilter={() => {}}
        cancellingId={actionId}
        onCancel={cancelBooking}
      />
    </div>
  );
}
