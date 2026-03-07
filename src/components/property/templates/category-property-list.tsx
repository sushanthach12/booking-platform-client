import { getPropertyUseCase } from "@/domain/di";
import type { PropertyEntity } from "@/domain/entities";
import { PROPERTY_CATEGORIES } from "@/types/categories";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { CategoryPropertySlider } from "../category-property-slider";

/**
 * Template for category-wise property listings on the home page.
 * - Fetches all properties and categorizes them
 * - Displays categories with 6 properties each in sliders
 * - Refined section header consistent with the homepage design language
 */
export default async function CategoryPropertyListTemplate() {
  const propertyUseCase = getPropertyUseCase();
  const allProperties = await propertyUseCase.getProperties();

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

    return {
      category,
      properties: categoryProperties.slice(0, 6),
    };
  }).filter((cat) => cat.properties.length > 0);

  return (
    <section className="py-20 px-6 lg:px-24 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-2">
              Browse by type
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Explore by category
            </h2>
            <p className="mt-2 text-slate-500 text-base max-w-md">
              Curated collections to match every travel mood — from city-centre
              flats to secluded mountain retreats.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 shrink-0 text-sm font-semibold text-slate-600 hover:text-rose-500 transition-colors group"
          >
            <SlidersHorizontal className="size-4 group-hover:text-rose-500 transition-colors" />
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
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-full px-3 py-1.5 transition-colors cursor-default"
              >
                {category.name}
                <span className="text-slate-400 font-normal">
                  {properties.length}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* ── Sliders ── */}
        {categorizedProperties.length > 0 ? (
          <div className="flex flex-col gap-16">
            {categorizedProperties.map(({ category, properties }) => (
              <div key={category.id} className="flex flex-col gap-6">
                {/* Per-category label row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="block w-1 h-6 rounded-full bg-linear-to-b from-rose-500 to-orange-400" />
                    <h3 className="text-xl font-bold text-slate-800">
                      {category.name}
                    </h3>
                    <span className="text-sm text-slate-400 font-medium">
                      {properties.length}{" "}
                      {properties.length === 1 ? "property" : "properties"}
                    </span>
                  </div>
                  <Link
                    href={`/search?${category.filterKey}=${encodeURIComponent(category.filterValue)}`}
                    className="text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors"
                  >
                    View all →
                  </Link>
                </div>

                {/* Subtle divider */}
                <div className="h-px bg-linear-to-r from-slate-200 via-slate-100 to-transparent -mt-2" />

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
            <div className="size-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <SlidersHorizontal className="size-7 text-slate-400" />
            </div>
            <p className="text-slate-800 font-semibold text-lg mb-1">
              No properties yet
            </p>
            <p className="text-slate-400 text-sm max-w-xs">
              We&apos;re adding new listings every day — check back soon or
              browse all available stays.
            </p>
            <Link
              href="/search"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors"
            >
              Browse all properties →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
