import { getPropertyUseCase } from "@/domain/di";
import type { PropertyEntity } from "@/domain/entities";
import { PROPERTY_CATEGORIES } from "@/types/categories";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { CategoryPropertySlider } from "../category-property-slider";

/**
 * Template for category-wise property listings on the home page.
 * - Fetches all properties and categorises them
 * - Displays categories with 6 properties each in sliders
 * - Section header follows the platform design system
 */
export default async function CategoryPropertyListTemplate() {
  const propertyUseCase = getPropertyUseCase();
  const allProperties = await propertyUseCase.getProperties();

  const matchedIds = new Set<string>();

  const categorizedProperties = PROPERTY_CATEGORIES.map((category) => {
    let categoryProperties: PropertyEntity[] = [];

    if (category.filterKey === "type") {
      categoryProperties = allProperties.filter((property) =>
        property.type
          ?.toLowerCase()
          .includes(category.filterValue.toLowerCase()),
      );
    } else if (category.filterKey === "location") {
      categoryProperties = allProperties.filter(
        (property) =>
          property.location.city
            ?.toLowerCase()
            .includes(category.filterValue.toLowerCase()) ||
          property.location.state
            ?.toLowerCase()
            .includes(category.filterValue.toLowerCase()) ||
          property.location.country
            ?.toLowerCase()
            .includes(category.filterValue.toLowerCase()) ||
          property.title
            .toLowerCase()
            .includes(category.filterValue.toLowerCase()),
      );
    }

    categoryProperties.forEach((p) => matchedIds.add(p.id));

    return {
      category,
      properties: categoryProperties.slice(0, 6),
    };
  }).filter((cat) => cat.properties.length > 0);

  const uncategorized = allProperties.filter((p) => !matchedIds.has(p.id));
  if (uncategorized.length > 0) {
    categorizedProperties.push({
      category: {
        id: "all",
        name: "All Properties",
        description: "All available properties",
        filterKey: "type",
        filterValue: "",
      },
      properties: uncategorized.slice(0, 6),
    });
  }

  return (
    <section className="py-20 px-6 lg:px-10 bg-white">
      <div className="max-w-[1240px] mx-auto flex flex-col gap-16">
        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
              Browse by type
            </p>
            <h2
              className="text-3xl sm:text-4xl text-foreground leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.5px",
              }}
            >
              Explore by category
            </h2>
            <p className="mt-2 text-muted-foreground text-base max-w-md">
              Curated collections to match every travel mood — from city-centre
              flats to secluded mountain retreats.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 shrink-0 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
          >
            <SlidersHorizontal className="size-4 group-hover:text-primary transition-colors" />
            All properties
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>

        {/* ── Category count pills ── */}
        {categorizedProperties.length > 0 && (
          <div className="flex flex-wrap gap-2 -mt-10">
            {categorizedProperties.map(({ category, properties }) => (
              <span
                key={category.id}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted hover:bg-primary-subtle hover:text-primary rounded-full px-3 py-1.5 transition-colors cursor-default"
              >
                {category.name}
                <span className="text-muted-subtle font-normal">
                  {properties.length}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* ── Category sliders ── */}
        {categorizedProperties.length > 0 ? (
          <div className="flex flex-col gap-16">
            {categorizedProperties.map(({ category, properties }) => (
              <div key={category.id} className="flex flex-col gap-6">
                {/* Per-category label row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Accent bar */}
                    <span className="block w-1 h-6 rounded-full bg-primary" />
                    <h3 className="text-xl font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <span className="text-sm text-muted-subtle font-medium">
                      {properties.length}{" "}
                      {properties.length === 1 ? "property" : "properties"}
                    </span>
                  </div>
                  <Link
                    href={`/search?${category.filterKey}=${encodeURIComponent(category.filterValue)}`}
                    className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    View all →
                  </Link>
                </div>

                {/* Divider */}
                <div className="h-px bg-border -mt-2" />

                <CategoryPropertySlider
                  category={category}
                  properties={properties}
                  showHeader={false}
                />
              </div>
            ))}
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <SlidersHorizontal className="size-7 text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold text-lg mb-1">
              No properties yet
            </p>
            <p className="text-muted-foreground text-sm max-w-xs">
              We&apos;re adding new listings every day — check back soon or
              browse all available stays.
            </p>
            <Link
              href="/search"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Browse all properties →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
