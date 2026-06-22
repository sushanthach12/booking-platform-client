"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  COMPANY_ADDRESS,
  SUPPORT_EMAIL,
  SUPPORT_HOURS,
  SUPPORT_PHONE,
} from "@/constant/app.constant";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

interface ContactMethod {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}

const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: Mail,
    label: "Email us",
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    icon: Phone,
    label: "Call us",
    value: SUPPORT_PHONE,
    href: `tel:${SUPPORT_PHONE.replace(/\s+/g, "")}`,
  },
  { icon: Clock, label: "Support hours", value: SUPPORT_HOURS },
  { icon: MapPin, label: "Visit us", value: COMPANY_ADDRESS },
];

const labelClass = "text-sm font-medium text-foreground";
const fieldClass =
  "h-11 rounded-xl border-input bg-card focus-visible:ring-ring/40";

/** /contact — contact details plus a message form that hands off to the user's email client. */
export function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = `From: ${name} <${email}>\n\n${message}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject || "Stayly enquiry",
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div className="grid gap-10 md:gap-14 lg:grid-cols-[0.8fr_1fr] items-start">
      {/* Contact methods */}
      <div className="flex flex-col gap-4">
        {CONTACT_METHODS.map(({ icon: Icon, label, value, href }) => {
          const content = (
            <div className="flex items-start gap-4 bg-card border border-border rounded-2xl p-5 transition-colors hover:border-warm-accent/40">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "#F4EFE5" }}
              >
                <Icon className="size-5" style={{ color: "#C2724A" }} />
              </span>
              <div>
                <p
                  className="font-mono uppercase mb-1"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    color: "#6B7A6E",
                  }}
                >
                  {label}
                </p>
                <p
                  className="text-foreground font-medium"
                  style={{ fontSize: "15px", lineHeight: "1.5" }}
                >
                  {value}
                </p>
              </div>
            </div>
          );

          return href ? (
            <a key={label} href={href} className="block no-underline">
              {content}
            </a>
          ) : (
            <div key={label}>{content}</div>
          );
        })}
      </div>

      {/* Message form */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8">
        {sent ? (
          <div className="flex flex-col items-center text-center py-12">
            <CheckCircle2 className="size-12 mb-4" style={{ color: "#059669" }} />
            <h2
              className="font-sans font-semibold text-foreground mb-2"
              style={{ fontSize: "22px", letterSpacing: "-0.02em" }}
            >
              Thanks for reaching out
            </h2>
            <p style={{ fontSize: "15px", color: "#6B7A6E", maxWidth: "340px" }}>
              Your email client should have opened with your message ready to
              send. We typically reply within one business day.
            </p>
            <Button
              variant="outline"
              className="mt-6 rounded-xl"
              onClick={() => setSent(false)}
            >
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className={labelClass}>
                  Name
                </Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className={labelClass}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="subject" className={labelClass}>
                Subject
              </Label>
              <Input
                id="subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="message" className={labelClass}>
                Message
              </Label>
              <Textarea
                id="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us a little more…"
                className="min-h-32 resize-none rounded-xl border-input bg-card focus-visible:ring-ring/40"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl h-12 font-semibold mt-1"
            >
              Send message
              <Send className="ml-2 size-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
