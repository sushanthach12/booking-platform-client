"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";

export interface HeaderUserMenuProps {
  className?: string;
  becomeHostButtonClassName?: string;
  authButtonClassName?: string;
  onBecomeHost?: () => void;
  onOpenAuth?: () => void;
}

/**
 * Reusable header user menu: "Become a Host" link/button and user/auth button.
 * Manages AuthDialog state internally when onOpenAuth is not provided.
 * Use in SimpleHeader, SearchHeader, or main Header with onBecomeHost/onOpenAuth for controlled auth.
 */
export function HeaderUserMenu({
  className,
  becomeHostButtonClassName,
  authButtonClassName,
  onBecomeHost,
  onOpenAuth,
}: HeaderUserMenuProps) {
  const [authOpen, setAuthOpen] = useState(false);

  const handleAuthClick = onOpenAuth ?? (() => setAuthOpen(true));

  return (
    <>
      <div className={className ?? "flex items-center gap-2"}>
        {onBecomeHost ? (
          <button
            type="button"
            onClick={onBecomeHost}
            className={
              becomeHostButtonClassName ??
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            }
          >
            Become a host
          </button>
        ) : (
          <Link href="/become-host">
            <Button
              variant="ghost"
              size="sm"
              className={
                becomeHostButtonClassName ??
                "rounded-full text-sm font-medium hover:bg-transparent"
              }
            >
              Become a Host
            </Button>
          </Link>
        )}
        <Button
          variant="default"
          size="sm"
          onClick={handleAuthClick}
          className={authButtonClassName ?? "rounded-lg"}
        >
          Log in
        </Button>
      </div>

      {onOpenAuth == null && (
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      )}
    </>
  );
}
