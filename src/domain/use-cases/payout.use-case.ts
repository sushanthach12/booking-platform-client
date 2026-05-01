import type { IPayout, IPayoutRepository } from "@/domain/interfaces";
import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../di/types";

@injectable()
export class PayoutUseCase {
  constructor(
    @inject(TOKENS.IPayoutRepository)
    private readonly repo: IPayoutRepository,
  ) {}

  async getPayouts(params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    items: IPayout[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.repo.getPayouts(params);
  }

  async getUpcoming(): Promise<{
    amount: number;
    currency: string;
    scheduledDate: string;
  } | null> {
    return this.repo.getUpcoming();
  }
}
