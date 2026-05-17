"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { COOKIE_KEYS, getCookie } from "@/lib/utils/cookies";
import type { User } from "@/domain/entities";

function isHost(): boolean {
  const raw = getCookie(COOKIE_KEYS.AUTH_USER);
  if (!raw) return false;
  try {
    const user = JSON.parse(raw) as User;
    return !!(user.role === "host" || user.isHost);
  } catch {
    return false;
  }
}

export function HostGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const raw = getCookie(COOKIE_KEYS.AUTH_USER);
    if (!raw) {
      router.replace("/signin");
      return;
    }
    if (!isHost()) {
      router.replace("/dashboard/bookings");
    }
  }, [router]);

  if (!isHost()) {
    return null;
  }

  return <>{children}</>;
}
