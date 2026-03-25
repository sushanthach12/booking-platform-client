"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { getAuthUseCase } from "@/domain/di";
import { useAuth } from "@/hooks/use-auth";
import AppLogo from "../shared/app-logo";
import UserAvatar from "../shared/user-avatar";
import { Button } from "../ui/button";
import { HeaderUserMenu } from "./header-user-menu";

const NAV_LINKS = [
  { href: "/search", label: "Stays" },
  { href: "/search?category=hotels", label: "Hotels" },
  { href: "/search?category=apartments", label: "Apartments" },
];

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleBecomeAHost = () => {
    if (isAuthenticated) {
      router.push("/become-host");
    } else {
      sessionStorage.setItem("redirectAfterLogin", "/become-host");
      setAuthOpen(true);
    }
  };

  const handleMobileLogout = async () => {
    setMobileOpen(false);
    const authUseCase = getAuthUseCase();
    await authUseCase.logout();
    router.push("/");
    router.refresh();
  };

  const isTransparent = !scrolled && !mobileOpen;

  const becomeHostClass = isTransparent
    ? "text-white/90 hover:text-white hover:bg-white/10"
    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100";
  const authButtonClass = isTransparent
    ? "bg-white text-slate-900 hover:bg-white/90 shadow-lg shadow-black/10"
    : "bg-linear-to-br from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-md shadow-rose-500/25 hover:shadow-rose-500/40";

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Account";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 py-2 3xl:py-3 transition-all duration-300 ${isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-sm"
          }`}
        data-header
      >
        <div className="max-w-350 mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
          <AppLogo light={isTransparent} />

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors group ${isTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <HeaderUserMenu
              onBecomeHost={handleBecomeAHost}
              onOpenAuth={() => setAuthOpen(true)}
              becomeHostButtonClassName={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${becomeHostClass}`}
              authButtonClassName={`text-sm font-bold rounded-lg transition-all duration-200 ${authButtonClass}`}
            />
          </div>

          <button
            type="button"
            className={`md:hidden p-2 rounded-lg transition-colors ${isTransparent
              ? "text-white hover:bg-white/10"
              : "text-slate-700 hover:bg-slate-100"
              }`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-slate-100 ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="px-6 py-5 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="h-px bg-slate-100 my-2" />
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                handleBecomeAHost();
                setMobileOpen(false);
              }}
              className="px-3 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-left transition-colors w-full"
            >
              Become a host
            </Button>

            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <UserAvatar image={user.avatar ?? ""} name={displayName} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  My account
                </Link>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleMobileLogout}
                  className="px-3 py-3 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-left transition-colors w-full"
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
                className="w-full py-3 text-sm font-bold rounded-xl bg-linear-to-br from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600 transition-all shadow-md shadow-rose-500/20"
              >
                Log in
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
