import type {
  IAddPayoutAccountInput,
  IPayout,
  IPayoutAccount,
  IPayoutBalance,
  IPayoutEarnings,
  IPayoutRepository,
  IPayoutSummary,
  IPayoutUpcoming,
  IRequestPayoutResult,
} from "@/domain/interfaces";
import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../di/types";

@injectable()
export class PayoutUseCase {
  constructor(
    @inject(TOKENS.IPayoutRepository)
    private readonly repo: IPayoutRepository,
  ) {}

  async getPayouts(params?: { page?: number; limit?: number }): Promise<{
    items: IPayout[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.repo.getPayouts(params);
  }

  async getUpcoming(): Promise<IPayoutUpcoming | null> {
    return this.repo.getUpcoming();
  }

  async getAccounts(): Promise<IPayoutAccount[]> {
    return this.repo.getAccounts();
  }

  async addAccount(input: IAddPayoutAccountInput): Promise<IPayoutAccount> {
    return this.repo.addAccount(input);
  }

  async removeAccount(id: string): Promise<void> {
    return this.repo.removeAccount(id);
  }

  async setPrimaryAccount(id: string): Promise<IPayoutAccount> {
    return this.repo.setPrimaryAccount(id);
  }

  async getSummary(): Promise<IPayoutSummary> {
    return this.repo.getSummary();
  }

  async getEarnings(months?: number): Promise<IPayoutEarnings> {
    return this.repo.getEarnings(months);
  }

  async getBalance(): Promise<IPayoutBalance> {
    return this.repo.getBalance();
  }

  async requestPayout(): Promise<IRequestPayoutResult> {
    return this.repo.requestPayout();
  }
}
