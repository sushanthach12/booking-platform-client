"use client";

import { COOKIE_KEYS, getCookie } from "@/lib/utils/cookies";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { User } from "@/domain/entities";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  section: "guest" | "host";
}

const GUEST_NAV: NavItem[] = [
  {
    id: "profile",
    label: "Profile",
    href: "/dashboard/profile",
    section: "guest",
  },
  {
    id: "bookings",
    label: "Bookings",
    href: "/dashboard/bookings",
    section: "guest",
  },
  {
    id: "wishlist",
    label: "Wishlist",
    href: "/dashboard/wishlist",
    section: "guest",
  },
];

const HOST_NAV: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/dashboard/host/overview",
    section: "host",
  },
  {
    id: "listings",
    label: "Listings",
    href: "/dashboard/host/listings",
    section: "host",
  },
  {
    id: "calendar",
    label: "Calendar",
    href: "/dashboard/host/calendar",
    section: "host",
  },
  {
    id: "reservations",
    label: "Reservations",
    href: "/dashboard/host/reservations",
    section: "host",
  },
  {
    id: "payouts",
    label: "Payouts",
    href: "/dashboard/host/payouts",
    section: "host",
  },
  {
    id: "reviews",
    label: "Reviews",
    href: "/dashboard/host/reviews",
    section: "host",
  },
  {
    id: "settings",
    label: "Settings",
    href: "/dashboard/host/settings",
    section: "host",
  },
];

export function useDashboard() {
  const pathname = usePathname();

  const user = useMemo<User | null>(() => {
    const raw = getCookie(COOKIE_KEYS.AUTH_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }, []);

  const isHost = useMemo(
    () =>
      !!(
        user?.isHost ||
        (user as Record<string, unknown> | null)?.role === "host"
      ),
    [user],
  );

  const navItems = useMemo(
    () => (isHost ? [...GUEST_NAV, ...HOST_NAV] : GUEST_NAV),
    [isHost],
  );

  const activeRoute = useMemo(
    () => navItems.find((item) => pathname?.startsWith(item.href))?.id ?? null,
    [navItems, pathname],
  );

  return {
    user,
    isHost,
    navItems,
    guestNav: GUEST_NAV,
    hostNav: HOST_NAV,
    activeRoute,
  };
}
