"use client";

import {
  AmenitiesStep,
  PhotosStep,
  PricingStep,
  PropertyDetailsStep,
} from "@/components/become-a-host/steps";
import { PathBreadcrumb } from "@/components/shared/path-breadcrumb";
import { MapPicker, type MapLocation } from "@/components/map/map-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getHostPropertyUseCase } from "@/domain/di";
import type { IBecomeHostPropertyFormData } from "@/domain/entities";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { uploadActions } from "@/store/actions/upload.actions";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const MAX_IMAGES = 5;

const STEPS = [
  { key: "details", title: "Property Details" },
  { key: "location", title: "Location" },
  { key: "pricing", title: "Pricing & Policies" },
  { key: "amenities", title: "Amenities & Rules" },
  { key: "photos", title: "Photos" },
];

const DEFAULT_FORM: IBecomeHostPropertyFormData = {
  title: "",
  description: "",
  propertyType: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  latitude: 40.7128,
  longitude: -74.006,
  basePrice: 0,
  currency: "INR",
  minNights: 1,
  maxNights: 30,
  maxGuests: 1,
  checkInTime: "15:00",
  checkOutTime: "11:00",
  amenities: [],
  rules: [],
  images: [],
};

// Side-by-side location layout — fields left, map right
const MAP_HEIGHT = "460px";

function EditLocationStep({
  formData,
  setFormData,
}: {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<IBecomeHostPropertyFormData>
  >;
}) {
  const mapValue: MapLocation = {
    latitude: Number(formData.latitude) || 40.7128,
    longitude: Number(formData.longitude) || -74.006,
    addressLine1: formData.addressLine1,
    addressLine2: formData.addressLine2,
    city: formData.city,
    state: formData.state,
    country: formData.country,
    postalCode: formData.postalCode,
  };

  const handleMapChange = (location: MapLocation) => {
    setFormData((prev) => ({ ...prev, ...location }));
  };

  const field = (
    key: keyof IBecomeHostPropertyFormData,
    placeholder: string,
    label: string,
    optional?: boolean,
  ) => (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-semibold text-foreground">
        {label}
        {optional && (
          <span className="ml-1.5 font-normal text-muted-foreground">
            (Optional)
          </span>
        )}
      </Label>
      <Input
        type="text"
        value={(formData[key] as string) ?? ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, [key]: e.target.value }))
        }
        placeholder={placeholder}
        className="h-10 px-3 bg-background border-border rounded-lg focus-visible:ring-0 focus-visible:border-primary"
      />
    </div>
  );

  return (
    <div className="flex gap-6">
      {/* Left — address fields */}
      <div className="w-[1/2] shrink-0 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Location</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Guests get the exact address after booking.
          </p>
        </div>
        {field("addressLine1", "123 Main Street", "Street Address")}
        {field("addressLine2", "Apt 4B", "Apt, suite, etc.", true)}
        <div className="grid grid-cols-2 gap-3">
          {field("city", "New York", "City")}
          {field("state", "NY", "State / Province")}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {field("country", "United States", "Country")}
          {field("postalCode", "10001", "Postal Code")}
        </div>
      </div>

      {/* Right — map with explicit pixel height */}
      <div className="flex-1 min-w-0">
        <MapPicker
          value={mapValue}
          onChange={handleMapChange}
          mapHeight={MAP_HEIGHT}
        />
      </div>
    </div>
  );
}

interface HostPropertyEditViewProps {
  propertyId: string;
  initialData: IBecomeHostPropertyFormData | null;
}

