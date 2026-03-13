// ─────────────────────────────────────────────────────────────────
// components/sections/trust-bar.tsx
// ─────────────────────────────────────────────────────────────────
import { ShieldCheck, Headphones, CreditCard, Award } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Verified properties",
    description: "Every listing is manually reviewed and photo-verified.",
  },
  {
    icon: Headphones,
    title: "24/7 support",
    description:
      "Our team is always on hand before, during, and after your stay.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    description: "Bank-grade encryption on every transaction.",
  },
  {
    icon: Award,
    title: "Best price guarantee",
    description: "Find it cheaper elsewhere and we'll match it.",
  },
] as const;

export function TrustBar() {
  return (
    <section className="py-20 px-6 lg:px-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-5">
            <div className="shrink-0 size-12 rounded-2xl bg-rose-50 flex items-center justify-center">
              <Icon className="size-5 text-rose-500" />
            </div>
            <div>
              <div className="font-semibold text-slate-800 text-sm mb-0.5">
                {title}
              </div>
              <div className="text-slate-500 text-sm leading-relaxed">
                {description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
