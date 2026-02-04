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
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = [
  { id: "grid", Icon: LayoutGrid, label: "Grid view", active: true },
  { id: "map", Icon: MapPin, label: "Map view", active: false },
  { id: "cabin", Icon: Home, label: "A-frame cabin", active: false },
  { id: "castle", Icon: Mountain, label: "Castle", active: false },
  { id: "windmill", Icon: Wind, label: "Windmill", active: false },
  { id: "ski", Icon: Mountain, label: "Ski", active: false },
  { id: "surfing", Icon: Palmtree, label: "Surfing", active: false },
  { id: "island", Icon: Palmtree, label: "Island", active: false },
  { id: "pool", Icon: Home, label: "Pool", active: false },
  { id: "barn", Icon: Home, label: "Barn", active: false },
  { id: "beach", Icon: Palmtree, label: "Beach hut", active: false },
  { id: "treehouse", Icon: Home, label: "Treehouse", active: false },
  { id: "tiny-house", Icon: Home, label: "Tiny house", active: false },
  { id: "camping", Icon: Tent, label: "Camping", active: false },
  { id: "lighthouse", Icon: Home, label: "Lighthouse", active: false },
  { id: "cave", Icon: Mountain, label: "Cave", active: false },
  { id: "igloo", Icon: Mountain, label: "Igloo", active: false },
  { id: "tent", Icon: Tent, label: "Tent", active: false },
  { id: "boat", Icon: Home, label: "Boat", active: false },
  { id: "cocktail", Icon: Bell, label: "Cocktail", active: false },
];

export function CategoryRail() {
  return (
    <nav
      className="sticky top-(--header-height) h-[calc(100vh-var(--header-height))] w-24 shrink-0 border-r border-border bg-background py-6 overflow-y-auto overscroll-y-contain scrollbar-hide"
      aria-label="Categories"
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center gap-4">
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
