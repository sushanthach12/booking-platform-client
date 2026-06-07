"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { HostBookingSummary } from "@/domain/entities";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { format, parseISO } from "date-fns";

interface RecentBookingsProps {
  bookings: HostBookingSummary[];
  onViewAll: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  completed: "border-slate-200 bg-slate-100 text-slate-600",
  cancelled: "border-red-200 bg-red-50 text-red-600",
};

const AVATAR_TINTS = [
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-rose-100 text-rose-600",
  "bg-amber-100 text-amber-600",
  "bg-violet-100 text-violet-600",
  "bg-cyan-100 text-cyan-600",
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "G";
}

function tintFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return AVATAR_TINTS[Math.abs(hash) % AVATAR_TINTS.length];
}

function dateRange(checkIn?: string, checkOut?: string): string {
  if (!checkIn || !checkOut) return "—";
  return `${format(parseISO(checkIn), "MMM d")} – ${format(parseISO(checkOut), "MMM d")}`;
}

/** Recent bookings as a clickable table with guest avatars and status badges. */
export function RecentBookings({ bookings, onViewAll }: RecentBookingsProps) {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Recent Bookings</h2>
          {bookings.length > 0 && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all →
            </button>
          )}
        </div>

        {bookings.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            No bookings yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3 font-medium">Guest</th>
                  <th className="pb-3 font-medium">Listing</th>
                  <th className="pb-3 font-medium">Dates</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
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
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar size="sm">
                            <AvatarFallback
                              className={cn("text-[10px]", tintFor(name))}
                            >
                              {initials(name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-slate-800">
                            {name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {b.propertyName ?? "—"}
                      </td>
                      <td className="py-3 pr-4 text-slate-500">
                        {dateRange(b.checkIn, b.checkOut)}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-slate-800">
                        {b.totalAmount != null
                          ? formatCurrency(b.totalAmount, b.currency ?? "USD", 0)
                          : "—"}
                      </td>
                      <td className="py-3">
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
        )}
      </CardContent>
    </Card>
  );
}
