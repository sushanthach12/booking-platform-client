"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Presentational host dashboard. All state passed from HostDashboardTemplate.
 */
interface HostDashboardViewProps {
  /** From template: listings count or summary */
  listingsSummary?: string;
  /** From template: bookings summary */
  bookingsSummary?: string;
}

export function HostDashboardView({
  listingsSummary,
  bookingsSummary,
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
          <CardContent>
            {listingsSummary != null && (
              <p className="text-sm text-muted-foreground">{listingsSummary}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Listings placeholder.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Bookings</h2>
            <p className="text-sm text-muted-foreground">
              Upcoming and past bookings.
            </p>
          </CardHeader>
          <CardContent>
            {bookingsSummary != null && (
              <p className="text-sm text-muted-foreground">{bookingsSummary}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Bookings placeholder.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
