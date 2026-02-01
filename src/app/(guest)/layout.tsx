/**
 * Guest route group: account, bookings, waitlist, price alerts (logged-in guest).
 * URLs: /account, /account/bookings, etc.
 */
import { AppLayout } from "@/components/layout";

export default function GuestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppLayout variant="home">{children}</AppLayout>;
}
