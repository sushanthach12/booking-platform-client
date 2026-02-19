"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AppLogo from "../shared/app-logo";

export function Header() {
  const router = useRouter();

  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBecomeAHost = () => {
    if (typeof window === "undefined") return;

    // Check localStorage directly for authentication
    const authToken = localStorage.getItem("authToken");
    const currentUser = localStorage.getItem("currentUser");
    console.log("authToken:", authToken);
    console.log("currentUser:", currentUser);
    const isAuthenticated = !!(authToken && currentUser);

    console.log("Become a host clicked - isAuthenticated:", isAuthenticated);

    if (isAuthenticated) {
      router.push("/become-host");
    } else {
      // Store redirect path for after login
      sessionStorage.setItem("redirectAfterLogin", "/become-host");
      console.log("Opening auth dialog");
      setAuthOpen(true);
    }
  };

  return (
    <header
      className={`relative z-50 w-full px-6 lg:px-10 pt-6 pb-6 transition-all duration-300 ${scrolled ? "bg-white shadow-sm" : "bg-transparent"}`}
      data-header
    >
      <div className="h-14" data-header-part="1">
        <div className="h-full flex justify-between items-center px-6 lg:px-10">
          {/* Logo */}
          <AppLogo />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm lg:text-base tracking-wide">
            <Link
              href="/stays"
              className="text-black hover:text-gray-700 font-medium transition-colors drop-shadow-md"
            >
              Stays
            </Link>
            <Link
              href="/hotels"
              className="text-black hover:text-gray-700 font-medium transition-colors drop-shadow-md"
            >
              Hotels
            </Link>
            <Link
              href="/apartments"
              className="text-black hover:text-gray-700 font-medium transition-colors drop-shadow-md"
            >
              Apartments
            </Link>
          </nav>

          {/* Right side elements */}
          <div className="flex items-center gap-4">
            {/* Currency */}
            <Button
              variant="ghost"
              size="sm"
              className="text-black bg-transparent hover:bg-transparent hover:cursor-pointer text-sm font-medium rounded-lg drop-shadow-md p-4"
              onClick={handleBecomeAHost}
            >
              Become a host
            </Button>

            {/* Language */}
            {/* <Button
              variant="default"
              size="icon-lg"
              className="text-primary bg-transparent font-bold rounded-full drop-shadow-md p-2 hover:bg-primary/90 hover:text-white hover:cursor-pointer"
            >
              <HeartIcon className="size-5  " />
            </Button> */}

            {/* Log In */}
            <Button
              variant="default"
              size="lg"
              className="hover:text-white hover:bg-primary/90 hover:cursor-pointer text-sm font-medium rounded-lg drop-shadow-md p-4"
              onClick={() => setAuthOpen(true)}
            >
              LOG IN
            </Button>
          </div>
        </div>
      </div>

      <AuthDialog
        open={authOpen}
        onOpenChange={(open) => {
          console.log("AuthDialog onOpenChange called with:", open);
          setAuthOpen(open);
        }}
      />
    </header>
  );
}
