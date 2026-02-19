"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Fragment, useEffect, useState } from "react";
import AppLogo from "../shared/app-logo";
import { Separator } from "../ui/separator";

interface PropertyFormData {
  // Step 1: Basic Info
  title: string;
  description: string;
  propertyType: string;

  // Step 2: Location
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  // Step 3: Pricing & Policies
  basePrice: number;
  currency: string;
  minNights: number;
  maxNights: number;
  maxGuests: number;
  checkInTime: string;
  checkOutTime: string;

  // Step 4: Amenities & Rules
  amenities: string[];
  rules: Array<{ type: string; allowed: boolean; description?: string }>;
}

const propertyTypes = [
  "APARTMENT",
  "HOUSE",
  "CONDO",
  "VILLA",
  "STUDIO",
  "LOFT",
  "CABIN",
  "COTTAGE",
];

const amenities = [
  { name: "WiFi", category: "ESSENTIALS" },
  { name: "Kitchen", category: "ESSENTIALS" },
  { name: "Parking", category: "ESSENTIALS" },
  { name: "Air Conditioning", category: "COMFORT" },
  { name: "Heating", category: "COMFORT" },
  { name: "Washer", category: "AMENITIES" },
  { name: "Dryer", category: "AMENITIES" },
  { name: "TV", category: "ENTERTAINMENT" },
];

export function BecomeAHostTemplate() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PropertyFormData>({
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

      <div className={`flex-1 ${currentStep === 0 ? "overflow-hidden" : "overflow-y-auto"}`}>
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
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index + 1 <= currentStep
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
                          className={`w-16 h-0.5 mx-2 ${index + 1 < currentStep ? "bg-primary" : "bg-muted"
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
                      className={`text-center ${index + 1 <= currentStep
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

function WelcomeStep({ onStart }: { onStart: () => void }) {
  const steps = [
    {
      number: 1,
      title: "Tell us about your place",
      description:
        "Share some basic info, such as where it is and how many guests can stay.",
      icon: Home,
    },
    {
      number: 2,
      title: "Make it stand out",
      description:
        "Add 5 or more photos plus a title and description - we'll help you out.",
      icon: MapPin,
    },
    {
      number: 3,
      title: "Finish up and publish",
      description:
        "Choose a starting price, verify a few details, then publish your listing.",
      icon: DollarSign,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="w-full  mx-auto px-6 lg:px-16 3xl:px-56 3xl:py-10 min-h-0 flex-1 grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-center">

        {/* Left Column - Intro Text */}
        <div className="h-full flex flex-col items-center justify-center w-full max-w-7xl pb-20">
          <h1 className="text-2xl lg:text-3xl 2xl:text-5xl 3xl:text-6xl font-bold text-foreground leading-tight flex flex-col ">
            <span>It&apos;s easy to get </span><span className="text-primary">started on Booking</span>
          </h1>
        </div>

        {/* Right Column - Steps */}
        <div className="h-full flex justify-between gap-0 items-center">
          <div className="w-1/3 h-full " />

          <div className="flex flex-col space-y-10 3xl:space-y-24 h-full py-10 ">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Fragment key={step.number}>
                  <div key={step.number} className="flex gap-6 pb-10">
                    {/* Step Number */}
                    <div className="shrink-0">
                      <span className="text-xl lg:text-2xl font-bold text-foreground">
                        {step.number}
                      </span>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 space-y-1">
                      <h3 className="text-xl lg:text-2xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-base tracking-tighter lg:text-lg text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Icon/Illustration */}
                    <div className="shrink-0 w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center">
                      <div className="w-full h-full rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                        <Icon className="size-6 lg:size-7 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  {step.number !== steps.length && (
                    <Separator />
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer with Get Started Button */}
      <div className="shrink-0 border-t-2 border-gray-300 mt-auto">
        <div className="px-6 lg:px-16 py-6 flex justify-end">
          <Button
            onClick={onStart}
            size="lg"
            className="bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base lg:text-lg font-medium"
          >
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
}

function PropertyDetailsStep({
  formData,
  setFormData,
}: {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tell us about your property</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Property Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-3 border rounded-lg"
            placeholder="Cozy apartment in downtown"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-3 border rounded-lg h-32"
            placeholder="Describe your property..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Property Type
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) =>
              setFormData({ ...formData, propertyType: e.target.value })
            }
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select property type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
}

function LocationStep({
  formData,
  setFormData,
}: {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Where&apos;s your property located?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="text"
          value={formData.addressLine1}
          onChange={(e) =>
            setFormData({ ...formData, addressLine1: e.target.value })
          }
          className="w-full p-3 border rounded-lg"
          placeholder="Address Line 1"
        />
        <input
          type="text"
          value={formData.addressLine2}
          onChange={(e) =>
            setFormData({ ...formData, addressLine2: e.target.value })
          }
          className="w-full p-3 border rounded-lg"
          placeholder="Address Line 2 (Optional)"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="City"
          />
          <input
            type="text"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            className="w-full p-3 border rounded-lg"
            placeholder="State"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            className="w-full p-3 border rounded-lg"
            placeholder="Country"
          />
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) =>
              setFormData({ ...formData, postalCode: e.target.value })
            }
            className="w-full p-3 border rounded-lg"
            placeholder="Postal Code"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function PricingStep({
  formData,
  setFormData,
}: {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set your pricing and policies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Base Price per Night
            </label>
            <input
              type="number"
              value={formData.basePrice}
              onChange={(e) =>
                setFormData({ ...formData, basePrice: Number(e.target.value) })
              }
              className="w-full p-3 border rounded-lg"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Nights</label>
            <input
              type="number"
              value={formData.minNights}
              onChange={(e) =>
                setFormData({ ...formData, minNights: Number(e.target.value) })
              }
              className="w-full p-3 border rounded-lg"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Nights</label>
            <input
              type="number"
              value={formData.maxNights}
              onChange={(e) =>
                setFormData({ ...formData, maxNights: Number(e.target.value) })
              }
              className="w-full p-3 border rounded-lg"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Guests</label>
            <input
              type="number"
              value={formData.maxGuests}
              onChange={(e) =>
                setFormData({ ...formData, maxGuests: Number(e.target.value) })
              }
              className="w-full p-3 border rounded-lg"
              placeholder="2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Check-in Time
            </label>
            <input
              type="time"
              value={formData.checkInTime}
              onChange={(e) =>
                setFormData({ ...formData, checkInTime: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Check-out Time
            </label>
            <input
              type="time"
              value={formData.checkOutTime}
              onChange={(e) =>
                setFormData({ ...formData, checkOutTime: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AmenitiesStep({
  formData,
  setFormData,
}: {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}) {
  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>What amenities do you offer?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {amenities.map((amenity) => (
            <label
              key={amenity.name}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity.name)}
                onChange={() => toggleAmenity(amenity.name)}
                className="rounded"
              />
              <span className="text-sm">{amenity.name}</span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
