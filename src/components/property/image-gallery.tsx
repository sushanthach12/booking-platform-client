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

  /** Wireframe layout: 1 large image left, 4 small in 2x2 right */
  const useGridLayout = hasImages && images.length >= 5;
  const displayImages = useGridLayout ? images.slice(0, 5) : images;
  const [img0, img1, img2, img3, img4] = displayImages;

  if (useGridLayout) {
    return (
      <div className={cn("relative", className)}>
        <div className="grid grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-2 aspect-[3/1] max-h-[min(42vh,340px)] w-full overflow-hidden rounded-xl">
          {/* Large image - left, spans 2 rows */}
          <button
            type="button"
            onClick={() => selectImage(0)}
            className="relative row-span-2 min-h-0 overflow-hidden rounded-l-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Image
              src={img0!}
              alt={`${title} - Image 1`}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </button>
          {/* Top-right pair */}
          <button
            type="button"
            onClick={() => selectImage(1)}
            className="relative min-h-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Image
              src={img1!}
              alt={`${title} - Image 2`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 20vw, 50vw"
            />
          </button>
          <button
            type="button"
            onClick={() => selectImage(2)}
            className="relative min-h-0 overflow-hidden rounded-tr-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Image
              src={img2!}
              alt={`${title} - Image 3`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 20vw, 50vw"
            />
          </button>
          {/* Bottom-right pair */}
          <button
            type="button"
            onClick={() => selectImage(3)}
            className="relative min-h-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Image
              src={img3!}
              alt={`${title} - Image 4`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 20vw, 50vw"
            />
          </button>
          <button
            type="button"
            onClick={() => selectImage(4)}
            className="relative min-h-0 overflow-hidden rounded-br-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Image
              src={img4!}
              alt={`${title} - Image 5`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 20vw, 50vw"
            />
          </button>
        </div>
        {images.length > 5 && (
          <Button
            variant="secondary"
            className="absolute bottom-4 right-4 rounded-md shadow-md"
            onClick={() => selectImage(0)}
          >
            <ImageIcon className="mr-2 size-4" />
            Show all {images.length} photos
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative group", className)}>
      {/* Single main image (when fewer than 5 images) */}
      <div className="relative aspect-[3/1] max-h-[min(42vh,340px)] w-full overflow-hidden rounded-xl">
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

        {hasImages && images.length > 1 && (
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

      {hasImages && images.length > 1 && images.length < 5 && (
        <div className="mt-4 py-2 flex gap-2 overflow-x-auto">
          {images.map((image: string, index: number) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={cn(
                "relative aspect-[4/3] h-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                index === currentIndex
                  ? "border-foreground scale-105"
                  : "border-border hover:border-muted-foreground",
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
        </div>
      )}
    </div>
  );
}
