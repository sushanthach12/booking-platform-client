import { COOKIE_KEYS } from "@/lib/utils/cookies";
import type { User } from "@/domain/entities";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const authUserRaw = cookieStore.get(COOKIE_KEYS.AUTH_USER)?.value;

  let isHost = false;
  if (authUserRaw) {
    try {
      const user = JSON.parse(authUserRaw) as User;
      isHost = !!(user.isHost || (user as unknown as { role?: string }).role === "host");
    } catch {
      // ignore
    }
  }

  redirect(isHost ? "/dashboard/host/overview" : "/dashboard/profile");
}
