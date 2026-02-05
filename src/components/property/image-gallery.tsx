"use client";

import { Button } from "@/components/ui/button";
import { DefaultPropertyIcon } from "@/components/ui/default-property-icon";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function ImageGallery({ images, title, className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[currentIndex] : null;

  const goToPrevious = () => {
    if (!hasImages) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (!hasImages) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const selectImage = (index: number) => {
    if (!hasImages) return;
    setCurrentIndex(index);
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Main Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
        {hasImages ? (
          <Image
            src={currentImage!}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <DefaultPropertyIcon size="xl" />
          </div>
        )}

        {/* Navigation arrows */}
        {hasImages && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasImages && images.length > 1 && (
        <div className="mt-4 py-2 flex gap-2 overflow-x-auto">
          {images.map((image: string, index: number) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={cn(
                "relative aspect-[4/3] h-20 overflow-hidden rounded-lg border-2 transition-all",
                index === currentIndex
                  ? "border-foreground scale-105"
                  : "border-border hover:border-muted-foreground"
              )}
            >
              <Image
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
          {images.length > 4 && (
            <div className="flex aspect-[4/3] h-20 items-center justify-center rounded-lg border border-border bg-muted text-sm text-muted-foreground">
              +{images.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
