"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Presentational account page. All state passed from AccountTemplate.
 */
interface AccountViewProps {
  /** From template: user profile state */
  profile?: { name?: string; email?: string };
  /** From template: bookings count or list summary */
  bookingsSummary?: string;
}

export function AccountView({ profile, bookingsSummary }: AccountViewProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold">Account</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Profile</h2>
            <p className="text-sm text-muted-foreground">
              Your name, email, and avatar.
            </p>
          </CardHeader>
          <CardContent>
            {profile?.name != null && (
              <p className="text-sm text-muted-foreground">{profile.name}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Profile section placeholder.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Bookings</h2>
            <p className="text-sm text-muted-foreground">
              Your upcoming and past trips.
            </p>
          </CardHeader>
          <CardContent>
            {bookingsSummary != null && (
              <p className="text-sm text-muted-foreground">{bookingsSummary}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Bookings list placeholder.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
