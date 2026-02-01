import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../di/types';
import type { PropertyEntity, PropertySearchParams } from "../entities";
import type { IPropertyRepository } from "../interfaces";

@injectable()
export class PropertyUseCase {
  constructor(
    @inject(TOKENS.IPropertyRepository)
    private readonly propertyRepository: IPropertyRepository,
  ) {}

  async getProperties(): Promise<PropertyEntity[]> {
    return this.propertyRepository.getProperties();
  }

  async getPropertyById(id: string): Promise<PropertyEntity | null> {
    return this.propertyRepository.getPropertyById(id);
  }

  async searchProperties(params?: PropertySearchParams): Promise<PropertyEntity[]> {
    return this.propertyRepository.searchProperties(params);
  }
}
