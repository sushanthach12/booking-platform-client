import type {
  IBecomeHostPropertyFormData,
  IImageUploadMetadata,
  IOnboardingDraftResume,
} from '@/domain/entities';

export interface IHostPropertyRepository {
  /** @deprecated Use step-based methods (createDraft → saveLocation → … → publishDraft). */
  onboardHost(
    formData: IBecomeHostPropertyFormData,
    imageUrls: string[],
  ): Promise<{ id: string }>;

  /** Step 1 — Create a DRAFT property. Returns the new propertyId. */
  createDraft(
    data: Pick<
      IBecomeHostPropertyFormData,
      'title' | 'description' | 'propertyType'
    >,
  ): Promise<{ propertyId: string; slug: string }>;

  /** Step 2 — Save location data (propertyId embedded in data). */
  saveLocation(
    data: Pick<
      IBecomeHostPropertyFormData,
      | 'addressLine1'
      | 'addressLine2'
      | 'city'
      | 'state'
      | 'country'
      | 'postalCode'
      | 'latitude'
      | 'longitude'
    > & { propertyId: string },
  ): Promise<void>;

  /** Step 3 — Save pricing & policies (propertyId embedded in data). */
  savePricing(
    data: Pick<
      IBecomeHostPropertyFormData,
      | 'basePrice'
      | 'currency'
      | 'minNights'
      | 'maxNights'
      | 'maxGuests'
      | 'checkInTime'
      | 'checkOutTime'
    > & { propertyId: string },
  ): Promise<void>;

  /** Step 4 — Save amenities & rules (propertyId embedded in data). */
  saveAmenities(
    data: Pick<IBecomeHostPropertyFormData, 'amenities' | 'rules'> & {
      propertyId: string;
    },
  ): Promise<void>;

  /** Step 5 — Save photos with full metadata (propertyId embedded in data). */
  savePhotos(data: {
    propertyId: string;
    images: IImageUploadMetadata[];
  }): Promise<void>;

  /** Publish — transitions DRAFT → ACTIVE after completeness gate. */
  publishDraft(data: {
    propertyId: string;
  }): Promise<{ propertyId: string; slug: string }>;

  /** Returns the host's most recent DRAFT progress for wizard resume. */
  resumeDraft(): Promise<IOnboardingDraftResume | null>;

  /** Returns full draft property details for pre-filling the wizard on resume. */
  getDraftDetails(
    propertyId: string,
  ): Promise<IBecomeHostPropertyFormData | null>;
}
