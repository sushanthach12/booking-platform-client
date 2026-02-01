import type { PropertyEntity } from "@/domain/entities";
import { cn } from "@/lib/utils/utils";
import { ListingCard } from "./listing-card";

interface ListingGridProps {
  properties: PropertyEntity[];
  className?: string;
}

export function ListingGrid({ properties, className }: ListingGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className
      )}
      role="list"
    >
      {properties.map((property) => (
        <div key={property.id} role="listitem">
          <ListingCard property={property} />
        </div>
      ))}
    </div>
  );
}
