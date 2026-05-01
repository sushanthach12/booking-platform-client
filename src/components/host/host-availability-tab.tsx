"use client";

import { Calendar } from "@/components/ui/calendar";
import { getBookingUseCase } from "@/domain/di";
import type { HostListingSummary } from "@/domain/entities";
import { useEffect, useState } from "react";

interface HostAvailabilityTabProps {
  listings: HostListingSummary[];
}

export function HostAvailabilityTab({ listings }: HostAvailabilityTabProps) {
  const [selectedId, setSelectedId] = useState<string>(listings[0]?.id ?? "");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    setLoading(true);
    getBookingUseCase()
      .getPropertyAvailability(
        selectedId,
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
      )
      .then((dates) => {
        if (cancelled) return;
        setBookedDates(dates.map((d) => new Date(d + "T00:00:00")));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId, currentMonth]);

  if (listings.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="font-semibold text-slate-600">
          No listings to show availability for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Property selector */}
      <div>
        <label
          htmlFor="avail-property"
          className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block"
        >
          Select property
        </label>
        <select
          id="avail-property"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          {listings.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar */}
      <div className="relative w-fit">
        {loading && (
          <div className="absolute inset-0 rounded-2xl bg-white/70 flex items-center justify-center z-10">
            <div className="size-6 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
          </div>
        )}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 w-fit">
          <Calendar
            mode="multiple"
            selected={bookedDates}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            modifiers={{ booked: bookedDates }}
            modifiersClassNames={{
              booked: "bg-red-100 text-red-700 rounded-md font-semibold",
            }}
            disabled
          />
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-2">
            <span className="inline-block size-3 rounded-sm bg-red-100 border border-red-200" />
            Booked dates
          </p>
        </div>
      </div>
    </div>
  );
}
