import { getPropertyUseCase } from "@/domain/di";
import { SearchContent } from "./search-content";
import { SearchHeader } from "./search-header";

/**
 * Search page template. Receives no props (except slug pages later).
 * Fetches data and composes SearchHeader + SearchContent; filter state
 * and other client logic (useSearchFilters, etc.) live inside the template children.
 */
export default async function SearchTemplate() {
  const propertyUseCase = getPropertyUseCase();
  const properties = await propertyUseCase.getProperties();
  const totalCount = properties.length;
  const locationLabel = "Melbourne";

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <SearchHeader locationLabel={locationLabel} />
      <main className="flex flex-1 overflow-hidden">
        <SearchContent
          properties={properties}
          totalCount={totalCount}
          locationLabel={locationLabel}
        />
      </main>
    </div>
  );
}
