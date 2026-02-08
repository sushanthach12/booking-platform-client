import { notFound } from "next/navigation";

import { getPropertyUseCase } from "@/domain/di";
import { mapPropertyToDetailView } from "@/lib/utils/map-property";
import { PropertyDetailView } from "../property-detail-view";

/**
 * Parent template for property detail page.
 * - Owns: API call (getPropertyById), data utils (mapPropertyToDetailView), future hooks (e.g. booking form state).
 * - Passes view state to PropertyDetailView only via props. No fetching in child.
 * Page should render only layout + this template with params.
 */
interface PropertyDetailsTemplateProps {
  propertyId: string;
}

export default async function PropertyDetailsTemplate({
  propertyId,
}: PropertyDetailsTemplateProps) {
  const propertyUseCase = getPropertyUseCase();
  const property = await propertyUseCase.getPropertyById(propertyId);

  if (!property) notFound();

  const viewState = mapPropertyToDetailView(property);

  return <PropertyDetailView state={viewState} />;
}
