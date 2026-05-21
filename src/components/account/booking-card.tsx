"use client";

import { Badge } from "@/components/ui/badge";
import { GuestBooking } from "@/domain/entities";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { differenceInDays, format, parseISO } from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Moon,
  Users,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
}

export function BookingCard({ booking }: BookingCardProps) {
  const nights = differenceInDays(
    parseISO(booking.checkOut),
    parseISO(booking.checkIn),
  );
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <Link
      href={`/dashboard/bookings/${booking.id}`}
      className="group flex flex-row bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Image — fixed width strip */}
      <div className="relative w-32 sm:w-40 shrink-0 overflow-hidden bg-slate-100">
        <Image
          src={booking.coverImage}
          alt={booking.propertyName}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 min-w-0 px-4 py-3 gap-1.5">
        {/* Property name */}
        <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
          {booking.propertyName}
        </p>

        {/* Location */}
        {booking.location && (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
            <MapPin className="size-3 shrink-0" />
            {booking.location}
          </p>
        )}

        {/* Dates + nights + guests */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3 shrink-0" />
            {format(parseISO(booking.checkIn), "MMM d")} –{" "}
            {format(parseISO(booking.checkOut), "MMM d, yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <Moon className="size-3 shrink-0" />
            {nights} night{nights !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3 shrink-0" />
            {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Price + status */}
        <div className="mt-auto pt-1.5 border-t border-border/50 flex items-center justify-between gap-2">
          <p className="font-bold text-foreground text-sm tabular-nums leading-none">
            {formatCurrency(booking.totalAmount, booking.currency)}
          </p>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 text-[10px] font-semibold gap-1 px-2 py-0.5 rounded-full border",
              status.pill,
            )}
          >
            <StatusIcon className="size-2.5" />
            {status.label}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
