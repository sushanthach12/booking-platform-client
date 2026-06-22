import { TermsTemplate } from "@/components/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the Stayly booking platform.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <TermsTemplate />;
}
