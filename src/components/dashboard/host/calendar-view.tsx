"use client";

import { HostAvailabilityTab } from "@/components/host/host-availability-tab";
import { useHostCalendar } from "@/domain/hooks/dashboard/use-host-calendar";

export function CalendarView() {
  const { listings, loading } = useHostCalendar();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-slate-100 rounded-lg" />
            <div className="h-4 w-64 bg-slate-100 rounded" />
            <div className="h-80 bg-white rounded-2xl border border-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Availability Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage blocked dates and availability for your properties
          </p>
        </div>
        <HostAvailabilityTab listings={listings} />
      </div>
    </div>
  );
}
