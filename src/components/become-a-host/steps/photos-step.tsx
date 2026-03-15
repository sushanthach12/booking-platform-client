"use client";

import { IBecomeHostPropertyFormData } from "@/data/interfaces";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { uploadActions } from "@/store/actions/upload.actions";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const MAX_IMAGES = 5;
const SLOT_LABELS = ["Cover Photo", "Photo 2", "Photo 3", "Photo 4", "Photo 5"];

interface PhotosStepProps {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<IBecomeHostPropertyFormData>
  >;
}

export const PhotosStep = ({ formData, setFormData }: PhotosStepProps) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Saga-based state
  const { progress, status, key, error } = useAppSelector(
    (state) => state.upload,
  );
  const [lastProcessedKey, setLastProcessedKey] = useState<string | null>(null);

  // Sync finished upload from saga state to formData
  useEffect(() => {
    if (status === "done" && key && key !== lastProcessedKey) {
      setFormData((prev) => {
        if (prev.images.includes(key)) return prev;
        return { ...prev, images: [...prev.images, key] };
      });
      setLastProcessedKey(key);
    }
  }, [status, key, lastProcessedKey, setFormData]);

  const occupied = formData.images.length;
  const remaining = MAX_IMAGES - occupied;

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const accepted = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining);

      // Dispatch starts for each file.
      // Note: With the provided saga/slice, these will be processed sequentially.
      accepted.forEach((file) => {
        dispatch(uploadActions.start(file));
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [remaining, dispatch],
  );

  const removeItem = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 w-full">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
          Add photos of your property
        </h2>
        <p className="text-muted-foreground text-base">
          Great photos attract more guests. Add up to{" "}
          <span className="font-medium text-foreground">
            {MAX_IMAGES} photos
          </span>{" "}
          — the first becomes your cover image.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {/* Uploading Status Header */}
      {status === "uploading" && (
        <div className="mb-4 p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-4">
          <Loader2 className="size-5 text-rose-500 animate-spin" />
          <div className="flex-1">
            <div className="flex justify-between text-xs font-medium mb-1">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => dispatch(uploadActions.abort())}
            className="text-xs font-medium text-stone-500 hover:text-rose-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
          <XCircle className="size-5 shrink-0" />
          <p>Something went wrong! Please try again.</p>
        </div>
      )}

      {occupied > 0 && (
        <div className="mb-6">
          <div
            className={`grid gap-2 w-full overflow-hidden rounded-xl ${
              occupied === 1
                ? "grid-cols-1 aspect-16/7"
                : "grid-cols-[2fr_1fr_1fr] grid-rows-2 aspect-3/1 max-h-[340px]"
            }`}
          >
            {formData.images[0] && (
              <div
                className={`relative min-h-0 overflow-hidden group ${occupied > 1 ? "row-span-2 rounded-l-xl" : "rounded-xl"}`}
              >
                <Image
                  src={formData.images[0]}
                  alt="Cover photo"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority
                />
                <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
                  Cover
                </span>
                <button
                  onClick={() => removeItem(formData.images[0])}
                  className="absolute top-2 right-2 size-8 bg-black/50 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            )}

            {formData.images.slice(1, 5).map((url, i) => {
              const isTopRight = i === 0;
              const isBottomRight =
                i === 3 || (occupied === i + 2 && (i === 1 || i === 2)); // Dynamic rounded corners

              return (
                <div
                  key={url}
                  className={`relative min-h-0 overflow-hidden group ${
                    isTopRight ? "rounded-tr-xl" : ""
                  } ${url === formData.images[occupied - 1] && occupied > 2 ? "rounded-br-xl" : ""}`}
                >
                  <Image
                    src={url}
                    alt={SLOT_LABELS[i + 1]}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 20vw, 50vw"
                  />
                  <button
                    onClick={() => removeItem(url)}
                    className="absolute top-2 right-2 size-8 bg-black/50 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {remaining > 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-stone-300 hover:border-rose-400 bg-stone-50 hover:bg-rose-50/30 rounded-xl p-10 cursor-pointer transition-all group"
        >
          <div className="size-14 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm group-hover:border-rose-300 transition-all">
            <ImagePlus className="size-6 text-stone-400 group-hover:text-rose-500 transition-colors" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-stone-700 text-base group-hover:text-rose-700 transition-colors">
              {occupied === 0
                ? "Drag & drop your photos here"
                : `Add ${remaining} more photo${remaining === 1 ? "" : "s"}`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or{" "}
              <span className="text-rose-600 font-medium underline underline-offset-2">
                browse files
              </span>{" "}
              — JPG, PNG, WEBP
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-500">
            <Upload className="size-3.5" />
            {occupied} / {MAX_IMAGES} photos added
          </div>
        </div>
      )}
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
