"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HostBookingSummary } from "@/domain/entities";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { BookOpen, Check, Loader2, X } from "lucide-react";

type StatusFilter = "all" | "upcoming" | "completed" | "cancelled";
export type DateFilter = "all" | "today" | "tomorrow" | "this-week" | null;

interface HostBookingsTabProps {
  bookings: HostBookingSummary[];
  propertyFilter: string | null;
  onClearPropertyFilter: () => void;
  cancellingId: string | null;
  confirmingId?: string | null;
  decliningId?: string | null;
  dateFilter?: DateFilter;
  onCancel: (id: string) => void;
  onConfirm?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

function matchesStatusFilter(b: HostBookingSummary, filter: StatusFilter): boolean {
  if (filter === "all") return true;
  if (filter === "upcoming") return b.status === "confirmed" || b.status === "pending";
  return b.status === filter;
}

function matchesDateFilter(b: HostBookingSummary, filter: DateFilter): boolean {
  if (!filter || filter === "all") return true;
  if (!b.checkIn) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkIn = new Date(b.checkIn);
  checkIn.setHours(0, 0, 0, 0);

  if (filter === "today") {
    return checkIn.getTime() === today.getTime();
  }
  if (filter === "tomorrow") {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return checkIn.getTime() === tomorrow.getTime();
  }
  if (filter === "this-week") {
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);
    return checkIn >= today && checkIn <= weekEnd;
  }
  return true;
}

export function HostBookingsTab({
  bookings,
  propertyFilter,
  onClearPropertyFilter,
  cancellingId,
  confirmingId = null,
  decliningId = null,
  dateFilter = "all",
  onCancel,
  onConfirm,
  onDecline,
}: HostBookingsTabProps) {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  const filtered = bookings.filter(
    (b) =>
      matchesStatusFilter(b, activeFilter) &&
      matchesDateFilter(b, dateFilter) &&
      (propertyFilter == null || b.propertyId === propertyFilter),
  );

  return (
    <div className="space-y-4">
      {/* Status filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors",
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
          <p className="text-sm mt-1 text-slate-400">
            {activeFilter !== "all" || dateFilter !== "all"
              ? "Try adjusting your filters"
              : "Bookings will appear here once guests reserve your property"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((b) => {
            const isCancelling = cancellingId === b.id;
            const isConfirming = confirmingId === b.id;
            const isDeclining = decliningId === b.id;
            const isActing = isCancelling || isConfirming || isDeclining;
            const isPending = b.status === "pending";
            const canCancel = b.status === "confirmed";

            return (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {b.propertyName ?? b.bookingNumber ?? b.id.slice(0, 8)}
                    </p>
                    {b.status && (
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-[10px] font-semibold capitalize ${STATUS_COLORS[b.status] ?? ""}`}
                      >
                        {b.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {b.checkIn && b.checkOut
                      ? `${b.checkIn} → ${b.checkOut}`
                      : null}
                    {b.guestCount != null ? ` · ${b.guestCount} guest${b.guestCount !== 1 ? "s" : ""}` : null}
                  </p>
                  {b.bookingNumber && (
                    <p className="text-[10px] text-slate-300 font-mono">{b.bookingNumber}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {b.totalAmount != null && (
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(b.totalAmount, b.currency ?? "USD")}
                    </span>
                  )}

                  {/* Pending: Confirm + Decline */}
                  {isPending && onConfirm && (
                    <Button
                      size="sm"
                      disabled={isActing}
                      onClick={() => onConfirm(b.id)}
                      className="h-7 text-[11px] rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isConfirming ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <><Check className="size-3 mr-1" />Confirm</>
                      )}
                    </Button>
                  )}
                  {isPending && onDecline && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isActing}
                      onClick={() => onDecline(b.id)}
                      className="h-7 text-[11px] rounded-lg text-red-500 border-red-200 hover:bg-red-50"
                    >
                      {isDeclining ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        "Decline"
                      )}
                    </Button>
                  )}

                  {/* Confirmed: Cancel */}
                  {canCancel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isActing}
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
