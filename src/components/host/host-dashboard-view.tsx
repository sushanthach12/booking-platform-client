"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { HostBookingSummary, HostListingSummary } from "@/domain/entities";
import Link from "next/link";

interface HostDashboardViewProps {
  listings: HostListingSummary[];
  bookings: HostBookingSummary[];
}

export function HostDashboardView({
  listings,
  bookings,
}: HostDashboardViewProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold">Host dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Listings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your properties.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {listings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No listings yet, or you need a host account to load them.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {listings.map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0"
                  >
                    <span className="font-medium truncate">{l.title}</span>
                    {l.status ? (
                      <span className="text-muted-foreground shrink-0">
                        {l.status}
                      </span>
                    ) : null}
                    <Link
                      href={`/properties/${l.id}`}
                      className="text-primary text-xs underline shrink-0"
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Bookings</h2>
            <p className="text-sm text-muted-foreground">
              Upcoming and past bookings.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No bookings for your properties yet.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {bookings.map((b) => (
                  <li
                    key={b.id}
                    className="border-b border-border pb-2 last:border-0"
                  >
                    <div className="font-medium">
                      {b.bookingNumber ?? b.id.slice(0, 8)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {b.checkIn && b.checkOut
                        ? `${b.checkIn} → ${b.checkOut}`
                        : null}
                      {b.guestCount != null
                        ? ` · ${b.guestCount} guests`
                        : null}
                      {b.status ? ` · ${b.status}` : null}
                      {b.totalAmount != null ? ` · ${b.totalAmount}` : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
