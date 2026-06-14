"use client";

import { PathBreadcrumb } from "@/components/shared/path-breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CalendarSkeleton } from "./components/calendar-skeleton";
import { DayBookingsPanel } from "./components/day-bookings-panel";
import { DayCell } from "./components/day-cell";
import { useCalendarBookings } from "./hooks/use-calendar-bookings";
import {
  buildMonthGrid,
  bucketByDay,
  isSameMonth,
  STATUS_THEME,
  toKey,
  WEEKDAYS,
} from "./utils/calendar.utils";

const LEGEND: { key: string; label: string }[] = [
  { key: "confirmed", label: "Confirmed" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export function CalendarView() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));
  const [selectedKey, setSelectedKey] = useState(() => toKey(today));

  const { bookings, initialLoading, fetching, error } = useCalendarBookings(
    cursor.year,
    cursor.month,
  );

  const byDay = useMemo(() => bucketByDay(bookings), [bookings]);
  const grid = useMemo(
    () => buildMonthGrid(cursor.year, cursor.month),
    [cursor],
  );

  const todayKey = toKey(today);
  const selectedDate = useMemo(
    () => new Date(`${selectedKey}T00:00:00`),
    [selectedKey],
  );
  const selectedBookings = byDay.get(selectedKey) ?? [];

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" },
  );

  const monthBookingCount = useMemo(() => {
    const ids = new Set<string>();
    for (const day of grid) {
      if (!isSameMonth(day, cursor.year, cursor.month)) continue;
      for (const { booking } of byDay.get(toKey(day)) ?? []) ids.add(booking.id);
    }
    return ids.size;
  }, [grid, byDay, cursor]);

  const shiftMonth = (delta: number) => {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const goToday = () => {
    setCursor({ year: today.getFullYear(), month: today.getMonth() });
    setSelectedKey(todayKey);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PathBreadcrumb
          items={[{ label: "Calendar" }]}
          actions={
            <span className="text-sm text-muted-foreground">
              {monthBookingCount} booking{monthBookingCount !== 1 ? "s" : ""} this
              month
            </span>
          }
        />

        {error ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center text-sm font-medium text-rose-600">
            {error}
          </div>
        ) : initialLoading ? (
          <CalendarSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
            {/* Calendar card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)] sm:p-4">
              {/* Toolbar */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-800">
                    {monthLabel}
                  </h2>
                  {fetching && (
                    <Loader2 className="size-4 animate-spin text-slate-400" />
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToday}
                    className="h-8 rounded-lg text-xs"
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => shiftMonth(-1)}
                    className="h-8 w-8 rounded-lg"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => shiftMonth(1)}
                    className="h-8 w-8 rounded-lg"
                    aria-label="Next month"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Weekday header */}
              <div className="mb-1.5 grid grid-cols-7 gap-1.5">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              <div
                className={cn(
                  "grid grid-cols-7 gap-1.5 transition-opacity",
                  fetching && "opacity-50",
                )}
              >
                {grid.map((day) => {
                  const key = toKey(day);
                  return (
                    <DayCell
                      key={key}
                      date={day}
                      inMonth={isSameMonth(day, cursor.year, cursor.month)}
                      isToday={key === todayKey}
                      isSelected={key === selectedKey}
                      bookings={byDay.get(key) ?? []}
                      onSelect={(d) => setSelectedKey(toKey(d))}
                    />
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
                {LEGEND.map((l) => (
                  <span
                    key={l.key}
                    className="flex items-center gap-1.5 text-xs text-slate-500"
                  >
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        STATUS_THEME[l.key].dot,
                      )}
                    />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Side panel — keyed by day so paging/scroll reset on change */}
            <DayBookingsPanel
              key={selectedKey}
              date={selectedDate}
              bookings={selectedBookings}
            />
          </div>
        )}
      </div>
    </div>
  );
}
