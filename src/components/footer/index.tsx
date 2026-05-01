"use client";

import { Instagram, Twitter, Youtube, type LucideIcon } from "lucide-react";
import Link from "next/link";

import AppLogo from "@/components/shared/app-logo";

const FOOTER_LINKS = [
  {
    heading: "Explore",
    links: [
      { label: "Search stays", href: "/search" },
      { label: "Hotels", href: "/search?category=hotels" },
      { label: "Villas", href: "/search?type=villa" },
      { label: "Apartments", href: "/search?type=apartment" },
    ],
  },
  {
    heading: "Hosting",
    links: [
      // TODO: Become a host link — disabled, will improve in future
      // { label: "Become a host", href: "/become-host" },
      { label: "Host dashboard", href: "/dashboard/host/overview" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Support", href: "/help" },
    ],
  },
] as const;

const SOCIALS: readonly { icon: LucideIcon; label: string; href: string }[] = [
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

const LEGAL = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
] as const;

export function Footer() {
  return (
    <footer
      className="bg-[#1A2B3A] text-[#7BA3BB]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10">
          {/* ── Brand column ── */}
          <div className="flex flex-col gap-5">
            <div className="[&_a]:text-white [&_a:hover]:text-white">
              <AppLogo />
            </div>
            <p className="text-sm text-[#7BA3BB] leading-relaxed max-w-[220px]">
              Find and book quality stays, or share your space with guests
              who&apos;ll love it.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="size-8 rounded-lg bg-white/8 hover:bg-primary/25 hover:text-white border border-white/10 hover:border-primary/30 flex items-center justify-center transition-all duration-150"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns ── */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading} className="flex flex-col gap-4">
              <h4 className="text-white text-[11px] font-bold uppercase tracking-widest">
                {heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-[#7BA3BB] hover:text-white transition-colors duration-150"
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

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/8">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#4A6A80]">
            © {new Date().getFullYear()} Stayly, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {LEGAL.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-[#4A6A80] hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
