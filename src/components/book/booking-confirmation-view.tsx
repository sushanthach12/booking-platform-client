'use client';

import { format } from 'date-fns';
import { Check } from 'lucide-react';
import type { BookPropertyViewState, GuestCount } from './types';

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

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-background p-10'>
      <div className='flex flex-col items-center max-w-md text-center'>
        <div className='size-16 rounded-full bg-green-600 flex items-center justify-center mb-6'>
          <Check className='size-8 text-white stroke-3' />
        </div>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          Booking confirmed!
        </h1>
        <p className='text-foreground font-medium mb-1'>{property.title}</p>
        <p className='text-sm text-muted-foreground mb-8'>
          {format(checkIn, 'd MMM yyyy')} → {format(checkOut, 'd MMM yyyy')} ·{' '}
          {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
        </p>
        <div className='rounded-xl bg-muted/50 px-6 py-4 mb-4 text-center w-full'>
          <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2'>
            Booking reference
          </p>
          <p className='font-mono text-xl font-bold tracking-widest text-foreground'>
            {ref}
          </p>
        </div>
        <p className='text-sm text-muted-foreground'>
          Confirmation sent to your email.
        </p>
      </div>
    </div>
  );
}
