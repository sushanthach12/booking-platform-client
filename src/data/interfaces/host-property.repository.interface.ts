import type { IBecomeHostPropertyFormData } from "@/domain/interfaces";

export interface IHostPropertyRepository {
  onboardHost(
    formData: IBecomeHostPropertyFormData,
    imageUrls: string[],
  ): Promise<{ id: string }>;
}
