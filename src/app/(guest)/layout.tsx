/**
 * Guest route group: account, bookings, waitlist, price alerts (logged-in guest).
 * URLs: /account, /account/bookings, etc.
 */
export default function GuestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
