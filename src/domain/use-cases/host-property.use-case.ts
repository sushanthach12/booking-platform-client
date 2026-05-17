import type {
  IBecomeHostPropertyFormData,
  IImageUploadMetadata,
  IOnboardingDraftResume,
} from "@/domain/entities";
import type { IHostPropertyRepository } from "@/domain/interfaces";
import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../di/types";

@injectable()
export class HostPropertyUseCase {
  constructor(
    @inject(TOKENS.IHostPropertyRepository)
    private readonly repo: IHostPropertyRepository,
  ) {}

  /** @deprecated Use step-based methods (stepCreateDraft → … → stepPublish). */
  async publishProperty(
    formData: IBecomeHostPropertyFormData,
    imageUrls: string[],
  ): Promise<{ propertyId: string }> {
    if (!imageUrls.length) {
      throw new Error("Add at least one photo before publishing.");
    }
    const created = await this.repo.onboardHost(formData, imageUrls);
    return { propertyId: created.id };
  }

  /** Step 1 — Create or update a DRAFT property. Pass propertyId to update an existing draft. */
  async stepCreateDraft(
    formData: Pick<
      IBecomeHostPropertyFormData,
      "title" | "description" | "propertyType"
    > & { propertyId?: string },
  ): Promise<{ propertyId: string; slug: string }> {
    if (!formData.title?.trim()) throw new Error("Title is required.");
    if (!formData.description?.trim())
      throw new Error("Description is required.");
    if (!formData.propertyType) throw new Error("Property type is required.");
    return this.repo.createDraft(formData);
  }

  /** Step 2 — Save location data. */
  async stepSaveLocation(
    propertyId: string,
    formData: IBecomeHostPropertyFormData,
  ): Promise<void> {
    if (!formData.addressLine1?.trim())
      throw new Error("Address line 1 is required.");
    if (!formData.city?.trim()) throw new Error("City is required.");
    if (!formData.country?.trim()) throw new Error("Country is required.");
    return this.repo.saveLocation({
      propertyId,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postalCode: formData.postalCode,
      latitude: formData.latitude,
      longitude: formData.longitude,
    });
  }

  /** Step 3 — Save pricing & policies. */
  async stepSavePricing(
    propertyId: string,
    formData: IBecomeHostPropertyFormData,
  ): Promise<void> {
    if (formData.basePrice <= 0)
      throw new Error("Base price must be positive.");
    if (formData.minNights > formData.maxNights) {
      throw new Error("Min nights cannot exceed max nights.");
    }
    if (formData.maxGuests <= 0)
      throw new Error("Max guests must be at least 1.");
    return this.repo.savePricing({
      propertyId,
      basePrice: formData.basePrice,
      currency: formData.currency,
      minNights: formData.minNights,
      maxNights: formData.maxNights,
      maxGuests: formData.maxGuests,
      checkInTime: formData.checkInTime,
      checkOutTime: formData.checkOutTime,
    });
  }

  /** Step 4 — Save amenities & rules. */
  async stepSaveAmenities(
    propertyId: string,
    formData: IBecomeHostPropertyFormData,
  ): Promise<void> {
    if (!formData.amenities?.length) {
      throw new Error("Select at least one amenity.");
    }
    return this.repo.saveAmenities({
      propertyId,
      amenities: formData.amenities,
      rules: formData.rules,
    });
  }

  /** Step 5 — Save photos with full metadata. */
  async stepSavePhotos(
    propertyId: string,
    images: IImageUploadMetadata[],
  ): Promise<void> {
    if (!images.length) throw new Error("Add at least one photo.");
    return this.repo.savePhotos({ propertyId, images });
  }

  /** Publish — transitions DRAFT → ACTIVE. */
  async stepPublish(
    propertyId: string,
  ): Promise<{ propertyId: string; slug: string }> {
    return this.repo.publishDraft({ propertyId });
  }

  /** Try to resume a previous draft session from the server. */
  async tryResumeDraft(): Promise<IOnboardingDraftResume | null> {
    return this.repo.resumeDraft();
  }

  /** Fetch full draft data for pre-filling the wizard on resume. */
  async getDraftDetails(
    propertyId: string,
  ): Promise<IBecomeHostPropertyFormData | null> {
    return this.repo.getDraftDetails(propertyId);
  }

  /** Fetch full property data for the edit page — works for both draft and published. */
  async getPropertyForEdit(
    propertyId: string,
  ): Promise<{ form: IBecomeHostPropertyFormData; imageMetadata: IImageUploadMetadata[] } | null> {
    return this.repo.getPropertyForEdit(propertyId);
  }
}
