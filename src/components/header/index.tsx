"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { getAuthUseCase } from "@/domain/di";
import { useAuth } from "@/hooks/use-auth";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import AppLogo from "../shared/app-logo";
import UserAvatar from "../shared/user-avatar";
import { Button } from "../ui/button";
import { HeaderUserMenu } from "./header-user-menu";
import { LanguageSwitcher } from "./language-switcher";

const NAV_LINKS = [
  { href: "/search", label: "Stays" },
  { href: "/search?type=heritage", label: "Heritage" },
  { href: "/search?type=villa", label: "Villas" },
  { href: "/search?type=homestay", label: "Homestays" },
];

export function Header({ hostDashboard = false }: { hostDashboard?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { requireAuth, authOpen, setAuthOpen } = useAuthGuard();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleBecomeAHost = () =>
    requireAuth("/become-host", () => router.push("/become-host"));

  const handleMobileLogout = useCallback(async () => {
    setMobileOpen(false);
    const authUseCase = getAuthUseCase();
    await authUseCase.logout();
    router.refresh();
  }, [router]);

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Account";

  const isActive = (href: string) => {
    if (href === "/search" && pathname === "/search") return true;
    return false;
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(251,248,242,0.86)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(42,59,46,0.06)",
        }}
        data-header
      >
        <div className="max-w-360 mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-11">
            <AppLogo light={false} />

            {!hostDashboard && (
              <nav className="hidden md:flex items-center gap-7">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="relative text-sm font-medium transition-colors text-[#5A6A5C] hover:text-foreground"
                    style={
                      isActive(href)
                        ? {
                            color: "#1F2E22",
                            paddingBottom: "4px",
                            borderBottom: "1.5px solid #1F2E22",
                          }
                        : {}
                    }
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3.5">
            <button
              onClick={handleBecomeAHost}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              List your place
            </button>
            <LanguageSwitcher />
            <HeaderUserMenu
              onBecomeHost={handleBecomeAHost}
              onOpenAuth={() => setAuthOpen(true)}
              becomeHostButtonClassName="hidden"
              authButtonClassName="text-sm text-[#5A6A5C] hover:text-foreground transition-colors"
            />
          </div>

          <Button
            variant="ghost"
            className="md:hidden p-2 rounded-lg transition-colors text-muted-foreground hover:bg-muted"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>

        {/* Mobile drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{
            background: "rgba(251,248,242,0.96)",
            borderColor: "rgba(42,59,46,0.06)",
          }}
        >
          <div className="px-6 py-5 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-sm font-medium text-[#5A6A5C] hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <LanguageSwitcher className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors w-full text-sm font-medium text-[#5A6A5C] hover:text-foreground" />
            </div>
            {mounted && (
              <>
                <div className="h-px bg-border my-2" />
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <UserAvatar
                        image={user.avatar ?? ""}
                        name={displayName}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      My account
                    </Link>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={handleMobileLogout}
                      className="px-3 py-3 text-sm font-medium text-destructive hover:text-destructive hover:bg-red-50 rounded-lg text-left transition-colors w-full"
                    >
                      Log out
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => {
                      setAuthOpen(true);
                      setMobileOpen(false);
                    }}
                    className="w-full py-3 text-sm font-bold rounded-xl bg-primary hover:bg-primary-dark text-primary-foreground transition-all"
                  >
                    Sign in
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
