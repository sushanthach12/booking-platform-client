import type { IHostPropertyRepository } from "@/domain/interfaces";
import type { IBecomeHostPropertyFormData } from "@/domain/entities";
import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../di/types";

@injectable()
export class HostPropertyUseCase {
  constructor(
    @inject(TOKENS.IHostPropertyRepository)
    private readonly repo: IHostPropertyRepository,
  ) {}

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
}
