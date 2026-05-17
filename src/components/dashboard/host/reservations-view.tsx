"use client";

import { useState } from "react";
import { HostBookingsTab, type DateFilter } from "@/components/host/host-bookings-tab";
import { useHostReservations } from "@/domain/hooks/dashboard/use-host-reservations";
import { cn } from "@/lib/utils";

const DATE_FILTERS: { id: DateFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "this-week", label: "This week" },
];

export function ReservationsView() {
  const {
    bookings,
    loading,
    actionId,
    confirmingId,
    decliningId,
    cancelBooking,
    confirmBooking,
    declineBooking,
  } = useHostReservations();

  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-3">
            <div className="h-8 w-44 bg-slate-100 rounded-lg" />
            <div className="h-4 w-64 bg-slate-100 rounded" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reservations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage guest bookings for your properties
          </p>
        </div>

        {/* Date filter bar */}
        <div className="flex flex-wrap gap-2">
          {DATE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setDateFilter(f.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                dateFilter === f.id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        <HostBookingsTab
          bookings={bookings}
          propertyFilter={null}
          onClearPropertyFilter={() => {}}
          cancellingId={actionId}
          confirmingId={confirmingId}
          decliningId={decliningId}
          dateFilter={dateFilter}
          onCancel={cancelBooking}
          onConfirm={confirmBooking}
          onDecline={declineBooking}
        />
      </div>
    </div>
  );
}
