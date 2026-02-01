"use client";

import {
  Bell,
  Grid3X3,
  Home,
  MapPin,
  Mountain,
  Palmtree,
  Tent,
  Wind,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

const CATEGORY_ICONS = [
  { id: "grid", Icon: Grid3X3, label: "Grid view", active: true },
  { id: "map", Icon: MapPin, label: "Map view", active: false },
  { id: "bell", Icon: Bell, label: "Notifications", active: false },
  { id: "beach", Icon: Palmtree, label: "Beach", active: false },
  { id: "mountain", Icon: Mountain, label: "Mountain", active: false },
  { id: "tent", Icon: Tent, label: "Camping", active: false },
  { id: "balloon", Icon: Wind, label: "Experiences", active: false },
  { id: "home", Icon: Home, label: "Home", active: false },
];

export function CategoryRail() {
  return (
    <nav
      className="flex w-14 flex-col items-center gap-0.5 overflow-y-auto border-r border-border bg-background py-4"
      aria-label="Categories"
    >
      {CATEGORY_ICONS.map(({ id, Icon, label, active }) => (
        <Button
          key={id}
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "relative size-10 shrink-0 rounded-r-lg rounded-l-none",
            active && "bg-muted/50"
          )}
          aria-label={label}
          aria-current={active ? "true" : undefined}
          title={label}
        >
          {active && (
            <span
              className="absolute left-0 top-0 h-full w-1 rounded-r-full"
              style={{ backgroundColor: "var(--nav-underline)" }}
              aria-hidden
            />
          )}
          <Icon className="size-5" />
        </Button>
      ))}
    </nav>
  );
}
