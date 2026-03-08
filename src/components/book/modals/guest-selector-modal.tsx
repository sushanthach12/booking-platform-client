"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Guests</DialogTitle>
        </DialogHeader>
        <GuestSelectorContent
          value={value}
          onChange={onChange}
          maxGuests={maxGuests}
        />
        <DialogFooter className="flex-row justify-end gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
