"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HostBookingSummary } from "@/domain/entities";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { BookOpen, Loader2, X } from "lucide-react";

type BookingFilter = "all" | "upcoming" | "completed" | "cancelled";

interface HostBookingsTabProps {
  bookings: HostBookingSummary[];
  propertyFilter: string | null;
  onClearPropertyFilter: () => void;
  cancellingId: string | null;
  onCancel: (id: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const FILTERS: { id: BookingFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

function matchesFilter(b: HostBookingSummary, filter: BookingFilter): boolean {
  if (filter === "all") return true;
  if (filter === "upcoming")
    return b.status === "confirmed" || b.status === "pending";
  return b.status === filter;
}


export function HostBookingsTab({
  bookings,
  propertyFilter,
  onClearPropertyFilter,
  cancellingId,
  onCancel,
}: HostBookingsTabProps) {
  const [activeFilter, setActiveFilter] = React.useState<BookingFilter>("all");

  const filtered = bookings.filter(
    (b) =>
      matchesFilter(b, activeFilter) &&
      (propertyFilter == null || b.propertyId === propertyFilter),
  );

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              "px-4 py-1.5 rounded-md text-xs font-semibold transition-colors",
              activeFilter === f.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200",
            )}
          >
            {f.label}
          </button>
        ))}

        {propertyFilter && (
          <button
            onClick={onClearPropertyFilter}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            Filtered by property
            <X className="size-3" />
          </button>
        )}
      </div>

      {/* Booking rows */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="size-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-slate-600">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((b) => {
            const isCancelling = cancellingId === b.id;
            const canCancel =
              b.status === "confirmed" || b.status === "pending";
            return (
              <div
                key={b.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {b.propertyName ?? b.bookingNumber ?? b.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {b.checkIn && b.checkOut
                      ? `${b.checkIn} → ${b.checkOut}`
                      : null}
                    {b.guestCount != null ? ` · ${b.guestCount} guests` : null}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {b.totalAmount != null && (
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(b.totalAmount, b.currency ?? "USD")}
                    </span>
                  )}
                  {b.status && (
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold capitalize ${STATUS_COLORS[b.status] ?? ""}`}
                    >
                      {b.status}
                    </Badge>
                  )}
                  {canCancel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isCancelling}
                      onClick={() => onCancel(b.id)}
                      className="h-7 text-[11px] rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {isCancelling ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        "Cancel"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// React needs to be in scope for useState
import React from "react";
