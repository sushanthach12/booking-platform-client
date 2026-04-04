import { notFound } from "next/navigation";

import { getPropertyUseCase } from "@/domain/di";
import { mapPropertyToDetailView } from "@/lib/utils/map-property";
import { PropertyDetailView } from "../property-detail-view";

/** Optional initial date range from URL (e.g. from search check-in/check-out). */
export type InitialDateRange = { from: Date; to: Date };

/**
 * Parent template for property detail page.
 * - Owns: API call (getPropertyById), data utils (mapPropertyToDetailView), future hooks (e.g. booking form state).
 * - Passes view state to PropertyDetailView only via props. No fetching in child.
 * Page should render only layout + this template with params.
 */
interface PropertyDetailsTemplateProps {
  propertyId: string;
  /** Pre-fill booking widget dates from URL (e.g. from search). */
  initialDateRange?: InitialDateRange;
}

export default async function PropertyDetailsTemplate({
  propertyId,
  initialDateRange,
}: PropertyDetailsTemplateProps) {
  const propertyUseCase = getPropertyUseCase();
  const property = await propertyUseCase.getPropertyById(propertyId);

  if (!property) notFound();

  const viewState = mapPropertyToDetailView(property);

  return (
    <PropertyDetailView state={viewState} initialDateRange={initialDateRange} />
  );
}
