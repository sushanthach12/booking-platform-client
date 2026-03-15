"use client";

import { DefaultPropertyIcon } from "@/components/shared/icons/default-property-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ImageGalleryProps {
  propertyId: string;
  images: string[];
  title: string;
  className?: string;
}

export function ImageGallery({
  propertyId,
  images,
  title,
  className,
}: ImageGalleryProps) {
  const occupied = images.length;
  const hasImages = occupied > 0;
  const photosHref = `/properties/${propertyId}/photos`;

  if (!hasImages) {
    return (
      <div
        className={cn(
          "relative aspect-3/1 max-h-[340px] w-full overflow-hidden rounded-xl bg-stone-100 flex items-center justify-center border border-stone-200",
          className,
        )}
      >
        <DefaultPropertyIcon size="xl" />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Link
        href={photosHref}
        className={cn(
          "grid gap-2 w-full overflow-hidden rounded-xl bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2",
          occupied === 1 && "grid-cols-1 aspect-16/7",
          occupied === 2 && "grid-cols-2 aspect-16/7",
          occupied === 3 &&
            "grid-cols-[2fr_1fr] grid-rows-2 aspect-3/1 max-h-[340px]",
          occupied >= 4 &&
            "grid-cols-[2fr_1fr_1fr] grid-rows-2 aspect-3/1 max-h-[340px]",
        )}
      >
        {/* Large image - left, spans 2 rows */}
        <div
          className={cn(
            "relative min-h-0 overflow-hidden group",
            occupied > 1 ? "row-span-2 rounded-l-xl" : "rounded-xl",
          )}
        >
          <Image
            src={images[0]}
            alt={`${title} - Cover`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
          <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none border border-white/20">
            Cover
          </span>
        </div>

        {/* Subsequent images (up to 4 more) */}
        {images.slice(1, 5).map((url, i) => {
          const isTopRight = i === 1 || (occupied === 3 && i === 0);
          const isBottomRight =
            (occupied === 3 && i === 1) ||
            (occupied >= 5 && i === 3) ||
            (occupied === 4 && i === 2);
          const isWideBottom = occupied === 4 && i === 2;

          return (
            <div
              key={`${url}-${i}`}
              className={cn(
                "relative min-h-0 overflow-hidden group bg-stone-200",
                isTopRight ? "rounded-tr-xl" : "",
                isBottomRight ? "rounded-br-xl" : "",
                isWideBottom ? "col-span-2" : "",
              )}
            >
              <Image
                src={url}
                alt={`${title} - Photo ${i + 2}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 20vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </div>
          );
        })}
      </Link>

      {images.length > 5 && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm border-stone-200 hover:bg-white gap-2 font-semibold"
          asChild
        >
          <Link href={photosHref}>
            <ImageIcon className="size-4" />
            Show all {images.length} photos
          </Link>
        </Button>
      )}
    </div>
  );
}
