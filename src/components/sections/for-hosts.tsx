import { ArrowRight } from "lucide-react";
import Link from "next/link";

const PROMISES = [
  {
    title: "No setup fee",
    description: "Listing is free, always.",
  },
  {
    title: "Flat commission",
    description: "No tiers, no surprise cuts.",
  },
  {
    title: "Direct payouts",
    description: "Settled to your account.",
  },
] as const;

export function ForHostsSection() {
  return (
    <section className="bg-background">
      <div className="max-w-360 mx-auto px-6 lg:px-12 py-24">
        <div
          className="relative overflow-hidden"
          style={{ background: "#1F2E22", borderRadius: "28px", padding: "72px 64px" }}
        >
          {/* Content */}
          <div className="relative max-w-170">
            <p
              className="font-mono uppercase mb-6"
              style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#D9A05B" }}
            >
              04 — For hosts
            </p>

            <h2
              className="font-sans font-semibold text-primary-foreground mb-6"
              style={{ fontSize: "clamp(32px,4vw,60px)", lineHeight: "1", letterSpacing: "-0.04em" }}
            >
              Got a place you&apos;d
              <br />
              love to share?
              <br />
              <span className="font-display italic" style={{ color: "#D9A05B", fontWeight: 400 }}>
                Tell us about it.
              </span>
            </h2>

            <p
              className="mb-9 max-w-130"
              style={{ fontSize: "17px", lineHeight: "1.55", color: "#B5B4AF" }}
            >
              We&apos;re a new platform looking for our first hosts. No setup fee, no
              subscription — we only earn a small flat commission when your property
              gets booked. Payouts in INR, straight to your bank.
            </p>

            <div className="flex gap-3 items-center flex-wrap">
              <Link
                href="/become-host"
                className="inline-flex items-center gap-2.5 font-semibold transition-opacity hover:opacity-90"
                style={{
                  padding: "16px 26px",
                  background: "#D9A05B",
                  color: "#1F2E22",
                  borderRadius: "999px",
                  fontSize: "16px",
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                List your place
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 font-medium transition-colors hover:text-primary-foreground"
                style={{
                  padding: "16px 22px",
                  color: "#FBF8F2",
                  border: "1px solid rgba(251,248,242,0.20)",
                  borderRadius: "999px",
                  fontSize: "16px",
                  textDecoration: "none",
                }}
              >
                How it works
              </Link>
            </div>

            {/* Promises, not stats */}
            <div
              className="grid grid-cols-3 gap-8 mt-12 pt-7"
              style={{ borderTop: "1px solid rgba(251,248,242,0.12)", maxWidth: "580px" }}
            >
              {PROMISES.map((p) => (
                <div key={p.title}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8l3 3 7-7"
                        stroke="#D9A05B"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className="font-sans font-semibold text-primary-foreground"
                      style={{ fontSize: "15px" }}
                    >
                      {p.title}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#B5B4AF", lineHeight: "1.5" }}>
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
