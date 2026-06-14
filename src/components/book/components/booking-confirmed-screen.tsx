"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BadgeCheck, CalendarDays, Check, Copy, Home, LayoutList, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function formatCurrency(amount: number, currency?: string) {
  const symbol = currency?.toUpperCase() === "USD" ? "$" : "₹";
  return `${symbol}${Math.abs(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export interface BookingConfirmedSummary {
  subtotal?: number;
  totalFees?: number;
  taxRate?: number;
  taxAmount?: number;
  totalDiscount?: number;
  grandTotal?: number;
  currency?: string;
}

export interface BookingConfirmedDetails {
  status: string;
  bookingNumber?: string;
  propertyTitle?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
  numberOfNights?: number;
  summary?: BookingConfirmedSummary;
}

interface BookingConfirmedScreenProps {
  bookingDetails: BookingConfirmedDetails | null;
  onViewBooking: () => void;
}

export function BookingConfirmedScreen({
  bookingDetails,
  onViewBooking,
}: BookingConfirmedScreenProps) {
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
          <div className="bg-linear-to-r from-green-500 to-emerald-500 px-5 py-3 flex items-center gap-2">
            <Check className="size-4 text-white" strokeWidth={3} />
            <span className="text-white text-sm font-semibold">
              Booking Confirmed
            </span>
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
                    {bookingDetails.guestCount} guest
                    {bookingDetails.guestCount !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price summary */}
        {bookingDetails?.summary?.grandTotal != null && (
          <div className="anim-fade-up-3 rounded-2xl border border-border bg-card shadow-sm px-5 py-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Price Summary
            </p>
            <div className="space-y-2 text-sm">
              {bookingDetails.summary.subtotal != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal
                    {bookingDetails.numberOfNights
                      ? ` (${bookingDetails.numberOfNights} night${bookingDetails.numberOfNights !== 1 ? "s" : ""})`
                      : ""}
                  </span>
                  <span className="text-foreground">
                    {formatCurrency(
                      bookingDetails.summary.subtotal,
                      bookingDetails.summary.currency,
                    )}
                  </span>
                </div>
              )}
              {bookingDetails.summary.totalFees != null &&
                bookingDetails.summary.totalFees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fees</span>
                    <span className="text-foreground">
                      {formatCurrency(
                        bookingDetails.summary.totalFees,
                        bookingDetails.summary.currency,
                      )}
                    </span>
                  </div>
                )}
              {bookingDetails.summary.taxAmount != null &&
                bookingDetails.summary.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {bookingDetails.summary.taxRate != null
                        ? `Taxes (${Math.round(bookingDetails.summary.taxRate)}%)`
                        : "Taxes"}
                    </span>
                    <span className="text-foreground">
                      {formatCurrency(
                        bookingDetails.summary.taxAmount,
                        bookingDetails.summary.currency,
                      )}
                    </span>
                  </div>
                )}
              {bookingDetails.summary.totalDiscount != null &&
                bookingDetails.summary.totalDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      -
                      {formatCurrency(
                        bookingDetails.summary.totalDiscount,
                        bookingDetails.summary.currency,
                      )}
                    </span>
                  </div>
                )}
              <div className="flex justify-between pt-2 border-t border-border font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">
                  {formatCurrency(
                    bookingDetails.summary.grandTotal,
                    bookingDetails.summary.currency,
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

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
        )}

        {/* Footer */}
        <p className="anim-fade-up-4 text-center text-sm text-muted-foreground mb-6">
          A confirmation has been sent to your email.
        </p>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-11" asChild>
            <Link href="/">
              <Home className="size-4" />
              Go home
            </Link>
          </Button>
          <Button className="flex-1 h-11" onClick={onViewBooking}>
            <LayoutList className="size-4" />
            My bookings
          </Button>
        </div>
      </div>
    </div>
  );
}
