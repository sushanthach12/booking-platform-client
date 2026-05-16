"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuestBooking } from "@/domain/entities";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { differenceInDays, format, parseISO } from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Moon,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import Image from "next/image";

const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    pill: "bg-amber-50 text-amber-700 border-amber-200",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    pill: "bg-slate-100 text-slate-500 border-slate-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    pill: "bg-red-50 text-red-500 border-red-200",
  },
} as const;

interface BookingCardProps {
  booking: GuestBooking;
  onCancel?: (id: string) => void;
  cancellingId?: string | null;
  onViewDetails?: (booking: GuestBooking) => void;
}

export function BookingCard({
  booking,
  onCancel,
  cancellingId,
  onViewDetails,
}: BookingCardProps) {
  const nights = differenceInDays(
    parseISO(booking.checkOut),
    parseISO(booking.checkIn),
  );
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  const isCancelling = cancellingId === booking.id;
  const canCancel =
    onCancel &&
    (booking.status === "confirmed" || booking.status === "pending");

  return (
    <div
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onViewDetails?.(booking)}
    >
      {/* Image */}
      <div className="aspect-4/3 relative overflow-hidden bg-muted shrink-0">
        <Image
          src={booking.coverImage}
          alt={booking.propertyName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-2.5 left-2.5">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-semibold gap-1 px-2 py-0.5 rounded-full border bg-white/90 backdrop-blur-sm",
              status.pill,
            )}
          >
            <StatusIcon className="size-2.5" />
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Body — grows to fill, pushes footer down */}
      <div className="flex flex-col flex-1 p-3">
        {/* Property name */}
        <p className="font-semibold text-foreground text-sm leading-snug truncate mb-1">
          {booking.propertyName}
        </p>

        {/* Dates + meta */}
        <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground flex-1">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3 shrink-0" />
            {format(parseISO(booking.checkIn), "MMM d")} –{" "}
            {format(parseISO(booking.checkOut), "MMM d")}
          </span>
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Moon className="size-3 shrink-0" />
              {nights}n
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-3 shrink-0" />
              {booking.guests}g
            </span>
          </span>
        </div>

        {/* Footer: price + action — always at bottom */}
        <div
          className="flex items-center justify-between gap-1 mt-3 pt-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <p className="font-bold text-foreground text-sm tabular-nums leading-none">
              {formatCurrency(booking.totalAmount, booking.currency)}
            </p>
            <p className="text-[10px] text-muted-foreground">total</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {booking.status === "completed" && !booking.reviewLeft && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[11px] rounded-lg text-warm-accent hover:bg-warm-accent-subtle gap-0.5"
              >
                <Star className="size-3" />
                Review
              </Button>
            )}
            {canCancel && (
              <Button
                variant="ghost"
                size="sm"
                disabled={isCancelling}
                onClick={() => onCancel(booking.id)}
                className="h-7 px-2 text-[11px] rounded-lg text-destructive hover:bg-red-50"
              >
                {isCancelling && <Loader2 className="size-3 mr-0.5 animate-spin" />}
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
