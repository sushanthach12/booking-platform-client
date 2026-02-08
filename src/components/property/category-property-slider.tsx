"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PropertyListingCard } from "./property-listing-card";
import type { PropertyEntity } from "@/domain/entities";
import type { PropertyCategory } from "@/types/categories";
import { cn } from "@/lib/utils";

interface CategoryPropertySliderProps {
  category: PropertyCategory;
  properties: PropertyEntity[];
  className?: string;
}

export function CategoryPropertySlider({
  category,
  properties,
  className,
}: CategoryPropertySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsToShow = 6;
  const maxIndex = Math.max(0, properties.length - itemsToShow);

  const visibleProperties = properties.slice(
    currentIndex,
    currentIndex + itemsToShow,
  );

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">
            {category.name}
          </h2>
          <p className="text-muted-foreground">{category.description}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={!canGoNext}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* View All Button */}
          <Button variant="outline" asChild className="rounded-full">
            <Link
              href={`/search?${category.filterKey}=${encodeURIComponent(category.filterValue)}`}
            >
              View All
            </Link>
          </Button>
        </div>
      </div>

      {/* Properties Slider */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            }}
          >
            {visibleProperties.map((property) => (
              <div
                key={property.id}
                className="flex-shrink-0 w-full"
                style={{
                  width: `calc(${100 / itemsToShow}% - ${((itemsToShow - 1) * 24) / itemsToShow}px)`,
                }}
              >
                <PropertyListingCard property={property} />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Overlays for fade effect */}
        {canGoPrevious && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        )}
        {canGoNext && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
