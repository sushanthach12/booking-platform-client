/**
 * Host route group: host dashboard, listings, payouts (logged-in host).
 * URLs: /host/dashboard, /host/listings, etc.
 */
import { AppLayout } from "@/components/layout";

export default function HostLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppLayout variant="home">{children}</AppLayout>;
}
