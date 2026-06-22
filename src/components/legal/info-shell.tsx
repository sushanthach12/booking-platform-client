import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import type { ReactNode } from "react";

interface InfoShellProps {
  /** Small uppercase label above the title, e.g. "Legal — Privacy". */
  eyebrow: string;
  /** Leading part of the headline, rendered in the sans display weight. */
  title: string;
  /** Optional trailing word(s) rendered in italic terracotta to echo the marketing sections. */
  titleAccent?: string;
  /** Short standfirst paragraph under the headline. */
  intro?: string;
  /** "Last updated …" / "Effective …" line, rendered in mono. */
  meta?: string;
  children: ReactNode;
}

/**
 * Shared page chrome for the static information pages (Help, Contact, Privacy,
 * Terms). Reuses the site Header/Footer and mirrors the hero typography of the
 * marketing sections so the pages feel native to Stayly.
 */
export function InfoShell({
  eyebrow,
  title,
  titleAccent,
  intro,
  meta,
  children,
}: InfoShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero band */}
        <section
          style={{
            background: "#F4EFE5",
            borderBottom: "1px solid rgba(42,59,46,0.08)",
          }}
        >
          <div className="max-w-360 mx-auto px-6 lg:px-12 py-18 md:py-24">
            <div className="max-w-3xl">
              <p
                className="font-mono uppercase mb-6"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  color: "#C2724A",
                }}
              >
                {eyebrow}
              </p>

              <h1
                className="font-sans font-semibold text-foreground mb-6"
                style={{
                  fontSize: "clamp(34px,5vw,60px)",
                  lineHeight: "1.03",
                  letterSpacing: "-0.04em",
                }}
              >
                {title}
                {titleAccent ? (
                  <>
                    {" "}
                    <span
                      className="font-display italic"
                      style={{ color: "#C2724A", fontWeight: 400 }}
                    >
                      {titleAccent}
                    </span>
                  </>
                ) : null}
              </h1>

              {intro ? (
                <p
                  style={{
                    fontSize: "18px",
                    lineHeight: "1.6",
                    color: "#4A5A4D",
                    maxWidth: "640px",
                  }}
                >
                  {intro}
                </p>
              ) : null}

              {meta ? (
                <p
                  className="font-mono mt-7"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    color: "#6B7A6E",
                  }}
                >
                  {meta}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="bg-background">
          <div className="max-w-360 mx-auto px-6 lg:px-12 py-16 md:py-20">
            {children}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
