"use client";

import { cn } from "@/lib/utils";
import { themeFor, type DayBooking } from "../utils/calendar.utils";

interface DayCellProps {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  bookings: DayBooking[];
  onSelect: (date: Date) => void;
}

const MAX_CHIPS = 3;

export function DayCell({
  date,
  inMonth,
  isToday,
  isSelected,
  bookings,
  onSelect,
}: DayCellProps) {
  const overflow = bookings.length - MAX_CHIPS;

  return (
    <button
      type="button"
      onClick={() => onSelect(date)}
      className={cn(
        "group relative flex flex-col gap-1 rounded-xl border p-1.5 text-left transition-all min-h-19.5 sm:min-h-24",
        "hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        inMonth ? "bg-white border-slate-200" : "bg-slate-100/70 border-slate-200/70",
        isSelected && "border-primary ring-2 ring-primary/30 bg-primary/4",
      )}
    >
      {/* Day number */}
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
          inMonth ? "text-slate-700" : "text-slate-300",
          isToday && "bg-primary text-primary-foreground",
        )}
      >
        {date.getDate()}
      </span>

      {/* Booking chips */}
      <div className="flex flex-1 flex-col gap-0.5">
        {bookings.slice(0, MAX_CHIPS).map(({ booking, role }) => {
          const theme = themeFor(booking.status);
          return (
            <span
              key={`${booking.id}-${role}`}
              className={cn(
                "flex items-center gap-1 rounded-md border px-1 py-0.5 text-[10px] font-medium leading-tight",
                theme.chip,
              )}
            >
              <span
                className={cn("h-1.5 w-1.5 shrink-0 rounded-full", theme.dot)}
              />
              <span className="truncate">
                {booking.guestName ?? booking.propertyName ?? "Booking"}
              </span>
            </span>
          );
        })}
        {overflow > 0 && (
          <span className="px-1 text-[10px] font-semibold text-slate-400">
            +{overflow} more
          </span>
        )}
      </div>
    </button>
  );
}
