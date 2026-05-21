"use client";

import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export interface CancelBookingModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  /** "guest" shows guest-side reasons; "host" shows host-side reasons */
  role?: "guest" | "host";
}

const GUEST_REASONS = [
  { value: "plans_changed", label: "My plans have changed" },
  { value: "found_alternative", label: "Found a better option" },
  { value: "emergency", label: "Personal emergency" },
  { value: "incorrect_booking", label: "Booked by mistake" },
];

const HOST_REASONS = [
  { value: "property_unavailable", label: "Property is unavailable" },
  { value: "maintenance_required", label: "Maintenance / repairs needed" },
  { value: "guest_policy_violation", label: "Guest policy violation" },
  { value: "emergency", label: "Emergency situation" },
];

export function CancelBookingModal({
  open,
  onClose,
  onConfirm,
  role = "guest",
}: CancelBookingModalProps) {
  const reasons = role === "host" ? HOST_REASONS : GUEST_REASONS;

  const [selected, setSelected] = useState<string>("");
  const [otherText, setOtherText] = useState("");
  const [loading, setLoading] = useState(false);

  const isOther = selected === "other";
  const finalReason = isOther ? otherText.trim() : selected;
  const canSubmit =
    selected !== "" && (!isOther || otherText.trim().length > 0);

  const handleOpenChange = (v: boolean) => {
    if (!v && !loading) {
      setSelected("");
      setOtherText("");
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await onConfirm(finalReason);
      setSelected("");
      setOtherText("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange} className="max-w-md">
      {/* Header with warning */}
      <Modal.Header>
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-foreground">
            Cancel booking?
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground font-normal">
          {role === "host"
            ? "This will cancel the reservation and notify the guest. Any applicable refunds will be processed."
            : "This action cannot be undone. Any applicable refund will be processed per the cancellation policy."}
        </p>
      </Modal.Header>

      <Modal.Body className="pb-2">
        <p className="text-sm font-medium text-foreground mb-3">
          Please select a reason
        </p>

        <RadioGroup
          value={selected}
          onValueChange={setSelected}
          className="gap-2"
        >
          {reasons.map((r) => (
            <Label
              key={r.value}
              htmlFor={r.value}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all font-normal",
                selected === r.value
                  ? "border-primary bg-primary-subtle text-primary"
                  : "border-border hover:border-muted-foreground/40 bg-background",
              )}
            >
              <RadioGroupItem id={r.value} value={r.value} />
              <span className="text-sm">{r.label}</span>
            </Label>
          ))}

          <Label
            htmlFor="other"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all font-normal",
              isOther
                ? "border-primary bg-primary-subtle text-primary"
                : "border-border hover:border-muted-foreground/40 bg-background",
            )}
          >
            <RadioGroupItem id="other" value="other" />
            <span className="text-sm">Other reason</span>
          </Label>
        </RadioGroup>

        {isOther && (
          <Textarea
            placeholder="Please describe the reason for cancellation…"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            rows={3}
            className="mt-3 rounded-xl text-sm resize-none focus-visible:ring-0"
            autoFocus
          />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => handleOpenChange(false)}
          disabled={loading}
        >
          Keep Booking
        </Button>
        <Button
          className="rounded-xl bg-destructive hover:bg-destructive/90 text-white"
          onClick={handleConfirm}
          disabled={!canSubmit || loading}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Cancelling…
            </>
          ) : (
            "Yes, Cancel"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
