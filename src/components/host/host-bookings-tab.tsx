'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CancelBookingModal } from '@/components/ui/cancel-booking-modal';
import type { HostBookingSummary } from '@/domain/entities';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/currency';
import {
  BookOpen,
  Calendar,
  Check,
  Loader2,
  User,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';

export type StatusFilter = 'all' | 'upcoming' | 'completed' | 'cancelled';
export type DateFilter = 'all' | 'today' | 'tomorrow' | 'this-week' | null;

interface HostBookingsTabProps {
  bookings: HostBookingSummary[];
  propertyFilter: string | null;
  onClearPropertyFilter: () => void;
  cancellingId: string | null;
  confirmingId?: string | null;
  decliningId?: string | null;
  dateFilter?: DateFilter;
  onCancel: (id: string, reason: string) => Promise<void>;
  onConfirm?: (id: string) => void;
  onDecline?: (id: string, reason: string) => Promise<void>;
  statusFilter?: StatusFilter;
  loading?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50  text-amber-700  border-amber-200',
  completed: 'bg-gray-100  text-muted-foreground border-border',
  cancelled: 'bg-red-50    text-red-600    border-red-200',
  declined: 'bg-red-50    text-red-600    border-red-200',
};


export function matchesStatusFilter(b: HostBookingSummary, f: StatusFilter) {
  if (f === 'all') return true;
  if (f === 'upcoming')
    return b.status === 'confirmed' || b.status === 'pending';
  return b.status === f;
}

export function matchesDateFilter(b: HostBookingSummary, f: DateFilter) {
  if (!f || f === 'all' || !b.checkIn) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkIn = new Date(b.checkIn);
  checkIn.setHours(0, 0, 0, 0);
  if (f === 'today') return checkIn.getTime() === today.getTime();
  if (f === 'tomorrow') {
    const t = new Date(today);
    t.setDate(today.getDate() + 1);
    return checkIn.getTime() === t.getTime();
  }
  if (f === 'this-week') {
    const end = new Date(today);
    end.setDate(today.getDate() + 7);
    return checkIn >= today && checkIn <= end;
  }
  return true;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function nightCount(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return null;
  const diff = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000,
  );
  return diff > 0 ? diff : null;
}

export function HostBookingsTab({
  bookings,
  propertyFilter,
  onClearPropertyFilter,
  cancellingId,
  confirmingId = null,
  decliningId = null,
  dateFilter = 'all',
  onCancel,
  onConfirm,
  onDecline,
  statusFilter = 'all',
  loading = false,
}: HostBookingsTabProps) {
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    type: 'cancel' | 'decline';
  } | null>(null);

  const filtered = bookings.filter(
    (b) =>
      matchesStatusFilter(b, statusFilter) &&
      matchesDateFilter(b, dateFilter) &&
      (propertyFilter == null || b.propertyId === propertyFilter),
  );

  if (loading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-xl border border-border animate-pulse h-40'
          />
        ))}
      </div>
    );
  }

  if (filtered && !filtered.length) {
    return (
      <div className='text-center py-16'>
        <BookOpen className='size-10 mx-auto mb-3 text-muted-foreground/30' />
        <p className='font-semibold text-foreground'>No bookings found</p>
        <p className='text-sm mt-1 text-muted-foreground'>
          {statusFilter !== 'all' || dateFilter !== 'all'
            ? 'Try adjusting your filters'
            : 'Bookings will appear here once guests reserve your property'}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Property filter pill */}
      {propertyFilter && (
        <div>
          <button
            onClick={onClearPropertyFilter}
            className='flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors'
          >
            Filtered by property
            <X className='size-3' />
          </button>
        </div>
      )}

      {/* Card grid */}

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3'>
        {filtered.map((b) => {
          const isCancelling = cancellingId === b.id;
          const isConfirming = confirmingId === b.id;
          const isDeclining = decliningId === b.id;
          const isActing = isCancelling || isConfirming || isDeclining;
          const nights = nightCount(b.checkIn, b.checkOut);

          return (
            <div
              key={b.id}
              className='bg-white border border-border rounded-xl p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow'
            >
              {/* Property name + status */}
              <div className='flex items-start justify-between gap-2'>
                <p className='text-sm font-semibold text-foreground leading-snug line-clamp-1 flex-1'>
                  {b.propertyName ?? 'Property'}
                </p>
                {b.status && (
                  <Badge
                    variant='outline'
                    className={cn(
                      'shrink-0 text-[10px] font-semibold capitalize',
                      STATUS_STYLES[b.status] ??
                        'bg-gray-100 text-muted-foreground border-border',
                    )}
                  >
                    {b.status}
                  </Badge>
                )}
              </div>

              {/* Dates */}
              <div className='flex items-center gap-2 text-xs text-muted-foreground pt-2'>
                <Calendar className='size-3.5 shrink-0' />
                <span className='text-foreground font-medium'>
                  {formatDate(b.checkIn)}
                </span>
                <span>→</span>
                <span className='text-foreground font-medium'>
                  {formatDate(b.checkOut)}
                </span>
                {nights && (
                  <span className='ml-auto bg-gray-100 text-foreground px-1.5 py-0.5 rounded text-[10px] font-semibold'>
                    {nights}n
                  </span>
                )}
              </div>

              {/* Guest + booking ref */}
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span className='flex items-center gap-1'>
                  {b.guestName ? (
                    <>
                      <User className='size-3.5' />
                      {b.guestName}
                    </>
                  ) : b.guestCount != null ? (
                    <>
                      <Users className='size-3.5' />
                      {b.guestCount} guest{b.guestCount !== 1 ? 's' : ''}
                    </>
                  ) : null}
                </span>
                {b.bookingNumber && (
                  <span className='font-mono text-[10px] text-muted-foreground/40'>
                    #{b.bookingNumber}
                  </span>
                )}
              </div>

              {/* Amount + actions */}
              <div className='flex items-center justify-between pt-2.5 border-t border-border mt-auto shrink-0'>
                <p className='text-sm font-bold text-foreground'>
                  {b.totalAmount != null
                    ? formatCurrency(b.totalAmount, b.currency ?? 'INR')
                    : '—'}
                </p>
                <div className='flex items-center gap-1.5'>
                  {b.status === 'pending' && onConfirm && (
                    <Button
                      size='sm'
                      disabled={isActing}
                      onClick={() => onConfirm(b.id)}
                      className='h-7 text-[11px] rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5'
                    >
                      {isConfirming ? (
                        <Loader2 className='size-3 animate-spin' />
                      ) : (
                        <>
                          <Check className='size-3 mr-1' />
                          Confirm
                        </>
                      )}
                    </Button>
                  )}
                  {b.status === 'pending' && onDecline && (
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={isActing}
                      onClick={() => setPendingAction({ id: b.id, type: 'decline' })}
                      className='h-7 text-[11px] rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10 px-2.5'
                    >
                      {isDeclining ? (
                        <Loader2 className='size-3 animate-spin' />
                      ) : (
                        'Decline'
                      )}
                    </Button>
                  )}
                  {b.status === 'confirmed' && (
                    <Button
                      variant='ghost'
                      size='sm'
                      disabled={isActing}
                      onClick={() => setPendingAction({ id: b.id, type: 'cancel' })}
                      className='h-7 text-[11px] rounded-lg text-destructive hover:bg-destructive/10 px-2.5'
                    >
                      {isCancelling ? (
                        <Loader2 className='size-3 animate-spin' />
                      ) : (
                        'Cancel'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CancelBookingModal
        open={pendingAction !== null}
        role='host'
        onClose={() => setPendingAction(null)}
        onConfirm={async (reason) => {
          if (!pendingAction) return;
          if (pendingAction.type === 'cancel') {
            await onCancel(pendingAction.id, reason);
          } else if (pendingAction.type === 'decline' && onDecline) {
            await onDecline(pendingAction.id, reason);
          }
          setPendingAction(null);
        }}
      />
    </div>
  );
}
