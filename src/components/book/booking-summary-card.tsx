"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Star } from "lucide-react";
import Image from "next/image";
import type { BookPropertyViewState, GuestCount } from "./types";

interface BookingSummaryCardProps {
  property: BookPropertyViewState;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: GuestCount;
  /** Base price (pricePerNight * nights) */
  baseAmount: number;
  /** Weekly discount (negative if applied) */
  weeklyDiscount: number;
  /** Taxes/fees amount */
  taxes: number;
  /** Grand total */
  grandTotal: number;
  currency: string;
  onChangeDates: () => void;
  onChangeGuests: () => void;
  onPriceBreakdown: () => void;
}

function formatCurrency(amount: number, currency: string) {
  return `₹${Math.abs(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export function BookingSummaryCard({
  property,
  checkIn,
  checkOut,
  nights,
  guests,
  baseAmount,
  weeklyDiscount,
  taxes,
  grandTotal,
  currency,
  onChangeDates,
  onChangeGuests,
  onPriceBreakdown,
}: BookingSummaryCardProps) {
  const totalGuests = guests.adults + guests.children;
  const pricePerNight = property.pricing.amount;

  return (
    <Card className="sticky top-24 shadow-md rounded-3xl">
      <CardContent className="p-6">
        {/* Property row */}
        <div className="flex gap-3 pb-5 border-b border-border mb-5">
          <div className="relative w-28 h-21 rounded-lg overflow-hidden shrink-0 bg-muted">
            <Image
              src={property.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-1">
              {property.type}
            </p>
            <p className="text-sm font-semibold text-foreground line-clamp-2">
              {property.title}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap mt-1 text-xs text-foreground">
              <Star className="size-3.5 fill-foreground" />
              <span>
                {property.rating.toFixed(1)} ({property.reviewCount ?? 0})
              </span>
              {property.isSuperhost && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span>Superhost</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Free cancellation */}
        <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 mb-5 flex items-start gap-2">
          <span className="text-green-700 dark:text-green-400 font-bold">
            ✓
          </span>
          <div>
            <p className="text-sm font-semibold text-green-800 dark:text-green-200">
              Free cancellation
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Cancel before {property.cancellationDate ?? "—"} for a full
              refund.
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs font-semibold text-foreground mb-0.5">
              Dates
            </p>
            <p className="text-sm text-muted-foreground">
              {format(checkIn, "d MMM")}–{format(checkOut, "d MMM")}
              <span className="text-muted-foreground/80 ml-1.5">
                ({nights} night{nights !== 1 ? "s" : ""})
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="bg-stone-100 hover:bg-stone-200"
            onClick={onChangeDates}
          >
            Change
          </Button>
        </div>

        {/* Guests */}
        <div className="flex justify-between items-center pb-5 border-b border-border mb-5">
          <div>
            <p className="text-xs font-semibold text-foreground mb-0.5">
              Guests
            </p>
            <p className="text-sm text-muted-foreground">
              {totalGuests} guest{totalGuests !== 1 ? "s" : ""}
              {guests.infants > 0 &&
                `, ${guests.infants} infant${guests.infants !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="bg-stone-100 hover:bg-stone-200"
            onClick={onChangeGuests}
          >
            Change
          </Button>
        </div>

        {/* Price details */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Price details
          </h4>
          <div className="flex justify-between text-sm">
            <span className="text-foreground">
              ₹
              {pricePerNight.toLocaleString("en-IN", {
                maximumFractionDigits: 1,
              })}{" "}
              × {nights} nights
            </span>
            <span className="text-foreground">
              {formatCurrency(baseAmount, currency)}
            </span>
          </div>
          {weeklyDiscount < 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-foreground">Weekly stay discount</span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                {formatCurrency(weeklyDiscount, currency)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm pt-2 border-t border-border pb-4">
            <span className="text-foreground">Taxes</span>
            <span className="text-foreground">
              {formatCurrency(taxes, currency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-foreground">
              Total
              {/* <span className='font-medium'>{currency}</span> */}
            </span>
            <span className="text-base font-bold text-foreground">
              {formatCurrency(grandTotal, currency)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground font-medium p-0 underline hover:bg-background"
            onClick={onPriceBreakdown}
          >
            Price breakdown
          </Button>
        </div>
      </CardContent>

      {weeklyDiscount < 0 && (
        <div className="mx-4 mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 flex items-center gap-2">
          <span className="text-lg">🏷️</span>
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            {formatCurrency(weeklyDiscount, currency)} discount applied
          </span>
        </div>
      )}
    </Card>
  );
}
