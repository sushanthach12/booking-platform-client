"use client";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Check,
  DollarSign,
  Home,
  MapPin,
  Shield,
} from "lucide-react";
import { useState } from "react";
import AppLogo from "../shared/app-logo";

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
  const [currentStep, setCurrentStep] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
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

  const handleStartHosting = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
    } else {
      setCurrentStep(1);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthDialog(false);
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

  return (
    <>
      {/* Simplified Header with only logo */}
      <header className="sticky top-0 z-50 w-full px-6 lg:px-10 pt-6 pb-6 bg-white">
        <div className="h-14 flex justify-start items-center px-6 lg:px-10">
          {/* Logo */}
          <AppLogo />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-12">
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

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  );
}

function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-36 items-center min-h-screen lg:min-h-[80vh]">
      {/* Left Content */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Become a Host
          </h1>
          <p className="text-md lg:text-lg text-muted-foreground leading-relaxed">
            Share your space, earn extra income, and create unforgettable
            experiences for travelers around the world.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Button
              variant="outline"
              size="icon-lg"
              className="mt-2 p-2 rounded-full bg-green-100 hover:bg-green-200 border-green-200"
            >
              <DollarSign className="size-6 text-green-600" />
            </Button>
            <div>
              <h3 className="text-sm lg:text-lg font-semibold">Earn Money</h3>
              <p className="text-muted-foreground text-sm lg:text-base">
                Set your own price and earn extra income from your spare space
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Button
              variant="outline"
              size="icon-lg"
              className="mt-2 p-2 rounded-full bg-blue-100 hover:bg-blue-200 border-blue-200"
            >
              <Shield className="size-6 text-blue-600" />
            </Button>
            <div>
              <h3 className="text-sm lg:text-lg font-semibold">
                Host with Confidence
              </h3>
              <p className="text-muted-foreground text-sm lg:text-base">
                Get $1M USD in property damage protection and 24/7 support
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Button
              variant="outline"
              size="icon-lg"
              className="mt-2 p-2 rounded-full bg-purple-100 hover:bg-purple-200 border-purple-200"
            >
              <Home className="size-6 text-purple-600" />
            </Button>
            <div>
              <h3 className="text-sm lg:text-lg font-semibold">
                Your Space, Your Rules
              </h3>
              <p className="text-muted-foreground text-sm lg:text-base">
                Decide when you&apos;re available and how you want to host
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Button
            variant={"default"}
            size="lg"
            className="rounded-lg px-6 py-4 text-md lg:text-base flex items-center"
            onClick={onStart}
          >
            Try hosting
            <ArrowRight className="ml-2 size-5" />
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            No commitment required
          </p>
        </div>
      </div>

      {/* Right Visual */}
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-border h-[700px] lg:h-[550px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 lg:w-24 h-20 lg:h-24 bg-primary/20 rounded-full flex items-center justify-center">
              <Home className="size-10 lg:size-12 text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                Start your hosting journey
              </h3>
              <p className="text-muted-foreground">
                Join millions of hosts worldwide
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-primary">
                  4M+
                </div>
                <div className="text-sm text-muted-foreground">Hosts</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-primary">
                  220+
                </div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-primary">
                  1B+
                </div>
                <div className="text-sm text-muted-foreground">Guests</div>
              </div>
            </div>
          </div>
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
