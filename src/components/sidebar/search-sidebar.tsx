"use client";

import { useState } from "react";
import { X, Filter, Home, Car, Wind, Droplets, Tv, Utensils, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

interface SearchSidebarProps {
  className?: string;
}

const propertyTypes = [
  { id: 'apartment', label: 'Apartments', count: 245 },
  { id: 'house', label: 'Houses', count: 189 },
  { id: 'condo', label: 'Condos', count: 67 },
  { id: 'villa', label: 'Villas', count: 34 },
  { id: 'studio', label: 'Studios', count: 89 },
  { id: 'loft', label: 'Lofts', count: 23 },
];

const amenities = [
  { id: 'wifi', label: 'WiFi', icon: Wind },
  { id: 'kitchen', label: 'Kitchen', icon: Utensils },
  { id: 'parking', label: 'Free parking', icon: Car },
  { id: 'air_conditioning', label: 'Air conditioning', icon: Wind },
  { id: 'heating', label: 'Heating', icon: Wind },
  { id: 'washer', label: 'Washer', icon: Droplets },
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'pool', label: 'Pool', icon: Droplets },
];

const ratings = [
  { id: '4.5+', label: '4.5+', count: 123 },
  { id: '4.0+', label: '4.0+', count: 234 },
  { id: '3.5+', label: '3.5+', count: 345 },
  { id: '3.0+', label: '3.0+', count: 456 },
];

export function SearchSidebar({ className }: SearchSidebarProps) {
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>("");

  return (
    <aside className={`w-80 bg-white border-r border-gray-200 overflow-y-auto ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="sm" className="text-sm">
            Clear all
          </Button>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="font-medium mb-4">Price range</h3>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Property Type */}
        <div className="mb-8">
          <h3 className="font-medium mb-4">Property type</h3>
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
                        setSelectedTypes(selectedTypes.filter(id => id !== type.id));
                      }
                    }}
                  />
                  <label
                    htmlFor={type.id}
                    className="text-sm font-medium cursor-pointer flex items-center gap-2"
                  >
                    <Home className="size-4 text-gray-500" />
                    {type.label}
                  </label>
                </div>
                <span className="text-sm text-gray-500">{type.count}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Amenities */}
        <div className="mb-8">
          <h3 className="font-medium mb-4">Amenities</h3>
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
                        setSelectedAmenities([...selectedAmenities, amenity.id]);
                      } else {
                        setSelectedAmenities(selectedAmenities.filter(id => id !== amenity.id));
                      }
                    }}
                  />
                  <label
                    htmlFor={amenity.id}
                    className="text-sm font-medium cursor-pointer flex items-center gap-2"
                  >
                    <Icon className="size-4 text-gray-500" />
                    {amenity.label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Rating */}
        <div className="mb-8">
          <h3 className="font-medium mb-4">Rating</h3>
          <div className="space-y-3">
            {ratings.map((rating) => (
              <div key={rating.id} className="flex items-center justify-between">
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
                    className="text-sm font-medium cursor-pointer flex items-center gap-2"
                  >
                    <Star className="size-4 text-gray-500 fill-current" />
                    {rating.label}
                  </label>
                </div>
                <span className="text-sm text-gray-500">{rating.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="sticky bottom-0 bg-white pt-4 border-t">
          <Button className="w-full" size="lg">
            Show results
          </Button>
        </div>
      </div>
    </aside>
  );
}