export function HostPropertyEditView({
  propertyId,
  initialData,
}: HostPropertyEditViewProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const useCase = useMemo(() => getHostPropertyUseCase(), []);
  const completedImages = useAppSelector((s) => s.upload.completedImages);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<IBecomeHostPropertyFormData>(
    initialData ? { ...DEFAULT_FORM, ...initialData } : DEFAULT_FORM,
  );
  const [loading, setLoading] = useState(!initialData);
  const [saving, setSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    setLoading(true);

    useCase
      .getPropertyForEdit(propertyId)
      .then((result) => {
        if (cancelled || !result) return;
        setFormData(result.form);
        // Seed Redux with full image metadata so ImageUploader shows existing photos
        if (result.imageMetadata.length) {
          dispatch(uploadActions.preload(result.imageMetadata));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [propertyId, initialData, useCase, dispatch]);

  const goToStep = useCallback((i: number) => {
    setCurrentStep(i);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      if (currentStep === 0) {
        if (!isPublished) {
          try {
            await useCase.stepCreateDraft({
              title: formData.title,
              description: formData.description,
              propertyType: formData.propertyType,
              propertyId,
            });
          } catch (err) {
            if (
              (err as { code?: string }).code === "PROPERTY_NOT_IN_DRAFT_STATUS"
            ) {
              setIsPublished(true);
            } else {
              throw err;
            }
          }
        }
      } else if (currentStep === 1) {
        await useCase.stepSaveLocation(propertyId, formData);
      } else if (currentStep === 2) {
        await useCase.stepSavePricing(propertyId, formData);
      } else if (currentStep === 3) {
        await useCase.stepSaveAmenities(propertyId, formData);
      } else if (currentStep === 4) {
        // Merge existing URLs (from DB) as metadata stubs with any newly uploaded images.
        // completedImages only contains files uploaded in this session, not pre-existing ones.
        const newUrls = new Set(completedImages.map((img) => img.url));
        const existingAsMetadata = (formData.images as string[])
          .filter((url) => !newUrls.has(url))
          .map((url, i) => ({ url, displayOrder: i, isPrimary: i === 0 }));
        const merged = [...existingAsMetadata, ...completedImages].slice(
          0,
          MAX_IMAGES,
        );
        if (merged.length) await useCase.stepSavePhotos(propertyId, merged);
        router.push("/dashboard/host/listings");
        return;
      }
      if (currentStep < STEPS.length - 1) setCurrentStep((s) => s + 1);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to save. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }, [
    currentStep,
    formData,
    propertyId,
    isPublished,
    useCase,
    completedImages,
    router,
  ]);

  const isLastStep = currentStep === STEPS.length - 1;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PropertyDetailsStep formData={formData} setFormData={setFormData} />
        );
      case 1:
        return (
          <EditLocationStep formData={formData} setFormData={setFormData} />
        );
      case 2:
        return <PricingStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <AmenitiesStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <PhotosStep formData={formData} setFormData={setFormData} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="size-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Breadcrumb */}
      <div className="shrink-0 px-4 sm:px-6 lg:px-8 py-4 border-b border-border bg-background">
        <PathBreadcrumb
          items={[
            { label: "Listings", href: "/dashboard/host/listings" },
            { label: "Edit listing" },
          ]}
        />
      </div>

      {/* Body */}
      <div className="flex flex-1">
        {/* Step nav — desktop */}
        <nav className="hidden lg:flex flex-col w-60 shrink-0 gap-0.5 px-4 py-6 border-r border-border bg-background">
          {STEPS.map((step, i) => {
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <button
                key={step.key}
                onClick={() => goToStep(i)}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-150 w-full",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : isDone
                      ? "text-foreground hover:bg-muted font-medium"
                      : "text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                <span
                  className={[
                    "size-5 rounded-full flex items-center justify-center shrink-0",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground text-[10px] font-bold"
                      : isDone
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-border text-muted-foreground text-[10px] font-bold",
                  ].join(" ")}
                >
                  {isDone ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : (
                    i + 1
                  )}
                </span>
                {step.title}
              </button>
            );
          })}
        </nav>

        {/* Step content */}
        <div className="flex-1 min-w-0">
          {/* Mobile step pills */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 pt-4 pb-0 scrollbar-hide">
            {STEPS.map((step, i) => {
              const isActive = i === currentStep;
              const isDone = i < currentStep;
              return (
                <button
                  key={step.key}
                  onClick={() => goToStep(i)}
                  className={[
                    "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : isDone
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-card text-muted-foreground border-border",
                  ].join(" ")}
                >
                  {isDone && <Check className="size-2.5" strokeWidth={3} />}
                  {step.title}
                </button>
              );
            })}
          </div>

          {/* Step card — compact-inputs scopes input/select/textarea height for dashboard context */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="compact-inputs bg-card rounded-xl border border-border shadow-sm p-6 sm:p-8">
              {renderStep()}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 z-10 border-t border-border bg-background px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            disabled={currentStep === 0 || saving}
            onClick={() => goToStep(currentStep - 1)}
            className="rounded-lg h-10 px-5 font-semibold text-foreground border-border"
          >
            <ArrowLeft className="size-4 mr-1.5" />
            Back
          </Button>
          <Button
            disabled={saving}
            onClick={() => void handleSave()}
            className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg h-10 px-6 font-semibold"
          >
            {saving && <Loader2 className="size-4 animate-spin mr-2" />}
            {isLastStep
              ? saving
                ? "Saving…"
                : "Save & finish"
              : saving
                ? "Saving…"
                : "Save & continue"}
            {!isLastStep && !saving && <ArrowRight className="ml-1.5 size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
