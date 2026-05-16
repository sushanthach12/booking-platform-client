"use client";

import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import type { GuestBooking } from "@/domain/entities";
import type { BookingsSummary } from "@/components/dashboard/guest/bookings-view";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Moon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BookingCard } from "./booking-card";
import { BookingCardSkeleton } from "./booking-card-skeleton";
import { BookingDetailsDrawer } from "./booking-details-drawer";

type BookingTab = "upcoming" | "past";

interface BookingsTabProps {
  bookings: GuestBooking[];
  total: number;
  summary: BookingsSummary | null;
  activeTab: BookingTab;
  onTabChange: (tab: BookingTab) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  cancellingId: string | null;
  onCancel: (id: string) => void;
}

export function BookingsTab({
  bookings,
  total,
  summary,
  activeTab,
  onTabChange,
  page,
  totalPages,
  onPageChange,
  loading,
  cancellingId,
  onCancel,
}: BookingsTabProps) {
  const [selectedBooking, setSelectedBooking] = useState<GuestBooking | null>(null);

  const totalTrips = summary ? summary.upcomingCount + summary.pastCount : 0;

  if (!loading && total === 0 && page === 1) {
    return (
      <div className="text-center py-20">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Calendar className="size-7 text-muted-foreground" />
        </div>
        {activeTab === "upcoming" ? (
          <>
            <p className="font-semibold text-foreground text-lg">No upcoming bookings</p>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Start exploring and book your first stay.
            </p>
            <Button asChild className="rounded-xl bg-primary hover:bg-primary/90 text-white px-6">
              <Link href="/search">Browse properties</Link>
            </Button>
          </>
        ) : (
          <>
            <p className="font-semibold text-foreground text-lg">No past trips yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your completed stays will appear here.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Stats row */}
      {summary && (
        <div className="flex items-center gap-4 text-sm mb-5 flex-wrap">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="size-3.5 text-primary" />
            <span className="font-semibold text-foreground">{totalTrips}</span>
            <span>trips</span>
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-3.5 text-primary" />
            <span className="font-semibold text-foreground">{summary.uniqueLocations}</span>
            <span>destinations</span>
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Moon className="size-3.5 text-primary" />
            <span className="font-semibold text-foreground">
              {formatCurrency(summary.totalSpent, summary.currency)}
            </span>
            <span>spent</span>
          </span>
        </div>
      )}

      {/* Tab selector + page count row */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{total}</span>{" "}
          {activeTab === "upcoming" ? "upcoming" : "past"} bookings
        </p>
        <select
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value as BookingTab)}
          className="text-sm font-medium text-foreground bg-card border border-border rounded-lg px-3 py-1.5 cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past trips</option>
        </select>
      </div>

      {/* Grid */}
      <div className={cn("grid gap-4", "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5")}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <BookingCardSkeleton key={i} />)
          : bookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancel={activeTab === "upcoming" ? onCancel : undefined}
                cancellingId={cancellingId}
                onViewDetails={setSelectedBooking}
              />
            ))}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8">
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
          <p className="text-center text-xs text-muted-foreground mt-3">
            Page {page} of {totalPages} · {total} bookings
          </p>
        </div>
      )}

      <BookingDetailsDrawer
        booking={selectedBooking}
        open={selectedBooking !== null}
        onClose={() => setSelectedBooking(null)}
        onCancel={onCancel}
        cancellingId={cancellingId}
      />
    </>
  );
}
