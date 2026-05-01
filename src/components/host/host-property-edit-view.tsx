"use client";

import {
  AmenitiesStep,
  LocationStep,
  PhotosStep,
  PricingStep,
  PropertyDetailsStep,
} from "@/components/become-a-host/steps";
import { Button } from "@/components/ui/button";
import { getHostPropertyUseCase } from "@/domain/di";
import type { IBecomeHostPropertyFormData } from "@/domain/entities";
import { useAppSelector } from "@/hooks/redux";
import { ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import AppLogo from "../shared/app-logo";

const MAX_IMAGES = 5;

const STEPS = [
  { title: "Property Details" },
  { title: "Location" },
  { title: "Pricing & Policies" },
  { title: "Amenities & Rules" },
  { title: "Photos" },
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
  currency: "USD",
  minNights: 1,
  maxNights: 30,
  maxGuests: 1,
  checkInTime: "15:00",
  checkOutTime: "11:00",
  amenities: [],
  rules: [],
  images: [],
};

interface HostPropertyEditViewProps {
  propertyId: string;
  initialData: IBecomeHostPropertyFormData | null;
}

export function HostPropertyEditView({
  propertyId,
  initialData,
}: HostPropertyEditViewProps) {
  const router = useRouter();
  const useCase = useMemo(() => getHostPropertyUseCase(), []);
  const completedImages = useAppSelector((s) => s.upload.completedImages);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IBecomeHostPropertyFormData>(
    initialData ? { ...DEFAULT_FORM, ...initialData } : DEFAULT_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = useCallback(async () => {
    setError(null);
    setSaving(true);
    try {
      if (currentStep === 1) {
        await useCase.stepCreateDraft({
          title: formData.title,
          description: formData.description,
          propertyType: formData.propertyType,
          propertyId,
        });
        setCurrentStep(2);
      } else if (currentStep === 2) {
        await useCase.stepSaveLocation(propertyId, formData);
        setCurrentStep(3);
      } else if (currentStep === 3) {
        await useCase.stepSavePricing(propertyId, formData);
        setCurrentStep(4);
      } else if (currentStep === 4) {
        await useCase.stepSaveAmenities(propertyId, formData);
        setCurrentStep(5);
      } else if (currentStep === 5) {
        const images = completedImages.slice(0, MAX_IMAGES);
        if (images.length) {
          await useCase.stepSavePhotos(propertyId, images);
        }
        router.push("/host/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }, [currentStep, formData, propertyId, useCase, completedImages, router]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PropertyDetailsStep formData={formData} setFormData={setFormData} />
        );
      case 2:
        return <LocationStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <PricingStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <AmenitiesStep formData={formData} setFormData={setFormData} />;
      case 5:
        return <PhotosStep formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 bg-background px-4 py-2 border-b border-slate-100">
        <div className="h-14 flex justify-between items-center px-6 lg:px-10">
          <AppLogo />
          <Link
            href="/host/dashboard"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-semibold transition-colors"
          >
            <ChevronLeft className="size-4" />
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="flex-1 flex flex-col pb-24 px-6 md:px-8 max-w-4xl mx-auto w-full">
          {/* Progress */}
          <div className="mb-8 pt-6">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              <span>
                Step {currentStep} of {STEPS.length}
              </span>
              <span className="text-foreground">
                {STEPS[currentStep - 1]?.title}
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden flex gap-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-full transition-all duration-500 ${i + 1 <= currentStep ? "bg-rose-500" : "bg-transparent"}`}
                />
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="flex-1">{renderStep()}</div>
        </div>
      </div>

      {/* Sticky nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-2 w-full">
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <div className="flex justify-between items-center w-full gap-4">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentStep === 1 || saving}
              onClick={() => setCurrentStep((s) => s - 1)}
              className="text-stone-600 hover:text-stone-900 font-semibold"
            >
              Back
            </Button>
            <Button
              size="lg"
              disabled={saving}
              onClick={() => void handleNext()}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-8 h-12 font-bold flex-1 md:flex-none text-base"
            >
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {currentStep === STEPS.length
                ? saving
                  ? "Saving…"
                  : "Save changes"
                : saving
                  ? "Saving…"
                  : "Next"}
              {currentStep !== STEPS.length && !saving && (
                <ArrowRight className="ml-2 size-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
