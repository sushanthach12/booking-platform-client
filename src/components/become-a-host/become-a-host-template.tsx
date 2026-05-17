'use client';

import { Button } from '@/components/ui/button';
import { API_CONSTANTS, apiUrl } from '@/domain/constants/api.constant';
import { getHostPropertyUseCase } from '@/domain/di';
import { IBecomeHostPropertyFormData } from '@/domain/entities';
import { useAppSelector } from '@/hooks/redux';

import { COOKIE_KEYS, getCookie } from '@/lib/utils/cookies';
import {
  ArrowRight,
  Camera,
  DollarSign,
  Home,
  Loader2,
  MapPin,
  Shield,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
const SESSION_KEY_PROPERTY_ID = 'draft_property_id';
const SESSION_KEY_STEP = 'draft_current_step';

export function BecomeAHostTemplate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hostPropertyUseCase = useMemo(() => getHostPropertyUseCase(), []);
  const completedImages = useAppSelector((s) => s.upload.completedImages);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftPropertyId, setDraftPropertyId] = useState<string | null>(null);
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
    latitude: 12.9716,
    longitude: 77.5946,
    basePrice: 0,
    currency: 'INR',
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

  // Check authentication on mount; restore draft session if available
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') return;

      await new Promise((resolve) => setTimeout(resolve, 300));

      const authToken = getCookie(COOKIE_KEYS.AUTH_TOKEN);
      const currentUser = getCookie(COOKIE_KEYS.AUTH_USER);
      const authed = !!(authToken && currentUser);

      if (!authed) {
        setIsAuthenticated(false);
        setTimeout(() => router.push('/'), 500);
        setIsCheckingAuth(false);
        return;
      }

      setIsAuthenticated(true);

      // ?start=1 — skip the welcome screen and go straight to step 1 (fresh listing)
      const startFresh = searchParams?.get('start') === '1';
      if (startFresh) {
        // Clear any stale draft session so we don't accidentally resume
        sessionStorage.removeItem(SESSION_KEY_PROPERTY_ID);
        sessionStorage.removeItem(SESSION_KEY_STEP);
        setCurrentStep(1);
        setIsCheckingAuth(false);
        return;
      }

      // Priority 1: sessionStorage (fastest — survives refresh)
      const savedId = sessionStorage.getItem(SESSION_KEY_PROPERTY_ID);
      const savedStep = sessionStorage.getItem(SESSION_KEY_STEP);
      if (savedId) {
        // Re-fetch draft details so all form fields are pre-filled on back navigation.
        // If the token is stale (401) getDraftDetails returns null — clear the dead session
        // and fall through to a fresh start rather than showing an error.
        try {
          const details = await hostPropertyUseCase.getDraftDetails(savedId);
          if (details) {
            setFormData((prev) => ({ ...prev, ...details }));
            setDraftPropertyId(savedId);
            setCurrentStep(savedStep ? parseInt(savedStep, 10) : 1);
            setIsCheckingAuth(false);
            return;
          }
        } catch {
          // Non-fatal
        }
        // Draft no longer accessible — clear stale session and start fresh
        sessionStorage.removeItem(SESSION_KEY_PROPERTY_ID);
        sessionStorage.removeItem(SESSION_KEY_STEP);
        setCurrentStep(1);
        setIsCheckingAuth(false);
        return;
      }

      // Priority 2: ?draftId= query param (from dashboard "Continue" button)
      const draftIdParam = searchParams?.get('draftId');
      if (draftIdParam) {
        sessionStorage.setItem(SESSION_KEY_PROPERTY_ID, draftIdParam);

        try {
          const [details, resume] = await Promise.all([
            hostPropertyUseCase.getDraftDetails(draftIdParam),
            hostPropertyUseCase.tryResumeDraft(),
          ]);

          if (details) {
            setFormData((prev) => ({ ...prev, ...details }));
            setDraftPropertyId(draftIdParam);
          }
          const step = resume?.currentStep ?? 1;
          setCurrentStep(step);
          sessionStorage.setItem(SESSION_KEY_STEP, String(step));
        } catch {
          setCurrentStep(1);
        }
        setIsCheckingAuth(false);
        return;
      }

      // Priority 3: server-side resume (cross-device / first load after close).
      // tryResumeDraft returns null on 401 — never throws, so no error surfaces here.
      try {
        const resume = await hostPropertyUseCase.tryResumeDraft();
        if (resume) {
          setDraftPropertyId(resume.propertyId);
          sessionStorage.setItem(SESSION_KEY_PROPERTY_ID, resume.propertyId);
          setCurrentStep(resume.currentStep);
          sessionStorage.setItem(SESSION_KEY_STEP, String(resume.currentStep));
        }
      } catch {
        // No draft — fresh start from welcome screen
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router, hostPropertyUseCase, searchParams]);

  // Keep sessionStorage in sync with currentStep
  useEffect(() => {
    if (currentStep > 0 && draftPropertyId) {
      sessionStorage.setItem(SESSION_KEY_STEP, String(currentStep));
    }
  }, [currentStep, draftPropertyId]);

  const storeDraftId = (id: string) => {
    setDraftPropertyId(id);
    sessionStorage.setItem(SESSION_KEY_PROPERTY_ID, id);
  };

  const clearDraftSession = () => {
    sessionStorage.removeItem(SESSION_KEY_PROPERTY_ID);
    sessionStorage.removeItem(SESSION_KEY_STEP);
  };

  const handleStartHosting = () => {
    setCurrentStep(1);
  };

  const handlePrimaryAction = useCallback(async () => {
    setSubmitError(null);

    // ── Step 1: Create or update Draft ───────────────────────────────────────
    if (currentStep === 1) {
      setIsPublishing(true);
      try {
        const { propertyId } = await hostPropertyUseCase.stepCreateDraft({
          title: formData.title,
          description: formData.description,
          propertyType: formData.propertyType,
          // Pass existing draft ID so the backend updates instead of creating
          propertyId: draftPropertyId ?? undefined,
        });
        storeDraftId(propertyId);
        setCurrentStep(2);
      } catch (err) {
        if (
          err instanceof Error &&
          (err.message === 'PROPERTY_NOT_IN_DRAFT_STATUS' ||
            (err as Error & { code?: string }).code ===
              'PROPERTY_NOT_IN_DRAFT_STATUS')
        ) {
          // Draft was already published — clear session and send host to dashboard
          clearDraftSession();
          router.replace('/dashboard/host');
          return;
        }
        setSubmitError(
          err instanceof Error
            ? err.message
            : 'Could not save property details.',
        );
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    // Guard: steps 2–5 require a draftPropertyId
    if (!draftPropertyId) {
      setSubmitError('Something went wrong. Please go back to step 1.');
      return;
    }

    // ── Step 2: Save Location ─────────────────────────────────────────────────
    if (currentStep === 2) {
      setIsPublishing(true);
      try {
        await hostPropertyUseCase.stepSaveLocation(draftPropertyId, formData);
        setCurrentStep(3);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Could not save location.',
        );
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    // ── Step 3: Save Pricing & Policies ───────────────────────────────────────
    if (currentStep === 3) {
      setIsPublishing(true);
      try {
        await hostPropertyUseCase.stepSavePricing(draftPropertyId, formData);
        setCurrentStep(4);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Could not save pricing.',
        );
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    // ── Step 4: Save Amenities ────────────────────────────────────────────────
    if (currentStep === 4) {
      setIsPublishing(true);
      try {
        await hostPropertyUseCase.stepSaveAmenities(draftPropertyId, formData);
        setCurrentStep(5);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Could not save amenities.',
        );
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    // ── Step 5: Save Photos then Publish ─────────────────────────────────────
    if (currentStep === 5) {
      const images = completedImages.slice(0, MAX_IMAGES);
      if (!images.length) {
        setSubmitError('Add at least one photo before publishing.');
        return;
      }
      setIsPublishing(true);
      try {
        await hostPropertyUseCase.stepSavePhotos(draftPropertyId, images);
        await hostPropertyUseCase.stepPublish(draftPropertyId);

        // Elevate user to host role
        try {
          const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);
          const becomeHostRes = await fetch(
            apiUrl(API_CONSTANTS.ENDPOINTS.USERS.ME_BECOME_HOST),
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            },
          );
          if (becomeHostRes.ok) {
            const rawUser = getCookie(COOKIE_KEYS.AUTH_USER);
            if (rawUser) {
              try {
                const user = JSON.parse(rawUser) as Record<string, unknown>;
                const updated = JSON.stringify({
                  ...user,
                  isHost: true,
                  role: 'host',
                });
                document.cookie = `${COOKIE_KEYS.AUTH_USER}=${encodeURIComponent(updated)};path=/;max-age=604800`;
              } catch {
                // Non-fatal
              }
            }
          }
        } catch {
          // Non-fatal — role elevation failed, user can still see their listing
        }

        clearDraftSession();
        router.push('/dashboard/host/overview');
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Could not publish listing.',
        );
      } finally {
        setIsPublishing(false);
      }
      return;
    }
  }, [
    completedImages,
    currentStep,
    draftPropertyId,
    formData,
    hostPropertyUseCase,
    router,
  ]);

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

  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className='w-full h-screen flex flex-col items-center justify-center bg-card'>
        <Loader2 className='size-10 animate-spin text-primary mb-4' />
        <p className='text-muted-foreground'>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className='w-full h-screen flex flex-col overflow-hidden bg-card'>
      {/* Header with logo and Exit */}
      <header className='shrink-0 bg-card px-4 py-2'>
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
            {/* Progress Indicator */}
            {currentStep > 0 && (
              <div className='mb-8 w-full top-0 z-10 bg-card/95 backdrop-blur py-2'>
                <div className='flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4'>
                  <span>
                    Step {currentStep} of {steps.length}
                  </span>
                  <span className='text-foreground'>
                    {steps[currentStep - 1].title}
                  </span>
                </div>
                <div className='w-full h-2 bg-muted rounded-full overflow-hidden flex gap-1'>
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-full flex-1 rounded-full transition-all duration-500 ${
                        index + 1 <= currentStep
                          ? 'bg-primary'
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
              <div className='fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 md:px-8'>
                <div className='max-w-4xl mx-auto flex flex-col gap-2 w-full'>
                  {submitError ? (
                    <p className='text-sm text-destructive text-center'>
                      {submitError}
                    </p>
                  ) : null}
                  <div className='flex justify-between items-center w-full gap-4'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setCurrentStep(currentStep - 1)}
                      disabled={currentStep === 1 || isPublishing}
                      className='text-muted-foreground hover:text-foreground font-semibold'
                    >
                      Back
                    </Button>
                    <Button
                      variant={'default'}
                      size='lg'
                      className='bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl px-8 h-12 font-bold transition-all shadow-md active:scale-95 flex-1 md:flex-none text-base'
                      onClick={() => void handlePrimaryAction()}
                      disabled={isPublishing}
                    >
                      {currentStep === steps.length
                        ? isPublishing
                          ? 'Publishing…'
                          : 'Publish'
                        : isPublishing
                          ? 'Saving…'
                          : 'Next'}
                      {currentStep !== steps.length && !isPublishing && (
                        <ArrowRight className='ml-2 size-5' />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Keep completedUrls export for ImageUploader backward compat
export { MAX_IMAGES };
