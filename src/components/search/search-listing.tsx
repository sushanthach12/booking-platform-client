"use client";

import { PropertyListingCard } from "@/components/property/property-listing-card";
import type { PropertyEntity } from "@/domain/entities";

interface SearchListingProps {
  properties: PropertyEntity[];
}

export function SearchListing({ properties }: SearchListingProps) {
  return (
    <div
      className="p-4 sm:p-6 grid grid-cols-1 gap-6 lg:gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      role="list"
    >
      {properties.map((property) => (
        <div key={property.id} role="listitem">
          <PropertyListingCard property={property} />
        </div>
      ))}
    </div>
  );
}
