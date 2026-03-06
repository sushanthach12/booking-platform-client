"use client";

import { useEffect, useRef, useState } from "react";
import { Home, Car, Wind, Droplets, Tv, Utensils, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface SearchFiltersState {
  priceRange: [number, number];
  propertyTypes: string[];
  amenities: string[];
  rating: string;
}

const DEBOUNCE_MS = 400;

interface SearchFilterSidebarProps {
  className?: string;
  onFiltersChange?: (filters: SearchFiltersState) => void;
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

const ratings = [
  { id: "4.5+", label: "4.5+", count: 123 },
  { id: "4.0+", label: "4.0+", count: 234 },
  { id: "3.5+", label: "3.5+", count: 345 },
  { id: "3.0+", label: "3.0+", count: 456 },
];

export function SearchFilterSidebar({
  className,
  onFiltersChange,
}: SearchFilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 500]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstMount = useRef(true);
  const onFiltersChangeRef = useRef(onFiltersChange);

  useEffect(() => {
    onFiltersChangeRef.current = onFiltersChange;
  }, [onFiltersChange]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    debounceRef.current = setTimeout(() => {
      const cb = onFiltersChangeRef.current;
      if (cb) {
        cb({
          priceRange,
          propertyTypes: selectedTypes,
          amenities: selectedAmenities,
          rating: selectedRating,
        });
      }
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [priceRange, selectedTypes, selectedAmenities, selectedRating]);

  return (
    <aside
      className={cn(
        "w-72 lg:w-80 h-full flex flex-col min-h-0 bg-background border-r border-border overflow-hidden",
        className,
      )}
    >
      <div className="p-6 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          <Button variant="ghost" size="sm" className="text-sm">
            Clear all
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 pb-0">
        <div className="mb-8">
          <h3 className="font-medium text-foreground mb-4">Price range</h3>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={(v) => setPriceRange([v[0] ?? 0, v[1] ?? 0])}
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
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTypes([...selectedTypes, type.id]);
                      } else {
                        setSelectedTypes(
                          selectedTypes.filter((id) => id !== type.id),
                        );
                      }
                    }}
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
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAmenities([
                          ...selectedAmenities,
                          amenity.id,
                        ]);
                      } else {
                        setSelectedAmenities(
                          selectedAmenities.filter((id) => id !== amenity.id),
                        );
                      }
                    }}
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
          <h3 className="font-medium text-foreground mb-4">Rating</h3>
          <div className="space-y-3">
            {ratings.map((rating) => (
              <div
                key={rating.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={rating.id}
                    checked={selectedRating === rating.id}
                    onCheckedChange={(checked) => {
                      setSelectedRating(checked ? rating.id : "");
                    }}
                  />
                  <label
                    htmlFor={rating.id}
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <Star className="size-4 text-muted-foreground fill-current" />
                    {rating.label}
                  </label>
                </div>
                <span className="text-sm text-muted-foreground">{rating.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
