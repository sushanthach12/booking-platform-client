'use client';

import { BookingsTab } from '@/components/account/bookings-tab';
import type { GuestBooking } from '@/domain/entities';
import { useGuestBookings } from '@/domain/hooks/dashboard/use-guest-bookings';

interface BookingsViewProps {
  upcoming: GuestBooking[];
  past: GuestBooking[];
}

export function BookingsView({
  upcoming: initialUpcoming,
  past: initialPast,
}: BookingsViewProps) {
  const { upcoming, past, cancellingId, cancelBooking } = useGuestBookings({
    upcoming: initialUpcoming,
    past: initialPast,
  });

  return (
    <div className='w-full px-6 lg:px-10 py-8'>
      <h1 className='text-2xl font-bold text-foreground mb-6'>Bookings</h1>
      <BookingsTab
        upcoming={upcoming}
        past={past}
        cancellingId={cancellingId}
        onCancel={cancelBooking}
      />
    </div>
  );
}
