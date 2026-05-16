'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { GuestBooking } from '@/domain/entities';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/currency';
import { differenceInDays, format, parseISO } from 'date-fns';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Moon,
  Star,
  Users,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const STATUS_CONFIG = {
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle2,
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    pill: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    pill: 'bg-slate-100 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    pill: 'bg-red-50 text-red-600 border-red-200',
    dot: 'bg-red-400',
  },
} as const;

interface BookingDetailsDrawerProps {
  booking: GuestBooking | null;
  open: boolean;
  onClose: () => void;
  onCancel?: (id: string) => void;
  cancellingId?: string | null;
}

function DetailRow({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <span className='text-sm text-slate-500 shrink-0'>{label}</span>
      <span className='text-sm font-medium text-slate-900 text-right'>
        {value}
      </span>
    </div>
  );
}

export function BookingDetailsDrawer({
  booking,
  open,
  onClose,
  onCancel,
  cancellingId,
}: BookingDetailsDrawerProps) {
  if (!booking) return null;

  const nights = differenceInDays(
    parseISO(booking.checkOut),
    parseISO(booking.checkIn),
  );
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const isCancelling = cancellingId === booking.id;
  const canCancel =
    onCancel &&
    (booking.status === 'confirmed' || booking.status === 'pending');

  const pricePerNight =
    nights > 0 ? booking.totalAmount / nights : booking.totalAmount;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side='right'
        className='w-full sm:max-w-md p-0 flex flex-col overflow-y-auto'
      >
        {/* Hero image */}
        <div className='relative h-52 shrink-0 overflow-hidden'>
          <Image
            src={booking.coverImage}
            alt={booking.propertyName}
            fill
            sizes='448px'
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent' />
          <div className='absolute bottom-0 left-0 right-0 p-5'>
            {/* <Badge
              variant="outline"
              className={cn(
                "mb-2 text-[11px] font-semibold gap-1.5 px-2.5 py-1 rounded-full border",
                status.pill,
              )}
            >
              <span
                className={cn("size-1.5 rounded-full shrink-0", status.dot)}
              />
              {status.label}
            </Badge> */}
            <h2 className='text-white font-bold text-lg leading-snug line-clamp-2'>
              {booking.propertyName}
            </h2>
            <p className='text-white/80 text-xs flex items-center gap-1 mt-1'>
              <MapPin className='size-3' />
              {booking.location}
            </p>
          </div>
        </div>

        <SheetHeader className='sr-only'>
          <SheetTitle>Booking Details — {booking.propertyName}</SheetTitle>
        </SheetHeader>

        <div className='flex-1 px-6 py-6 space-y-6'>
          {/* Stay summary chips */}
          <div className='grid grid-cols-3 gap-3'>
            <div className='rounded-xl bg-slate-50 border border-slate-100 px-3 py-3 text-center'>
              <CalendarDays className='size-4 text-primary mx-auto mb-1' />
              <p className='text-[10px] text-slate-500 uppercase tracking-wide font-medium'>
                Check-in
              </p>
              <p className='text-xs font-semibold text-slate-900 mt-0.5'>
                {format(parseISO(booking.checkIn), 'MMM d')}
              </p>
              <p className='text-[10px] text-slate-400'>
                {format(parseISO(booking.checkIn), 'yyyy')}
              </p>
            </div>
            <div className='rounded-xl bg-slate-50 border border-slate-100 px-3 py-3 text-center'>
              <Moon className='size-4 text-primary mx-auto mb-1' />
              <p className='text-[10px] text-slate-500 uppercase tracking-wide font-medium'>
                Nights
              </p>
              <p className='text-lg font-bold text-slate-900 leading-none mt-1'>
                {nights}
              </p>
            </div>
            <div className='rounded-xl bg-slate-50 border border-slate-100 px-3 py-3 text-center'>
              <CalendarDays className='size-4 text-primary mx-auto mb-1' />
              <p className='text-[10px] text-slate-500 uppercase tracking-wide font-medium'>
                Check-out
              </p>
              <p className='text-xs font-semibold text-slate-900 mt-0.5'>
                {format(parseISO(booking.checkOut), 'MMM d')}
              </p>
              <p className='text-[10px] text-slate-400'>
                {format(parseISO(booking.checkOut), 'yyyy')}
              </p>
            </div>
          </div>

          {/* Booking details */}
          <div className='space-y-1'>
            <p className='text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3'>
              Booking Details
            </p>
            <div className='rounded-xl border border-slate-100 bg-white divide-y divide-slate-50 overflow-hidden'>
              <div className='px-4 py-3'>
                <DetailRow
                  label='Status'
                  value={
                    <span className={cn('flex items-center gap-1.5 justify-end font-semibold', {
                      'text-emerald-600': booking.status === 'confirmed',
                      'text-amber-600': booking.status === 'pending',
                      'text-slate-500': booking.status === 'completed',
                      'text-red-500': booking.status === 'cancelled',
                    })}>
                      <span className={cn('size-1.5 rounded-full shrink-0', status.dot)} />
                      {status.label}
                    </span>
                  }
                />
              </div>
              <div className='px-4 py-3'>
                <DetailRow
                  label='Guests'
                  value={
                    <span className='flex items-center gap-1.5 justify-end'>
                      <Users className='size-3.5 text-slate-400' />
                      {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                    </span>
                  }
                />
              </div>
              <div className='px-4 py-3'>
                <DetailRow
                  label='Booking ID'
                  value={`#${booking.id.slice(0, 8).toUpperCase()}`}
                />
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className='space-y-1'>
            <p className='text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3'>
              Price Breakdown
            </p>
            <div className='rounded-xl border border-slate-100 bg-white overflow-hidden'>
              <div className='px-4 py-3 space-y-2.5'>
                <DetailRow
                  label={`${formatCurrency(pricePerNight, booking.currency)} × ${nights} night${nights !== 1 ? 's' : ''}`}
                  value={formatCurrency(
                    pricePerNight * nights,
                    booking.currency,
                  )}
                />
              </div>
              <Separator />
              <div className='px-4 py-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-semibold text-slate-900'>
                    Total
                  </span>
                  <span className='text-base font-bold text-slate-900'>
                    {formatCurrency(booking.totalAmount, booking.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className='shrink-0 border-t border-slate-100 px-6 py-4 space-y-2.5 bg-white'>
          {booking.status === 'confirmed' && (
            <Button
              asChild
              variant='outline'
              className='w-full rounded-xl gap-2'
            >
              <Link href={`/properties/${booking.propertyId}`} target='_blank'>
                <ExternalLink className='size-4' />
                View Property
              </Link>
            </Button>
          )}
          {booking.status === 'completed' && !booking.reviewLeft && (
            <Button
              variant='outline'
              className='w-full rounded-xl gap-2 border-amber-200 text-amber-700 hover:bg-amber-50'
            >
              <Star className='size-4' />
              Leave a Review
            </Button>
          )}
          {canCancel && (
            <Button
              variant='outline'
              className='w-full rounded-xl gap-2 border-red-200 text-red-600 hover:bg-red-50'
              disabled={isCancelling}
              onClick={() => {
                onCancel(booking.id);
                onClose();
              }}
            >
              {isCancelling ? (
                <Clock className='size-4 animate-spin' />
              ) : (
                <XCircle className='size-4' />
              )}
              Cancel Booking
            </Button>
          )}
          <Button
            variant='ghost'
            className='w-full rounded-xl text-slate-500'
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
