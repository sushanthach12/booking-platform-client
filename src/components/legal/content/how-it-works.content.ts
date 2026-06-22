import type { InfoSection } from "../info-accordion";

export interface HostStep {
  /** Stable anchor id, also used for the sidebar TOC. */
  id: string;
  /** Step heading. */
  title: string;
  /** One or two short paragraphs explaining the step. */
  body: string[];
}

/** The host journey, told as ordered steps on the "How it works" page. */
export const HOST_STEPS: HostStep[] = [
  {
    id: "list-your-place",
    title: "Tell us about your place",
    body: [
      "Add your property in a few guided steps — the basics, a handful of photos, the amenities that make it special and the address. There’s no setup fee and no subscription, so it costs nothing to get started.",
      "You can save a draft and come back any time. Nothing goes live until you’re ready to publish.",
    ],
  },
  {
    id: "set-price-availability",
    title: "Set your price and availability",
    body: [
      "Choose a nightly rate, block the dates you want to keep for yourself and set your house rules. You stay in full control of your calendar and pricing.",
      "We’ll show guests the all-in price up front — your rate plus taxes and our flat service fee — so there are no surprises at checkout.",
    ],
  },
  {
    id: "welcome-guests",
    title: "Welcome your first guests",
    body: [
      "Guests discover your listing through search, book the dates they need and you confirm. Every reservation, message and review lives in your host dashboard.",
      "You decide how you host — self check-in, a personal welcome, or anything in between.",
    ],
  },
  {
    id: "get-paid",
    title: "Get paid, straight to your bank",
    body: [
      "After a guest checks in, your payout is released and settled directly to your Indian bank account in INR. We only earn a small, flat commission when your property actually gets booked — never a fee just for listing.",
      "Track every payout, its status and your earnings from the Payouts tab in your dashboard.",
    ],
  },
];

/** Promises echoed from the homepage "For hosts" panel. */
export const HOST_PROMISES = [
  { title: "No setup fee", description: "Listing is free, always." },
  { title: "Flat commission", description: "No tiers, no surprise cuts." },
  { title: "Direct payouts", description: "Settled to your account in INR." },
] as const;

/** Common questions a prospective host asks before listing. */
export const HOST_FAQS: InfoSection[] = [
  {
    id: "what-does-it-cost",
    title: "What does it cost to list?",
    body: [
      "Nothing to list and nothing monthly. We charge a single flat commission only when your property gets booked — so we only earn when you do.",
    ],
  },
  {
    id: "how-payouts-work",
    title: "How and when do I get paid?",
    body: [
      "Payouts are released after your guest checks in and settled directly to your bank account in INR. You can follow each payout’s status from the Payouts tab in your host dashboard.",
    ],
  },
  {
    id: "do-i-need-account",
    title: "Do I need an account to read this?",
    body: [
      "No — this page is open to everyone. You’ll only create an account when you’re ready to list your place and start hosting.",
    ],
  },
  {
    id: "control-calendar",
    title: "Am I in control of my dates and price?",
    body: [
      "Always. You set your nightly rate, block dates and define your house rules, and you can update them whenever you like.",
    ],
  },
];
