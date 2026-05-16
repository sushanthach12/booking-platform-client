"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BadgeCheck, CalendarDays, Check, Copy, Users } from "lucide-react";
import { useState } from "react";

export interface BookingConfirmedDetails {
  status: string;
  bookingNumber?: string;
  propertyTitle?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
}

interface BookingConfirmedScreenProps {
  bookingDetails: BookingConfirmedDetails | null;
  onHome: () => void;
}

export function BookingConfirmedScreen({ bookingDetails, onHome }: BookingConfirmedScreenProps) {
  const [copied, setCopied] = useState(false);
  const ref = bookingDetails?.bookingNumber ?? "";

  const handleCopy = () => {
    if (!ref) return;
    navigator.clipboard.writeText(ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full min-h-[90vh] items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Success icon — animated ping rings */}
        <div className="flex justify-center mb-8">
          <div className="relative flex items-center justify-center">
            <span className="absolute size-16 rounded-full bg-green-400/25 animate-ping" />
            <span className="absolute size-24 rounded-full bg-green-400/10 animate-ping [animation-delay:200ms]" />
            <div className="anim-scale-in size-16 rounded-full bg-linear-to-br from-green-400 to-green-500 flex items-center justify-center shadow-[0_8px_32px_rgba(74,222,128,0.45)]">
              <BadgeCheck className="anim-icon size-8 text-white" strokeWidth={2.5} />
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
          <div className="bg-linear-to-r from-green-500 to-emerald-500 px-5 py-3 flex items-center gap-2">
            <Check className="size-4 text-white" strokeWidth={3} />
            <span className="text-white text-sm font-semibold">Booking Confirmed</span>
          </div>

          <div className="px-5 py-5 space-y-4">
            {bookingDetails?.propertyTitle && (
              <p className="font-semibold text-foreground text-base leading-snug">
                {bookingDetails.propertyTitle}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              {bookingDetails?.checkInDate && bookingDetails?.checkOutDate && (
                <div className="rounded-xl bg-muted/60 px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CalendarDays className="size-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Dates
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {bookingDetails.checkInDate}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    → {bookingDetails.checkOutDate}
                  </p>
                </div>
              )}

              {bookingDetails?.guestCount != null && (
                <div className="rounded-xl bg-muted/60 px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Users className="size-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Guests
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {bookingDetails.guestCount} guest{bookingDetails.guestCount !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking reference */}
        {ref && (
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
                  <><Check className="size-3.5" /> Copied</>
                ) : (
                  <><Copy className="size-3.5" /> Copy</>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="anim-fade-up-4 text-center text-sm text-muted-foreground mb-6">
          A confirmation has been sent to your email.
        </p>

        <Button className="w-full" onClick={onHome}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
