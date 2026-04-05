"use client";

import { ImageUploader } from "@/components/shared";
import { IBecomeHostPropertyFormData } from "@/domain/entities";

interface PhotosStepProps {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<IBecomeHostPropertyFormData>
  >;
}

export const PhotosStep = ({ formData, setFormData }: PhotosStepProps) => {
  return (
    <div className="w-full mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 w-full">
        <h2 className="text-base md:text-xl lg:text-2xl 3xl:text-3xl font-bold tracking-tight text-foreground mb-2">
          Add photos of your property
        </h2>
        <p className="text-muted-foreground text-sm md:text-md lg:text-md 3xl:text-base">
          Great photos attract more guests. Add up to{" "}
          <span className="font-medium text-foreground">5 photos</span> — the
          first becomes your cover image.
        </p>
      </div>

      <ImageUploader
        value={formData.images ?? []}
        onChange={(urls: string[]) =>
          setFormData((prev) => ({ ...prev, images: urls }))
        }
        maxImages={5}
        accept="image/*"
        formatHint="JPG, PNG, WEBP"
      />

      <div className="mt-2 flex items-start gap-3 px-4 py-3 text-sm text-muted-foreground">
        <p>
          <span className="font-semibold">Tip:</span> Your first photo will be
          the cover and thumbnail. High-quality, well-lit photos get
          significantly more bookings.
        </p>
      </div>
    </div>
  );
};
