'use client';

import { Button } from '@/components/ui/button';
import { IBecomeHostPropertyFormData } from '@/data/interfaces';
import { useAppSelector } from '@/hooks/redux';
import {
  ArrowRight,
  Camera,
  DollarSign,
  Home,
  Loader2,
  MapPin,
  Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import AppLogo from '../shared/app-logo';
import {
  AmenitiesStep,
  LocationStep,
  PhotosStep,
  PricingStep,
  PropertyDetailsStep,
  WelcomeStep,
} from './steps';

const MAX_IMAGES = 5;

export function BecomeAHostTemplate() {
  const router = useRouter();
  const completedUrls = useAppSelector((s) => s.upload.completedUrls);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<IBecomeHostPropertyFormData>({
    title: '',
    description: '',
    propertyType: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    basePrice: 0,
    currency: 'USD',
    minNights: 1,
    maxNights: 30,
    maxGuests: 1,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    amenities: [],
    rules: [],
    images: [],
  });

  const steps = [
    { title: 'Property Details', icon: Home },
    { title: 'Location', icon: MapPin },
    { title: 'Pricing & Policies', icon: DollarSign },
    { title: 'Amenities & Rules', icon: Shield },
    { title: 'Photos', icon: Camera },
  ];

  // Check authentication on mount and redirect if not authenticated
  useEffect(() => {
    // Small delay to show checking state for better UX
    const checkAuth = async () => {
      if (typeof window === 'undefined') {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms delay

      const authToken = localStorage.getItem('authToken');
      const currentUser = localStorage.getItem('currentUser');
      const isAuthenticated = !!(authToken && currentUser);

      if (!isAuthenticated) {
        setIsAuthenticated(false);
        // Small delay before redirect for smoother transition
        setTimeout(() => {
          router.push('/');
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

  const handleNextStep = useCallback(() => {
    if (currentStep === 5) {
      setFormData((prev) => ({
        ...prev,
        images: completedUrls.slice(0, MAX_IMAGES),
      }));
    }
    setCurrentStep((s) => s + 1);
  }, [currentStep, completedUrls]);

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
      case 5:
        return <PhotosStep formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className='w-full h-screen flex flex-col items-center justify-center bg-background'>
        <Loader2 className='size-10 animate-spin text-primary mb-4' />
        <p className='text-muted-foreground'>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className='w-full h-screen flex flex-col overflow-hidden bg-background'>
      {/* Header with logo and Exit */}
      <header className='shrink-0 bg-background px-4 py-2'>
        <div className='h-14 flex justify-between items-center px-6 lg:px-10 '>
          <AppLogo />
          {currentStep === 0 && (
            <Button
              variant='outline'
              onClick={() => window.history.back()}
              className='text-sm rounded-lg transition-colors'
              size='sm'
            >
              Exit
            </Button>
          )}
        </div>
      </header>

      <div
        className={`flex-1 flex flex-col ${
          currentStep === 0 ? 'overflow-hidden' : 'overflow-y-auto'
        }`}
      >
        {currentStep === 0 ? (
          renderStepContent()
        ) : (
          <div className='flex-1 flex flex-col pb-24 px-6 md:px-8 max-w-4xl mx-auto w-full'>
            {/* Minimal Mobile-First Progress Indicator */}
            {currentStep > 0 && (
              <div className='mb-8 w-full  top-0 z-10 bg-background/95 backdrop-blur py-2'>
                <div className='flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4'>
                  <span>
                    Step {currentStep} of {steps.length}
                  </span>
                  <span className='text-foreground'>
                    {steps[currentStep - 1].title}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className='w-full h-2 bg-stone-100 rounded-full overflow-hidden flex gap-1'>
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-full flex-1 rounded-full transition-all duration-500 ${
                        index + 1 <= currentStep
                          ? 'bg-rose-500'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step Content */}
            <div className='flex-1'>{renderStepContent()}</div>

            {/* Sticky Bottom Navigation Bar */}
            {currentStep > 0 && (
              <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 md:px-8'>
                <div className='max-w-4xl mx-auto flex justify-between items-center w-full gap-4'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={currentStep === 1}
                    className='text-stone-600 hover:text-stone-900 font-semibold'
                  >
                    Back
                  </Button>
                  <Button
                    variant={'default'}
                    size='lg'
                    className='bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-8 h-12 font-bold transition-all shadow-md active:scale-95 flex-1 md:flex-none text-base'
                    onClick={handleNextStep}
                    disabled={currentStep === steps.length}
                  >
                    {currentStep === steps.length ? 'Publish' : 'Next'}
                    {currentStep !== steps.length && (
                      <ArrowRight className='ml-2 size-5' />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
