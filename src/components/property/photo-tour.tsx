"use client";

import { ChevronLeft, Share, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PhotoTourProps {
  propertyId: string;
  images: string[];
  title: string;
}

export default function PhotoTour({
  propertyId,
  images,
  title,
}: PhotoTourProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Custom Header */}
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white z-10">
        <Link
          href={`/properties/${propertyId}`}
          className="p-2 hover:bg-stone-100 rounded-full transition-colors"
        >
          <ChevronLeft className="size-6 text-stone-900" />
        </Link>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm font-semibold underline hover:bg-stone-100 px-3 py-2 rounded-lg transition-all">
            <Share className="size-4" />
            Share
          </button>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="flex items-center gap-2 text-sm font-semibold underline hover:bg-stone-100 px-3 py-2 rounded-lg transition-all"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                isFavorited ? "fill-rose-500 text-rose-500" : "text-stone-900"
              )}
            />
            {isFavorited ? "Saved" : "Save"}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pb-20">
        <h1 className="text-3xl font-bold text-stone-900 mb-8 font-display">
          Photo tour
        </h1>

        {/* Thumbnails Row */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {images.map((url, index) => (
            <button
              key={`${url}-${index}`}
              onClick={() => setCurrentIndex(index)}
              className="flex flex-col gap-2 shrink-0 group focus:outline-none"
            >
              <div
                className={cn(
                  "relative w-32 aspect-video rounded-lg overflow-hidden ring-2 ring-transparent transition-all",
                  currentIndex === index
                    ? "ring-stone-900 opacity-100"
                    : "opacity-60 group-hover:opacity-100"
                )}
              >
                <Image
                  src={url}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <span
                className={cn(
                  "text-xs font-semibold text-stone-700",
                  currentIndex === index ? "text-stone-900" : "text-stone-500"
                )}
              >
                {index === 0 ? "Cover" : `Photo ${index + 1}`}
              </span>
            </button>
          ))}
        </div>

        {/* Large Preview */}
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-stone-900">
              {currentIndex === 0 ? "Cover photo" : `Photo ${currentIndex + 1}`}
            </h2>
            <p className="text-sm text-stone-500">
              {currentIndex === 0
                ? "This is the main photo displayed for this property."
                : `A detailed view of the property.`}
            </p>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-stone-100 shadow-xl border border-stone-200">
            <Image
              key={images[currentIndex]}
              src={images[currentIndex]}
              alt={`${title} - Full view ${currentIndex + 1}`}
              fill
              className="object-cover animate-in fade-in duration-500"
              sizes="(min-width: 1280px) 1280px, 100vw"
              priority
            />
          </div>
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
