"use client";

import { IBecomeHostPropertyFormData } from "@/data/interfaces";
import { CheckCircle2, ImagePlus, Loader2, Trash2, Upload, XCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

// ─── Provider config (Cloudinary unsigned upload) ───────────────────────────
// Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
// in your .env.local to activate real uploads.
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

async function uploadToCloudinary(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type UploadStatus = "idle" | "uploading" | "done" | "error";

interface FileItem {
  id: string;
  file: File;
  localUrl: string;   // blob URL for instant preview
  remoteUrl?: string; // Cloudinary URL once done
  progress: number;   // 0-100
  status: UploadStatus;
  error?: string;
}

const MAX_IMAGES = 5;
const SLOT_LABELS = ["Cover Photo", "Photo 2", "Photo 3", "Photo 4", "Photo 5"];

// ─── Props ───────────────────────────────────────────────────────────────────

interface PhotosStepProps {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<IBecomeHostPropertyFormData>>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const PhotosStep = ({ formData, setFormData }: PhotosStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Local upload queue — drives progress UI
  const [items, setItems] = useState<FileItem[]>(() =>
    // Restore any already-uploaded images from formData as "done" items
    (formData.images ?? []).map((url, i) => ({
      id: `restored-${i}`,
      file: new File([], ""),
      localUrl: url,
      remoteUrl: url,
      progress: 100,
      status: "done" as UploadStatus,
    }))
  );

  const occupied = items.length;
  const remaining = MAX_IMAGES - occupied;

  // Sync successful uploads back into formData
  const syncToForm = useCallback(
    (updated: FileItem[]) => {
      const urls = updated
        .filter((it) => it.status === "done" && it.remoteUrl)
        .map((it) => it.remoteUrl!);
      setFormData((prev) => ({ ...prev, images: urls }));
    },
    [setFormData]
  );

  // Upload a single file with simulated progress ticks while the real XHR runs
  const uploadOne = useCallback(
    async (item: FileItem) => {
      // Simulate progress while uploading
      let simulatedProgress = 0;
      const ticker = setInterval(() => {
        simulatedProgress = Math.min(simulatedProgress + Math.random() * 15, 85);
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, progress: Math.round(simulatedProgress) } : it
          )
        );
      }, 300);

      try {
        const remoteUrl = await uploadToCloudinary(item.file);
        clearInterval(ticker);
        setItems((prev) => {
          const updated = prev.map((it) =>
            it.id === item.id
              ? { ...it, progress: 100, status: "done" as UploadStatus, remoteUrl }
              : it
          );
          syncToForm(updated);
          return updated;
        });
      } catch (err) {
        clearInterval(ticker);
        const msg = err instanceof Error ? err.message : "Upload failed";
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status: "error" as UploadStatus, error: msg } : it
          )
        );
      }
    },
    [syncToForm]
  );

  // Add new files — instant preview + kick off parallel uploads
  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const accepted = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining);

      if (accepted.length === 0) return;

      const newItems: FileItem[] = accepted.map((f) => ({
        id: `${Date.now()}-${f.name}-${Math.random()}`,
        file: f,
        localUrl: URL.createObjectURL(f),
        progress: 0,
        status: CLOUD_NAME && UPLOAD_PRESET ? "uploading" : "done",
        // If no provider configured, use local blob URL as the "URL"
        remoteUrl: CLOUD_NAME && UPLOAD_PRESET ? undefined : URL.createObjectURL(f),
      }));

      setItems((prev) => {
        const combined = [...prev, ...newItems];
        // Immediately sync done ones (provider-less mode)
        syncToForm(combined);
        return combined;
      });

      // Fire parallel uploads only when provider is configured
      if (CLOUD_NAME && UPLOAD_PRESET) {
        newItems.forEach(uploadOne);
      }
    },
    [remaining, syncToForm, uploadOne]
  );

  const removeItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((it) => it.id !== id);
      URL.revokeObjectURL(prev.find((it) => it.id === id)?.localUrl ?? "");
      syncToForm(updated);
      return updated;
    });
  };

  const retryItem = (item: FileItem) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id ? { ...it, status: "uploading", progress: 0, error: undefined } : it
      )
    );
    uploadOne(item);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  // ── Destructure slots ──────────────────────────────────────────────────────
  const [s0, s1, s2, s3, s4] = items;

  return (
    <div className="w-full mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-8 w-full">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
          Add photos of your property
        </h2>
        <p className="text-muted-foreground text-base">
          Great photos attract more guests. Add up to{" "}
          <span className="font-medium text-foreground">{MAX_IMAGES} photos</span> — the first
          becomes your cover image.
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = ""; // reset so same file can be re-added after removal
        }}
      />

      {/* ── Property-detail-style grid preview ─────────────────────────── */}
      {occupied > 0 && (
        <div className="mb-6">
          <div
            className={`grid gap-2 w-full overflow-hidden rounded-xl
              ${occupied === 1
                ? "grid-cols-1 aspect-16/7"
                : "grid-cols-[2fr_1fr_1fr] grid-rows-2 aspect-3/1 max-h-[340px]"
              }`}

          >
            {/* Slot 0 — cover (spans 2 rows when grid layout) */}
            {s0 && (
              <div
                className={`relative min-h-0 overflow-hidden group ${
                  occupied > 1 ? "row-span-2 rounded-l-xl" : "rounded-xl"
                }`}
              >
                <Image
                  src={s0.localUrl}
                  alt="Cover photo"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority
                />
                <UploadOverlay item={s0} onRemove={() => removeItem(s0.id)} onRetry={() => retryItem(s0)} />
                <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
                  Cover
                </span>
              </div>
            )}

            {/* Slots 1–4 */}
            {[s1, s2, s3, s4].map((slot, i) => {
              if (!slot) return null;
              const si = i + 1;
              const isTopRight = i === 1;
              const isBottomRight = i === 3;
              return (
                <div
                  key={slot.id}
                  className={`relative min-h-0 overflow-hidden group ${
                    isTopRight ? "rounded-tr-xl" : isBottomRight ? "rounded-br-xl" : ""
                  }`}
                >
                  <Image
                    src={slot.localUrl}
                    alt={SLOT_LABELS[si]}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 20vw, 50vw"
                  />
                  <UploadOverlay item={slot} onRemove={() => removeItem(slot.id)} onRetry={() => retryItem(slot)} />
                </div>
              );
            })}
          </div>

          {/* Status summary */}
          <div className="mt-3 flex flex-wrap gap-2">
            {items.map((it) => (
              <StatusPill key={it.id} item={it} />
            ))}
          </div>
        </div>
      )}

      {/* ── Drop zone ──────────────────────────────────────────────────── */}
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
              {occupied === 0 ? "Drag & drop your photos here" : `Add ${remaining} more photo${remaining === 1 ? "" : "s"}`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or{" "}
              <span className="text-rose-600 font-medium underline underline-offset-2">
                browse files
              </span>
              {" "}— JPG, PNG, WEBP
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-500">
            <Upload className="size-3.5" />
            {occupied} / {MAX_IMAGES} photos added
          </div>
        </div>
      )}

      {/* Tip */}
      {occupied === 0 && (
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Tip: listings with bright, clear photos get up to 2× more bookings.
        </p>
      )}
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Hover overlay for each slot — shows progress bar, remove/retry buttons */
function UploadOverlay({
  item,
  onRemove,
  onRetry,
}: {
  item: FileItem;
  onRemove: () => void;
  onRetry: () => void;
}) {
  return (
    <>
      {/* Dim overlay + progress bar while uploading */}
      {item.status === "uploading" && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-6 text-white animate-spin" />
          <div className="w-3/4 h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
          <span className="text-white text-xs font-medium">{item.progress}%</span>
        </div>
      )}

      {/* Error state */}
      {item.status === "error" && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 px-3">
          <XCircle className="size-6 text-rose-400" />
          <p className="text-white text-xs text-center leading-tight">{item.error}</p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRetry(); }}
            className="text-xs font-semibold text-white underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Remove button (visible on hover for done items) */}
      {(item.status === "done" || item.status === "error") && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 right-2 size-7 flex items-center justify-center bg-black/60 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
          aria-label="Remove photo"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </>
  );
}

/** Small chip below the grid showing per-file name + status */
function StatusPill({ item }: { item: FileItem }) {
  const name = item.file.name || "Restored";
  const short = name.length > 18 ? name.slice(0, 16) + "…" : name;

  if (item.status === "done") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
        <CheckCircle2 className="size-3" />
        {short}
      </span>
    );
  }
  if (item.status === "uploading") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 bg-stone-100 border border-stone-200 rounded-full px-2.5 py-1">
        <Loader2 className="size-3 animate-spin" />
        {short} · {item.progress}%
      </span>
    );
  }
  if (item.status === "error") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-full px-2.5 py-1">
        <XCircle className="size-3" />
        {short} failed
      </span>
    );
  }
  return null;
}
