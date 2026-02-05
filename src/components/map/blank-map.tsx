"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlankMapProps {
  className?: string;
}

/**
 * Blank map component placeholder as requested
 * This component displays a placeholder where the map would be
 */
export function BlankMap({ className }: BlankMapProps) {
  return (
    <div className={cn(
      "w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-500",
      className
    )}>
      <MapPin className="size-16 mb-4 text-gray-400" />
      <h3 className="text-lg font-medium mb-2">Map View</h3>
      <p className="text-sm text-gray-400 max-w-xs text-center">
        Map component placeholder - to be implemented
      </p>
      <div className="mt-4 px-4 py-2 bg-white rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500">Map functionality coming soon</p>
      </div>
    </div>
  );
}
