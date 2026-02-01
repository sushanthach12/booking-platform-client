"use client";

import {
  Bell,
  Home,
  LayoutGrid,
  MapPin,
  Mountain,
  Palmtree,
  Tent,
  Wind
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

const CATEGORY_ICONS = [
  { id: "grid", Icon: LayoutGrid, label: "Grid view", active: true },
  { id: "map", Icon: MapPin, label: "Map view", active: false },
  { id: "bell", Icon: Bell, label: "Notifications", active: false },
  { id: "beach", Icon: Palmtree, label: "Beach", active: false },
  { id: "mountain", Icon: Mountain, label: "Mountain", active: false },
  { id: "tent", Icon: Tent, label: "Camping", active: false },
  { id: "balloon", Icon: Wind, label: "Experiences", active: false },
  { id: "home", Icon: Home, label: "Home", active: false },
  { id: "grid-1", Icon: LayoutGrid, label: "Grid view", active: true },
  { id: "map-1", Icon: MapPin, label: "Map view", active: false },
  { id: "bell-1", Icon: Bell, label: "Notifications", active: false },
  { id: "beach-1", Icon: Palmtree, label: "Beach", active: false },
  { id: "mountain-1", Icon: Mountain, label: "Mountain", active: false },
  { id: "tent-1", Icon: Tent, label: "Camping", active: false },
  { id: "balloon-1", Icon: Wind, label: "Experiences", active: false },
  { id: "home-1", Icon: Home, label: "Home", active: false },

  { id: "grid-2", Icon: LayoutGrid, label: "Grid view", active: true },
  { id: "map-2", Icon: MapPin, label: "Map view", active: false },
  { id: "bell-2", Icon: Bell, label: "Notifications", active: false },
  { id: "beach-2", Icon: Palmtree, label: "Beach", active: false },
  { id: "mountain-2", Icon: Mountain, label: "Mountain", active: false },
  { id: "tent-2", Icon: Tent, label: "Camping", active: false },
  { id: "balloon-2", Icon: Wind, label: "Experiences", active: false },
  { id: "home-2", Icon: Home, label: "Home", active: false },
];

export function CategoryRail() {
  return (
    <nav
      className="sticky top-0 h-screen w-24 border-r border-border bg-background py-6 overflow-y-auto"
      aria-label="Categories"
    >
      <div className="flex flex-col items-center gap-4 overflow-y-auto">
        {CATEGORY_ICONS.map(({ id, Icon, label, active }) => (
          <span key={id} className={cn("w-full flex items-center justify-center", active && "border-r-3 border-indigo-500 font-bold")}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative size-10 shrink-0 rounded-lg hover:bg-white hover:cursor-pointer hover:text-foreground/70"
              aria-label={label}
              aria-current={active ? "true" : undefined}
              title={label}
            >
              <Icon className="size-6" />
            </Button>
          </span>
        ))}
      </div>
    </nav>
  );
}
