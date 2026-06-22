import { HelpTemplate } from "@/components/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Find answers about booking, cancellations, payments and hosting on Stayly.",
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  return <HelpTemplate />;
}
