// ─────────────────────────────────────────────────────────────────
// components/sections/trust-bar.tsx
// Pure Server Component — no interactivity needed
// ─────────────────────────────────────────────────────────────────
import { Separator } from "@/components/ui/separator";
import { Award, CreditCard, Headphones, ShieldCheck } from "lucide-react";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Verified listings" },
  { icon: Headphones, label: "24/7 support" },
  { icon: CreditCard, label: "Secure payments" },
  { icon: Award, label: "Best price guarantee" },
] as const;

export function TrustBar() {
  return (
    <section className="bg-primary-subtle border-t border-border py-6 px-6 lg:px-10">
      <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {TRUST_ITEMS.map(({ icon: Icon, label }, i) => (
          <div key={label} className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="size-4 text-primary shrink-0" aria-hidden />
              <span className="text-sm font-medium">{label}</span>
            </div>
            {i < TRUST_ITEMS.length - 1 && (
              <Separator
                orientation="vertical"
                className="hidden sm:block h-4 bg-border"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
