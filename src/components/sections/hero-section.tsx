"use client";

import { HeroSearchBar } from "@/components/shared/hero-search-bar";
import Image from "next/image";

const TRUST_CAPABILITIES = [
  "Book direct with hosts",
  "Pay in INR",
  "No junk fees, ever",
] as const;

const POLAROIDS = [
  {
    image: "https://images.unsplash.com/photo-1524613032530-449a5d94c285?w=600&q=80",
    caption: "the haveli, Jaipur",
    style: {
      top: "40px",
      right: "220px",
      width: "280px",
      transform: "rotate(-7deg)",
      padding: "12px 12px 36px",
      boxShadow: "0 24px 48px -16px rgba(42,59,46,0.20), 0 1px 0 rgba(42,59,46,0.06)",
      zIndex: 1,
    },
    aspectRatio: "4/5",
  },
  {
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&q=80",
    caption: "Casa do Mar, Goa",
    badge: "new on stayly",
    price: "₹6,400/n",
    style: {
      top: "0",
      right: "0",
      width: "320px",
      transform: "rotate(4deg)",
      padding: "14px 14px 44px",
      boxShadow: "0 28px 56px -16px rgba(42,59,46,0.28), 0 1px 0 rgba(42,59,46,0.08)",
      zIndex: 2,
    },
    aspectRatio: "4/5",
  },
  {
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
    caption: "backwaters, Alleppey",
    style: {
      bottom: "0",
      right: "180px",
      width: "240px",
      transform: "rotate(-3deg)",
      padding: "10px 10px 32px",
      boxShadow: "0 20px 40px -16px rgba(42,59,46,0.18), 0 1px 0 rgba(42,59,46,0.06)",
      zIndex: 3,
    },
    aspectRatio: "5/4",
  },
] as const;

export function HeroSection() {
  return (
    <section className="bg-background">
      <div className="max-w-360 mx-auto px-6 lg:px-12 pt-14 pb-20 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
        {/* ── Left column ── */}
        <div>
          {/* Kicker */}
          <div
            className="flex items-center gap-3 mb-7 font-display italic text-muted-foreground"
            style={{ fontSize: "19px" }}
          >
            <svg width="36" height="14" viewBox="0 0 36 14" fill="none" style={{ flexShrink: 0 }}>
              <path
                d="M2 7c8-8 16 8 24-2 2-2 4-2 8 0"
                stroke="#D9A05B"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            namaste, traveller —
          </div>

          {/* H1 */}
          <h1
            className="font-sans font-semibold text-foreground mb-7"
            style={{
              fontSize: "clamp(48px, 6.5vw, 96px)",
              lineHeight: "0.96",
              letterSpacing: "-0.045em",
            }}
          >
            Find a stay
            <br />
            that feels
            <br />
            like{" "}
            <span
              className="font-display italic"
              style={{ color: "#C2724A", fontWeight: 400 }}
            >
              India
            </span>
            .
          </h1>

          {/* Subcopy */}
          <p
            className="text-[#4A5A4D] mb-10 max-w-120"
            style={{ fontSize: "18px", lineHeight: "1.55" }}
          >
            A new home for heritage havelis, beach villas and homestays you can
            book direct — pay in INR, no surprise fees at checkout.
          </p>

          {/* Inline search bar */}
          <div className="max-w-160">
            <HeroSearchBar />
          </div>

          {/* Trust line — capabilities, not numbers */}
          <div className="flex items-center gap-6 mt-6 flex-wrap" style={{ color: "#6B7A6E", fontSize: "13px" }}>
            {TRUST_CAPABILITIES.map((cap) => (
              <div key={cap} className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7l3 3 5-6"
                    stroke="#5C8A6B"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column: polaroid stack ── */}
        <div
          className="relative hidden lg:block"
          style={{ height: "580px" }}
          aria-hidden
        >
          {/* Back polaroid */}
          <div
            className="absolute bg-white rounded-sm"
            style={POLAROIDS[0].style as React.CSSProperties}
          >
            <div
              className="rounded-sm overflow-hidden bg-[#E8E2D5] relative"
              style={{ aspectRatio: POLAROIDS[0].aspectRatio }}
            >
              <Image
                src={POLAROIDS[0].image}
                alt=""
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
            <p
              className="font-display italic text-center mt-3.5"
              style={{ color: "#2A3B2E", fontSize: "17px" }}
            >
              {POLAROIDS[0].caption}
            </p>
          </div>

          {/* Front polaroid */}
          <div
            className="absolute bg-white rounded-sm"
            style={POLAROIDS[1].style as React.CSSProperties}
          >
            <div
              className="rounded-sm overflow-hidden bg-[#E8E2D5] relative"
              style={{ aspectRatio: POLAROIDS[1].aspectRatio }}
            >
              <Image
                src={POLAROIDS[1].image}
                alt=""
                fill
                className="object-cover"
                sizes="320px"
              />
              <div
                className="absolute top-2.5 left-2.5 font-medium"
                style={{
                  background: "#FBF8F2",
                  color: "#2A3B2E",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  letterSpacing: "0.02em",
                }}
              >
                new on stayly
              </div>
            </div>
            <div
              className="flex items-baseline justify-between mt-3.5"
              style={{ padding: "0 4px" }}
            >
              <p
                className="font-display italic"
                style={{ color: "#2A3B2E", fontSize: "19px" }}
              >
                {POLAROIDS[1].caption}
              </p>
              <p className="font-sans font-semibold" style={{ color: "#2A3B2E", fontSize: "15px" }}>
                {POLAROIDS[1].price}
                <span style={{ fontSize: "10px", color: "#6B7A6E", fontWeight: 400 }}>/n</span>
              </p>
            </div>
          </div>

          {/* Third polaroid */}
          <div
            className="absolute bg-white rounded-sm"
            style={POLAROIDS[2].style as React.CSSProperties}
          >
            <div
              className="rounded-sm overflow-hidden bg-[#E8E2D5] relative"
              style={{ aspectRatio: POLAROIDS[2].aspectRatio }}
            >
              <Image
                src={POLAROIDS[2].image}
                alt=""
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
            <p
              className="font-display italic text-center mt-2.5"
              style={{ color: "#2A3B2E", fontSize: "15px" }}
            >
              {POLAROIDS[2].caption}
            </p>
          </div>

          {/* Handwritten annotation */}
          <div
            className="absolute"
            style={{ top: "140px", right: "360px", transform: "rotate(-6deg)" }}
          >
            <p
              className="font-display italic text-right"
              style={{ color: "#C2724A", fontSize: "18px", lineHeight: "1.2", maxWidth: "160px" }}
            >
              a few we&apos;ve
              <br />
              just opened up →
            </p>
            <svg
              width="80"
              height="40"
              viewBox="0 0 80 40"
              fill="none"
              style={{ position: "absolute", right: "-68px", top: "36px" }}
            >
              <path
                d="M2 4c20 0 50 18 72 32"
                stroke="#C2724A"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M68 28l8 8-10 2"
                stroke="#C2724A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
