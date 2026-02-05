"use client";

import { SearchMap } from "@/components/map/search-map";
import { BlankMap } from "@/components/map/blank-map";
import { SearchSidebar } from "@/components/sidebar/search-sidebar";
import { Button } from "@/components/ui/button";
import type { PropertyEntity } from "@/domain/entities";
import { cn } from "@/lib/utils";
import { MapPin, Grid, List } from "lucide-react";
import { useState } from "react";
import { PropertyCard } from "./property-card";

/**
 * New search results view with sidebar and blank map placeholder
 * Based on reference screenshot design
 */
interface SearchViewNewProps {
  properties: PropertyEntity[];
  /** Derived in template from properties.length */
  totalCount: number;
  /** Optional: location label from template state */
  locationLabel?: string;
}

export function SearchViewNew({ properties, totalCount, locationLabel = "Melbourne" }: SearchViewNewProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<"date" | "price" | "recommended">("recommended");

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <SearchSidebar className="hidden lg:block" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search Results Header */}
        <header className="shrink-0 border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {totalCount} stays in {locationLabel}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price">Price (low to high)</option>
                  <option value="date">Newest</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-r-none h-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="size-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-l-none h-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-sm text-gray-700 rounded-full">
              {locationLabel}
              <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-sm text-gray-700 rounded-full">
              May 16-18
              <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-sm text-gray-700 rounded-full">
              2 guests
              <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
            </span>
            <Button variant="outline" size="sm" className="rounded-full h-7 text-xs">
              + More filters
            </Button>
          </div>
        </header>

        {/* Property Listings */}
        <div className="flex-1 overflow-y-auto">
          <div className={cn(
            "p-6",
            viewMode === "grid" && "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
          )}>
            {properties.map((property) => (
              <div key={property.id} className={viewMode === "list" ? "mb-6" : ""}>
                <PropertyCard
                  property={property}
                  showGuestFavorite={(property.stats?.rating ?? 0) >= 4.8}
                />
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="p-6 border-t border-gray-200">
            <Button variant="outline" className="w-full h-12 rounded-lg">
              Show more properties
            </Button>
          </div>
        </div>
      </div>

      {/* Map Section - Blank Placeholder */}
      <div className="hidden w-[40%] bg-gray-50 lg:block">
        <BlankMap className="h-full" />
      </div>

      {/* Floating Map Button - Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button size="lg" className="rounded-full shadow-lg h-14 px-6">
          <MapPin className="mr-2 size-5" />
          Show map
        </Button>
      </div>
    </div>
  );
}
