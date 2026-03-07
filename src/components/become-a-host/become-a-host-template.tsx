"use client";

import { Button } from "@/components/ui/button";
import { IBecomeHostPropertyFormData } from "@/data/interfaces";
import {
  ArrowRight,
  Check,
  DollarSign,
  Home,
  Loader2,
  MapPin,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLogo from "../shared/app-logo";
import {
  AmenitiesStep,
  LocationStep,
  PricingStep,
  PropertyDetailsStep,
  WelcomeStep,
} from "./steps";

export function BecomeAHostTemplate() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<IBecomeHostPropertyFormData>({
    title: "",
    description: "",
    propertyType: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    basePrice: 0,
    currency: "USD",
    minNights: 1,
    maxNights: 30,
    maxGuests: 1,
    checkInTime: "15:00",
    checkOutTime: "11:00",
    amenities: [],
    rules: [],
  });

  const steps = [
    { title: "Property Details", icon: Home },
    { title: "Location", icon: MapPin },
    { title: "Pricing & Policies", icon: DollarSign },
    { title: "Amenities & Rules", icon: Shield },
  ];

  // Check authentication on mount and redirect if not authenticated
  useEffect(() => {
    // Small delay to show checking state for better UX
    const checkAuth = async () => {
      if (typeof window === "undefined") {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms delay

      const authToken = localStorage.getItem("authToken");
      const currentUser = localStorage.getItem("currentUser");
      const isAuthenticated = !!(authToken && currentUser);

      if (!isAuthenticated) {
        setIsAuthenticated(false);
        // Small delay before redirect for smoother transition
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        setIsAuthenticated(true);
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  const handleStartHosting = () => {
    setCurrentStep(1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onStart={handleStartHosting} />;
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
      default:
        return null;
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="size-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-background">
      {/* Header with logo and Exit */}
      <header className="shrink-0 bg-background p-6">
        <div className=" h-16 flex justify-between items-center px-6 lg:px-10">
          <AppLogo />
          {currentStep === 0 && (
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="text-sm rounded-lg transition-colors"
              size="lg"
            >
              Exit
            </Button>
          )}
        </div>
      </header>

      <div
        className={`flex-1 ${
          currentStep === 0 ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        {currentStep === 0 ? (
          renderStepContent()
        ) : (
          <div className="px-8 py-12">
            {/* Progress Indicator */}
            {currentStep > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, index) => (
                    <div key={step.title} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index + 1 <= currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1 < currentStep ? (
                          <Check className="size-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-16 h-0.5 mx-2 ${
                            index + 1 < currentStep ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm">
                  {steps.map((step, index) => (
                    <div
                      key={step.title}
                      className={`text-center ${
                        index + 1 <= currentStep
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step Content */}
            {renderStepContent()}

            {/* Navigation */}
            {currentStep > 0 && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === steps.length}
                >
                  {currentStep === steps.length ? "Submit" : "Next"}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
