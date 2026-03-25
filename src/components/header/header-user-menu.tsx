"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAuthUseCase } from "@/domain/di";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User as UserIcon } from "lucide-react";
import UserAvatar from "../shared/user-avatar";

export interface HeaderUserMenuProps {
  className?: string;
  becomeHostButtonClassName?: string;
  authButtonClassName?: string;
  onBecomeHost?: () => void;
  onOpenAuth?: () => void;
}

/**
 * Renders "Become a host" + either a user-avatar dropdown (logged-in)
 * or a "Log in" button (logged-out).
 */
export function HeaderUserMenu({
  className,
  becomeHostButtonClassName,
  authButtonClassName,
  onBecomeHost,
  onOpenAuth,
}: HeaderUserMenuProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAuthClick = onOpenAuth ?? (() => setAuthOpen(true));

  const handleLogout = async () => {
    const authUseCase = getAuthUseCase();
    await authUseCase.logout();
    router.push("/");
    router.refresh();
  };

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Account";

  return (
    <>
      <div className={className ?? "flex items-center gap-2"}>
        {/* Become a host */}
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
              Become a host
            </Button>
          </Link>
        )}

        {/* Auth area */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Open user menu"
              >
                <UserAvatar
                  image={user.avatar ?? ""}
                  name={displayName}
                  size="sm"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal">
                <p className="font-semibold text-sm truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account" className="cursor-pointer">
                  <UserIcon className="mr-2 size-4" />
                  My account
                </Link>
              </DropdownMenuItem>
              {user.isHost && (
                <DropdownMenuItem asChild>
                  <Link href="/host/dashboard" className="cursor-pointer">
                    Host dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={handleAuthClick}
            className={authButtonClassName ?? "rounded-lg"}
          >
            Log in
          </Button>
        )}
      </div>

      {onOpenAuth == null && (
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      )}
    </>
  );
}
