"use client";

import { ArrowRight, Heart, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FILTER_CHIPS = ["All", "Beach", "Hills", "Heritage", "Pet-friendly"] as const;
type Filter = (typeof FILTER_CHIPS)[number];

const NEAR_YOU_CARDS = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    location: "ALIBAUG · BEACH HOUSE",
    name: "The blue door",
    description: "Sleeps 6 · private beach · pool",
    price: 12400,
    driveTime: "2.5H FROM MUMBAI",
    hostName: "Rhea",
    isNew: false,
    type: "Beach",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=600&q=80",
    location: "KARJAT · FARMHOUSE",
    name: "Bagh-e-Karjat",
    description: "Sleeps 8 · river-side · bonfire",
    price: 8900,
    driveTime: "2H FROM MUMBAI",
    hostName: "Vikram",
    isNew: true,
    type: "Hills",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80",
    location: "LONAVALA · COTTAGE",
    name: "The misty cottage",
    description: "Sleeps 4 · valley view · fireplace",
    price: 5800,
    driveTime: "2H FROM MUMBAI",
    hostName: "Sanya",
    isNew: false,
    type: "Hills",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80",
    location: "MATHERAN · HERITAGE",
    name: "Bungalow no. 4",
    description: "Sleeps 5 · no cars · 1903",
    price: 7200,
    driveTime: "3H FROM MUMBAI",
    hostName: "Farah",
    isNew: false,
    type: "Heritage",
  },
] as const;

function NearYouCard({ card }: { card: (typeof NEAR_YOU_CARDS)[number] }) {
  const [saved, setSaved] = useState(false);

  return (
    <article
      className="rounded-[18px] p-3"
      style={{ background: "#FBF8F2", boxShadow: "0 1px 0 rgba(42,59,46,0.04)" }}
    >
      <div className="relative rounded-xl overflow-hidden bg-[#E8E2D5]" style={{ aspectRatio: "4/5" }}>
        <Image
          src={card.image}
          alt={card.name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
        <button
          onClick={() => setSaved((v) => !v)}
          aria-label={saved ? "Remove from saved" : "Save"}
          className="absolute top-2.5 right-2.5 size-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(251,248,242,0.94)" }}
        >
          <Heart
            className="size-3.5"
            style={{
              stroke: "#2A3B2E",
              fill: saved ? "#2A3B2E" : "none",
            }}
          />
        </button>
        {card.isNew && (
          <div
            className="absolute top-2.5 left-2.5 font-sans font-semibold"
            style={{
              background: "#D9A05B",
              color: "#1F2E22",
              padding: "5px 10px",
              borderRadius: "999px",
              fontSize: "11px",
            }}
          >
            just listed
          </div>
        )}
        <div
          className="absolute bottom-2.5 left-2.5 font-mono"
          style={{
            background: "rgba(31,46,34,0.85)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            color: "#FBF8F2",
            padding: "5px 10px",
            borderRadius: "999px",
            fontSize: "10px",
            letterSpacing: "0.1em",
          }}
        >
          {card.driveTime}
        </div>
      </div>

      <div className="pt-4 px-1.5 pb-1.5">
        <p
          className="font-mono text-muted-foreground mb-1.5"
          style={{ fontSize: "10px", letterSpacing: "0.12em" }}
        >
          {card.location}
        </p>
        <p
          className="font-display italic text-foreground mb-1"
          style={{ fontSize: "22px", letterSpacing: "-0.01em" }}
        >
          {card.name}
        </p>
        <p className="text-muted-foreground mb-3.5" style={{ fontSize: "13px" }}>
          {card.description}
        </p>
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-semibold text-foreground" style={{ fontSize: "17px" }}>
              ₹{card.price.toLocaleString("en-IN")}
            </span>
            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>
              {" "}/ night
            </span>
          </div>
          <span className="text-muted-foreground" style={{ fontSize: "11px" }}>
            host: {card.hostName}
          </span>
        </div>
      </div>
    </article>
  );
}

export function NearYouSection() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const filtered = activeFilter === "All"
    ? NEAR_YOU_CARDS
    : NEAR_YOU_CARDS.filter((c) => c.type === activeFilter);

  return (
    <section
      className="border-t border-b"
      style={{
        background: "#F4EFE5",
        borderColor: "rgba(42,59,46,0.08)",
      }}
    >
      <div className="max-w-360 mx-auto px-6 lg:px-12 py-20">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12 gap-8 flex-wrap">
          <div>
            {/* Geo chip */}
            <div
              className="inline-flex items-center gap-2 mb-4.5 font-sans font-medium"
              style={{
                padding: "6px 10px 6px 10px",
                background: "#FFFFFF",
                border: "1px solid rgba(42,59,46,0.10)",
                borderRadius: "999px",
                fontSize: "12px",
                color: "#2A3B2E",
              }}
            >
              <MapPin className="size-3.5 shrink-0" style={{ color: "#C2724A" }} />
              <span>
                Showing stays near <strong>Mumbai</strong>
              </span>
              <a
                href="#"
                className="text-muted-foreground underline ml-1"
                style={{ fontSize: "12px" }}
              >
                change
              </a>
            </div>

            <p
              className="font-mono uppercase text-muted-foreground mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.18em" }}
            >
              03 — Within a few hours&apos; drive
            </p>
            <h2
              className="font-sans font-semibold text-foreground"
              style={{ fontSize: "clamp(32px,4vw,56px)", lineHeight: "1", letterSpacing: "-0.04em" }}
            >
              Weekend stays
              <br />
              <span className="font-display italic" style={{ color: "#C2724A", fontWeight: 400 }}>
                close to home
              </span>
              .
            </h2>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 flex-wrap pb-1.5">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className="font-sans font-medium transition-colors"
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  borderRadius: "999px",
                  border: activeFilter === chip ? "none" : "1px solid rgba(42,59,46,0.12)",
                  background: activeFilter === chip ? "#1F2E22" : "#FFFFFF",
                  color: activeFilter === chip ? "#FBF8F2" : "#2A3B2E",
                  cursor: "pointer",
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(filtered.length > 0 ? filtered : NEAR_YOU_CARDS).slice(0, 4).map((card) => (
            <NearYouCard key={card.id} card={card} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Link
            href="/search"
            className="inline-flex items-center gap-2.5 font-sans font-medium transition-shadow hover:shadow-md"
            style={{
              padding: "14px 24px",
              background: "#FFFFFF",
              border: "1px solid rgba(42,59,46,0.12)",
              color: "#1F2E22",
              borderRadius: "999px",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            See more weekend stays
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
