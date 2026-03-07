"use client";

import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import AppLogo from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const FOOTER_LINKS = {
  Explore: [
    { label: "Stays", href: "/stays" },
    { label: "Hotels", href: "/hotels" },
    { label: "Apartments", href: "/apartments" },
    { label: "Villas", href: "/search?type=villa" },
    { label: "Cabins", href: "/search?type=cabin" },
  ],
  Company: [
    { label: "About us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
    { label: "Partners", href: "/partners" },
  ],
  Support: [
    { label: "Help centre", href: "/help" },
    { label: "Safety information", href: "/safety" },
    { label: "Cancellation options", href: "/cancellation" },
    { label: "Report a concern", href: "/report" },
    { label: "Accessibility", href: "/accessibility" },
  ],
  Hosting: [
    { label: "Become a host", href: "/become-host" },
    { label: "Host resources", href: "/host-resources" },
    { label: "Community forum", href: "/community" },
    { label: "Responsible hosting", href: "/responsible-hosting" },
    { label: "Host protection", href: "/host-protection" },
  ],
} as const satisfies Record<string, readonly { label: string; href: string }[]>;

const SOCIALS: readonly { icon: LucideIcon; label: string; href: string }[] = [
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

const LEGAL: readonly { label: string; href: string }[] = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
  { label: "Cookie settings", href: "/cookies" },
  { label: "Sitemap", href: "/sitemap" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-1">
              Stay in the loop
            </p>
            <h3 className="text-white font-bold text-lg">
              Get travel inspiration straight to your inbox
            </h3>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              aria-label="Email for newsletter"
              className={cn(
                "flex-1 sm:w-64 h-10 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-slate-500",
                "focus-visible:ring-rose-500/50 focus-visible:border-rose-500/50",
                "hover:bg-white/15 transition-colors"
              )}
            />
            <Button
              type="button"
              className={cn(
                "shrink-0 rounded-xl font-bold shadow-lg shadow-rose-500/20",
                "bg-linear-to-br from-rose-500 to-orange-500",
                "hover:from-rose-600 hover:to-orange-600 hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              Subscribe
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand column — spans 2 */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="[&_a]:text-white [&_a:hover]:text-white">
              <AppLogo />
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Effortless bookings for leisure travel and business. Handpicked
              properties across 90+ countries — from boutique city flats to
              remote mountain villas.
            </p>

            <ul className="flex flex-col gap-3 text-sm" aria-label="Contact">
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 text-rose-400 shrink-0" aria-hidden />
                123 Wanderlust Ave, San Francisco, CA
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-rose-400 shrink-0" aria-hidden />
                <a
                  href="mailto:hello@stayfinder.com"
                  className="hover:text-white transition-colors"
                >
                  hello@stayfinder.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 text-rose-400 shrink-0" aria-hidden />
                <a
                  href="tel:+18005551234"
                  className="hover:text-white transition-colors"
                >
                  +1 (800) 555-1234
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-2 mt-1" role="list" aria-label="Social links">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="size-9 rounded-lg bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 flex items-center justify-center transition-all duration-200"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm tracking-wide">
                {heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm hover:text-white hover:translate-x-0.5 inline-flex transition-all duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} StayFinder, Inc. All rights reserved.
          </p>
          <nav
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1"
            aria-label="Legal"
          >
            {LEGAL.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
