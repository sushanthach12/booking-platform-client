"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { PropertyDetailViewState } from "@/lib/utils/map-property";
import { DateRangePicker } from "@/components/shared/date-picker";
import { GuestSelector } from "@/components/shared/guest-selector";
import { differenceInDays, format } from "date-fns";
import { useState } from "react";
import { type DateRange } from "react-day-picker";

interface GuestCount {
    adults: number;
    children: number;
    infants: number;
}

interface BookingWidgetProps {
  property: PropertyDetailViewState;
  className?: string;
}

export function BookingWidget({ property, className }: BookingWidgetProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [guestCount, setGuestCount] = useState<GuestCount>({ adults: 1, children: 0, infants: 0 });

  const calculateNights = () => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return differenceInDays(dateRange.to, dateRange.from);
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    if (nights <= 0) return 0;
    return property.pricing.amount * nights;
  };

  const total = calculateTotal();
  const nights = calculateNights();
  const totalGuests = guestCount.adults + guestCount.children;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            ${property.pricing.amount}
          </span>
          <span className="text-muted-foreground">/ night</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {/* Date Selection */}
        <div className="rounded-lg border border-border p-1">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder="Check-in - Check-out"
            className="border-0 shadow-none"
          />
        </div>

        {/* Guest Selection */}
        <div className="rounded-lg border border-border p-1">
          <GuestSelector
            value={guestCount}
            onChange={setGuestCount}
            maxGuests={16}
            className="border-0 shadow-none"
          />
        </div>

        {/* Reserve Button */}
        <Button
          className="w-full rounded-md py-3"
          disabled={!dateRange?.from || !dateRange?.to}
        >
          Reserve
        </Button>

        {/* Price Breakdown */}
        {total > 0 && (
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span>${property.pricing.amount} x {nights} {nights === 1 ? 'night' : 'nights'}</span>
              <span>${property.pricing.amount * nights}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cleaning fee</span>
              <span>$50</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service fee</span>
              <span>$75</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border">
              <span>Total</span>
              <span>${total + 125}</span>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>You won&apos;t be charged yet</p>
          <p>Free cancellation for 48 hours</p>
        </div>
      </CardContent>
    </Card>
  );
}
