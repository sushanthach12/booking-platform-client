"use client";

/**
 * ImageUploader — shared, controlled, config-driven image upload component.
 *
 * Responsibilities:
 *  - File input + drag & drop
 *  - Dispatches uploadActions.startBulk to trigger the saga
 *  - Listens to Redux upload state for progress / error / status
 *  - Calls onChange(urls) whenever completedUrls changes
 *  - Renders the photo mosaic grid + preview modal
 *  - Fully controlled: value = current URLs, onChange = parent syncs its state
 *
 * Does NOT own which URLs belong to it — the parent does via value/onChange.
 * This means two ImageUploaders on the same page won't bleed into each other.
 */

import { ImagePreviewModal } from "@/components/shared/image-preview-modal";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { cn } from "@/lib/utils";
import { uploadActions } from "@/store/actions/upload.actions";
import { ImagePlus, Loader2, Trash2, Upload, XCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ImageUploaderProps {
  /** Current list of uploaded URLs (controlled) */
  value: string[];
  /** Called whenever the URL list changes (add or remove) */
  onChange: (urls: string[]) => void;
  /** Max number of images allowed. Default: 5 */
  maxImages?: number;
  /** Labels per slot, index-aligned. Default: ['Cover Photo', 'Photo 2', …] */
  slotLabels?: string[];
  /** Input accept string. Default: 'image/*' */
  accept?: string;
  /** Whether to allow multiple file selection. Default: true */
  multiple?: boolean;
  /** Shown in the drop zone hint. Default: 'JPG, PNG, WEBP' */
  formatHint?: string;
  /** Disables all interaction */
  disabled?: boolean;
  className?: string;
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_MAX = 5;

function buildDefaultLabels(max: number) {
  return Array.from({ length: max }, (_, i) =>
    i === 0 ? "Cover Photo" : `Photo ${i + 1}`,
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export const ImageUploader = ({
  value,
  onChange,
  maxImages = DEFAULT_MAX,
  slotLabels,
  accept = "image/*",
  multiple = true,
  formatHint = "JPG, PNG, WEBP",
  disabled = false,
  className,
}: ImageUploaderProps) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ url: string; label: string } | null>(
    null,
  );

  // Track the URL count at the moment startBulk was dispatched so we know
  // which newly arrived URLs belong to this uploader instance.
  const baseCountRef = useRef<number>(value.length);

  const labels = slotLabels ?? buildDefaultLabels(maxImages);
  const images = value.slice(0, maxImages);
  const occupied = images.length;
  const remaining = maxImages - occupied;

  const { completedUrls, totalCount, progress, status, error } = useAppSelector(
    (s) => s.upload,
  );

  // ── Sync new URLs from Redux → onChange ──────────────────────────────────
  // When the saga finishes uploading a file, completedUrls grows.
  // We take only the URLs added after baseCountRef (the ones this instance
  // triggered) and merge them into value via onChange.
  useEffect(() => {
    if (status !== "uploading" && status !== "done") return;

    const incoming = completedUrls.slice(baseCountRef.current);
    if (incoming.length === 0) return;

    const merged = [...value, ...incoming].slice(0, maxImages);
    if (merged.length !== value.length) {
      onChange(merged);
    }
  }, [completedUrls, status]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Aggregate progress (across current batch) ─────────────────────────────
  const aggregateProgress = useMemo(() => {
    if (status !== "uploading" || totalCount == null || totalCount === 0)
      return progress ?? 0;
    // const completed = completedUrls.length - baseCountRef.current;
    const completed = completedUrls.length;
    const currentFileProgress = (progress ?? 0) / 100;
    return ((completed + currentFileProgress) / totalCount) * 100;
  }, [status, totalCount, completedUrls.length, progress]);

  // ── File handling ─────────────────────────────────────────────────────────
  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files || disabled || remaining === 0) return;

      const accepted = Array.from(files)
        .filter((f) => {
          if (accept === "image/*") return f.type.startsWith("image/");
          return accept
            .split(",")
            .map((a) => a.trim())
            .includes(f.type);
        })
        .slice(0, remaining);

      if (accepted.length === 0) return;

      // Snapshot current count so the effect above knows which URLs are ours
      baseCountRef.current = completedUrls.length;

      dispatch(uploadActions.startBulk(accepted));

      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [disabled, remaining, accept, completedUrls.length, dispatch],
  );

  const removeItem = useCallback(
    (url: string) => {
      dispatch(uploadActions.removeImage(url));
      onChange(value.filter((u) => u !== url));
    },
    [dispatch, onChange, value],
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={cn("w-full flex flex-col", className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={disabled}
        onChange={(e) => addFiles(e.target.files)}
      />

      {/* Upload progress bar */}
      {status === "uploading" && (
        <div className="mb-4 p-4 bg-muted border border-border rounded-xl flex items-center gap-4">
          <Loader2 className="size-5 text-primary animate-spin shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-foreground">Uploading…</span>
              <span className="text-muted-foreground">
                {Math.round(aggregateProgress)}%
              </span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${aggregateProgress}%` }}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => dispatch(uploadActions.abort())}
            className="text-xs font-medium text-muted-foreground hover:text-destructive shrink-0"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-3 text-destructive text-sm">
          <XCircle className="size-5 shrink-0" />
          <p>Something went wrong. Please try again.</p>
        </div>
      )}

      {/* Photo mosaic grid */}
      {occupied > 0 && (
        <div className="mb-6">
          <div
            className={cn(
              "grid gap-2 w-full overflow-hidden rounded-xl bg-muted",
              occupied === 1 && "grid-cols-1 aspect-16/7",
              occupied === 2 && "grid-cols-2 aspect-16/7",
              occupied === 3 &&
                "grid-cols-[2fr_1fr] grid-rows-2 aspect-3/1 max-h-[340px]",
              occupied >= 4 &&
                "grid-cols-[2fr_1fr_1fr] grid-rows-2 aspect-3/1 max-h-[340px]",
            )}
          >
            {/* Cover / main image */}
            {images[0] && (
              <div
                role="button"
                tabIndex={0}
                onClick={() => openPreview(images[0], labels[0])}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  openPreview(images[0], labels[0])
                }
                className={cn(
                  "relative min-h-0 overflow-hidden group cursor-pointer",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  occupied > 1 ? "row-span-2 rounded-l-xl" : "rounded-xl",
                )}
              >
                <Image
                  src={images[0]}
                  alt={labels[0]}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority
                />
                <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
                  {labels[0]}
                </span>
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(images[0]);
                    }}
                    className="absolute top-2 right-2 size-8 bg-black/50 hover:bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Secondary images */}
            {images.slice(1, maxImages).map((url, i) => {
              const isLast = i === images.slice(1).length - 1;
              const isThirdInFour = occupied === 4 && i === 2;

              return (
                <div
                  key={`${url}-${i}`}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    openPreview(url, labels[i + 1] ?? `Photo ${i + 2}`)
                  }
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    openPreview(url, labels[i + 1] ?? `Photo ${i + 2}`)
                  }
                  className={cn(
                    "relative min-h-0 overflow-hidden group cursor-pointer bg-muted",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    occupied === 2 && "rounded-r-xl",
                    occupied === 3 && i === 0 && "rounded-tr-xl",
                    occupied === 3 && i === 1 && "rounded-br-xl",
                    occupied >= 4 && i === 0 && "rounded-tr-xl",
                    occupied >= 4 && isLast && i >= 1 && "rounded-br-xl",
                    isThirdInFour && "col-span-2",
                  )}
                >
                  <Image
                    src={url}
                    alt={labels[i + 1] ?? `Photo ${i + 2}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(min-width: 1024px) 20vw, 50vw"
                  />
                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(url);
                      }}
                      className="absolute top-2 right-2 size-8 bg-black/50 hover:bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drop zone — only shown when slots remain */}
      {remaining > 0 && !disabled && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border hover:border-primary/50 bg-muted/40 hover:bg-primary/5 rounded-xl p-10 cursor-pointer transition-all group"
        >
          <div className="size-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm group-hover:border-primary/40 transition-all">
            <ImagePlus className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
              {occupied === 0
                ? "Drag & drop your photos here"
                : `Add ${remaining} more photo${remaining === 1 ? "" : "s"}`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or{" "}
              <span className="text-primary font-medium underline underline-offset-2">
                browse files
              </span>{" "}
              — {formatHint}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-card border border-border rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Upload className="size-3.5" />
            {occupied} / {maxImages} photos added
          </div>
        </div>
      )}

      {/* Preview modal */}
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
