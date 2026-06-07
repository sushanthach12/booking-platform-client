"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { HostBookingSummary } from "@/domain/entities";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { differenceInCalendarDays, format, parseISO } from "date-fns";

interface BookingsTabProps {
  bookings: HostBookingSummary[];
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  completed: "border-slate-200 bg-slate-100 text-slate-600",
  cancelled: "border-red-200 bg-red-50 text-red-600",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "G";
}

function nights(checkIn?: string, checkOut?: string): number {
  if (!checkIn || !checkOut) return 0;
  return Math.max(
    0,
    differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn)),
  );
}

function fmtDate(d?: string): string {
  return d ? format(parseISO(d), "MMM d, yyyy") : "—";
}

export function BookingsTab({ bookings }: BookingsTabProps) {
  if (bookings.length === 0) {
    return (
      <Card className="rounded-2xl border-slate-100 shadow-none">
        <CardContent className="py-16 text-center">
          <p className="mb-2 text-3xl" aria-hidden>
            📅
          </p>
          <p className="font-semibold text-slate-600">No bookings yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-100 shadow-none">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Booking ID</th>
                <th className="px-5 py-3 font-medium">Guest</th>
                <th className="px-5 py-3 font-medium">Check-in</th>
                <th className="px-5 py-3 font-medium">Check-out</th>
                <th className="px-5 py-3 font-medium">Nights</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const name = b.guestName ?? "Guest";
                return (
                  <tr
                    key={b.id}
                    className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50"
                  >
                    <td className="px-5 py-3 font-medium text-blue-600">
                      {b.bookingNumber ?? b.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar size="sm">
                          <AvatarFallback className="bg-slate-100 text-[10px] text-slate-500">
                            {initials(name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-slate-800">{name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {fmtDate(b.checkIn)}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {fmtDate(b.checkOut)}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {nights(b.checkIn, b.checkOut)}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {b.totalAmount != null
                        ? formatCurrency(b.totalAmount, b.currency ?? "USD", 0)
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      {b.status && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs capitalize",
                            STATUS_STYLES[b.status],
                          )}
                        >
                          {b.status}
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
