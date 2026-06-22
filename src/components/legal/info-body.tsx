import type { ReactNode } from "react";

export interface TocItem {
  /** Anchor id of the target section/group. */
  id: string;
  /** Link label shown in the sidebar. */
  label: string;
}

interface InfoBodyProps {
  /** Sidebar navigation entries. */
  toc: TocItem[];
  children: ReactNode;
}

/**
 * Two-column reading layout for the legal/help pages: a sticky "On this page"
 * table of contents on the left and the content (accordions) filling the rest
 * of the width on the right.
 */
export function InfoBody({ toc, children }: InfoBodyProps) {
  return (
    <div className="grid gap-10 lg:gap-16 lg:grid-cols-[230px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <p
            className="font-mono uppercase mb-4"
            style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#6B7A6E" }}
          >
            On this page
          </p>
          <nav className="flex flex-col gap-1">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-lg px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground"
                style={{ fontSize: "13.5px", color: "#4A5A4D", textDecoration: "none" }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
