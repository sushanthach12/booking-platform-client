import { HowItWorksTemplate } from "@/components/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Hosting Works",
  description:
    "How hosting on Stayly works — list your place for free, set your price, welcome guests and get paid directly to your bank in INR. No setup fee, flat commission.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return <HowItWorksTemplate />;
}
