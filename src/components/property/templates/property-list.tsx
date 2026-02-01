import { getPropertyUseCase } from "@/domain/di";
import { ListingGrid } from "../listing-grid";

/**
 * Parent template for the home property list.
 * - Owns: API call (use-case), future hooks (e.g. filter/sort state), data utils.
 * - Passes state to children only via props. No data fetching in child components.
 * Page should render only layout + this template.
 */
export default async function PropertyListingTemplate() {
  const propertyUseCase = getPropertyUseCase();
  const properties = await propertyUseCase.getProperties();

  return <ListingGrid properties={properties} />;
}
