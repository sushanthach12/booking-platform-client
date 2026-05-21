"use client";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface BookingTimeoutScreenProps {
  onViewBookings: () => void;
  onHome: () => void;
}

export function BookingTimeoutScreen({
  onViewBookings,
  onHome,
}: BookingTimeoutScreenProps) {
  return (
    <div className="flex flex-col w-full min-h-[90vh] items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative flex items-center justify-center">
            <span className="absolute size-16 rounded-full bg-amber-400/20 animate-ping" />
            <div className="anim-scale-in size-16 rounded-full bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
              <Clock
                className="size-8 text-amber-600 dark:text-amber-400"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="anim-fade-up-1 text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
            Still processing…
          </h1>
          <p className="text-muted-foreground text-sm">
            Your payment is still being verified. This can take a few minutes.
          </p>
        </div>

        {/* Status card */}
        <div className="anim-fade-up-2 rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-4">
          <div className="bg-linear-to-r from-amber-500 to-yellow-500 px-5 py-3 flex items-center gap-2">
            <Clock className="size-4 text-white" strokeWidth={2.5} />
            <span className="text-white text-sm font-semibold">
              Verification Pending
            </span>
          </div>
          <div className="px-5 py-5">
            <p className="text-sm text-muted-foreground">
              We&apos;re waiting on a confirmation from the payment gateway.
              Check your email or visit your bookings page — we&apos;ll update
              you as soon as it clears.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="anim-fade-up-3 text-center text-sm text-muted-foreground mb-6">
          If you were charged, your booking will be confirmed shortly.
        </p>

        {/* Actions */}
        <div className="anim-fade-up-4 flex flex-col gap-3">
          <Button onClick={onViewBookings}>View my bookings</Button>
          <Button variant="ghost" onClick={onHome}>
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
