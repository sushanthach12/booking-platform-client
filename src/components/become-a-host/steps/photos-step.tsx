"use client";

import { ImagePreviewModal } from "@/components/shared/image-preview-modal";
import { Button } from "@/components/ui/button";
import { IBecomeHostPropertyFormData } from "@/data/interfaces";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { cn } from "@/lib/utils";
import { uploadActions } from "@/store/actions/upload.actions";
import { ImagePlus, Loader2, Trash2, Upload, XCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

const MAX_IMAGES = 5;
const SLOT_LABELS = ["Cover Photo", "Photo 2", "Photo 3", "Photo 4", "Photo 5"];

interface PhotosStepProps {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<IBecomeHostPropertyFormData>
  >;
}

// formData/setFormData kept for API consistency; images come from Redux (completedUrls)
export const PhotosStep = ({ formData, setFormData }: PhotosStepProps) => {
  void formData;
  void setFormData;
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ url: string; label: string } | null>(
    null,
  );

  const { completedUrls, totalCount, progress, status, error } = useAppSelector(
    (state) => state.upload,
  );

  const images = completedUrls.slice(0, MAX_IMAGES);
  const occupied = images.length;
  const remaining = MAX_IMAGES - occupied;

  const aggregateProgress = useMemo(() => {
    if (status !== "uploading" || totalCount == null || totalCount === 0)
      return progress ?? 0;
    const completed = completedUrls.length;
    const currentFileProgress = (progress ?? 0) / 100;
    return ((completed + currentFileProgress) / totalCount) * 100;
  }, [status, totalCount, completedUrls.length, progress]);

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const accepted = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining);
      if (accepted.length === 0) return;
      dispatch(uploadActions.startBulk(accepted));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [remaining, dispatch],
  );

  const removeItem = useCallback(
    (url: string) => {
      dispatch(uploadActions.removeImage(url));
    },
    [dispatch],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const openPreview = useCallback((url: string, label: string) => {
    setPreview({ url, label });
  }, []);

  return (
    <div className="w-full mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 w-full">
        <h2 className="text-base md:text-xl lg:text-2xl 3xl:text-3xl font-bold tracking-tight text-foreground mb-2">
          Add photos of your property
        </h2>
        <p className="text-muted-foreground text-sm md:text-md lg:text-md 3xl:text-base">
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

      {status === "uploading" && (
        <div className="mb-4 p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-4">
          <Loader2 className="size-5 text-rose-500 animate-spin" />
          <div className="flex-1">
            <div className="flex justify-between text-xs font-medium mb-1">
              <span>Uploading...</span>
              <span>{Math.round(aggregateProgress)}%</span>
            </div>
            <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-300"
                style={{ width: `${aggregateProgress}%` }}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => dispatch(uploadActions.abort())}
            className="text-xs font-medium text-stone-500 hover:text-rose-600 shrink-0"
          >
            Cancel
          </Button>
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
            className={cn(
              "grid gap-2 w-full overflow-hidden rounded-xl bg-stone-100",
              occupied === 1 && "grid-cols-1 aspect-16/7",
              occupied === 2 && "grid-cols-2 aspect-16/7",
              occupied === 3 &&
                "grid-cols-[2fr_1fr] grid-rows-2 aspect-3/1 max-h-[340px]",
              occupied >= 4 &&
                "grid-cols-[2fr_1fr_1fr] grid-rows-2 aspect-3/1 max-h-[340px]",
            )}
          >
            {/* Main Image */}
            {images[0] && (
              <div
                role="button"
                tabIndex={0}
                onClick={() => openPreview(images[0], "Cover")}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  openPreview(images[0], "Cover")
                }
                className={cn(
                  "relative min-h-0 overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2",
                  occupied > 1 && "row-span-2 rounded-l-xl",
                  occupied === 1 && "rounded-xl",
                )}
              >
                <Image
                  src={images[0]}
                  alt="Cover photo"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority
                />
                <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
                  Cover
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(images[0]);
                  }}
                  className="absolute top-2 right-2 size-8 bg-black/50 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}

            {/* Other Images */}
            {images.slice(1, 5).map((url, i) => {
              const isLast = i === images.slice(1, 5).length - 1;
              const isThirdInFour = occupied === 4 && i === 2;

              return (
                <div
                  key={`${url}-${i}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => openPreview(url, SLOT_LABELS[i + 1])}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    openPreview(url, SLOT_LABELS[i + 1])
                  }
                  className={cn(
                    "relative min-h-0 overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 bg-stone-200",
                    occupied === 2 && "rounded-r-xl",
                    occupied === 3 && i === 0 && "rounded-tr-xl",
                    occupied === 3 && i === 1 && "rounded-br-xl",
                    occupied >= 4 && i === 1 && "rounded-tr-xl",
                    occupied >= 4 && isLast && i >= 1 && "rounded-br-xl",
                    isThirdInFour && "col-span-2",
                  )}
                >
                  <Image
                    src={url}
                    alt={SLOT_LABELS[i + 1]}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(min-width: 1024px) 20vw, 50vw"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(url);
                    }}
                    className="absolute top-2 right-2 size-8 bg-black/50 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="size-4" />
                  </Button>
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

      <ImagePreviewModal
        open={!!preview}
        onOpenChange={(open) => !open && setPreview(null)}
        src={images}
        initialIndex={preview ? images.indexOf(preview.url) : 0}
        alt={preview ? `${preview.label} preview` : "Photo preview"}
        title={preview?.label}
      />
    </div>
  );
};
