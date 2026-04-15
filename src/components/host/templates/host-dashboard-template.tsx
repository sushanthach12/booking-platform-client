import type { HostDashboardStats, User } from "@/domain/entities";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HostDashboardView } from "../host-dashboard-view";
import { fetchHostDashboardData } from "../utils/host-dashboard.fetcher";

export default async function HostDashboardTemplate() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/signin");

  let currentUser: User | null = null;
  const authUserRaw = cookieStore.get("auth_user")?.value;
  if (authUserRaw) {
    try {
      currentUser = JSON.parse(authUserRaw) as User;
    } catch {
      // ignore
    }
  }

  const { listings, draftListings, bookings } =
    await fetchHostDashboardData(token);

  const stats: HostDashboardStats = {
    totalListings: listings.length,
    totalBookings: bookings.length,
    totalRevenue: bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + (b.totalAmount ?? 0), 0),
    currency:
      listings.find((l) => l.currency)?.currency ??
      bookings.find((b) => b.currency)?.currency ??
      "USD",
  };

  return (
    <HostDashboardView
      listings={listings}
      draftListings={draftListings}
      bookings={bookings}
      stats={stats}
      currentUserId={currentUser?.id ?? ""}
      currentUserName={
        currentUser
          ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
          : ""
      }
      currentUserEmail={currentUser?.email ?? ""}
      currentUserAvatar={currentUser?.avatar}
    />
  );
}
