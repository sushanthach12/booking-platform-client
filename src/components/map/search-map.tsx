"use client";

import { MapPin } from "lucide-react";
import type { PropertyEntity } from "@/domain/entities";

interface SearchMapProps {
  properties: PropertyEntity[];
  className?: string;
}

export function SearchMap({ properties, className }: SearchMapProps) {
  return (
    <div className={className}>
      <div className="relative h-full w-full bg-muted">
        {/* Map placeholder - in real implementation, integrate with Google Maps or similar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto size-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Interactive Map</p>
            <p className="text-xs text-muted-foreground">
              {properties.length} properties
            </p>
          </div>
        </div>
        
        {/* Price markers overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {properties.slice(0, 8).map((property, index) => (
            <div
              key={property.id}
              className="absolute flex size-16 items-center justify-center"
              style={{
                top: `${20 + (index % 4) * 25}%`,
                left: `${15 + Math.floor(index / 4) * 35}%`,
              }}
            >
              <div className="rounded-full bg-white px-2 py-1 text-xs font-medium shadow-lg border border-border pointer-events-auto cursor-pointer hover:shadow-xl transition-shadow">
                ${property.pricing.amount}
                {property.pricing.currency}
              </div>
            </div>
          ))}
        </div>
        
        {/* Map controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            type="button"
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium shadow-md border border-border hover:shadow-lg"
          >
            Map
          </button>
          <button
            type="button"
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium shadow-md border border-border hover:shadow-lg"
          >
            Satellite
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            type="button"
            className="rounded-lg bg-white p-2 shadow-md border border-border hover:shadow-lg"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className="rounded-lg bg-white p-2 shadow-md border border-border hover:shadow-lg"
            aria-label="Zoom out"
          >
            −
          </button>
        </div>
        
        {/* Attribution */}
        <div className="absolute bottom-1 left-1 text-xs text-muted-foreground">
          Google
        </div>
      </div>
    </div>
  );
}
