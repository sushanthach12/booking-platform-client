"use client";

import { useState } from "react";
import {
  HostBookingsTab,
  matchesDateFilter,
  matchesStatusFilter,
  type DateFilter,
  type StatusFilter,
} from "@/components/host/host-bookings-tab";
import { PathBreadcrumb } from "@/components/shared/path-breadcrumb";
import { Pagination } from "@/components/ui/pagination";
import { useHostReservations } from "@/domain/hooks/dashboard/use-host-reservations";
import { cn } from "@/lib/utils";

const DATE_FILTERS: { id: DateFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "this-week", label: "This week" },
];

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export function ReservationsView() {
  const {
    bookings,
    total,
    page,
    totalPages,
    pageSize,
    setPage,
    loading,
    actionId,
    confirmingId,
    decliningId,
    cancelBooking,
    confirmBooking,
    declineBooking,
  } = useHostReservations();

  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredCount = bookings.filter(
    (b) =>
      matchesStatusFilter(b, statusFilter) && matchesDateFilter(b, dateFilter),
  ).length;

  return (
    <div className="w-full flex flex-1 flex-col bg-slate-50 px-4 sm:px-6 lg:px-8">
      {/* Header — breadcrumb + filters stay fixed */}
      <div className="shrink-0 space-y-6 pt-8 pb-6">
        <PathBreadcrumb
          items={[{ label: "Reservations" }]}
          actions={
            total > 0 ? (
              <span className="text-sm text-muted-foreground">
                {total} total booking{total !== 1 ? "s" : ""}
              </span>
            ) : undefined
          }
        />

        {/* Filters — date left, status right */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Date pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {DATE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setDateFilter(f.id);
                  setPage(1);
                }}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                  dateFilter === f.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Status segmented control */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  statusFilter === f.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings grid — scrolls; header & pagination stay fixed */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-6">
        <HostBookingsTab
          bookings={bookings}
          propertyFilter={null}
          onClearPropertyFilter={() => {}}
          cancellingId={actionId}
          confirmingId={confirmingId}
          decliningId={decliningId}
          dateFilter={dateFilter}
          statusFilter={statusFilter}
          onCancel={cancelBooking}
          onConfirm={confirmBooking}
          onDecline={declineBooking}
          loading={loading}
        />
      </div>

      {/* Pagination — pinned to the bottom of the viewport */}
      {filteredCount > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={pageSize}
          onPageChange={setPage}
          className="shrink-0 bg-slate-50 pb-6"
        />
      )}
    </div>
  );
}
