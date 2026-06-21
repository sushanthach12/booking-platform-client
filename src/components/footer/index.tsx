import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Help", href: "/help" },
  { label: "Contact", href: "/contact" },
  { label: "List your place", href: "/become-host" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

export function Footer() {
  return (
    <footer
      style={{
        background: "#F4EFE5",
        borderTop: "1px solid rgba(42,59,46,0.08)",
      }}
    >
      <div
        className="max-w-360 mx-auto px-6 lg:px-12 py-9 flex items-center justify-between flex-wrap gap-6"
      >
        {/* Left: wordmark + links */}
        <div className="flex items-center gap-8 flex-wrap">
          <Link
            href="/"
            className="font-sans font-extrabold text-foreground"
            style={{ fontSize: "18px", letterSpacing: "-0.04em", textDecoration: "none" }}
          >
            stayly
          </Link>
          <nav className="flex gap-5 flex-wrap">
            {FOOTER_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="transition-colors hover:text-foreground"
                style={{ fontSize: "13px", color: "#4A5A4D", textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: copyright */}
        <p
          className="font-mono"
          style={{ fontSize: "11px", letterSpacing: "0.10em", color: "#6B7A6E" }}
        >
          © STAYLY · 2026
        </p>
      </div>
    </footer>
  );
}
