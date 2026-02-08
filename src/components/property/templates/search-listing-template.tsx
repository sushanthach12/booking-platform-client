import { getPropertyUseCase } from "@/domain/di";
import { SearchPageWrapper } from "../search-page-wrapper";

/**
 * Parent template for search results page.
 * - Owns: API call (use-case), derived state (totalCount, locationLabel), future hooks (filters, sort).
 * - Passes all state to SearchView via props. No fetching in child components.
 * Page should render only layout + this template.
 */
export default async function SearchListingTemplate({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const propertyUseCase = getPropertyUseCase();
  const properties = await propertyUseCase.getProperties();
  const totalCount = properties.length;

  // Extract location from search params or use default
  const locationLabel = (searchParams?.location as string) || "Melbourne";

  return (
    <SearchPageWrapper
      properties={properties}
      totalCount={totalCount}
      locationLabel={locationLabel}
      searchParams={searchParams}
    />
  );
}
