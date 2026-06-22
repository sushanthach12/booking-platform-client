import type { InfoSection } from "../info-accordion";

/** Effective date shown in the hero. Update when the policy materially changes. */
export const PRIVACY_EFFECTIVE = "Last updated 22 June 2026";

/**
 * Privacy Policy sections. Written as a clear, plain-language summary covering
 * the standard disclosures (collection, use, sharing, cookies, rights,
 * retention, security). This is template copy — have it reviewed by counsel
 * before relying on it in production.
 */
export const PRIVACY_SECTIONS: InfoSection[] = [
  {
    id: "overview",
    title: "Overview",
    body: [
      "Stayly Stays Pvt. Ltd. (“Stayly”, “we”, “us”) operates the Stayly booking platform. This policy explains what personal information we collect, why we collect it, and the choices you have.",
      "It applies to guests, hosts and visitors who use our website and related services. By using Stayly you agree to the practices described here.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: [
      "We collect information you give us directly and information generated automatically as you use the platform.",
    ],
    bullets: [
      "Account details — name, email address, phone number and password when you sign up or sign in with Google.",
      "Booking information — stay dates, guest counts, the properties you view, book or save to your wishlist.",
      "Host listing data — property details, photos, pricing and availability you publish as a host.",
      "Payment information — processed by our payment partners; we store only the minimum needed to manage your bookings and payouts.",
      "Technical data — device, browser, IP address and usage events collected through cookies and similar technologies.",
    ],
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    bullets: [
      "Create and manage your account and authenticate your sessions.",
      "Process bookings, confirmations, cancellations and host payouts.",
      "Show relevant search results, nearby stays and personalised recommendations.",
      "Send transactional messages such as booking receipts, reminders and security alerts.",
      "Detect, prevent and investigate fraud, abuse and policy violations.",
      "Improve the platform, measure performance and comply with our legal obligations.",
    ],
  },
  {
    id: "sharing",
    title: "How we share information",
    body: [
      "We do not sell your personal information. We share it only as needed to run the platform:",
    ],
    bullets: [
      "Between guests and hosts to complete a confirmed booking (for example, contact details and stay information).",
      "With service providers such as hosting, payment processing, email delivery and analytics, under contract.",
      "With authorities when required by law, or to protect the rights, safety and property of Stayly and its users.",
      "In connection with a merger, acquisition or sale of assets, with notice to affected users.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & tracking",
    body: [
      "We use cookies and local storage to keep you signed in, remember your search preferences and understand how the platform is used.",
      "You can control cookies through your browser settings. Disabling essential cookies may break sign-in and booking features.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights & choices",
    body: [
      "Depending on where you live, you may have the right to access, correct, export or delete your personal information, and to object to or restrict certain processing.",
    ],
    bullets: [
      "Update your profile and contact details from your account settings at any time.",
      "Request a copy or deletion of your data by emailing our privacy team.",
      "Opt out of non-essential marketing communications using the unsubscribe link.",
    ],
  },
  {
    id: "data-retention",
    title: "Data retention",
    body: [
      "We keep your information for as long as your account is active and as needed to provide the service. After that, we retain only what is required to meet legal, tax, accounting and dispute-resolution obligations, then securely delete or anonymise it.",
    ],
  },
  {
    id: "security",
    title: "How we protect your data",
    body: [
      "We use encryption in transit, access controls and regular security reviews to protect your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security, but we work continuously to safeguard your data.",
    ],
  },
  {
    id: "children",
    title: "Children’s privacy",
    body: [
      "Stayly is not intended for anyone under 18. We do not knowingly collect personal information from children. If you believe a child has provided us data, contact us and we will delete it.",
    ],
  },
  {
    id: "contact",
    title: "Contacting us",
    body: [
      "For privacy questions or to exercise your rights, email privacy@stayly.com. We respond to verified requests within the timelines required by applicable law.",
    ],
  },
];
