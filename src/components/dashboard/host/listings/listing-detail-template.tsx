import { ListingDetailView } from "./listing-detail-view";

interface ListingDetailTemplateProps {
  propertyId: string;
}

/** Server composition layer for the host listing detail route. */
export function ListingDetailTemplate({
  propertyId,
}: ListingDetailTemplateProps) {
  return <ListingDetailView propertyId={propertyId} />;
}
