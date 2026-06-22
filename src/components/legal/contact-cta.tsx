import { SUPPORT_EMAIL } from "@/constant/app.constant";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ContactCtaProps {
  /** Headline override. */
  title?: string;
  /** Supporting line override. */
  description?: string;
}

/**
 * Closing "still need a hand?" band shared by the Help and legal pages. Mirrors
 * the dark for-hosts panel on the homepage.
 */
export function ContactCta({
  title = "Still need a hand?",
  description = "Our support team is real, reachable and based in India. Drop us a line and we'll get back within one business day.",
}: ContactCtaProps) {
  return (
    <div className="w-full mt-14 md:mt-20">
      <div
        className="relative overflow-hidden"
        style={{ background: "#1F2E22", borderRadius: "24px", padding: "48px 40px" }}
      >
        <p
          className="font-mono uppercase mb-5"
          style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#D9A05B" }}
        >
          Support
        </p>

        <h2
          className="font-sans font-semibold text-primary-foreground mb-4"
          style={{
            fontSize: "clamp(26px,3vw,38px)",
            lineHeight: "1.05",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h2>

        <p
          className="mb-8"
          style={{ fontSize: "16px", lineHeight: "1.55", color: "#B5B4AF", maxWidth: "520px" }}
        >
          {description}
        </p>

        <div className="flex gap-3 items-center flex-wrap">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 font-semibold transition-opacity hover:opacity-90"
            style={{
              padding: "14px 24px",
              background: "#D9A05B",
              color: "#1F2E22",
              borderRadius: "999px",
              fontSize: "15px",
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            Contact us
            <ArrowRight className="size-4" />
          </Link>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-2 font-medium transition-colors hover:text-primary-foreground"
            style={{
              padding: "14px 22px",
              color: "#FBF8F2",
              border: "1px solid rgba(251,248,242,0.20)",
              borderRadius: "999px",
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
