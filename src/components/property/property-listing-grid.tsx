import type { PropertyEntity } from "@/domain/entities";
import { cn } from "@/lib/utils";
import { PropertyListingCard } from "./property-listing-card";

interface PropertyListingGridProps {
  properties: PropertyEntity[];
  className?: string;
}

export function PropertyListingGrid({ properties, className }: PropertyListingGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 lg:gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className
      )}
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
