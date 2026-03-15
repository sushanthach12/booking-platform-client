"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { BadgeCheck, CalendarDays, Check, Copy, Users } from "lucide-react";
import { useState } from "react";
import type { BookPropertyViewState, GuestCount } from "./types";

interface BookingConfirmationViewProps {
  property: BookPropertyViewState;
  checkIn: Date;
  checkOut: Date;
  guests: GuestCount;
}

export function BookingConfirmationView({
  property,
  checkIn,
  checkOut,
  guests,
}: BookingConfirmationViewProps) {
  const totalGuests = guests.adults + guests.children;
  const ref = `SV-${crypto.randomUUID().slice(0, 10).toUpperCase()}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full min-h-[90vh] items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Success icon */}
        <div className="flex justify-center mb-8">
          <div className="relative flex items-center justify-center">
            <span className="absolute size-16 rounded-full bg-green-400/25 animate-ping" />
            <span className="absolute size-24 rounded-full bg-green-400/10 animate-ping [animation-delay:200ms]" />
            <div className="anim-scale-in size-16 rounded-full bg-linear-to-br from-green-400 to-green-500 flex items-center justify-center shadow-[0_8px_32px_rgba(74,222,128,0.45)]">
              <BadgeCheck
                className="anim-icon size-8 text-white"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="anim-fade-up-1 text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
            You&apos;re booked!
          </h1>
          <p className="text-muted-foreground text-sm">
            Your reservation is confirmed. Have a great stay!
          </p>
        </div>

        {/* Property card */}
        <div className="anim-fade-up-2 rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-4">
          {/* Green header strip */}
          <div className="bg-linear-to-r from-green-500 to-emerald-500 px-5 py-3 flex items-center gap-2">
            <Check className="size-4 text-white" strokeWidth={3} />
            <span className="text-white text-sm font-semibold">
              Booking Confirmed
            </span>
          </div>

          <div className="px-5 py-5 space-y-4">
            <p className="font-semibold text-foreground text-base leading-snug">
              {property.title}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/60 px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <CalendarDays className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Dates
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {format(checkIn, "d MMM")}
                </p>
                <p className="text-xs text-muted-foreground">
                  → {format(checkOut, "d MMM yyyy")}
                </p>
              </div>

              <div className="rounded-xl bg-muted/60 px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Guests
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {totalGuests} guest{totalGuests !== 1 ? "s" : ""}
                </p>
                {guests.infants > 0 && (
                  <p className="text-xs text-muted-foreground">
                    +{guests.infants} infant{guests.infants !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking ref */}
        <div className="anim-fade-up-3 rounded-2xl border border-border bg-card shadow-sm px-5 py-4 mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Booking Reference
          </p>
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xl font-bold tracking-widest text-foreground">
              {ref}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "shrink-0 gap-1.5 text-xs transition-colors",
                copied ? "text-green-500" : "text-muted-foreground",
              )}
            >
              {copied ? (
                <>
                  <Check className="size-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" /> Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Footer note */}
        <p className="anim-fade-up-4 text-center text-sm text-muted-foreground">
          A confirmation has been sent to your email.
        </p>
      </div>
    </div>
  );
}
