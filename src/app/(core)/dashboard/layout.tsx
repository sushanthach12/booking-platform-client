import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { User } from "@/domain/entities";
import { COOKIE_KEYS } from "@/lib/utils/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.AUTH_TOKEN)?.value;
  if (!token) redirect("/");

  const authUserRaw = cookieStore.get(COOKIE_KEYS.AUTH_USER)?.value;
  let user: User | null = null;
  if (authUserRaw) {
    try {
      user = JSON.parse(authUserRaw) as User;
    } catch {
      // ignore
    }
  }
  const isHost = !!(
    user?.isHost ||
    (user as unknown as { role?: string } | null)?.role === "host"
  );

  // Pass the server-read user down so the sidebar renders identical markup on
  // the server and the first client render (no hydration mismatch, no flash).
  return (
    <DashboardShell isHost={isHost} user={user}>
      {children}
    </DashboardShell>
  );
}
