"use client";

import { Button } from "@/components/ui/button";
import { getBookingUseCase } from "@/domain/di";
import { AlertCircle, Clock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface BookingDetails {
  status: string;
  bookingNumber?: string;
  propertyTitle?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
}

type PollState = "polling" | "confirmed" | "failed" | "timeout";

const MAX_POLLS = 12;
const POLL_INTERVAL_MS = 3000;

interface BookingStatusViewProps {
  propertyId: string;
  bookingId: string | null;
  /** The status query param Cashfree sends back (e.g. "SUCCESS", "FAILED") */
  returnStatus: string | null;
}

export function BookingStatusView({
  propertyId,
  bookingId,
  returnStatus,
}: BookingStatusViewProps) {
  const router = useRouter();
  const [pollState, setPollState] = useState<PollState>("polling");
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      setPollState("failed");
      setErrorMessage("No booking ID found. Please contact support.");
      return;
    }

    // If Cashfree explicitly returned FAILED/CANCELLED, stop immediately
    if (
      returnStatus &&
      ["FAILED", "CANCELLED", "EXPIRED"].includes(returnStatus.toUpperCase())
    ) {
      setPollState("failed");
      setErrorMessage(
        "Your payment was not completed. You can try booking again.",
      );
      return;
    }

    try {
      const bookingUseCase = getBookingUseCase();
      const statusData = await bookingUseCase.getBookingStatus(bookingId);

      if (!statusData) {
        throw new Error("Booking not found.");
      }

      const status = statusData.status?.toLowerCase();

      if (status === "confirmed" || status === "completed") {
        // Fetch full details once to populate the confirmation card
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
            status: raw.booking?.status ?? "",
            bookingNumber: raw.booking?.bookingNumber,
            propertyTitle: raw.property?.title,
            checkInDate: raw.booking?.checkInDate,
            checkOutDate: raw.booking?.checkOutDate,
            guestCount: raw.booking?.guestCount,
          });
        }
        setPollState("confirmed");
        stopPolling();
        return;
      }

      if (status === "cancelled" || status === "expired") {
        setPollState("failed");
        setErrorMessage(
          "Your booking was cancelled or payment failed. Please try again.",
        );
        stopPolling();
        return;
      }

      // Still pending — poll again if under limit
      pollCount.current += 1;
      if (pollCount.current >= MAX_POLLS) {
        setPollState("timeout");
        stopPolling();
        return;
      }

      timerRef.current = setTimeout(() => void poll(), POLL_INTERVAL_MS);
    } catch (err) {
      pollCount.current += 1;
      if (pollCount.current >= MAX_POLLS) {
        setPollState("timeout");
        stopPolling();
        return;
      }
      // Retry on transient errors
      timerRef.current = setTimeout(() => void poll(), POLL_INTERVAL_MS);
      void err;
    }
  }, [bookingId, returnStatus, stopPolling]);

  useEffect(() => {
    void poll();
    return stopPolling;
  }, [poll, stopPolling]);

  if (pollState === "confirmed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-linear-to-br from-green-400 to-green-500 flex items-center justify-center shadow-[0_8px_32px_rgba(74,222,128,0.45)]">
              <svg
                className="size-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Payment confirmed!
            </h1>
            <p className="text-muted-foreground text-sm">
              Your reservation is confirmed. Have a great stay!
            </p>
          </div>
          {bookingDetails?.bookingNumber && (
            <div className="rounded-2xl border border-border bg-card px-5 py-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Booking Reference
              </p>
              <p className="font-mono text-xl font-bold tracking-widest text-foreground">
                {bookingDetails.bookingNumber}
              </p>
            </div>
          )}
          {bookingDetails?.propertyTitle && (
            <div className="rounded-2xl border border-border bg-card px-5 py-4 text-left space-y-1">
              <p className="font-semibold text-foreground text-sm">
                {bookingDetails.propertyTitle}
              </p>
              {bookingDetails.checkInDate && bookingDetails.checkOutDate && (
                <p className="text-sm text-muted-foreground">
                  {bookingDetails.checkInDate} → {bookingDetails.checkOutDate}
                </p>
              )}
            </div>
          )}
          <Button className="w-full" onClick={() => router.push("/")}>
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  if (pollState === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="size-8 text-destructive" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Payment failed
            </h1>
            <p className="text-muted-foreground text-sm">
              {errorMessage ?? "Something went wrong with your payment."}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push(`/book/${propertyId}`)}>
              Try again
            </Button>
            <Button variant="ghost" onClick={() => router.push("/")}>
              Back to home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (pollState === "timeout") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
              <Clock className="size-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Payment is being processed
            </h1>
            <p className="text-muted-foreground text-sm">
              Your payment is still being verified. This can take a few minutes.
              Check your email or visit your bookings page for updates.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push("/account")}>
              View my bookings
            </Button>
            <Button variant="ghost" onClick={() => router.push("/")}>
              Back to home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Polling state
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <Loader2 className="size-12 text-muted-foreground animate-spin" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Confirming your payment…
          </h1>
          <p className="text-muted-foreground text-sm">
            Please wait while we verify your payment with the gateway.
          </p>
        </div>
      </div>
    </div>
  );
}
