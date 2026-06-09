"use client";

import { LeaveReviewCard } from "@/components/dashboard/guest/reviews/leave-review-card";
import { Button } from "@/components/ui/button";
import { CancelBookingModal } from "@/components/ui/cancel-booking-modal";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import { getBookingUseCase } from "@/domain/di";
import type { GuestBooking } from "@/domain/entities";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/utils/api-fetch";
import { formatCurrency } from "@/lib/utils/currency";
import { differenceInDays, format, parseISO } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Moon,
  Phone,
  User,
  Users,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    text: "text-emerald-600",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    text: "text-amber-600",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    pill: "bg-slate-100 text-slate-500 border-slate-200",
    dot: "bg-slate-400",
    text: "text-slate-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    pill: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-400",
    text: "text-red-500",
  },
} as const;

interface PriceSummary {
  subtotal: number;
  totalFees: number;
  taxAmount: number;
  totalDiscount: number;
  grandTotal: number;
  currency: string;
}

interface HostInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface DetailData {
  booking: GuestBooking;
  summary: PriceSummary;
  host: HostInfo | null;
  specialRequests: string | null;
  numberOfNights: number;
}

function parseRaw(data: Record<string, unknown>): DetailData {
  const b = (data.booking as Record<string, unknown> | undefined) ?? data;
  const p = (data.property as Record<string, unknown> | undefined) ?? {};
  const s = (data.summary as Record<string, unknown> | undefined) ?? {};
  const h = (data.host as Record<string, unknown> | undefined) ?? null;

  const location = (() => {
    const loc = p.location as Record<string, unknown> | undefined;
    if (loc)
      return [loc.city, loc.state, loc.country].filter(Boolean).join(", ");
    return String(data.locationLabel ?? data.location ?? "");
  })();

  const coverImage = (() => {
    const images = p.images as Array<{ url: string }> | undefined;
    if (images && images.length > 0) return images[0].url;
    if (typeof data.propertyImage === "string") return data.propertyImage;
    return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
  })();

  const checkIn = String(
    b.checkInDate ?? b.checkIn ?? data.checkInDate ?? data.checkIn ?? "",
  );
  const checkOut = String(
    b.checkOutDate ?? b.checkOut ?? data.checkOutDate ?? data.checkOut ?? "",
  );

  const currency = String(s.currency ?? b.currency ?? data.currency ?? "USD");
  const grandTotal =
    typeof s.grandTotal === "number"
      ? s.grandTotal
      : typeof b.grandTotal === "number"
        ? b.grandTotal
        : typeof data.totalPrice === "number"
          ? data.totalPrice
          : typeof data.totalAmount === "number"
            ? data.totalAmount
            : 0;

  const booking: GuestBooking = {
    id: String(b.id ?? data.id ?? ""),
    propertyId: String(p.id ?? b.propertyId ?? data.propertyId ?? ""),
    propertyName: String(
      p.title ?? b.propertyTitle ?? data.propertyTitle ?? "Unknown Property",
    ),
    location,
    checkIn,
    checkOut,
    guests:
      typeof b.guestCount === "number"
        ? b.guestCount
        : typeof data.guestCount === "number"
          ? data.guestCount
          : 1,
    totalAmount: grandTotal,
    currency,
    status: ((b.status ?? data.status) as GuestBooking["status"]) ?? "pending",
    coverImage,
    reviewLeft:
      typeof b.reviewLeft === "boolean"
        ? b.reviewLeft
        : typeof data.reviewLeft === "boolean"
          ? data.reviewLeft
          : undefined,
  };

  const summary: PriceSummary = {
    subtotal: typeof s.subtotal === "number" ? s.subtotal : 0,
    totalFees: typeof s.totalFees === "number" ? s.totalFees : 0,
    taxAmount: typeof s.taxAmount === "number" ? s.taxAmount : 0,
    totalDiscount: typeof s.totalDiscount === "number" ? s.totalDiscount : 0,
    grandTotal,
    currency,
  };

  const host: HostInfo | null = h
    ? {
        id: String(h.id ?? ""),
        name: String(h.name ?? "Host"),
        email: String(h.email ?? ""),
        phone: h.phone ? String(h.phone) : undefined,
      }
    : null;

  return {
    booking,
    summary,
    host,
    specialRequests: b.specialRequests ? String(b.specialRequests) : null,
    numberOfNights: typeof b.numberOfNights === "number" ? b.numberOfNights : 0,
  };
}

