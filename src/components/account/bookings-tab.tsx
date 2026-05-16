'use client';

import type { BookingsSummary } from '@/components/dashboard/guest/bookings-view';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import type { GuestBooking } from '@/domain/entities';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/currency';
import { Calendar, MapPin, Moon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { BookingCard } from './booking-card';
import { BookingCardSkeleton } from './booking-card-skeleton';
import { BookingDetailsDrawer } from './booking-details-drawer';

type BookingTab = 'upcoming' | 'past';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  length: number;
}

interface BookingsTabProps {
  bookings: GuestBooking[];
  pagination: PaginationMeta | null;
  summary: BookingsSummary | null;
  activeTab: BookingTab;
  onTabChange: (tab: BookingTab) => void;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  loading?: boolean;
  cancellingId: string | null;
  onCancel: (id: string) => void;
}

export function BookingsTab({
  bookings,
  pagination,
  summary,
  activeTab,
  onTabChange,
  page,
  limit,
  onPageChange,
  onLimitChange,
  loading,
  cancellingId,
  onCancel,
}: BookingsTabProps) {
  const [selectedBooking, setSelectedBooking] = useState<GuestBooking | null>(
    null,
  );

  const isEmpty = !loading && (pagination?.total ?? 0) === 0 && page === 1;

  if (isEmpty) {
    return (
      <div className='text-center py-20'>
        <div className='size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4'>
          <Calendar className='size-7 text-muted-foreground' />
        </div>
        {activeTab === 'upcoming' ? (
          <>
            <p className='font-semibold text-foreground text-lg'>
              No upcoming bookings
            </p>
            <p className='text-sm text-muted-foreground mt-2 mb-6'>
              Start exploring and book your first stay.
            </p>
            <Button
              asChild
              className='rounded-xl bg-primary hover:bg-primary/90 text-white px-6'
            >
              <Link href='/search'>Browse properties</Link>
            </Button>
          </>
        ) : (
          <>
            <p className='font-semibold text-foreground text-lg'>
              No past trips yet
            </p>
            <p className='text-sm text-muted-foreground mt-2'>
              Your completed stays will appear here.
            </p>
          </>
        )}
      </div>
    );
  }

  const totalTrips = summary ? summary.upcomingCount + summary.pastCount : 0;

  return (
    <div className='flex flex-col flex-1'>
      {/* Top row: summary stats + tab dropdown */}
      <div className='flex items-center justify-between gap-4 mb-5 flex-wrap'>
        {/* Summary stats */}
        <div className='flex items-center gap-4 text-sm flex-wrap'>
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value as BookingTab)}
            className='text-sm font-medium text-foreground bg-card border border-border rounded-lg px-3 py-1.5 cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-shadow'
          >
            <option value='upcoming'>Upcoming</option>
            <option value='past'>Past trips</option>
          </select>

          {summary && (
            <>
              <span className='text-border'>·</span>
              <span className='flex items-center gap-1.5 text-muted-foreground'>
                <Calendar className='size-3.5 text-primary' />
                <span className='font-semibold text-foreground'>{totalTrips}</span>
                <span>trips</span>
              </span>
              <span className='text-border'>·</span>
              <span className='flex items-center gap-1.5 text-muted-foreground'>
                <MapPin className='size-3.5 text-primary' />
                <span className='font-semibold text-foreground'>{summary.uniqueLocations}</span>
                <span>destinations</span>
              </span>
              <span className='text-border'>·</span>
              <span className='flex items-center gap-1.5 text-muted-foreground'>
                <Moon className='size-3.5 text-primary' />
                <span className='font-semibold text-foreground'>
                  {formatCurrency(summary.totalSpent, summary.currency)}
                </span>
                <span>spent</span>
              </span>
            </>
          )}
        </div>

        {/* Count */}
        <p className='text-sm text-muted-foreground shrink-0'>
          <span className='font-semibold text-foreground'>{pagination?.total ?? 0}</span>{' '}
          {activeTab === 'upcoming' ? 'upcoming' : 'past'} bookings
        </p>
      </div>

      {/* Booking grid — scrollable, fills remaining space */}
      <div className='flex-1 overflow-y-auto min-h-0 pb-4'>
        <div
          className={cn(
            'grid gap-4',
            'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
          )}
        >
          {loading
            ? Array.from({ length: limit }).map((_, i) => (
                <BookingCardSkeleton key={i} />
              ))
            : bookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onCancel={activeTab === 'upcoming' ? onCancel : undefined}
                  cancellingId={cancellingId}
                  onViewDetails={setSelectedBooking}
                />
              ))}
        </div>
      </div>

      {/* Pagination — always at bottom */}
      <Pagination
        page={page}
        totalPages={pagination?.totalPages ?? 1}
        total={pagination?.total ?? 0}
        limit={limit}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        rowsPerPageOptions={[8, 10, 20, 50]}
        className='mt-8'
      />

      <BookingDetailsDrawer
        booking={selectedBooking}
        open={selectedBooking !== null}
        onClose={() => setSelectedBooking(null)}
        onCancel={onCancel}
        cancellingId={cancellingId}
      />
    </div>
  );
}
