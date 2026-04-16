import type { IWishlistRepository } from "@/domain/interfaces";
import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../di/types";

@injectable()
export class WishlistUseCase {
  constructor(
    @inject(TOKENS.IWishlistRepository)
    private readonly repo: IWishlistRepository,
  ) {}

  async getWishlist(params?: { page?: number; limit?: number }): Promise<unknown[]> {
    return this.repo.getWishlist(params);
  }

  async addToWishlist(propertyId: string): Promise<void> {
    return this.repo.addToWishlist(propertyId);
  }

  async removeFromWishlist(propertyId: string): Promise<void> {
    return this.repo.removeFromWishlist(propertyId);
  }
}
