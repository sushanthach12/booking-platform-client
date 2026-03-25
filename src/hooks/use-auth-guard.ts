"use client";

import { useState } from "react";
import { useAuth } from "./use-auth";

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
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
}

/**
 * Hook that gates an action behind authentication.
 *
 * Usage:
 * ```tsx
 * const { requireAuth, authOpen, setAuthOpen } = useAuthGuard();
 *
 * const handleProtected = () =>
 *   requireAuth("/target-path", () => router.push("/target-path"));
 *
 * return (
 *   <>
 *     <Button onClick={handleProtected}>Go</Button>
 *     <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
 *   </>
 * );
 * ```
 */
export function useAuthGuard(): UseAuthGuardReturn {
  const { isAuthenticated } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const requireAuth = (redirectPath: string, action: () => void): void => {
    if (isAuthenticated) {
      action();
      return;
    }
    sessionStorage.setItem("redirectAfterLogin", redirectPath);
    setAuthOpen(true);
  };

  return { requireAuth, authOpen, setAuthOpen };
}
