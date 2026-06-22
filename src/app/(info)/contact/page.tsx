import { ContactTemplate } from "@/components/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Stayly support team by email, phone or message.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactTemplate />;
}
