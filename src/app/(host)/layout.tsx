/**
 * Host route group: host dashboard, listings, payouts (logged-in host).
 * URLs: /host/dashboard, /host/listings, etc.
 */
import { Header } from "@/components/header";

export default function HostLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
