import { getPropertyUseCase } from "@/domain/di";
import { CategoryPropertySlider } from "../category-property-slider";
import { PROPERTY_CATEGORIES } from "@/types/categories";
import type { PropertyEntity } from "@/domain/entities";

/**
 * Template for category-wise property listings on the home page.
 * - Fetches all properties and categorizes them
 * - Displays 4 categories with 6 properties each in sliders
 * - Includes navigation and "View All" buttons for each category
 */
export default async function CategoryPropertyListTemplate() {
  const propertyUseCase = getPropertyUseCase();
  const allProperties = await propertyUseCase.getProperties();

  // Categorize properties based on our defined categories
  const categorizedProperties = PROPERTY_CATEGORIES.map(category => {
    let categoryProperties: PropertyEntity[] = [];

    // Filter properties based on category criteria
    if (category.filterKey === 'type') {
      categoryProperties = allProperties.filter(property => 
        property.type?.toLowerCase().includes(category.filterValue.toLowerCase())
      );
    } else if (category.filterKey === 'location') {
      categoryProperties = allProperties.filter(property => 
        property.location.city?.toLowerCase().includes(category.filterValue.toLowerCase()) ||
        property.location.state?.toLowerCase().includes(category.filterValue.toLowerCase()) ||
        property.location.country?.toLowerCase().includes(category.filterValue.toLowerCase()) ||
        property.title.toLowerCase().includes(category.filterValue.toLowerCase())
      );
    }

    // Take first 6 properties for the slider
    return {
      category,
      properties: categoryProperties.slice(0, 6)
    };
  }).filter(cat => cat.properties.length > 0); // Only show categories with properties

  return (
    <div className="py-8 px-6 lg:px-24">
      <div className="flex flex-col gap-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Explore by Category
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your perfect stay from our curated collections of properties
          </p>
        </div>

        {/* Category Sliders */}
        <div className="space-y-16">
          {categorizedProperties.map(({ category, properties }) => (
            <CategoryPropertySlider
              key={category.id}
              category={category}
              properties={properties}
            />
          ))}
        </div>

        {/* Fallback message if no categories have properties */}
        {categorizedProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No properties available at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
