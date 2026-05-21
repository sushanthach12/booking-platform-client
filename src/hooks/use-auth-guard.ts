"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";
import { COOKIE_KEYS, getCookie } from "@/lib/utils/cookies";
import type { User } from "@/domain/entities";

export interface UseAuthGuardReturn {
  /**
   * Wraps any action that requires the user to be authenticated.
   *
   * - Authenticated: `action` is called immediately.
   * - Unauthenticated: `redirectPath` is persisted to `sessionStorage` under
   *   the `redirectAfterLogin` key (consumed by `AuthDialog` on success),
   *   then the auth dialog is opened.
   */
  requireAuth: (redirectPath: string, action: () => void) => void;
  /**
   * Wraps any action that requires a specific role.
   * Checks auth first, then role. On role mismatch, redirects to `fallbackPath`.
   */
  requireRole: (
    role: "host" | "guest",
    action: () => void,
    fallbackPath?: string,
  ) => void;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
}

function getUserRole(): "host" | "guest" | null {
  const raw = getCookie(COOKIE_KEYS.AUTH_USER);
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as User;
    if (user.role) return user.role;
    if (user.isHost) return "host";
    return "guest";
  } catch {
    return null;
  }
}

export function useAuthGuard(): UseAuthGuardReturn {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);

  const requireAuth = (redirectPath: string, action: () => void): void => {
    if (isAuthenticated) {
      action();
      return;
    }
    sessionStorage.setItem("redirectAfterLogin", redirectPath);
    setAuthOpen(true);
  };

  const requireRole = (
    role: "host" | "guest",
    action: () => void,
    fallbackPath = "/",
  ): void => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    const userRole = getUserRole();
    if (userRole !== role) {
      router.replace(fallbackPath);
      return;
    }
    action();
  };

  return { requireAuth, requireRole, authOpen, setAuthOpen };
}
