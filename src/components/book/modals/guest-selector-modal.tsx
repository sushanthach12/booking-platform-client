"use client";

import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { GuestSelectorContent } from "../guest-selector-content";
import type { GuestCount } from "../types";

interface GuestSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: GuestCount;
  onChange: (value: GuestCount) => void;
  onSave: () => void;
  maxGuests?: number;
}

export function GuestSelectorModal({
  open,
  onOpenChange,
  value,
  onChange,
  onSave,
  maxGuests = 16,
}: GuestSelectorModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-md">
      <Modal.Header>Guests</Modal.Header>
      <Modal.Body>
        <GuestSelectorContent
          value={value}
          onChange={onChange}
          maxGuests={maxGuests}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button size="lg" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button size="lg" onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
