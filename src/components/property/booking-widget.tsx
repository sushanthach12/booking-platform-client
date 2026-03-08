'use client';

import { DateRangePicker } from '@/components/shared/date-range-picker';
import { GuestSelector } from '@/components/shared/guest-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { PropertyDetailViewState } from '@/lib/utils/map-property';
import { addDays, differenceInDays, startOfDay } from 'date-fns';
import { useState } from 'react';
import { type DateRange } from 'react-day-picker';

function getDefaultDateRange(): DateRange {
  const today = startOfDay(new Date());
  return {
    from: today,
    to: addDays(today, 2),
  };
}

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getDefaultDateRange,
  );
  const [guestCount, setGuestCount] = useState<GuestCount>({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const calculateNights = () => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    return differenceInDays(dateRange.to, dateRange.from);
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    if (nights <= 0) return 0;
    return property.pricing.amount * nights;
  };

  const total = calculateTotal();
  const nights = calculateNights();

  return (
    <Card className={className}>
      <CardHeader>
        <div className='flex justify-start items-end'>
          <span className='text-2xl font-bold underline lg:text-3xl'>
            ${property.pricing.amount}
          </span>
          <span className='pl-2 text-lg lg:text-xl'>/night</span>
        </div>
      </CardHeader>
      <CardContent className='space-y-4 pt-2'>
        {/* Combined date + guest block (CHECK-IN | CHECKOUT, then GUESTS) */}
        <div className='rounded-lg border border-border overflow-hidden'>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder='Add date'
            variant='split'
          />
          <div className='border-t border-border'>
            <GuestSelector
              value={guestCount}
              onChange={setGuestCount}
              maxGuests={16}
              variant='block'
            />
          </div>
        </div>

        {/* Cancellation policy */}
        <div className='rounded-lg bg-muted/50 px-3 py-2 text-center text-sm text-muted-foreground lg:text-base'>
          Free cancellation before 48 hours
        </div>

        {/* Check Availability Button */}
        <Button
          variant='default'
          size={'lg'}
          className='w-full rounded-lg py-3'
          disabled={!dateRange?.from || !dateRange?.to}
        >
          Check Availability
        </Button>

        {/* Price Breakdown */}
        {total > 0 && (
          <div className='space-y-2 pt-4 border-t border-border'>
            <div className='flex justify-between text-sm lg:text-base'>
              <span>
                ${property.pricing.amount} x {nights}{' '}
                {nights === 1 ? 'night' : 'nights'}
              </span>
              <span>${property.pricing.amount * nights}</span>
            </div>
            <div className='flex justify-between text-sm lg:text-base'>
              <span>Cleaning fee</span>
              <span>$50</span>
            </div>
            <div className='flex justify-between text-sm lg:text-base'>
              <span>Service fee</span>
              <span>$75</span>
            </div>
            <div className='flex justify-between font-semibold pt-2 border-t border-border text-sm lg:text-base'>
              <span>Total</span>
              <span>${total + 125}</span>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className='text-xs text-muted-foreground space-y-1 lg:text-sm'>
          <p>You won&apos;t be charged yet</p>
        </div>
      </CardContent>
    </Card>
  );
}
