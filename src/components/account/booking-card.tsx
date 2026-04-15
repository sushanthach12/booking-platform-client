"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuestBooking } from "@/domain/entities";
import { cn } from "@/lib/utils";
import { differenceInDays, format, parseISO } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Star,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-50 text-red-600 border-red-200",
  },
} as const;

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface BookingCardProps {
  booking: GuestBooking;
  onCancel?: (id: string) => void;
  cancellingId?: string | null;
}

export function BookingCard({ booking, onCancel, cancellingId }: BookingCardProps) {
  const nights = differenceInDays(parseISO(booking.checkOut), parseISO(booking.checkIn));
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  const isCancelling = cancellingId === booking.id;
  const canCancel = onCancel && (booking.status === "confirmed" || booking.status === "pending");

  return (
    <div className="group flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
      <div className="relative size-20 shrink-0 rounded-xl overflow-hidden">
        <Image
          src={booking.coverImage}
          alt={booking.propertyName}
          fill
          sizes="80px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold text-slate-900 text-sm leading-tight truncate">
            {booking.propertyName}
          </p>
          <Badge
            variant="outline"
            className={cn("shrink-0 text-[10px] font-semibold gap-1 px-2 py-0.5", status.className)}
          >
            <StatusIcon className="size-3" />
            {status.label}
          </Badge>
        </div>

        <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
          <MapPin className="size-3" />
          {booking.location}
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="size-3 text-slate-400" />
            {format(parseISO(booking.checkIn), "MMM d")} –{" "}
            {format(parseISO(booking.checkOut), "MMM d, yyyy")}
          </span>
          <span className="text-slate-300">·</span>
          <span>{nights} nights</span>
          <span className="text-slate-300">·</span>
          <span>{booking.guests} guests</span>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end justify-between">
        <p className="font-bold text-slate-900 text-sm">
          {formatCurrency(booking.totalAmount, booking.currency)}
        </p>
        <div className="flex flex-col items-end gap-1">
          {booking.status === "completed" && !booking.reviewLeft && (
            <Button
              variant="outline"
              size="sm"
              className="text-[11px] h-7 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              <Star className="size-3 mr-1" />
              Review
            </Button>
          )}
          {booking.status === "confirmed" && (
            <Link href={`/properties/${booking.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] h-7 rounded-lg text-slate-500 hover:text-slate-900"
              >
                View
                <ExternalLink className="size-3 ml-1" />
              </Button>
            </Link>
          )}
          {canCancel && (
            <Button
              variant="ghost"
              size="sm"
              disabled={isCancelling}
              onClick={() => onCancel(booking.id)}
              className="text-[11px] h-7 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              {isCancelling ? (
                <Loader2 className="size-3 mr-1 animate-spin" />
              ) : null}
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
