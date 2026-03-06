"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Car, Droplets, Home, Star, Tv, Utensils, Wind } from "lucide-react";
import { useEffect, useState } from "react";

export interface SearchFiltersState {
  priceRange: [number, number];
  propertyTypes: string[];
  amenities: string[];
  rating: string;
}


interface SearchFilterSidebarProps {
  filters: SearchFiltersState;
  onFiltersChange: (filters: SearchFiltersState) => void;
  onClearFilters: () => void;
}

const propertyTypes = [
  { id: "apartment", label: "Apartments", count: 245 },
  { id: "house", label: "Houses", count: 189 },
  { id: "condo", label: "Condos", count: 67 },
  { id: "villa", label: "Villas", count: 34 },
  { id: "studio", label: "Studios", count: 89 },
  { id: "loft", label: "Lofts", count: 23 },
];

const amenities = [
  { id: "wifi", label: "WiFi", icon: Wind },
  { id: "kitchen", label: "Kitchen", icon: Utensils },
  { id: "parking", label: "Free parking", icon: Car },
  { id: "air_conditioning", label: "Air conditioning", icon: Wind },
  { id: "heating", label: "Heating", icon: Wind },
  { id: "washer", label: "Washer", icon: Droplets },
  { id: "tv", label: "TV", icon: Tv },
  { id: "pool", label: "Pool", icon: Droplets },
];

const RATING_SLIDER_VALUES = ["", "3.0+", "3.5+", "4.0+", "4.5+"] as const;
const RATING_SLIDER_MIN = 0;
const RATING_SLIDER_MAX = RATING_SLIDER_VALUES.length - 1;

export function SearchFilterSidebar({
  filters,
  onFiltersChange,
  onClearFilters,
}: SearchFilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(filters.propertyTypes);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities);
  const [selectedRating, setSelectedRating] = useState<string>(filters.rating);

  useEffect(() => {
    setPriceRange(filters.priceRange);
    setSelectedTypes(filters.propertyTypes);
    setSelectedAmenities(filters.amenities);
    setSelectedRating(filters.rating);
  }, [filters]);

  const handlePriceRangeChange = (value: [number, number]) => {
    onFiltersChange({ ...filters, priceRange: value });
  }

  const handleCheckboxChange = (key: 'propertyTypes' | 'amenities', id: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      [key]: checked
        ? [...filters[key], id]
        : filters[key].filter((item) => item !== id),
    });
  };

  const ratingSliderValue = RATING_SLIDER_VALUES.indexOf(selectedRating as (typeof RATING_SLIDER_VALUES)[number]);
  const effectiveRatingSliderValue = ratingSliderValue === -1 ? RATING_SLIDER_MIN : ratingSliderValue;

  const handleRatingSliderChange = (value: number[]) => {
    const rating = RATING_SLIDER_VALUES[value[0] ?? RATING_SLIDER_MIN] ?? "";
    setSelectedRating(rating);
    onFiltersChange({ ...filters, rating });
  };

  const handleClearAll = () => {
    onClearFilters();
  }

  return (
    <aside
      className="w-72 lg:w-80 h-full flex flex-col min-h-0 bg-background border-r border-border overflow-hidden"
    >
      <div className="p-6 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          <Button variant="ghost" size="sm" className="text-sm" onClick={handleClearAll}>
            Clear all
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 pb-0 scrollbar-hide">
        <div className="mb-8">
          <h3 className="font-medium text-foreground mb-4">Price range</h3>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="mb-8">
          <h3 className="font-medium text-foreground mb-4">Property type</h3>
          <div className="space-y-3">
            {propertyTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={type.id}
                    checked={selectedTypes.includes(type.id)}
                    onCheckedChange={(checked) => handleCheckboxChange('propertyTypes', type.id, Boolean(checked.valueOf()))}
                  />
                  <label
                    htmlFor={type.id}
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <Home className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{type.label}</span>
                  </label>
                </div>
                <span className="text-sm text-muted-foreground">{type.count}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="mb-8">
          <h3 className="font-medium text-foreground mb-4">Amenities</h3>
          <div className="space-y-3">
            {amenities.map((amenity) => {
              const Icon = amenity.icon;
              return (
                <div key={amenity.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={amenity.id}
                    checked={selectedAmenities.includes(amenity.id)}
                    onCheckedChange={(checked) => handleCheckboxChange('amenities', amenity.id, Boolean(checked.valueOf()))}
                  />
                  <label
                    htmlFor={amenity.id}
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{amenity.label}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="mb-8">
          <h3 className="font-medium text-foreground mb-4">Minimum rating</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="size-4 text-muted-foreground fill-current shrink-0" />
              <span className="text-sm text-muted-foreground">
                {selectedRating ? `${selectedRating} & up` : "Any rating"}
              </span>
            </div>
            <Slider
              value={[effectiveRatingSliderValue]}
              onValueChange={handleRatingSliderChange}
              min={RATING_SLIDER_MIN}
              max={RATING_SLIDER_MAX}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Any</span>
              <span>4.5+</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
