// Server Component — fetches profile data and passes to ProfileView
import { ProfileView } from "./profile-view";
import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { GuestProfile, User } from "@/domain/entities";
import { COOKIE_KEYS } from "@/lib/utils/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function ProfileTemplate() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.AUTH_TOKEN)?.value;
  if (!token) redirect("/signin");

  const authUserRaw = cookieStore.get(COOKIE_KEYS.AUTH_USER)?.value;
  let cookieUser: User | null = null;
  if (authUserRaw) {
    try {
      cookieUser = JSON.parse(authUserRaw) as User;
    } catch {
      // ignore
    }
  }

  const authHeaders = { Authorization: `JWT ${token}`, "Content-Type": "application/json" };
  const profileRes = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.USERS.PROFILE), {
    headers: authHeaders,
    cache: "no-store",
  });

  let profile: GuestProfile = {
    id: cookieUser?.id ?? "",
    firstName: cookieUser?.firstName ?? "",
    lastName: cookieUser?.lastName ?? "",
    email: cookieUser?.email ?? "",
    phone: "",
    avatarUrl: cookieUser?.avatar ?? null,
    memberSince: cookieUser?.createdAt ?? new Date().toISOString(),
    bio: "",
    location: "",
    isVerified: false,
  };

  if (profileRes.ok) {
    try {
      const { data } = (await profileRes.json()) as { data: Record<string, unknown> };
      profile = {
        ...profile,
        phone: typeof data.phone === "string" ? data.phone : "",
        bio: typeof data.bio === "string" ? data.bio : "",
        location: typeof data.location === "string" ? data.location : "",
        isVerified: typeof data.isVerified === "boolean" ? data.isVerified : false,
        avatarUrl: typeof data.avatar === "string" ? data.avatar : profile.avatarUrl,
      };
    } catch {
      // use cookie-based profile
    }
  }

  return <ProfileView profile={profile} />;
}
