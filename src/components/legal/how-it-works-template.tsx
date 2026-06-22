import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  HOST_FAQS,
  HOST_PROMISES,
  HOST_STEPS,
} from "./content/how-it-works.content";
import { InfoAccordion } from "./info-accordion";
import { InfoBody } from "./info-body";
import { InfoShell } from "./info-shell";

/**
 * /how-it-works — public, no-auth explainer of the host journey. Mirrors the
 * legal/help page chrome (InfoShell + sticky TOC) and closes with a CTA into
 * the listing wizard.
 */
export function HowItWorksTemplate() {
  const toc = [
    ...HOST_STEPS.map((s) => ({ id: s.id, label: s.title })),
    { id: "faqs", label: "Host FAQs" },
  ];

  return (
    <InfoShell
      eyebrow="For hosts — How it works"
      title="From your place to"
      titleAccent="your first payout."
      intro="A new platform built for first-time and seasoned hosts alike. No setup fee, no subscription — just a simple, flat commission when you get booked. Here’s how hosting on Stayly works, end to end."
    >
      <InfoBody toc={toc}>
        <div className="flex flex-col gap-12 md:gap-16">
          {/* Numbered steps */}
          <ol className="flex flex-col gap-10 md:gap-12">
            {HOST_STEPS.map((step, index) => (
              <li
                key={step.id}
                id={step.id}
                className="scroll-mt-28 flex gap-5 md:gap-7"
              >
                <span
                  className="shrink-0 font-mono flex items-center justify-center rounded-full"
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "#F4EFE5",
                    color: "#C2724A",
                    fontSize: "15px",
                    border: "1px solid rgba(194,114,74,0.25)",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h2
                    className="font-sans font-semibold text-foreground mb-2"
                    style={{ fontSize: "24px", letterSpacing: "-0.02em" }}
                  >
                    {step.title}
                  </h2>
                  {step.body.map((paragraph, i) => (
                    <p
                      key={i}
                      className={i > 0 ? "mt-3" : undefined}
                      style={{ fontSize: "16px", lineHeight: "1.6", color: "#4A5A4D" }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>

          {/* Promises */}
          <div
            className="grid gap-6 sm:grid-cols-3 pt-2"
          >
            {HOST_PROMISES.map((p) => (
              <div
                key={p.title}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8l3 3 7-7"
                      stroke="#C2724A"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="font-sans font-semibold text-foreground"
                    style={{ fontSize: "15px" }}
                  >
                    {p.title}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#6B7A6E", lineHeight: "1.5" }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <div id="faqs" className="scroll-mt-28">
            <h2
              className="font-sans font-semibold text-foreground mb-5"
              style={{ fontSize: "24px", letterSpacing: "-0.02em" }}
            >
              Host FAQs
            </h2>
            <InfoAccordion sections={HOST_FAQS} defaultOpenId="" />
          </div>

          {/* CTA into the listing wizard */}
          <div className="w-full mt-2">
            <div
              className="relative overflow-hidden"
              style={{ background: "#1F2E22", borderRadius: "24px", padding: "48px 40px" }}
            >
              <p
                className="font-mono uppercase mb-5"
                style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#D9A05B" }}
              >
                Ready when you are
              </p>
              <h2
                className="font-sans font-semibold text-primary-foreground mb-4"
                style={{
                  fontSize: "clamp(26px,3vw,38px)",
                  lineHeight: "1.05",
                  letterSpacing: "-0.03em",
                }}
              >
                List your place in minutes.
              </h2>
              <p
                className="mb-8"
                style={{ fontSize: "16px", lineHeight: "1.55", color: "#B5B4AF", maxWidth: "520px" }}
              >
                Start a draft for free — there’s no setup fee and nothing goes live
                until you publish.
              </p>
              <Link
                href="/become-host"
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
                List your place
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </InfoBody>
    </InfoShell>
  );
}
