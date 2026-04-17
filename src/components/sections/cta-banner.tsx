// ─────────────────────────────────────────────────────────────────
// components/sections/cta-banner.tsx — Host CTA
// Dark blue gradient panel, 2-col layout: copy + stats grid
// ─────────────────────────────────────────────────────────────────
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HOST_STATS = [
  ["$2,400", "Avg. monthly earnings"],
  ["3 days", "To get first booking"],
  ["0% fees", "First 3 months free"],
  ["24/7", "Host support"],
] as const;

export function CtaBanner() {
  return (
    <section className="py-16 px-6 lg:px-10">
      <div
        className="max-w-[1160px] mx-auto rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(130deg, #1E4A62 0%, #2E6585 45%, #3D7EA0 100%)",
        }}
      >
        <div className="px-10 py-14 lg:px-16 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: copy + CTAs ── */}
          <div>
            {/* Pill badge */}
            <div className="inline-block bg-white/10 rounded-full px-3.5 py-1.5 mb-5">
              <span className="text-[11px] font-bold text-white/85 uppercase tracking-[0.8px]">
                For hosts
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-[clamp(28px,3.5vw,42px)] leading-[1.15] text-white mb-4"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.5px",
              }}
            >
              Your space could earn
              <br />
              <em style={{ fontFamily: "var(--font-display)" }}>
                while you&apos;re away
              </em>
            </h2>

            <p className="text-white/70 text-[15px] leading-[1.65] mb-8 max-w-[360px]">
              Join thousands of hosts earning on their own terms — no long-term
              commitments, full calendar control.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link href="/become-host">
                <Button className="bg-white text-[#1E4A62] hover:bg-white/90 font-bold px-6 h-11 rounded-xl transition-opacity duration-150">
                  Start hosting
                </Button>
              </Link>
              <Link href="/become-host">
                <Button
                  variant="ghost"
                  className="text-white border border-white/35 hover:bg-white/10 hover:text-white px-6 h-11 rounded-xl font-medium gap-1.5"
                >
                  Learn more
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* ── Right: stats 2×2 grid ── */}
          <div className="grid grid-cols-2 gap-3.5">
            {HOST_STATS.map(([val, label]) => (
              <div
                key={label}
                className="rounded-xl p-5 border border-white/10"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="text-[26px] font-bold text-white mb-1.5"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  {val}
                </div>
                <div className="text-[12px] text-white/60 leading-[1.5]">
                  {label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
