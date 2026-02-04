"use client";

import { useState } from "react";
import { Filter, X, Home, Car, Wind, Droplets, Tv, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  resultCount?: number;
}

const propertyTypes = [
  { id: 'apartment', label: 'Apartment', icon: Home },
  { id: 'house', label: 'House', icon: Home },
  { id: 'condo', label: 'Condo', icon: Home },
  { id: 'villa', label: 'Villa', icon: Home },
  { id: 'studio', label: 'Studio', icon: Home },
  { id: 'loft', label: 'Loft', icon: Home },
];

const amenities = [
  { id: 'wifi', label: 'WiFi', icon: Wind },
  { id: 'kitchen', label: 'Kitchen', icon: Utensils },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'air_conditioning', label: 'Air Conditioning', icon: Wind },
  { id: 'heating', label: 'Heating', icon: Wind },
  { id: 'washer', label: 'Washer', icon: Droplets },
  { id: 'tv', label: 'TV', icon: Tv },
];

export function FilterDialog({ open, onClose, resultCount = 0 }: FilterDialogProps) {
  const [priceRange, setPriceRange] = useState([50, 500]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        {/* Header inside content */}
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Filter className="size-5" />
              Filters
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="size-6" />
            </Button>
          </div>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-3">Price range</h3>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
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

            {/* Property Type */}
            <div>
              <h3 className="font-medium mb-3">Property type</h3>
              <div className="grid grid-cols-3 gap-3">
                {propertyTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer">
                      <Checkbox id={type.id} size="md"/>
                      <label
                        htmlFor={type.id}
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <Icon className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-medium mb-3">Amenities</h3>
              <div className="grid grid-cols-3 gap-3">
                {amenities.map((amenity) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={amenity.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer">
                      <Checkbox id={amenity.id} size="md"   />
                      <label
                        htmlFor={amenity.id}
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <Icon className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{amenity.label}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guest Capacity */}
            <div>
              <h3 className="font-medium mb-3">Guests</h3>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">-</Button>
                <span className="font-medium">1 guest</span>
                <Button variant="outline" size="icon">+</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <DialogFooter className="flex-shrink-0 flex items-center justify-between pt-4 border-t bg-background">
          <Button variant="ghost" onClick={onClose}>
            Clear all
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {resultCount > 0 && `${resultCount} results`}
            </span>
            <Button onClick={onClose}>
              Show results
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
