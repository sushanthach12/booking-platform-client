"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IBecomeHostPropertyFormData } from "@/domain/entities";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { Home } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OverviewTabProps {
  propertyId: string;
  form: IBecomeHostPropertyFormData;
}

/** Emoji per amenity name (best-effort; falls back to a dot). */
const AMENITY_EMOJI: Record<string, string> = {
  "wi-fi": "📶",
  wifi: "📶",
  kitchen: "🍳",
  "free parking": "🚗",
  parking: "🚗",
  "washer & dryer": "🧺",
  washer: "🧺",
  dryer: "🧺",
  "air conditioning": "❄️",
  "smart tv": "📺",
  tv: "📺",
  bathtub: "🛁",
  workspace: "💼",
  heating: "🔥",
  toiletries: "🧴",
  pool: "🏊",
  gym: "🏋️",
};

function emojiFor(name: string): string {
  return AMENITY_EMOJI[name.trim().toLowerCase()] ?? "•";
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-none">
      <CardContent className="p-6">
        <h2 className="font-bold text-slate-900">{title}</h2>
        <div className="mt-4">{children}</div>
      </CardContent>
    </Card>
  );
}

function RuleRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

export function OverviewTab({ propertyId, form }: OverviewTabProps) {
  const router = useRouter();
  const currency = form.currency || "USD";

  // Map known rule types to friendly labels; show whatever the listing has.
  const ruleValue = (type: string, fallback: string): string => {
    const rule = form.rules?.find((r) => r.type.toLowerCase() === type);
    if (!rule) return fallback;
    return rule.description ?? (rule.allowed ? "Allowed" : "Not allowed");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      {/* Main column */}
      <div className="space-y-6">
        <SectionCard title="About this listing">
          <p
            className="text-sm leading-[1.7] text-slate-600"
            style={{ textWrap: "pretty" }}
          >
            {form.description || "No description provided yet."}
          </p>
        </SectionCard>

        {form.amenities?.length > 0 && (
          <SectionCard title="Amenities">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {form.amenities.map((a) => (
                <div
                  key={a}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  <span aria-hidden>{emojiFor(a)}</span>
                  {a}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        <SectionCard title="House rules">
          <div>
            <RuleRow label="Check-in" value={`After ${form.checkInTime}`} />
            <RuleRow label="Check-out" value={`Before ${form.checkOutTime}`} />
            <RuleRow
              label="Smoking"
              value={ruleValue("smoking", "Not allowed")}
            />
            <RuleRow
              label="Pets"
              value={ruleValue("pets", "Allowed on request")}
            />
            <RuleRow
              label="Parties or events"
              value={ruleValue("parties", "Not allowed")}
            />
          </div>
        </SectionCard>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <SectionCard title="Pricing">
          <div>
            <PriceRow
              label="Nightly rate"
              value={formatCurrency(form.basePrice ?? 0, currency, 0)}
            />
            <PriceRow label="Min stay" value={`${form.minNights} nights`} />
            <PriceRow label="Max stay" value={`${form.maxNights} nights`} />
            <PriceRow label="Max guests" value={String(form.maxGuests)} />
          </div>
        </SectionCard>

        <SectionCard title="Photos">
          <div className="grid grid-cols-3 gap-2">
            {(form.images ?? []).slice(0, 6).map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative aspect-square overflow-hidden rounded-lg bg-slate-100"
              >
                <Image
                  src={src}
                  alt={`Photo ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}
            {(form.images?.length ?? 0) === 0 &&
              [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-lg bg-slate-100"
                >
                  <Home className="size-5 text-slate-300" />
                </div>
              ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className={cn("mt-3 w-full")}
            onClick={() =>
              router.push(`/dashboard/host/listings/${propertyId}/edit`)
            }
          >
            Manage photos
          </Button>
        </SectionCard>
      </div>
    </div>
  );
}
