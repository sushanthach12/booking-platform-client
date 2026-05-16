"use client";

import { Button } from "@/components/ui/button";
import type { GuestBooking } from "@/domain/entities";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Moon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BookingCard } from "./booking-card";
import { BookingDetailsDrawer } from "./booking-details-drawer";

interface BookingsTabProps {
  upcoming: GuestBooking[];
  past: GuestBooking[];
  cancellingId: string | null;
  onCancel: (id: string) => void;
}

export function BookingsTab({
  upcoming,
  past,
  cancellingId,
  onCancel,
}: BookingsTabProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedBooking, setSelectedBooking] = useState<GuestBooking | null>(null);

  const totalTrips = upcoming.length + past.length;
  const totalSpent = [...upcoming, ...past].reduce((s, b) => s + b.totalAmount, 0);
  const currency = upcoming[0]?.currency ?? past[0]?.currency ?? "USD";
  const locations = new Set(
    [...upcoming, ...past].map((b) => b.location.split(",").pop()?.trim() ?? b.location),
  );

  const activeList = activeTab === "upcoming" ? upcoming : past;

  if (upcoming.length === 0 && past.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Calendar className="size-7 text-muted-foreground" />
        </div>
        <p className="font-semibold text-foreground text-lg">No bookings yet</p>
        <p className="text-sm text-muted-foreground mt-2 mb-6">
          Start exploring and book your first stay.
        </p>
        <Button asChild className="rounded-xl bg-primary hover:bg-primary-dark text-white px-6">
          <Link href="/search">Browse properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Stats + filter row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="size-3.5 text-primary" />
            <span className="font-semibold text-foreground">{totalTrips}</span>
            <span>trips</span>
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-3.5 text-primary" />
            <span className="font-semibold text-foreground">{locations.size}</span>
            <span>destinations</span>
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Moon className="size-3.5 text-primary" />
            <span className="font-semibold text-foreground">{formatCurrency(totalSpent, currency)}</span>
            <span>spent</span>
          </span>
        </div>

        {/* Dropdown select */}
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as "upcoming" | "past")}
          className="text-sm font-medium text-foreground bg-card border border-border rounded-lg px-3 py-1.5 cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
        >
          <option value="upcoming">Upcoming ({upcoming.length})</option>
          <option value="past">Past trips ({past.length})</option>
        </select>
      </div>

      {/* Booking grid */}
      {activeList.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">
            {activeTab === "upcoming" ? "No upcoming bookings" : "No past trips yet"}
          </p>
        </div>
      ) : (
        <div className={cn("grid gap-4", "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5")}>
          {activeList.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onCancel={activeTab === "upcoming" ? onCancel : undefined}
              cancellingId={cancellingId}
              onViewDetails={setSelectedBooking}
            />
          ))}
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
