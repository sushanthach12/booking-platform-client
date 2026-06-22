import type { InfoSection } from "../info-accordion";

/** Effective date shown in the hero. Update when the terms materially change. */
export const TERMS_EFFECTIVE = "Last updated 22 June 2026";

/**
 * Terms of Service sections. Plain-language template covering the standard
 * clauses (eligibility, accounts, bookings, host obligations, payments,
 * cancellations, conduct, liability, governing law). Have counsel review
 * before relying on this in production.
 */
export const TERMS_SECTIONS: InfoSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of these terms",
    body: [
      "These Terms of Service govern your access to and use of the Stayly platform operated by Stayly Stays Pvt. Ltd. By creating an account or booking a stay you agree to be bound by these terms and our Privacy Policy.",
      "If you do not agree, please do not use Stayly.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility",
    body: [
      "You must be at least 18 years old and able to enter into a binding contract to use Stayly. By using the platform you confirm that the information you provide is accurate and that you will keep it up to date.",
    ],
  },
  {
    id: "accounts",
    title: "Your account",
    body: [
      "You are responsible for keeping your login credentials confidential and for all activity under your account.",
    ],
    bullets: [
      "Notify us immediately of any unauthorised use or security breach.",
      "We may suspend or terminate accounts that violate these terms or pose a risk to other users.",
      "You may close your account at any time from your settings.",
    ],
  },
  {
    id: "bookings",
    title: "Bookings & confirmations",
    body: [
      "When you book a property, you enter into a direct agreement with the host, subject to the listing’s house rules and cancellation policy.",
      "A booking is confirmed only when you receive a confirmation from Stayly. Prices, availability and fees are shown before you confirm and may change until then.",
    ],
  },
  {
    id: "host-obligations",
    title: "Host responsibilities",
    bullets: [
      "List only properties you have the right to offer, with accurate descriptions, photos and pricing.",
      "Honour confirmed bookings and keep your calendar and availability current.",
      "Comply with all applicable laws, registrations, taxes and safety requirements for your listing.",
      "Maintain the property in the condition presented to guests.",
    ],
  },
  {
    id: "payments",
    title: "Payments, fees & payouts",
    body: [
      "Guests pay the total shown at checkout, which may include the nightly rate, applicable taxes and a service fee.",
      "Hosts receive payouts to their nominated account after check-in, less Stayly’s commission. Payment processing is handled by our payment partners.",
    ],
  },
  {
    id: "cancellations",
    title: "Cancellations & refunds",
    body: [
      "Each listing specifies a cancellation policy chosen by the host. Refunds are calculated according to that policy and the timing of your cancellation.",
      "In exceptional circumstances Stayly may intervene to protect guests or hosts in line with our published policies.",
    ],
  },
  {
    id: "conduct",
    title: "Acceptable use",
    body: ["When using Stayly you agree not to:"],
    bullets: [
      "Post false, misleading, infringing or unlawful content.",
      "Circumvent the platform to avoid fees, or harvest data from other users.",
      "Harass, discriminate against or endanger other guests, hosts or staff.",
      "Interfere with, probe or disrupt the platform’s security or infrastructure.",
    ],
  },
  {
    id: "content",
    title: "Your content",
    body: [
      "You retain ownership of the reviews, photos and listing content you submit. By posting it you grant Stayly a worldwide, non-exclusive licence to host, display and promote that content in connection with operating the platform.",
    ],
  },
  {
    id: "liability",
    title: "Disclaimers & liability",
    body: [
      "Stayly is a marketplace that connects guests and hosts; we are not the provider of the accommodation. The platform is provided “as is” without warranties of any kind.",
      "To the maximum extent permitted by law, Stayly is not liable for indirect or consequential losses, and our total liability is limited to the fees you paid to Stayly for the booking in question.",
    ],
  },
  {
    id: "termination",
    title: "Suspension & termination",
    body: [
      "We may suspend or terminate access to the platform if you breach these terms, create risk for other users, or where required by law. Provisions that by their nature should survive termination will continue to apply.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: [
      "We may update these terms from time to time. We will post the revised version with a new effective date and, where appropriate, notify you. Continued use after changes take effect means you accept the updated terms.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing law",
    body: [
      "These terms are governed by the laws of India. The courts of Bengaluru, Karnataka have exclusive jurisdiction over any dispute, subject to any mandatory consumer protections in your place of residence.",
    ],
  },
];
