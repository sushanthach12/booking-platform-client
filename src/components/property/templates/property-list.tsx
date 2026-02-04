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

  return (
    <div className="py-8 px-6 lg:px-24">
      <div className="flex flex-col flex-1 gap-8">
        {/* Header Section */}
        <div className="">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Discover Properties
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our curated selection of amazing properties around the world
          </p>
        </div>

        {/* Properties Grid */}
        <ListingGrid properties={properties} />
      </div>
    </div>
  )
}
