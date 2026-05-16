"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type {
  HostBookingSummary,
  HostDashboardStats,
  HostListingSummary,
} from "@/domain/entities";
import { formatCurrency } from "@/lib/utils/currency";
import { BookOpen, Building2, DollarSign } from "lucide-react";

interface HostOverviewTabProps {
  stats: HostDashboardStats;
  draftListings: HostListingSummary[];
  recentBookings: HostBookingSummary[];
  onViewBookings: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};


export function HostOverviewTab({
  stats,
  draftListings,
  recentBookings,
  onViewBookings,
}: HostOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-slate-100 shadow-none">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
              <Building2 className="size-5 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalListings}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Total listings
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 shadow-none">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <BookOpen className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalBookings}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Total bookings
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 shadow-none">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <DollarSign className="size-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(stats.totalRevenue, stats.currency)}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Total revenue
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Draft listings warning */}
      {draftListings.length > 0 && (
        <Card className="rounded-2xl border-amber-200 bg-amber-50 shadow-none">
          <CardContent className="pt-5">
            <p className="font-semibold text-amber-800 mb-1">
              Incomplete listings
            </p>
            <p className="text-sm text-amber-700 mb-3">
              You have {draftListings.length} unfinished propert
              {draftListings.length === 1 ? "y" : "ies"}. Continue to publish.
            </p>
            <ul className="space-y-2">
              {draftListings.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-2 border-b border-amber-200 pb-2 last:border-0"
                >
                  <span className="font-medium text-sm truncate text-amber-900">
                    {l.title}
                  </span>
                  {/* TODO: Continue draft link — disabled, will improve in future */}
                  {/* <Link
                    href={`/become-host?draftId=${l.id}`}
                    className="shrink-0 rounded-lg bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
                  >
                    Continue
                  </Link> */}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
            Recent bookings
          </h2>
          {recentBookings.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-500"
              onClick={onViewBookings}
            >
              View all
            </Button>
          )}
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">
            No bookings yet.
          </p>
        ) : (
          <div className="space-y-2">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {b.propertyName ?? b.bookingNumber ?? b.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {b.checkIn && b.checkOut
                      ? `${b.checkIn} → ${b.checkOut}`
                      : null}
                    {b.guestCount != null ? ` · ${b.guestCount} guests` : null}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {b.totalAmount != null && (
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(b.totalAmount, b.currency ?? "USD")}
                    </span>
                  )}
                  {b.status && (
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold capitalize ${STATUS_COLORS[b.status] ?? ""}`}
                    >
                      {b.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