function safeParseISO(str: string) {
  try {
    return str ? parseISO(str) : null;
  } catch {
    return null;
  }
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <span className="text-sm text-slate-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right">
        {value}
      </span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function LoadingSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6 max-w-7xl mx-auto">
      <Skeleton className="h-5 w-32 mb-6" />
      <Skeleton className="h-72 w-full rounded-2xl mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-4 w-40 mt-4" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

interface Props {
  bookingId: string;
}

export function BookingDetailView({ bookingId }: Props) {
  const router = useRouter();
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch(
          `${apiUrl(API_CONSTANTS.ENDPOINTS.BOOKINGS.DETAILS)}?bookingId=${bookingId}`,
          { cache: "no-store" },
        );
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const { data } = await res.json();
        if (!data) {
          setNotFound(true);
          return;
        }
        setDetail(parseRaw(data as Record<string, unknown>));
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bookingId]);

  const handleCancel = useCallback(
    async (reason: string) => {
      if (!detail) return;
      setCancelling(true);
      try {
        await getBookingUseCase().cancelBooking(detail.booking.id, reason);
        setDetail((prev) =>
          prev
            ? {
                ...prev,
                booking: { ...prev.booking, status: "cancelled" as const },
              }
            : prev,
        );
        setCancelModalOpen(false);
      } finally {
        setCancelling(false);
      }
    },
    [detail],
  );

  if (loading) return <LoadingSkeleton />;

  if (notFound || !detail) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="font-semibold text-foreground text-lg">
          Booking not found
        </p>
        <p className="text-sm text-muted-foreground mt-2 mb-6">
          This booking may have been removed or doesn&apos;t exist.
        </p>
        <Button asChild variant="outline" className="rounded-xl gap-2">
          <Link href="/dashboard/bookings">
            <ArrowLeft className="size-4" />
            Back to bookings
          </Link>
        </Button>
      </div>
    );
  }

  const { booking, summary, host, specialRequests } = detail;
  const checkInDate = safeParseISO(booking.checkIn);
  const checkOutDate = safeParseISO(booking.checkOut);
  const nights =
    checkInDate && checkOutDate
      ? differenceInDays(checkOutDate, checkInDate)
      : detail.numberOfNights;
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  const canCancel =
    booking.status === "confirmed" || booking.status === "pending";
  const showReview = booking.status === "completed" && !booking.reviewLeft;

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-10 py-6 max-w-7xl mx-auto">
        {/* Back nav */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to bookings
        </button>

        {/* Hero — full width */}
        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 mb-8">
          <Image
            src={booking.coverImage}
            alt={booking.propertyName}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border mb-3",
                status.pill,
              )}
            >
              <span
                className={cn("size-1.5 rounded-full shrink-0", status.dot)}
              />
              {status.label}
            </div>
            <h1 className="text-white font-bold text-2xl leading-snug">
              {booking.propertyName}
            </h1>
            {booking.location && (
              <p className="text-white/80 text-sm flex items-center gap-1.5 mt-1.5">
                <MapPin className="size-3.5 shrink-0" />
                {booking.location}
              </p>
            )}
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stay dates chips */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-4 text-center">
                <CalendarDays className="size-4 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                  Check-in
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {checkInDate ? format(checkInDate, "MMM d") : "—"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {checkInDate ? format(checkInDate, "yyyy") : ""}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-4 text-center">
                <Moon className="size-4 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                  Nights
                </p>
                <p className="text-3xl font-bold text-slate-900 leading-none mt-1">
                  {nights || "—"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-4 text-center">
                <CalendarDays className="size-4 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                  Check-out
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {checkOutDate ? format(checkOutDate, "MMM d") : "—"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {checkOutDate ? format(checkOutDate, "yyyy") : ""}
                </p>
              </div>
            </div>

            {/* Booking details */}
            <div>
              <SectionHeading>Booking Details</SectionHeading>
              <div className="rounded-xl border border-slate-100 bg-white divide-y divide-slate-50 overflow-hidden px-4">
                <DetailRow
                  label="Status"
                  value={
                    <span
                      className={cn(
                        "flex items-center gap-1.5 justify-end font-semibold",
                        status.text,
                      )}
                    >
                      <StatusIcon className="size-3.5" />
                      {status.label}
                    </span>
                  }
                />
                <DetailRow
                  label="Guests"
                  value={
                    <span className="flex items-center gap-1.5 justify-end">
                      <Users className="size-3.5 text-slate-400" />
                      {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
                    </span>
                  }
                />
                <DetailRow
                  label="Booking ID"
                  value={`#${booking.id.slice(0, 8).toUpperCase()}`}
                />

                {specialRequests && (
                  <DetailRow label="Special requests" value={specialRequests} />
                )}
              </div>
            </div>

            {/* Host info */}
            {host && (
              <div>
                <SectionHeading>Your Host</SectionHeading>
                <div className="rounded-xl border border-slate-100 bg-white p-5 flex items-start gap-4">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="size-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{host.name}</p>
                    <div className="mt-2 space-y-1">
                      {host.email && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="size-3.5 shrink-0" />
                          {host.email}
                        </p>
                      )}
                      {host.phone && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Phone className="size-3.5 shrink-0" />
                          {host.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Leave a review */}
            {showReview && (
              <div>
                <SectionHeading>Leave a Review</SectionHeading>
                <LeaveReviewCard
                  bookingId={booking.id}
                  propertyName={booking.propertyName}
                  onReviewed={() =>
                    setDetail((prev) =>
                      prev
                        ? {
                            ...prev,
                            booking: { ...prev.booking, reviewLeft: true },
                          }
                        : prev,
                    )
                  }
                />
              </div>
            )}

            {/* Cancel action (mobile — below content) */}
            {canCancel && (
              <div className="lg:hidden">
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full rounded-xl gap-2"
                  disabled={cancelling}
                  onClick={() => setCancelModalOpen(true)}
                >
                  {/* {cancelling ? (
                    <Clock className='size-4 animate-spin' />
                  ) : (
                    <XCircle className='size-4' />
                  )} */}
                  Cancel Booking
                </Button>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN — sticky summary card ── */}
          <div className="space-y-4 lg:sticky lg:top-6">
            {/* Price summary card */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Price Summary
                </p>
              </div>
              <div className="px-5 py-4 space-y-0 divide-y divide-slate-50">
                {summary.subtotal > 0 && (
                  <div className="flex justify-between py-2.5">
                    <span className="text-sm text-slate-500">
                      {nights > 0
                        ? `${nights} night${nights !== 1 ? "s" : ""} x ${formatCurrency(summary.subtotal / nights, summary.currency)}`
                        : "Base price"}
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {formatCurrency(summary.subtotal, summary.currency)}
                    </span>
                  </div>
                )}
                {summary.totalFees > 0 && (
                  <div className="flex justify-between py-2.5">
                    <span className="text-sm text-slate-500">Service fee</span>
                    <span className="text-sm font-medium text-slate-900">
                      {formatCurrency(summary.totalFees, summary.currency)}
                    </span>
                  </div>
                )}
                {summary.taxAmount > 0 && (
                  <div className="flex justify-between py-2.5">
                    <span className="text-sm text-slate-500">Taxes</span>
                    <span className="text-sm font-medium text-slate-900">
                      {formatCurrency(summary.taxAmount, summary.currency)}
                    </span>
                  </div>
                )}
                {summary.totalDiscount > 0 && (
                  <div className="flex justify-between py-2.5">
                    <span className="text-sm text-emerald-600">Discount</span>
                    <span className="text-sm font-medium text-emerald-600">
                      −{formatCurrency(summary.totalDiscount, summary.currency)}
                    </span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="px-5 py-4 flex items-center justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-slate-900">
                  {formatCurrency(summary.grandTotal, summary.currency)}
                </span>
              </div>
            </div>

            {canCancel && (
              <Button
                variant="destructive"
                size="lg"
                className="w-full rounded-xl gap-2 hidden lg:flex"
                disabled={cancelling}
                onClick={() => setCancelModalOpen(true)}
              >
                {/* {cancelling ? <Clock className='size-4 animate-spin' /> : <XCircle className='size-4' />} */}
                Cancel Booking
              </Button>
            )}
          </div>
        </div>
      </div>

      <CancelBookingModal
        open={cancelModalOpen}
        role="guest"
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancel}
      />
    </>
  );
}
