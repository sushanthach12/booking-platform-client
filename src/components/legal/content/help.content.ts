import type { InfoSection } from "../info-accordion";

export interface HelpCategory {
  id: string;
  /** Section label shown above the accordion group. */
  title: string;
  /** One-line description of the category. */
  description: string;
  faqs: InfoSection[];
}

/** Help Center FAQs grouped by topic. Each group renders its own accordion. */
export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: "booking",
    title: "Booking a stay",
    description: "Searching, reserving and confirming your trip.",
    faqs: [
      {
        id: "how-to-book",
        title: "How do I book a property?",
        body: [
          "Search by destination, dates and guests, open a listing you like, then choose your dates and confirm. You’ll get a booking confirmation as soon as the reservation is accepted.",
        ],
      },
      {
        id: "when-charged",
        title: "When am I charged?",
        body: [
          "You’ll see the full price — nightly rate, taxes and service fee — before you confirm. Payment is taken securely at the time of booking through our payment partner.",
        ],
      },
      {
        id: "modify-booking",
        title: "Can I change my dates or guest count?",
        body: [
          "Open the booking from your dashboard and request a change. Whether it’s possible depends on the host’s availability and the listing’s policy.",
        ],
      },
      {
        id: "confirmation",
        title: "I didn’t receive a confirmation — what now?",
        body: [
          "Check your spam folder first. If it’s still missing after a few minutes, open Dashboard → Bookings to see the status, or contact our support team.",
        ],
      },
    ],
  },
  {
    id: "cancellations",
    title: "Cancellations & refunds",
    description: "Changing plans and getting money back.",
    faqs: [
      {
        id: "how-to-cancel",
        title: "How do I cancel a booking?",
        body: [
          "Go to Dashboard → Bookings, open the reservation and select Cancel. You’ll see the refund amount based on the host’s cancellation policy before you confirm.",
        ],
      },
      {
        id: "refund-time",
        title: "How long do refunds take?",
        body: [
          "Approved refunds are issued to your original payment method and typically appear within 5–10 business days, depending on your bank.",
        ],
      },
      {
        id: "host-cancels",
        title: "What if the host cancels on me?",
        body: [
          "You’ll be refunded in full and we’ll help you find a comparable stay. Hosts who cancel confirmed bookings are subject to penalties under our policies.",
        ],
      },
    ],
  },
  {
    id: "account",
    title: "Account & payments",
    description: "Signing in, profile and payment methods.",
    faqs: [
      {
        id: "reset-password",
        title: "How do I reset my password?",
        body: [
          "On the sign-in page choose “Forgot password”, enter your email and follow the link we send to set a new one.",
        ],
      },
      {
        id: "payment-methods",
        title: "Which payment methods are supported?",
        body: [
          "We support major credit and debit cards and popular regional payment options at checkout, processed securely by our payment partner.",
        ],
      },
      {
        id: "delete-account",
        title: "How do I delete my account?",
        body: [
          "You can close your account from your settings. If you need help, contact support and we’ll take care of it for you.",
        ],
      },
    ],
  },
  {
    id: "hosting",
    title: "Hosting",
    description: "Listing your place and managing guests.",
    faqs: [
      {
        id: "become-host",
        title: "How do I list my property?",
        body: [
          "Select “List your place” and follow the guided steps — property details, location, pricing, amenities and photos. Listing is free and you can save and resume any time.",
        ],
      },
      {
        id: "payouts",
        title: "When do I get paid?",
        body: [
          "Payouts are released to your nominated account after the guest checks in, less Stayly’s flat commission. You can track everything from the host dashboard.",
        ],
      },
      {
        id: "manage-listing",
        title: "How do I update my calendar or pricing?",
        body: [
          "Open Dashboard → Host → Listings, pick the property and edit availability, pricing or details. Changes take effect immediately.",
        ],
      },
    ],
  },
];
