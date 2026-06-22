import { BASE_METADATA } from "@/constant/metadata";
import { Metadata } from "next";

export const metadata: Metadata = {
  ...BASE_METADATA,
};

/**
 * Information route group: static support & legal pages.
 * URLs unchanged: /help, /contact, /privacy, /terms.
 * Each page supplies its own Header/Footer via <InfoShell />.
 */
export default function InfoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
