"use client";

import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Car,
  Droplets,
  Home,
  Tv,
  Utensils,
  Wind
} from "lucide-react";
import { useState } from "react";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultCount?: number;
}

const propertyTypes = [
  { id: "apartment", label: "Apartment", icon: Home },
  { id: "house", label: "House", icon: Home },
  { id: "condo", label: "Condo", icon: Home },
  { id: "villa", label: "Villa", icon: Home },
  { id: "studio", label: "Studio", icon: Home },
  { id: "loft", label: "Loft", icon: Home },
];

const amenities = [
  { id: "wifi", label: "WiFi", icon: Wind },
  { id: "kitchen", label: "Kitchen", icon: Utensils },
  { id: "parking", label: "Parking", icon: Car },
  { id: "air_conditioning", label: "Air Conditioning", icon: Wind },
  { id: "heating", label: "Heating", icon: Wind },
  { id: "washer", label: "Washer", icon: Droplets },
  { id: "tv", label: "TV", icon: Tv },
];

export function FilterDialog({
  open,
  onOpenChange,
  resultCount = 0,
}: FilterDialogProps) {
  const [priceRange, setPriceRange] = useState([50, 500]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-3xl max-h-[80vh] flex flex-col"
    >
      <Modal.Header>
        Filters
      </Modal.Header>
      <Modal.Body className="flex-1 overflow-y-auto py-4">
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
                  <div
                    key={type.id}
                    className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer"
                  >
                    <Checkbox id={type.id} size="md" />
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
                  <div
                    key={amenity.id}
                    className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer"
                  >
                    <Checkbox id={amenity.id} size="md" />
                    <label
                      htmlFor={amenity.id}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <Icon className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {amenity.label}
                      </span>
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
              <Button variant="outline" size="icon">
                -
              </Button>
              <span className="font-medium">1 guest</span>
              <Button variant="outline" size="icon">
                +
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Clear all
        </Button>
        <Button variant="default" onClick={() => onOpenChange(false)}>Show results</Button>
      </Modal.Footer>
    </Modal>
  );
}
