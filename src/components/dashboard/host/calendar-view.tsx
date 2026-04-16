"use client";

import { HostAvailabilityTab } from "@/components/host/host-availability-tab";
import { useHostCalendar } from "@/domain/hooks/dashboard/use-host-calendar";

export function CalendarView() {
  const { listings, loading } = useHostCalendar();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-40 bg-slate-100 rounded-lg mb-6" />
          <div className="h-80 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Availability Calendar</h1>
      <HostAvailabilityTab listings={listings} />
    </div>
  );
}
