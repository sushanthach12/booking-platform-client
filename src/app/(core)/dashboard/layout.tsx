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
  if (!token) redirect("/signin");

  const authUserRaw = cookieStore.get(COOKIE_KEYS.AUTH_USER)?.value;
  let isHost = false;
  if (authUserRaw) {
    try {
      const user = JSON.parse(authUserRaw) as User;
      isHost = !!(
        user.isHost || (user as unknown as { role?: string }).role === "host"
      );
    } catch {
      // ignore
    }
  }

  return <DashboardShell isHost={isHost}>{children}</DashboardShell>;
}
