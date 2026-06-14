"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { CalendarDays, Moon, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ROLE_LABEL, themeFor, type DayBooking } from "../utils/calendar.utils";

interface DayBookingsPanelProps {
  date: Date;
  bookings: DayBooking[];
}

/** How many bookings to reveal per infinite-scroll step. */
const PAGE = 10;

function formatShort(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function nights(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return null;
  const diff = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000,
  );
  return diff > 0 ? diff : null;
}

export function DayBookingsPanel({ date, bookings }: DayBookingsPanelProps) {
  const [visible, setVisible] = useState(PAGE);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reveal the next page when the sentinel scrolls into view.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || bookings.length <= visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible((v) => Math.min(v + PAGE, bookings.length));
        }
      },
      { root: scrollRef.current, rootMargin: "120px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [bookings.length, visible]);

  const shown = bookings.slice(0, visible);
  const hasMore = bookings.length > visible;

  const heading = date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <aside className="flex flex-col rounded-2xl border border-slate-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      {/* Panel header */}
      <div className="border-b border-slate-100 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Selected day
        </p>
        <h2 className="mt-0.5 text-base font-bold text-slate-800">{heading}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {bookings.length
            ? `${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`
            : "No bookings"}
        </p>
      </div>

      {/* Booking list */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-2.5 overflow-y-auto p-4 max-h-[70vh] lg:max-h-160"
      >
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays className="size-9 text-slate-200" />
            <p className="mt-3 text-sm font-semibold text-slate-600">
              Nothing on this day
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Pick another date to see its bookings.
            </p>
          </div>
        ) : (
          shown.map(({ booking, role }) => {
            const theme = themeFor(booking.status);
            const n = nights(booking.checkIn, booking.checkOut);
            return (
              <div
                key={`${booking.id}-${role}`}
                className="rounded-xl border border-slate-100 p-3 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-1 text-sm font-semibold text-slate-800">
                    {booking.guestName ?? "Guest"}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 text-[10px] font-semibold",
                      theme.badge,
                    )}
                  >
                    {ROLE_LABEL[role]}
                  </Badge>
                </div>

                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {booking.propertyName ?? "Property"}
                </p>

                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-3.5" />
                    {formatShort(booking.checkIn)} → {formatShort(booking.checkOut)}
                  </span>
                  {n && (
                    <span className="flex items-center gap-1">
                      <Moon className="size-3.5" />
                      {n}n
                    </span>
                  )}
                  {booking.guestCount != null && (
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      {booking.guestCount}
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <span className="flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full", theme.dot)} />
                    <span className="text-xs font-medium capitalize text-slate-600">
                      {booking.status ?? "booking"}
                    </span>
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {booking.totalAmount != null
                      ? formatCurrency(
                          booking.totalAmount,
                          booking.currency ?? "INR",
                        )
                      : "—"}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Infinite-scroll sentinel + count */}
        {hasMore && (
          <div
            ref={sentinelRef}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            Showing {shown.length} of {bookings.length}…
          </div>
        )}
      </div>
    </aside>
  );
}
