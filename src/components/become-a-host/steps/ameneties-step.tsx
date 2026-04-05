import { Card } from "@/components/ui/card";
import { AMENITIES, IBecomeHostPropertyFormData } from "@/domain/entities";
import { cn } from "@/lib/utils";
import {
  Car,
  Flame,
  Info,
  Shirt,
  Tv,
  Utensils,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";

interface AmenitiesStepProps {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<IBecomeHostPropertyFormData>
  >;
}

const getAmenityIcon = (name: string, className?: string) => {
  switch (name) {
    case "WiFi":
      return <Wifi className={className} strokeWidth={1.5} />;
    case "Kitchen":
      return <Utensils className={className} strokeWidth={1.5} />;
    case "Parking":
      return <Car className={className} strokeWidth={1.5} />;
    case "Air Conditioning":
      return <Wind className={className} strokeWidth={1.5} />;
    case "Heating":
      return <Flame className={className} strokeWidth={1.5} />;
    case "Washer":
      return <Waves className={className} strokeWidth={1.5} />;
    case "Dryer":
      return <Shirt className={className} strokeWidth={1.5} />;
    case "TV":
      return <Tv className={className} strokeWidth={1.5} />;
    default:
      return <Info className={className} strokeWidth={1.5} />;
  }
};

export const AmenitiesStep = ({
  formData,
  setFormData,
}: AmenitiesStepProps) => {
  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  return (
    <div className="w-full mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 w-full">
        <h2 className="text-base md:text-xl lg:text-2xl 3xl:text-3xl font-bold tracking-tight text-foreground mb-2">
          What amenities do you offer?
        </h2>
        <p className="text-muted-foreground text-sm md:text-md lg:text-md 3xl:text-base">
          You can add more amenities after you publish your listing.
        </p>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {AMENITIES.map((amenity) => {
            const isSelected = formData.amenities.includes(amenity.name);
            return (
              <Card
                key={amenity.name}
                onClick={() => toggleAmenity(amenity.name)}
                className={cn(
                  "relative flex flex-col items-start gap-4 p-5 md:p-6 text-left rounded-2xl border-2 transition-all duration-200 cursor-pointer outline-none focus-visible:ring-0 focus-visible:border-rose-500 shadow-none",
                  isSelected
                    ? "border-rose-500 border-2 bg-stone-50"
                    : "border-stone-200 bg-white hover:border-rose-500 hover:bg-stone-50",
                )}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleAmenity(amenity.name);
                  }
                }}
              >
                {getAmenityIcon(amenity.name, "size-8 text-foreground mb-2")}

                <div className="space-y-1 mt-0">
                  <span className="font-semibold text-foreground text-base">
                    {amenity.name}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
