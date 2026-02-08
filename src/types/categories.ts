export interface PropertyCategory {
  id: string;
  name: string;
  description: string;
  filterKey: string;
  filterValue: string;
}

export const PROPERTY_CATEGORIES: PropertyCategory[] = [
  {
    id: "luxury-villas",
    name: "Luxury Villas",
    description: "Premium properties with exclusive amenities",
    filterKey: "type",
    filterValue: "villa",
  },
  {
    id: "beach-front",
    name: "Beach Front",
    description: "Properties with stunning ocean views",
    filterKey: "location",
    filterValue: "beach",
  },
  {
    id: "city-apartments",
    name: "City Apartments",
    description: "Modern urban living spaces",
    filterKey: "type",
    filterValue: "apartment",
  },
  {
    id: "cozy-cabins",
    name: "Cozy Cabins",
    description: "Rustic retreats in nature",
    filterKey: "type",
    filterValue: "cabin",
  },
];
