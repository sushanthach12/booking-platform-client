"use client";

import { Modal } from "@/components/shared/modal";
import type { CancellationPolicyType } from "@/domain/entities";
import { format, subHours } from "date-fns";

interface PolicyTier {
  timeLabel: string;
  refundTitle: string;
  refundDescription: string;
}

function getPolicyTiers(
  policy: CancellationPolicyType,
  checkIn: Date,
  checkInTime: string,
): PolicyTier[] {
  const [hours, minutes] = checkInTime.split(":").map(Number);
  const checkInDateTime = new Date(checkIn);
  checkInDateTime.setHours(hours, minutes ?? 0, 0, 0);

  const fmt = (d: Date) => `${format(d, "d MMM")}\n${format(d, "h:mm aa")}`;

  switch (policy) {
    case "flexible":
      return [
        {
          timeLabel: "Within\n24 hours\nafter booking",
          refundTitle: "Full refund",
          refundDescription: "Get back 100% of what you paid.",
        },
        {
          timeLabel: `Before\n${fmt(subHours(checkInDateTime, 24))}`,
          refundTitle: "Full refund",
          refundDescription:
            "Cancel at least 24 hours before check-in for a full refund.",
        },
        {
          timeLabel: `After\n${fmt(subHours(checkInDateTime, 24))}`,
          refundTitle: "No refund",
          refundDescription: "This reservation is non-refundable.",
        },
      ];

    case "moderate":
      return [
        {
          timeLabel: "Within\n48 hours\nafter booking",
          refundTitle: "Full refund",
          refundDescription: "Get back 100% of what you paid.",
        },
        {
          timeLabel: `Before\n${fmt(subHours(checkInDateTime, 120))}`,
          refundTitle: "Partial refund",
          refundDescription:
            "Get back 50% of every night. No refund of the service fee.",
        },
        {
          timeLabel: `After\n${fmt(subHours(checkInDateTime, 120))}`,
          refundTitle: "No refund",
          refundDescription: "This reservation is non-refundable.",
        },
      ];

    case "strict":
    default:
      return [
        {
          timeLabel: "Within\n48 hours\nafter booking",
          refundTitle: "Full refund",
          refundDescription:
            "Get back 100% of what you paid, as long as this is at least 14 days before check-in.",
        },
        {
          timeLabel: `Before\n${fmt(subHours(checkInDateTime, 336))}`,
          refundTitle: "Partial refund",
          refundDescription:
            "Get back 50% of every night (excluding the first night). No refund of the service fee.",
        },
        {
          timeLabel: `After\n${fmt(subHours(checkInDateTime, 336))}`,
          refundTitle: "No refund",
          refundDescription: "This reservation is non-refundable.",
        },
      ];
  }
}

interface CancellationPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: CancellationPolicyType;
  checkIn: Date;
  checkInTime?: string;
}

export function CancellationPolicyModal({
  open,
  onOpenChange,
  policy,
  checkIn,
  checkInTime = "15:00",
}: CancellationPolicyModalProps) {
  const tiers = getPolicyTiers(policy, checkIn, checkInTime);

  const policyLabel =
    policy === "flexible"
      ? "Flexible"
      : policy === "moderate"
        ? "Moderate"
        : "Strict";

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Header>Cancellation policy</Modal.Header>
      <Modal.Body>
        <div className="space-y-0 divide-y divide-border">
          {tiers.map((tier, i) => (
            <div key={i} className="grid grid-cols-[140px_1fr] gap-4 py-5">
              <div className="text-sm text-foreground font-medium whitespace-pre-line leading-snug">
                {tier.timeLabel}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">
                  {tier.refundTitle}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tier.refundDescription}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border space-y-3 text-sm text-muted-foreground">
          <p>Time shown is based on the location of the listing.</p>
          {/* <p>
            <span className="font-medium text-foreground">Refund eligibility</span>
            <br />
            If you&apos;re making{" "}
            <span className="underline cursor-default">scheduled payments</span>
            , your refund or amount due will depend on how much you&apos;ve paid
            at the time of cancellation.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Policy type:{" "}
            <span className="font-medium text-foreground">{policyLabel}</span>
          </p> */}
        </div>
      </Modal.Body>
    </Modal>
  );
}
