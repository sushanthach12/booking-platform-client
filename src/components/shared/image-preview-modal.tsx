import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Download, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface ImagePreviewModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when open state should change (e.g. close on overlay click) */
  onOpenChange: (open: boolean) => void;
  /** Single image URL or array of URLs to display. */
  src: string | string[] | null;
  /** Alt text for the image */
  alt?: string;
  /** Title shown in the header (e.g. "Cover" or "Photo 2") */
  title?: string;
  /** Optional custom class for the modal content wrapper */
  className?: string;
  /** Starting index if src is an array */
  initialIndex?: number;
  /** Optional additional action buttons in the footer (e.g. "Remove"). Rendered before the Close button. */
  footerActions?: React.ReactNode;
}

export function ImagePreviewModal({
  open,
  onOpenChange,
  src,
  alt = "Preview",
  title,
  className,
  initialIndex = 0,
  footerActions,
}: ImagePreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, open]);

  const images = Array.isArray(src) ? src : src ? [src] : [];
  const currentSrc = images[currentIndex] ?? null;
  const totalImages = images.length;
  const hasMultiple = totalImages > 1;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleClose = () => onOpenChange(false);

  useEffect(() => {
    if (!open || !hasMultiple) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, hasMultiple, totalImages]);

  const handleDownload = async () => {
    if (!currentSrc) return;
    try {
      const response = await fetch(currentSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `photo-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const currentTitle =
    totalImages > 1
      ? `${title || "Photo"} (${currentIndex + 1} / ${totalImages})`
      : title || "Photo Preview";

  const isCover =
    currentIndex === 0 &&
    (title?.toLowerCase().includes("cover") || totalImages > 1);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className={cn("max-w-5xl w-[95vw] lg:w-full", className)}
      showCloseButton={false}
    >
      <Modal.Header className="flex items-center justify-between border-b pb-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-stone-100 rounded-lg">
              <ImageIcon className="size-4 text-stone-600" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">{currentTitle}</h2>
            {isCover && (
              <span className="ml-2 inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600 ring-1 ring-inset ring-rose-500/20">
                Cover Photo
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-normal">
            {isCover
              ? "This is the first photo guests will see"
              : "Previewing your property photo"}
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="p-0 bg-stone-50/50 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[500px] relative">
        {hasMultiple && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="absolute left-4 z-10 size-12 rounded-full bg-white/80 hover:bg-white shadow-md border border-stone-200"
            >
              <ChevronLeft className="size-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-4 z-10 size-12 rounded-full bg-white/80 hover:bg-white shadow-md border border-stone-200"
            >
              <ChevronRight className="size-6" />
            </Button>
          </>
        )}

        {currentSrc ? (
          <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center p-4 sm:p-12 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative w-full aspect-video max-w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-white">
              <Image
                key={currentSrc}
                src={currentSrc}
                alt={alt}
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 80vw, 100vw"
                priority={open}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <ImageIcon className="size-12 opacity-20" />
            <p>No image to preview</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-t px-6 py-4">
        {footerActions}
        <div className="flex-1" />
        <Button
          variant="ghost"
          size={"lg"}
          onClick={handleDownload}
          className="text-stone-600 hover:text-stone-900 gap-2"
        >
          <Download className="size-4" />
          Download
        </Button>
        <Button
          variant="default"
          size={"lg"}
          onClick={handleClose}
          className="bg-rose-600 hover:bg-rose-700 text-white min-w-[100px]"
        >
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
