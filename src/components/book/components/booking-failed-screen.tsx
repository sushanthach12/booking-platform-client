"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface BookingFailedScreenProps {
  message: string;
  retryError: string | null;
  retrying: boolean;
  onRetry: () => void;
  onHome: () => void;
}

export function BookingFailedScreen({
  message,
  retryError,
  retrying,
  onRetry,
  onHome,
}: BookingFailedScreenProps) {
  return (
    <div className="flex flex-col w-full min-h-[90vh] items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative flex items-center justify-center">
            <span className="absolute size-16 rounded-full bg-destructive/20 animate-ping" />
            <div className="anim-scale-in size-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <AlertTriangle
                className="size-8 text-destructive"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="anim-fade-up-1 text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
            Payment failed
          </h1>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>

        {/* Status card */}
        <div className="anim-fade-up-2 rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-4">
          <div className="bg-linear-to-r from-destructive/80 to-rose-500/80 px-5 py-3 flex items-center gap-2">
            <AlertTriangle className="size-4 text-white" strokeWidth={2.5} />
            <span className="text-white text-sm font-semibold">
              Payment Unsuccessful
            </span>
          </div>
          <div className="px-5 py-5">
            <p className="text-sm text-muted-foreground">
              Your payment was not processed. Your reservation has not been
              confirmed. You can retry with the same dates or go back to home.
            </p>
          </div>
        </div>

        {/* Retry error */}
        {retryError && (
          <p className="anim-fade-up-3 text-sm text-destructive text-center mb-4">
            {retryError}
          </p>
        )}

        {/* Actions */}
        <div className="anim-fade-up-3 flex flex-col gap-3">
          <Button onClick={onRetry} disabled={retrying}>
            {retrying ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Preparing payment…
              </>
            ) : (
              "Try again"
            )}
          </Button>
          <Button variant="ghost" onClick={onHome}>
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
