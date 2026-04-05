import type { IBecomeHostPropertyFormData } from "@/domain/entities";

export interface IHostPropertyRepository {
  onboardHost(
    formData: IBecomeHostPropertyFormData,
    imageUrls: string[],
  ): Promise<{ id: string }>;
}
