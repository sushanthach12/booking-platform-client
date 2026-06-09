"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

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

/**
 * Builds the dashboard nav and derives the active route from the pathname.
 *
 * `isHost` is supplied by the server layout (which reads the auth cookie via
 * `next/headers`), so nav membership — and therefore `activeRoute` — is
 * identical on the server and the first client render. Deriving it from a
 * client-only `document.cookie` read here would diverge from SSR and trigger a
 * hydration mismatch.
 */
export function useDashboard(isHost: boolean) {
  const pathname = usePathname();

  const navItems = useMemo(
    () => (isHost ? [...GUEST_NAV, ...HOST_NAV] : GUEST_NAV),
    [isHost],
  );

  const activeRoute = useMemo(
    () => navItems.find((item) => pathname?.startsWith(item.href))?.id ?? null,
    [navItems, pathname],
  );

  return {
    navItems,
    guestNav: GUEST_NAV,
    hostNav: HOST_NAV,
    activeRoute,
  };
}
