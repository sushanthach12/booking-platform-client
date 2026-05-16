'use client';

import { getBookingUseCase } from '@/domain/di';
import { useCashfreeCheckout } from '@/lib/hooks/use-cashfree-checkout';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BookingConfirmedScreen,
  type BookingConfirmedDetails,
} from './components/booking-confirmed-screen';
import { BookingFailedScreen } from './components/booking-failed-screen';
import { BookingTimeoutScreen } from './components/booking-timeout-screen';

type PollState = 'polling' | 'confirmed' | 'failed' | 'timeout';

const MAX_POLLS = 12;
const POLL_INTERVAL_MS = 3000;

interface BookingStatusViewProps {
  propertyId: string;
  bookingId: string | null;
  /** The status query param Cashfree sends back (e.g. "SUCCESS", "FAILED") */
  returnStatus: string | null;
  /** Booking query string (checkIn, checkOut, guests) to restore dates on retry */
  bookingQuery: string | null;
}

export function BookingStatusView({
  propertyId,
  bookingId,
  returnStatus,
  bookingQuery,
}: BookingStatusViewProps) {
  const router = useRouter();
  const { checkout: cashfreeCheckout } = useCashfreeCheckout();
  const [pollState, setPollState] = useState<PollState>('polling');
  const [bookingDetails, setBookingDetails] =
    useState<BookingConfirmedDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const pollCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const poll = useCallback(async () => {
    if (!bookingId) {
      setPollState('failed');
      setErrorMessage('No booking ID found. Please contact support.');
      return;
    }

    // If Cashfree explicitly returned FAILED/CANCELLED, stop immediately
    if (
      returnStatus &&
      ['FAILED', 'CANCELLED', 'EXPIRED'].includes(returnStatus.toUpperCase())
    ) {
      setPollState('failed');
      setErrorMessage(
        'Your payment was not completed. You can try booking again.',
      );
      return;
    }

    try {
      const bookingUseCase = getBookingUseCase();
      const statusData = await bookingUseCase.getBookingStatus(bookingId);

      if (!statusData) {
        throw new Error('Booking not found.');
      }

      const status = statusData.status?.toLowerCase();
      const paymentStatus = statusData.paymentStatus?.toLowerCase();

      // Treat failed payment as a terminal failure even if booking status is still "pending"
      if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
        setPollState('failed');
        setErrorMessage(
          'Your payment was not completed. You can try booking again.',
        );
        stopPolling();
        return;
      }

      if (status === 'confirmed' || status === 'completed') {
        const raw = (await bookingUseCase.getBookingDetails(bookingId)) as {
          booking?: {
            status?: string;
            bookingNumber?: string;
            checkInDate?: string;
            checkOutDate?: string;
            guestCount?: number;
          };
          property?: { title?: string };
        } | null;
        if (raw) {
          setBookingDetails({
            status: raw.booking?.status ?? '',
            bookingNumber: raw.booking?.bookingNumber,
            propertyTitle: raw.property?.title,
            checkInDate: raw.booking?.checkInDate,
            checkOutDate: raw.booking?.checkOutDate,
            guestCount: raw.booking?.guestCount,
          });
        }
        setPollState('confirmed');
        stopPolling();
        return;
      }

      if (
        status === 'cancelled' ||
        status === 'expired' ||
        status === 'failed'
      ) {
        setPollState('failed');
        setErrorMessage(
          'Your booking was cancelled or payment failed. Please try again.',
        );
        stopPolling();
        return;
      }

      // Still pending — poll again if under limit
      pollCount.current += 1;
      if (pollCount.current >= MAX_POLLS) {
        setPollState('timeout');
        stopPolling();
        return;
      }

      timerRef.current = setTimeout(() => void poll(), POLL_INTERVAL_MS);
    } catch (err) {
      pollCount.current += 1;
      if (pollCount.current >= MAX_POLLS) {
        setPollState('timeout');
        stopPolling();
        return;
      }
      timerRef.current = setTimeout(() => void poll(), POLL_INTERVAL_MS);
      void err;
    }
  }, [bookingId, returnStatus, stopPolling]);

  useEffect(() => {
    void poll();
    return stopPolling;
  }, [poll, stopPolling]);

  const handleRetry = useCallback(async () => {
    if (!bookingId) {
      router.push(
        `/book/${propertyId}${bookingQuery ? `?${bookingQuery}` : ''}`,
      );
      return;
    }
    setRetrying(true);
    setRetryError(null);
    try {
      const bookingUseCase = getBookingUseCase();
      const { paymentSessionId } = await bookingUseCase.retryPayment(bookingId);
      const returnUrl = `${window.location.origin}/book/${propertyId}/status?bookingId=${bookingId}&status={order_status}${bookingQuery ? `&${bookingQuery}` : ''}`;
      const cfResult = await cashfreeCheckout({ paymentSessionId, returnUrl });
      if (cfResult.error) {
        setRetryError(
          cfResult.error.message ?? 'Payment failed. Please try again.',
        );
      }
    } catch (err) {
      setRetryError(
        err instanceof Error
          ? err.message
          : 'Could not initiate payment. Please try again.',
      );
    } finally {
      setRetrying(false);
    }
  }, [bookingId, bookingQuery, cashfreeCheckout, propertyId, router]);

  if (pollState === 'confirmed') {
    return (
      <BookingConfirmedScreen
        bookingDetails={bookingDetails}
        onViewBooking={() => router.push('/dashboard/bookings')}
      />
    );
  }

  if (pollState === 'failed') {
    return (
      <BookingFailedScreen
        message={errorMessage ?? 'Something went wrong with your payment.'}
        retryError={retryError}
        retrying={retrying}
        onRetry={() => void handleRetry()}
        onHome={() => router.push('/')}
      />
    );
  }

  if (pollState === 'timeout') {
    return (
      <BookingTimeoutScreen
        onViewBookings={() => router.push('/dashboard/bookings')}
        onHome={() => router.push('/')}
      />
    );
  }

  // Polling state
  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] px-4'>
      <div className='w-full max-w-md text-center space-y-6'>
        <div className='flex justify-center'>
          <Loader2 className='size-12 text-muted-foreground animate-spin' />
        </div>
        <div>
          <h1 className='text-2xl font-bold text-foreground mb-2'>
            Confirming your payment…
          </h1>
          <p className='text-muted-foreground text-sm'>
            Please wait while we verify your payment with the gateway.
          </p>
        </div>
      </div>
    </div>
  );
}
