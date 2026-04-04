"use client";

// src/components/account/account-view.tsx
// Full client view — tabs, edit dialog, booking cards, stats

import { getAuthUseCase } from "@/domain/di";
import { differenceInDays, format, parseISO } from "date-fns";
import {
  Bell,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Edit3,
  ExternalLink,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Phone,
  ShieldCheck,
  Star,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  GuestBooking,
  GuestBookingsSummary,
  GuestProfile,
} from "@/domain/interfaces";
import { cn } from "@/lib/utils";
import { EditProfileDialog } from "./edit-profile-modal";

interface AccountViewProps {
  profile: GuestProfile;
  bookingsSummary: GuestBookingsSummary;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
type TabId = "bookings" | "settings";

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

function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({
  icon: Icon,
  value,
  label,
  accent = false,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 flex flex-col gap-1.5",
        accent
          ? "bg-rose-500 text-white"
          : "bg-slate-50 border border-slate-100",
      )}
    >
      <Icon
        className={cn("size-4", accent ? "text-white/80" : "text-slate-400")}
      />
      <div
        className={cn(
          "text-2xl font-bold tracking-tight",
          accent ? "text-white" : "text-slate-900",
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "text-xs font-medium",
          accent ? "text-white/70" : "text-slate-500",
        )}
      >
        {label}
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: GuestBooking }) {
  const nights = differenceInDays(
    parseISO(booking.checkOut),
    parseISO(booking.checkIn),
  );
  const status = STATUS_CONFIG[booking.status];
  const StatusIcon = status.icon;

  return (
    <div className="group flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
      {/* Cover image */}
      <div className="relative size-20 shrink-0 rounded-xl overflow-hidden">
        <Image
          src={booking.coverImage}
          alt={booking.propertyName}
          fill
          sizes="80px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold text-slate-900 text-sm leading-tight truncate">
            {booking.propertyName}
          </p>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 text-[10px] font-semibold gap-1 px-2 py-0.5",
              status.className,
            )}
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

      {/* Amount + action */}
      <div className="shrink-0 flex flex-col items-end justify-between">
        <p className="font-bold text-slate-900 text-sm">
          {formatCurrency(booking.totalAmount, booking.currency)}
        </p>
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
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings section rows
// ---------------------------------------------------------------------------
function SettingsRow({
  icon: Icon,
  label,
  description,
  action,
  destructive = false,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  action?: React.ReactNode;
  destructive?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div
        className={cn(
          "size-9 rounded-xl flex items-center justify-center shrink-0",
          destructive ? "bg-red-50" : "bg-slate-50",
        )}
      >
        <Icon
          className={cn(
            "size-4",
            destructive ? "text-red-500" : "text-slate-500",
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-semibold",
            destructive ? "text-red-600" : "text-slate-800",
          )}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      {action ?? <ChevronRight className="size-4 text-slate-300 shrink-0" />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main AccountView
// ---------------------------------------------------------------------------
export function AccountView({ profile, bookingsSummary }: AccountViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("bookings");
  const [localProfile, setLocalProfile] = useState(profile);
  const [open, setOpen] = useState(false);
  const { stats, upcoming, past } = bookingsSummary;
  const fullName = `${localProfile.firstName} ${localProfile.lastName}`;

  const handleSignOut = async () => {
    await getAuthUseCase().logout();
    window.location.href = "/";
  };

  function handleProfileSave(updated: Partial<GuestProfile>) {
    setLocalProfile((p) => ({ ...p, ...updated }));
    // TODO: call AuthUseCase.updateProfile(updated) when wired
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Profile header banner ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="size-20 ring-4 ring-white shadow-md">
                <AvatarImage
                  src={localProfile.avatarUrl ?? undefined}
                  alt={fullName}
                />
                <AvatarFallback className="bg-rose-100 text-rose-600 text-xl font-bold">
                  {getInitials(localProfile.firstName, localProfile.lastName)}
                </AvatarFallback>
              </Avatar>
              <button
                aria-label="Change profile photo"
                className="absolute -bottom-1 -right-1 size-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                <Camera className="size-3.5 text-slate-500" />
              </button>
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  {fullName}
                </h1>
                {localProfile.isVerified && (
                  <Badge
                    variant="outline"
                    className="gap-1 text-emerald-700 border-emerald-200 bg-emerald-50 text-xs font-semibold"
                  >
                    <ShieldCheck className="size-3" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
                {localProfile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {localProfile.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  Member since{" "}
                  {format(parseISO(localProfile.memberSince), "MMMM yyyy")}
                </span>
              </div>

              {localProfile.bio && (
                <p className="text-sm text-slate-600 max-w-lg">
                  {localProfile.bio}
                </p>
              )}
            </div>

            <div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg border-slate-200 text-slate-600 hover:text-slate-900"
                onClick={() => setOpen(true)}
              >
                <Edit3 className="size-3.5" />
                Edit profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
          {/* ── Left: tabs content ── */}
          <div>
            {/* Tab bar */}
            <div className="flex gap-1 bg-white rounded-2xl p-1 border border-slate-100 mb-6 w-fit">
              {(["bookings", "settings"] as TabId[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-150",
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ── Bookings tab ── */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                {/* Upcoming */}
                {upcoming.length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">
                      Upcoming
                    </h2>
                    <div className="space-y-3">
                      {upcoming.map((b) => (
                        <BookingCard key={b.id} booking={b} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Past */}
                {past.length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">
                      Past trips
                    </h2>
                    <div className="space-y-3">
                      {past.map((b) => (
                        <BookingCard key={b.id} booking={b} />
                      ))}
                    </div>
                  </div>
                )}

                {upcoming.length === 0 && past.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <Calendar className="size-10 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold text-slate-600">
                      No bookings yet
                    </p>
                    <p className="text-sm mt-1">
                      Start exploring and book your first stay.
                    </p>
                    <Button
                      asChild
                      className="mt-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white"
                    >
                      <Link href="/search">Browse properties</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ── Settings tab ── */}
            {activeTab === "settings" && (
              <div className="space-y-4">
                <Card className="rounded-2xl border-slate-100 shadow-none">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                      Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y divide-slate-50 px-6">
                    <SettingsRow
                      icon={Mail}
                      label="Email address"
                      description={localProfile.email}
                    />
                    <SettingsRow
                      icon={Lock}
                      label="Password"
                      description="Last changed 3 months ago"
                    />
                    <SettingsRow
                      icon={ShieldCheck}
                      label="Two-factor authentication"
                      description="Add an extra layer of security"
                      action={
                        <Badge
                          variant="outline"
                          className="text-slate-400 text-xs"
                        >
                          Off
                        </Badge>
                      }
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-100 shadow-none">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                      Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y divide-slate-50 px-6">
                    <SettingsRow
                      icon={Bell}
                      label="Notifications"
                      description="Email and push notification settings"
                    />
                    <SettingsRow
                      icon={Globe}
                      label="Language & region"
                      description="English (US) · USD"
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-100 shadow-none">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                      Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y divide-slate-50 px-6">
                    <SettingsRow icon={HelpCircle} label="Help centre" />
                    <SettingsRow
                      icon={LogOut}
                      label="Sign out"
                      destructive
                      action={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs"
                          onClick={handleSignOut}
                        >
                          Sign out
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* ── Right sidebar: stats + contact ── */}
          <div className="space-y-5 lg:sticky lg:top-24">
            {/* Stats grid */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Travel stats
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                <StatCard
                  icon={TrendingUp}
                  value={String(stats.totalTrips)}
                  label="Total trips"
                  accent
                />
                <StatCard
                  icon={Globe}
                  value={String(stats.countriesVisited)}
                  label="Countries"
                />
                <StatCard
                  icon={Moon}
                  value={String(stats.nightsStayed)}
                  label="Nights stayed"
                />
                <StatCard
                  icon={DollarSign}
                  value={`$${(stats.totalSpent / 1000).toFixed(1)}k`}
                  label="Total spent"
                />
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Contact info card */}
            <Card className="rounded-2xl border-slate-100 shadow-none bg-white">
              <CardContent className="pt-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Contact info
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <Mail className="size-3.5 text-slate-400" />
                    </div>
                    <span className="text-slate-700 truncate">
                      {localProfile.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <Phone className="size-3.5 text-slate-400" />
                    </div>
                    <span className="text-slate-700">{localProfile.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Become a host nudge */}
            <div className="rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 p-5 text-white">
              <p className="font-bold text-sm mb-1">Become a host</p>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Share your space and earn extra income with Stayly.
              </p>
              <Button
                asChild
                size="sm"
                className="w-full rounded-xl bg-white text-slate-900 hover:bg-slate-50 font-semibold text-xs"
              >
                <Link href="/become-host">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit button */}
      {open && (
        <EditProfileDialog
          profile={localProfile}
          open={open}
          onOpenChange={setOpen}
          onSave={handleProfileSave}
        />
      )}
    </div>
  );
}
