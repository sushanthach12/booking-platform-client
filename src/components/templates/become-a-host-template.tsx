"use client";

import { useState } from "react";
import { ArrowRight, Check, Home, Shield, DollarSign, MapPin, Calendar, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthDialog } from "@/components/auth/auth-dialog";

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
  "APARTMENT", "HOUSE", "CONDO", "VILLA", "STUDIO", "LOFT", "CABIN", "COTTAGE"
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
        return <PropertyDetailsStep formData={formData} setFormData={setFormData} />;
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
      <div className="max-w-4xl mx-auto px-8 py-8">
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
    <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-12">
      {/* Left Content */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground leading-tight">
            Become a Host
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Share your space, earn extra income, and create unforgettable experiences for travelers around the world.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <DollarSign className="size-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Earn Money</h3>
              <p className="text-muted-foreground">
                Set your own price and earn extra income from your spare space
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Shield className="size-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Host with Confidence</h3>
              <p className="text-muted-foreground">
                Get $1M USD in property damage protection and 24/7 support
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Home className="size-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Your Space, Your Rules</h3>
              <p className="text-muted-foreground">
                Decide when you're available and how you want to host
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Button size="lg" className="rounded-full px-8 py-4 text-lg" onClick={onStart}>
            Try hosting
            <ArrowRight className="ml-2 size-5" />
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            No commitment required
          </p>
        </div>
      </div>

      {/* Right Visual */}
      <div className="relative aspect-[4/3] lg:aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-border">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 p-8">
            <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <Home className="size-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">
                Start your hosting journey
              </h3>
              <p className="text-muted-foreground">
                Join millions of hosts worldwide
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">4M+</div>
                <div className="text-sm text-muted-foreground">Hosts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">220+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">1B+</div>
                <div className="text-sm text-muted-foreground">Guests</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyDetailsStep({ formData, setFormData }: { 
  formData: PropertyFormData; 
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>> 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tell us about your property</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Property Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="Cozy apartment in downtown"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border rounded-lg h-32"
            placeholder="Describe your property..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Property Type</label>
          <select
            value={formData.propertyType}
            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select property type</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
}

function LocationStep({ formData, setFormData }: { 
  formData: PropertyFormData; 
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>> 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Where's your property located?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="text"
          value={formData.addressLine1}
          onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
          className="w-full p-3 border rounded-lg"
          placeholder="Address Line 1"
        />
        <input
          type="text"
          value={formData.addressLine2}
          onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="State"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="Country"
          />
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="Postal Code"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function PricingStep({ formData, setFormData }: { 
  formData: PropertyFormData; 
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>> 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set your pricing and policies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Base Price per Night</label>
            <input
              type="number"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
              className="w-full p-3 border rounded-lg"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, minNights: Number(e.target.value) })}
              className="w-full p-3 border rounded-lg"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Nights</label>
            <input
              type="number"
              value={formData.maxNights}
              onChange={(e) => setFormData({ ...formData, maxNights: Number(e.target.value) })}
              className="w-full p-3 border rounded-lg"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Guests</label>
            <input
              type="number"
              value={formData.maxGuests}
              onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) })}
              className="w-full p-3 border rounded-lg"
              placeholder="2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Check-in Time</label>
            <input
              type="time"
              value={formData.checkInTime}
              onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Check-out Time</label>
            <input
              type="time"
              value={formData.checkOutTime}
              onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AmenitiesStep({ formData, setFormData }: { 
  formData: PropertyFormData; 
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>> 
}) {
  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter(a => a !== amenity)
        : [...formData.amenities, amenity]
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
            <label key={amenity.name} className="flex items-center space-x-2 cursor-pointer">
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
