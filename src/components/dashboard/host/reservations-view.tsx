"use client";

import { useState } from "react";
import {
  HostBookingsTab,
  matchesDateFilter,
  matchesStatusFilter,
  type DateFilter,
  type StatusFilter,
} from "@/components/host/host-bookings-tab";
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
    <div className="w-full min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reservations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {total > 0
            ? `${total} total booking${total !== 1 ? "s" : ""}`
            : "Manage guest bookings"}
        </p>
      </div>

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
                  : "bg-card text-muted-foreground border-border hover:border-foreground/30",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Status segmented control */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                statusFilter === f.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings grid */}
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

      {/* Pagination — only shown when filtered results exist */}
      {filteredCount > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={pageSize}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
