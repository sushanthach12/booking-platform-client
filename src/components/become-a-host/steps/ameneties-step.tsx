import { Button } from "@/components/ui/button";
import { AMENITIES, IBecomeHostPropertyFormData } from "@/data/interfaces";
import { Check } from "lucide-react";

interface AmenitiesStepProps {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<IBecomeHostPropertyFormData>
  >;
}

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
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
          What amenities do you offer?
        </h2>
        <p className="text-muted-foreground text-base">
          You can add more amenities after you publish your listing.
        </p>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {AMENITIES.map((amenity) => {
            const isSelected = formData.amenities.includes(amenity.name);
            return (
              <Button
                key={amenity.name}
                type="button"
                onClick={() => toggleAmenity(amenity.name)}
                className={`relative flex flex-col items-start gap-4 p-5 md:p-6 text-left rounded-2xl border-2 transition-all duration-200 outline-none focus-visible:ring-0 focus-visible:border-rose-500 ${
                  isSelected
                    ? "border-foreground bg-stone-50"
                    : "border-stone-200 bg-white hover:border-rose-500 hover:bg-stone-50"
                }`}
              >
                {/* Custom Checkbox visual indicator */}
                <div
                  className={`absolute top-4 right-4 size-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-foreground border-foreground text-background"
                      : "border-stone-300 bg-transparent"
                  }`}
                >
                  {isSelected && <Check className="size-3" strokeWidth={3} />}
                </div>

                <div className="space-y-1 mt-4 md:mt-6">
                  <span className="font-semibold text-foreground text-base">
                    {amenity.name}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
