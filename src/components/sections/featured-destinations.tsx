import { DESTINATIONS, type Destination, type DestTheme } from "@/constant/destinations";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SOLID_BG: Record<string, React.CSSProperties> = {
  sand:   { background: "#E6D9C2", color: "#1F2E22" },
  forest: { background: "#2A3B2E", color: "#FBF8F2" },
  amber:  { background: "#D9A05B", color: "#1F2E22" },
};

const IMAGE_GRADIENT: Record<string, string> = {
  "image-hero": "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.60) 100%)",
  image:        "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.60) 100%)",
  "image-left": "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 60%)",
  "image-right":"linear-gradient(90deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)",
};

function TileContent({ dest }: { dest: Destination }) {
  const { theme, label, regionTag, sublabel, city, fromPrice, showPrice } = dest;

  if (theme === "image-hero") {
    return (
      <>
        {showPrice && (
          <div
            className="absolute top-5 left-5 font-sans font-medium"
            style={{ background: "rgba(251,248,242,0.92)", color: "#1F2E22", padding: "6px 12px", borderRadius: "999px", fontSize: "12px" }}
          >
            From ₹{fromPrice.toLocaleString("en-IN")} / night
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <p className="font-mono opacity-85 mb-2" style={{ fontSize: "11px", letterSpacing: "0.14em" }}>{regionTag}</p>
          <div className="flex items-end justify-between">
            <p className="font-sans font-semibold" style={{ fontSize: "44px", letterSpacing: "-0.035em", lineHeight: 1 }}>{label}</p>
            {sublabel && <p style={{ fontSize: "14px", opacity: 0.85 }}>{sublabel}</p>}
          </div>
        </div>
      </>
    );
  }

  if (theme === "image") {
    return (
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="font-mono opacity-85 mb-1.5" style={{ fontSize: "10px", letterSpacing: "0.14em" }}>{regionTag}</p>
        <p className="font-sans font-semibold" style={{ fontSize: "26px", letterSpacing: "-0.025em" }}>{city}</p>
      </div>
    );
  }

  if (theme === "image-left") {
    return (
      <div className="absolute top-0 left-0 bottom-0 p-5 flex flex-col justify-between">
        <p className="font-mono opacity-85" style={{ fontSize: "10px", letterSpacing: "0.14em" }}>{regionTag}</p>
        <p className="font-sans font-semibold" style={{ fontSize: "28px", letterSpacing: "-0.025em" }}>{city}</p>
      </div>
    );
  }

  if (theme === "image-right") {
    return (
      <div className="absolute top-0 right-0 bottom-0 p-5 flex flex-col justify-between text-right">
        <p className="font-mono opacity-85" style={{ fontSize: "10px", letterSpacing: "0.14em" }}>{regionTag}</p>
        <p className="font-sans font-semibold" style={{ fontSize: "28px", letterSpacing: "-0.025em" }}>{city}</p>
      </div>
    );
  }

  /* sand / forest / amber solid tiles */
  return (
    <div className="p-4.5 flex flex-col h-full">
      <p
        className="font-mono"
        style={{
          fontSize: "10px",
          letterSpacing: "0.14em",
          marginBottom: "4px",
          opacity: theme === "forest" ? 0.6 : undefined,
          color: theme === "sand" ? "#6B7A6E" : "rgba(31,46,34,0.7)",
        }}
      >
        {regionTag}
      </p>
      <div className="flex items-end flex-1">
        <p className="font-sans font-semibold" style={{ fontSize: "22px", letterSpacing: "-0.025em" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function BentoTile({ dest }: { dest: Destination }) {
  const isImage = dest.theme.startsWith("image");
  const solidStyle = !isImage ? SOLID_BG[dest.theme as string] : undefined;

  return (
    <Link
      href={`/search?location=${encodeURIComponent(dest.city)}`}
      className="group relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      style={{
        gridColumn: `span ${dest.span.col}`,
        gridRow: `span ${dest.span.row}`,
        borderRadius: "18px",
        color: isImage ? "#FBF8F2" : undefined,
        textDecoration: "none",
        ...solidStyle,
      }}
    >
      {/* Background image */}
      {dest.coverImage && (
        <Image
          src={dest.coverImage}
          alt={dest.city}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={`${Math.round((dest.span.col / 12) * 1440)}px`}
        />
      )}
      {/* Gradient overlay */}
      {isImage && IMAGE_GRADIENT[dest.theme] && (
        <div className="absolute inset-0" style={{ background: IMAGE_GRADIENT[dest.theme] }} />
      )}
      {/* Text content */}
      <TileContent dest={dest} />
    </Link>
  );
}

export function FeaturedDestinations() {
  return (
    <section className="bg-background">
      <div className="max-w-360 mx-auto px-6 lg:px-12 py-18">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-mono uppercase text-muted-foreground mb-4" style={{ fontSize: "11px", letterSpacing: "0.18em" }}>
              02 — Destinations
            </p>
            <h2
              className="font-sans font-semibold text-foreground"
              style={{ fontSize: "clamp(36px,4vw,60px)", lineHeight: "1", letterSpacing: "-0.04em" }}
            >
              Pick a corner of <br />
              <span className="font-display italic" style={{ color: "#C2724A", fontWeight: 400 }}>
                the country
              </span>
              .
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors pb-2"
          >
            Browse all destinations
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* 12-col bento grid, 140px auto rows */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(12, 1fr)", gridAutoRows: "140px" }}
        >
          {DESTINATIONS.map((dest) => (
            <BentoTile key={dest.slug} dest={dest} />
          ))}
        </div>

        {/* Mobile view-all */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/search"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border font-semibold text-sm text-primary border-primary/30 hover:bg-primary-subtle transition-colors"
          >
            Browse all destinations <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
