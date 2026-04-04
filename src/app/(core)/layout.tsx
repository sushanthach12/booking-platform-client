// The template in layout.tsx makes this render as:

import { BASE_METADATA } from "@/constant/metadata";
import { Metadata } from "next";

// "Find Your Perfect Place to Stay | Stayly"
export const metadata: Metadata = {
  ...BASE_METADATA,
};

/**
 * Public route group: home, search, property listing/detail.
 * URLs unchanged: /, /search, /properties/[id]
 */
export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
