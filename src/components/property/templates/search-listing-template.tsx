import { getPropertyUseCase } from "@/domain/di";
import { SearchView } from "../search-view";

/**
 * Parent template for search results page.
 * - Owns: API call (use-case), derived state (totalCount, locationLabel), future hooks (filters, sort).
 * - Passes all state to SearchView via props. No fetching in child components.
 * Page should render only layout + this template.
 */
export default async function SearchListingTemplate() {
  const propertyUseCase = getPropertyUseCase();
  const properties = await propertyUseCase.getProperties();
  const totalCount = properties.length;
  const locationLabel = "Melbourne";

  return (
    <SearchView
      properties={properties}
      totalCount={totalCount}
      locationLabel={locationLabel}
    />
  );
}
